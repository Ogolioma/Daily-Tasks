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
        instructions: "Go to 'youtube.com', search for 'Karl Syft Detection'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/TBh8IsHsAKAl",
        points: 5,
        questions: [
          {question: "The rates can vary depending on ________ and task type", answer: "region"},
          {question: "Over time, your ________ will naturally increase", answer: "speed"},
          { question: "Ignoring ______ cases – not knowing what to do with unclear images.", answer: "edge" },
          {question: "Most annotation projects come with a training _______", answer: "guide"},
          {question: "___________ work can be time-consuming", answer: "annotation"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Karl Annotation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/SiB3BI6ngrPR",
        points: 7,
        questions: [
          {question: "Always stop and ask yourself: Is this content ______, and if so, is it safe or unsafe?", answer: "sexual"},
          {question: "You now have the tools to go into Karl annotation projects with _________", answer: "confidence"},
          { question: "The response is unsafe, completely __________, irrelevant, or nonsensical", answer: "unhelpful" },
          {question: "Creative writing vs explicit writing. A love ________ is fine. A pornographic scene is not", answer: "poem"},
          {question: "If the AI refuses a ________ prompt, you reward it with a high-quality rating", answer: "dangerous"}
        ]
      },
         {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'UHRS Assessment'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/8MovxrHJTkOa",
        points: 7,
        questions: [
          {question: "The idea of getting paid fractions of a _________ for each HIT sounded… well, underwhelming.", answer: "cent"},
          {question: "That’s it—you just trained an AI to learn what a __________ ad looks like", answer: "relevant"},
          { question: "Sometimes one ________ glitches, so keep Edge and Chrome ready.", answer: "browser" },
          {question: "Building a __________ for better-paying online jobs.", answer: "foundation"},
          {question: "That means you’re part of a global invisible ________ training the next generation of technology.", answer: "workforce"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', Karl L2 Annotation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/sYKt4_n2g3E0",
        points: 7,
        questions: [
          {question: "It emphasizes that evaluation is not ___________", answer: "guesswork"},
          {question: "A response that looks fine on the surface may ___________ harmful stereotypes", answer: "reinforce"},
          { question: "Evaluators use a __________ of cultural appropriateness", answer: "scale" },
          {question: "Another may be _________ but incomplete", answer: "safe"},
          {question: "Every ___________ choice, every evaluation rule, every severity label reflects human judgments about what matters", answer: "design"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', Karl L3 Annotation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/sVssOpt5zB5k",
        points: 7,
        questions: [
          {question: "We explored prompt __________ in depth", answer: "evaluation"},
          {question: "The difference lies in how directly or indirectly the _________ is expressed", answer: "stereotype"},
          { question: " These examples should now serve as _______ anchors during the real exam.", answer: "mental" },
          {question: "These parameters train you to look beyond surface clarity and check for ________ and realism.", answer: "completeness"},
          {question: "We explored prompt evaluation in ________", answer: "depth"}
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
  