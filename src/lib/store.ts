import { create } from "zustand";
import { CharacterState, ActivityLogEntry } from "./types";
import { MOCK_TOKENS, TOTAL_VALUE } from "./mockData";
import { pickAction, pickSpeechLine, getActionDescription } from "./behaviors";

interface BagfolkStore {
  characters: CharacterState[];
  activityLog: ActivityLogEntry[];
  selectedCharacter: string | null;
  setSelectedCharacter: (id: string | null) => void;
  tick: () => void;
}

function createInitialCharacters(): CharacterState[] {
  return MOCK_TOKENS.map((token, i) => {
    const x = 120 + i * 130;
    const scale = 0.6 + (token.value / TOTAL_VALUE) * 2.0;
    return {
      id: token.symbol,
      token,
      position: [x, 0, 0] as [number, number, number],
      targetPosition: [x + (Math.random() - 0.5) * 200, 0, 0] as [number, number, number],
      currentAction: pickAction(token.personality, token.mood),
      speechBubble: null,
      speechTimer: 0,
      actionTimer: 5 + Math.random() * 30,
      scale,
    };
  });
}

let logId = 0;

export const useStore = create<BagfolkStore>((set) => ({
  characters: createInitialCharacters(),
  activityLog: [],
  selectedCharacter: null,
  setSelectedCharacter: (id) => set({ selectedCharacter: id }),
  tick: () =>
    set((state) => {
      const newLog: ActivityLogEntry[] = [];
      let oneTriggered = false;
      const characters = state.characters.map((char) => {
        let { actionTimer, speechTimer, speechBubble, currentAction, position, targetPosition } = char;
        const dt = 0.05;

        // Move toward target X
        const dx = targetPosition[0] - position[0];
        let newX = position[0];
        if (Math.abs(dx) > 2) {
          newX = position[0] + Math.sign(dx) * 0.8;
        }
        const newPos: [number, number, number] = [newX, position[1], position[2]];

        actionTimer -= dt;
        speechTimer -= dt;

        if (speechTimer <= 0) {
          speechBubble = null;
        }

        if (actionTimer <= 0 && !oneTriggered) {
          oneTriggered = true;
          currentAction = pickAction(char.token.personality, char.token.mood);
          speechBubble = pickSpeechLine(currentAction);
          speechTimer = 5 + Math.random() * 3;
          actionTimer = 20 + Math.random() * 20;

          // New wander target (keep within bounds)
          const newTargetX = 80 + Math.random() * 740;
          targetPosition = [newTargetX, 0, 0];

          newLog.push({
            id: `log-${logId++}`,
            timestamp: Date.now(),
            character: char.token.symbol,
            color: char.token.color,
            message: `${char.token.symbol} ${getActionDescription(currentAction)}`,
          });
        }

        return {
          ...char,
          position: newPos,
          targetPosition,
          currentAction,
          speechBubble,
          speechTimer,
          actionTimer,
        };
      });

      return {
        characters,
        activityLog: [...newLog, ...state.activityLog].slice(0, 50),
      };
    }),
}));
