import inquirer from 'inquirer';
import fs from 'fs';

export const timer = (s) => new Promise((res) => setTimeout(res, s * 1000));

function randomFromInterval(min, max) {
  function func() {
    return Number((Math.random() * (Number(max) - Number(min)) + Number(min)).toFixed(6));
  }
  return func;
}

export async function readWallets() {
  try {
    const wallets = fs
      .readFileSync('./wallets.txt', 'utf-8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    if (!wallets.length) {
      throw new Error('Wallets.txt is empty!');
    }

    const isRandomizeWallets = await chooseList('Randomize wallets?', [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ]);

    return isRandomizeWallets ? wallets.sort(() => Math.random() - 0.5) : wallets;
  } catch (error) {
    throw error;
  }
}

export const chooseList = async (message, choices) => {
  const questions = [
    {
      name: 'choice',
      type: 'list',
      message,
      choices,
      loop: false,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.choice;
};

export const chooseNumber = async (message) => {
  const questions = [
    {
      name: 'choice',
      type: 'input',
      message,
      loop: false,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.choice;
};

export async function setRange(minWd, tokenBalance) {
  try {
    let amountFrom = 0;
    while (!amountFrom) {
      const resp = await chooseNumber('Amount from');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else if (resp < minWd) {
        console.log('\x1b[31m', 'This number is less than allowed minimum withdraw');
      } else if (resp > tokenBalance) {
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
      } else if (resp > tokenBalance) {
        console.log('\x1b[31m', 'This number is bigger than balance');
      } else amountTo = resp;
    }

    const getAmount = randomFromInterval(amountFrom, amountTo);

    let delayFrom = 0;
    while (!delayFrom) {
      const resp = await chooseNumber('Delay range from (seconds)');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else delayFrom = Number(resp);
    }

    let delayTo = 0;
    while (!delayTo) {
      const resp = await chooseNumber('Delay range to (seconds)');
      if (isNaN(Number(resp))) {
        console.log('\x1b[31m', 'You need to provide a number');
      } else if (resp <= delayFrom) {
        console.log('\x1b[31m', 'This number should be bigger than Delay from');
      } else delayTo = Number(resp);
    }

    const getDelay = randomFromInterval(delayFrom, delayTo);
    return { getDelay, getAmount };
  } catch (error) {
    throw error;
  }
}
