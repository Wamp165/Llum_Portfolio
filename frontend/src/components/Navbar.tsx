import { Link, NavLink } from "react-router-dom";

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

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <header className="w-full pt-10 pb-8">
      <nav className="mx-auto max-w-[1200px] px-6 flex items-start justify-between">
        
        {/* Brand */}
        <Link
          to="/"
          className="shrink-0 font-light tracking-[0.18em] leading-[1.4] text-[18px] -translate-y-2.5"
        >
          <div>{firstName}</div>
          <div>{lastName}</div>
          <div className="mt-1 border-b border-neutral-300 w-full" />
        </Link>

        {/* Menu */}
        <div className="flex flex-wrap justify-end gap-x-36 gap-y-3 text-[17px] font-light">
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={`/${c.slug}`}
              className={({ isActive }) =>
                isActive
                  ? "text-black font-medium"
                  : "text-neutral-400 hover:text-black/60 transition"
              }
            >
              {c.name}
            </NavLink>
          ))}

          {/* Contact (static page) */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-black font-medium"
                : "text-neutral-400 hover:text-black/60 transition"
            }
          >
            Contact
          </NavLink>
        </div>

      </nav>
    </header>
  );
}
