import { Signal } from "@preact/signals";
import { ledger } from "../utils/ledger.ts";

interface ControlBarProps {
  addQuest: () => number;
  currentQuest: Signal<number>;
}

const handleAddQuest = (props: ControlBarProps): void => {
  props.currentQuest.value = props.addQuest();
};

const defaultSaveFileName = "ledger.json";
const handleSaveLedger = (): string => {
  const jsonString = JSON.stringify(ledger.value, null, 2);
  const file = new File([jsonString], defaultSaveFileName, {
    type: "application/json",
  });
  return URL.createObjectURL(file);
};

export default function ControlBar(props: ControlBarProps) {
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
        <a class="link is-info">Open</a>
      </p>
      <p class="level-item has-text-centered">
        <a
          class="link is-info"
          href={handleSaveLedger()}
          download={defaultSaveFileName}
          target="_blank"
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
