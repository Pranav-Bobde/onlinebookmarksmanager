import { expect, test } from "bun:test";

const root = new URL("../../", import.meta.url).pathname;

const COMMENT_START = {
  hash: /^\s*#(?!!)/,
  slash: /^\s*(\/\/(?!\/ <reference)(?! @ts-expect-error)|\/\*|\*\/)/,
  html: /<!--/,
};
const TRAILING_HASH = /^("[^"]*"|'[^']*'|[^"'#])*\s#/;

const SYNTAX = [
  {
    pattern: /(\.toml|\.ya?ml|(^|\/)\.gitignore)$/,
    rules: ["hash", "trailing"],
  },
  { pattern: /\.(ts|js|json)$/, rules: ["slash"] },
  { pattern: /\.(html|css)$/, rules: ["slash", "html"] },
];

const files = Bun.spawnSync(
  ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
  { cwd: root },
)
  .stdout.toString()
  .split("\n")
  .filter((file) => file !== "" && !file.startsWith("tools/oxlint/anti-slop/"));

const commentLines = async (file: string, rules: ReadonlyArray<string>) => {
  const lines = (await Bun.file(root + file).text()).split("\n");
  return lines
    .map((line, index) => ({ line, at: `${file}:${index + 1}` }))
    .filter(({ line }, index) => !(index === 0 && line.startsWith("#!")))
    .filter(
      ({ line }) =>
        (rules.includes("hash") && COMMENT_START.hash.test(line)) ||
        (rules.includes("trailing") && TRAILING_HASH.test(line)) ||
        (rules.includes("slash") && COMMENT_START.slash.test(line)) ||
        (rules.includes("html") && COMMENT_START.html.test(line)),
    )
    .map(({ at, line }) => `${at}  ${line.trim()}`);
};

test("no code comments in this repo (user rule, 2026-10-09): explain changes in commits and proof pages", async () => {
  const found = await Promise.all(
    files.flatMap((file) =>
      SYNTAX.filter(({ pattern }) => pattern.test(file)).map(({ rules }) =>
        commentLines(file, rules),
      ),
    ),
  );
  expect(found.flat()).toEqual([]);
});
