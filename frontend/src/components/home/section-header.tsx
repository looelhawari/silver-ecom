import { Reveal } from "@/components/home/reveal";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "text-left items-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-normal text-[var(--accent)]">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-[15px] leading-7 text-[var(--muted-foreground)]">{description}</p>
      )}
    </Reveal>
  );
}
