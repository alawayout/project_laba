"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useToaster } from "@/hooks";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

function NavTooltip({ label }: Readonly<{ label: string }>) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2",
        "hidden md:inline-flex",
        "whitespace-nowrap rounded-field bg-surface-3 px-3 py-1.5",
        "text-micro font-medium text-fg",
        "border border-line shadow-modal",
        "opacity-0 scale-95 transition-all duration-150",
        "group-hover:opacity-100 group-hover:scale-100",
      )}
    >
      {label}
    </span>
  );
}

/** Bottom tab bar on mobile, vertical icon rail on desktop. */
export function NavRail() {
  const pathname = usePathname();
  const { notify } = useToaster();

  const buttonClass = (active: boolean) =>
    cn(
      "flex h-12 w-12 items-center justify-center rounded-pill transition md:h-16 md:w-16",
      "[&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-7 md:[&>svg]:w-7",
      active
        ? "bg-accent text-black"
        : "text-fg-muted hover:bg-white/10 hover:text-fg",
    );

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/" || pathname.startsWith("/orders");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className={cn(
        "glass-nav fixed inset-x-4 bottom-4 z-40 flex h-[68px] items-center justify-around gap-1 rounded-pill px-2",
        "md:static md:inset-auto md:bottom-auto md:h-auto md:w-[108px] md:flex-col md:justify-start md:gap-4 md:rounded-none md:border-0 md:border-r md:border-line md:bg-transparent md:px-0 md:py-9 md:shadow-none md:backdrop-blur-none",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        if (item.implemented && item.href) {
          return (
            <div key={item.id} className="group relative md:flex md:items-center">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={buttonClass(active)}
              >
                <Icon />
              </Link>
              <NavTooltip label={item.label} />
            </div>
          );
        }

        return (
          <div key={item.id} className="group relative md:flex md:items-center">
            <button
              type="button"
              aria-label={item.label}
              onClick={() =>
                notify(`Раздел «${item.label}» появится в следующей итерации`)
              }
              className={buttonClass(false)}
            >
              <Icon />
            </button>
            <NavTooltip label={item.label} />
          </div>
        );
      })}
    </nav>
  );
}
