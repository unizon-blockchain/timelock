export interface IABIFunction {
    signature?: string;
    name?: string;
    inputs?: Array<any>;
    abi?: any;
    inputValue?: any;
}

export interface ITokenContract {
    name?: string;
    address?: string;
    functions?: Array<IABIFunction>;
}

export interface ITimelockTransaction {
    data?:string;
    txData?: string;
    txDataHash?: string;
    funcData?: string;
    from?: string;
    blockNumber?: number;
    timestamp?: any;
    hash?: string;
    decodedFunction?: any;
    isQueued?: any;
    targetInfo?: any;
    executeOrCancelTransaction?: ITimelockTransaction;
}