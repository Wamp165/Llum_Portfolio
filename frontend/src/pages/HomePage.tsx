import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";
import { API_URL } from "../config";

interface PublicUser {
  id: number;
  name: string;
  homeBanner?: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function HomePage() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHome() {
      const userRes = await fetch(`${API_URL}/public/user`);
      const userData = await userRes.json();
      setUser(userData);

      const categoriesRes = await fetch(
        `${API_URL}/users/${userData.id}/categories`
      );
      setCategories(await categoriesRes.json());

      setLoading(false);
    }

    loadHome();
  }, []);

  if (loading || !user) return null;

  const navCategories: CategoryNavItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-[92vw] max-w-[1050px]">
        <Navbar name={user.name} categories={navCategories} />

        {user.homeBanner && (
          <section className="mb-16 mt-12 md:mt-0">
            <img
              src={user.homeBanner}
              alt={`${user.name} banner`}
              className="w-full h-auto"
            />
          </section>
        )}
      </div>
    </div>
  );
}
