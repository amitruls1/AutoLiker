chrome.runtime.onMessage.addListener((props) => {
  const { type, interval, message, isNonGenderDetection, isTurkey } = props;
  switch (type) {
    case "tinder":
      executeTinder(interval, isNonGenderDetection);
      return;

    case "bumble":
      executeBumble(interval);
      return;

    case "okcupid":
      executeOkCupid(message, isTurkey);
      return;
  }
});

// This function will start auto liking profiles on Tinder.
const rejectWords = [
  "trans",
  "gay",
  "lesbian",
  "crossdresser",
  "transwomen",
  "lady",
  "ladyboy",
];
const bioTextArray = {
  current: "",
  previous: "",
};
let totalTinderLikes = 0;
let totalTinderDisLikes = 0;
const executeTinder = (interval, isNonGenderDetection) => {
  window.setInterval(() => {
    let isReject = false;
    // if (isNonGenderDetection) {
    //   try {
    //     const bioArray = document.querySelectorAll(".BreakWord");
    //     const bioLength = document.querySelectorAll(".BreakWord").length;
    //     console.log(bioArray[bioLength - 1].innerText.toLowerCase());
    //     if (bioLength) {
    //       rejectWords.forEach((item) => {
    //         if (
    //           bioArray[bioLength - 1].innerText.toLowerCase().includes(item)
    //         ) {
    //           isReject = true;
    //         }
    //       });
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
    if (isReject) {
      console.log("Detected Non Straight Gender");
      try {
        if (document.querySelectorAll("[itemprop='name']").length > 1) {
          console.log(
            `Disliked ${
              document.querySelectorAll("[itemprop='name']")[1].innerText
            }`
          );
        }
      } catch (e) {
        console.error(e);
      }
      totalTinderDisLikes++;
      document.querySelectorAll(".button")[1].click();
    } else {
      totalTinderLikes++;
      if (
        document.querySelectorAll(".button")[3].innerText.toLowerCase() ===
        "like"
      ) {
        document.querySelectorAll(".button")[3].click();
      } else {
        document.querySelectorAll(".button")[4].click();
      }
    }
    console.log(
      `%cTotal Likes ${totalTinderLikes}`,
      "color:green; font-weight: 600;"
    );
    // console.log(
    //   `%cTotal Dislikes ${totalTinderDisLikes}`,
    //   "color:red; font-weight: 600;"
    // );
  }, interval);
};

// This function will start auto liking profiles on Bumble.
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

let totalBumbleLikes = 0;
let totalBumbleDisLikes = 0;
const executeBumble = (interval) => {
  window.setInterval(() => {
    eventFire(
      document.querySelectorAll(".encounters-action--like")[0],
      "click"
    );
    totalBumbleLikes++;
    console.log(
      `%cTotal Likes ${totalBumbleLikes}`,
      "color:green; font-weight: 600;"
    );
  }, interval);
};

// This function will perform profile open => profile like => profile message send and repeate this process on OKCupid.

const DEF_DELAY = 1000;
const lines = [
  `I was blaming pollution for global warming, but garmi to tum badhaye hue ho :p`,
  `Is this the Hogwarts Express? Because it feels like you and I are headed somewhere magical.`,
  `I am going to complain to Spotify about you not being this weeks hottest single.`,
  `Roses are red, violets are blue, I’m not that pretty but damn look at you.`,
  `Roses are red, my face is too, that only happens when I’m around you`,
  `Can I follow you? Cause my mom told me to follow my dreams`,
  `I heard you’re good in algebra, can you replace my X without asking Y`,
  `Are you a camera? Because every time I look at you, I smile.`,
  `Roses are red violets are blue I didn’t know what perfect was until I met you`,
  `Guess what I’m wearing? The smile you gave me!`,
  `You’re That “Nothing” When People Ask Me What I’m Thinking About.`,
  `Aside from being drop-dead gorgeous, what do you do for a living?`,
  `Hey, my name's Microsoft. Can I crash at your place?`,
  `Kiss me if I'm wrong. But dinosaurs still exist, right?`,
  `You owe me a drink. Because when I looked at you, I dropped mine!`,
  `Want a raisin? No? Well, how about a date?`,
  `You must be a high test score. Because I want to take you home and show you to my mother.`,
  `I may not be a photographer. But I can totally picture us together.`,
  `You must be a magician. Because any time I look at you, everyone else disappears.`,
  `Was your dad a boxer? Because you're a knockout!`,
  `I think you're suffering from a lack of vitamin me.`,
  `I want our love to be like the number Pi: irrational and never-ending.`,
  `Is your name Ariel? Cause we Mermaid for each other.`,
  `If you were words on a page you'd be the fine print.`,
  `I'm writing a term paper on the finer things in life, and I was wondering if I could interview you.`,
  `You are the reason even Santa has a naughty list.`,
  `Where have I seen you before? Oh yeah, I remember now. It was in the dictionary next to the word GORGEOUS!`,
  `Don't tell me if you want me to take you out to dinner. Just smile for yes, or do a backflip/somersault/counter-spin gymnastics combination for no.`,
  `I wasn't always religious. But I am now, because you're the answer to all my prayers.`,
  `If I could rearrange the alphabet, I'd put 'I' and 'U' together.`,
  `You must be exhausted. You've been running through my mind all day.`,
];
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || DEF_DELAY));
}
let totalOkcupidLikes = 0;
let totalOkcupidDisLikes = 0;
const executeOkCupid = async (message, isTurkey) => {
  try {
    if (isTurkey) {
      document.querySelectorAll(".dt-comment-fab")[0].click();
    } else {
      document.querySelectorAll(".intro")[0].click();
    }
    await sleep(2500);
    document.querySelector(".messenger-composer").value = message
      ? message
      : lines[2];
    await sleep(2000);
    var event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    document.querySelector(".messenger-composer").dispatchEvent(event);
    await sleep(1000);
    document.querySelector(".messenger-toolbar-send").click();
    await sleep(2500);
    document.querySelector(".connection-view-container-close-button").click();
    await sleep(2500);
    executeOkCupid(message ? message : lines[2], isTurkey);
    totalOkcupidLikes++;
    console.log(
      `%cTotal Likes & Message ${totalOkcupidLikes}`,
      "color:green; font-weight: 600;"
    );
  } catch (e) {
    await sleep(2500);
    if (
      document.querySelectorAll(".connection-view-container-close-button")
        .length
    ) {
      document
        .querySelectorAll(".connection-view-container-close-button")[0]
        .click();
    }
    await sleep(2500);
    executeOkCupid(message ? message : lines[2], isTurkey);
    console.log(e);
  }
};
