const express = require("express"); // express backend
const axios = require("axios"); // get request
const cors = require("cors"); // front-end fetch  
const cron = require("node-cron"); //automate task
const mongoose = require("mongoose"); // for MongoDB 
require("dotenv").config();

 //initalize
const app = express();
const PORT = 3000; // port = 3000, # does not matter
app.use(cors());
app.use(express.json());

// mongoose connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"));

// mongodb schema
const SubredditSchema = new mongoose.Schema({
  // 1st request
  name: String,
  description: String,
  subscribers: Number,
  url: String, 
  utc_date: Number,
  // 2nd request
  posts_1hours: Number,
  posts_2hours: Number,
  posts_12hours: Number,
  posts_24hours: Number,

  comments_1hours: Number,
  comments_2hours: Number,
  comments_12hours: Number,
  comments_24hours: Number,

  total_comments: Number,
  total_upvote_ratio: Number,
  total_score: Number,
});

const SubredditDB = mongoose.model("Subreddit", SubredditSchema);
// api get 1
app.get("/api/subreddit_top", async (req, res) => {
  try {
    const response1 = await axios.get(`https://www.reddit.com/subreddits/popular.json?limit=50`); // 100 limit
    const subreddits1 = response1.data.data.children.map((sub) => ({
      name: sub.data.display_name,
      description: sub.data.public_description || "No description", // not used for frontend
      subscribers: sub.data.subscribers || 0,
      url: `https://www.reddit.com/r/${sub.data.display_name}`,
    }));

    await sleep(2000); // 1 sec delay
    // run twice  
    const after = response1.data.data.after;
    const response2 = await axios.get(`https://www.reddit.com/subreddits/popular.json?limit=50&after=${after}`); // another 100 subreddits
    const subreddits2 = response2.data.data.children.map((sub) => ({
      name: sub.data.display_name,
      description: sub.data.public_description || "No description", // not used for frontend
      subscribers: sub.data.subscribers || 0,
      url: `https://www.reddit.com/r/${sub.data.display_name}`,
    }));

    const subreddits = [...subreddits1,...subreddits2] //combine the two subreddits
    // checks for duplicates
    await SubredditDB.bulkWrite( //bulkwrite to overwrite rather than duplicate
      subreddits.map(subreddit => ({
          updateOne :
          {
            filter: {name: subreddit.name },
            update: { $set: subreddit },
            upsert: true, 
          }
      })));

    res.json(subreddits); // send the organized data as json

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch subreddits" });
  }
})

const DEF_DELAY = 1000;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}
// api get 2
app.get("/api/subreddit_stats", async (req, res) => {
  try {
    const storedSubreddits = await SubredditDB.find()
    .sort({subscribers: -1})
    .skip(0)
    .limit(100); // Get 25 stored subreddits. Increase limit if needed
    const subredditNames = storedSubreddits.map(sub => sub.name); // 

    for (const subreddit of subredditNames) {
      await sleep(2500); // delay

      try {
        console.log(`Fetching posts for r/${subreddit}...`); // log to show subreddit

        const postsResponse1 = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=100`);
        const posts = postsResponse1.data.data.children.map(post => ({
          created_utc: post.data.created_utc,
          num_comments: post.data.num_comments,
          score: post.data.score || 0,
          upvote_ratio: post.data.upvote_ratio || null,
        }));

        /*
        // grabs the next too response based on thhe # of subreddits 
        const after = postsResponse1.data.data.after;
        const postsResponse2 = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=100&after=${after}`);
        const posts2 = postsResponse2.data.data.children.map(post => ({
          created_utc: post.data.created_utc,
          num_comments: post.data.num_comments,
          score: post.data.score || 0,
          upvote_ratio: post.data.upvote_ratio || null,
        }));
        */

        const now = Math.floor(Date.now() / 1000);
        let count_post = 0;
        let posts_1hours = 0;
        let posts_2hours = 0;
        let posts_12hours = 0;
        let posts_24hours = 0;
        let comments_1hours = 0;
        let comments_2hours = 0;
        let comments_12hours = 0;
        let comments_24hours = 0;
        let total_upvote_ratio = 0;
        let total_comments = 0;
        let total_score = 0;
        
        posts.forEach(post => {
          const postTime = post.created_utc;
          const ageInSeconds = now - postTime;
        
          if (ageInSeconds <= 3600) {
            posts_1hours++;
            comments_1hours += post.num_comments;
          }
          if (ageInSeconds <= 7200) {
            posts_2hours++;
            comments_2hours += post.num_comments;
          }
          if (ageInSeconds <= 43200) {
            posts_12hours++;
            comments_12hours += post.num_comments;
          }
          if (ageInSeconds <= 86400) {
            posts_24hours++;
            comments_24hours += post.num_comments;
          }
        
          count_post++;
          total_comments += post.num_comments;
          total_score += post.score;
          total_upvote_ratio += post.upvote_ratio;
        });
        
        total_upvote_ratio /= count_post;

        await SubredditDB.updateOne(
          { name: subreddit },
          {
            $set: {
              posts_1hours: posts_1hours,
              posts_2hours: posts_2hours,
              posts_12hours: posts_12hours,
              posts_24hours: posts_24hours,

              comments_1hours: comments_1hours,
              comments_2hours: comments_2hours,
              comments_12hours: comments_12hours,
              comments_24hours: comments_24hours,

              total_comments: total_comments,
              total_score: total_score,
              total_upvote_ratio: total_upvote_ratio
            }
          }
        );

      } catch (error) {
        console.error(error.message);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}
);


app.get("/api/tofrontend", async (req, res) => {
  try{
    const subreddits = await SubredditDB.find().limit(100);
    res.json(subreddits);
  }
  catch (error) {
    console.error(error.message)
  }
});

// run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Automation Running")
  try {
    await axios.get("http://localhost:3000/api/subreddit_top");
    await sleep(1000)
    await axios.get("http://localhost:3000/api/subreddit_stats");
   
  } catch (error) {
    console.error("Automation not running",error.message);
  }
});

// start the express server
app.listen(PORT, () => console.log(`Server is open: http://localhost:${PORT}`));



