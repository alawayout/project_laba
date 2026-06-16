import { highlightParts } from "@/lib/search";

interface HighlightProps {
	text: string;
	query: string;
}

/** Текст с подсветкой совпадений с поисковым запросом. */
export function Highlight({ text, query }: Readonly<HighlightProps>) {
	const parts = highlightParts(text, query);
	return (
		<>
			{parts.map((part, i) =>
				part.match ? (
					<mark key={i} className="search-mark">
						{part.text}
					</mark>
				) : (
					<span key={i}>{part.text}</span>
				),
			)}
		</>
	);
}
