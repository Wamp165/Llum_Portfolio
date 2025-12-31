import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export interface CategoryNavItem {
  id: number;
  name: string;
  slug: string;
}

interface NavbarProps {
  name: string;
  categories: CategoryNavItem[];
}

export default function Navbar({ name, categories }: NavbarProps) {
  if (!name) return null;

  const [menuOpen, setMenuOpen] = useState(false);

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <header className="pt-8 pb-10 relative">
      <nav className="flex items-start justify-between">
        {/* Name */}
        <Link
          to="/"
          className="shrink-0 font-light tracking-[0.18em] leading-[1.4] text-[18px]"
        >
          <div>{firstName}</div>
          <div>{lastName}</div>
          <div className="mt-1 border-b border-neutral-300 w-full" />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl font-light"
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-x-36 text-[17px] font-light translate-y-2.5">
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={`/${c.slug}`}
              className={({ isActive }) =>
                isActive
                  ? "text-black font-medium"
                  : "text-neutral-700 hover:text-black/60 transition"
              }
            >
              {c.name}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-black font-medium"
                : "text-neutral-700 hover:text-black/60 transition"
            }
          >
            Contact
          </NavLink>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300
          ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          md:hidden`}
      />

      {/* Mobile side menu (RIGHT → LEFT) */}
      <div
        className={`fixed top-0 right-0 h-full w-[75vw] max-w-sm bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden`}
      >
        <div className="p-8 flex flex-col gap-6 text-[18px] font-light">
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="self-end text-2xl"
            aria-label="Close menu"
          >
            ×
          </button>

          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={`/${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="text-neutral-700 hover:text-black transition"
            >
              {c.name}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-neutral-700 hover:text-black transition"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
}
