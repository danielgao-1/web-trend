import { useState, useEffect } from "react";

type Subreddit = { 
  name: string;
  title: string;
  subscribers: number;
  url: string;
};

const useSubreddits = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await fetch("http://localhost:3000/api/top-subreddits");
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
