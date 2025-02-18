import { signal } from "@preact/signals";
import {
  ConvertQuestToMarkdown,
  getQuestMeta,
  getQuestTypeBadgeMarkdown,
  Quest,
  QuestImpact,
  QuestMeta,
  QuestPriority,
  QuestResolution,
  QuestStatus,
  QuestType,
} from "../models/Quest.ts";
import { enumeratePriority } from "../models/Quest.ts";
import MARKDOWN_ICONS from "./markdown-icons.ts";

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

const sortQuests = (quests: QuestMeta[]): QuestMeta[] => {
  const ms = quests.filter((q) => q.type == QuestType.Main).sort((q, r) =>
    enumeratePriority(q.priority) - enumeratePriority(r.priority)
  );
  const ss = quests.filter((q) => q.type == QuestType.Side).sort((q, r) =>
    enumeratePriority(q.priority) - enumeratePriority(r.priority)
  );
  const gs = quests.filter((q) => q.type == QuestType.Gig).sort((q, r) =>
    enumeratePriority(q.priority) - enumeratePriority(r.priority)
  );
  const ls = quests.filter((q) => q.type == QuestType.Lead).sort((q, r) =>
    enumeratePriority(q.priority) - enumeratePriority(r.priority)
  );
  return [...ms, ...ss, ...gs, ...ls];
};

const getMarkdownIconForPriority = (p: QuestPriority): string => {
  switch (p) {
    case QuestPriority.Critical:
      return MARKDOWN_ICONS.priority.critical;
    case QuestPriority.High:
      return MARKDOWN_ICONS.priority.high;
    case QuestPriority.Medium:
      return MARKDOWN_ICONS.priority.medium;
    case QuestPriority.Low:
      return MARKDOWN_ICONS.priority.low;
    case QuestPriority.No:
      return MARKDOWN_ICONS.priority.none;
  }
};

const getMarkdownIconForResolution = (r: QuestResolution): string => {
  switch (r) {
    case QuestResolution.Unresolved:
      return MARKDOWN_ICONS.resolution.unresolved;
    case QuestResolution.Failure:
      return MARKDOWN_ICONS.resolution.failure;
    case QuestResolution.Resolved:
      return MARKDOWN_ICONS.resolution.resolved;
  }
};

const getMarkdownIconForImpact = (i: QuestImpact): string => {
  switch (i) {
    case QuestImpact.Cosmic:
      return MARKDOWN_ICONS.impact.cosmic;
    case QuestImpact.Galactic:
      return MARKDOWN_ICONS.impact.galactic;
    case QuestImpact.Stellar:
      return MARKDOWN_ICONS.impact.stellar;
    case QuestImpact.Planetary:
      return MARKDOWN_ICONS.impact.planetary;
    case QuestImpact.National:
      return MARKDOWN_ICONS.impact.national;
    case QuestImpact.Provincial:
      return MARKDOWN_ICONS.impact.provincial;
    case QuestImpact.Municipal:
      return MARKDOWN_ICONS.impact.municipal;
    case QuestImpact.Local:
      return MARKDOWN_ICONS.impact.local;
    case QuestImpact.Familial:
      return MARKDOWN_ICONS.impact.familial;
    case QuestImpact.Internal:
      return MARKDOWN_ICONS.impact.internal;
  }
};

const ConvertQuestMetaToMarkdown = (
  quest: QuestMeta,
  forArchive: boolean,
): string => {
  return `- ${getMarkdownIconForResolution(quest.resolution)} ${
    getQuestTypeBadgeMarkdown(quest.type)
  } ${getMarkdownIconForPriority(quest.priority)} ${
    getMarkdownIconForImpact(quest.impact)
  } -- ${
    (!forArchive)
      ? `[${quest.name}](#quest${quest.id})`
      : `[${quest.name}](./quests/${quest.id}.md)`
  }`;
};

const ConvertQuestListToMarkdown = (
  quests: QuestMeta[],
  forArchive: boolean,
): string => {
  return quests.map((q) => ConvertQuestMetaToMarkdown(q, forArchive)).join(
    "\n",
  );
};

export function ConvertLedgerDashboardToMarkdown(forArchive: boolean): string {
  return (
    `# Quest Log
## Active
${
      ConvertQuestListToMarkdown(
        sortQuests(getQuestsMeta(QuestStatus.Active)),
        forArchive,
      )
    }
## To Do
${
      ConvertQuestListToMarkdown(
        sortQuests(getQuestsMeta(QuestStatus.ToDo)),
        forArchive,
      )
    }
## Closed
${
      ConvertQuestListToMarkdown(
        sortQuests(getQuestsMeta(QuestStatus.Closed)),
        forArchive,
      )
    }
${
      forArchive
        ? ""
        : `<hr>\n\n\n${
          ledger.value.map((q) => ConvertQuestToMarkdown(q, false)).join("\n\n")
        }`
    }
`
  );
}
