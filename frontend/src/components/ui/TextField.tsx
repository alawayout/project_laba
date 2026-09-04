"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TextFieldTone = "card" | "modal";

interface TextFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	/** Правый слот (например, иконка календаря). */
	trailing?: ReactNode;
	multiline?: boolean;
	inputMode?: "text" | "numeric";
	/** HTML-тип для однострочного инпута (например, "password", "email", "date"). */
	type?: "text" | "email" | "password" | "date";
	tone?: TextFieldTone;
	className?: string;
	autoComplete?: string;
}

const TONES: Record<TextFieldTone, string> = {
	card: "bg-surface-5",
	modal: "bg-[#262626]",
};

/** Редактируемое поле «лейбл + ввод» (shadcn-input в стиле дизайн-кода). */
export function TextField({
	label,
	value,
	onChange,
	placeholder,
	trailing,
	multiline = false,
	inputMode = "text",
	type = "text",
	tone = "modal",
	className,
	autoComplete,
}: TextFieldProps) {
	return (
		<label
			className={cn(
				"flex items-center justify-between gap-3.5 rounded-field px-5 py-3.5",
				TONES[tone],
				className,
			)}
		>
			<span className="min-w-0 flex-1">
				<span className="mb-1.5 block text-caption text-fg-muted">{label}</span>
				{multiline ? (
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						rows={1}
						className="block w-full resize-none bg-transparent text-lg font-medium leading-snug outline-none placeholder:text-fg-muted"
					/>
				) : (
					<input
						value={value}
						type={type}
						inputMode={inputMode}
						autoComplete={autoComplete}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="block w-full bg-transparent text-lg font-medium outline-none placeholder:text-fg-muted"
					/>
				)}
			</span>
			{trailing}
		</label>
	);
}
