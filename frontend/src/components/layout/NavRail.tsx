"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useToaster } from "@/hooks";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

/** Bottom tab bar on mobile, vertical icon rail on desktop. */
export function NavRail() {
  const pathname = usePathname();
  const { notify } = useToaster();

  const buttonClass = (active: boolean) =>
    cn(
      "flex h-12 w-12 items-center justify-center rounded-pill transition md:h-16 md:w-16",
      "[&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-7 md:[&>svg]:w-7",
      active
        ? "bg-white text-black"
        : "bg-surface-1 text-fg-muted hover:bg-surface-4 hover:text-fg",
    );

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-around border-t border-line bg-bg px-2",
        "md:static md:h-auto md:w-[108px] md:flex-col md:justify-start md:gap-5 md:border-r md:border-t-0 md:py-9",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active = Boolean(item.href) && pathname === item.href;
        const Icon = item.icon;

        if (item.implemented && item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={buttonClass(active)}
            >
              <Icon />
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            onClick={() =>
              notify(`Раздел «${item.label}» появится в следующей итерации`)
            }
            className={buttonClass(false)}
          >
            <Icon />
          </button>
        );
      })}
    </nav>
  );
}
