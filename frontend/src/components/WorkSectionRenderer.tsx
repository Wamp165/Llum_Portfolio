import type { WorkSection, WorkSectionImage } from "../types/work";

interface WorkSectionRendererProps {
  section: WorkSection;
}

export default function WorkSectionRenderer({
  section,
}: WorkSectionRendererProps) {
  const images = [...section.images].sort(
    (a, b) => a.order - b.order
  );

  switch (section.type) {
    case "IMAGE_LEFT_TEXT_RIGHT":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <ImageColumn images={images} />
          <TextBlock text={section.text} />
        </div>
      );

    case "IMAGE_RIGHT_TEXT_LEFT":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <TextBlock text={section.text} />
          <ImageColumn images={images} />
        </div>
      );

    case "IMAGE_CENTER_TEXT_BELOW":
      return (
        <div className="space-y-10 text-center">
          <ImageColumn images={images} />
          <TextBlock text={section.text} centered />
        </div>
      );

    case "TEXT_ONLY":
      return (
        <div className="max-w-[600px]">
          <TextBlock text={section.text} />
        </div>
      );

    case "IMAGE_ONLY":
      return <ImageColumn images={images} />;

    default:
      return null;
  }
}

/* ---------- Shared Blocks ---------- */

interface ImageColumnProps {
  images: WorkSectionImage[];
}

interface ImageColumnProps {
  images: WorkSectionImage[];
}

function ImageColumn({ images }: ImageColumnProps) {
  const count = images.length;

  let layoutClass = "space-y-6";

  if (count === 2) {
    layoutClass = "grid grid-cols-1 sm:grid-cols-2 gap-6";
  }

  if (count === 3) {
    layoutClass = "grid grid-cols-1 sm:grid-cols-3 gap-6";
  }

  return (
    <div className={layoutClass}>
      {images.map((img) => (
        <img
          key={img.id}
          src={img.imageUrl}
          alt=""
          className="w-full h-auto"
        />
      ))}
    </div>
  );
}


interface TextBlockProps {
  text: string | null;
  centered?: boolean;
}

function TextBlock({ text, centered = false }: TextBlockProps) {
  if (!text) return null;

  return (
    <p
      className={`text-sm leading-relaxed whitespace-pre-line ${
        centered
          ? "mx-auto max-w-[600px] text-center"
          : "max-w-[600px]"
      }`}
    >
      {text}
    </p>
  );
}
