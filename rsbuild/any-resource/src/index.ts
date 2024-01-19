// inject css
import "./foo.css";
// load source only
import source from "./foo.css?type=source";

const pre = document.createElement("pre");

pre.textContent = source;

document.body.appendChild(pre);
