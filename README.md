# Unizon timelock admin
Through the Timelock admin dapp interface, editing these settings below can allow for timelocked transactions via the queueTransaction, executeTransaction, and cancelTransaction functions.

Please edit the /timelock/constants.ts file for the contract you wish to support - the original settings are designed for compound as an example


```javascript
/**
* Timelock admin smart contract address
*/
export const contract_address : any = {
  3: {
      'unitroller': '0x52Ab60E7F463B73C6A90ee116dBB18ac61DC63FF',
      'comptroller': '0x52Ab60E7F463B73C6A90ee116dBB18ac61DC63FF',
      'cToken1': '',
      'cToken2': '',
      'cTokenn': ''
     },
  1: {
      'unitroller': '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
      'comptroller': '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
      'cToken1': '',
      'cToken2': '',
      'cTokenn': ''
    }
}

/**
* all abi’s that the timelock admin contract interacts with (/timelock/abi)
*/

export const contract_abi_file : any = {
  'unitroller': 'unitroller-abi.json',
  'comptroller': 'comptroller-abi.json',
  'cToken1': 'cToken-abi.json',
  'cToken2': 'cToken-abi.json',
  'cTokenn': 'cToken-abi.json'
}

/**
* deplay Offset, unit: seconds
*/
export const delay_offset = 300;

/**
* timelock contract address dictionary for mainnet and ropsten (add other chains if necessary, compound addresses * added as example)
*/
export const timelock_address : any = {
  1: '0x6d903f6003cca6255D85CcA4D3B5E5146dC33925',
  3: '0x4168FE8179C5e99074068244413909F40c4301B2'
}

/**
* Timelock admin contact requires the execution of the queueTransaction function using the specified parameters
*/

export const queue_functions : any = {
  'unitroller': ['_acceptAdmin', '_setPendingAdmin', '_setPendingImplementation'],
  'comptroller': ['_become', '_setBorrowPaused', '_setMiningBuff', '_setCompRate', '_setMintPaused', '_supportMarket', '_dropCompMarket', '_setPriceOracle', '_setCollateralFactor'],
  'cToken1': ['_acceptAdmin', '_setReserveFactor'],
  'cToken2': ['_acceptAdmin', '_setReserveFactor'],
  'cTokenn': ['_acceptAdmin', '_setReserveFactor']
}

```
## Run and deploy

### Run：

Execute in the project root directory

```shell
yarn
yarn dev
```

### Deploy：

Execute in the project root directory

```shell
yarn build
```
Deploy the ./dist directory through nginx/apache

## Support Languages

### [CN](./README-CN.md)

