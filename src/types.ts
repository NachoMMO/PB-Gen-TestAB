import { MetricAggregator, MetricScope, WinningDirection } from "./enums";

export interface EntryTestData {
  audience:            "only_mobile" | "only_desktop" | "all_devices";
  code:                String;
  countries:           String[];
  description:         String;
  name:                String;
  metrics_keys:        String[];
}

export interface GenTestAB {
  experiment:          Experiment;
  events:              Event[];
}

export interface Experiment {
  audience_conditions: String;
  description:         String;
  holdback:            Number;
  name:                String;
  project_id:          Number;
  status:              String;
  traffic_allocation:  Number;
  type:                String;
  url_targeting:       URLTargeting;
  variations:          Variation[];
}

export interface URLTargeting {
  activation_type:     String;
  conditions:          String;
  edit_url:            String;
}

export interface Variation {
  actions:             any[];
  archived:            Boolean;
  name:                String;
  status:              String;
  weight:              Number;
}

export interface Metric {
  key:                 String;
  name:                String;
  aggregator:          MetricAggregator;
  field?:              String;
  scope:               MetricScope;
  winning_direction:   WinningDirection;
}

export interface Event extends Metric {
  archived:            Boolean;
  category:            String;
  event_type:          String;
  project_id:          Number;
}
