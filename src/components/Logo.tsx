import Image from "next/image";
import { site } from "@/content/site";

/**
 * The brand mark from the Wix site, with the wordmark set in type so it stays
 * crisp on a dark background at any size. The supplied logo has a black
 * wordmark, which vanished on the new palette.
 */
export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image src="/images/mark.png" alt="" width={512} height={511} priority className="h-full w-auto" />
      <span className="font-display text-[1.05em] font-bold leading-none tracking-tight">
        <span className="text-teal-400">BIO</span>
        <span className="text-fog">PHOTONIX</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
