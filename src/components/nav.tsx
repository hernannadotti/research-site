"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/research", label: "Research" },
  { href: "/findings", label: "Findings" },
];

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/research") {
      return pathname === "/" || pathname === "/research";
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
      <nav className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`font-mono text-sm tracking-tight transition-colors relative ${
                    isActive(item.href)
                      ? "text-stone-900 dark:text-stone-100"
                      : "text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-stone-900 dark:bg-stone-100" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
