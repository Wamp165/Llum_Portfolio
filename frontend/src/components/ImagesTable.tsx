import { useEffect, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

/* ---------- Types ---------- */

type WorkSectionImage = {
  id: number;
  imageUrl: string;
  order: number;
};

type DraftImage = WorkSectionImage & {
  isNew?: boolean;
};

type ImagesTableProps = {
  sectionId: number | null;
};

/* ---------- Component ---------- */

export default function ImagesTable({
  sectionId,
}: ImagesTableProps): JSX.Element {
  const [drafts, setDrafts] = useState<DraftImage[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  /* Load images when section changes */
  useEffect(() => {
    if (!sectionId) {
      setDrafts([]);
      return;
    }

    const fetchImages = async (): Promise<void> => {
      const response: AxiosResponse<WorkSectionImage[]> =
        await api.get(`/sections/${sectionId}/images`);
      setDrafts(response.data);
    };

    fetchImages();
  }, [sectionId]);

  /* ---------- Draft helpers ---------- */

  const updateDraft = (
    id: number,
    data: Partial<Pick<WorkSectionImage, "imageUrl" | "order">>
  ): void => {
    setDrafts((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...data } : img))
    );
  };

  const addImage = (): void => {
    setDrafts((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary id
        imageUrl: "",
        order: prev.length,
        isNew: true,
      },
    ]);
  };

  const deleteImage = async (id: number): Promise<void> => {
    await api.delete(`/sections/images/${id}`);
    setDrafts((prev) => prev.filter((img) => img.id !== id));
  };

  /* ---------- Save ---------- */

  const saveImages = async (): Promise<void> => {
    if (!sectionId) return;

    setSaving(true);

    try {
      for (const image of drafts) {
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

      const refreshed: AxiosResponse<WorkSectionImage[]> =
        await api.get(`/sections/${sectionId}/images`);

      setDrafts(refreshed.data);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Render ---------- */

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
            {drafts
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
                        updateDraft(img.id, {
                          order: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={img.imageUrl}
                      className="w-full bg-transparent outline-none"
                      onChange={(e) =>
                        updateDraft(img.id, {
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td className="text-right">
                    {!img.isNew && (
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="text-xs text-red-600 underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
