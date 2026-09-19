import type { ImageMetadata } from "astro";
import commercialConstructionImage from "../components/commercial & construction cleanup.jpg";
import residentialImage from "../components/residential cleaning.jpg";
import commercialImage from "../components/commercial cleaning.jpg";
import airbnbImage from "../components/airbnb & vacation rental cleaning.jpg";
import moveInMoveOutImage from "../components/move in move out cleaning.jpg";
import deepCleaningImage from "../components/deep cleaning.jpg";

// One photo per service, keyed by the slug in site.config.ts. Shared by the
// homepage service cards and the services page so both always show the same shot.
export const serviceImages: Record<string, ImageMetadata> = {
  "commercial-construction": commercialConstructionImage,
  residential: residentialImage,
  commercial: commercialImage,
  airbnb: airbnbImage,
  "move-in-move-out": moveInMoveOutImage,
  "deep-cleaning": deepCleaningImage,
};
