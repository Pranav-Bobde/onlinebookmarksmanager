import { describe, expect, test } from "bun:test";
import { Glob } from "bun";

const root = new URL("../../", import.meta.url).pathname;
const EXACT = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
const FIVE_DAYS = 5 * 24 * 60 * 60;
const SECTIONS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

const manifests = [
  "package.json",
  ...new Glob("{apps,packages}/*/package.json").scanSync({ cwd: root }),
];

describe("every dependency is pinned to one exact version", () => {
  for (const file of manifests) {
    test(file, async () => {
      const manifest = await Bun.file(root + file).json();
      const loose = SECTIONS.flatMap((section) =>
        Object.entries<string>(manifest[section] ?? {})
          .filter(
            ([, version]) =>
              !EXACT.test(version) && !version.startsWith("workspace:"),
          )
          .map(([name, version]) => `${section}: ${name}@${version}`),
      );
      expect(loose).toEqual([]);
    });
  }
});

test("bunfig.toml keeps exact installs and the 5-day age rule", async () => {
  const bunfig = Bun.TOML.parse(await Bun.file(root + "bunfig.toml").text());
  expect(bunfig).toMatchObject({ install: { exact: true } });
  expect(
    Reflect.get(Reflect.get(bunfig, "install"), "minimumReleaseAge"),
  ).toBeGreaterThanOrEqual(FIVE_DAYS);
});
