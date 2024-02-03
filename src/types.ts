export interface GenTestAB {
  experiment: Experiment;
  metrics:    Metric[];
  events?:    Event[];
}

export interface Experiment {
  audience_conditions: string;
  description:         string;
  holdback:            number;
  name:                string;
  project_id:          number;
  status:              string;
  traffic_allocation:  number;
  type:                string;
  url_targeting:       URLTargeting;
  variations:          Variation[];
}

export interface URLTargeting {
  activation_type: string;
  conditions:      string;
  edit_url:        string;
}

export interface Variation {
  actions:  any[];
  archived: boolean;
  name:     string;
  status:   string;
  weight:   number;
}

export interface Event {
  archived:           boolean;
  category:           string;
  event_type:         string;
  key:                string;
  name:               string;
  project_id:         number;
  aggregator?:        string;
  field?:             string;
  scope?:             string;
  winning_direction?: string;
}

export interface Metric {
  key:               string;
  name:              string;
  aggregator:        string;
  field?:            string;
  scope:             string;
  winning_direction: string;
}
