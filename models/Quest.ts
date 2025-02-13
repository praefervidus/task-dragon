export enum QuestStatus {
  Active = "Active",
  ToDo = "To Do",
  Closed = "Closed",
}

export enum QuestType {
  Main = "Main",
  Side = "Side",
  Gig = "Gig",
  Lead = "Lead",
}

export enum QuestPriority {
  Critical = "Critical",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  No = "None",
}

export enum QuestResolution {
  Unresolved = "Unresolved",
  Failure = "Failure",
  Resolved = "Resolved",
}

export const enumeratePriority = (p: QuestPriority): number => {
  switch (p) {
    case QuestPriority.Critical:
      return 1;
    case QuestPriority.High:
      return 2;
    case QuestPriority.Medium:
      return 3;
    case QuestPriority.Low:
      return 4;
    case QuestPriority.No:
      return 5;
  }
};

export enum QuestImpact {
  Cosmic = "Cosmic",
  Galactic = "Galactic",
  Stellar = "Stellar",
  Planetary = "Planetary",
  Regional = "Regional",
  National = "National",
  Provincial = "Provincial",
  County = "County",
  Municipal = "Municipal",
  Local = "Local",
  Familial = "Familial",
  Internal = "Internal",
}

export interface QuestMeta {
  id: number;
  type: QuestType;
  name: string;
  priority: QuestPriority;
  resolution: QuestResolution;
}

export interface Quest {
  id: number;
  name: string;
  client: string;
  reward: string;
  status: QuestStatus;
  type: QuestType;
  priority: QuestPriority;
  impact: QuestImpact;
  resolution: QuestResolution;
  description: string;
}

export function getQuestMeta(q: Quest): QuestMeta {
  return {
    id: q.id,
    type: q.type,
    name: q.name,
    priority: q.priority,
    resolution: q.resolution,
  };
}
