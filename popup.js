document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: extractPhrase,
      },
      function (results) {
        const correctionsDiv = document.getElementById("corrections");
        const result = results && results[0] && results[0].result;

        if (result && result.success) {
          correctionsDiv.textContent =
            "Phrase originale copiée dans le presse-papiers.";

          // Copie la phrase dans le presse-papiers
          copyToClipboard(result.phrase);
        } else {
          correctionsDiv.textContent =
            "Impossible de copier la phrase originale.";
        }
      }
    );
  });
});

function extractPhrase() {
  const parentDivs = document.querySelectorAll(
    "div.css-175oi2r.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-1peese0.r-1wzrnnt.r-3pj75a.r-13qz1uu"
  );

  const originalWords = [];
  parentDivs.forEach((parent) => {
    const childElements = parent.querySelectorAll(".css-146c3p1.r-184en5c");
    childElements.forEach((el) => {
      originalWords.push(el.textContent.trim());
    });
  });

  // Crée la phrase originale et supprime les espaces en trop
  const originalPhrase = originalWords.join(" ").replace(/\s+/g, " ").trim();

  return originalPhrase
    ? { success: true, phrase: originalPhrase }
    : { success: false };
}

function copyToClipboard(text) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}
