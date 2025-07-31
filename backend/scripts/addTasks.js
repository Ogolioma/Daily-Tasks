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
        title: "Growing with Daily Tasks",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/5Hkz89EY96w?si=it_owWo2kCbemnmB",
        points: 9,
        questions: [
          { question: "Josh was tired of yelling into the social media _____ ?", answer: "void" },
          { question: "You're just some _____ viewer watching this in their pajamas?", answer: "faceless" },
          {question: "There are ______ tips that work", answer: "engagement"},
          {question: "Daily Tasks isn't a ____ and run zone", answer: "dump"},
          {question: "How many days did the narrator say you've got (Please, write in words)", answer: "thirty"},
          {question: "What do you clearly catre about?", answer: "growth"},
        ]
      },
      {
        title: "Earning on Daily Tasks",
        instructions:"Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/GbSFoYEF_4U?si=YW6v-bb_Yxs7hvKS",
        points: 9,
        questions: [
          { question: "What's the name of the character that was mentioned in the video?", answer: "victor" },
          {question: "The ______ of tasks is referral", answer: "king"},
          {question: "Turn ______ to joy", answer: "data"},
          {question: "How many minutes does it take to sign up (Please, write in words)", answer: "five"},
          {question: "Daily Tasks is literally ________ scrolling", answer: "paid"},
          { question: "You ________ to earn, you deserve freedom?", answer: "deserve" },
          {question: "_______ don't always show up in suits and ties?", answer: "opportunities"},
           { question: "You are not just maximizing time, you are ________ time into income?", answer: "flipping" },
          {question: "You don't need a _______ to make money?", answer: "job"},
          {question: "He doesn't work a  _______ job?", answer: "traditional"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/t4NWv3tShcA?si=xS2Zm0dd8aasDNSS",
        points: 8,
        questions: [
          { question: "It's about learning how to create _______?", answer: "value" },
          {question: "Withdraw earnings weekly to stay ________ ?", answer: "motivated"},
          {question: "Combine skills to make yourself _______ ?", answer: "valueable"},
          {question: "_________ plus social media equals content", answer: "canva"},
          {question: "If ________ can do it, so can You", answer: "sandra"},
          {question: "There's no ________ when there are these many options", answer: "excuse"},
          { question: "What's missing isn't _______, it's motion ?", answer: "money" },
          {question: "Don't _______ it. Start messy", answer: "overthink"},
           { question: "How much in dollars does Sandra earn per month? (write only in words)", answer: "eight hundred" },
          {question:"Where is the real money in?", answer: "discipline"},
          {question: "How many ways where listed in the video? (write only in words)", answer: "ten"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/KLG6Jtw_uUo?si=hVmDjNUvkIKkFS6w",
        points: 8,
        questions: [
          { question: "What does Elon Musk build?", answer: "systems" },
          {question: "No YouTube _______ holes", answer: "rabbit"},
          {question: "What should you do with your profits?", answer: "reinvest"},
          {question: "Switching too fast means you never give any ______ chance to work", answer: "strategy"},
          {question: "What's your second most valuable asset", answer: "energy"},
          {question: "How many most valuable assets do you have? (Please, write in words)", answer: "three"},
          { question: "Always look for ________ ?", answer: "leverage" },
          {question: "How much should you not blow on airpods (write only in words)", answer: "five hundred"},
           { question: "what should you not treat your income like", answer: "trophy" },
          {question:"perfectionism is procastination in a _______?", answer: "tuxedo"},
          {question: "Make __________ a habit, not an aferthought", answer: "reinvestment"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/aOUoHqA4A0o?si=GzugZvDu64TSjzZD",
        points: 8,
        questions: [
          {question: "_______ like a smart cookie", answer: "diversify"},
          {question: "Small savings _______ equals major peace of mind", answer: "cushion"},
          {question: "You are capable of changing your ________ future", answer: "financial"},
          {question: "Build a life where money is your tool, not a _______ ", answer: "trap"},
          {question: "How many things that you learnt today should you act on? (Please, write in words)", answer: "one"},
          {question: "Practice _________ daily", answer: "gratitude"},
           { question: "Managing money isn't just about ________ ?", answer: "math" },
          {question: "You just need clarity, _______, and the courage to take small steps consistently", answer: "discipline"},
           { question: "Stop treatin money like a _________?", answer: "mystery" },
          {question:"start treating money like a _________ ", answer: "mission"},
          {question: "that could be __________ your expenses", answer: "tracking"}
        ]
       },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/5Hkz89EY96w?si=mSzRVtvBqx8Q7-7S",
        points: 5,
        questions: [
          {question: "_______ your tasks to keep things fresh", answer: "rotate"},
          {question: "Don't ______ links", answer: "spam"},
          {question: "_______ had a day job, a clingy cat", answer: "josh"},
          {queston: "When you start replying, _______, and showing up", answer: "commenting"},
          {question: "Turn _____ into coin", answer: "clout"},
          {question: "A ________ that rewards effort", answer: "system"}
        ]
      },
      {
      title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/GbSFoYEF_4U?si=a9dQTG1b3xXp-B8Y",
        points: 5,
        questions:[
          {question: "His referral link was working __________?", answer: "actively"},
          {question: "The _________ has trust issues", answer : "trust"},
          {question: "What will you not become overnight?", answer: "millionaire"},
          {quetion: "What should you turn into cash?", answer: "time"},
          {question: "Why not get paid for being ________?", answer: "online"}
        ]
      },
        {
      title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/t4NWv3tShcA?si=HrlWJfJllmjHAAIA",
        points: 5,
        questions:[
          {question: "What do you earn when people buy through your special link?", answer: "commission"},
          {question: "__________ your scroll time", answer : "monetize"},
          {question: "Your _______ is in your combo?", answer: "edge"},
          {quetion: "How many ways were shared? (Please, write in words)", answer: "ten"},
          {question: "You don't need _______, you need action?", answer: "luck"}
        ]
      },
       {
      title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/KLG6Jtw_uUo?si=tr63hIi4TPzI-nTi",
        points: 5,
        questions:[
          {question: "Don't trade all your time for?", answer: "money"},
          {question: "Before you _______. Have I given this my full effort", answer : "pivot"},
          {question: "The gol is to build ________ ?", answer: "freedom"},
          {quetion: "Momentum ________, just like money", answer: "compounds"},
          {question: "It wasn't just a video, it's a ________ ?", answer: "blueprint"}
        ]
      },
        {
      title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/aOUoHqA4A0o?si=DK43b1h3AskVu4rE",
        points: 5,
        questions:[
          {question: "_________ in silence, let your success speak for you?", answer: "flex"},
          {question: "Who should you pay first?", answer : "yourself"},
          {question: "You've learned how to _________ it using tools?", answer: "multiply"},
          {quetion: "The wealthy _________ differently", answer: "behave"},
          {question: "Track your networth every ___________ ?", answer: "month"}
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
  