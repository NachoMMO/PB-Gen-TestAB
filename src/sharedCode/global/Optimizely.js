import { getFromSS } from "./utils.js";

/**
 * Clase encargada de manejar las métricas de Optimizely. En
 * esta clase se encuentran los métodos necesarios para trackear
 * las métricas de Optimizely. Para el correcto funcionamiento,
 * es necesario que esté cargado el script de Optimizely en la
 * página.
 *
 * Por otro lado, para construir una instancia de esta clase, es
 * necesario pasarle un objeto con las métricas que se quieren
 * trackear, y el código del experimento.
 *
 * @class Optimizely
 *
 * @param { Array } metrics - Array de las métricas para trackear.
 * @param { String } experimentCode - Código del experimento.
 *
 */
class Optimizely {
  constructor(metrics, experimentCode) {
    window["optimizely"] = window["optimizely"] || [];

    this.metrics = metrics;
    this.experimentCode = experimentCode;

    this.trackSegmentationISO();
  }

  getMetricName(metric) {
    return this.metrics[metric] + '_' + this.experimentCode;
  }

  persistClickProduct(productId, key) {
    const products = getFromSS(key) || [];

    if (products.indexOf(productId) === -1) {
      products.push(productId);
    }

    sessionStorage.setItem(key, JSON.stringify(products));
  }

  pushAttrs(eventType, attrs) {
    window["optimizely"].push({
      type: eventType,
      attributes: attrs
    });
  }

  pushEvent(eventName, tags) {
    window["optimizely"].push({
      type: "event",
      eventName: this.getMetricName(eventName),
      tags: tags
    });
  }

  registerVisits() {
   this.trackVisit();

    if (inditex.readCookie(`optyVisitExperiment${this.experimentCode}`) !== '1') {
      this.trackUniqueVisitor();
      inditex.writeCookie(`optyVisitExperiment${this.experimentCode}`, '1', 30);
    }
  }

  trackAddToCartSearchFromParrilla(data) {
    const searchProductsCached = getFromSS(`clickProductsSearch${this.experimentCode}`);
    const clickOrigin = sessionStorage.getItem(`searchProductClickedType${this.experimentCode}`);
    let productAlreadyCached = false;

    if (clickOrigin === "clicks_productos_buscador" && searchProductsCached !== null && searchProductsCached.indexOf(inditex.iProductId) !== -1) {
      this.pushEvent('cestas_arrastradas_buscador', {
        value: 1.00
      });

      productAlreadyCached = true;
    }

    if (productAlreadyCached) {
      const productTestAB = data.model.toJSON();
      const { sizeSelected: { sku: productSku } } = productTestAB;
      this.updateProductCookie(productSku);
    }

    sessionStorage.removeItem(`searchProductClickedType${this.experimentCode}`);
  }

  trackConfirmationRevenue() {
    if (inditex.readCookie("optyVisitExperiment" + this.experimentCode) === '1') {
      const productsCookie = inditex.readCookie(`optiProductsSku${this.experimentCode}`);
      const productsCookieValues = JSON.parse(productsCookie);

      if(!productsCookieValues) {
        return;
      }

      const optiTrackRevenue = setInterval(() => {
        if (!inditex.iXOrderOrderSummaryJSON || !inditex.iXOrderOrderSummaryJSON.totalOrderEuro) {
          return;
        }

        clearInterval(optiTrackRevenue);

        let totalRevenue = 0;
        inditex.iXOrderOrderSummaryJSON.items.forEach(item => {
          if (productsCookieValues.indexOf(item.sku) !== -1) {
            const unitPriceEuro = item.unitPriceEuro;
            totalRevenue = totalRevenue + unitPriceEuro;
          }
        });

        if(totalRevenue !== 0) {
          this.pushEvent('ventas_euros', {
            revenue: totalRevenue / 100
          });

          this.pushEvent('ventas', {
            value: 1.00
          });
        }
      }, 500);
    }
  }

  trackImpression(amount = 1.00) {
    this.pushEvent('impresiones', {
      value: amount
    });
  }

  trackSearchProductClicked(productId) {
    const productType = `clickProductsSearch${this.experimentCode}`;
    const metricName = 'clicks_productos_buscador';

    this.pushEvent(metricName, {
      value: 1.00
    });

    this.persistClickProduct(productId, productType)
    sessionStorage.setItem(`searchProductClickedType${this.experimentCode}`, metricName);
  }

  trackSegmentationISO() {
    this.pushAttrs('user', {
      'sgm_pais': inditex.iCountryCode
    });
  }

  trackUniqueVisitor() {
    this.pushEvent('visitantes_unicos', {
      value: 1.00
    });
  }

  trackVisit() {
    this.pushEvent('visitas', {
      value: 1.00
    });
  }

  updateProductCookie(productSku) {
    const productCookieKey = `optiProductsSku${this.experimentCode}`;
    const productsCookie = inditex.readCookie(productCookieKey);
    const productsCookieValues = JSON.parse(productsCookie) || [];

    if (productsCookieValues.indexOf(productSku) === -1) {
      productsCookieValues.push(productSku);
    }

    inditex.writeCookie(productCookieKey, JSON.stringify(productsCookieValues), 30);
  }
}

export default Optimizely;
