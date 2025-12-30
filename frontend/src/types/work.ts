export type WorkSectionType =
  | "IMAGE_LEFT_TEXT_RIGHT"
  | "IMAGE_RIGHT_TEXT_LEFT"
  | "IMAGE_CENTER_TEXT_BELOW"
  | "TEXT_ONLY"
  | "IMAGE_ONLY";

export interface WorkSectionImage {
  id: number;
  imageUrl: string;
  order: number;
}

export interface WorkSection {
  id: number;
  type: WorkSectionType;
  text: string | null;
  order: number;
  images: WorkSectionImage[];
}
