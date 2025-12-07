import { Link } from "react-router-dom";

interface NavbarProps {
  slug: string;
  name: string;
}

export default function Navbar({ slug, name }: NavbarProps) {
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <header className="w-full pt-10">
      <nav className="max-w-7xl mx-auto flex items-center text-[17px] font-light text-black">

        {/* MENU */}
        <div className="flex-1 flex justify-center gap-40">
          <Link to={`/${slug}`} className="hover:opacity-60 transition -translate-y-2 relative font-medium">
            <div>{firstName}</div>
            <div>{lastName}</div>
          </Link>
          <Link to={`/${slug}/projects`} className="hover:opacity-60 transition ">Projects</Link>
          <Link to={`/${slug}/series`} className="hover:opacity-60 transition">Series</Link>
          <Link to={`/${slug}/commercial`} className="hover:opacity-60 transition">Commercials</Link>
          <Link to={`/${slug}/contact`} className="hover:opacity-60 transition">Contact</Link>
          <div/>
        </div>

      </nav>
    </header>
  );
}
