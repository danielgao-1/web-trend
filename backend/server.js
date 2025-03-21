require("dotenv").config()

const express = require("express"); // express backend
const axios = require("axios"); // get request
const cors = require("cors"); // front-end fetch  
const mongoose = require("mongoose"); // for MongoDB 

const app = express(); // initializing ports
const PORT = 3000; // port = 3000, # does not matter

app.use(cors());
app.use(express.json());

// mongoose connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))

// mongodb schema
const SubredditSchema = new mongoose.Schema({
  name: String,
  description: String,
  subscribers: Number,
  url: String, }, 
  {timestamps: true
  });

const SubRedditDB = mongoose.model("Subreddit", SubredditSchema)

// route to fetch top 100 subreddits
app.get("/api/top-subreddits", async (req, res) => {
  try {
    const response = await axios.get("https://www.reddit.com/subreddits/popular.json?limit=100"); // 100 limit
    const subreddits = response.data.data.children.map((sub) => ({
      name: sub.data.display_name,
      description: sub.data.public_description || "No description", // not used
      subscribers: sub.data.subscribers || 0,
      url: `https://www.reddit.com/r/${sub.data.display_name}`,
    }));

    await SubRedditDB.insertMany(subreddits);

    res.json(subreddits); // send the organized data as json

  } catch (error) {
    console.error("Error fetching top subreddits:", error.message);
    res.status(500).json({ error: "Failed to fetch subreddits" });
  }
});

// start the express server
app.listen(PORT, () => console.log(`Server is open: http://localhost:${PORT}`));



