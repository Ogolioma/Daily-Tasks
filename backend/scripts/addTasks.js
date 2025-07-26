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
        actionLink: "https://youtu.be/57y35YcfUo4",
        points: 6,
        questions: [
           { question: "Always look for ________ ?", answer: "leverage" },
          {question: "How much should you not blow on airpods (write only in figures/numbers)", answer: "500"},
           { question: "what should you not treat your income like", answer: "trophy" },
          {question:"_________ is procastination in a tuxedo", answer: "perfectionism"},
          {question: "How many ways where listed in the video? (write only in figures/numbers)", answer: "10"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/yHZJbeyrYHg",
        points: 6,
        questions: [
          { question: "Let's talk about _______ potholes?", answer: "financial" },
          { question: "You've learned how to grow your money <br/><br/>through budgeting, _______ and protecting your cash?", answer: "planning" }
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/wQ1WoCug1Ms?si=W36EyzajbLdI09kH",
        points: 4,
        questions: [
          { question: "Which sites should you jump on?", answer: "microtask" }
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/Oz-eLGeQo7w?si=5nUmJv0T805BHkNT",
        points: 4,
        questions: [
          { question: "__________ your sign up just right?", answer: "time" }
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/57y35YcfUo4?si=ISU6aCB5ndjsfEw_",
        points: 4,
        questions: [
          { question: "Tell me, what's your first__________ ?", answer: "move" }
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/yHZJbeyrYHg?si=gBuKMvyrVt3cHIV3",
        points: 4,
        questions: [
          { question: "All you need is internet access, and a bit of ______ believe?", answer: "self" }
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/XFcb9P0kTQw?si=rYynGrBMk60K1N-7",
        points: 4,
        questions: [
          { question: "What ______ are you diving into this week?", answer: "skill" }
        ]
      }
    ]);

    console.log("✅ Tasks inserted successfully");
  });