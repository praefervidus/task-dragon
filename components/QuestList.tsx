import {
  getIconForQuestImpact,
  getIconForQuestPriority,
  getIconForQuestResolution,
  getTagColorFromQuestType,
  QuestMeta,
} from "../models/Quest.ts";
import { Signal } from "@preact/signals";

interface QuestListProps {
  quests: QuestMeta[];
  currentQuest: Signal<number>;
}

export default function QuestList(props: QuestListProps) {
  const clickQuestHandler = (id: number) => {
    if (props.currentQuest.value == id) {
      props.currentQuest.value = -1; // discard panel
    } else if (props.currentQuest.value < 0) {
      props.currentQuest.value = id;
    }
  };
  return (
    <ul class="menu-list">
      {props.quests.map((q: QuestMeta) => (
        <li onClick={() => clickQuestHandler(q.id)}>
          <a class={(props.currentQuest.value == q.id) ? "is-active has-background-danger-dark" : ""}>
            <span title={q.resolution}>
              {getIconForQuestResolution(q.resolution)}
            </span>
            &ensp;
            <span title={`Priority: ${q.priority}`}>
              {getIconForQuestPriority(q.priority)}
            </span>
            &ensp;
            <span title={`Impact: ${q.impact}`}>
              {getIconForQuestImpact(q.impact)}
            </span>
            &emsp;
            <span
              class={`tag ${getTagColorFromQuestType(q.type)} has-text-white`}
            >
              <b>{q.type}</b>
            </span>
            &ensp;
            <span>{q.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
