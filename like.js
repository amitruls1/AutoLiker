document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.querySelector(".tinder").addEventListener("click", tinder, false);
    document.querySelector(".bumble").addEventListener("click", bumble, false);
    document
      .querySelector(".okcupid")
      .addEventListener("click", okcupid, false);

    // This function is to handle whenever tinder button will be clicked.
    function tinder() {
      const interval = document.querySelector("#tinder_interval").value || 300;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "tinder", interval });
      });
    }

    // This function is to handle whenever bumble button will be clicked.
    function bumble() {
      const interval = document.querySelector("#bumble_interval").value || 300;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "bumble", interval });
      });
    }

    // This function is to handle whenever okcupid button will be clicked.
    function okcupid() {
      const message = document.querySelector("#okcupid_message").value;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "okcupid", message });
      });
    }
  },
  false
);
