import { ogCard, OG_SIZE, OG_TYPE } from "@/app/_og/card";
import { ogCards } from "@/content/site";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = ogCards.news.title;

export default function Image() {
  return ogCard(ogCards.news.eyebrow, ogCards.news.title);
}
