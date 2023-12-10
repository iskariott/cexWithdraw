import { CEX } from './config.js';

(async () => {
  switch (CEX) {
    case 'BINANCE':
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
