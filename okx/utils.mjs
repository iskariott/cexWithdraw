import { chooseList, timer } from '../common.mjs';
import { Tokens } from './constants.mjs';
import { APIKEY, PassPhrase, SecretKey } from './private.keys.mjs';
import { RestClient } from 'okx-api';

const api = new RestClient({
  apiKey: APIKEY,
  apiSecret: SecretKey,
  apiPass: PassPhrase,
});

export async function getTokenData() {
  try {
    const token = await chooseList('Choose token', Tokens);
    const currencieData = await api.getCurrencies(token);
    if (!currencieData.length) {
      throw new Error(`\x1b[31m${token} token doesnt exist.\x1b[0m`);
    }
    const chainsData = currencieData.map((itm) => ({
      minWd: itm.minWd,
      minFee: itm.minFee,
      chain: itm.chain,
    }));

    let chain = '';
    if (chainsData.length === 1) {
      chain = chainsData.chain;
      console.log('Chain ', chain);
    } else {
      chain = await chooseList(
        'Choose chain',
        chainsData.map((itm) => ({ name: itm.chain, value: itm.chain })),
      );
    }
    const chainData = chainsData.find((itm) => itm.chain === chain);
    const tokenBalance = await api
      .getBalances(token)
      .then((res) => Number(Number(res[0].availBal).toFixed(6)));
    const minFee = Number(chainData.minFee);
    const minWd = Number(chainData.minWd);
    console.log(
      `Minimum withdraw: \x1b[33m${minWd}\x1b[0m | Fee: \x1b[33m${minFee}\x1b[0m | Balance: \x1b[33m${tokenBalance}\x1b[0m`,
    );
    return { token, chain, minWd, minFee, tokenBalance };
  } catch (error) {
    throw error;
  }
}

export async function withdraw(wallets, rangeData, tokenData) {
  console.log('\n-------------------------------------------------------\n');
  try {
    let idx = 1;
    for (let wallet of wallets) {
      if (idx !== 1) await timer(rangeData.getDelay());
      const amount = rangeData.getAmount();
      if (tokenData.tokenBalance < amount + tokenData.minFee) {
        console.log('\x1b[31m', 'ABORTED! Not enough balance to send.');
        console.log('\x1b[31m', 'Remaining balance: ', tokenData.tokenBalance);
        break;
      }
      // const resp = await api.submitWithdraw({
      //   amt: amount,
      //   fee: tokenData.minFee,
      //   dest: '4',
      //   toAddr: wallet,
      //   chain: tokenData.chain,
      //   ccy: tokenData.token,
      // });
      const resp = [{ amt: amount, ccy: tokenData.token, chain: tokenData.chain }];
      console.log(
        `${idx}. Sent \x1b[33m ${resp[0].amt} \x1b[0m${resp[0].ccy} (${resp[0].chain}) to \x1b[34m${wallet}\x1b[0m`,
      );
      tokenData.tokenBalance -= amount + tokenData.minFee;
      console.log('Remaining balance: ', tokenData.tokenBalance);
      idx++;
    }
  } catch (error) {
    throw error;
  }
}
