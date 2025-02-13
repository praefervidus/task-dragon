import { signal } from "@preact/signals";
import {
  getQuestMeta,
  Quest,
  QuestImpact,
  QuestMeta,
  QuestPriority,
  QuestResolution,
  QuestStatus,
  QuestType,
} from "../models/Quest.ts";

export const ledger = signal<Quest[]>([]);

const getQuestIndex = (quests: Quest[], id: number): number => {
  return quests.findIndex((q: Quest) => (q.id == id));
};

const randomUniqueID = (quests: Quest[]): number => {
  const magnitude = 10;
  let random: number;
  do {
    random = Math.floor(Math.random() * Math.pow(10, magnitude));
  } while (getQuestIndex(quests, random) >= 0);
  return random;
};

export function addQuest(): number {
  const newId = randomUniqueID(ledger.value);
  const newQuest: Quest = {
    id: newId,
    name: "",
    client: "",
    reward: "",
    status: QuestStatus.ToDo,
    type: QuestType.Lead,
    priority: QuestPriority.No,
    impact: QuestImpact.Internal,
    resolution: QuestResolution.Unresolved,
    description: "",
  };
  ledger.value = [...ledger.value, newQuest];
  return newId;
}
export function getQuest(id: number): Quest | undefined {
  return ledger.value.find((q) => q.id == id);
}
export function editQuest(newState: Quest) {
  const index = getQuestIndex(ledger.value, newState.id);
  if (index >= 0) {
    ledger.value[index] = newState;
  }
}
export function deleteQuest(id: number) {
  const index = getQuestIndex(ledger.value, id);
  if (index >= 0) {
    ledger.value.splice(index, 1);
  }
}
export function getQuestsMeta(status: QuestStatus): QuestMeta[] {
  return ledger.value
    .filter((q) => q.status == status)
    .map((q) => getQuestMeta(q));
}
