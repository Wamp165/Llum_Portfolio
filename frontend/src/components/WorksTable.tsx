import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

/**
 * Work entity as returned by the API
 */
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

/**
 * Editable Works table (metadata only)
 */
export default function WorksTable({
  categoryId,
  selectedWorkId,
  onViewWork,
}: WorksTableProps): JSX.Element {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Baseline snapshot used to detect changes
   */
  const baselineRef = useRef<Map<number, Work>>(new Map());

  /**
   * Fetch works when category changes
   */
  useEffect(() => {
    if (!categoryId) {
      setWorks([]);
      baselineRef.current.clear();
      return;
    }

    const fetchWorks = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<Work[]> = await api.get(
          `/categories/${categoryId}/works`
        );

        setWorks(response.data);

        const baseline = new Map<number, Work>();
        response.data.forEach((work) =>
          baseline.set(work.id, work)
        );
        baselineRef.current = baseline;
      } catch {
        setError("Failed to load works.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, [categoryId]);

  /**
   * Sorted works by explicit order
   */
  const sortedWorks = useMemo<Work[]>(() => {
    return works.slice().sort((a, b) => a.order - b.order);
  }, [works]);

  /**
   * Detect if there are unsaved changes
   */
  const isDirty = useMemo<boolean>(() => {
    const baseline = baselineRef.current;

    for (const work of works) {
      const base = baseline.get(work.id);
      if (!base) return true;

      if (
        work.title !== base.title ||
        work.description !== base.description ||
        (work.introduction ?? "") !==
          (base.introduction ?? "") ||
        (work.date ?? "") !== (base.date ?? "") ||
        (work.banner ?? "") !== (base.banner ?? "") ||
        work.order !== base.order
      ) {
        return true;
      }
    }

    return false;
  }, [works]);

  /**
   * Update local state only
   */
  const updateField = <K extends keyof Omit<Work, "id" | "createdAt" | "categoryId">>(
    id: number,
    field: K,
    value: Work[K]
  ): void => {
    setWorks((prev) =>
      prev.map((work) =>
        work.id === id ? { ...work, [field]: value } : work
      )
    );
  };

  /**
   * Create a new work
   */
  const addWork = async (): Promise<void> => {
    if (!categoryId) return;

    setError(null);

    const nextOrder =
      works.length === 0
        ? 0
        : Math.max(...works.map((w) => w.order)) + 1;

    try {
      const response: AxiosResponse<Work> =
        await api.post("/works", {
          title: "New work",
          description: "Description",
          introduction: "",
          date: "",
          banner: "",
          categoryId,
          order: nextOrder,
        });

      setWorks((prev) => [...prev, response.data]);
      baselineRef.current.set(response.data.id, response.data);
    } catch {
      setError("Failed to create work.");
    }
  };

  /**
   * Delete a work
   */
  const deleteWork = async (workId: number): Promise<void> => {
    setError(null);

    try {
      await api.delete(`/works/${workId}`);
      setWorks((prev) =>
        prev.filter((work) => work.id !== workId)
      );
      baselineRef.current.delete(workId);
    } catch {
      setError("Failed to delete work.");
    }
  };

  /**
   * Persist all modified works
   */
  const saveAllWorks = async (): Promise<void> => {
    setIsSaving(true);
    setError(null);

    try {
      await Promise.all(
        works.map((work) => {
          const baseline = baselineRef.current.get(work.id);

          if (
            baseline &&
            work.title === baseline.title &&
            work.description === baseline.description &&
            (work.introduction ?? "") ===
              (baseline.introduction ?? "") &&
            (work.date ?? "") === (baseline.date ?? "") &&
            (work.banner ?? "") ===
              (baseline.banner ?? "") &&
            work.order === baseline.order
          ) {
            return Promise.resolve();
          }

          return api.patch(`/works/${work.id}`, {
            title: work.title,
            description: work.description,
            introduction: work.introduction,
            date: work.date,
            banner: work.banner,
            order: work.order,
          });
        })
      );

      const refreshedBaseline = new Map<number, Work>();
      works.forEach((work) =>
        refreshedBaseline.set(work.id, work)
      );
      baselineRef.current = refreshedBaseline;
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
    <section className="border rounded-lg p-4 overflow-auto">
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

      {error && (
        <div className="mb-2 text-xs text-red-600">
          {error}
        </div>
      )}

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
              <th className="w-24" />
            </tr>
          </thead>

          <tbody>
            {sortedWorks.map((work) => (
              <tr
                key={work.id}
                className={`border-b last:border-b-0 ${
                  selectedWorkId === work.id
                    ? "bg-gray-50"
                    : ""
                }`}
              >
                <td className="py-1 pr-2">
                  <input
                    value={work.title}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(
                        work.id,
                        "title",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <textarea
                    rows={2}
                    value={work.description}
                    className="w-full resize-none bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(
                        work.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <textarea
                    rows={2}
                    value={work.introduction ?? ""}
                    className="w-full resize-none bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(
                        work.id,
                        "introduction",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    value={work.date ?? ""}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(
                        work.id,
                        "date",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    value={work.banner ?? ""}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(
                        work.id,
                        "banner",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="py-1 pr-2">
                  <input
                    type="number"
                    value={work.order}
                    className="w-full bg-transparent outline-none"
                    onChange={(e) =>
                      updateField(
                        work.id,
                        "order",
                        Number(e.target.value)
                      )
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
          </tbody>
        </table>
      )}
    </section>
  );
}
