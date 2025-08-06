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
        actionLink: "https://youtu.be/zXqxb6TtRi8?si=r4P-QrzZ-FFcmq_m",
        points: 6,
        questions: [
          { question: "What should you do after submission?", answer: "wait" },
          { question: "What do you use but don't build?", answer: "phone" },
          {question: "No pressure, No _________?", answer: "obligation"},
          {question: "you don't have to go __________ to be seen?", answer: "viral"},
          {question: "Don't ____________ engagement?", answer: "chase"}
        ]
      },
      {
        title: "Watch Video",
        instructions:"Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/5Hkz89EY96w?si=Y0LzNRe55Lx0QR8h",
        points: 6,
        questions: [
          { question: "Whether you're dropping __________, make-up tutorials?", answer: "memes" },
          {question: "What community of creators does Daily Tasks give you", answer: "supportive"},
          {question: "How quickly will you not be Mr. Beast?", answer: "overnight"},
          {question: "What didn't your view count match?", answer: "effort"},
          {question: "How many days do you have? (please, write in words)", answer: "thirty"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/GbSFoYEF_4U?si=PvTf5YZVi_9-72km",
        points: 6,
        questions: [
          { question: "What do you turn your time into?", answer: "cash" },
          {question: "How do you earn on Daily Tasks?", answer: "smart"},
          {question: "What will you make if you can tap your screen?", answer: "money"},
          {question: "What doesn't show up in suits and ties?", answer: "opportunities"},
          {question: "What type of labour did you do for other social media sites", answer: "free"},
          {question: "What do you not need to make money", answer: "job"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/t4NWv3tShcA?si=o80K4iV5OwbqKL9H",
        points: 6,
        questions: [
          { question: "How should you start?", answer: "local" },
          {question: "What don't you have with this many options?", answer: "excuse"},
          {question: "Where is the real money?", answer: "discipline"},
          {question: "What should you do to items?", answer: "flip"},
          {question: "What do you need?", answer: "action"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/KLG6Jtw_uUo?si=q6AEacc0Ah2p7Ni-",
        points: 6,
        questions: [
          {question: "How should you stack?", answer: "smart"},
          {question: "motivation is ______?", answer: "cute"},
          {question: "What do you do with what you know?", answer: "monetize"},
          {question: "Money goes to the most __________?", answer: "intentional"},
          {question: "what should you avoid?", answer: "traps"}
        ]
       },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/aOUoHqA4A0o?si=19XdxJmgWmv2dMf-",
        points: 5,
        questions: [
          {question: "How many things should you pick from this video?", answer: "one"},
          {question: "you don't have to feel ___________?", answer: "overwhelmed"},
          {question: "What shouldn't you treat money like?", answer: "mission"},
          {queston: "What should you treat money like?", answer: "mission"},
          {question: "What do you just have to do ?", answer: "begin"}
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
  