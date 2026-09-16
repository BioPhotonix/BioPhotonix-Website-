import SiteLayout from "./(site)/layout";
import NotFoundBody from "./(site)/not-found";

/** Unknown URLs outside the site group still get the header and footer. */
export default function RootNotFound() {
  return (
    <SiteLayout>
      <NotFoundBody />
    </SiteLayout>
  );
}
