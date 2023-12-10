import { CEX } from './config.js';

(async () => {
  switch (CEX) {
    case 0:
      const { default: runBinance } = await import('./binance/index.js');
      runBinance();
      break;
    case 1:
      const { default: runOkx } = await import('./okx/index.js');
      runOkx();
      break;
    default:
      break;
  }
})();
