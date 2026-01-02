import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";
import ImagePreviewModal from "./ImagePreviewModal";
import PreviewableUrlInput from "./PreviewableUrlInput";

type WorkRow = {
  id: number; // >0 backend, <0 draft
  title: string;
  description: string;
  introduction?: string | null;
  date?: string | null;
  banner?: string | null;
  order: number;
  createdAt?: string;
  categoryId?: number;
  isNew?: boolean;
};

type WorksTableProps = {
  categoryId: number | null;
  selectedWorkId: number | null;
  onViewWork: (workId: number) => void;
  onWorkDeleted?: (workId: number) => void;
};

export default function WorksTable({
  categoryId,
  selectedWorkId,
  onViewWork,
  onWorkDeleted,
}: WorksTableProps): JSX.Element {
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const baselineRef = useRef<Map<number, WorkRow>>(new Map());

  // Fetch works
  useEffect(() => {
    if (!categoryId) {
      setWorks([]);
      baselineRef.current.clear();
      return;
    }

    const fetchWorks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res: AxiosResponse<WorkRow[]> = await api.get(
          `/categories/${categoryId}/works`
        );

        setWorks(res.data);

        const baseline = new Map<number, WorkRow>();
        res.data.forEach((w) => baseline.set(w.id, w));
        baselineRef.current = baseline;
      } catch {
        setError("Failed to load works.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [categoryId]);

  // Sorted works
  const sortedWorks = useMemo(
    () => works.slice().sort((a, b) => a.order - b.order),
    [works]
  );

  // Dirty check
  const isDirty = useMemo(() => {
    for (const w of works) {
      if (w.isNew) return true;

      const b = baselineRef.current.get(w.id);
      if (!b) return true;

      if (
        w.title !== b.title ||
        w.description !== b.description ||
        (w.introduction ?? "") !== (b.introduction ?? "") ||
        (w.date ?? "") !== (b.date ?? "") ||
        (w.banner ?? "") !== (b.banner ?? "") ||
        w.order !== b.order
      ) {
        return true;
      }
    }
    return false;
  }, [works]);

  // Update field
  const updateField = <
    K extends keyof Omit<WorkRow, "id" | "isNew">
  >(
    id: number,
    field: K,
    value: WorkRow[K]
  ) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  // Add work (ID negativo)
  const addWork = () => {
    if (!categoryId) return;

    setWorks((prev) => {
      const minId = prev.length
        ? Math.min(...prev.map((w) => w.id))
        : 0;

      const maxOrder = prev.length
        ? Math.max(...prev.map((w) => w.order))
        : -1;

      return [
        ...prev,
        {
          id: minId - 1,
          title: "New work",
          description: "Description",
          introduction: "",
          date: "",
          banner: "",
          order: maxOrder + 1,
          isNew: true,
        },
      ];
    });
  };

  // Delete
  const deleteWork = async (work: WorkRow) => {
    try {
      if (!work.isNew) {
        await api.delete(`/works/${work.id}`);
        baselineRef.current.delete(work.id);
        onWorkDeleted?.(work.id);
      }

      setWorks((prev) => prev.filter((w) => w.id !== work.id));
    } catch {
      setError("Failed to delete work.");
    }
  };

  // Save all
  const saveAllWorks = async () => {
    if (!categoryId) return;

    setIsSaving(true);
    setError(null);

    try {
      for (const w of works) {
        if (w.isNew) {
          await api.post("/works", {
            title: w.title,
            description: w.description,
            introduction: w.introduction || undefined,
            date: w.date || undefined,
            banner: w.banner || undefined,
            order: w.order,
            categoryId,
          });
        } else {
          const b = baselineRef.current.get(w.id);
          if (!b) continue;

          const unchanged =
            w.title === b.title &&
            w.description === b.description &&
            (w.introduction ?? "") === (b.introduction ?? "") &&
            (w.date ?? "") === (b.date ?? "") &&
            (w.banner ?? "") === (b.banner ?? "") &&
            w.order === b.order;

          if (!unchanged) {
            await api.patch(`/works/${w.id}`, {
              title: w.title,
              description: w.description,
              introduction: w.introduction,
              date: w.date,
              banner: w.banner,
              order: w.order,
            });
          }
        }
      }

      const refreshed: AxiosResponse<WorkRow[]> = await api.get(
        `/categories/${categoryId}/works`
      );

      setWorks(refreshed.data);

      baselineRef.current.clear();
      refreshed.data.forEach((w) => baselineRef.current.set(w.id, w));
    } catch {
      setError("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Render
  if (!categoryId) {
    return (
      <section className="border rounded-lg p-4 text-sm text-gray-400">
        Select a category to view works.
      </section>
    );
  }

  return (
    <section className="border rounded-lg p-4 h-[300px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">Works</h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={addWork}
            className="text-xs underline underline-offset-4"
          >
            Add
          </button>

          <button
            type="button"
            onClick={saveAllWorks}
            disabled={!isDirty || isSaving}
            className="text-xs underline underline-offset-4 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && <div className="mb-2 text-xs text-red-600">{error}</div>}

      {isLoading ? (
        <div className="text-sm">Loading works…</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left py-1">Title</th>
              <th className="text-left py-1">Description</th>
              <th className="text-left py-1">Introduction</th>
              <th className="text-left py-1 w-24">Date</th>
              <th className="text-left py-1">Banner</th>
              <th className="text-left py-1 w-16">Order</th>
              <th className="w-28" />
            </tr>
          </thead>

          <tbody>
            {sortedWorks.map((work) => (
              <tr
                key={work.id}
                className={`border-b last:border-b-0 ${
                  selectedWorkId === work.id ? "bg-gray-50" : ""
                }`}
              >
                <td className="py-1 pr-2">
                  <input
                    value={work.title}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(work.id, "title", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <textarea
                    rows={2}
                    value={work.description}
                    className="w-full resize-none bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(work.id, "description", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <textarea
                    rows={2}
                    value={work.introduction ?? ""}
                    className="w-full resize-none bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(work.id, "introduction", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    value={work.date ?? ""}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(work.id, "date", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <PreviewableUrlInput
                    value={work.banner ?? ""}
                    onChange={(v) => updateField(work.id, "banner", v)}
                    onPreview={setPreviewUrl}
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    type="number"
                    value={work.order}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(work.id, "order", Number(e.target.value))
                    }
                  />
                </td>

                <td className="py-1 text-right whitespace-nowrap">
                  {!work.isNew && (
                    <button
                      type="button"
                      onClick={() => onViewWork(work.id)}
                      className="text-xs underline underline-offset-4 mr-3"
                    >
                      View
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteWork(work)}
                    className="text-xs text-red-600 underline underline-offset-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
