import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";
import { API_URL } from "../config";

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
  description: string;
  banner: string | null;
}

export default function WorksPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorks() {
      if (!categorySlug) return;

      // Public user
      const userRes = await fetch(`${API_URL}/public/user`);
      const userData: PublicUser = await userRes.json();
      setUser(userData);

      // Categories
      const categoriesRes = await fetch(
        `${API_URL}/users/${userData.id}/categories`
      );
      const categoriesData: Category[] = await categoriesRes.json();
      setCategories(categoriesData);

      // Resolve category by slug
      const category = categoriesData.find(
        (c) => c.slug === categorySlug
      );

      if (!category) {
        setLoading(false);
        return;
      }

      setCurrentCategory(category);

      // Works
      const worksRes = await fetch(
        `${API_URL}/categories/${category.id}/works`
      );
      const worksData: Work[] = await worksRes.json();
      setWorks(worksData);

      setLoading(false);
    }

    loadWorks();
  }, [categorySlug]);

  if (loading || !user || !currentCategory) return null;

  const navCategories: CategoryNavItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-[92vw] max-w-[1050px]">
        <Navbar name={user.name} categories={navCategories} />

        <section className="space-y-24">
          {works.map((work) => (
            <Link
              key={work.id}
              to={`/work/${work.id}`}
              className="block group"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                {/* Image */}
                <div>
                  {work.banner && (
                    <img
                      src={work.banner}
                      alt={work.title}
                      className="w-full h-auto"
                    />
                  )}
                </div>

                {/* Text */}
                <div>
                  <h2 className="mb-6 text-sm font-semibold group-hover:underline">
                    {work.title}
                  </h2>

                  <p className="text-sm leading-relaxed">
                    {work.description}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-20 h-px w-full bg-black/20" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
