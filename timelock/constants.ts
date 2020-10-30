/**
 * timelock contract address
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
 * contract abi file name
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
 * Current timelock address
 */
export const timelock_address : any = {
    1: '0x6d903f6003cca6255D85CcA4D3B5E5146dC33925',  
    3: '0x4168FE8179C5e99074068244413909F40c4301B2'
}

/**
 * contract timelock queue transaction functions
 */
export const queue_functions : any = {
    'unitroller': ['_acceptAdmin', '_setPendingAdmin', '_setPendingImplementation'],
    'comptroller': ['_become', '_setBorrowPaused', '_setMiningBuff', '_setCompRate', '_setMintPaused', '_supportMarket', '_dropCompMarket', '_setPriceOracle', '_setCollateralFactor'],
    'cToken1': ['_acceptAdmin', '_setReserveFactor'],
    'cToken2': ['_acceptAdmin', '_setReserveFactor'],
    'cTokenn': ['_acceptAdmin', '_setReserveFactor']
}

