import { APIKEY, PassPhrase, SecretKey } from './privateKeys.mjs';
import { RestClient } from 'okx-api';
import inquirer from 'inquirer';

export const api = new RestClient({
  apiKey: APIKEY,
  apiSecret: SecretKey,
  apiPass: PassPhrase,
});

export const timer = (s) => new Promise((res) => setTimeout(res, s * 1000));

export function randomFromInterval(min, max) {
  function func() {
    return Number((Math.random() * (Number(max) - Number(min)) + Number(min)).toFixed(6));
  }
  return func;
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
