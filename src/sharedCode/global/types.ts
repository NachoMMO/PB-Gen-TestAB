export interface EventDetail extends Event {
  detail:      any;
}

export interface OptimizelyAttrs {
  sgm_pais?:   string;
}

export interface OptimizelyEvent {
  revenue?:    number;
  value?:      number;
}