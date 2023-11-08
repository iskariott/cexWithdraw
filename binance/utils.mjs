import { chooseList, CLITimer } from '../common.mjs';
import { Tokens } from './constants.mjs';
import { APIKEY, SecretKey } from './private.keys.mjs';
import { Spot } from '@binance/connector';

const api = new Spot(APIKEY, SecretKey);

export async function getTokenData() {
  try {
    const token = await chooseList('Choose token', Tokens);
    const { free, networkList } = await api
      .coinInfo()
      .then((r) => r.data.find((itm) => itm.coin === token));
    console.log('here');
    let chain = '';
    if (networkList.length === 1) {
      chain = networkList[0].network;
      console.log('Chain ', chain);
    } else {
      chain = await chooseList(
        'Choose chain',
        networkList.flatMap((itm) => {
          if (!itm.withdrawEnable) return [];
          return { name: itm.network, value: itm.network };
        }),
      );
    }

    const chainData = networkList.find((itm) => itm.network === chain);
    const minFee = Number(chainData.withdrawFee);
    const minWd = Number(chainData.withdrawMin);
    console.log(
      `Minimum withdraw: \x1b[33m${minWd}\x1b[0m | Fee: \x1b[33m${minFee}\x1b[0m | Balance: \x1b[33m${free}\x1b[0m`,
    );

    return { token, tokenBalance: free, chain, minFee, minWd };
  } catch (error) {
    console.log('getTokenData error: ');
    throw error.response.data.msg;
  }
}

export async function withdraw(wallets, tokenData, rangeData) {
  console.log('\n-------------------------------------------------------\n');
  try {
    let idx = 1;
    for (let wallet of wallets) {
      if (idx !== 1) await CLITimer(Math.floor(rangeData.getDelay()));
      const amount = rangeData.getAmount();
      if (tokenData.tokenBalance < amount + tokenData.minFee) {
        console.log(
          `\x1b[31mABORTED! Not enough balance to send \x1b[33m${amount} \x1b[0m${tokenData.token}.`,
        );
        break;
      }
      await api.withdraw(tokenData.token, wallet, amount, {
        network: tokenData.chain,
        walletType: 0, // spot
      });
      console.log(
        `${idx}. Sent \x1b[33m${amount} \x1b[0m${tokenData.token} (${tokenData.chain}) to \x1b[34m${wallet}\x1b[0m`,
      );
      tokenData.tokenBalance -= amount + tokenData.minFee;
      console.log('Remaining balance: ', tokenData.tokenBalance);
      idx++;
    }
  } catch (error) {
    console.log('withdraw error: ');
    throw error;
  }
}
