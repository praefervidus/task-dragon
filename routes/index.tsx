import LedgerPanel from "../islands/LedgerPanel.tsx";

export default function Home() {
  return (
    <main>
      <header class="hero">
        <div class="hero-body">
          <p class="title">Task Dragon</p>
        </div>
      </header>
      <LedgerPanel />
    </main>
  );
}
