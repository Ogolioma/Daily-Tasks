const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Task = require("../model/Task");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Task.insertMany([
    {
      title: "Youtube Video",
      instructions: "Watch the video to the end without skipping,<br/><br/> subscribe to the channel, turn on notification and share.<br/><br/> Upload screenshot showing you watched the video to end, subscribed and turned on notification. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
      actionLink: "https://youtu.be/wQ1WoCug1Ms ",
      points: 8,
      questions: [
        { question: "You shouldn't hand over ________ to sign up?", answer: "money" }
      ]
    },
    {
      title: "Watch YouTube Video",
      instructions:"Watch the video to the end without skipping,<br/><br/> share and like the video,then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
      actionLink: "https://youtu.be/Oz-eLGeQo7w",
      points: 7,
      questions: [
        { question: "You should use a fresh, professional ________?", answer: "email" }
      ]
    },
    {
  title: "Watch YouTube Video",
 instructions: "Watch the video to the end without skipping, <br/><br/>share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
  actionLink: "https://youtu.be/57y35YcfUo4",
  points: 8,
  questions: [
    { question: " I stopped charging hourly and started creating _______?", answer: "packages" }
  ]
},
{
  title: "Watch YouTube Video",
 instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
  actionLink: "https://youtu.be/yHZJbeyrYHg",
  points: 8,
  questions: [
    { question: "Some schools pay student to make_______?", answer: "content" }
  ]
},
{
  title: "Watch YouTube Video",
 instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
  actionLink: "https://youtu.be/XFcb9P0kTQw",
  points: 7,
  questions: [
    { question: "People wouldn't trust a blank_______?", answer: "portfolio" }
  ]
},

{
  title: "Facebook like,comment, and share",
  instructions: "Click on Go to task watch the video,and share. <br/><br/>Upload a screenshot of the shared video on your own page",
  actionLink: "https://www.facebook.com/share/r/1VTzypEZ6S/?mibextid=wwXIfr",
  points: 3,
  questions: [
    { question: "What is your facebook username?" }
  ]
},
{
  title: "Instagram like,comment, and share",
  instructions: "Click on Go to task watch the video, and share.<br/><br/> Upload a screenshot of the shared video on your own page",
  actionLink: "https://www.instagram.com/reel/DMDLSibqNF5/?igsh=MW9zMG5iOWZxamtheA==",
  points: 3,
  questions: [
    { question: "What is your instagram username?" }
  ]
}
  ]);

  console.log("✅ Tasks inserted successfully");
  mongoose.disconnect();
});

