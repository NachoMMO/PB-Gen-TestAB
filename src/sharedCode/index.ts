import Optimizely from "./global/Optimizely.js";
import { parseMetrics } from "./global/utils.js";
import { code as experimentCode, metrics_keys } from '../data.json' assert { type: 'json' };

const inditex = window['inditex'] || {};
const Backbone = window['Backbone'] || {};

const main = () => {
  const parsedMetrics = parseMetrics(metrics_keys);

  function isCategoryInExperiment() {
    return document.querySelector('html').classList.contains('search-active');
  }

  const optimizely = new Optimizely(parsedMetrics, experimentCode, isCategoryInExperiment);

  if (inditex.iPage === 'ItxOrderConfirmationPage') {
    optimizely.trackConfirmationRevenue();
  }

  optimizely.bindSearchProductClicked();
  optimizely.bindSearchImpressionEvents();

  Backbone.Radio.channel('search').on('open-search', () => {
    optimizely.registerVisits()
  });

  Backbone.Radio.channel('productBus').on('product:addToCart', (data) => {
    optimizely.trackAddToCartSearchFromParrilla(data)
  });
};

if (Backbone && inditex.isMobileDevice()) {
  main();
}