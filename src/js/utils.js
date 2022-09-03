/**@type {HTMLPreElement} */
let logArea;

function init() {
  const logPreTag = document.createElement("pre");
  const logCodeTag = document.createElement("code");
  logCodeTag.classList.add("log-data");

  logCodeTag.appendChild(logPreTag);
  document.body.appendChild(logCodeTag);
  logArea = logPreTag;
}

export function logToDocument(...data) {
  if (!logArea) {
    init();
  }
  logArea.replaceChildren([JSON.stringify(data, null, 2)]);
  fetch("/.netlify/functions/log-errors", {
    method: "POST",
    body: JSON.stringify(data, null, 2),
  });
}
