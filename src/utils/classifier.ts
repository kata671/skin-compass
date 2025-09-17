import type { ConditionKey } from "../data/products";

const keywords: Record<ConditionKey, string[]> = {
  tradzik: ["acne","tradzik","pimple","spots"],
  wagry: ["blackhead","wagry","comedone","pory"],
  sucha_skora: ["dry","sucha","xerosis","flaky"]
};

export function guessConditionFromFilename(name: string): ConditionKey | null {
  const low = name.toLowerCase();
  for (const [k, list] of Object.entries(keywords) as [ConditionKey,string[]][]) {
    if (list.some(word => low.includes(word))) return k;
  }
  return null;
}

export const conditionLabels: Record<ConditionKey,string> = {
  tradzik: "Trądzik",
  wagry: "Wągry / zaskórniki",
  sucha_skora: "Sucha skóra"
};
