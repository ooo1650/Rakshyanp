// Emergency directory: the single source of truth for every page.
// Numbers are Nepal's public toll-free lines. Verify them periodically.
// Names, tags and descriptions live in src/i18n (key = id) so they translate.
export const HELPLINES = [
  { id: "police", number: "100", icon: "shield", urgent: true },
  { id: "women", number: "1145", icon: "woman" },
  { id: "child", number: "1098", icon: "child" },
  { id: "tpo", number: "16600102005", display: "1660-010-2005", icon: "heart" },
  { id: "ambulance", number: "102", icon: "cross" },
  { id: "tourist", number: "1144", icon: "compass" },
  { id: "fire", number: "101", icon: "flame" },
];

export const telHref = (n) => "tel:" + n.replace(/[^\d+]/g, "");
