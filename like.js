document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.querySelector(".tinder").addEventListener("click", tinder, false);
    document.querySelector(".bumble").addEventListener("click", bumble, false);
    document.querySelector(".happn").addEventListener("click", happn, false);
    document
      .querySelector(".okcupid")
      .addEventListener("click", okcupid, false);
    // This function is to handle whenever tinder button will be clicked.
    function tinder() {
      const interval = 500;
      // const isNonGenderDetection = document.querySelector("#tinder_badword")
      //   .checked;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "tinder",
          interval,
          isNonGenderDetection: false,
        });
      });
    }

    // This function is to handle whenever bumble button will be clicked.
    function bumble() {
      const interval = 500;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "bumble", interval });
      });
    }

    // This function is to handle whenever happn button will be clicked.
    function happn() {
      const interval = 1000;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "happn", interval });
      });
    }

    // This function is to handle whenever okcupid button will be clicked.
    function okcupid() {
      const message = document.querySelector("#okcupid_message").value;
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "okcupid",
          message,
        });
      });
    }
  },
  false
);
