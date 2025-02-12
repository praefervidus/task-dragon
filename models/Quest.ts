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

export const enumeratePriority = (p: QuestPriority): number => {
  switch (p) {
    case QuestPriority.Critical:
      return 0;
    case QuestPriority.High:
      return 1;
    case QuestPriority.Medium:
      return 2;
    case QuestPriority.Low:
      return 3;
    case QuestPriority.No:
      return 4;
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
}

export class Quest {
  #id: number;
  name: string;
  client: string;
  reward: string;
  status: QuestStatus;
  type: QuestType;
  priority: QuestPriority;
  impact: QuestImpact;
  description: string;

  constructor(id: number) {
    this.#id = id;
    this.description = "";
    this.name = "";
    this.client = "";
    this.reward = "";
    this.status = QuestStatus.ToDo;
    this.type = QuestType.Lead;
    this.priority = QuestPriority.No;
    this.impact = QuestImpact.Internal;
  }

  id(): number {
    return this.#id;
  }

  meta(): QuestMeta {
    return {
      id: this.#id,
      type: this.type,
      name: this.name,
      priority: this.priority,
    };
  }
}
