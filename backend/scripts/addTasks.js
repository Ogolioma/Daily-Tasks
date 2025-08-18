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
          {question: "Basically being a Human _________ for the internet", answer: "compass"},
          {question: "The internet is a _________ if you know where to dig", answer: "goldmine"},
          { question: "Financial freedom is about _______", answer: "discipline" },
          {question: "He felt like his __________ had a secret escape plan", answer: "money"},
          {question: "It was search engine _________", answer: "evaluation"},
          {question: "The _________ wasn't about rushing through task", answer: "secret"},
          {question: "After a ___________ John was debt-free", answer: "year"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milky Way evaluation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/7kPmdPMGudHi",
        points: 6,
        questions: [
          {question: "Also, remember to ______ your hours", answer: "track"},
          {question: "It was like being the _________ of the internet", answer: "referee"},
          { question: "No _______ delays, No excuses", answer: "shady" },
          {question: "All it takes is a ________ application", answer: "brief"},
          {question: "Step three, Click _________ more", answer: "view"},
          {question: "It's your _________ to working from anywhere at anytime", answer: "ticket"},
          {question: "________ your residential proxy and start today", answer: "grab"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Make Money with Top Surveys'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/1Bnv2RPRpwRu",
        points: 6,
        questions: [
          {question: "Jude used his new _________ wisely", answer: "income"},
          {question: "Your _________ has to stay consistent", answer: "profile"},
          { question: "Top Surveys will start sending you surveys ______", answer: "daily" },
          {question: "Be _______ but not rushed", answer: "fast"},
          {question: "Minimun payout is ________ dollar on the first withdraw", answer: "five"},
          {question: "If You're ______ you might as well get paid for it", answer: "scrolling"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'dailytasks.co surveys'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/2siykl5fsApo",
        points: 6,
        questions: [
          {question: "Tobi didn't finish his project because he was a tech _________", answer: "genius"},
          {question: "Letting experts _________ their lane", answer: "handle"},
          { question: "______ don't reward effort", answer: "people" },
          {question: "You'll be _________ what money well spent can do", answer: "shocked"},
          {question: "Daily Tasks has the community to make it ____________", answer: "happen"},
          {question: "Daily Tasks, that's _________ with power", answer: "strategy"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'using dailytasks.co'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/gFq7kjTUzZad",
        points: 6,
        questions: [
          {question: "Don't _________ your engagers", answer: "ghost"},
          {question: "Don't just build clout, turn it into ________", answer: "coin"},
          { question: "Thanks for ______ around this long", answer: "sticking" },
          {question: "Bring something to the ____________", answer: "table"},
          {question: "He didn't pray to the ____________ gods", answer: "algorithm"},
          {question: "Daily Tasks isn't a ___________ machine", answer: "miracle"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'using dailytasks.co'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/sMxY77xrS3NW",
        points: 6,
        questions: [
          {question: "Don't _________ your engagers", answer: "ghost"},
          {question: "Don't just build clout, turn it into ________", answer: "coin"},
          { question: "Thanks for ______ around this long", answer: "sticking" },
          {question: "Bring something to the ____________", answer: "table"},
          {question: "He didn't pray to the ____________ gods", answer: "algorithm"},
          {question: "Daily Tasks isn't a ___________ machine", answer: "miracle"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/t4NWv3tShcA?si=P1OM0p-pC57aeW4Y",
        points: 6,
        questions: [
          { question: "Start _________, improve as you go?", answer: "messy" },
          {question: "It puts ________ cash in your pocket and helps build momentum?", answer: "consistent"},
          {question: "_________ plus good voice equals voice overs?", answer: "phone"},
          {question: "No degree, no big capital, just ________", answer: "hustle"},
          {question: "________ what you know", answer: "teach"},
          { question: "We're all out here trying to ________, hustle, and win together?", answer: "grow" }
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/KLG6Jtw_uUo?si=794WcE9MnbgnwVwW",
        points: 6,
        questions: [
          { question: "Avoid the shiny object ________?", answer: "syndrome" },
          {question: "Nail it, _________ it, stack it?", answer: "systemize"},
          {question: "Let's say you start with _________ design", answer: "freelance"},
          {question: "____________ doesn't come from more chaos, it comes from clean stacking", answer: "scale"},
          {question: "It's not the ______ that is broken, it's the consistency", answer: "idea"},
          {question: "Do one thing today that gets you closer to your ________?", answer: "goal"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/aOUoHqA4A0o?si=0i0loYJ4ze6ji1kG",
        points: 6,
        questions: [
          { question: "That's the blueprint for __________ freedom", answer: "financial" },
          {question: "That could be ___________ your expenses ?", answer: "tracking"},
          {question: "It doesn't have to be _________ you just have to begin", answer: "perfect"},
          {question: "__________ in silence, let your success speak for you", answer: "flex"},
          {question: "You just need clarity, discipline, and the courage to take small steps ________", answer: "consistently"},
          {question: "Go out there and ________ it, grow it, and most importantly keep it", answer: "earn"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/EFjamX2-SkM?si=PHY_eyRHFTA4hNEU",
        points: 6,
        questions: [
          { question: "___________ is your best friend here", answer: "coffee" },
          {question: "Every ________ was an opportunity to get better", answer: "challenge"},
          {question: "Find the MilkyWAy ____________", answer: "project"},
          {question: "He's a __________ in writing MilkyWay certifications", answer: "specialist"},
          {question: "Grab your residential ____________, and start today", answer: "proxy"},
          {question: "You'll receive an ________ from the Oneforma recruitment team", answer: "invite"}
        ]
      },
      {
        title: "Facebook Share",
        instructions: "Share the video to Facebook Only",
        actionLink: "https://youtu.be/eGzf2kFTB10?si=obKdKirVYztGX_gR",
        points:3
      },
      {
        title: "Watch Video",
        instructions: "Watch the video to the end without skipping,like and leave a relevant comment.<br/><br/> Upload screenshot showing you watched the video to end, with your comment. <br/><br/>Answer the questions. Please, write your answer in small-cases (small letters) and give one-word answers",
        actionLink: "https://youtu.be/eGzf2kFTB10?si=obKdKirVYztGX_gR",
        points: 10,
        questions: [
          { question: "I'm tired of ________ noodles too", answer: "instant" },
          {question: "You might be ________ about bills", answer: "stressed"},
          {question: "____________ doesn't have to be your forever story", answer: "debt"},
          {question: "__________ doesn't have to be a dream", answer: "stability"},
          {question: "____________ realised something", answer: "john"},
          {question: "No ________ stress eating him alive", answer: "financial"}
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
  