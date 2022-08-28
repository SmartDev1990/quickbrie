import { ChainId, JSBI, Percent, Token, WETH } from '@smartdev1990/quick-sdk1';
import { AbstractConnector } from '@web3-react/abstract-connector';
import {
  injected,
  walletconnect,
  walletlink,
  portis,
  safeApp,
} from '../connectors';
import MetamaskIcon from 'assets/images/metamask.png';
import BlockWalletIcon from 'assets/images/blockwalletIcon.svg';
import cypherDIcon from 'assets/images/cypherDIcon.png';
import BitKeepIcon from 'assets/images/bitkeep.png';
import CoinbaseWalletIcon from 'assets/images/coinbaseWalletIcon.svg';
import WalletConnectIcon from 'assets/images/walletConnectIcon.svg';

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WETH[ChainId.TESTNET]],
};

// TODO: Remove this constant when supporting multichain
export const MAINNET_CHAIN = ChainId.MAINNET;

export enum TxnType {
  SWAP,
  ADD,
  REMOVE,
}

export const GlobalConst = {
  blacklists: {},
  addresses: {
    ROUTER_ADDRESS: {
      [ChainId.MAINNET]: '0x5635149e37007885017eb8c92EfD79F02747b1dF',
    },
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    LAIR_ADDRESS: '',
    NEW_LAIR_ADDRESS: '',
    QUICK_ADDRESS: '',
    NEW_QUICK_ADDRESS: '',
    FACTORY_ADDRESS: '0xb5AFBC6F9CC06a3CC3403eCae0957E153c7dad5C',
    GOVERNANCE_ADDRESS: '', //TODO: MAINNET
    MERKLE_DISTRIBUTOR_ADDRESS: {
      // TODO: specify merkle distributor for mainnet
      [ChainId.MAINNET]: '', //TODO: MAINNET
    },
    QUICK_CONVERSION: '',
  },
  utils: {
    QUICK_CONVERSION_RATE: 1000,
    ONEDAYSECONDS: 60 * 60 * 24,
    DQUICKFEE: 0.04,
    DQUICKAPR_MULTIPLIER: 0.01,
    ROWSPERPAGE: 10,
    FEEPERCENT: 0.003,
    BUNDLE_ID: '1',
    PROPOSAL_LENGTH_IN_DAYS: 7, // TODO this is only approximate, it's actually based on blocks
    NetworkContextName: 'NETWORK',
    INITIAL_ALLOWED_SLIPPAGE: 50, // default allowed slippage, in bips
    DEFAULT_DEADLINE_FROM_NOW: 60 * 20, // 20 minutes, denominated in seconds
    BIG_INT_ZERO: JSBI.BigInt(0),
    ONE_BIPS: new Percent(JSBI.BigInt(1), JSBI.BigInt(10000)), // one basis point
    BIPS_BASE: JSBI.BigInt(10000),
    // used to ensure the user doesn't send so much ETH so they end up with <.01
    MIN_ETH: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)), // .01 ETH
    BETTER_TRADE_LINK_THRESHOLD: new Percent(
      JSBI.BigInt(75),
      JSBI.BigInt(10000),
    ),
    // the Uniswap Default token list lives here
    // we add '' to remove the possibility of nulls
    DEFAULT_TOKEN_LIST_URL: process.env.REACT_APP_TOKEN_LIST_DEFAULT_URL + '',
    DEFAULT_LP_FARMS_LIST_URL:
      process.env.REACT_APP_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_DUAL_FARMS_LIST_URL:
      process.env.REACT_APP_DUAL_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_SYRUP_LIST_URL: process.env.REACT_APP_SYRUP_LIST_DEFAULT_URL + '',
    ANALYTICS_TOKENS_COUNT: 200,
    ANALYTICS_PAIRS_COUNT: 400,
  },
  analyticChart: {
    ONE_MONTH_CHART: 1,
    THREE_MONTH_CHART: 2,
    SIX_MONTH_CHART: 3,
    ONE_YEAR_CHART: 4,
    ALL_CHART: 5,
    CHART_COUNT: 60, //limit analytics chart items not more than 60
  },
  farmIndex: {
    LPFARM_INDEX: 0,
    DUALFARM_INDEX: 1,
  },
  walletName: {
    METAMASK: 'Metamask',
    INJECTED: 'Injected',
    WALLET_CONNECT: 'WalletConnect',
  },
};

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: GlobalConst.walletName.METAMASK,
    iconName: MetamaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  INJECTED: {
    connector: injected,
    name: GlobalConst.walletName.INJECTED,
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: GlobalConst.walletName.WALLET_CONNECT,
    iconName: WalletConnectIcon,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
};

export const GlobalValue = {
  percents: {
    ALLOWED_PRICE_IMPACT_LOW: new Percent( // used for warning states
      JSBI.BigInt(100),
      GlobalConst.utils.BIPS_BASE,
    ), // 1%
    ALLOWED_PRICE_IMPACT_MEDIUM: new Percent(
      JSBI.BigInt(300),
      GlobalConst.utils.BIPS_BASE,
    ), // 3%
    ALLOWED_PRICE_IMPACT_HIGH: new Percent(
      JSBI.BigInt(500),
      GlobalConst.utils.BIPS_BASE,
    ), // 5%
    PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: new Percent( // if the price slippage exceeds this number, force the user to type 'confirm' to execute
      JSBI.BigInt(1000),
      GlobalConst.utils.BIPS_BASE,
    ), // 10%
    BLOCKED_PRICE_IMPACT_NON_EXPERT: new Percent( // for non expert mode disable swaps above this
      JSBI.BigInt(1500),
      GlobalConst.utils.BIPS_BASE,
    ), // 15%
  },
  tokens: {
    MAINNET: WETH[ChainId.MAINNET],
    COMMON: {
      EMPTY: new Token(
        ChainId.MAINNET,
        '0x0000000000000000000000000000000000000000',
        0,
        'EMPTY',
        'EMPTY',
      ),
      USDC: new Token(
        ChainId.MAINNET,
        '0xcf2DF9377A4e3C10e9EA29fDB8879d74C27FCDE7',
        6,
        'USDC',
        'USDC',
      ),
      USDT: new Token(
        ChainId.MAINNET,
        '0xDe14b85cf78F2ADd2E867FEE40575437D5f10c06',
        6,
        'USDT',
        'Tether USD',
      ),
      OLD_QUICK: new Token(
        ChainId.MAINNET,
        GlobalConst.addresses.QUICK_ADDRESS,
        18,
        'QUICK(OLD)',
        'Quickswap(OLD)',
      ),
      NEW_QUICK: new Token(
        ChainId.MAINNET,
        GlobalConst.addresses.NEW_QUICK_ADDRESS,
        18,
        'QUICK(NEW)',
        'QuickSwap(NEW)',
      ),
      OLD_DQUICK: new Token(
        ChainId.MAINNET,
        '0xf28164A485B0B2C90639E47b0f377b4a438a16B1',
        18,
        'dQUICK',
        'Dragon QUICK',
      ),
      NEW_DQUICK: new Token(
        ChainId.MAINNET,
        '0x958d208Cdf087843e9AD98d23823d32E17d723A1',
        18,
        'dQUICK',
        'Dragon QUICK',
      ),
    },
  },
};

export const GlobalData = {
  bases: {
    // used to construct intermediary pairs for trading
    BASES_TO_CHECK_TRADES_AGAINST: {
      ...WETH_ONLY,
      [ChainId.MAINNET]: [
        ...WETH_ONLY[ChainId.MAINNET],
        GlobalValue.tokens.COMMON.USDC,
        GlobalValue.tokens.COMMON.USDT,
      ],
    },
    // used to construct the list of all pairs we consider by default in the frontend
    BASES_TO_TRACK_LIQUIDITY_FOR: {
      ...WETH_ONLY,
      [ChainId.MAINNET]: [
        ...WETH_ONLY[ChainId.MAINNET],
        GlobalValue.tokens.COMMON.USDC,
        GlobalValue.tokens.COMMON.USDT,
      ],
    },
  },
  pairs: {
    PINNED_PAIRS: {
      [ChainId.MAINNET]: [
        [GlobalValue.tokens.COMMON.USDC, GlobalValue.tokens.COMMON.USDT],
        [WETH[ChainId.MAINNET], GlobalValue.tokens.COMMON.USDT],
      ],
      [ChainId.TESTNET]: undefined,
    },
  },
  analytics: {
    CHART_DURATIONS: [
      GlobalConst.analyticChart.ONE_MONTH_CHART,
      GlobalConst.analyticChart.THREE_MONTH_CHART,
      GlobalConst.analyticChart.SIX_MONTH_CHART,
      GlobalConst.analyticChart.ONE_YEAR_CHART,
      GlobalConst.analyticChart.ALL_CHART,
    ],
    CHART_DURATION_TEXTS: ['1M', '3M', '6M', '1Y', 'All'],
  },
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}
