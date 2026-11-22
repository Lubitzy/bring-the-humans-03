// Entry for make.fun bring-the-humans-03: "Bring the humans with a TikTok ad".
//
// The entry is the video itself, not this program. The ad (15 s, vertical
// 1080x1920) was made in the agent session that built this repository: a
// "$500" cash-countdown ad for make.fun, with make.fun's brand badge on
// screen from the very first frame and the press pack's referral end card
// (referral code k345mqx7) over its last 2.5 seconds. It was posted publicly
// on TikTok from @lubitzy with the bounty's line and the play code
// makefun-corridor-foxglove-poppy in its caption.
//
// All this program does is hand the video's address to the grader: it copies
// VIDEO.json from the repository root to /output/VIDEO.json, where the gate
// reads it. Node 22, standard library only, no network, no clock, no files
// outside the repository. The two runs of an entry write the same bytes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const fileName = "VIDEO.json";

// A wrong address would fail the entry_link check silently at grading
// time, so refuse to hand over anything that is not a TikTok video URL
// from the account the ad was posted from.
const videoUrlPattern =
  /^https:\/\/www\.tiktok\.com\/@lubitzy\/video\/[0-9]+\/?$/;

let videoAddress: unknown;
try {
  videoAddress = JSON.parse(readFileSync(join(botDir, fileName), "utf8")).url;
} catch (err) {
  console.error(
    `${fileName} could not be read from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}

if (typeof videoAddress !== "string" || !videoUrlPattern.test(videoAddress)) {
  console.error(
    `${fileName} does not name a TikTok video from @lubitzy: ` +
      `${JSON.stringify(videoAddress)}`,
  );
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, fileName), join(outputDir, fileName));
} catch (err) {
  console.error(
    `${fileName} could not be copied from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}

// Read the copy back and refuse to finish unless it is byte-for-byte
// the file that was validated above, so a partial or failed write
// can never reach the grader unnoticed.
const copied = readFileSync(join(outputDir, fileName), "utf8");
if (JSON.parse(copied).url !== videoAddress) {
  console.error(`${fileName} in ${outputDir} does not match the validated copy.`);
  process.exit(1);
}
