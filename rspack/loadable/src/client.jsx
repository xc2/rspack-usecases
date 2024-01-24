import { hydrateRoot } from "react-dom/client";
import { Landing } from "./pages/landing";
import { loadableReady } from "@loadable/component";

loadableReady(() => {
  hydrateRoot(document.querySelector("#react"), <Landing />);
});
