require("dotenv").config();
const express = require("express"); // express backend
const axios = require("axios"); // http request
const cors = require("cors"); // fetch data to front-end

const app = express(); // initializing ports
const PORT = 3000; // port = 3000, # does not matter

app.use(cors());
app.use(express.json());

// route to fetch top 100 subreddits
app.get("/api/top-subreddits", async (req, res) => {
  try {
    const response = await axios.get("https://www.reddit.com/subreddits/popular.json?limit=100"); // get the top 100 subreddits
    // processing the data into specifics
    const subreddits = response.data.data.children.map((sub) => ({
      name: sub.data.display_name,
      title: sub.data.title || "No title",
      description: sub.data.public_description || "No description",
      subscribers: sub.data.subscribers || 0,
      icon: sub.data.icon_img && sub.data.icon_img.trim() !== "" 
        ? sub.data.icon_img 
        : "https://www.redditinc.com/assets/images/site/reddit-logo.png",
      url: `https://www.reddit.com/r/${sub.data.display_name}`,
    }));

    res.json(subreddits); // send the organized data as json
  } catch (error) {
    console.error("Error fetching top subreddits:", error.message);
    res.status(500).json({ error: "Failed to fetch subreddits" });
  }
});

// start the express server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
