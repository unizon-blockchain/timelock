import { contract_address, queue_functions, contract_abi_file } from './constants';
import { IABIFunction, ITokenContract } from './interface';

class Contracts {
    private contractsObject: any;
    constructor(chainId: number) {
        if(!contract_address.hasOwnProperty(chainId)) {
            throw new Error(`Don\'t support the current network ${chainId}`);
        }
        this.contractsObject = contract_address[chainId];
    }

    private parseSignature(abiFunc: any) {
        let inputType : Array<string> = [];
        for(let i = 0; i < abiFunc.inputs.length; i++) {
            inputType.push(abiFunc.inputs[i].type);
        }

        return `${abiFunc.name}(${inputType.join(',')})`;
    }

    private parseFunctions(abi: any, functions: Array<any>) {
        let parsedFunctions : Array<IABIFunction> = [];
        for(let i = 0; i < functions.length; i++) {

            let abiFunctionObjList : Array<any> = abi.filter((abiItem: any) => {
                return functions[i] == abiItem.name && 'function' == abiItem.type;
            });

            if(abiFunctionObjList.length > 0) {
                const abiFunctionObj : any = abiFunctionObjList[0];
                let abiFunction: IABIFunction = {
                    name: abiFunctionObj.name,
                    inputs: abiFunctionObj.inputs,
                    signature: this.parseSignature(abiFunctionObj),
                
                    abi: abiFunctionObj,
                    inputValue: ''
                };
    
                parsedFunctions.push(abiFunction);
            }
        }

        return parsedFunctions;
    }

    get timelockContracs() : Array<ITokenContract> {
        let res : Array<ITokenContract> = [];
        for(let key in this.contractsObject) {
            let tokenContract : ITokenContract = {
                name: key,
                address: this.contractsObject[key]
            }
            const abiFileName : string = contract_abi_file[key];
            const abi = require(`~/timelock/abi/${abiFileName}`);
            const functions : Array<any> = queue_functions[key];
            tokenContract.functions = this.parseFunctions(abi, functions);
            
            res.push(tokenContract);
        }
        return res;
    }
}

export default Contracts;