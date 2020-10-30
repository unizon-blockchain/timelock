# Unizon timelock admin
通用的timelock管理DAPP，通过修改配置文件即可实现timelock交易展示、queueTransaction、executeTransaction、cancelTransaction功能

修改/timelock/constants.ts文件更改配置文件（本配置以compound为例）：

```javascript
/**
* timelock管理的合约地址，本配置以compound为例
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
* timelock管理的合约所对应的abi文件, abi文件需拷贝至/timelock/abi目录
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
* timelock合约地址, 分别为mainnet和ropsten,其中主网为compound timelock 合约地址
*/
export const timelock_address : any = {
  1: '0x6d903f6003cca6255D85CcA4D3B5E5146dC33925',
  3: '0x4168FE8179C5e99074068244413909F40c4301B2'
}

/**
* timelock管理的合约需要执行queueTransaction的函数列表
*/

export const queue_functions : any = {
  'unitroller': ['_acceptAdmin', '_setPendingAdmin', '_setPendingImplementation'],
  'comptroller': ['_become', '_setBorrowPaused', '_setMiningBuff', '_setCompRate', '_setMintPaused', '_supportMarket', '_dropCompMarket', '_setPriceOracle', '_setCollateralFactor'],
  'cToken1': ['_acceptAdmin', '_setReserveFactor'],
  'cToken2': ['_acceptAdmin', '_setReserveFactor'],
  'cTokenn': ['_acceptAdmin', '_setReserveFactor']
}

```
## 运行及部署

### 运行：

在项目根目录执行

```shell
yarn
yarn dev
```

### 部署：

在项目更目录执行

```shell
yarn build
```
通过nginx/apache部署./dist目录即可

