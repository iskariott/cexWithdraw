import { DELAY, TOKEN } from '../config.js';
import { chooseList, CLITimer, randomFromInterval } from '../common.mjs';
import { ACCESSKEY, SECRETKEY } from './private.keys.js';
import { HbApi } from 'huobi-api-js';

const hbApi = new HbApi({
  apiBaseUrl: 'https://api.huobi.pro',
  profileConfig: {
    accessKey: ACCESSKEY,
    secretKey: SECRETKEY,
  },
});

export async function getTokenData() {
  try {
    const networkList = await hbApi
      .restApi({
        path: `/v2/reference/currencies`,
        method: 'GET',
        query: {
          currency: TOKEN.toLowerCase(),
        },
      })
      .then((r) => r[0].chains);
    let chain = '';
    let chainData;
    if (networkList.length === 1) {
      chain = networkList[0].chain;
      chainData = networkList[0];
      console.log('Chain ', networkList[0].displayName);
    } else {
      chain = await chooseList(
        'Choose chain',
        networkList.flatMap((itm) => {
          if (itm.withdrawStatus !== 'allowed') return [];
          return { name: itm.displayName, value: itm.chain };
        }),
      );
      chainData = networkList.find((itm) => itm.chain === chain);
    }
    const minFee = Number(chainData.transactFeeWithdraw);
    const minWd = Number(chainData.minWithdrawAmt);
    console.log(`Minimum withdraw: \x1b[33m${minWd}\x1b[0m | Fee: \x1b[33m${minFee}\x1b[0m`);

    return { chain, minFee, minWd };
  } catch (error) {
    console.log('getTokenData error: ');
  }
}

export async function withdraw(wallets, tokenData, getAmount) {
  console.log('\n-------------------------------------------------------\n');
  const getDelay = randomFromInterval(DELAY[0], DELAY[1]);
  const amount = getAmount();
  try {
    let idx = 1;
    for (let wallet of wallets) {
      if (idx !== 1) await CLITimer(Math.floor(getDelay()));
      const res = await hbApi.restApi({
        path: `/v1/dw/withdraw/api/create`,
        method: 'POST',
        query: {
          address: wallet,
          currency: TOKEN.toLowerCase(),
          amount,
        },
      });
      if (!res) break;
      console.log(`${idx}. Sent \x1b[33m${amount} \x1b[0m${TOKEN} to \x1b[34m${wallet}\x1b[0m`);
      idx++;
    }
  } catch (error) {
    console.log('withdraw error: ');
    throw error;
  }
}
