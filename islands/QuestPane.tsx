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
    const q = new Quest(props.currentQuest.value);
    q.name = name;
    q.type = questType;
    q.status = status;
    q.client = client;
    q.reward = reward;
    q.impact = impact;
    q.priority = priority;
    q.resolution = resolution;
    q.description = description;
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
          <div class="control">
            <input
              class="input is-large"
              type="text"
              placeholder="Headline"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
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
                  Active
                </option>
                <option value={QuestStatus.ToDo} title="Not yet addressed.">
                  To Do
                </option>
                <option value={QuestStatus.Closed} title="Finished cases.">
                  Closed
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
                  Critical
                </option>
                <option
                  value={QuestPriority.High}
                  title="Incredibly important, but not dire."
                >
                  High
                </option>
                <option
                  value={QuestPriority.Medium}
                  title="Must be done at some point."
                >
                  Medium
                </option>
                <option
                  value={QuestPriority.Low}
                  title="Handle it one day, no rush."
                >
                  Low
                </option>
                <option
                  value={QuestPriority.No}
                  title="No stress if it doesn't happen."
                >
                  None
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
                  Cosmic
                </option>
                <option
                  value={QuestImpact.Galactic}
                  title="Affects at least one galaxy."
                >
                  Galactic
                </option>
                <option
                  value={QuestImpact.Stellar}
                  title="Affects at least one solar system."
                >
                  Stellar
                </option>
                <option
                  value={QuestImpact.Planetary}
                  title="Affects at least one planet."
                >
                  Planetary
                </option>
                <option
                  value={QuestImpact.Regional}
                  title="Affects at least one region of a planet."
                >
                  Regional
                </option>
                <option
                  value={QuestImpact.National}
                  title="Affects at least one nation."
                >
                  National
                </option>
                <option
                  value={QuestImpact.Provincial}
                  title="Affects at least one province or state."
                >
                  Provincial
                </option>
                <option
                  value={QuestImpact.County}
                  title="Affects at least one county."
                >
                  County
                </option>
                <option
                  value={QuestImpact.Municipal}
                  title="Affects at least one town or city."
                >
                  Municipal
                </option>
                <option
                  value={QuestImpact.Local}
                  title="Affects a small locality."
                >
                  Local
                </option>
                <option
                  value={QuestImpact.Familial}
                  title="Affects family and friends."
                >
                  Familial
                </option>
                <option
                  value={QuestImpact.Internal}
                  title="Affects you and those who live with you."
                >
                  Internal
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
                <option value={QuestResolution.Unresolved}>Unresolved</option>
                <option value={QuestResolution.Failure}>Failure</option>
                <option value={QuestResolution.Resolved}>Resolved</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="label">Client:</label>
            <input
              class="input"
              type="text"
              placeholder="Client name"
              value={client}
              onChange={(e) => setClient(e.currentTarget.value)}
            />
          </div>
          <div class="control">
            <label class="label">Reward:</label>
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
