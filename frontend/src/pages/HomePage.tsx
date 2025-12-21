import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";


interface PublicUser {
  id: number;
  name: string;
  homeBanner: string | null;
}

export default function HomePage() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [categories, setCategories] = useState<CategoryNavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/public/user").then((r) => r.json()),
      fetch("http://localhost:3001/public/categories").then((r) => r.json()),
    ])
      .then(([userData, categoriesData]) => {
        setUser(userData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch((err) => console.error("Error loading home data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-neutral-500">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-sm text-neutral-500">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar name={user.name} categories={categories} />

      {user.homeBanner && (
        <main className="px-6">
          <img
            src={user.homeBanner}
            alt={`${user.name} home banner`}
            className="mx-auto w-full max-w-[1150px] object-cover"
          />
        </main>
      )}
    </div>
  );
}