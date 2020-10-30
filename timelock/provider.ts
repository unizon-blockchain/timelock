import { accountsChanged, chainChanged } from '~/timelock/wallet'
import BigNumber from 'bignumber.js';

declare var ethereum: any;

class EthereumProvider {
    constructor() {
        if(ethereum && ethereum.isMetaMask) {
          console.log('ethereum provider init...');
        }
        else {
            throw new Error('Don\'t support then current ethereum wallet.');
        }
    }

    async connect(): Promise<string | null> {
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
        });
        return accounts.length > 0 ? accounts[0] : null;
    }

    monitor(options: any) {
        accountsChanged((account: string | null) => {
          if ('function' == typeof options.accountChanged) {
            options.accountChanged(account)
          }
        })
        chainChanged((chainId: string | number) => {
          chainId = new BigNumber(chainId).toNumber()
          if ('function' == typeof options.chainChanged) {
            options.chainChanged(chainId)
          }
        })
      }

    get provider() : any {
        return ethereum;
    }

    get chainId() : number {
        const res : any = new BigNumber(ethereum.chainId);
        return res.toNumber();
    }
}

export default EthereumProvider;