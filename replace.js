findAndReplaceForm.addEventListener("submit", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let find = document.getElementById("findInput").value;
  let replace = document.getElementById("replaceInput").value;
  chrome.storage.sync.set({find});
  chrome.storage.sync.set({replace});

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: replaceAll,
  });
});



function replaceAll() {
  chrome.storage.sync.get("find", ({ find }) => {
    chrome.storage.sync.get("replace", ({ replace }) => {
      var elements = document.getElementsByTagName('*');
      for (const element of elements) {
        for (const node of element.childNodes) {
          if (node.nodeType === 3) {
            var text = node.nodeValue;

          //should switch to regular expression, to capture every one per node
            var replacedText = text.replace(new RegExp(find, "gi"), replace);

            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
            }
          }
        }
      }
    });
  });
}

