import { signal } from "@preact/signals";
import { Quest, QuestMeta, QuestStatus } from "../models/Quest.ts";

export const ledger = signal<Quest[]>([]);

const getQuestIndex = (quests: Quest[], id: number): number => {
  return quests.findIndex((q: Quest) => (q.id() == id));
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
  ledger.value = [...ledger.value, new Quest(newId)];
  return newId;
}
export function getQuest(id: number): Quest | undefined {
  return ledger.value.find((q) => q.id() == id);
}
export function editQuest(newState: Quest) {
  const index = getQuestIndex(ledger.value, newState.id());
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
    .map((q) => q.meta());
}
