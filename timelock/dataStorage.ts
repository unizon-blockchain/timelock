import { ITokenContract } from './interface';

class DataStorage {
    constructor() {

    }

    get tempTokenContract() : ITokenContract | null {
        const strTokenContract : string | null = window.localStorage.getItem('temp_token_contract');
        if(strTokenContract) {
            try{
                let res : ITokenContract = {};
                const data : any = JSON.parse(strTokenContract);
                res = {...data};

                return res;
            }
            catch(e) {
                return null;
            }
        }

        return null;
    }

    set tempTokenContract(value : ITokenContract | null)  {
        if(null == value) {
            window.localStorage.removeItem('temp_token_contract');
        }
        else {
            window.localStorage.setItem('temp_token_contract', JSON.stringify(value));
        }
    }
}

export default DataStorage;