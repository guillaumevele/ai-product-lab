import { scanWorkspace } from "../src/safety/public-safety-scan.js";

const rootDirectory = process.argv[2] ?? process.cwd();

const result = scanWorkspace(rootDirectory, {
  extraTerms: process.env.PUBLIC_SAFETY_BLOCKLIST,
  extraTermsFile: process.env.PUBLIC_SAFETY_BLOCKLIST_FILE
});

if (result.findings.length > 0) {
  console.error(`Public safety scan failed: ${result.findings.length} finding(s).`);

  for (const finding of result.findings.slice(0, 50)) {
    console.error(`- ${finding.filePath}:${finding.line} ${finding.pattern}`);
  }

  if (result.findings.length > 50) {
    console.error(`- ${result.findings.length - 50} additional finding(s) omitted.`);
  }

  process.exitCode = 1;
} else {
  console.log(`Public safety scan passed: ${result.scannedFiles} text files scanned.`);
}
