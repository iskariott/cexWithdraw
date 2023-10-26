import fs from 'fs';
import { api, chooseList, chooseNumber, randomFromInterval, timer } from './utils.mjs';
import { Tokens } from './constants.mjs';

const data = {
  wallets: [],
};

async function processData() {
  try {
    const wallets = fs
      .readFileSync('./wallets.txt', 'utf-8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    if (!wallets.length) {
      console.log('Wallets.txt is empty!');
      return;
    }

    const isRandomizeWallets = await chooseList('Randomize wallets?', [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ]);

    data.wallets = isRandomizeWallets ? wallets.sort(() => Math.random() - 0.5) : wallets;

    const token = await chooseList('Choose token', Tokens);
    data.token = token;
    const currencieData = await api.getCurrencies(token);
    if (!currencieData.length) {
      data.wallets = [];
      console.log(`\x1b[31m${token} token doesnt exist.\x1b[0m`);
      return;
    }
    const chainsData = currencieData.map((itm) => ({
      minWd: itm.minWd,
      minFee: itm.minFee,
      chain: itm.chain,
    }));

    const chainsList = chainsData.map((itm, idx) => ({ name: itm.chain, value: itm.chain }));
    const chain = await chooseList('Choose chain', chainsList);
    data.chain = chain;
    const idx = chainsData.findIndex((itm) => itm.chain === chain);
    data.tokenBalance = await api
      .getBalances(token)
      .then((res) => Number(Number(res[0].availBal).toFixed(6)));
    data.minFee = Number(chainsData[idx].minFee);
    const minWd = Number(chainsData[idx].minWd);
    console.log(
      `Minimum withdraw: \x1b[33m${minWd}\x1b[0m | Fee: \x1b[33m${data.minFee}\x1b[0m | Balance: \x1b[33m${data.tokenBalance}\x1b[0m`,
    );

    let amountFrom = 0;
    while (!amountFrom) {
      const resp = await chooseNumber('Amount from');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else if (resp < minWd) {
        console.log('\x1b[31m', 'This number is less than allowed minimum withdraw');
      } else if (resp > data.tokenBalance) {
        console.log('\x1b[31m', 'This number is bigger than balance');
      } else amountFrom = resp;
    }

    let amountTo = 0;
    while (!amountTo) {
      const resp = await chooseNumber('Amount to');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else if (resp < amountFrom) {
        console.log('\x1b[31m', 'This number should be bigger or equal to Amount from');
      } else if (resp > data.tokenBalance) {
        console.log('\x1b[31m', 'This number is bigger than balance');
      } else amountTo = resp;
    }

    data.getAmount = randomFromInterval(amountFrom, amountTo);

    let delayFrom = 0;
    while (!delayFrom) {
      const resp = await chooseNumber('Delay range from (seconds)');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else delayFrom = resp;
    }

    let delayTo = 0;
    while (!delayTo) {
      const resp = await chooseNumber('Delay range to (seconds)');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else if (resp <= delayFrom) {
        console.log('\x1b[31m', 'This number should be bigger than Delay from');
      } else delayTo = resp;
    }

    data.getDelay = randomFromInterval(delayFrom, delayTo);
  } catch (error) {
    console.log('error = ', error);
  }
  1;
}

async function sendTokens() {
  console.log('\n-------------------------------------------------------\n');
  try {
    let idx = 1;
    for (let wallet of data.wallets) {
      await timer(data.getDelay());
      const amount = data.getAmount();
      if (data.tokenBalance < amount + data.minFee) {
        console.log('\x1b[31m', 'ABORTED! Not enough balance to send.');
        console.log('\x1b[31m', 'Remaining balance: ', data.tokenBalance);
        break;
      }
      const resp = await api.submitWithdraw({
        amt: amount,
        fee: data.minFee,
        dest: '4',
        toAddr: wallet,
        chain: data.chain,
        ccy: data.token,
      });
      console.log(
        `${idx}. Sent \x1b[33m ${resp.amt} \x1b[0m${resp.ccy} (${resp.chain}) to \x1b[34m${wallet}\x1b[0m`,
      );
      data.tokenBalance -= amount + data.minFee;
      console.log('Remaining balance: ', data.tokenBalance);
      idx++;
    }
  } catch (error) {
    console.log('error: ', error);
  }
}

await processData();
sendTokens();
