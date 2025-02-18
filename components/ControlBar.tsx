import { Signal } from "@preact/signals";
import { ConvertLedgerDashboardToMarkdown, ledger } from "../utils/ledger.ts";
import { Quest, QuestsToCSV } from "../models/Quest.ts";
import { JSX } from "preact/jsx-runtime";
import ICONS from "../utils/icons.ts";
import AddQuestIcon from "./icons/AddQuestIcon.tsx";
import TaskDragonIcon from "./icons/TaskDragonIcon.tsx";

interface ControlBarProps {
  addQuest: () => number;
  currentQuest: Signal<number>;
}

const handleAddQuest = (props: ControlBarProps): void => {
  props.currentQuest.value = props.addQuest();
};

const downloadFile = (file: File): void => {
  const url = URL.createObjectURL(file);
  const tmpElement = globalThis.document.createElement("a");
  tmpElement.href = url;
  tmpElement.download = file.name;
  tmpElement.target = "_blank";
  tmpElement.setAttribute("style", "display:none");
  globalThis.document.body.appendChild(tmpElement);
  tmpElement.click();
  tmpElement.remove();
  URL.revokeObjectURL(url);
};

export default function ControlBar(props: ControlBarProps) {
  const defaultSaveFileName = "ledger.json";
  const fileInputId = "load-file-input";

  const handleLoadLedger = (
    event: JSX.TargetedEvent<HTMLInputElement>,
  ): void => {
    const input = event.currentTarget;
    const fileList = input?.files ?? null;
    if (fileList != null && fileList.length > 0) {
      const file = fileList[0];
      try {
        let loadedQuests: Quest[] = [];
        file.text().then((jsonString) => {
          loadedQuests = JSON.parse(jsonString) as Quest[];
          if (loadedQuests.length > 0) {
            ledger.value = loadedQuests;
          }
        });
      } catch (error) {
        console.log(`Could not parse loaded file: ${error}`);
      }
    }
  };

  const handleSaveLedger = (): void => {
    const jsonString = JSON.stringify(ledger.value, null, 2);
    const file = new File([jsonString], defaultSaveFileName, {
      type: "application/json",
    });
    downloadFile(file);
  };

  const handleExportCSV = (): void => {
    const csvString = QuestsToCSV(ledger.value);
    const file = new File([csvString], "ledger.csv", { type: "text/csv" });
    downloadFile(file);
  };

  const handleExportMarkdownDashboard = (): void => {
    const mdString = ConvertLedgerDashboardToMarkdown();
    const file = new File([mdString], "dashboard.md", { type: "text/markdown" });
    downloadFile(file);
  };

  return (
    <nav class="navbar is-danger" role="navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <span class="icon-text">
            <TaskDragonIcon />
            <span>
              <h1 class="title is-4">Task Dragon</h1>
            </span>
          </span>
        </a>
        <a
          class="navbar-item"
          onClick={() => handleAddQuest(props)}
          title="Add a new quest..."
        >
          <AddQuestIcon />
        </a>
        <a class="navbar-item" onClick={() =>
          globalThis.document.getElementById(fileInputId)?.click()}>
          <input
            id={fileInputId}
            class="button is-info"
            type="file"
            accept=".json"
            onInputCapture={handleLoadLedger}
            style="display:none"
          />
          <span class="icon" title="Open...">{ICONS.open}</span>
        </a>
        <a class="navbar-item" onClick={handleSaveLedger}>
          <span class="icon" title="Save...">{ICONS.save}</span>
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <span class="icon" title="Export...">{ICONS.export}</span>
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" onClick={handleExportCSV}>
                Export to CSV File...
              </a>
              <a class="navbar-item" onClick={handleExportMarkdownDashboard}>
                Export Dashboard to Markdown File...
              </a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <span class="icon" title="About...">{ICONS.about}</span>
            </a>
            <div class="navbar-dropdown is-right">
              <a class="navbar-item is-right">
                <p>Task Dragon is a simple tool designed to assist TTRPG players with managing quests and activities.</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav >
  );
}
