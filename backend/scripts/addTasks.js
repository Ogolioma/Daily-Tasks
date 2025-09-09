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
      /*{
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milky Way Part 1 Questions'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/VBlBjFPzesgh",
        points: 6,
        questions: [
          {question: "the _________ they're looking for, not something else", answer: "treasure"},
          {question: "He was ___________ attacking his student loan", answer: "confidently"},
          { question: "No sleepless nigts about __________", answer: "loans" },
          {question: "the ____ is a goldmine", answer: "internet"},
          {question: "You might feel ________ just like John did", answer: "stuck"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milky Way evaluation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/krM24pfsZlFD",
        points: 6,
        questions: [
          {question: "Be consistent, set a ________ target", answer: "weekly"},
          {question: "__________ change and so should you", answer: "guidelines"},
          { question: "or dealing with annoying _______ politics", answer: "office" },
          {question: " ________ the Milkyway project", answer: "find"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Milkyway Part two simulator'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/Of8fGHm9z2t3",
        points: 10,
        questions: [
          {question: "You're ______ you can think like a rater", answer: "proving"},
          {question: "Use the same _________ process for every question", answer: "thought"},
          { question: "the _________ is the user's voice", answer: "query" },
          {question: "your _____ might say one answer feels right", answer: "gut"},
          {question: "read the query, ______ the result", answer: "analyze"}
        ]
      },
            {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Tryrating exam'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/rm4EWdkqRX0n",
        points: 10,
        questions: [
          {question: "The ______ of the pin, not the round head, marks the actual spot", answer: "tip"},
          {question: "Next Door is a moderate _________", answer: "error"},
          { question: "When you confirm a query is ________, you’ll need to rate results accordingly", answer: "navigational" },
          {question: "He realized that Raters get paid for their ability to _____ small mistakes others ignore", answer: "spot"},
          {question: "He turned what seemed boring into an _______", answer: "adventure"}
        ]
      },
       {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Tryrating exam  Question & Answer'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/Ssvp91_CaHPD",
        points: 6,
        questions: [
          {question: "Name accuracy checks if the business name matches its official, real-world _____?", answer: "identity"},
          {question: "Only one result can fully satisfy _________ in these cases", answer: "intent"},
          { question: "Pin accuracy is judged separately from __________", answer: "relevance" },
          {question: "Once intent is determined, the next step is to check _________", answer: "relevance"},
          {question: "That’s exactly the kind of accuracy that map raters help ________", answer: "maintain"}
        ]
      },*/
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'MilkyWay Light Speed'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/D0ZHC04AAJ0z",
        points: 6,
        questions: [
          {question: "There were news results where he had to check if the _______ made sense", answer: "date"},
          {question: "He began thinking like a search engine evaluator, not just a casual _________", answer: "googler"},
          { question: "The Lightspeed project isn’t just about passing an exam. It’s about developing a ________", answer: "mindset" },
          {question: " Big ___________ are nothing more than small wins stacked on top of each other", answer: "transformations"},
          {question: "It’s designed to test whether you can be ________", answer: "consistent"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Karl Syft Detection'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/TBh8IsHsAKAl",
        points: 6,
        questions: [
          {question: "Over time, your ________ will naturally increase", answer: "spped"},
          {question: "Always ________ in when needed.", answer: "zoom"},
          { question: "Don’t _________ things that aren’t required. Follow exactly what the guidelines say.", answer: "label" },
          {question: "A tagging _________ for choosing categories.", answer: "panel"},
          {question: "Reviewing existing annotations for accuracy and __________", answer: "consistency"}
        ]
      },
      {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'Karl Annotation'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/SiB3BI6ngrPR",
        points: 7,
        questions: [
          {question: "________ is all about consistency. It’s not about your personal opinions", answer: "annotation"},
          {question: " check the ________ levels, think about the categories, and make the safest choice", answer: "severity"},
          { question: "There are usually _____ main levels to keep in mind", answer: "three" },
          {question: "These are ________ and should not be flagged.", answer: "safe"},
          {question: "This is _________, but it’s not as extreme as bomb-making", answer: "dangerous"}
        ]
      },
         {
        title: "Watch Video",
        instructions: "Go to 'youtube.com', search for 'UHRS Assessment'. Type it in the searchbox, do not copy and paste.<br/><br/> Find the video with the thumbnail that appears when you click 'Go to task'.<br/<> Watch the video till the end and answer the questions. <br/><br/>Please, give one-word answers and in all small cases/letters",
        actionLink: "https://prnt.sc/8MovxrHJTkOa",
        points: 10,
        questions: [
          {question: "you’re part of a _________ invisible workforce training the next generation of technology", answer: "global"},
          {question: "Sometimes you log in and tasks are _______", answer: "gone"},
          { question: "OneForma ___________ and sends payment to your chosen method", answer: "consolidates" },
          {question: "Once you’re comfortable, work _______ but without cutting corners", answer: "quickly"},
          {question: "_________ whether this ad is misleading.", answer: "judge"}
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
  