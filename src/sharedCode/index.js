import Optimizely from "./global/index.js";
import utils from "./global/utils.js";
import { experimentCode, metrics_keys } from '../data.json' assert { type: 'json' };

if (window.Backbone && inditex.isMobileDevice()) {
  window["optimizely"] = window["optimizely"] || [];

  const parsedMetrics = utils.parseMetrics(metrics_keys);
  const optimizely = new Optimizely(parsedMetrics, experimentCode);

  function isCategoryInExperiment() {
    return document.querySelector('html').classList.contains('search-active');
  }

  if (inditex.iPage === 'ItxOrderConfirmationPage') {
    optimizely.trackConfirmationRevenue();
  }

  document.addEventListener('product-clicked', (ev) => {
    if (!isCategoryInExperiment()) {
      return;
    }

    const { detail: { product: { id: productId } } } = ev;
    optimizely.trackSearchProductClicked(productId);
  });

  document.addEventListener("search-modular-impression", function (data) {
    if (!isCategoryInExperiment()) {
      return;
    }

    const { detail: { source } } = data;
    const amount = source.length;
    optimizely.trackImpression(amount);
  });

  document.addEventListener("send-products-impression", function (data) {
    if (!isCategoryInExperiment()) {
      return;
    }

    const productsPerRequest = 25;
    const { detail: { products } } = data;
    const restAmountOfProducts = products.length % productsPerRequest;
    const amount = restAmountOfProducts === 0 ? productsPerRequest : restAmountOfProducts;

    optimizely.trackImpression(amount);
  });

  Backbone.Radio.channel('search').on('open-search', () => {
    optimizely.registerVisits()
  });

  Backbone.Radio.channel('productBus').on('product:addToCart', (data) => {
    optimizely.trackAddToCartSearchFromParrilla(data)
  });
}
