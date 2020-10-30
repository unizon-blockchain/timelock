export const state = () => ({
  account: '',
  chainId: ''
})
export const mutations = {
  SET_ACCOUNT(state: any, account: any): void {
    state.account = account || ''
  },
  SET_CHAIN_ID(state: any, chainId: any): void {
    state.chainId = chainId || ''
  },
}
