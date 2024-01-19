import { createRoot } from "react-dom/client";
import { Bar } from "./bar";

import { foo } from "./foo";

createRoot(document.querySelector("#react")).render(<Bar />);

const div = document.createElement("div");
div.textContent = `${foo}`;

document.body.appendChild(div);

if (module.hot) {
  module.hot.accept("./foo.js", function () {
    div.textContent = `${foo}`;
  });
}
