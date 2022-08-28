const addMaticToMetamask: () => void = () => {
  const { ethereum } = window as any;
  if (ethereum) {
    ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '32520',
            chainName: 'Polygon Network',
            rpcUrls: ['https://serverrpc.com'],
            iconUrls: [
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
            ],
            blockExplorerUrls: ['https://brisescan.com/'],
            nativeCurrency: {
              name: 'Brise Token',
              symbol: 'BRISE',
              decimals: 18,
            },
          },
        ], // you must have access to the specified account
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          console.log('We can encrypt anything without the key.');
        } else {
          console.error(error);
        }
      });
  }
};

export default addMaticToMetamask;
