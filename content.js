chrome.runtime.onMessage.addListener((type) => {
    console.log(type);
    switch (type) {
        case "tinder":
            executeTinder();
            return;

        case "bumble":
            executeBumble();
            return;

        case "okcupid":
            executeOkCupid();
            return;
    }

})

// This function will start auto liking profiles on Tinder.

const executeTinder = () => {
    window.setInterval(()=>{document.querySelectorAll(".button")[3].click();}, 300);
}

// This function will start auto liking profiles on Bumble.

const executeBumble = () => {
    window.setInterval(()=>{document.getElementsByClassName("encounters-action--like")[0].click();}, 300);
}

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
  `You must be exhausted. You've been running through my mind all day.`
];
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

const executeOkCupid = async () => {
    try {
      document.querySelectorAll(".cardsummary-profile-link > a")[0].click();
      await sleep(2500);
      document.querySelectorAll(".likes-pill-button")[0].click();
      await sleep(2500);
      document.querySelector(".messenger-composer").value = lines[Math.abs(Math.random()*30)];
      await sleep(2500);
      var event = new Event('input', {
          bubbles: true,
          cancelable: true,
      });
      document.querySelector(".messenger-composer").dispatchEvent(event);
      await sleep(2500);
      console.log("sending message");
      document.querySelector(".messenger-toolbar-send").click();
      await sleep(2500);
      document.querySelector(".connection-view-container-close-button").click();
      await sleep(2500);
      document.querySelector(".navbar a").click();
      await sleep(2500);
      executeOkCupid();
    } catch (e) {
        document.querySelector(".navbar a").click();
        await sleep(2500);
        console.log(e);
    }
    
}