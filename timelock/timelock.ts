import EthereumProvider from './provider';
import ethers from 'ethers';
import timelockAbi from './abi/timelock-abi.json';
import { ITimelockTransaction } from './interface';
import { timelock_address, contract_address, contract_abi_file} from './constants'

const abiDecoder = require('abi-decoder')

abiDecoder.addABI(timelockAbi);

function useAbiDecoder() {
  let contractFileNameList : Array<any> = [];
  for(let key in contract_abi_file) {
    contractFileNameList.push(contract_abi_file[key]);
  }

  contractFileNameList = Array.from(new Set(contractFileNameList));
  for(let i = 0;i < contractFileNameList.length; i++ ) {
    const abiFileName : string = contractFileNameList[i];
    const abi = require(`~/timelock/abi/${abiFileName}`);
    abiDecoder.addABI(abi);
  }
}

useAbiDecoder();

const specialFunctionNames = [
  "queueTransaction",
  "cancelTransaction",
  "executeTransaction",
];

class TimelockHelper {
  private ethereumProvider: EthereumProvider;
  private account: string | null = '';
  private address: string = '';
  private contractAddress: any = {};

  constructor(ethereumProvider:  EthereumProvider) {
      this.ethereumProvider = ethereumProvider;
      this.setAddress()
  }

  async connect() {
      this.account = await this.ethereumProvider.connect();
      return this.account;
  }

  setAddress() {
    this.address = timelock_address[this.ethereumProvider.chainId];
    this.contractAddress = contract_address[this.ethereumProvider.chainId];
  }

  private trx(method: string, params: Array<any>) {
    return new Promise(async (resolve, reject) => {
        const provider = new ethers.providers.Web3Provider(this.ethereumProvider.provider).getSigner();
        const contract = new ethers.Contract(this.address, timelockAbi, provider);

        contract[method].apply(null, params).then((result : any) => {
          resolve(result);
        }).catch((error: any) => {
          reject({
            message: 'Error occurred during [eth_sendTransaction]. See {error}.',
            error,
            method,
            params,
          });
        });
    });
  }

  private qrx(method: string, params: Array<any>) {
    return new Promise(async (resolve, reject) => {
      const provider = new ethers.providers.Web3Provider(this.ethereumProvider.provider).getSigner();
      const contract = new ethers.Contract(this.address, timelockAbi, provider);

      contract.callStatic[method].apply(null, params).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject({
          message: 'Error occurred during [eth_call]. See {error}.',
          error,
          method,
          params,
        });
      }); 

    });
  }

  async queueTransaction(params: Array<any>) {
    return await this.trx('queueTransaction', params);
  }

  async executeTransaction(params: Array<any>) {
    return await this.trx('executeTransaction', params);
  }

  async cancelTransaction(params: Array<any>) {
    return await this.trx('cancelTransaction', params);
  }

  abiEncode(types: Array<any>, params: Array<any>) {
    return ethers.utils.defaultAbiCoder.encode(types, params);
  }

  async getDelay() : Promise<number> {
    const delay : any = await this.qrx('delay', []);
    return delay.toNumber();
  }

  async getTimestamp() : Promise<number> {
    const provider = new ethers.providers.Web3Provider(this.ethereumProvider.provider);
    const block : any = await provider.getBlock('latest');
    return block.timestamp; 
  }

  async queuedTransactions(txHash: any) {
    return await this.qrx('queuedTransactions', [txHash]);
  }

  async getHistoryTransactions() {

    var getTargetKey = function(contractAddress: any, target: any) {
      let res = '';
      for(let key in contractAddress) {
        if(contractAddress.hasOwnProperty(key)) {
          let value = contractAddress[key].toLowerCase();
          if(value == target.toLowerCase()) {
            res = key;
            break;
          }
        }
      }
      return res;
    }

    const etherscanProvider = new ethers.providers.EtherscanProvider(this.ethereumProvider.chainId);
    const history = await etherscanProvider.getHistory(this.address);
    let newest = history.slice(1).reverse();
    
    const decoded = newest.map(
      ({ data, from, blockNumber, timestamp, hash }) => {

        let item: ITimelockTransaction = {data, from, blockNumber, timestamp, hash};
        if('undefined' === typeof data || '0x' == data) {
          item.txData = '';
          item.txDataHash = '';   
          item.funcData = '0x' ;
          item.targetInfo = '';
          item.decodedFunction = {};
          return item;
        }
        else {
          const decodedFunction = abiDecoder.decodeMethod(data);
          if (specialFunctionNames.includes(decodedFunction.name)) {
            // target, value, signature, data, eta
            try{
              const txData = this.abiEncode(['address','uint256','string','bytes','uint256'], [decodedFunction.params[0].value, decodedFunction.params[1].value, decodedFunction.params[2].value, null == decodedFunction.params[3].value ? '0x' : decodedFunction.params[3].value, decodedFunction.params[4].value]);
              const txDataHash = ethers.utils.keccak256(txData);
  
              item.txData = txData;
              item.txDataHash = txDataHash;
            }
            catch(e) {
              item.txData = '';
              item.txDataHash = '';    
            }
            const funcData = decodedFunction.params[3].value;
            item.funcData = null == funcData ? '0x' : funcData;
  
            if(null !== funcData) {
              let decodedData = abiDecoder.decodeMethod(funcData);
  
              if('undefined' == typeof decodedData)  { 
                const signature = decodedFunction.params[2].value;
                const functionParams = signature
                  .split("(")[1]
                  .split(")")[0]
                  .split(",");
                decodedData = ethers.utils.defaultAbiCoder.decode(
                  functionParams,
                  funcData
                );  
                decodedFunction.params[3].value = decodedData.length == 0 ? [] : "[" + decodedData.map((x : any) => x.toString()).join(", ") + "]";
              }
              else {
                decodedFunction.params[3].value = decodedData.params.map ((_data: any) => {
                  return _data.value;
                });
              }
  
              const target = decodedFunction.params[0].value;
              item.targetInfo = getTargetKey(this.contractAddress, target);
            }
  
            item.decodedFunction = decodedFunction;
            return item;
          }

        }

        return item;
      }
    );   
    return decoded;
  }

  queuedTransaction(tx: ITimelockTransaction) {
    return new Promise(async (resolve) => {
      const isTxQueued : any = '' == tx.txDataHash ? true : await this.queuedTransactions(tx.txDataHash);
      tx.isQueued = isTxQueued;
      resolve(tx);
    });
  }

  getHistoryTransactionsWithQueuedStatus(): Promise<Array<ITimelockTransaction>> {
    return new Promise(async (resolve, reject) => {
      const historyTxList : Array<ITimelockTransaction> = await this.getHistoryTransactions();
      let queuedTxList : Array<any> = [];
      for(let i = 0; i < historyTxList.length; i++) {
        
        const tx = historyTxList[i];
        queuedTxList.push(this.queuedTransaction(tx));
      }
      Promise.all(queuedTxList).then(res => {
        resolve(res);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  getHistoryQueueTransactions(): Promise<Array<ITimelockTransaction>> {
    return new Promise(async (resolve, reject) => {
      try{
        const historyTransactionList : Array<ITimelockTransaction> = await this.getHistoryTransactionsWithQueuedStatus();
        let historyQueueTransactionList : Array<ITimelockTransaction> = historyTransactionList.filter((tx: ITimelockTransaction) => {
          return 'queueTransaction' === tx.decodedFunction.name;
        });
  
        const historyExecuteOrCancelTransactionList : Array<ITimelockTransaction> = historyTransactionList.filter((tx: ITimelockTransaction) => {
          return 'queueTransaction' !== tx.decodedFunction.name;
        });
  
        historyQueueTransactionList = historyQueueTransactionList.map((tx: ITimelockTransaction) => {
          const executeOrCancelTransactionList : Array<ITimelockTransaction> = historyExecuteOrCancelTransactionList.filter((_tx: ITimelockTransaction) => {
            return tx.txDataHash == _tx.txDataHash;
          });
          if(executeOrCancelTransactionList.length > 0) {
            tx.executeOrCancelTransaction = executeOrCancelTransactionList[0];
          }
          return tx;
        });

        resolve(historyQueueTransactionList);
      }
      catch(error) {
        reject(error);
      }
    });
  }

  async getAdminAddress(): Promise<any> {
    const address: any = await this.trx('admin', []);
    return address
  }

}

export default TimelockHelper;