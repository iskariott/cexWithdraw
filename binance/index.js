import { readWallets, setRange } from '../common.mjs';
import { getTokenData, withdraw } from './utils.mjs';

export default async function runBinance() {
  try {
    const wallets = await readWallets();
    const tokenData = await getTokenData();
    const getAmount = await setRange(tokenData.minWd, tokenData.tokenBalance);
    await withdraw(wallets, tokenData, getAmount);
  } catch (error) {
    console.log(error);
  }
}
