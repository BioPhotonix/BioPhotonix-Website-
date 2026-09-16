import Button from "@/components/Button";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col items-start justify-center pb-20 pt-32">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-5 text-fog">That page is not here.</h1>
      <p className="lede mt-6 max-w-md text-fog/75">
        The address may be from the old site. Everything is still available from the menu.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Back to the homepage</Button>
        <Button href="/technology" variant="outline">
          Explore Revolux
        </Button>
      </div>
    </section>
  );
}
