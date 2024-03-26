import TestABTracker from "./global/TestABTracker.js";
import { parseMetrics } from "./global/utils.js";
import { code as experimentCode, metrics_keys } from '../data.json' assert { type: 'json' };

const inditex = window['inditex'] || {};
const Backbone = window['Backbone'] || {};

const main = () => {
  const parsedMetrics = parseMetrics(metrics_keys);

  const isCategoryInExperiment = () => {
    return true;
  }

  const testAbTracker = new TestABTracker(parsedMetrics, experimentCode, isCategoryInExperiment);

  if (inditex.iPage === 'ItxOrderConfirmationPage') {
    testAbTracker.trackCheckoutRevenue();
  }

  if (inditex.iPage === 'ItxOrderCheckoutPage') {
    let bindCheckoutStoreEvents = false;

    document.addEventListener('checkout-step-changed', (ev) => {
      if(ev.detail?.state?.activeStep?.name === '#payment-methods') {
        testAbTracker.registerVisits();

        if (!bindCheckoutStoreEvents) {
          bindCheckoutStoreEvents = true;
          testAbTracker.trackSelectPaymentMethod();
        }
      }
    });
  }
};

if (Backbone) {
  main();
}
