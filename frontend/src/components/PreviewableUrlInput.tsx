import { useRef } from "react";

type PreviewableUrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  onPreview: (url: string) => void;
};

export default function PreviewableUrlInput({
  value,
  onChange,
  onPreview,
}: PreviewableUrlInputProps) {
  const longPressRef = useRef<number | null>(null);

  return (
    <input
      value={value}
      placeholder="https://..."
      className="w-full bg-transparent outline-none"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => {
        // Desktop: Ctrl (Windows/Linux) or Cmd (Mac) + click
        if ((e.ctrlKey || e.metaKey) && value) {
          e.preventDefault();
          onPreview(value);
        }
      }}
      onTouchStart={() => {
        // Mobile: long press to open preview
        if (!value) return;

        longPressRef.current = window.setTimeout(() => {
          onPreview(value);
        }, 500);
      }}
      onTouchEnd={() => {
        // Cancel long press
        if (longPressRef.current) {
          clearTimeout(longPressRef.current);
          longPressRef.current = null;
        }
      }}
      onTouchMove={() => {
        // Cancel if finger moves
        if (longPressRef.current) {
          clearTimeout(longPressRef.current);
          longPressRef.current = null;
        }
      }}
    />
  );
}
