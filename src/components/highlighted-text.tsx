import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { normalizeSearchQuery } from "@/lib/chart-search";

interface HighlightedTextProps {
  text: string | number;
  query: string;
  highlightClassName?: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightedText({
  text,
  query,
  highlightClassName,
}: HighlightedTextProps) {
  const value = String(text);
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return <>{value}</>;
  }

  const matcher = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "ig");
  const parts = value.split(matcher);

  if (parts.length === 1) {
    return <>{value}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part.toLowerCase() === normalizedQuery.toLowerCase() ? (
            <mark
              className={cn(
                "rounded bg-amber-400/35 px-0.5 text-current dark:bg-amber-300/30",
                highlightClassName,
              )}
            >
              {part}
            </mark>
          ) : (
            part
          )}
        </Fragment>
      ))}
    </>
  );
}
