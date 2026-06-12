interface LogoProps {
  compact?: boolean;
}

/** LABBOR brand lockup: red bar mark + "STUDIO" wordmark. */
export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="flex flex-col items-center">
      {!compact && (
        <span className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em]">
          зуботехническая
        </span>
      )}
      <span className="flex items-center overflow-hidden rounded border-2 border-white">
        <span className="flex items-end gap-0.5 bg-brand-red px-1.5 py-1">
          <span className="block w-1.5 rounded-sm bg-white" style={{ height: 18 }} />
          <span className="block w-1.5 rounded-sm bg-white" style={{ height: 13 }} />
          <span className="block w-1.5 rounded-sm bg-white" style={{ height: 16 }} />
        </span>
        <span className="bg-white px-2 py-1 text-[15px] font-bold leading-none text-black">
          STUDIO
        </span>
      </span>
    </div>
  );
}
