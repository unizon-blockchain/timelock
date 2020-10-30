<template>
  <ZonModal
    :visible.sync="visible"
    :title="''"
    :footer="false"
    @close="handleClose"
    :width="$store.state.isDevicePC ? '890px' : '50%'"
    :confirm-loading="false"
    :confirm-disabled="false"
    class="transaction-detail-modal"
  >
    <template v-if="item.decodedFunction">
      <div
        class="transaction-detail-modal__card"
        v-if="
          item.hasOwnProperty('executeOrCancelTransaction') &&
          item.executeOrCancelTransaction
        "
      >
        <p class="card-title">
          {{ item.executeOrCancelTransaction.decodedFunction.name }}
        </p>
        <div>
          <span class="block-number"> Block Number:
            {{ item.executeOrCancelTransaction.blockNumber }}</span
          >
          |
          <span>
            {{ item.executeOrCancelTransaction.timestamp | parseLocalDateTime }}
          </span>
        </div>

        <a-table
          class="params-table"
          :columns="columns"
          :data-source="item.executeOrCancelTransaction.decodedFunction.params"
          :pagination="false"
          :bordered="false"
          :row-key="(record) => record.name"
        >
        </a-table>
      </div>
      <div class="transaction-detail-modal__card">
        <p class="card-title">{{ item.decodedFunction.name }}</p>
        <div>
          <span class="block-number">Block Number: {{ item.blockNumber }}</span> |
          <span> {{ item.timestamp | parseLocalDateTime }} </span>
        </div>

        <a-table
          class="params-table"
          :columns="columns"
          :data-source="item.decodedFunction.params"
          :pagination="false"
          :bordered="false"
          :row-key="(record) => record.name"
        >
        </a-table>
      </div>
      <div
        v-if="item.hasOwnProperty('isQueued') && item.isQueued"
        class="transaction-detail-modal__action"
      >
        <a-button
          :loading="isLoading"
          type="primary"
          class="write-btn"
          @click="doCancel(item)"
          >{{ 'Cancel Transaction' }}</a-button
        >
        <a-button
          :loading="isLoading"
          type="primary"
          class="write-btn"
          @click="doExecute(item)"
          >{{ 'Execute Transaction' }}</a-button
        >
      </div>
    </template>
  </ZonModal>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IABIFunction, ITokenContract } from '~/timelock/interface'
import TimelockHelper from '~/timelock/timelock'
import DataStorage from '~/timelock/dataStorage'
import { ITimelockTransaction } from '~/timelock/interface'
import ErrorHelper from '~/timelock/error'

@Component({
  name: 'TransactionDetail',
})
export default class Index extends Vue {
  private timelock: TimelockHelper = new TimelockHelper(this.$ethereumProvider)
  private dataStorage: DataStorage = new DataStorage()
  private transactions: Array<any> = []
  private activeKey: any = ''
  private isLoading: boolean = false

  @Prop({ default: false, required: true }) private visible!: boolean
  @Prop({ default: '40%', required: false }) private width!: string | number
  @Prop({ default: {}, required: false }) private item!: any

  private columns: Array<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      scopedSlots: { customRender: 'value' },
    },
  ]

  private mounted() {

  }

  private handleClose(): void {
    this.$emit('update:visible', false)
    this.$emit('close')
  }

  private async txWait(tx: any) {
    const receipt: any = await tx.wait()
    if (
      receipt.confirmations > 0 &&
      (receipt.status || receipt.status == '0x1')
    ) {
      this.isLoading = false
    } else {
      this.txWait(tx)
    }
  }

  private doExecute(item: any) {
    ;(async () => {
      this.isLoading = true
      const target: any = item.decodedFunction.params[0].value
      const value: any = item.decodedFunction.params[1].value
      const signature: any = item.decodedFunction.params[2].value
      const funcData: any = item.funcData
      const eta: any = item.decodedFunction.params[4].value

      const account: string | null = await this.timelock.connect()
      if (account) {
        const txParams: Array<any> = [target, value, signature, funcData, eta]
        try {
          const tx = await this.timelock.executeTransaction(txParams)
          await this.txWait(tx)
        } catch (e) {
          this.isLoading = false
          this.$message.warn(ErrorHelper.parse(e))
        }
      }
    })().catch((error) => {
      console.log('error', error);
      this.isLoading = false
      this.$message.warn(ErrorHelper.parse(error))
    })
  }

  private doCancel(item: any) {
    ;(async () => {
      this.isLoading = true
      const target: any = item.decodedFunction.params[0].value
      const value: any = item.decodedFunction.params[1].value
      const signature: any = item.decodedFunction.params[2].value
      const funcData: any = item.funcData
      const eta: any = item.decodedFunction.params[4].value

      const account: string | null = await this.timelock.connect()
      if (account) {
        const txParams: Array<any> = [target, value, signature, funcData, eta]
        try {
          const tx = await this.timelock.cancelTransaction(txParams)
          await this.txWait(tx)
        } catch (e) {
          this.isLoading = false
          this.$message.warn(ErrorHelper.parse(e))
        }
      }
    })().catch((error) => {
      this.isLoading = false
      this.$message.warn(ErrorHelper.parse(error))
    })
  }
}
</script>

<style lang="scss" scoped>
div,
p {
  margin: 0;
  padding: 0;
}
.a-collapse {
  margin-bottom: 48px;
}
.a-collapse {
  margin-bottom: 12px;
}
.transaction-detail-modal__action {
  text-align: left;

  .write-btn {
    min-width: 20%;
    margin: 12px 24px 0 0;
    height: 32px;
  }
}

.transaction-detail-modal__card {
  margin-bottom: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 12px 2px #f1f1f1;

  &:last-child {
    margin-bottom: 0;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    box-sizing: border-box;
    padding: 6px 12px;
    border: 1px solid #eee;
    border-bottom-right-radius: 8px;
    margin-bottom: 12px;
    background-color: #eeeeee;
  }
}

.params-table {
  margin-bottom: 20px;
}

.block-number {
  padding-left: 12px;
}
</style>