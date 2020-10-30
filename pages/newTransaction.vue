<template>
  <div class="new-transaction">
    <ZonCard class="zon-card__header">
      <nuxt-link to="/">
        <div class="back-btn__body">
          <div class="back-btn__entry"></div>
          <span class="back-btn__text">{{ 'Back' }}</span>
        </div>
      </nuxt-link>
      <p></p>
    </ZonCard>
    <ZonCard>
      <a-table
        :columns="columns"
        :data-source="contractList"
        :pagination="false"
        :bordered="true"
        :row-key="(record) => record.name"
        :loading="loading"
      >
        <div slot="action" slot-scope="item">
          <a-button type="primary" @click="pushContractFunction(item)">{{
            'Queue'
          }}</a-button>
        </div>
      </a-table>
    </ZonCard>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Watch } from 'vue-property-decorator'
import { ITokenContract } from '~/timelock/interface'
import Contracts from '~/timelock/contracts'
import DataStorage from '~/timelock/dataStorage'

@Component
export default class Index extends Vue {
  private contractList: Array<ITokenContract> = []
  private dataStorage: DataStorage = new DataStorage()
  private loading: boolean = false

  private columns: Array<any> = [
    {
      title: 'Contract Name',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
      align: 'center'
    },
    {
      title: 'Contract Address',
      dataIndex: 'address',
      scopedSlots: { customRender: 'address' },
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      align: 'center'
    },
  ]

  created() {
    this.getContractList()
  }

  private getContractList() {
    const contracts: Contracts = new Contracts(this.$ethereumProvider.chainId)
    this.contractList = contracts.timelockContracs
    console.log('this.contractList', this.contractList)
  }

  private pushContractFunction(item: ITokenContract) {
    this.dataStorage.tempTokenContract = item
    this.$router.push({ path: `/tokenContract` })
  }

  private pushQueuedTransactions() {
    this.$router.push({ path: `/queue` })
  }
}
</script>

