import fs from "node:fs";
import path from "node:path";

export const DEFAULT_PATTERNS = Object.freeze([
  {
    name: "personal email",
    regex: /guillaume\.vele@gmail\.com/i
  },
  {
    name: "OpenAI-style API key",
    regex: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/i
  },
  {
    name: "GitHub token",
    regex: /(?:gh[pousr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{20,})/i
  },
  {
    name: "Google API key",
    regex: /AIza[0-9A-Za-z_-]{35}/i
  },
  {
    name: "Slack token",
    regex: /xox[baprs]-[A-Za-z0-9-]{20,}/i
  },
  {
    name: "private key block",
    regex: /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/i
  },
  {
    name: "bearer token",
    regex: /Bearer\s+[A-Za-z0-9._-]{20,}/i
  }
]);

const SKIPPED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "coverage",
  "private",
  "local",
  "data",
  "exports"
]);

const MAX_FILE_BYTES = 2_000_000;

export function scanWorkspace(rootDirectory, options = {}) {
  const root = path.resolve(rootDirectory);
  const patterns = buildPatterns(options);
  const findings = [];
  let scannedFiles = 0;

  for (const filePath of listFiles(root)) {
    const content = readTextFile(filePath);
    if (content === null) continue;

    scannedFiles += 1;
    findings.push(
      ...scanText(content, {
        filePath: path.relative(root, filePath),
        patterns
      })
    );
  }

  return { findings, scannedFiles };
}

export function scanText(text, options = {}) {
  const patterns = options.patterns ?? DEFAULT_PATTERNS;
  const filePath = options.filePath ?? "<inline>";
  const findings = [];

  text.split(/\r?\n/).forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          filePath,
          line: index + 1,
          pattern: pattern.name
        });
      }
    }
  });

  return findings;
}

export function buildPatterns(options = {}) {
  const extraTerms = [
    ...parseExtraTerms(options.extraTerms),
    ...readExtraTermsFile(options.extraTermsFile)
  ];

  const extraPatterns = extraTerms.map((term) => ({
    name: "private blocklist term",
    regex: new RegExp(escapeRegExp(term), "i")
  }));

  return [...DEFAULT_PATTERNS, ...extraPatterns];
}

export function parseExtraTerms(rawTerms) {
  if (!rawTerms) return [];

  return String(rawTerms)
    .split(/[\n,]/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3 && !term.startsWith("#"));
}

function readExtraTermsFile(filePath) {
  if (!filePath) return [];

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Blocklist file not found: ${absolutePath}`);
  }

  return parseExtraTerms(fs.readFileSync(absolutePath, "utf8"));
}

function* listFiles(root) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (shouldSkipFile(entry.name)) continue;

    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
      yield* listFiles(entryPath);
      continue;
    }

    if (entry.isFile()) {
      yield entryPath;
    }
  }
}

function shouldSkipFile(fileName) {
  return (
    fileName === ".DS_Store" ||
    fileName === ".env" ||
    fileName.startsWith(".env.") ||
    fileName.startsWith(".public-safety-blocklist")
  );
}

function readTextFile(filePath) {
  const stats = fs.statSync(filePath);
  if (stats.size > MAX_FILE_BYTES) return null;

  const buffer = fs.readFileSync(filePath);
  if (buffer.includes(0)) return null;

  return buffer.toString("utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
