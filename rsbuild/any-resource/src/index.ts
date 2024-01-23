// inject css
// import source from "./foo.css";
// load source only
import source from "./foo.css?type=source";

console.log(source);

const pre = document.createElement("pre");

pre.textContent = source;

document.body.appendChild(pre);
