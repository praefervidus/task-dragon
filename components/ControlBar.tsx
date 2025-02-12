import { Signal } from "@preact/signals";

interface ControlBarProps {
  addQuest: () => number;
  currentQuest: Signal<number>;
}

const handleAddQuest = (props: ControlBarProps): void => {
  props.currentQuest.value = props.addQuest();
};

export default function ControlBar(props: ControlBarProps) {
  return (
    <nav class="level-left">
      <p class="level-item has-text-centered">
        <button
          class="button link is-info is-large"
          onClick={() => handleAddQuest(props)}
        >
          +
        </button>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">Open</a>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">Save</a>
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
