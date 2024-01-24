import { Landing } from "./pages/landing";
import { renderToString } from "react-dom/server";

const pages = {
  Landing,
};

export const render = (page) => {
  const Page = pages[page];
  if (!Page) {
    return `404 Not Found - ${page}`;
  }

  return renderToString(<Page />);
};
