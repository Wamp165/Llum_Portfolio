import { useState, type JSX } from "react";
import UserInfoTable from "../../components/UserInfoTable";
import CategoriesTable from "../../components/CategoriesTable";
import WorksTable from "../../components/WorksTable";

type Category = {
  id: number;
  name: string;
  order: number;
};

export default function AdminDashboard(): JSX.Element {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [selectedWorkId, setSelectedWorkId] =
    useState<number | null>(null);

  return (
    <div className="p-6">
      <div className="grid grid-cols-[420px_1fr] grid-rows-[auto_1fr] gap-8">
        {/* Top-left */}
        <UserInfoTable />

        {/* Top-right */}
        <WorksTable
          categoryId={selectedCategoryId}
          selectedWorkId={selectedWorkId}
          onViewWork={(workId) => setSelectedWorkId(workId)}
        />

        {/* Bottom-left */}
        <CategoriesTable
          onViewCategory={(category: Category) => {
            setSelectedCategoryId(category.id);
            setSelectedWorkId(null); // reset work when category changes
          }}
        />
      </div>
    </div>
  );
}
