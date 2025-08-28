const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Task = require("../model/Task");
const User = require("../model/user");
const sendMail = require("../utils/sendMail");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // ✅ Insert all your tasks exactly as provided
    await Task.insertMany([
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milky Way Part 1 Questions'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/VBlBjFPzesgh",
        points: 6,
        questions: [
          {question: "John realised that the secret wasn't about _________ through", answer: "rushing"},
          {question: "making sure results were __________", answer: "relevant"},
          { question: "No _______ nights about loans", answer: "sleepless" },
          {question: "John learned some __________ lessons", answer: "priceless"},
          {question: "_________ efforts add up", answer: "consistent"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milky Way evaluation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/krM24pfsZlFD",
        points: 6,
        questions: [
          {question: "No _______ no dresscode", answer: "commute"},
          {question: "Or dealing with annoying __________ politics", answer: "office"},
          { question: "grab your residential proxy and start _________", answer: "today" },
          {question: "I kept second ________ myself", answer: "guessing"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milkyway Part two simulator'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/Of8fGHm9z2t3",
        points: 10,
        questions: [
          {question: "I'll share a key _________ for evaluators ", answer: "takeaway"},
          {question: "relevance for each result is found by _________ the relationship", answer: "assessing"},
          { question: "is there a ________ relationship between the query and the result", answer: "logical" },
          {question: "___________ to the guidelines", answer: "stick"},
          {question: "If it doesn't __________ with the guidelines", answer: "align"}
        ]
      },
            {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Tryrating exam'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/rm4EWdkqRX0n",
        points: 10,
        questions: [
          {question: "These differences are _____________ issues, not accuracy issues", answer: "formatting"},
          {question: "Let’s start with the __________ standard: the Perfect Pin.", answer: "gold"},
          { question: " choose can’t _________ instead of guessing.", answer: "verify" },
          {question: "With attention to detail, persistence, and a little humor, even maps can lead you to _________", answer: "treasure"},
          {question: " whether an address is accurate, or whether a query is truly ___________", answer: "navigational"}
        ]
      }
      ]);

    console.log("✅ Tasks inserted successfully");

    // ✅ Now send mail to all users
  /*const users = await User.find({});
    console.log(`📨 Sending new task email to ${users.length} users`);

    for (const user of users) {
      await sendMail(
        user.email,
        "🚀 New Tasks Available on Daily Tasks",
        `<div style="font-family:sans-serif;">
          <h2>Hello ${user.firstName || ""},</h2>
          <p>New tasks have just been added to your dashboard. Login now to complete them and earn more!</p>
          <a href="https://dailytasks.co/sign-in.html"
             style="background:#000080;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
            Login to Complete Tasks
          </a>
        </div>`
      );
      console.log(`✅ Email sent to ${user.email}`);
    }

    console.log("🎉 All emails sent successfully!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    mongoose.disconnect();*/
  }); 
  