import { useState, useEffect } from "react";

// typescript alias - type of the data
type Subreddit = { 
  rank: number;
  name: string;
  subscribers: number;
  total_comments: number;
  posts_1hours: number;
  posts_2hours: number;
  posts_12hours: number;
  posts_24hours: number;
  comments_1hours: number;
  comments_2hours: number;
  comments_12hours: number;
  comments_24hours: number;
  time: number;
  url: string;
};
const useSubreddits = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await fetch("https://web-trend.onrender.com/api/tofrontend");
        if (response.ok) {
          const data = await response.json();
          setSubreddits(data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return subreddits;
};

export default useSubreddits;
