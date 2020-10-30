declare const ethereum: any

export async function accountsChanged(cb: Function) {
  if (ethereum.isImToken) {
    return
  }
  ethereum.on('accountsChanged', (accounts: any) => {
    cb(accounts.length > 0 ? accounts[0] : null)
  })
}

export async function chainChanged(cb: Function) {
  if (ethereum.isImToken) {
    return
  }
  ethereum.on('chainChanged', (chainId: string | number) => {
    cb(chainId)
  })
}
