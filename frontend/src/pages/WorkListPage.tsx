import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Work {
  id: number;
  title: string;
  banner: string | null;
  category: string;
  description: string;
}

interface User {
  name: string;
  slug: string;
}

export default function WorkListPage({ category }: { category: string }) {
  const { slug } = useParams();
  const [works, setWorks] = useState<Work[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Load user info for navbar
  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:4000/api/users/${slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [slug]);

  // Load works filtered by category
  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:4000/api/works/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((w: Work) => w.category === category);
        setWorks(filtered);
      });
  }, [slug, category]);

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar slug={slug!} name={user.name} />

      <div className="max-w-5xl mx-auto mt-16">
        {works.map((work) => (
          <div key={work.id} className="flex gap-10 mb-24 items-start">

            {/* IMAGE */}
            <img
              src={work.banner ?? ""}
              alt={work.title}
              className="w-[320px] h-auto object-cover"
            />

            {/* TEXT */}
            <div className="text-center mx-auto w-[300px]">
              <h2 className="text-lg font-semibold">{work.title}</h2>
              <p className="text-sm leading-relaxed mt-4">
                {work.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
