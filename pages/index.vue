<template>
  <div class="p-index">
    <ZonCard class="zon-card__header">
      <template>
        <a-button
          type="primary"
          @click="connectWallet()"
          v-if="!$store.state.account"
          >{{ 'Connect Wallet' }}</a-button
        >
        <span v-else>Wallet Address: {{ $store.state.account }}</span>
      </template>
      <a-button type="primary" @click="pushNewTransaction()">{{
        'New Transaction'
      }}</a-button>
    </ZonCard>
    <ZonCard>
      <div class="p-index__list">
        <a-table
          :columns="columns"
          :data-source="transactions"
          :pagination="false"
          :bordered="true"
          :row-key="(record) => record.blockNumber"
          :x="true"
          :loading="loading"
        >
          <div slot="from" slot-scope="from">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ from }}</span>
              </template>
              <span>{{ from | addressFormat }}</span>
            </a-tooltip>
          </div>
          <div slot="time" slot-scope="item, record">
            {{ record.timestamp | parseLocalDateTime }}
          </div>
          <div slot="target" slot-scope="item, record">
            <p>{{ record.targetInfo }}</p>
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{
                  handleTargetAddress(record.decodedFunction.params, false)
                }}</span>
              </template>
              <p>
                {{ handleTargetAddress(record.decodedFunction.params) }}
              </p>
            </a-tooltip>
          </div>
          <div slot="method" slot-scope="item, record">
            <p>
              {{ handleMethod(record.decodedFunction.params) }}
            </p>
          </div>
          <div slot="status" slot-scope="item">
            <a-button
              type="link"
              @click="handleVisibleTransactionDetail(item)"
            >
              <span class="btn-link-text">{{ item.isQueued ? 'Pending' : 'Finished' }}</span>
            </a-button>
            <a-button
              type="link"
              @click="handleViewOnEtherScan(item)"
            >
              <span class="btn-link-text">{{ 'View on etherscan' }}</span>
            </a-button>            
          </div>
        </a-table>
      </div>
    </ZonCard>
    <TransactionDetail
      :visible.sync="visible"
      :item="transactionDetailItem"
    ></TransactionDetail>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Watch } from 'vue-property-decorator'
import {
  IABIFunction,
  ITokenContract,
  ITimelockTransaction,
} from '~/timelock/interface'
import Contracts from '~/timelock/contracts'
import DataStorage from '~/timelock/dataStorage'
import TimelockHelper from '~/timelock/timelock'
import { format } from 'date-fns'

interface DecodeParamsItem {
  name: string
  type: string
  value: string
}

@Component
export default class Index extends Vue {
  private contractList: Array<ITokenContract> = []
  private dataStorage: DataStorage = new DataStorage()
  private timelock: TimelockHelper = new TimelockHelper(this.$ethereumProvider)
  private transactions: Array<ITimelockTransaction> = []
  private loading: boolean = false

  private visible: boolean = false
  private transactionDetailItem: ITimelockTransaction = {}

  private columns: Array<any> = [
    {
      title: 'Tx Sender',
      dataIndex: 'from',
      align: 'center',
      scopedSlots: { customRender: 'from' },
    },
    {
      title: 'Target',
      dataIndex: 'target',
      align: 'center',
      scopedSlots: { customRender: 'target' },
    },
    {
      title: 'Method Signature',
      dataIndex: 'method',
      align: 'center',
      scopedSlots: { customRender: 'method' },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      align: 'center',
      scopedSlots: { customRender: 'time' },
    },
    {
      title: 'Status',
      key: 'isQueued',
      align: 'center',
      scopedSlots: { customRender: 'status' },
    },
  ]

  private created() {
    this.getTransactionList()
  }

  private handleTimestamp(time: number): string {
    return format(Number(time) * 1000, 'yyyy-mm-dd HH:mm:ss')
  }

  private handleTargetAddress(
    data: Array<DecodeParamsItem>,
    isFormat: boolean = true
  ): string {
    const item: Array<DecodeParamsItem> = data.filter(
      (item: DecodeParamsItem) => {
        return item.name === 'target'
      }
    )
    let res: string = item && item[0] && item[0].value ? item[0].value : ''
    if (res && isFormat) {
      const value = res
      res = this.$filter.addressFormat(value)
    }
    return res || ''
  }

  private handleMethod(data: Array<DecodeParamsItem>): string {
    const item: Array<DecodeParamsItem> = data.filter(
      (item: DecodeParamsItem) => {
        return item.name === 'signature'
      }
    )
    let res: string = item && item[0] && item[0].value ? item[0].value : ''
    res = res.replace(/ *\([^)]*\) */g, '')
    return res
  }

  private handleVisibleTransactionDetail(item: ITimelockTransaction) {
    this.transactionDetailItem = item
    this.visible = true
  }

  private handleViewOnEtherScan(item: ITimelockTransaction) {
    window.open(this.$getEtherScanUrl(item.hash));
  }

  private async connectWallet() {
    this.$useConnectWallet()
  }

  private async getTransactionList() {
    this.loading = true
    this.transactions = await this.timelock.getHistoryQueueTransactions()
    this.loading = false
  }

  private pushNewTransaction() {
    this.$router.push({ path: `/newTransaction` })
  }

  private pushQueuedTransactions() {
    this.$router.push({ path: `/queue` })
  }

  @Watch('$store.state.account', { immediate: false })
  private onChangeAccount(val: string) {
    val && this.getTransactionList()
  }
  @Watch('$store.state.chainId', { immediate: false })
  private onChangeChainId(val: string) {
    if (val) {
      this.timelock.setAddress()
      this.getTransactionList()
    }
  }
}
</script>

<style lang="scss" scoped>
.p-index {
  .p-index__list {
    box-sizing: border-box;
  }

  .btn-link-text {
    text-decoration: underline!important;
  }
}
</style>
