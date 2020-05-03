document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".tinder").addEventListener("click", tinder, false);
    document.querySelector(".bumble").addEventListener("click", bumble, false);
    document.querySelector(".okcupid").addEventListener("click", okcupid, false);

    // This function is to handle whenever tinder button will be clicked.
    function tinder() {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, "tinder");
        });
    }

    // This function is to handle whenever bumble button will be clicked.
    function bumble() {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, "bumble");
        });
    }

    // This function is to handle whenever okcupid button will be clicked.
    function okcupid() {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, "okcupid");
        });
    }
}, false);