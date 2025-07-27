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
        actionLink: "https://youtu.be/5Hkz89EY96w",
        points: 1
      },
       {
        title: "Watch Video",
        instructions: "Go to youtube.com and search 'how to grow with dailytasks.co' <br/>Click on the screenshot with the thumbnail that appears when you click 'Go to task', <br/><br/>Watch the video to the end and leave a comment<br/><br/> Upload screenshot showing you watched the video to end, and your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://imgur.com/a/wQjiWkn",
        points: 7,
        questions: [
          { question: "What's the name of the character whose story was told?", answer: "josh" },
          {question: "it's not about perfection, it's about _______ ?", answer: "progress"},
           { question: "What do you build when You start showing up?", answer: "tribe" },
          {question: "If you've ever felt like your content was _______ ?", answer: "invisible"},
          {question: "Your _______ should come with attractive points?", answer: "content"}
        ]
      },
    ]);

    console.log("✅ Tasks inserted successfully");
  });