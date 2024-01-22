import { hydrateRoot } from "react-dom/client";
import { Root } from "./root";
import { loadableReady } from "@loadable/component";

loadableReady(() => {
  hydrateRoot(document.querySelector("#react"), <Root />);
});
