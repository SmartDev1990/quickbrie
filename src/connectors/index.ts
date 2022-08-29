import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { WalletLinkConnector } from './WalletLink';
import { PortisConnector } from './Portis';

import { NetworkConnector } from './NetworkConnector';
import { SafeAppConnector } from './SafeApp';

const POLLING_INTERVAL = 12000;

const NETWORK_URL = 'https://serverrpc.com';
// const FORMATIC_KEY = 'pk_live_F937DF033A1666BF'
// const PORTIS_ID = 'c0e2bf01-4b08-4fd5-ac7b-8e26b58cd236'
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID;

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');

if (typeof NETWORK_URL === 'undefined') {
	throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`);
}

export const network = new NetworkConnector({
	urls: { [Number('32520')]: NETWORK_URL },
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
	return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
	supportedChainIds: [32520, 80001],
});

export const safeApp = new SafeAppConnector();

// mainnet only
export const walletconnect = new WalletConnectConnector({
	rpc: { 32520: NETWORK_URL },
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
});

// mainnet only
export const portis = new PortisConnector({
	dAppId: PORTIS_ID ?? '',
	networks: [32520],
	config: {
		nodeUrl: NETWORK_URL,
		chainId: 32520,
	},
});

// mainnet only
export const walletlink = new WalletLinkConnector({
	url: NETWORK_URL,
	appName: 'Uniswap',
	appLogoUrl:
		'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
	supportedChainIds: [32520],
});

export const ledger = new LedgerConnector({
	chainId: 32520,
	url: NETWORK_URL,
	pollingInterval: POLLING_INTERVAL,
});
