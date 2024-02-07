import { getTokenData, withdraw } from './utils.js';
import { readWallets, setRange } from '../common.mjs';

(async () => {
  const wallets = await readWallets();
  const tokenData = await getTokenData();
  const getAmount = await setRange(tokenData.minWd, 1000);
  await withdraw(wallets, tokenData, getAmount);
})();
