import { useEffect, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

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
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setImages([]);

    if (!sectionId) return;

    const fetchImages = async (): Promise<void> => {
      const response: AxiosResponse<ImageRow[]> =
        await api.get(`/sections/${sectionId}/images`);
      setImages(response.data);
    };

    fetchImages();
  }, [sectionId]);

  const addImage = (): void => {
    if (!sectionId) return;

    setImages((prev) => [
      ...prev,
      {
        id: prev.length
          ? Math.min(...prev.map((i) => i.id)) - 1
          : -1,
        imageUrl: "",
        order: prev.length,
        isNew: true,
      },
    ]);
  };

  const updateLocal = (
    id: number,
    data: Partial<Pick<ImageRow, "imageUrl" | "order">>
  ): void => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...data } : img))
    );
  };

  const deleteImage = async (image: ImageRow): Promise<void> => {
    if (!sectionId) return;

    if (!image.isNew) {
      await api.delete(`/sections/images/${image.id}`);
    }

    setImages((prev) => prev.filter((img) => img.id !== image.id));
  };

  const saveImages = async (): Promise<void> => {
    if (!sectionId) return;

    setSaving(true);

    try {
      for (const image of images) {
        if (image.imageUrl.trim() === "") continue;

        if (image.isNew) {
          await api.post(`/sections/${sectionId}/images`, {
            imageUrl: image.imageUrl,
            order: image.order,
          });
        } else {
          await api.patch(`/sections/images/${image.id}`, {
            imageUrl: image.imageUrl,
            order: image.order,
          });
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
    <section className="border rounded-lg p-4 h-[420px] overflow-y-auto">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Images</h3>
        <div className="space-x-3">
          <button
            onClick={addImage}
            disabled={!sectionId}
            className="text-xs underline disabled:opacity-50"
          >
            Add
          </button>
          <button
            onClick={saveImages}
            disabled={!sectionId || saving}
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
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="w-16 text-left">Order</th>
              <th className="text-left">Image URL</th>
              <th className="w-20 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {images
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((img) => (
                <tr key={img.id} className="border-b">
                  <td>
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

                  <td>
                    <input
                      value={img.imageUrl}
                      placeholder="https://..."
                      className="w-full bg-transparent outline-none"
                      onChange={(e) =>
                        updateLocal(img.id, {
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td className="text-right">
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
      )}
    </section>
  );
}
