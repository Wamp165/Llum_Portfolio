export type WorkSectionType =
  | "IMAGE_LEFT_TEXT_RIGHT"
  | "IMAGE_RIGHT_TEXT_LEFT"
  | "IMAGE_CENTER"
  | "TEXT_ONLY"
  | "IMAGE_ONLY";

export interface WorkSection {
  id: number;
  type: WorkSectionType;
  text?: string;
  image?: string;
  order: number;
}
