// src/pages/HomePage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface User {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  homeBanner: string | null;
}

export default function HomePage() {
  const { slug } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:4000/api/users/${slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [slug]);

  if (!user) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar slug={slug!} name={user.name} />
      <img 
        src={user.homeBanner!} 
        className="w-full max-w-4xl mx-auto mt-10"
        alt={`${user.name} banner`} 
      />
    </div>
  );
}
