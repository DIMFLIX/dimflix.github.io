export type Wallet = {
  key: string
  label: string
  address: string
}

const wallets: Wallet[] = [
  { key: 'usdt', label: 'USDT (TRC20)', address: 'TBTZ5RRMfGQQ8Vpf8i5N8DZhNxSum2rzAs' },
  { key: 'usdt', label: 'TON / USDT(TON)', address: 'UQB9qNTcAazAbFoeobeDPMML9MG73DUCAFTpVanQnLk3BHg3' },
  { key: 'btc', label: 'BTC (Bitcoin)', address: 'bc1qt5urnw7esunf0v7e9az0jhatxrdd0smem98gdn' },
  { key: 'eth', label: 'ETH (Ethereum)', address: '0x56e8bf8Ec07b6F2d6aEdA7Bd8814DB5A72164b13' },
]

export default wallets

