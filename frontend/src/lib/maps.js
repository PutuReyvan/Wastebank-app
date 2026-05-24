const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

export function googlePlaceEmbedUrl(place) {
  const fallbackQuery = encodeURIComponent(place?.name && place?.address
    ? `${place.name}, ${place.address}`
    : `${place?.lat || ""},${place?.lng || ""}`);

  if (!GOOGLE_MAPS_API_KEY) {
    return `https://www.google.com/maps?q=${fallbackQuery}&z=15&output=embed`;
  }

  const q = place?.external_id
    ? `place_id:${place.external_id}`
    : place?.name && place?.address
      ? `${place.name}, ${place.address}`
      : `${place?.lat || ""},${place?.lng || ""}`;

  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(q)}&zoom=15`;
}
