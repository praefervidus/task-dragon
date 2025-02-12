import { QuestMeta, QuestType } from "../models/Quest.ts";
import { Signal } from "@preact/signals";

interface QuestListProps {
  quests: QuestMeta[];
  currentQuest: Signal<number>;
}

function getColorFromQuestType(qt: QuestType): string {
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
          <a class={(props.currentQuest.value == q.id) ? "is-active" : ""}>
            <span
              class={`tag ${getColorFromQuestType(q.type)}`}
            >
              {q.type}
            </span>
            &ensp;
            <span>{q.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
