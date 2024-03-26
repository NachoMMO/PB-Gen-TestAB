export interface CommonEvent extends Event {
  target:      HTMLElement;
}

export interface EventDetail extends Event {
  detail:      any;
}

export interface OptimizelyAttrs {
  sgm_pais?:   string;
  sgm_metodo_pago?: string;
}

export interface OptimizelyEvent {
  revenue?:    number;
  value?:      number;
}