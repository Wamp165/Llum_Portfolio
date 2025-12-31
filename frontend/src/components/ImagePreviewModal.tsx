import type { JSX } from "react";

type ImagePreviewModalProps = {
  imageUrl: string;
  onClose: () => void;
};

export default function ImagePreviewModal({
  imageUrl,
  onClose,
}: ImagePreviewModalProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <img
          src={imageUrl}
          alt="Image preview"
          className="max-w-full max-h-[90vh] rounded shadow-lg"
        />
      </div>
    </div>
  );
}
