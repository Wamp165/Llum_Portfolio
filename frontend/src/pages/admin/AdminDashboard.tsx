import { useState, type JSX } from "react";
import UserInfoTable from "../../components/UserInfoTable";
import CategoriesTable from "../../components/CategoriesTable";
import WorksTable from "../../components/WorksTable";
import SectionsTable from "../../components/WorkSectionsTable";
import ImagesTable from "../../components/ImagesTable";

export default function AdminDashboard(): JSX.Element {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <UserInfoTable />

          <CategoriesTable
            onViewCategory={(category) => {
              setSelectedCategoryId(category.id);
              setSelectedWorkId(null);
              setSelectedSectionId(null);
            }}
          />
        </div>

        <div className="flex flex-col gap-6">
          <WorksTable
            categoryId={selectedCategoryId}
            selectedWorkId={selectedWorkId}
            onViewWork={(workId) => {
              setSelectedWorkId(workId);
              setSelectedSectionId(null);
            }}
            onWorkDeleted={(workId) => {
              setSelectedWorkId((prev) => (prev === workId ? null : prev));
              setSelectedSectionId(null);
            }}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SectionsTable
              workId={selectedWorkId}
              selectedSectionId={selectedSectionId}
              onViewSection={(sectionId) => setSelectedSectionId(sectionId)}
              onSectionDeleted={(sectionId) => {
                setSelectedSectionId((prev) =>
                  prev === sectionId ? null : prev
                );
              }}
            />

            <ImagesTable sectionId={selectedSectionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
