import Optimizely from "./global/Optimizely.js";
import { parseMetrics } from "./global/utils.js";
import { code as experimentCode, metrics_keys } from '../data.json' assert { type: 'json' };

const inditex = window['inditex'] || {};
const Backbone = window['Backbone'] || {};

const main = () => {
  const parsedMetrics = parseMetrics(metrics_keys);

  const isCategoryInExperiment = () => {
    return true;
  }

  const optimizely = new Optimizely(parsedMetrics, experimentCode, isCategoryInExperiment);

  if (inditex.iPage === 'ItxOrderConfirmationPage') {
    optimizely.trackConfirmationRevenue();
  }
};

if (Backbone) {
  main();
}
