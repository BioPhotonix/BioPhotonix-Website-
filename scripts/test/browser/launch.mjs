/**
 * Finds Playwright and a browser to drive.
 *
 * The suite runs against a built site (`npm run build && npm start`) rather
 * than the dev server, because dev builds behave differently around hydration
 * and that is precisely what it is watching for.
 *
 * Playwright is not a dependency of this project: it pulls in a browser
 * download and the site does not need it to build or deploy. Install it where
 * you want to run this (`npm i -g playwright && npx playwright install
 * chromium`) or point PLAYWRIGHT_MODULE at an existing copy.
 */

const CANDIDATES = [process.env.PLAYWRIGHT_MODULE, "playwright", "/opt/node22/lib/node_modules/playwright/index.mjs"].filter(Boolean);

export async function launch() {
  let chromium = null;
  const tried = [];
  for (const candidate of CANDIDATES) {
    try {
      ({ chromium } = await import(candidate));
      break;
    } catch {
      tried.push(candidate);
    }
  }
  if (!chromium) {
    console.error(`\nCould not find Playwright. Tried: ${tried.join(", ")}\nInstall it with \`npm i -g playwright && npx playwright install chromium\`, or set PLAYWRIGHT_MODULE.\n`);
    process.exit(2);
  }
  return chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined, args: ["--no-sandbox"] });
}

export function reporter() {
  let failures = 0;
  return {
    fail(where, what) {
      failures += 1;
      console.log(`  FAIL  ${where} — ${what}`);
    },
    finish(passedMessage) {
      console.log(failures === 0 ? `\n${passedMessage}\n` : `\n${failures} failing.\n`);
      process.exit(failures === 0 ? 0 : 1);
    },
  };
}
