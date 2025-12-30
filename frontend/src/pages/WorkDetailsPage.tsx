import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";
import WorkSectionRenderer from "../components/WorkSectionRenderer";
import { API_URL } from "../config";
import type { WorkSection } from "../types/work";

interface PublicUser {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Work {
  id: number;
  title: string;
  banner: string | null;
  date: string | null;
  introduction: string | null;
  categoryId: number;
}

export default function WorkDetailPage() {
  const { workId } = useParams<{ workId: string }>();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [work, setWork] = useState<Work | null>(null);
  const [sections, setSections] = useState<WorkSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkDetail() {
      if (!workId) return;

      // Public user
      const userRes = await fetch(`${API_URL}/public/user`);
      const userData: PublicUser = await userRes.json();
      setUser(userData);

      // Categories for navbar
      const categoriesRes = await fetch(
        `${API_URL}/users/${userData.id}/categories`
      );
      const categoriesData: Category[] = await categoriesRes.json();
      setCategories(categoriesData);

      // Work data
      const workRes = await fetch(`${API_URL}/works/${workId}`);
      const workData: Work = await workRes.json();
      setWork(workData);

      // Sections (already include ordered images)
      const sectionsRes = await fetch(
        `${API_URL}/works/${workId}/sections`
      );
      const sectionsData: WorkSection[] = await sectionsRes.json();
      setSections(sectionsData);

      setLoading(false);
    }

    loadWorkDetail();
  }, [workId]);

  if (loading || !user || !work) return null;

  const navCategories: CategoryNavItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-[92vw] max-w-[1050px]">
        <Navbar name={user.name} categories={navCategories} />

        {/* Work header */}
        <section className="space-y-6">
          {work.banner && (
            <img
              src={work.banner}
              alt={work.title}
              className="w-full h-auto"
            />
          )}

          <h1 className="text-lg font-semibold">
            {work.title}
          </h1>

          {work.date && (
            <p className="text-sm text-neutral-500">
              {work.date}
            </p>
          )}

          {work.introduction && (
            <p className="max-w-[1150px] text-sm leading-relaxed whitespace-pre-line">
              {work.introduction}
            </p>
          )}
        </section>

        {/* Work sections */}
        <section className="mt-32 space-y-32 pb-32">
          {sections.map((section) => (
            <WorkSectionRenderer
              key={section.id}
              section={section}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
