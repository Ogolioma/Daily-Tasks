const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Task = require("../model/Task");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Task.insertMany([
    {
      title: "Like Instagram Page",
      instructions: "Go to our Instagram page and like the most recent post. Do not unlike the page; points will be deducted.",
      actionLink: "https://www.instagram.com/dailytasks10",
      points: 1,
      questions: [
        { question: "What is your Instagram handle?" }
      ]
    },
    {
      title: "Retweet Post",
      instructions: "Retweet the pinned post on our Twitter page.",
      actionLink: "https://x.com/dailytasks10?s=21",
      points: 1,
      questions: [
        { question: "What is your Twitter handle?" }
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
      instructions: "Watch the video to the end without skipping.",
      actionLink: "https://youtu.be/WJguFnQ4wo4?si=AcSCOzlcNLqP-XS5",
      points: 5,
      questions: [
        { question: "What did you learn from the video?" },
        { question: "What username did you use to comment?"}
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
      title: "Watch YouTube Video with questions",
      instructions: "Watch this video fully, then answer questions.",
      actionLink: "https://youtu.be/EyoRtjQ3vCI?si=GMCG0csCJlz1-6tl",
      points: 5,
      questions: [
        { question: "What is the name of the second platform?", answer: "remotask" },
        { question: "How much does the fourth platform pay (enter fisures only)?", answer: "150" }
      ]
    }
  ]);

  console.log("✅ Tasks inserted successfully");
  mongoose.disconnect();
});

