// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  slug: string;
  name: string;
}

export default function Navbar({ slug, name }: NavbarProps) {
  const location = useLocation();
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  const menu = [
    { label: "Projects", path: `/${slug}/projects` },
    { label: "Stories", path: `/${slug}/stories` },
    { label: "Commercial", path: `/${slug}/commercial` },
    { label: "Contact", path: `/${slug}/contact` },
  ];

  return (
    <header className="w-full pt-12">
      <nav className="max-w-[80%] mx-auto grid grid-cols-12 items-start">

        <div className="col-start-2 col-span-3">
          <div className="inline-block -translate-y-3">
            <Link
              to={`/${slug}`}
              className="block font-light tracking-[0.18em] leading-[1.4] text-[17px]"
            >
              <div>{firstName}</div>
              <div>{lastName}</div>
            </Link>

            <div className="mt-1 border-b border-neutral-300 w-full" />
          </div>
        </div>

        <div className="col-start-6 col-span-6 flex justify-between text-[17px] font-light">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={
                  "transition " +
                  (active
                    ? "font-medium text-black"
                    : "text-neutral-400 hover:text-black/60")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

      </nav>
    </header>
  );
}
