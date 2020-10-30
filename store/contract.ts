import { ITokenContract } from '~/timelock/interface';

export const state = () => ({
    tokenContract: {}
})
  
export const mutations = {
    SET_TOKEN_CONTRACT(state: any, value: ITokenContract)  {
        state.tokenContract = { ...value };
    }
}