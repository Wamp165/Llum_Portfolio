import { useEffect, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

/* ---------- Types ---------- */

export type WorkSectionType =
  | "IMAGE_LEFT_TEXT_RIGHT"
  | "IMAGE_RIGHT_TEXT_LEFT"
  | "IMAGE_CENTER_TEXT_BELOW"
  | "TEXT_ONLY"
  | "IMAGE_ONLY";

type WorkSection = {
  id: number;
  type: WorkSectionType;
  text?: string | null;
  order: number;
};

type DraftSection = WorkSection & {
  isNew?: boolean;
};

type WorkSectionsTableProps = {
  workId: number | null;
  selectedSectionId: number | null;
  onViewSection: (sectionId: number) => void;
};

const SECTION_TYPES: WorkSectionType[] = [
  "IMAGE_LEFT_TEXT_RIGHT",
  "IMAGE_RIGHT_TEXT_LEFT",
  "IMAGE_CENTER_TEXT_BELOW",
  "TEXT_ONLY",
  "IMAGE_ONLY",
];

/* ---------- Component ---------- */

export default function WorkSectionsTable({
  workId,
  selectedSectionId,
  onViewSection,
}: WorkSectionsTableProps): JSX.Element {
  const [drafts, setDrafts] = useState<DraftSection[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  /* Load sections when work changes */
  useEffect(() => {
    if (!workId) {
      setDrafts([]);
      return;
    }

    const fetchSections = async (): Promise<void> => {
      const response: AxiosResponse<WorkSection[]> =
        await api.get(`/works/${workId}/sections`);
      setDrafts(response.data);
    };

    fetchSections();
  }, [workId]);

  /* ---------- Draft helpers ---------- */

  const updateDraft = (
    id: number,
    data: Partial<Pick<WorkSection, "order" | "type" | "text">>
  ): void => {
    setDrafts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const addSection = (): void => {
    setDrafts((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary id
        type: "TEXT_ONLY",
        text: "",
        order: prev.length,
        isNew: true,
      },
    ]);
  };

  const deleteSection = async (id: number): Promise<void> => {
    await api.delete(`/works/sections/${id}`);
    setDrafts((prev) => prev.filter((s) => s.id !== id));
  };

  /* ---------- Save ---------- */

  const saveSections = async (): Promise<void> => {
    if (!workId) return;

    setSaving(true);

    try {
      for (const section of drafts) {
        if (section.isNew) {
          await api.post(`/works/${workId}/sections`, {
            type: section.type,
            text: section.text,
            order: section.order,
          });
        } else {
          await api.patch(`/works/sections/${section.id}`, {
            type: section.type,
            text: section.text,
            order: section.order,
          });
        }
      }

      const refreshed: AxiosResponse<WorkSection[]> =
        await api.get(`/works/${workId}/sections`);

      setDrafts(refreshed.data);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Render ---------- */

  return (
    <section className="border rounded-lg p-4 h-[420px] overflow-y-auto">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Sections</h3>
        <div className="space-x-3">
          <button onClick={addSection} className="text-xs underline">
            Add
          </button>
          <button
            onClick={saveSections}
            disabled={saving}
            className="text-xs underline disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      {!workId ? (
        <div className="text-sm text-gray-400">
          Select a work to view sections
        </div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="w-16 text-left">Order</th>
              <th className="w-56 text-left">Type</th>
              <th className="text-left">Text</th>
              <th className="w-32 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drafts
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <tr
                  key={section.id}
                  className={`border-b ${
                    selectedSectionId === section.id
                      ? "bg-gray-50"
                      : ""
                  }`}
                >
                  <td>
                    <input
                      type="number"
                      value={section.order}
                      className="w-14 bg-transparent outline-none"
                      onChange={(e) =>
                        updateDraft(section.id, {
                          order: Number(e.target.value),
                        })
                      }
                    />
                  </td>

                  <td>
                    <select
                      value={section.type}
                      className="bg-transparent outline-none"
                      onChange={(e) =>
                        updateDraft(section.id, {
                          type: e.target.value as WorkSectionType,
                        })
                      }
                    >
                      {SECTION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      value={section.text ?? ""}
                      className="w-full bg-transparent outline-none"
                      onChange={(e) =>
                        updateDraft(section.id, {
                          text: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      onClick={() => onViewSection(section.id)}
                      className="text-xs underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
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
