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
        instructions: "Watch the video to the end without skipping,<br/><br/> subscribe to the channel, turn on notification and share.<br/><br/> Upload screenshot showing you watched the video to end, subscribed and turned on notification. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/wQ1WoCug1Ms ",
        points: 8,
        questions: [
          { question: "You shouldn't hand over ________ to sign up?", answer: "money" }
        ]
      },
      {
        title: "Watch Video",
        instructions:"Watch the video to the end without skipping,<br/><br/> share and like the video,then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/Oz-eLGeQo7w",
        points: 7,
        questions: [
          { question: "You should use a fresh, professional ________?", answer: "email" }
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping, <br/><br/>share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/57y35YcfUo4",
        points: 8,
        questions: [
          { question: "I stopped charging hourly and started creating _______?", answer: "packages" }
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/yHZJbeyrYHg",
        points: 8,
        questions: [
          { question: "Some schools pay student to make_______?", answer: "content" }
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,<br/><br/> share and like the video, then upload proof of completed task and answer the questions.<br/><br/> Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/XFcb9P0kTQw",
        points: 7,
        questions: [
          { question: "People wouldn't trust a blank_______?", answer: "portfolio" }
        ]
      },
      {
        title: "Facebook share",
        instructions: "Click on Go to task watch the video,and share. <br/><br/>Upload a screenshot of the shared video on your own page",
        actionLink: "https://www.facebook.com/share/r/1VTzypEZ6S/?mibextid=wwXIfr",
        points: 3,
        questions: [
          { question: "What is your facebook username?" }
        ]
      },
      {
        title: "Instagram share",
        instructions: "Click on Go to task watch the video, and share.<br/><br/> Upload a screenshot of the shared video on your own page",
        actionLink: "https://www.instagram.com/reel/DMDLSibqNF5/?igsh=MW9zMG5iOWZxamtheA==",
        points: 3,
        questions: [
          { question: "What is your instagram username?" }
        ]
      }
    ]);

    console.log("✅ Tasks inserted successfully");

    // ✅ Now send mail to all users
    const users = await User.find({});
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
    mongoose.disconnect();
  });


