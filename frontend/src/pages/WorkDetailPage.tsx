import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import WorkSectionRenderer from "../components/WorkSectionRenderer";
import type { WorkSection } from "../types/WorkSection";

interface Work {
  id: number;
  title: string;
  description: string;
  banner?: string;
}

interface User {
  name: string;
  slug: string;
}

export default function WorkDetailPage() {
  const { slug, workId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [sections, setSections] = useState<WorkSection[]>([]);

  // Load user
  useEffect(() => {
    if (!slug) return;
    fetch(`http://localhost:4000/api/users/${slug}`)
      .then((res) => res.json())
      .then(setUser);
  }, [slug]);

  // Load work
  useEffect(() => {
    if (!slug || !workId) return;
    fetch(`http://localhost:4000/api/works/${slug}`)
      .then((res) => res.json())
      .then((list) => setWork(list.find((x: Work) => x.id === Number(workId))));
  }, [slug, workId]);

  // Load sections
  useEffect(() => {
    if (!slug || !workId) return;
    fetch(`http://localhost:4000/api/works/${slug}/${workId}/sections`)
      .then((res) => res.json())
      .then(setSections);
  }, [slug, workId]);

  if (!user || !work) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar slug={slug!} name={user.name} />

      <div className="max-w-5xl mx-auto mt-14">
        {work.banner && (
          <img src={work.banner} alt="" className="w-full mb-10" />
        )}

        <h1 className="text-3xl font-semibold text-center mb-4">
          {work.title}
        </h1>
        <p className="text-lg text-center mb-12 opacity-70">
          {work.description}
        </p>

        <div className="flex flex-col gap-24">
          {sections.map((s) => (
            <WorkSectionRenderer key={s.id} section={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
