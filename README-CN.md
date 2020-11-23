# Unizon timelock admin

## 目标

Timelock已经成为高质量DeFi项目的标配，是治理体系不可或缺的一部分，通过Timelock接管/限制超级用户对系统参数的修改，一方面可以避免管理员作恶或者攻击者获取管理员权限后对系统造成严重破坏，另一方面也可以给用户以更大的权限，在用户不同意某些治理措施时有足够的时间提前行动，避免资产遭受损失。

目前业内普遍采纳了一个标准timelock合约，如同本项目所包含的，包括Compound、SushiSwap等项目均采用。但是，合约的使用与管理却没有一个比较简单、通行的方案，目前比较典型的有两类：一种是Sushiswap采用的简单查询方式，即把timelock合约所涉及的所有交易查询出来，按时间顺序展示，而不关心具体业务的操作逻辑。参见：https://sushi-timelock.txs.wtf/ 。另一种是与治理体系结合的比较完整的方式，如：Compound官网上展现的。

目前我们尚未看到一个完整的、面向timelock使用和管理的开源项目，能够帮助DeFi开发者快速使用和管理timelock。这种情况下，一个DeFi项目的管理者，想要有效使用timelock，会遇到两个主要的问题。一是要有相当的开发量，自己合约对应的所有函数都要自己来编写对应的timelock调用，开发工作量大，正确性难以有保障。二是如果参考sushiswap这种流水账式的组织方式，则无法从业务的角度去使用和管理timelock，比如：发起一个timelock交易修改平台的某个参数，并且在两天后timelock允许生效时对这个交易进行确认，这是一个典型的场景。但在Sushiswap这种原始的查询方式中，无法知道当前timelock中有哪些待执行交易、内容是什么，必须去浏览全部的，混杂在一起的各种交易（发起、确认、取消等），找到当初发起的交易再执行。

我们认为，一个有效的timelock管理框架，应当做到两点：一方面应当让项目通过配置的方式就可以将自己需要管理的方法交由timelock实现，无需大量的开发工作。另一方面数据组织形式应该更贴合业务逻辑，采用基于业务的组织方式，将QueueTransaction与ExecuteTransaction/CancelTransaction匹配、组织起来，简化管理员的工作。

这就是Unizon timelock Admin项目的来源。

## 功能简介

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

在项目根目录执行

```shell
yarn build
```
通过nginx/apache部署./dist目录即可

