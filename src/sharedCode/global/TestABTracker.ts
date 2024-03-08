import { CommonEvent, EventDetail, OptimizelyAttrs, OptimizelyEvent } from "./types.js";
import { getFromSS } from "./utils.js";

const Backbone = window['Backbone'] || {};

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
 * @class TestABTracker
 *
 * @param { Object } metrics - Objeto con las keys de las métricas
 * a trackear.
 * @param { String } experimentCode - Código del experimento.
 * @param { Function } fnAllowBindEvents - Función que devuelve si
 * se pueden bindear los eventos.
 */

class TestABTracker {

  metrics: Object;
  experimentCode: string;
  fnAllowBindEvents: Function;

  constructor(metrics: Object, experimentCode: string, fnAllowBindEvents: Function = () => true) {
    window["optimizely"] = window["optimizely"] || [];

    this.metrics = metrics;
    this.experimentCode = experimentCode;
    this.fnAllowBindEvents = fnAllowBindEvents;

    this.trackSegmentationISO();
  }

  /**
   * Bindea el evento de cuando se hace un cambio en el color
   * seleccionado en la ficha de producto. Después, se trackea
   * dicho evento.
   */
  bindPDPColorSelectedClicked() {
    if (window['inditex'].isMobileDevice()) {
      Backbone.Radio.channel('productBus').on('setColorSelected', () => {
        if (!this.fnAllowBindEvents()) {
          return;
        }

        this.trackPDPColorSelectedClicked();
      });
      return;
    }

    document.addEventListener('product-image-selected', (ev: CommonEvent) => {
      if (!this.fnAllowBindEvents()) {
        return;
      }
  
      const { target: { classList } } = ev;
      if (classList.contains('show-colors-carousel')) {
        this.trackPDPColorSelectedClicked();
      }
    });
  }

  /**
   * Bindea el evento de cuando se hace un cambio en la talla
   * seleccionada en la ficha de producto. Después, se trackea
   * dicho evento.
   */
  bindPDPSizeSelectedClicked() {
    document.addEventListener('click-size', () => {
      if (!this.fnAllowBindEvents()) {
        return;
      }
  
      this.trackPDPSizeSelectedClicked();
    });
  }

  /**
   * Bindea el evento de cuando se hace click en un producto del
   * buscador. Después, se trackea dicho evento.
   */
  bindSearchProductClicked() {
    document.addEventListener('product-clicked', data => {
      if (!this.fnAllowBindEvents()) {
        return;
      }
  
      const { detail: { product: { id: productId } } } = data as EventDetail;
      this.trackSearchProductClicked(productId);
    });
  }

  /**
   * Bindea los eventos de impresiones de productos en el buscador
   * correspondientes a un product-modular y a las diferentes vistas
   * derivadas de hacer una búsqueda. Después, se trackean dichas
   * impresiones.
   *
   * En las impresiones de las vistas derivadas de hacer una búsqueda,
   * se tienen que trackear las impresiones de 25 productos en 25
   * productos.
   */
  bindSearchImpressionEvents() {
    document.addEventListener("search-modular-impression", data => {
      if (!this.fnAllowBindEvents()) {
        return;
      }
  
      const { detail: { source } } = data as EventDetail;
      const amount = source.length;
      this.trackImpression(amount);
    });
  
    document.addEventListener("send-products-impression", data => {
      if (!this.fnAllowBindEvents()) {
        return;
      }
  
      const productsPerRequest = 25;
      const { detail: { products } } = data as EventDetail;
      const restAmountOfProducts = products.length % productsPerRequest;
      const amount = restAmountOfProducts === 0 ? productsPerRequest : restAmountOfProducts;
  
      this.trackImpression(amount);
    });
  }

  /**
   * Obtiene la métrica indicada por parámetro y la concatena con el
   * código del experimento.
   *
   * @param {string} metric - Métrica a formatear
   * @returns {string} - Métrica formateada
   */
  getMetricName(metric) {
    const metricExists = this.metrics[metric];

    if (!metricExists) {
      throw new Error(`La métrica ${metric} no existe`);
    }

    return `${this.metrics[metric]}_${this.experimentCode}`;
  }

  /**
   * Persiste el sku del producto indicado por parámetro en el
   * sessionStorage.
   *
   * @param {string} productId - SKU del producto.
   * @param {string} key - Clave para almacenarlo en el
   * sessionStorage.
   */
  persistClickProduct(productId: string, key: string) {
    const products = getFromSS(key) || [];

    if (products.indexOf(productId) === -1) {
      products.push(productId);
    }

    sessionStorage.setItem(key, JSON.stringify(products));
  }

  /**
   * Trackea un evento de atributos de Optimizely.
   *
   * @param {string} eventType - Tipo del evento a trackear
   * @param {OptimizelyEvent} attrs - Atributos del evento a trackear
   */
  pushAttrs(eventType: string, attrs: OptimizelyAttrs) {
    window["optimizely"].push({
      type: eventType,
      attributes: attrs
    });
  }

  /**
   * Trackea un evento de Optimizely.
   *
   * @param {string} eventName - Nombre del evento a trackear
   * @param {OptimizelyEvent} tags - Tags del evento a trackear
   */
  pushEvent(eventName: string, tags: OptimizelyEvent) {
    window["optimizely"].push({
      type: "event",
      eventName: this.getMetricName(eventName),
      tags: tags
    });
  }

  /**
   * Registra las visitas y visitantes únicos del experimento, en función
   * de si el usuario ya ha visitado el experimento previamente o no, mediante
   * el uso de cookies.
   */
  registerVisits() {
   this.trackVisit();

    if (window['inditex'].readCookie(`optyVisitExperiment${this.experimentCode}`) !== '1') {
      this.trackUniqueVisitor();
      window['inditex'].writeCookie(`optyVisitExperiment${this.experimentCode}`, '1', 30);
    }
  }

  /**
   * Trackea el evento de añadir al carrito desde una parrilla siempre
   * y cuando el producto haya sido clickado desde el buscador. Para ello,
   * se comprueba si el producto ha sido clickado desde el buscador
   * previamente, y si es así, se trackea el evento de añadir al carrito
   * desde el buscador.
   *
   * Además, se actualiza el array de SKU de productos que cumplen lo
   * anterior en el sessionStorage, de cara a ser trackeados en el evento
   * de confirmación de compra.
   *
   * @param {string} productSku - SKU del producto.
   */
  trackAddToCartSearchFromParrilla(productSku) {
    const searchProductsCached = getFromSS(`clickProductsSearch${this.experimentCode}`);
    const clickOrigin = sessionStorage.getItem(`searchProductClickedType${this.experimentCode}`);
    let productAlreadyCached = false;

    if (clickOrigin === "clicks_productos_buscador" && searchProductsCached !== null && searchProductsCached.indexOf(window['inditex'].iProductId) !== -1) {
      this.pushEvent('cestas_arrastradas_buscador', {
        value: 1.00
      });

      productAlreadyCached = true;
    }

    if (productAlreadyCached) {
      this.updateProductCookie(productSku);
    }

    sessionStorage.removeItem(`searchProductClickedType${this.experimentCode}`);
  }

  /**
   * Trackea el evento de añadir al carrito desde la ficha de producto.
   * Además, actualiza el array de SKU de productos añadidos al carrito
   * en la cookie de cara a ser trackeados en el evento de confirmación
   * de compra.
   *
   * @param {string} productSku - SKU del producto.
   */
  trackAddToCartFromPDP(productSku) {
    this.pushEvent('clicks_add_to_cart', {
      value: 1.00
    });

    this.updateProductCookie(productSku);
  }

  /**
   * Trackea los eventos de ventas (ventas y ventas_euros) de confirmación
   * de compra siempre y cuando el usuario haya visitado el experimento
   * previamente.
   */
  trackConfirmationRevenue() {
    if (window['inditex'].readCookie("optyVisitExperiment" + this.experimentCode) === '1') {
      const productsCookie = window['inditex'].readCookie(`optiProductsSku${this.experimentCode}`);
      const productsCookieValues = JSON.parse(productsCookie);

      if(!productsCookieValues) {
        return;
      }

      const optiTrackRevenue = setInterval(() => {
        if (!window['inditex'].iXOrderOrderSummaryJSON || !window['inditex'].iXOrderOrderSummaryJSON.totalOrderEuro) {
          return;
        }

        clearInterval(optiTrackRevenue);

        let totalRevenue = 0;
        window['inditex'].iXOrderOrderSummaryJSON.items.forEach(item => {
          if (productsCookieValues.indexOf(item.sku) !== -1) {
            const { quantity, unitPriceEuro } = item;
            totalRevenue = totalRevenue + (unitPriceEuro * quantity);
          }
        });

        if(totalRevenue !== 0) {
          this.pushEvent('ventas_euros', {
            revenue: totalRevenue
          });

          this.pushEvent('ventas', {
            value: 1.00
          });
        }
      }, 500);
    }
  }

  /**
   * Trackea el evento de impresiones de productos.
   *
   * @param {number} amount - Cantidad de impresiones.
   */
  trackImpression(amount = 1.00) {
    this.pushEvent('impresiones', {
      value: amount
    });
  }

  /**
   * Trackea el evento de click en un producto del buscador y persiste
   * el SKU del producto en el sessionStorage.
   *
   * @param {string} productId - SKU del producto.
   */
  trackSearchProductClicked(productId: string) {
    const productType = `clickProductsSearch${this.experimentCode}`;
    const metricName = 'clicks_productos_buscador';

    this.pushEvent(metricName, {
      value: 1.00
    });

    this.persistClickProduct(productId, productType)
    sessionStorage.setItem(`searchProductClickedType${this.experimentCode}`, metricName);
  }

  /**
   * Trackea el evento de cambio de color seleccionado en la ficha de
   * producto.
   */
  trackPDPColorSelectedClicked() {
    this.pushEvent('clicks_seleccion_color', {
      value: 1.00
    });
  }

  /**
   * Trackea el evento de cambio de talla seleccionada en la ficha de
   * producto.
   */
  trackPDPSizeSelectedClicked() {
    this.pushEvent('clicks_seleccion_talla', {
      value: 1.00
    });
  }

  /**
   * Trackea la segmentación ISO del usuario.
   */
  trackSegmentationISO() {
    this.pushAttrs('user', {
      'sgm_pais': window['inditex'].iCountryCode
    });
  }

  /**
   * Trackea el evento de visitantes únicos.
   */
  trackUniqueVisitor() {
    this.pushEvent('visitantes_unicos', {
      value: 1.00
    });
  }

  /**
   * Trackea el evento de visitas.
   */
  trackVisit() {
    this.pushEvent('visitas', {
      value: 1.00
    });
  }

  /**
   * Actualiza la cookie de productos trackeados con el SKU del producto
   * indicado por parámetro. 
   *
   * @param {string} productSku - SKU del producto.
   */
  updateProductCookie(productSku: string) {
    const productCookieKey = `optiProductsSku${this.experimentCode}`;
    const productsCookie = window['inditex'].readCookie(productCookieKey) || '[]';
    const productsCookieValues = JSON.parse(productsCookie) || [];

    if (productsCookieValues.indexOf(productSku) === -1) {
      productsCookieValues.push(productSku);
    }

    window['inditex'].writeCookie(productCookieKey, JSON.stringify(productsCookieValues), 30);
  }
}

export default TestABTracker;
