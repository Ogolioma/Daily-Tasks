const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Task = require("../model/Task");
const User = require("../model/user");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // ✅ Insert all your tasks exactly as provided
    await Task.insertMany([
        {
        title: "Video share",
        instructions: "Share the youtube video to whatsapp groups or facebook <br/><br/> Upload a screenshot of the page you shared to ",
        actionLink: "https://youtu.be/GbSFoYEF_4U?si=tYXX-DZWhKo225fk",
        points: 1
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> subscribe to the channel, turn on notification and share.<br/><br/> Upload screenshot showing you watched the video to end, subscribed and turned on notification. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/GbSFoYEF_4U?si=Uts2s_a5liGT4S9I",
        points: 7,
        questions: [
          { question: "You ________ to earn, you deserve freedom?", answer: "deserve" },
          {question: "_______ don't always show up in suits and ties?", answer: "opportunities"},
           { question: "You are not just maximizing time, you are ________ time into income?", answer: "flipping" },
          {question: "You don't need a _______ to make money?", answer: "job"},
          {question: "He doesn't work a  _______ job?", answer: "traditional"}
        ]
      },
      {
        title: "Watch Video",
        instructions:"Watch the video to the end without skipping,<br/><br/> share and like the video,then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/t4NWv3tShcA?si=-9C0yZGNfPYHQlHQ",
        points: 6,
        questions: [
          { question: "What's missing isn't money, it's ________ ?", answer: "motion" },
          {question: "Don't _______ it. Start messy", answer: "overthink"},
           { question: "How much in dollars does Sandra earn per month? (write only in figures/numbers)", answer: "800" },
          {question:"Where is the real money in?", answer: "discipline"},
          {question: "How many ways where listed in the video? (write only in figures/numbers)", answer: "10"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping, <br/><br/>share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/KLG6Jtw_uUo?si=CXR4Ndpt-F7AP5cT",
        points: 6,
        questions: [
           { question: "Always look for ________ ?", answer: "leverage" },
          {question: "How much should you not blow on airpods (write only in figures/numbers)", answer: "500"},
           { question: "what should you not treat your income like", answer: "trophy" },
          {question:"_________ is procastination in a tuxedo", answer: "perfectionism"},
          {question: "Make __________ a habit, not an aferthought", answer: "reinvestment"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/aOUoHqA4A0o?si=d9gHqOwMA4kQNL_t",
        points: 6,
        questions: [
          { question: "Managing money isn't just about ________ ?", answer: "math" },
          {question: "You just need clarity, _______, and the courage to take small steps consistently", answer: "discipline"},
           { question: "Stop treatin money like a _________?", answer: "mystery" },
          {question:"start treating money like a _________ ", answer: "mission"},
          {question: "that could be __________ your expenses", answer: "tracking"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/wQ1WoCug1Ms?si=Y0pzu7C6MTtWm-Uv",
        points: 4,
        questions: [
           { question: "Focus on ________ that pay more ?", answer: "tasks" },
          {question: "stick to _______ with solid reputation", answer: "platforms"},
           { question: "building your lazy _______ stream", answer: "income" },
          {question:"ride this easy _______ wave together ", answer: "money"},
          {question: "$100 is totally ___________ ", answer: "doable"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/Oz-eLGeQo7w?si=N7cu8jK_venSI10R",
        points: 4,
        questions: [
           { question: "Be smart with your ________ details", answer: "demographic" },
          {question: "increases your chances of ______ the waitlist", answer: "bypassing"},
           { question: " _______ your sign up just right", answer: "time" },
          {question:"_______ it smart and be intentional ", answer: "play"},
          {question: "___________ values diversity", answer: "prolific"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/57y35YcfUo4?si=ujXcWvgbdneayN1c",
        points: 4,
        questions: [
           { question: "turn your ________ into a system", answer: "hustle" },
          {question: "a ________ in, I was selling digital products", answer: "year"},
           { question: " it's a _______, doable path", answer: "proven" },
          {question:"What should you turn into income? ", answer: "knowledge"},
          {question: "The _______ thing in your way is not starting", answer: "only"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/yHZJbeyrYHg?si=rzRsrIgGvgdFXw4A",
        points: 4,
        questions: [
          { question: "you don't need to be a ________ genius", answer: "tech" },
          {question: "you can help them ________ from your laptop", answer: "write"},
           { question: " things began to ____________ ", answer: "shift" },
          {question:"these _________ actually work ", answer: "hustles"},
          {question: "All you need is internet access, and a bit of self _______", answer: "believe"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/XFcb9P0kTQw?si=nQeonvrgSTlHNuie",
        points: 4,
        questions: [
          { question: "What should you do to as many people as possible?", answer: "reach" },
          {question: "with the right ________ set and hustle", answer: "skill"},
           { question: " what ____________ are you diving into this week", answer: "skill" },
          {question:"if you're _________ of the fluff ", answer: "tired"},
          {question: " show upoften and _________ consistently", answer: "deliver"}
        ]
      }
    ]);

    console.log("✅ Tasks inserted successfully");
  });