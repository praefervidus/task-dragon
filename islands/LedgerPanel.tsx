import { useState } from "preact/hooks";
import ControlBar from "../components/ControlBar.tsx";
import QuestList from "../components/QuestList.tsx";
import { addQuest, getQuestsMeta } from "../utils/ledger.ts";
import { QuestTypeTabs } from "../components/QuestTypeTabs.tsx";
import { SelectedTab } from "../components/QuestTypeTabs.tsx";
import {
  enumeratePriority,
  QuestMeta,
  QuestStatus,
  QuestType,
} from "../models/Quest.ts";
import { QuestPane } from "./QuestPane.tsx";
import { useSignal } from "@preact/signals";

export default function LedgerPanel() {
  const [selectedTab, setSelectedTab] = useState(SelectedTab.All);
  const selectedQuest = useSignal(-1);

  const filterQuests = (quests: QuestMeta[]): QuestMeta[] => {
    switch (selectedTab) {
      case SelectedTab.All:
        return quests;
      case SelectedTab.Main:
        return quests.filter((q) => q.type == QuestType.Main);
      case SelectedTab.Side:
        return quests.filter((q) => q.type == QuestType.Side);
      case SelectedTab.Gigs:
        return quests.filter((q) => q.type == QuestType.Gig);
      case SelectedTab.Leads:
        return quests.filter((q) => q.type == QuestType.Lead);
      case SelectedTab.Closed:
        return [];
    }
  };

  const sortQuests = (quests: QuestMeta[]): QuestMeta[] => {
    if (selectedTab == SelectedTab.All || selectedTab == SelectedTab.Closed) {
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
    } else {
      return quests.sort((q, r) =>
        enumeratePriority(q.priority) - enumeratePriority(r.priority)
      );
    }
  };

  return (
    <>
      <ControlBar addQuest={addQuest} currentQuest={selectedQuest} />
      <section class="columns" id="main-pane">
        <aside class="column is-one-third">
          <QuestTypeTabs
            currentSelection={selectedTab}
            setSelection={setSelectedTab}
          />
          <div class="menu">
            {(selectedTab !== SelectedTab.Closed)
              ? (
                <>
                  <p class="menu-label">Active</p>
                  <QuestList
                    quests={sortQuests(
                      filterQuests(getQuestsMeta(QuestStatus.Active)),
                    )}
                    currentQuest={selectedQuest}
                  />
                  <p class="menu-label">To Do</p>
                  <QuestList
                    quests={sortQuests(
                      filterQuests(getQuestsMeta(QuestStatus.ToDo)),
                    )}
                    currentQuest={selectedQuest}
                  />
                </>
              )
              : <></>}
            {(selectedTab === SelectedTab.All ||
                selectedTab === SelectedTab.Closed)
              ? (
                <>
                  <p class="menu-label">Closed</p>
                  <QuestList
                    quests={sortQuests(getQuestsMeta(QuestStatus.Closed))}
                    currentQuest={selectedQuest}
                  />
                </>
              )
              : <></>}
          </div>
        </aside>
        {(selectedQuest.value > 0)
          ? (
            <article class="column is-two-thirds panel">
              <QuestPane
                currentQuest={selectedQuest}
              />
            </article>
          )
          : <></>}
      </section>
    </>
  );
}
