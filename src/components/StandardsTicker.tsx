import { safety } from "@/content/site";

/** The standards Revolux is built against, scrolling by like a status strip. */
export default function StandardsTicker() {
  const items = [...safety.standards, ...safety.standards];
  return (
    <div className="ticker-wrap overflow-hidden border-y border-line bg-ink-900/60" aria-label="Standards and regulations">
      <ul className="ticker flex w-max items-center gap-10 py-4 pl-10">
        {items.map((s, i) => (
          <li key={`${s.code}-${i}`} className="flex items-center gap-3 whitespace-nowrap" aria-hidden={i >= safety.standards.length}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="mono text-sm text-fog">{s.code}</span>
            <span className="text-sm text-fog/55">{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
