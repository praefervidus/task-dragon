import { deleteQuest, editQuest, getQuest } from "../utils/ledger.ts";
import {
  Quest,
  QuestImpact,
  QuestPriority,
  QuestResolution,
  QuestStatus,
  QuestType,
} from "../models/Quest.ts";
import { Signal, useComputed } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import ICONS from "../utils/icons.ts";

interface QuestPaneProps {
  currentQuest: Signal<number>;
}

export function QuestPane(props: QuestPaneProps) {
  const quest = useComputed(() => getQuest(props.currentQuest.value));

  const [name, setName] = useState(quest.value?.name ?? "");
  const [questType, setQuestType] = useState(
    quest.value?.type ?? QuestType.Lead,
  );
  const [status, setStatus] = useState(quest.value?.status ?? QuestStatus.ToDo);
  const [priority, setPriority] = useState(
    quest.value?.priority ?? QuestPriority.No,
  );
  const [impact, setImpact] = useState(
    quest.value?.impact ?? QuestImpact.Internal,
  );
  const [resolution, setResolution] = useState(
    quest.value?.resolution ?? QuestResolution.Unresolved,
  );
  const [client, setClient] = useState(quest.value?.client ?? "");
  const [reward, setReward] = useState(quest.value?.reward ?? "");
  const [description, setDescription] = useState(
    quest.value?.description ?? "",
  );

  useEffect(() => {
    if (resolution != QuestResolution.Unresolved) {
      setStatus(QuestStatus.Closed);
    } else if (status == QuestStatus.Closed) {
      // if resolution is unresolved, status shouldnt be closed
      setStatus(QuestStatus.ToDo);
    }
  }, [resolution]);

  useEffect(() => {
    if (status == QuestStatus.Closed) {
      if (resolution == QuestResolution.Unresolved) {
        // resolution should not be unresolved if closed
        setResolution(QuestResolution.Failure);
      }
    } else {
      setResolution(QuestResolution.Unresolved);
    }
  }, [status]);

  const handleSave = () => {
    const q: Quest = {
      id: props.currentQuest.value,
      name: name,
      client: client,
      reward: reward,
      status: status,
      type: questType,
      priority: priority,
      impact: impact,
      resolution: resolution,
      description: description,
    };
    editQuest(q);
    props.currentQuest.value = -1; // close quest panel
  };
  const handleDiscard = () => {
    props.currentQuest.value = -1; // close quest panel
  };
  const handleTrash = () => {
    deleteQuest(props.currentQuest.value);
    props.currentQuest.value = -1;
  };

  return (quest !== undefined)
    ? (
      <div>
        <div class="field">
          <div class="control has-icons-left">
            <input
              class="input is-large"
              type="text"
              placeholder="Headline"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <span class="icon is-left">{ICONS.headline}</span>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <label class="label">Status:</label>
            <div class="select">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    QuestStatus[
                    e.currentTarget.value as keyof typeof QuestStatus
                    ],
                  )}
              >
                <option
                  value={QuestStatus.Active}
                  title="Currently in progress."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.status.active}</span>
                    <span>Active</span>
                  </span>
                </option>
                <option value={QuestStatus.ToDo} title="Not yet addressed.">
                  <span class="icon-text">
                    <span class="icon">{ICONS.status.todo}</span>
                    <span>To Do</span>
                  </span>
                </option>
                <option value={QuestStatus.Closed} title="Finished cases.">
                  <span class="icon-text">
                    <span class="icon">{ICONS.status.closed}</span>
                    <span>Closed</span>
                  </span>
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <label class="label">Type:</label>
            <div class="select">
              <select
                value={questType}
                onChange={(e) =>
                  setQuestType(
                    QuestType[e.currentTarget.value as keyof typeof QuestType],
                  )}
              >
                <option
                  value={QuestType.Main}
                  title="Part of the central story."
                >
                  Main
                </option>
                <option
                  value={QuestType.Side}
                  title="An arc peripheral but not unrelated to the central plot."
                >
                  Side
                </option>
                <option value={QuestType.Gig} title="A quick job.">Gig</option>
                <option
                  value={QuestType.Lead}
                  title="An interesting rumor to follow."
                >
                  Lead
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <label class="label">Priority:</label>
            <div class="select">
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    QuestPriority[
                    e.currentTarget.value as keyof typeof QuestPriority
                    ],
                  )}
              >
                <option
                  value={QuestPriority.Critical}
                  title="Cannot afford to delay resolution!"
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.priority.critical}</span>
                    <span>&ensp;&ensp;</span>
                    <span>Critical</span>
                  </span>
                </option>
                <option
                  value={QuestPriority.High}
                  title="Incredibly important, but not dire."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.priority.high}</span>
                    <span>&ensp;&ensp;</span>
                    <span>High</span>
                  </span>
                </option>
                <option
                  value={QuestPriority.Medium}
                  title="Must be done at some point."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.priority.medium}</span>
                    <span>&ensp;&ensp;</span>
                    <span>Medium</span>
                  </span>
                </option>
                <option
                  value={QuestPriority.Low}
                  title="Handle it one day, no rush."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.priority.low}</span>
                    <span>&ensp;&ensp;</span>
                    <span>Low</span>
                  </span>
                </option>
                <option
                  value={QuestPriority.No}
                  title="No stress if it doesn't happen."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.priority.none}</span>
                    <span>&ensp;&ensp;</span>
                    <span>None</span>
                  </span>
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <label class="label">Impact:</label>
            <div class="select">
              <select
                value={impact}
                onChange={(e) =>
                  setImpact(
                    QuestImpact[
                    e.currentTarget.value as keyof typeof QuestImpact
                    ],
                  )}
              >
                <option
                  value={QuestImpact.Cosmic}
                  title="Affects the whole universe or beyond."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.cosmic}</span>
                    <span>Cosmic</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Galactic}
                  title="Affects at least one galaxy."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.galactic}</span>
                    <span>Galactic</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Stellar}
                  title="Affects at least one solar system."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.stellar}</span>
                    <span>Stellar</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Planetary}
                  title="Affects at least one planet."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.planetary}</span>
                    <span>Planetary</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.National}
                  title="Affects at least one nation."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.national}</span>
                    <span>National</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Provincial}
                  title="Affects at least one province or state."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.provincial}</span>
                    <span>Provincial</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Municipal}
                  title="Affects at least one town or city."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.municipal}</span>
                    <span>Municipal</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Local}
                  title="Affects a small locality."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.local}</span>
                    <span>Local</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Familial}
                  title="Affects family and friends."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.familial}</span>
                    <span>Familial</span>
                  </span>
                </option>
                <option
                  value={QuestImpact.Internal}
                  title="Affects you and those who live with you."
                >
                  <span class="icon-text">
                    <span class="icon">{ICONS.impact.internal}</span>
                    <span>Internal</span>
                  </span>
                </option>
              </select>
            </div>
          </div>
          <div class="control">
            <label class="label">Resolution:</label>
            <div class="select">
              <select
                value={resolution}
                onChange={(e) =>
                  setResolution(
                    QuestResolution[
                    e.currentTarget.value as keyof typeof QuestResolution
                    ],
                  )}
              >
                <option value={QuestResolution.Unresolved}>
                  <span class="icon-text">
                    <span class="icon">{ICONS.resolution.unresolved}</span>
                    <span>Unresolved</span>
                  </span>
                </option>
                <option value={QuestResolution.Failure}>
                  <span class="icon-text">
                    <span class="icon">{ICONS.resolution.failure}</span>
                    <span>Failure</span>
                  </span>
                </option>
                <option value={QuestResolution.Resolved}>
                  <span class="icon-text">
                    <span class="icon">{ICONS.resolution.resolved}</span>
                    <span>Resolved</span>
                  </span>
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="label">
              <span class="icon-text">
                <span class="icon">{ICONS.client}</span>
                <span>Client:</span>
              </span>
            </label>
            <input
              class="input"
              type="text"
              placeholder="Client name"
              value={client}
              onChange={(e) => setClient(e.currentTarget.value)}
            />
          </div>
          <div class="control">
            <label class="label">
              <span class="icon-text">
                <span class="icon">{ICONS.reward}</span>
                <span>Reward:</span>
              </span>
            </label>
            <input
              class="input"
              type="text"
              placeholder="Reward and/or penalty (if any) for this quest's completion/failure..."
              value={reward}
              onChange={(e) => setReward(e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Write a short description here..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="columns">
          <div class="column field">
            <div class="control level-left">
              <button class="button is-primary" onClick={handleSave}>
                <span class="icon" title="Save changes...">
                  {ICONS.save}
                </span>
              </button>
              <button class="button is-warning" onClick={handleDiscard}>
                <span class="icon" title="Discard changes...">
                  {ICONS.discard}
                </span>
              </button>
            </div>
          </div>
          <div class="column field">
            <div class="control level-right">
              <button class="button is-danger" onClick={handleTrash}>
                <span class="icon" title="Delete...">
                  {ICONS.trash}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    : <></>;
}
