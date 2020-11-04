import Vue from 'vue';
import EthereumProvider from '~/timelock/provider';

declare module 'vue/types/vue' {
  interface Vue {
    $useEthereumProvider(callback: any): void;
    $ethereumProvider: EthereumProvider;
    $useConnectWallet(): void;
    $getEtherScanUrl(txHash: any): string;
  }
}

let ethereumProvider: EthereumProvider;

export default ({ app, store }: any) => {
  if ('undefined' === typeof ethereumProvider) {
    ethereumProvider = new EthereumProvider();
  }

  async function useConnectWallet() {
    const account: string | null = await ethereumProvider.connect();
    store.commit('SET_ACCOUNT', account);
  }

  Vue.prototype.$useConnectWallet = useConnectWallet;

  Vue.prototype.$useEthereumProvider = async function (callback: any) {
    try {
      ethereumProvider.monitor({
        accountChanged: async (account: any) => {
          store.commit('SET_ACCOUNT', account);
          callback();
        },
        chainChanged: async (chainId: any) => {
          store.commit('SET_CHAIN_ID', chainId);
          callback();
        },
      });

      Vue.prototype.$ethereumProvider = ethereumProvider;

      useConnectWallet();
    } catch (e) {}
  }

  Vue.prototype.$getEtherScanUrl = function(txHash: any): string {
    let res : string = `https://etherscan.io/tx/${txHash}`;
    
    if(3 == ethereumProvider.chainId) {
      res = `https://ropsten.etherscan.io/tx/${txHash}`;
    }
    if(4 == ethereumProvider.chainId) {
      res = `https://rinkeby.etherscan.io/tx/${txHash}`;
    }
    if(42 == ethereumProvider.chainId) {
      res = `https://kovan.etherscan.io/tx/${txHash}`;
    }

    return res;
  }

 
};
