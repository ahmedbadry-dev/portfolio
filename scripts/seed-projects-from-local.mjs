#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
const modeValue = modeArg ? modeArg.split("=")[1] : "skip";
const mode = modeValue === "overwrite" ? "overwrite" : "skip";

const adminKey = process.env.CONVEX_ADMIN_MUTATION_KEY;
if (!adminKey) {
  console.error("Missing CONVEX_ADMIN_MUTATION_KEY.");
  process.exit(1);
}

const payload = JSON.stringify({
  adminKey,
  mode,
});

const convexPkgPath = require.resolve("convex/package.json");
const convexCliPath = path.join(path.dirname(convexPkgPath), "bin", "main.js");
const args = [convexCliPath, "run", "projects:seedFromLocal", payload];
const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
  shell: false,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
