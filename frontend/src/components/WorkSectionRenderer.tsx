import type { WorkSection } from "../types/WorkSection";

export default function WorkSectionRenderer({ section }: { section: WorkSection }) {
  const { type, text, image } = section;

  const Img = image ? (
    <img src={image} className="w-[420px] object-cover" alt="" />
  ) : null;

  const Txt = text ? (
    <p className="w-[380px] text-[15px] leading-relaxed">{text}</p>
  ) : null;

  switch (type) {
    case "IMAGE_LEFT_TEXT_RIGHT":
      return (
        <div className="flex justify-center items-start gap-16">
          {Img}
          {Txt}
        </div>
      );

    case "IMAGE_RIGHT_TEXT_LEFT":
      return (
        <div className="flex justify-center items-start gap-16">
          {Txt}
          {Img}
        </div>
      );

    case "IMAGE_CENTER":
        return (
            <div className="flex flex-col items-center justify-center gap-6">
            {Img}
            {Txt}
        </div>
  );



    case "TEXT_ONLY":
      return <div className="flex justify-center">{Txt}</div>;

    case "IMAGE_ONLY":
      return <div className="flex justify-center">{Img}</div>;

    default:
      return null;
  }
}
