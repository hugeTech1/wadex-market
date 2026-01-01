import { fetchConfig } from "../../../services/config.service";

export interface Suggestion {
  label: string;
  fullAddress: string;
}

interface GooglePlacePrediction {
  placePrediction?: {
    text?: {
      text?: string;
    };
  };
}

interface GooglePlacesResponse {
  suggestions?: GooglePlacePrediction[];
}

export const getPlaceSuggestions = async (
  query: string
): Promise<Suggestion[]> => {
  if (!query.trim()) return [];

  try {
    const config = await fetchConfig();
    const apiKey = config.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.error("Google Places API key not found in config.js");
      return [];
    }

    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input: query,
        regionCode: "GB",
      }),
    });

    const data: GooglePlacesResponse = await response.json();

    return (
      data?.suggestions?.map((s) => {
        const fullAddress = s.placePrediction?.text?.text ?? "";
        return { label: fullAddress, fullAddress };
      }) ?? []
    );
  } catch (error) {
    console.error("Google Places API error:", error);
    return [];
  }
};