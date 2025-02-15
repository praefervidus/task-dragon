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
  const activeStyle = "is-active";
  const linkStyle = "has-text-white";
  return (
    <header class="tabs is-boxed">
      <ul>
        <li
          class={(props.currentSelection === SelectedTab.All)
            ? activeStyle
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.All)}
            class={linkStyle}
          >
            All
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Main)
            ? activeStyle
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Main)}
            title="Part of the central story."
            class={linkStyle}
          >
            Main
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Side)
            ? activeStyle
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Side)}
            title="An arc peripheral but not unrelated to the central plot."
            class={linkStyle}
          >
            Side
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Gigs)
            ? activeStyle
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Gigs)}
            title="A quick job."
            class={linkStyle}
          >
            Gigs
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Leads)
            ? activeStyle
            : ""}
        >
          <a
            onClick={() => props.setSelection(SelectedTab.Leads)}
            title="An interesting rumor to follow."
            class={linkStyle}
          >
            Leads
          </a>
        </li>
        <li
          class={(props.currentSelection === SelectedTab.Closed)
            ? activeStyle
            : ""}
        >
          <a onClick={() => props.setSelection(SelectedTab.Closed)} class={linkStyle}>Closed</a>
        </li>
      </ul>
    </header>
  );
}
