// TODO: extract from here https://raw.githubusercontent.com/vvo/tzdb/refs/heads/main/raw-time-zones.json
// TODO: Implement generation script!
export type TimeZoneName = string;

export type TimeZone = {
  name: TimeZoneName;
  offset: number;
};

export type TimeZones = TimeZone[];
