import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { CategoryNavItem } from "../components/Navbar";
import { API_URL } from "../config";

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ContactPage() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContact() {
      const userRes = await fetch(`${API_URL}/public/user`);
      const userData: PublicUser = await userRes.json();
      setUser(userData);

      const categoriesRes = await fetch(
        `${API_URL}/users/${userData.id}/categories`
      );
      setCategories(await categoriesRes.json());

      setLoading(false);
    }

    loadContact();
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

        <section className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Profile image */}
          <div>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt={`${user.name} portrait`}
                className="w-full h-auto"
              />
            )}
          </div>

          {/* About text */}
          <div className="text-center">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide">
              About me
            </h2>

            {user.bio && (
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="my-20 h-px w-full bg-black/20" />

        {/* Contact details */}
        <section className="space-y-10 text-center pb-14">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Find me on:</h3>

            {user.instagram && (
              <p className="text-sm mb-3">
                Instagram:{" "}
                <a
                  href={`https://instagram.com/${user.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {user.instagram}
                </a>
              </p>
            )}

            {user.substack && (
              <p className="text-sm">
                Substack:{" "}
                <a
                  href={`https://${user.substack}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {user.substack}
                </a>
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Email me:</h3>
            {user.contactEmail && (
              <p className="text-sm">{user.contactEmail}</p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Location:</h3>
            {user.location && (
              <p className="text-sm">{user.location}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
