export interface PackingItem {
  id: string;
  name: string;
  category: "documents" | "clothing" | "gear" | "health";
  essential?: boolean;
}

export const BASE_DOCUMENTS: PackingItem[] = [
  { id: "doc-passport", name: "Passport & valid visa copies (physical + digital)", category: "documents", essential: true },
  { id: "doc-insurance", name: "Travel health insurance policy & emergency claim number", category: "documents", essential: true },
  { id: "doc-cards", name: "Multi-currency travel forex card & backup credit card", category: "documents", essential: true },
  { id: "doc-adapter", name: "Universal international power plug adapter", category: "documents", essential: true },
  { id: "doc-bookings", name: "Flight tickets & lodging confirmation vouchers", category: "documents" },
  { id: "doc-license", name: "International Driving Permit (IDP) if renting a car", category: "documents" },
];

export const BASE_TECH: PackingItem[] = [
  { id: "tech-powerbank", name: "10,000–20,000mAh airline-safe portable power bank", category: "gear", essential: true },
  { id: "tech-cables", name: "Braided charging cables (USB-C & Lightning)", category: "gear", essential: true },
  { id: "tech-headphones", name: "Active noise-canceling headphones for transit", category: "gear" },
  { id: "tech-maps", name: "Offline maps & translation packs pre-downloaded on phone", category: "gear", essential: true },
  { id: "tech-camera", name: "Camera / extra SD memory cards & lens wipes", category: "gear" },
  { id: "tech-airtag", name: "Luggage tracking tag (AirTag / SmartTag)", category: "gear" },
];

export const BASE_HEALTH: PackingItem[] = [
  { id: "hlth-meds", name: "Prescription medications with original doctor script", category: "health", essential: true },
  { id: "hlth-firstaid", name: "Compact first aid kit (bandages, antiseptic wipes, blister pads)", category: "health" },
  { id: "hlth-pain", name: "Pain reliever / anti-inflammatory (ibuprofen / paracetamol)", category: "health" },
  { id: "hlth-motion", name: "Motion sickness pills (for mountain curves, ferries, boats)", category: "health" },
  { id: "hlth-lip", name: "Moisturizing lip balm with SPF protection", category: "health" },
  { id: "hlth-hydration", name: "Electrolyte rehydration drink sachets", category: "health" },
];

export function getSmartPackingItems(
  destinationSlug: string,
  temperatureStr: string
): Record<"documents" | "clothing" | "gear" | "health", PackingItem[]> {
  const tempNumber = parseInt(temperatureStr) || 15;
  const isCold = tempNumber <= 10;
  const isTropical = tempNumber >= 20;

  const clothingItems: PackingItem[] = [];

  if (isCold) {
    clothingItems.push(
      { id: "clth-thermal-base", name: "Thermal merino wool base layers (top & bottom)", category: "clothing", essential: true },
      { id: "clth-winter-shell", name: "Windproof & waterproof insulated winter jacket", category: "clothing", essential: true },
      { id: "clth-fleece", name: "Fleece or down mid-layer sweater", category: "clothing" },
      { id: "clth-boots", name: "Waterproof ankle boots with deep traction tread", category: "clothing", essential: true },
      { id: "clth-gloves", name: "Touchscreen-compatible thermal gloves & warm beanie", category: "clothing", essential: true },
      { id: "clth-wool-socks", name: "Merino wool thick thermal socks (3-4 pairs)", category: "clothing" },
      { id: "clth-gaiter", name: "Thermal neck gaiter / wind-stopping scarf", category: "clothing" },
      { id: "clth-sunglasses-glare", name: "Polarized sunglasses (critical for snow/ice glare)", category: "clothing" }
    );
  } else if (isTropical) {
    clothingItems.push(
      { id: "clth-linen", name: "Breathable linen & lightweight cotton shirts", category: "clothing", essential: true },
      { id: "clth-shorts", name: "Lightweight shorts & breezy trousers / dresses", category: "clothing" },
      { id: "clth-swim", name: "Swimwear (2 sets) & fast-drying travel towel", category: "clothing", essential: true },
      { id: "clth-sunglasses-uv", name: "UV400 polarized sunglasses & wide-brim sun hat", category: "clothing", essential: true },
      { id: "clth-rain-light", name: "Packable ultralight rain jacket / windbreaker", category: "clothing" },
      { id: "clth-sandals", name: "Comfortable walking sandals & water-resistant shoes", category: "clothing" },
      { id: "clth-sneakers", name: "Cushioned walking sneakers for city and cliffside steps", category: "clothing", essential: true }
    );
  } else {
    // Moderate climate (e.g. Paris, Netherlands, NY in spring/fall)
    clothingItems.push(
      { id: "clth-layer-jacket", name: "Versatile medium-weight jacket / stylish trench coat", category: "clothing", essential: true },
      { id: "clth-comfortable-sneakers", name: "Broken-in walking sneakers for 15k+ steps/day", category: "clothing", essential: true },
      { id: "clth-sweaters", name: "Layerable knit sweaters or cardigans", category: "clothing" },
      { id: "clth-jeans-chinos", name: "Comfortable stretch denim or casual chinos", category: "clothing" },
      { id: "clth-rain-umbrella", name: "Compact travel umbrella / wind-resistant shell", category: "clothing", essential: true },
      { id: "clth-evening-outfit", name: "Smart-casual dinner outfit for bistros & dining", category: "clothing" }
    );
  }

  // Destination-specific special additions
  const specialHealth: PackingItem[] = [...BASE_HEALTH];
  if (destinationSlug === "norway" || destinationSlug === "switzerland") {
    specialHealth.push({ id: "hlth-handwarmers", name: "Pocket chemical hand warmers for sub-zero evenings", category: "health" });
  }
  if (destinationSlug === "ladakh") {
    specialHealth.push({ id: "hlth-altitude", name: "Diamox / altitude sickness preventative medication", category: "health", essential: true });
  }
  if (destinationSlug === "amalfi-coast" || destinationSlug === "greece") {
    specialHealth.push({ id: "hlth-water-shoes", name: "Pebble beach water shoes & reef-safe mineral sunscreen SPF 50+", category: "health", essential: true });
  }
  if (destinationSlug === "chiang-mai") {
    specialHealth.push({ id: "hlth-mosquito", name: "DEET insect & mosquito repellent spray", category: "health", essential: true });
  }

  return {
    documents: [...BASE_DOCUMENTS],
    clothing: clothingItems,
    gear: [...BASE_TECH],
    health: specialHealth,
  };
}
