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
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/_z4VmkDwgxI?si=-WBuOgJl7L9jEU5j",
        points: 6,
        questions: [
          {question: "Join multiple _________ networks?", answer: "survey"},
          {question: "Where could you literally make money on?", answer: "toilet"},
          { question: "What's the name of the character the narrator mentioned?", answer: "jude" },
          {question: "How many months upfront did He pay for His rent? (please, write in words)", answer: "six"},
          {question: "__________ want people who buy stuff, and live interesting lives", answer: "companies"},
          {question: "Enable notifications so you never miss a survey __________ ?", answer: "invite"},
          {question: "How often will TopSurvey send you surveys?", answer: "daily"},
          {question: "Let's talk about the most __________ button on the platform?", answer: "beautiful"},
          {question: "If you're using a ________ keep it active until your payment is processed?", answer: "proxy"},
          { question: "________ multiple survey networks?", answer: "join" },
           { question: "Type the referral code that was displayed on the screen, use only small cases/letters?", answer: "oqc8rr" },
          { question: "Answer quickly but _________?", answer: "logically" },
          {question: "They trust you with higher paying surveys when you are __________?", answer: "consistent"}
        ]
      },
      {
        title: "Watch Video",
        instructions:"Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/zXqxb6TtRi8?si=Hbgul3egl3mgY4Ed",
        points: 6,
        questions: [
          {question: "Real success is about building __________", answer: "systems"},
          {question: "Daily Tasks is ________ with power?", answer: "strategy"},
          {question: "You get _______ of every single task?", answer: "proofs"},
          {question: "No pressure, No _________?", answer: "obligation"},
          {question: "you don't have to go __________ to be seen?", answer: "viral"},
          {question: "Don't ____________ engagement?", answer: "chase"},
           { question: "The team ________ it, launched it?", answer: "planned" },
          {question: "There's a _________ that's killing a lot of young people", answer: "mindset"},
          {question: "We ________ stress", answer: "romanticise"},
          {question: "We _______ being the one-man army", answer: "glammyize"},
          {question: "Let the experts handle their _______", answer: "lane"},
          { question: "Let the support team reach out and walk you through the _________?", answer: "process" },
          { question: "Use the ______ that was built to help you win?", answer: "team" }
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/5Hkz89EY96w?si=_3oHWpG-RG5LfVGZ",
        points: 6,
        questions: [
          { question: "That ____________ content where you rate fast-food chicken nuggets?", answer: "niche" },
          {question: "It's not about perfection, it's about _________?", answer: "progress"},
          {question: "Your ________ count didn't match your effort", answer: "view"},
           { question: "Whether you're dropping __________, make-up tutorials?", answer: "memes" },
          {question: "It's more like a digital _________", answer: "potluck"},
           { question: "You can become a _______ you by next week?", answer: "better" },
          {question: "When you start replying, __________, and showing up", answer: "connecting"},
          {question: "That small _______ that leads to big results?", answer: "push"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/GbSFoYEF_4U?si=dQLKc-hlEUGdNrY9",
        points: 6,
        questions: [
          {question: "Daily tasks is literally paid ________?", answer: "scrolling"},
          { question: "What do you turn your time into?", answer: "cash" },
          {question: "What will you make if you can tap your screen?", answer: "money"},
          {question: "What doesn't show up in suits and ties?", answer: "opportunities"},
          {question: "You deserve to earn, You deserve _______ ?", answer: "freedom"},
          {question: "The tasks are _________ so grab them first thing in the morning", answer: "limited"},
          { question: "Use ___________ and WhatsApp for referrals", answer: "telegram" },
          {question: "How many minutes does it take to sign up? (Please, write in words)", answer: "five"},
          {question: "With Daily Tasks you're learning a ___________?", answer: "skill"},
          {question: "Sign up for dailytasks.co and let your _________ pay you consistently?", answer: "phone"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/t4NWv3tShcA?si=_ThwlLPdyUDivOC_",
        points: 6,
        questions: [
          { question: "What don't you need to be?", answer: "expert" },
          {question: "What should you do to small skills?", answer: "combine"},
          {question: "What's the name of the character in the story?", answer: "sandra"},
          {question: "How many days should yo practice the ways to make money (write in words)", answer: "thirty"},
          {question: "You don't need luck, you need _________", answer: "action"},
          { question: "How should you start?", answer: "local" },
          {question: "What don't you have with this many options?", answer: "excuse"},
          {question: "Where is the real money?", answer: "discipline"},
          {question: "What should you do to items?", answer: "flip"},
          {question: "What do you need?", answer: "action"},
          {question: " _________ plus socila media equals content creator", answer: "canva"},
          { question: "Typing plus _________ equals CV and flyer service?", answer: "design" },
          {question: "How many options were shared? (write in words)", answer: "ten"},
          {question: "Don't wait for __________, build discipline?", answer: "motivation"},
          {question: "The third method is?", answer: "microtasks"},
          {question: "5. ________ what you know", answer: "teach"},
          {question: "Monetize your ________ time", answer: "screen"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/KLG6Jtw_uUo?si=7CpfUgc8_NIInkdL",
        points: 6,
        questions: [
          { question: "What shouldn't you trade totally for money?", answer: "time" },
          {question: "The goal is to build ___________?", answer: "freedom"},
          {question: "What should you do with what you know?", answer: "monetize"},
          {question: "____________ without action is a digital napkin", answer: "blueprint"},
          {question: "High _________ systems, smart stacking", answer: "leverage"},
          {question: "How should you stack?", answer: "smart"},
          {question: "motivation is ______?", answer: "cute"},
          {question: "What do you do with what you know?", answer: "monetize"},
          {question: "Money goes to the most __________?", answer: "intentional"},
          {question: "Treat your _________ like a seed", answer: "income"},
          {question: "This wasn't just a video, it's a _________?", answer: "blueprint"},
          {question: "Money doesn't go to the ________", answer: "smartest"},
          {question: "You don't have to be _________, you just have to start", answer: "perfect"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/aOUoHqA4A0o?si=hzbLa4vlYVQOCE-o",
        points: 6,
        questions: [
          { question: "What should speak for you?", answer: "success" },
          {question: "What influence you net worth?", answer: "network"},
          {question: "You don't have to stay ________?", answer: "stuck"},
          {question: "What can you create", answer: "options"},
          {question: "You can build a _________ where money is your tool", answer: "life"},
          {question: "How many things should you pick from this video?", answer: "one"},
          {question: "you don't have to feel ___________?", answer: "overwhelmed"},
          {queston: "It will happen over many __________?", answer: "nights"},
          {question: "Now, you take _________ ?", answer: "action"},
          {question: "What should you practice daily", answer: "gratitude"},
          {question: "Money flows where _________ lives?", answer: "peace"},
          {question: "What do you need to take small steps consistently?", answer: "courage"},
          {question: "You've learned how to grow your money through _____________, planning?", answer: "budgeting"},
          {queston: "Most importantly, you've learned how to ___________ it", answer: "multiply"},
          {question: "Drop a comment with your ________ money goal ?", answer: "biggest"}
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
  