import { chooseList } from './common.mjs';

(async () => {
  const entryPoint = await chooseList('', [
    { name: 'OKX', value: 'OKX' },
    { name: 'Binance', value: 'Binance' },
  ]);
  switch (entryPoint) {
    case 'Binance':
      const { default: runBinance } = await import('./binance/index.js');
      runBinance();
      break;
    case 'OKX':
      const { default: runOkx } = await import('./okx/index.js');
      runOkx();
      break;
    default:
      break;
  }
})();
