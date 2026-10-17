export interface ContinentData {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  destinationsCount: number;
  zoomTarget: { zoom: number; panX: number; panY: number };
}

export interface StateRegionData {
  id: string;
  destinationSlug: string;
  name: string;
  type: "State" | "Province" | "Region" | "Prefecture" | "Canton" | "Territory";
  x: number;
  y: number;
  placesCount: number;
}

export const CONTINENTS: ContinentData[] = [
  {
    id: "north-america",
    name: "North America",
    code: "NA",
    x: 26,
    y: 35,
    destinationsCount: 1,
    zoomTarget: { zoom: 2.2, panX: 110, panY: 60 },
  },
  {
    id: "europe",
    name: "Europe",
    code: "EU",
    x: 53,
    y: 32,
    destinationsCount: 6,
    zoomTarget: { zoom: 2.2, panX: -20, panY: 70 },
  },
  {
    id: "asia",
    name: "Asia",
    code: "AS",
    x: 74,
    y: 38,
    destinationsCount: 4,
    zoomTarget: { zoom: 2.0, panX: -120, panY: 45 },
  },
  {
    id: "oceania",
    name: "Oceania",
    code: "OC",
    x: 88,
    y: 70,
    destinationsCount: 1,
    zoomTarget: { zoom: 2.2, panX: -190, panY: -110 },
  },
];

export const STATES_AND_REGIONS: StateRegionData[] = [
  // Norway
  {
    id: "norway-troms",
    destinationSlug: "norway",
    name: "Troms og Finnmark (Arctic)",
    type: "Province",
    x: 56.5,
    y: 21.5,
    placesCount: 1,
  },
  {
    id: "norway-nordland",
    destinationSlug: "norway",
    name: "Nordland (Lofoten)",
    type: "Province",
    x: 53.5,
    y: 24.0,
    placesCount: 1,
  },
  {
    id: "norway-vestland",
    destinationSlug: "norway",
    name: "Vestland (Fjordlands)",
    type: "Province",
    x: 52.8,
    y: 27.2,
    placesCount: 1,
  },

  // Japan (Mount Fuji)
  {
    id: "japan-yamanashi",
    destinationSlug: "mount-fuji",
    name: "Yamanashi (Fuji Lakes)",
    type: "Prefecture",
    x: 83.2,
    y: 38.0,
    placesCount: 2,
  },
  {
    id: "japan-shizuoka",
    destinationSlug: "mount-fuji",
    name: "Shizuoka (Pagoda Ridge)",
    type: "Prefecture",
    x: 85.2,
    y: 40.2,
    placesCount: 1,
  },

  // France (Paris)
  {
    id: "france-ile-de-france",
    destinationSlug: "paris",
    name: "Île-de-France (Central)",
    type: "Region",
    x: 51.5,
    y: 33.6,
    placesCount: 2,
  },
  {
    id: "france-montmartre",
    destinationSlug: "paris",
    name: "Montmartre Quarter",
    type: "Region",
    x: 53.4,
    y: 35.2,
    placesCount: 1,
  },

  // Italy (Amalfi Coast)
  {
    id: "italy-campania",
    destinationSlug: "amalfi-coast",
    name: "Campania (Salerno Coast)",
    type: "Region",
    x: 54.8,
    y: 37.8,
    placesCount: 2,
  },
  {
    id: "italy-ravello",
    destinationSlug: "amalfi-coast",
    name: "Ravello Clifflands",
    type: "Region",
    x: 56.5,
    y: 39.5,
    placesCount: 1,
  },

  // Netherlands
  {
    id: "netherlands-south-holland",
    destinationSlug: "netherlands-tulip-gardens",
    name: "South Holland (Bulbfields)",
    type: "Province",
    x: 51.4,
    y: 30.2,
    placesCount: 2,
  },
  {
    id: "netherlands-north-holland",
    destinationSlug: "netherlands-tulip-gardens",
    name: "North Holland (Canals)",
    type: "Province",
    x: 53.0,
    y: 31.8,
    placesCount: 1,
  },

  // India (Ladakh)
  {
    id: "india-leh",
    destinationSlug: "ladakh",
    name: "Leh District (Indus Valley)",
    type: "Territory",
    x: 72.2,
    y: 41.5,
    placesCount: 1,
  },
  {
    id: "india-nubra",
    destinationSlug: "ladakh",
    name: "Nubra Valley (Karakoram)",
    type: "Territory",
    x: 73.6,
    y: 41.8,
    placesCount: 1,
  },
  {
    id: "india-pangong",
    destinationSlug: "ladakh",
    name: "Changthang (Pangong Tso)",
    type: "Territory",
    x: 74.4,
    y: 43.6,
    placesCount: 1,
  },

  // Australia (Sydney)
  {
    id: "australia-nsw-harbour",
    destinationSlug: "sydney",
    name: "New South Wales (Harbour)",
    type: "State",
    x: 88.0,
    y: 71.0,
    placesCount: 2,
  },
  {
    id: "australia-nsw-coast",
    destinationSlug: "sydney",
    name: "Bondi & Eastern Coast",
    type: "State",
    x: 90.2,
    y: 73.0,
    placesCount: 1,
  },

  // United States (New York)
  {
    id: "usa-manhattan",
    destinationSlug: "new-york",
    name: "New York (Manhattan)",
    type: "State",
    x: 29.2,
    y: 37.0,
    placesCount: 2,
  },
  {
    id: "usa-brooklyn",
    destinationSlug: "new-york",
    name: "Kings County (Brooklyn)",
    type: "State",
    x: 31.0,
    y: 39.2,
    placesCount: 1,
  },

  // Switzerland
  {
    id: "swiss-bernese",
    destinationSlug: "switzerland",
    name: "Bernese Oberland (Alpine)",
    type: "Canton",
    x: 53.0,
    y: 35.0,
    placesCount: 2,
  },
  {
    id: "swiss-valais",
    destinationSlug: "switzerland",
    name: "Valais (Matterhorn)",
    type: "Canton",
    x: 54.8,
    y: 36.6,
    placesCount: 1,
  },

  // Thailand (Chiang Mai)
  {
    id: "thailand-suthep",
    destinationSlug: "chiang-mai",
    name: "Chiang Mai (Doi Suthep)",
    type: "Province",
    x: 76.0,
    y: 48.0,
    placesCount: 1,
  },
  {
    id: "thailand-mueang",
    destinationSlug: "chiang-mai",
    name: "Old Walled City",
    type: "Province",
    x: 78.2,
    y: 50.2,
    placesCount: 2,
  },

  // Turkey (Cappadocia)
  {
    id: "turkey-goreme",
    destinationSlug: "cappadocia",
    name: "Nevşehir (Göreme Valley)",
    type: "Province",
    x: 60.0,
    y: 39.2,
    placesCount: 2,
  },
  {
    id: "turkey-uchisar",
    destinationSlug: "cappadocia",
    name: "Uchisar Citadel",
    type: "Province",
    x: 62.2,
    y: 41.0,
    placesCount: 1,
  },

  // Greece
  {
    id: "greece-attica",
    destinationSlug: "greece",
    name: "Attica (Athens Historic)",
    type: "Region",
    x: 56.0,
    y: 38.0,
    placesCount: 1,
  },
  {
    id: "greece-cyclades",
    destinationSlug: "greece",
    name: "Cyclades (Santorini Caldera)",
    type: "Region",
    x: 57.8,
    y: 39.6,
    placesCount: 1,
  },
  {
    id: "greece-crete",
    destinationSlug: "greece",
    name: "Crete (Mediterranean Isles)",
    type: "Region",
    x: 57.2,
    y: 41.6,
    placesCount: 1,
  },
];
