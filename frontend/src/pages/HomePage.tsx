import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";
import { API_URL } from "../config";

interface PublicUser {
  id: number;
  name: string;
  bio?: string | null;
  homeBanner?: string | null;
  profilePicture?: string | null;
  location?: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  order: number;
}

export default function HomePage() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHome(): Promise<void> {
      try {
        // Fetch public user
        const userRes = await fetch(`${API_URL}/public/user`);
        if (!userRes.ok) {
          throw new Error("Failed to load public user");
        }
        const userData: PublicUser = await userRes.json();
        setUser(userData);

        // Fetch categories for that user
        const categoriesRes = await fetch(
          `${API_URL}/users/${userData.id}/categories`
        );
        if (!categoriesRes.ok) {
          throw new Error("Failed to load categories");
        }
        const categoriesData: Category[] = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected error";
        setError(message);
        console.error("HomePage error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        User not found
      </div>
    );
  }

  const navCategories: CategoryNavItem[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar name={user.name} categories={navCategories} />

      {/* HERO / HOME BANNER */}
      {user.homeBanner && (
        <section className="px-6">
          <img 
            src={user.homeBanner!} 
            className="w-full max-w-4xl mx-auto"
            alt={`${user.name} banner`} 
          />
        </section>
      )}
    </div>
  );
}
