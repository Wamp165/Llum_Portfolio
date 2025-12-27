import { useEffect, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

type Category = {
  id: number;
  name: string;
  order: number;
};

type CategoriesTableProps = {
  onViewCategory: (category: Category) => void;
};

export default function CategoriesTable({
  onViewCategory,
}: CategoriesTableProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const response: AxiosResponse<Category[]> =
          await api.get("/users/1/categories");
        setCategories(response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const updateCategory = (
    id: number,
    field: keyof Pick<Category, "name" | "order">,
    value: string | number
  ): void => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, [field]: value }
          : category
      )
    );
  };

  const saveAllCategories = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await Promise.all(
        categories.map((category) =>
          api.patch(`/categories/${category.id}`, {
            name: category.name,
            order: category.order,
          })
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-sm">Loading categories…</div>;
  }

  return (
    <section className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">Categories</h2>

        <button
          type="button"
          onClick={saveAllCategories}
          disabled={isSaving}
          className="text-xs underline underline-offset-4 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="text-left py-1">Name</th>
            <th className="text-left py-1 w-16">Order</th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody>
          {categories
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((category) => (
              <tr key={category.id} className="border-b last:border-b-0">
                <td className="py-1 pr-2">
                  <input
                    value={category.name}
                    className="w-full bg-transparent outline-none"
                    onChange={(event) =>
                      updateCategory(
                        category.id,
                        "name",
                        event.target.value
                      )
                    }
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    type="number"
                    value={category.order}
                    className="w-full bg-transparent outline-none"
                    onChange={(event) =>
                      updateCategory(
                        category.id,
                        "order",
                        Number(event.target.value)
                      )
                    }
                  />
                </td>
                <td className="py-1 text-right">
                  <button
                    type="button"
                    onClick={() => onViewCategory(category)}
                    className="text-xs underline underline-offset-4"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}
