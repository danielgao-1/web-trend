require("dotenv").config()
const express = require("express"); // express backend
const axios = require("axios"); // get request
const cors = require("cors"); // front-end fetch  
const mongoose = require("mongoose"); // for MongoDB 

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
  posts_4hours: Number,
  posts_24hours: Number,
  posts_48hours: Number,
  posts_7days: Number,
  total_comments: Number
});

const SubredditDB = mongoose.model("Subreddit", SubredditSchema);
// route to fetch top 100 subreddits
app.get("/api/subreddit_top", async (req, res) => {
  try {
    const response1 = await axios.get(`https://www.reddit.com/subreddits/popular.json?limit=100`); // 100 limit
    const subreddits1 = response1.data.data.children.map((sub) => ({
      name: sub.data.display_name,
      description: sub.data.public_description || "No description", // not used for frontend
      subscribers: sub.data.subscribers || 0,
      url: "https://www.reddit.com/r/${sub.data.display_name}",
    }));

    await sleep(1000); // 1 sec delay
    // run twice  
    const after = response1.data.data.after;
    const response2 = await axios.get(`https://www.reddit.com/subreddits/popular.json?limit=100&after=${after}`); // another 100 subreddits
    const subreddits2 = response2.data.data.children.map((sub) => ({
      name: sub.data.display_name,
      description: sub.data.public_description || "No description", // not used for frontend
      subscribers: sub.data.subscribers || 0,
      url: "https://www.reddit.com/r/${sub.data.display_name}",
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

app.get("/api/subreddit_stats", async (req, res) => {
  try {
    const storedSubreddits = await SubredditDB.find()
    .sort({subscribers: -1})
    .limit(50); // Get 5 stored subreddits. Increase limit if needed
    const subredditNames = storedSubreddits.map(sub => sub.name); // 

    for (const subreddit of subredditNames) {
      await sleep(100); // delay

      try {
        console.log(`Fetching posts for r/${subreddit}...`); // log to show subreddit

        const postsResponse = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=100`);
        const posts = postsResponse.data.data.children.map(post => ({
          created_utc: post.data.created_utc,
          num_comments: post.data.num_comments,
        }));

        const now = Math.floor(Date.now() / 1000);

        let count4hours = 0;
        let count24hours = 0;
        let count48hours = 0;
        let count7days = 0;
        let count_comments = 0;

        posts.forEach(post => {
          const postTime = post.created_utc;

          if (now - postTime <= 14400) count4hours++;
          if (now - postTime <= 86400) count24hours++;
          if (now - postTime <= 172800) count48hours++;
          if (now - postTime <= 604800) count7days++;

          count_comments += post.num_comments;
        });

        await SubredditDB.updateOne(
          { name: subreddit },
          {
            $set: {
              posts_4hours: count4hours,
              posts_24hours: count24hours,
              posts_48hours: count48hours,
              posts_7days: count7days,
              total_comments: count_comments
            }
          }
        );
        res.jsonx
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

// start the express server
app.listen(PORT, () => console.log(`Server is open: http://localhost:${PORT}`));



