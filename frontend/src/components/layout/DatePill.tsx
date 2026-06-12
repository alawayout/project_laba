import { Calendar } from "lucide-react";

interface DatePillProps {
  label: string;
}

/** Outlined date pill (desktop only). */
export function DatePill({ label }: DatePillProps) {
  return (
    <div className="hidden h-14 items-center gap-3.5 rounded-pill border-2 border-white py-0 pl-5 pr-2 lg:flex">
      <span className="whitespace-nowrap text-lg font-medium">{label}</span>
      <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-[#d9d9d9] text-black">
        <Calendar className="h-6 w-6" />
      </span>
    </div>
  );
}
