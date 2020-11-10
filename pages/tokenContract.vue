<template>
  <div class="p-contract">
    <ZonCard class="zon-card__header">
      <nuxt-link to="/newTransaction">
        <div class="back-btn__body">
          <div class="back-btn__entry"></div>
          <span class="back-btn__text">{{ 'Back' }}</span>
        </div>
      </nuxt-link>
      <p></p>
    </ZonCard>
    <ZonCard>
      <div class="token-contract-list">
        <div class="p-address">
          <span class="contract-name">{{tokenContract.name}}</span>{{tokenContract.address ? '| ' + tokenContract.address : '' }}
        </div>
        <template v-for="(item, index) in tokenContract.functions">
          <a-collapse :key="index" class="a-collapse">
            <a-collapse-panel key="1" :header="item.name">
              <div>
                <template v-for="(input, inputIndex) in item.inputs">
                  <div :key="inputIndex">
                    <h3>{{ input.name }}({{ input.type }})</h3>
                    <a-input
                      :placeholder="input.type"
                      v-model="input.inputValue"
                    ></a-input>
                  </div>
                </template>
                <a-button
                  :loading="isLoading"
                  type="primary"
                  class="write-btn"
                  @click="doQueue(item)"
                  :disabled="disabledQueue"
                  >{{ 'Queue' }}</a-button
                >
              </div>
            </a-collapse-panel>
          </a-collapse>
        </template>
      </div>
    </ZonCard>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Watch } from 'vue-property-decorator'
import { IABIFunction, ITokenContract } from '~/timelock/interface'
import TimelockHelper from '~/timelock/timelock'
import DataStorage from '~/timelock/dataStorage'
import { delay_offset } from '~/timelock/constants'
import ethers from 'ethers'
import ErrorHelper from '~/timelock/error'

@Component
export default class Index extends Vue {
  private tokenContract: ITokenContract | null = {}
  private timelock!: TimelockHelper ;
  private dataStorage: DataStorage = new DataStorage()
  private isLoading: boolean = false
  private disabledQueue: boolean = true

  private created() {
    this.timelock = new TimelockHelper(this.$ethereumProvider)
    this.tokenContract = this.dataStorage.tempTokenContract
    this.getAdminAddress()
  }

  private async getAdminAddress() {
    const res: any = await this.timelock.getAdminAddress()
    if (!res) {
      return
    }
    this.disabledQueue = res.toLowerCase() !== this.$store.state.account.toLowerCase()
  }

  private parseInputParams(inputs: any): Array<any> {
    let res: Array<any> = []
    for (let i = 0; i < inputs.length; i++) {
      if ('uint256' == inputs[i].type) {
        res.push(ethers.BigNumber.from('' + inputs[i].inputValue))
      } else if ('bool' == inputs[i].type) {
        res.push('true' == inputs[i].inputValue ? true : false)
      } else {
        res.push(inputs[i].inputValue)
      }
    }

    return res
  }

  private parseInputTypes(inputs: any): Array<any> {
    let res: Array<any> = []
    for (let i = 0; i < inputs.length; i++) {
      res.push(inputs[i].type)
    }
    return res
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

  private doQueue(item: IABIFunction) {
    if (this.disabledQueue) {
      return
    }
    ;(async () => {
      const account: string | null = await this.timelock.connect()
      if (account) {
        this.isLoading = true
        let params: Array<any> = this.parseInputParams(item.inputs)
        let types: Array<any> = this.parseInputTypes(item.inputs)
        const data: any = this.timelock.abiEncode(types, params)
        let timestamp: number = await this.timelock.getTimestamp()
        let delay: number = await this.timelock.getDelay()
        timestamp = timestamp + delay + delay_offset
        const txParams: Array<any> = [
          this.tokenContract ? this.tokenContract.address : '',
          0,
          item.signature,
          data,
          timestamp,
        ];
        try {
          const tx = await this.timelock.queueTransaction(txParams)
          await this.txWait(tx)
        } catch (e) {
          this.isLoading = false
          this.$message.warn(ErrorHelper.parse(e))
        }
      }
    })().catch((error) => {
      this.isLoading = false
      this.$message.warn(ErrorHelper.parse(error));
    })
  }
}
</script>

<style lang="scss" scoped>
.p-address {
  margin-bottom: 12px;
}
.a-collapse {
  margin-bottom: 12px;
}
.p-contract {
  .write-btn {
    margin-top: 12px;
  }
}
.token-contract-list {
  box-sizing: border-box;
  padding: 12px;
}
.contract-name {
  font-weight: 600;
  margin-right: 6px;
  font-size: 16px;
}
</style>