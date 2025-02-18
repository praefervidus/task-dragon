import { Signal } from "@preact/signals";
import { ConvertLedgerDashboardToMarkdown, ledger } from "../utils/ledger.ts";
import { Quest, QuestsToCSV } from "../models/Quest.ts";
import { JSX } from "preact/jsx-runtime";
import ICONS from "../utils/icons.ts";
import AddQuestIcon from "./icons/AddQuestIcon.tsx";
import TaskDragonIcon from "./icons/TaskDragonIcon.tsx";
import { ConvertQuestToMarkdown } from "../models/Quest.ts";
import { BlobWriter, TextReader, ZipWriter } from "zip-js";

interface ControlBarProps {
  addQuest: () => number;
  currentQuest: Signal<number>;
}

const getTodaysDateString = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  const hrs = String(today.getHours()).padStart(2, '0');
  const min = String(today.getMinutes()).padStart(2, '0');
  const sec = String(today.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hrs}h${min}m${sec}s`;
};

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

const downloadBlob = (blob: Blob, name: string): void => {
  const url = URL.createObjectURL(blob);
  const tmpElement = globalThis.document.createElement("a");
  tmpElement.href = url;
  tmpElement.download = name;
  tmpElement.target = "_blank";
  tmpElement.setAttribute("style", "display:none");
  globalThis.document.body.appendChild(tmpElement);
  tmpElement.click();
  tmpElement.remove();
  URL.revokeObjectURL(url);
}

export default function ControlBar(props: ControlBarProps) {
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
    const defaultSaveFileName = `ledger_${getTodaysDateString()}.json`;
    const jsonString = JSON.stringify(ledger.value, null, 2);
    const file = new File([jsonString], defaultSaveFileName, {
      type: "application/json",
    });
    downloadFile(file);
  };

  const handleExportCSV = (): void => {
    const defaultCSVFileName = `ledger_${getTodaysDateString()}.csv`;
    const csvString = QuestsToCSV(ledger.value);
    const file = new File([csvString], defaultCSVFileName, { type: "text/csv" });
    downloadFile(file);
  };

  const handleExportMarkdownFile = (): void => {
    const defaultFileName = `ledger_${getTodaysDateString()}.md`;
    const mdString = ConvertLedgerDashboardToMarkdown(false);
    const file = new File([mdString], defaultFileName, { type: "text/markdown" });
    downloadFile(file);
  };

  const handleExportMarkdownArchive = async (): Promise<void> => {
    const zipFileWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(zipFileWriter);

    const indexFileContents = new TextReader(ConvertLedgerDashboardToMarkdown(true));
    await zipWriter.add("index.md", indexFileContents);
    await zipWriter.add("quests", undefined, { directory: true });
    ledger.value.forEach(async q => {
      const content = new TextReader(`[< Back to Quest Log](../index.md)\n\n${ConvertQuestToMarkdown(q, true)}`);
      await zipWriter.add(`quests/${q.id}.md`, content);
    });

    const zipData = await zipWriter.close();

    downloadBlob(zipData, `ledger_${getTodaysDateString()}.zip`);
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
              <a class="navbar-item" onClick={handleExportMarkdownFile}>
                Export to Markdown File...
              </a>
              <a class="navbar-item" onClick={handleExportMarkdownArchive}>
                Export to Markdown Archive...
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
