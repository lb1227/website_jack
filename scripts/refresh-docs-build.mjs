import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const docsDir = path.join(repoRoot, "docs");
const docsAssetsDir = path.join(docsDir, "assets");

async function removeIfExists(targetPath) {
  await rm(targetPath, { force: true, recursive: true });
}

async function cleanupDocsBuildOutput() {
  await removeIfExists(path.join(docsDir, "index.html"));

  let files = [];
  try {
    files = await readdir(docsAssetsDir, { withFileTypes: true });
  } catch {
    return;
  }

  const removals = files
    .filter((entry) => entry.isFile() && /^index-/.test(entry.name))
    .map((entry) => removeIfExists(path.join(docsAssetsDir, entry.name)));

  await Promise.all(removals);
}

await cleanupDocsBuildOutput();
