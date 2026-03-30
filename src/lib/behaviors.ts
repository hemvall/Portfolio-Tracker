import { Action, Mood, Personality } from "./types";

const PERSONALITY_ACTIONS: Record<Personality, Action[]> = {
  chad: ["flexing", "dancing", "vibing", "shitposting"],
  introvert: ["sleeping", "staring", "meditating", "scheming"],
  gremlin: ["farting", "scheming", "fighting", "shitposting"],
  zen: ["meditating", "vibing", "staring", "sleeping"],
  drama: ["crying", "panicking", "fighting", "shitposting"],
  goofball: ["dancing", "farting", "vibing", "shitposting"],
};

const MOOD_ACTIONS: Record<Mood, Action[]> = {
  moon: ["dancing", "flexing", "vibing", "shitposting"],
  pump: ["dancing", "vibing", "flexing", "shitposting"],
  dump: ["crying", "panicking", "sleeping", "farting"],
  crab: ["staring", "sleeping", "meditating", "scheming"],
};

export function pickAction(personality: Personality, mood: Mood): Action {
  const pool = [...PERSONALITY_ACTIONS[personality], ...MOOD_ACTIONS[mood]];
  return pool[Math.floor(Math.random() * pool.length)];
}

const SPEECH_LINES: Record<Action, string[]> = {
  dancing: [
    "LFG!!!",
    "bears r so rekt rn",
    "wagmi frens",
    "this is the way",
    "wen lambo? NOW lambo",
  ],
  sleeping: [
    "zzz... wen pump... zzz",
    "wake me at ATH",
    "hibernating till next cycle",
    "do not disturb. stacking sats in my dreams",
  ],
  farting: [
    "*braaaap*",
    "sorry that was my gas fees",
    "proof of stank",
    "that one was on-chain",
    "decentralized flatulence",
  ],
  fighting: [
    "1v1 me bro",
    "ur coin is a shitcoin",
    "ngmi if u hold that",
    "my market cap could beat up your market cap",
    "talk shit get liquidated",
  ],
  meditating: [
    "om... diamond hands... om",
    "inner peace = never selling",
    "the charts are merely an illusion",
    "i am one with the blockchain",
    "breathe in gains, breathe out FUD",
  ],
  crying: [
    "why didn't I sell the top",
    "my portfolio... it's... beautiful *sniff*",
    "i'm not crying you're crying",
    "this is fine. EVERYTHING IS FINE.",
    "who keeps dumping on me",
  ],
  flexing: [
    "bought the dip. again. like a boss.",
    "i called this pump 6 months ago",
    "my bags are HEAVY (in a good way)",
    "i'm basically satoshi",
    "stay poor, anon",
  ],
  panicking: [
    "SELL SELL SELL",
    "is this the end??? IS THIS THE END???",
    "who let me invest money",
    "MOM COME PICK ME UP I'M SCARED",
    "this is a SCAM (i'm still holding tho)",
  ],
  vibing: [
    "life is good when u hold crypto",
    "just vibin with my frens",
    "number go up technology",
    "i literally cannot lose",
    "this is gentlemen",
  ],
  scheming: [
    "i have a plan... trust me bro",
    "what if we all buy at the same time",
    "hear me out... leverage",
    "*whispers* insider info",
    "the whales don't want you to know this",
  ],
  shitposting: [
    "gm",
    "gn",
    "probably nothing",
    "few understand",
    "ser this is a wendy's",
    "have fun staying poor",
    "not financial advice (it's financial advice)",
  ],
  staring: [
    "...",
    "*stares at chart*",
    "*refreshes portfolio*",
    "*blinks*",
    "i've been looking at this candle for 3 hours",
  ],
};

export function pickSpeechLine(action: Action): string {
  const lines = SPEECH_LINES[action];
  return lines[Math.floor(Math.random() * lines.length)];
}

const ACTION_DESCRIPTIONS: Record<Action, string> = {
  dancing: "is doing a victory dance",
  sleeping: "fell asleep on the charts",
  farting: "just ripped one",
  fighting: "is throwing hands",
  meditating: "is finding inner peace",
  crying: "is sobbing uncontrollably",
  flexing: "is flexing on the haters",
  panicking: "is having a panic attack",
  vibing: "is vibing hard",
  scheming: "is cooking something up",
  shitposting: "is shitposting on CT",
  staring: "is staring into the void",
};

export function getActionDescription(action: Action): string {
  return ACTION_DESCRIPTIONS[action];
}
