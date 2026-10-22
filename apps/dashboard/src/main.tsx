import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <main>
      <p>Maple Portfolio · M1 foundation</p>
      <h1>Your portfolio, with privacy in mind.</h1>
      <p>
        A read-only Canadian portfolio analysis project, currently in
        development.
      </p>
      <section aria-labelledby="status">
        <h2 id="status">Development scaffold</h2>
        <p>
          CSV import and portfolio analysis are not available yet. Please do not
          enter or upload financial information.
        </p>
      </section>
      <p>
        Independent of Wealthsimple and OpenAI. No brokerage connection,
        trading, or personalized investment advice.
      </p>
    </main>
  );
}
const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
