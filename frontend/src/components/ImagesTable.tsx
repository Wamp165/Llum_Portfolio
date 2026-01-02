import { useEffect, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";
import ImagePreviewModal from "./ImagePreviewModal";
import PreviewableUrlInput from "./PreviewableUrlInput";

type ImageRow = {
  id: number;
  imageUrl: string;
  order: number;
  isNew?: boolean;
};

type ImagesTableProps = {
  sectionId: number | null;
};

export default function ImagesTable({
  sectionId,
}: ImagesTableProps): JSX.Element {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setImages([]);

    if (!sectionId) return;

    const fetchImages = async () => {
      const res: AxiosResponse<ImageRow[]> =
        await api.get(`/sections/${sectionId}/images`);
      setImages(res.data);
    };

    fetchImages();
  }, [sectionId]);

  const updateLocal = (
    id: number,
    data: Partial<Pick<ImageRow, "imageUrl" | "order">>
  ) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...data } : img))
    );
  };

  const addImage = () => {
    if (!sectionId) return;

    setImages((prev) => [
      ...prev,
      {
        id: prev.length ? Math.min(...prev.map((i) => i.id)) - 1 : -1,
        imageUrl: "",
        order: prev.length + 1,
        isNew: true,
      },
    ]);
  };

  const deleteImage = async (image: ImageRow) => {
    if (!sectionId) return;

    if (!image.isNew) {
      await api.delete(`/sections/images/${image.id}`);
    }

    setImages((prev) => prev.filter((i) => i.id !== image.id));
  };

  const saveImages = async () => {
    if (!sectionId) return;

    setSaving(true);

    try {
      for (const image of images) {
        if (!image.imageUrl.trim()) continue;

        if (image.isNew) {
          await api.post(`/sections/${sectionId}/images`, image);
        } else {
          await api.patch(`/sections/images/${image.id}`, image);
        }
      }

      const refreshed: AxiosResponse<ImageRow[]> =
        await api.get(`/sections/${sectionId}/images`);
      setImages(refreshed.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border rounded-lg p-4 h-[420px] flex flex-col">
      <div className="flex justify-between mb-2 shrink-0">
        <h3 className="text-sm font-medium">Images</h3>
        <div className="space-x-3">
          <button onClick={addImage} className="text-xs underline">
            Add
          </button>
          <button
            onClick={saveImages}
            disabled={saving}
            className="text-xs underline disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      {!sectionId ? (
        <div className="text-sm text-gray-400">
          Select a section to view images
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b text-gray-500">
                <th className="w-16 text-left py-1">Order</th>
                <th className="text-left py-1">Image URL</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {images
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((img) => (
                  <tr key={img.id} className="border-b last:border-b-0">
                    <td className="py-1">
                      <input
                        type="number"
                        value={img.order}
                        className="w-14 bg-transparent outline-none"
                        onChange={(e) =>
                          updateLocal(img.id, {
                            order: Number(e.target.value),
                          })
                        }
                      />
                    </td>

                    <td className="py-1">
                      <PreviewableUrlInput
                        value={img.imageUrl}
                        onChange={(v) =>
                          updateLocal(img.id, { imageUrl: v })
                        }
                        onPreview={setPreviewUrl}
                      />
                    </td>

                    <td className="py-1 text-right">
                      <button
                        onClick={() => deleteImage(img)}
                        className="text-xs text-red-600 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {previewUrl && (
        <ImagePreviewModal
          imageUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </section>
  );
}
