import { createRoot } from "react-dom/client";
import { Bar } from "./bar";

import { changeme } from "./changeme";

createRoot(document.querySelector("#react")).render(<Bar />);

const div = document.createElement("div");
div.textContent = `Manual hmr: ${changeme}`;

document.body.appendChild(div);

if (module.hot) {
  module.hot.accept("./changeme.js", function () {
    div.textContent = `Manual hmr: ${changeme}`;
  });
}
