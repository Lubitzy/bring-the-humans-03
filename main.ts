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

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const fileName = "VIDEO.json";

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, fileName), join(outputDir, fileName));
} catch (err) {
  console.error(
    `${fileName} could not be copied from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}
