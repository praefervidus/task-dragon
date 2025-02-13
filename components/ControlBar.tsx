import { Signal } from "@preact/signals";
import { ledger } from "../utils/ledger.ts";
import { Quest } from "../models/Quest.ts";
import { JSX } from "preact/jsx-runtime";

interface ControlBarProps {
  addQuest: () => number;
  currentQuest: Signal<number>;
}

const handleAddQuest = (props: ControlBarProps): void => {
  props.currentQuest.value = props.addQuest();
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
    const url = URL.createObjectURL(file);
    const tmpElement = globalThis.document.createElement("a");
    tmpElement.href = url;
    tmpElement.download = defaultSaveFileName;
    tmpElement.target = "_blank";
    tmpElement.setAttribute("style", "display:none");
    globalThis.document.body.appendChild(tmpElement);
    tmpElement.click();
    tmpElement.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <nav class="level-left">
      <p class="level-item has-text-centered">
        <button
          class="button is-info is-large"
          onClick={() => handleAddQuest(props)}
        >
          +
        </button>
      </p>
      <p class="level-item has-text-centered">
        <input
          id={fileInputId}
          class="button is-info"
          type="file"
          accept=".json"
          onInputCapture={handleLoadLedger}
          style="display:none"
        />
        <a
          class="button is-info"
          onClick={() =>
            globalThis.document.getElementById(fileInputId)?.click()}
        >
          Open
        </a>
      </p>
      <p class="level-item has-text-centered">
        <a
          class="button is-info"
          onClick={handleSaveLedger}
        >
          Save
        </a>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">Export</a>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">About</a>
      </p>
    </nav>
  );
}
