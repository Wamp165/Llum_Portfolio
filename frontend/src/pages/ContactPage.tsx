import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";

interface PublicUser {
  id: number;
  name: string;
  bio: string | null;
  profilePicture: string | null;
  contactEmail: string | null;
  instagram: string | null;
  substack: string | null;
  location: string | null;
}

export default function ContactPage() {
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
      .catch((err) => console.error("Error loading contact data:", err))
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

        <main className="mx-auto max-w-[1200px] px-6">
        {/* TOP SECTION */}
        <section className="mt-8 mx-auto max-w-[1200px] flex items-start justify-between">
            
            {/* Image */}
            {user.profilePicture && (
            <div className="md:w-[45%]">
                <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-auto object-cover"
                />
            </div>
            )}

            {/* ABOUT TEXT */}
            <div className="w-[420px] text-center">
            <h2 className="mb-4 text-[15px] font-medium">
                About me
            </h2>

            <p className="text-[15px] leading-relaxed text-neutral-700 whitespace-pre-line">
                {user.bio ||
                "Photographer based in Gdansk, Poland."}
            </p>
            </div>
        </section>

        {/* DIVIDER */}
        <div className="my-16 flex justify-center">
            <div className="w-[70%] border-t border-neutral-300" />
        </div>

        {/* CONTACT INFO */}
        <section className="text-center text-[15px] leading-relaxed text-neutral-700">
            
            <div className="mb-10">
            <h3 className="mb-2 font-medium">Find me on:</h3>
            <p>{user.instagram || "-"}</p>
            <p>{user.substack || "-"}</p>
            </div>

            <div className="mb-10">
            <h3 className="mb-2 font-medium">Email me:</h3>
            <p>{user.contactEmail || "-"}</p>
            </div>

            <div>
            <h3 className="mb-2 font-medium">Location:</h3>
            <p>{user.location || "-"}</p>
            </div>

        </section>
        </main>

    </div>
  );
}