import { useState, type JSX } from "react";
import UserInfoTable from "../../components/UserInfoTable";
import CategoriesTable from "../../components/CategoriesTable";
import WorksTable from "../../components/WorksTable";
import SectionsTable from "../../components/WorkSectionsTable";
import ImagesTable from "../../components/ImagesTable";

export default function AdminDashboard(): JSX.Element {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [selectedWorkId, setSelectedWorkId] =
    useState<number | null>(null);

  const [selectedSectionId, setSelectedSectionId] =
    useState<number | null>(null);

  return (
    <div className="p-6">
      <div className="grid grid-cols-[420px_1fr] grid-rows-[auto_1fr] gap-6">
        {/* User info */}
        <UserInfoTable />

        {/* Works */}
        <WorksTable
          categoryId={selectedCategoryId}
          selectedWorkId={selectedWorkId}
          onViewWork={(workId) => {
            setSelectedWorkId(workId);
            setSelectedSectionId(null);
          }}
        />

        {/* Categories */}
        <CategoriesTable
          onViewCategory={(category) => {
            setSelectedCategoryId(category.id);
            setSelectedWorkId(null);
            setSelectedSectionId(null);
          }}
        />

        {/* Sections + Images */}
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <SectionsTable
            workId={selectedWorkId}
            selectedSectionId={selectedSectionId}
            onViewSection={(sectionId) =>
              setSelectedSectionId(sectionId)
            }
          />

          <ImagesTable sectionId={selectedSectionId} />
        </div>
      </div>
    </div>
  );
}
