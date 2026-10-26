import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { Glob } from "bun";

const PUBLIC = new URL("../public/", import.meta.url).pathname;
const REFERENCE =
  /(?:\bsrc|\bhref)\s*=\s*"([^"]+)"|\bfrom\s+"([^"]+)"|\bimport\s*\(\s*"([^"]+)"\s*\)/g;
const EXTERNAL = /^(?:[a-z]+:|\/\/|#|mailto:|tel:|data:)/i;

const files = [...new Glob("**/*.{html,js}").scanSync({ cwd: PUBLIC })];

test("public/ has pages to check", () => {
  expect(files.length).toBeGreaterThan(0);
});

for (const file of files) {
  test(`${file}: every local file it references ships in public/ (a missing ../shared/ import broke the page on 2026-10-25)`, async () => {
    const text = await Bun.file(join(PUBLIC, file)).text();
    const missing = [...text.matchAll(REFERENCE)]
      .map((m) => m[1] ?? m[2] ?? m[3] ?? "")
      .filter(
        (ref) =>
          ref !== "" &&
          !EXTERNAL.test(ref) &&
          !ref.startsWith("/api/") &&
          !ref.includes("${"),
      )
      .map((ref) => ref.split(/[?#]/)[0] ?? "")
      .filter((ref) => ref !== "" && ref !== "/")
      .filter((ref) => {
        const path = ref.startsWith("/")
          ? join(PUBLIC, ref)
          : join(dirname(join(PUBLIC, file)), ref);
        return !normalize(path).startsWith(PUBLIC) || !existsSync(path);
      });
    expect(missing).toEqual([]);
  });
}
