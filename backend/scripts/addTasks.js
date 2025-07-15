const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Task = require("../model/Task");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Task.insertMany([
    {
  title: "Add Daily Tasks to your Phone's Homescreen",
  instructions: "Add Daily Tasks to your Homescreen and upload a screenshot of your Home screen with Daily Tasks on it.",
  actionLink: "dailytasks.co",
  points: 2,
},
    {
      title: "Follow Instagram Page",
      instructions: "Go to our Instagram page, like and follow the page. Do not unlike or unfollow the page;otherwise points will be deducted.",
      actionLink: "https://www.instagram.com/dailytasks10",
      points: 1,
      questions: [
        { question: "What is your Instagram handle?" }
      ]
    },
    {
      title: "Follow X (Twitter) page",
      instructions: "Follow us on X (Twitter).",
      actionLink: "https://x.com/dailytasks10?s=21",
      points: 1,
      questions: [
        { question: "What is your (X) Twitter handle?" }
      ]
    },
    {
      title: "Comment on Facebook Post",
      instructions: "Go to our latest Facebook post and drop a nice comment.",
      actionLink: "https://www.facebook.com/dailytasks10",
      points: 2,
      questions: [
        { question: "What name did you use to comment?" }
      ]
    },
    {
      title: "Youtube Video",
      instructions: "Watch the video to the end without skipping, subscribe to the channel, turn on notification and share. Upload screenshot showing you watched the video to end, subscribed and turned on notification. Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
      actionLink: "https://youtu.be/wQ1WoCug1Ms ",
      points: 5,
      questions: [
        { question: "What platform did I kick things off with?", answer: "prolific" }
      ]
    },
    {
      title: "Facebook Follow",
      instructions: "Follow Daily Tasks on Facebook.",
      actionLink: "https://www.facebook.com/share/198CRxMWP6/?mibextid=wwXIfr",
      points: 1,
      questions: [
        { question: "What is your Facebook username?" }
      ]
    },
    {
      title: "Watch YouTube Video",
      instructions:"Watch the video to the end without skipping, share and like the video, upload proof of completed task and answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
      actionLink: "https://youtu.be/Oz-eLGeQo7w",
      points: 5,
      questions: [
        { question: "Your browser settings and prolific profile should reflect your actual _______?", answer: "location" }
      ]
    },
    {
  title: "Watch YouTube Video",
 instructions: "Watch the video to the end without skipping, share and like the video, upload proof of completed task and answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
  actionLink: "https://youtu.be/57y35YcfUo4",
  points: 5,
  questions: [
    { question: "What do you turn into income?", answer: "knowledge" }
  ]
},
{
  title: "Watch YouTube Video",
 instructions: "Watch the video to the end without skipping, share and like the video, upload proof of completed task and answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
  actionLink: "https://youtu.be/yHZJbeyrYHg",
  points: 5,
  questions: [
    { question: "What do schools pay students to make?", answer: "content" }
  ]
},
{
  title: "Watch YouTube Video",
 instructions: "Watch the video to the end without skipping, share and like the video, upload proof of completed task and answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
  actionLink: "https://youtu.be/XFcb9P0kTQw",
  points: 5,
  questions: [
    { question: "What do you use to save time?", answer: "template" }
  ]
},

{
  title: "Facebook like,comment, and share",
  instructions: "Click on Go to task watch the video, like it, give a good comment and share. Upload a screenshot of the shared video on your own page",
  actionLink: "https://www.facebook.com/share/r/1VTzypEZ6S/?mibextid=wwXIfr",
  points: 3,
  questions: [
    { question: "What is your facebook username?" }
  ]
},
{
  title: "Instagram like,comment, and share",
  instructions: "Click on Go to task watch the video, like it, give a good comment and share. Upload a screenshot of the shared video on your own page",
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

