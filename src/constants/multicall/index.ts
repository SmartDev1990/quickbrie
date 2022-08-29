import { ChainId } from '@smartdev1990/quick-sdk1';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
	[ChainId.MAINNET]: '0x3AFd2494833cbB234B363440E65BC2A171Dbb267',
	[ChainId.TESTNET]: '0x3AFd2494833cbB234B363440E65BC2A171Dbb267',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
