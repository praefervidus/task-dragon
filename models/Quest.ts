import * as csv from "@std/csv";
import ICONS from "../utils/icons.ts";

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

export function getIconForQuestPriority(p: QuestPriority): string {
  switch (p) {
    case QuestPriority.Critical:
      return ICONS.priority.critical;
    case QuestPriority.High:
      return ICONS.priority.high;
    case QuestPriority.Medium:
      return ICONS.priority.medium;
    case QuestPriority.Low:
      return ICONS.priority.low;
    case QuestPriority.No:
      return ICONS.priority.none;
  }
}

export enum QuestResolution {
  Unresolved = "Unresolved",
  Failure = "Failure",
  Resolved = "Resolved",
}

export function getIconForQuestResolution(r: QuestResolution): string {
  switch (r) {
    case QuestResolution.Unresolved:
      return ICONS.resolution.unresolved;
    case QuestResolution.Failure:
      return ICONS.resolution.failure;
    case QuestResolution.Resolved:
      return ICONS.resolution.resolved;
  }
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
  National = "National",
  Provincial = "Provincial",
  Municipal = "Municipal",
  Local = "Local",
  Familial = "Familial",
  Internal = "Internal",
}

export function getIconForQuestImpact(i: QuestImpact): string {
  switch (i) {
    case QuestImpact.Cosmic:
      return ICONS.impact.cosmic;
    case QuestImpact.Galactic:
      return ICONS.impact.galactic;
    case QuestImpact.Stellar:
      return ICONS.impact.stellar;
    case QuestImpact.Planetary:
      return ICONS.impact.planetary;
    case QuestImpact.National:
      return ICONS.impact.national;
    case QuestImpact.Provincial:
      return ICONS.impact.provincial;
    case QuestImpact.Municipal:
      return ICONS.impact.municipal;
    case QuestImpact.Local:
      return ICONS.impact.local;
    case QuestImpact.Familial:
      return ICONS.impact.familial;
    case QuestImpact.Internal:
      return ICONS.impact.internal;
  }
}

export interface QuestMeta {
  id: number;
  type: QuestType;
  name: string;
  priority: QuestPriority;
  resolution: QuestResolution;
  impact: QuestImpact;
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
    impact: q.impact,
  };
}

export function getTagColorFromQuestType(qt: QuestType): string {
  switch (qt) {
    case QuestType.Main:
      return "is-danger";
    case QuestType.Side:
      return "is-warning";
    case QuestType.Gig:
      return "is-success";
    case QuestType.Lead:
      return "is-info";
    default:
      return "is-light";
  }
}

export function QuestsToCSV(qs: Quest[]): string {
  const header = [
    "Resolution",
    "Status",
    "Type",
    "Name",
    "Client",
    "Priority",
    "Impact",
    "Reward",
    "Description",
  ];
  const dataWithHeader = [
    header,
    ...qs.map(
      (q) => [
        q.resolution.valueOf(),
        q.status.valueOf(),
        q.type.valueOf(),
        q.name,
        q.client,
        q.priority.valueOf(),
        q.impact.valueOf(),
        q.reward,
        q.description,
      ],
    ),
  ];
  return csv.stringify(dataWithHeader, { headers: true });
}
