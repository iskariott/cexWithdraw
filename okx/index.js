import { readWallets, setRange } from '../common.mjs';
import { getTokenData, withdraw } from './utils.mjs';

export default async function runOkx() {
  try {
    const wallets = await readWallets();
    const tokenData = await getTokenData();
    const rangeData = await setRange(tokenData.minWd, tokenData.tokenBalance);
    await withdraw(wallets, rangeData, tokenData);
  } catch (error) {
    console.log(error);
  }
}
