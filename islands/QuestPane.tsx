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
import { FaRegSave, FaRegShareSquare, FaRegTrashAlt } from "@preact-icons/fa";
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
                  <span class="icon">{ICONS.status.active}</span>
                  &ensp;
                  <span>Active</span>
                </option>
                <option value={QuestStatus.ToDo} title="Not yet addressed.">
                  <span class="icon">{ICONS.status.todo}</span>
                  &ensp;
                  <span>To Do</span>
                </option>
                <option value={QuestStatus.Closed} title="Finished cases.">
                  <span class="icon">{ICONS.status.closed}</span>
                  &ensp;
                  <span>Closed</span>
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
                  <span class="icon">{ICONS.priority.critical}</span>
                  &ensp;
                  <span>Critical</span>
                </option>
                <option
                  value={QuestPriority.High}
                  title="Incredibly important, but not dire."
                >
                  <span class="icon">{ICONS.priority.high}</span>
                  &ensp;
                  <span>High</span>
                </option>
                <option
                  value={QuestPriority.Medium}
                  title="Must be done at some point."
                >
                  <span class="icon">{ICONS.priority.medium}</span>
                  &ensp;
                  <span>Medium</span>
                </option>
                <option
                  value={QuestPriority.Low}
                  title="Handle it one day, no rush."
                >
                  <span class="icon">{ICONS.priority.low}</span>
                  &ensp;
                  <span>Low</span>
                </option>
                <option
                  value={QuestPriority.No}
                  title="No stress if it doesn't happen."
                >
                  <span class="icon">{ICONS.priority.none}</span>
                  &ensp;
                  <span>None</span>
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
                  <span class="icon">{ICONS.impact.cosmic}</span>
                  &ensp;
                  <span>Cosmic</span>
                </option>
                <option
                  value={QuestImpact.Galactic}
                  title="Affects at least one galaxy."
                >
                  <span class="icon">{ICONS.impact.galactic}</span>
                  &ensp;
                  <span>Galactic</span>
                </option>
                <option
                  value={QuestImpact.Stellar}
                  title="Affects at least one solar system."
                >
                  <span class="icon">{ICONS.impact.stellar}</span>
                  &ensp;
                  <span>Stellar</span>
                </option>
                <option
                  value={QuestImpact.Planetary}
                  title="Affects at least one planet."
                >
                  <span class="icon">{ICONS.impact.planetary}</span>
                  &ensp;
                  <span>Planetary</span>
                </option>
                <option
                  value={QuestImpact.National}
                  title="Affects at least one nation."
                >
                  <span class="icon">{ICONS.impact.national}</span>
                  &ensp;
                  <span>National</span>
                </option>
                <option
                  value={QuestImpact.Provincial}
                  title="Affects at least one province or state."
                >
                  <span class="icon">{ICONS.impact.provincial}</span>
                  &ensp;
                  <span>Provincial</span>
                </option>
                <option
                  value={QuestImpact.Municipal}
                  title="Affects at least one town or city."
                >
                  <span class="icon">{ICONS.impact.municipal}</span>
                  &ensp;
                  <span>Municipal</span>
                </option>
                <option
                  value={QuestImpact.Local}
                  title="Affects a small locality."
                >
                  <span class="icon">{ICONS.impact.local}</span>
                  &ensp;
                  <span>Local</span>
                </option>
                <option
                  value={QuestImpact.Familial}
                  title="Affects family and friends."
                >
                  <span class="icon">{ICONS.impact.familial}</span>
                  &ensp;
                  <span>Familial</span>
                </option>
                <option
                  value={QuestImpact.Internal}
                  title="Affects you and those who live with you."
                >
                  <span class="icon">{ICONS.impact.internal}</span>
                  &ensp;
                  <span>Internal</span>
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
                  <span class="icon">{ICONS.resolution.unresolved}</span>
                  &ensp;
                  <span>Unresolved</span>
                </option>
                <option value={QuestResolution.Failure}>
                  <span class="icon">{ICONS.resolution.failure}</span>
                  &ensp;
                  <span>Failure</span>
                </option>
                <option value={QuestResolution.Resolved}>
                  <span class="icon">{ICONS.resolution.resolved}</span>
                  &ensp;
                  <span>Resolved</span>
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="label">
              <span class="icon">{ICONS.client}</span>
              &ensp;
              <span>Client:</span>
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
              <span class="icon">{ICONS.reward}</span>
              &ensp;
              <span>Reward:</span>
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
                <span class="icon-text">
                  <span class="icon">
                    <FaRegSave />
                  </span>
                  <span>Save</span>
                </span>
              </button>
              <button class="button is-warning" onClick={handleDiscard}>
                <span class="icon-text">
                  <span class="icon">
                    <FaRegShareSquare />
                  </span>
                  <span>Discard Changes</span>
                </span>
              </button>
            </div>
          </div>
          <div class="column field">
            <div class="control level-right">
              <button class="button is-danger" onClick={handleTrash}>
                <span class="icon-text">
                  <span>Delete</span>
                  <span class="icon">
                    <FaRegTrashAlt />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    : <></>;
}
