import { HighlightPart } from "./types/search";

/** Регистронезависимая проверка вхождения подстроки. */
export const matchesQuery = (
	value: string | null | undefined,
	query: string,
): boolean =>
	String(value ?? "")
		.toLowerCase()
		.includes(query.trim().toLowerCase());

/**
 * Разбивает строку на фрагменты с пометкой совпадений с запросом —
 * для подсветки результатов поиска (как в Кинопоиске).
 */
export function highlightParts(
	text: string | null | undefined,
	query: string,
): HighlightPart[] {
	const safeText = String(text ?? "");
	const q = query.trim();
	if (!q) return [{ text: safeText, match: false }];

	const parts: HighlightPart[] = [];
	const haystack = safeText.toLowerCase();
	const needle = q.toLowerCase();
	let cursor = 0;

	while (cursor < safeText.length) {
		const idx = haystack.indexOf(needle, cursor);
		if (idx === -1) {
			parts.push({ text: safeText.slice(cursor), match: false });
			break;
		}
		if (idx > cursor)
			parts.push({ text: safeText.slice(cursor, idx), match: false });
		parts.push({ text: safeText.slice(idx, idx + q.length), match: true });
		cursor = idx + q.length;
	}

	return parts;
}
