import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildPatterns,
  parseExtraTerms,
  scanWorkspace,
  scanText
} from "../src/safety/public-safety-scan.js";

test("public safety scan detects token-shaped strings", () => {
  const token = "sk-proj-" + "a".repeat(24);
  const findings = scanText(`const token = "${token}";`);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].pattern, "OpenAI-style API key");
  assert.equal(findings[0].line, 1);
});

test("public safety scan supports private blocklist terms", () => {
  const patterns = buildPatterns({ extraTerms: "InternalCodename" });
  const findings = scanText("Notes mention internalcodename once.", { patterns });

  assert.equal(findings.length, 1);
  assert.equal(findings[0].pattern, "private blocklist term");
});

test("public safety scan parses comma and newline separated terms", () => {
  assert.deepEqual(parseExtraTerms("alpha, beta\n# comment\ngamma"), [
    "alpha",
    "beta",
    "gamma"
  ]);
});

test("public safety scan ignores harmless public copy", () => {
  const findings = scanText("Synthetic evaluation notes with no credentials.");
  assert.deepEqual(findings, []);
});

test("public safety scan skips local blocklist files", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "public-safety-scan-"));
  fs.writeFileSync(path.join(directory, ".public-safety-blocklist"), "PrivateCodename");
  fs.writeFileSync(path.join(directory, "public.md"), "Synthetic public notes.");

  const result = scanWorkspace(directory, { extraTerms: "PrivateCodename" });
  assert.deepEqual(result.findings, []);
});
