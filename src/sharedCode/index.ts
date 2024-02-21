import Optimizely from "./global/Optimizely.js";
import { parseMetrics } from "./global/utils.js";
import { code as experimentCode, metrics_keys } from '../data.json' assert { type: 'json' };

const inditex = window['inditex'] || {};
const Backbone = window['Backbone'] || {};

const main = () => {
  const parsedMetrics = parseMetrics(metrics_keys);
  const productsVisited: Array<string> = [];

  const isCategoryInExperiment = () => {
    return inditex.iXProductInfo;
  }

  const isProductVisited = (productId: string) => {
    return productsVisited.includes(productId);
  }

  const optimizely = new Optimizely(parsedMetrics, experimentCode);

  if (inditex.iPage === 'ItxOrderConfirmationPage') {
    optimizely.trackConfirmationRevenue();
  }

  optimizely.bindPDPSizeSelectedClicked();

  Backbone.Radio.channel('productBus').on('product:addToCart', (data) => {
    optimizely.trackAddToCartFromPDP(data)
  });

  Backbone.Radio.channel('productBus').on('product:load', () => {
    if (isCategoryInExperiment() && !isProductVisited(inditex.iXProductInfo?.id)) {
      productsVisited.push(inditex.iXProductInfo?.id);
      optimizely.registerVisits()
    }
  });
};

if (Backbone) {
  main();
}