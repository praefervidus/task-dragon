import { Dispatch } from "preact/hooks";

export enum SelectedTab {
  All = "A",
  Main = "M",
  Side = "S",
  Gigs = "G",
  Leads = "L",
  Closed = "C",
}

export interface QuestTypeTabsProps {
  currentSelection: SelectedTab;
  // deno-lint-ignore no-explicit-any
  setSelection: Dispatch<any>;
}

export function QuestTypeTabs(props: QuestTypeTabsProps) {
  return (
    <header class="tabs is-boxed">
      <ul>
        <li
          class={(props.currentSelection === SelectedTab.All)
            ? "is-active"
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.All)}
          >
            All
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Main)
            ? "is-active"
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Main)}
            title="Part of the central story."
          >
            Main
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Side)
            ? "is-active"
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Side)}
            title="An arc peripheral but not unrelated to the central plot."
          >
            Side
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Gigs)
            ? "is-active"
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Gigs)}
            title="A quick job."
          >
            Gigs
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Leads)
            ? "is-active"
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Leads)}
            title="An interesting rumor to follow."
          >
            Leads
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Closed)
            ? "is-active"
            : ""}
        >
          <a onClick={() => props.setSelection(SelectedTab.Closed)}>Closed</a>
        </li>
      </ul>
    </header>
  );
}
