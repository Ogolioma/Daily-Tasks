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
          {question: "John earned enough to pay off his _______ bill and groceries", answer: "phone"},
          {question: "__________ doesn't have to be your forever story", answer: "debt"},
          { question: "_______ doesn't have to be a dream", answer: "stability" },
          {question: "The MilkyWay project can be the _________ to your new beginning", answer: "launchpad"},
          {question: "His _________ never seemed to shrink", answer: "loans"},
          {question: "Like anyone _________ for answers", answer: "desperate"},
          {question: "He got ________ by the rules", answer: "confused"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milky Way evaluation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/7kPmdPMGudHi",
        points: 6,
        questions: [
          {question: "My ________ can help you pass the test for just a little fee", answer: "specialist"},
          {question: "_________ change and so should you", answer: "guidelines"},
          { question: "You'll then see _______ buttons", answer: "four" },
          {question: "All it takes is a ________ application", answer: "brief"},
          {question: "Read the job _________ and click 'Apply Now'", answer: "description"},
          {question: "It'll ask you to complete ________ certifications", answer: "two"},
          {question: "It's your ________ to working anywhere at anytime", answer: "ticket"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Make Money with Top Surveys'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/1Bnv2RPRpwRu",
        points: 6,
        questions: [
          {question: "Jude didn't just make money, He made ________", answer: "progress"},
          {question: "Use a ___________ country", answer: "supported"},
          { question: "Take ______ minutes and answer every question honestly (write in words)", answer: "ten" },
          {question: "_________ quickly but logically", answer: "answer"},
          {question: "Avoid contradictions, they use ________ questions", answer: "trick"},
          {question: "Your ______ is processed instantly", answer: "payout"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'dailytasks.co surveys'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/2siykl5fsApo",
        points: 6,
        questions: [
          {question: "A way to _________ your hustle to a team that lives for results", answer: "outsource"},
          {question: "Daily Tasks has built a solid _________", answer: "process"},
          { question: "Use the team that was built to help you _______", answer: "win" },
          {question: "Let me take a little ________ here", answer: "detour"},
          {question: "And those are _____ questions", answer: "fair"},
          {question: "You don't _______ and disappear", answer: "pay"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'using dailytasks.co'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/gFq7kjTUzZad",
        points: 6,
        questions: [
          {question: "More views equals better _________ ad revenue", answer: "youtube"},
          {question: "Don't ________ links", answer: "spam"},
          { question: "Don't _________ after getting your engagement", answer: "ghost" },
          {question: "He built friendships and got ________ that made him better", answer: "feedback"},
          {question: "Your not going to become Mr __________ overnight", answer: "beast"},
          {question: "If you've ever felt like your ___________ was invisible", answer: "content"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'using dailytasks.co'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/sMxY77xrS3NW",
        points: 6,
        questions: [
          {question: "Answer __________ questions for the short videos", answer: "attention"},
          {question: "There is a ______ way to do this", answer: "smart"},
          { question: "The _________ has trust issues ", answer: "internet" },
          {question: "You're ________ online, why not get paid", answer: "already"},
          {question: "_________ may not grow on trees, but it may go on screens", answer: "money"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for '7 ways to make money'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/r_KVf5b-te_H",
        points: 6,
        questions: [
          {question: "It's simple you get paid for _________", answer: "engagement"},
          {question: "It's Bout learning how to create _______", answer: "value"},
          { question: "_________ opportunities are everywhere", answer: "offline" },
          {question: "People pay for __________", answer: "convenience"},
          {question: "Your _________ is in your combo, not perfection", answer: "edge"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'how to scale your income fast'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/wqkdwhUcG_Qn",
        points: 6,
        questions: [
          {question: "There is __________ in focus", answer: "power"},
          {question: "Your attention span is _________", answer: "currency"},
          { question: "_________ instead of doing", answer: "overthinking" },
          {question: "Ler's say you start with ________ design", answer: "freelance"},
          {question: "You sell those templates as a _________", answer: "product"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Money mastery video'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/Zc2T2xzyqdZY",
        points: 6,
        questions: [
          {question: "Pay _________ first", answer: "yourself"},
          {question: "Less temptation equlas more ________", answer: "consistency"},
          { question: "Money flows where ______ lives", answer: "peace" },
          {question: "five. Ignoring financial _________", answer: "literacy"},
          {question: "the ________ to take small steps consistently", answer: "courage"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milkyway Part two simulator'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/Of8fGHm9z2t3",
        points: 16,
        questions: [
          {question: "You might ask why _____ accuracy matter ", answer: "pin"},
          {question: "For ________ queries do not force navigational intent", answer: "ambiguous"},
          { question: "________ if the result is the right place", answer: "evaluate" },
          {question: "When to make incorrect. If the name is _________", answer: "fabricated"},
          {question: "Let's look at feautures without a _________", answer: "rooftop"}
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
  