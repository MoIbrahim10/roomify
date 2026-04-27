/** @typedef {import("@commitlint/types").UserConfig} UserConfig */
/* Matches (optional) Unicode emoji cluster(s) + Conventional-Commits header, same as
 * conventional-changelog-conventionalcommits with a leading @theme/emoji-style prefix. */
const emojiGroup = String.raw`(?:(?:\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic})*)\s+)*`;
const typeScopeSubject = String.raw`(\w*)(?:\((.*)\))?!?: (.*)$`;
const typeScopeBreaking = String.raw`(\w*)(?:\((.*)\))?!: (.*)$`;

const types = [
  "build",
  "chore",
  "ci",
  "docs",
  "deps",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
  "types",
  "wip",
];

/** @type {UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  helpUrl: "docs/COMMIT_CONVENTION.md",
  parserPreset: {
    name: "conventional-changelog-conventionalcommits",
    path: "conventional-changelog-conventionalcommits",
    parserOpts: {
      headerPattern: new RegExp(`^${emojiGroup}${typeScopeSubject}`, "u"),
      breakingHeaderPattern: new RegExp(`^${emojiGroup}${typeScopeBreaking}`, "u"),
    },
  },
  rules: {
    "type-enum": [2, "always", types],
  },
};

export default config;
