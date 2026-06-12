interface AmountInputProps {
  value: string;
  onChange: (next: string) => void;
  suffix?: string;
  placeholder?: string;
}

/** Numeric currency input. Strips non-digits as the user types. */
export function AmountInput({
  value,
  onChange,
  suffix = "₽",
  placeholder,
}: AmountInputProps) {
  return (
    <div className="flex items-center rounded-field bg-[#262626] px-5 py-3.5">
      <input
        inputMode="numeric"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="min-w-0 flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-fg-muted"
      />
      <span className="text-xl text-fg-tertiary">{suffix}</span>
    </div>
  );
}
