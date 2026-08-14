import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = "https://limbuscompany.wiki.gg/images";
const targetRoot = path.resolve(process.cwd(), "dist", "public", "icons");
const icons = [
  "Dungeon_Entrance_Icon",
  "Normal_Encounter_Icon",
  "Monster_Encounter_Icon",
  "Coin_Encounter_Icon",
  "Blubbering_Toad_Core_Icon",
  "Event_Encounter_Icon",
  "Shop_Encounter_Icon",
  "Rest_Stop_Encounter_Icon",
  "Boss_Encounter_Icon",
];

await mkdir(targetRoot, { recursive: true });

for (const icon of icons) {
  const response = await fetch(`${sourceRoot}/${icon}.png`);
  if (!response.ok) throw new Error(`アイコンの取得に失敗しました: ${icon} (${response.status})`);
  const body = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(targetRoot, `${icon}.png`), body);
}

console.log(`Copied ${icons.length} encounter icons to dist/public/icons`);
