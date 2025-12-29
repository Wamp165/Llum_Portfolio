import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

type Work = {
  id: number;
  title: string;
  description: string;
  introduction?: string | null;
  date?: string | null;
  banner?: string | null;
  order: number;
  createdAt: string;
  categoryId: number;
};

type WorksTableProps = {
  categoryId: number | null;
  selectedWorkId: number | null;
  onViewWork: (workId: number) => void;
};

type NewWorkDraft = {
  clientId: string;
  title: string;
  description: string;
  introduction: string;
  date: string;
  banner: string;
  order: number;
};

export default function WorksTable({
  categoryId,
  selectedWorkId,
  onViewWork,
}: WorksTableProps): JSX.Element {
  const [works, setWorks] = useState<Work[]>([]);
  const [newDrafts, setNewDrafts] = useState<NewWorkDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baselineRef = useRef<Map<number, Work>>(new Map());

  useEffect(() => {
    if (!categoryId) {
      setWorks([]);
      setNewDrafts([]);
      baselineRef.current.clear();
      return;
    }

    const fetchWorks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<Work[]> = await api.get(
          `/categories/${categoryId}/works`
        );

        setWorks(response.data);
        setNewDrafts([]);

        const baseline = new Map<number, Work>();
        response.data.forEach((w) => baseline.set(w.id, w));
        baselineRef.current = baseline;
      } catch {
        setError("Failed to load works.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [categoryId]);

  const sortedWorks = useMemo(
    () => works.slice().sort((a, b) => a.order - b.order),
    [works]
  );

  const sortedDrafts = useMemo(
    () => newDrafts.slice().sort((a, b) => a.order - b.order),
    [newDrafts]
  );

  const isDirty = useMemo(() => {
    if (newDrafts.length > 0) return true;

    for (const work of works) {
      const base = baselineRef.current.get(work.id);
      if (!base) return true;

      if (
        work.title !== base.title ||
        work.description !== base.description ||
        (work.introduction ?? "") !== (base.introduction ?? "") ||
        (work.date ?? "") !== (base.date ?? "") ||
        (work.banner ?? "") !== (base.banner ?? "") ||
        work.order !== base.order
      ) {
        return true;
      }
    }

    return false;
  }, [works, newDrafts]);

  const updateField = <
    K extends keyof Omit<Work, "id" | "createdAt" | "categoryId">
  >(
    id: number,
    field: K,
    value: Work[K]
  ) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const updateDraftField = <
    K extends keyof Omit<NewWorkDraft, "clientId">
  >(
    clientId: string,
    field: K,
    value: NewWorkDraft[K]
  ) => {
    setNewDrafts((prev) =>
      prev.map((d) => (d.clientId === clientId ? { ...d, [field]: value } : d))
    );
  };

  const addWork = () => {
    if (!categoryId) return;

    const maxOrder = Math.max(
      -1,
      ...works.map((w) => w.order),
      ...newDrafts.map((d) => d.order)
    );

    setNewDrafts((prev) => [
      ...prev,
      {
        clientId: crypto.randomUUID(),
        title: "New work",
        description: "Description",
        introduction: "",
        date: "",
        banner: "",
        order: maxOrder + 1,
      },
    ]);
  };

  const deleteWork = async (id: number) => {
    try {
      await api.delete(`/works/${id}`);
      setWorks((prev) => prev.filter((w) => w.id !== id));
      baselineRef.current.delete(id);
    } catch {
      setError("Failed to delete work.");
    }
  };

  const deleteDraft = (clientId: string) => {
    setNewDrafts((prev) => prev.filter((d) => d.clientId !== clientId));
  };

  const saveAllWorks = async () => {
    if (!categoryId) return;

    setIsSaving(true);
    setError(null);

    try {
      if (newDrafts.length > 0) {
        const created = await Promise.all(
          newDrafts.map(async (d) => {
            const res: AxiosResponse<Work> = await api.post("/works", {
              title: d.title,
              description: d.description,
              introduction: d.introduction || undefined,
              date: d.date || undefined,
              banner: d.banner || undefined,
              order: d.order,
              categoryId,
            });
            return res.data;
          })
        );

        setWorks((prev) => [...prev, ...created]);
        created.forEach((w) => baselineRef.current.set(w.id, w));
        setNewDrafts([]);
      }

      await Promise.all(
        works.map((w) => {
          const b = baselineRef.current.get(w.id);
          if (
            b &&
            w.title === b.title &&
            w.description === b.description &&
            (w.introduction ?? "") === (b.introduction ?? "") &&
            (w.date ?? "") === (b.date ?? "") &&
            (w.banner ?? "") === (b.banner ?? "") &&
            w.order === b.order
          ) {
            return Promise.resolve();
          }

          return api.patch(`/works/${w.id}`, {
            title: w.title,
            description: w.description,
            introduction: w.introduction,
            date: w.date,
            banner: w.banner,
            order: w.order,
          });
        })
      );

      const refreshed = new Map<number, Work>();
      works.forEach((w) => refreshed.set(w.id, w));
      baselineRef.current = refreshed;
    } catch {
      setError("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

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
                  <input
                    value={work.banner ?? ""}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(work.id, "banner", e.target.value)
                    }
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
                  <button
                    type="button"
                    onClick={() => onViewWork(work.id)}
                    className="text-xs underline underline-offset-4 mr-3"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteWork(work.id)}
                    className="text-xs text-red-600 underline underline-offset-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {sortedDrafts.map((draft) => (
              <tr key={draft.clientId} className="border-b last:border-b-0">
                <td className="py-1 pr-2">
                  <input
                    value={draft.title}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateDraftField(draft.clientId, "title", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <textarea
                    rows={2}
                    value={draft.description}
                    className="w-full resize-none bg-transparent outline-none"
                    onChange={(e) =>
                      updateDraftField(
                        draft.clientId,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <textarea
                    rows={2}
                    value={draft.introduction}
                    className="w-full resize-none bg-transparent outline-none"
                    onChange={(e) =>
                      updateDraftField(
                        draft.clientId,
                        "introduction",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    value={draft.date}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateDraftField(draft.clientId, "date", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    value={draft.banner}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateDraftField(draft.clientId, "banner", e.target.value)
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    type="number"
                    value={draft.order}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateDraftField(
                        draft.clientId,
                        "order",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td className="py-1 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => deleteDraft(draft.clientId)}
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
    </section>
  );
}
