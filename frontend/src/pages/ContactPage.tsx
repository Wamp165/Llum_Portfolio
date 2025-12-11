import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

interface User {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  profilePicture: string | null;
  email?: string | null;
  instagram?: string | null;
  substack?: string | null;
  location?: string | null;
}

export default function ContactPage() {
  const { slug } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:4000/api/users/${slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error loading user:", err));
  }, [slug]);

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar slug={user.slug} name={user.name} />
      {/* MAIN TOP SECTION */}
      <div className="max-w-6xl mx-auto mt-20 flex justify-between items-start gap-20 px-6">

        {/* LEFT – IMAGE */}
        <div className="flex-1 flex justify-center">
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-[600px] h-auto object-cover"
            />
          )}
        </div>

        {/* RIGHT – ABOUT */}
        <div className="flex-1">
          <h2 className="text-[20px] font-semibold mb-6 text-center">About me</h2>

          <p className="text-[15px] leading-relaxed whitespace-pre-line text-center">
            {user.bio || "No biography available."}
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full flex justify-center my-16">
        <div className="w-[60%] border-t border-gray-300"></div>
      </div>

      {/* CONTACT INFO CENTERED */}
      <div className="max-w-3xl mx-auto text-center text-[15px] leading-relaxed">

        {/* SOCIAL */}
        <h3 className="font-semibold mb-2">Find me on:</h3>
        <p>Instagram: {user.instagram || "-"}</p>
        <p>Substack: {user.substack || "-"}</p>

        {/* SPACING */}
        <div className="my-8"></div>

        {/* EMAIL */}
        <h3 className="font-semibold mb-2">Email me:</h3>
        <p>{user.email || "-"}</p>

        {/* SPACING */}
        <div className="my-8"></div>

        {/* LOCATION */}
        <h3 className="font-semibold mb-2">Location:</h3>
        <p>{user.location || "-"}</p>
      </div>
    </div>
  );
}
