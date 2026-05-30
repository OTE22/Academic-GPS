const SERPER_API_KEY = process.env.SERPER_API_KEY;

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface YouTubeResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  duration: string;
  url: string;
}

export async function searchWeb(query: string, numResults: number = 5): Promise<SearchResult[]> {
  if (!SERPER_API_KEY) {
    return getMockResults(query);
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": SERPER_API_KEY
      },
      body: JSON.stringify({
        q: query,
        num: numResults
      })
    });

    if (!response.ok) {
      return getMockResults(query);
    }

    const data = await response.json();
    return (data.organic || []).slice(0, numResults).map((item: { title?: string; link?: string; snippet?: string }) => ({
      title: item.title || "",
      url: item.link || "",
      snippet: item.snippet || ""
    }));
  } catch (error) {
    console.error("Search error:", error);
    return getMockResults(query);
  }
}

export async function searchYouTube(query: string, numResults: number = 3): Promise<YouTubeResult[]> {
  if (!SERPER_API_KEY) {
    return getMockYouTubeResults(query);
  }

  try {
    const response = await fetch("https://google.serper.dev/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": SERPER_API_KEY
      },
      body: JSON.stringify({
        q: query,
        num: numResults
      })
    });

    if (!response.ok) {
      return getMockYouTubeResults(query);
    }

    const data = await response.json();
    return (data.videos || []).slice(0, numResults).map((item: { title?: string; link?: string; snippet?: string; duration?: string; channel?: string }) => {
      const videoId = extractYouTubeId(item.link || "");
      return {
        title: item.title || "",
        videoId,
        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "",
        channel: item.channel || "Unknown",
        duration: item.duration || "",
        url: item.link || ""
      };
    });
  } catch (error) {
    console.error("YouTube search error:", error);
    return getMockYouTubeResults(query);
  }
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? match[1] : "";
}

function getMockResults(query: string): SearchResult[] {
  return [
    {
      title: `Learn more about ${query}`,
      url: "https://www.google.com/search?q=" + encodeURIComponent(query),
      snippet: "Search results for " + query
    }
  ];
}

function getMockYouTubeResults(query: string): YouTubeResult[] {
  return [
    {
      title: `${query} - Full Course Tutorial`,
      videoId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      channel: "Learn With Us",
      duration: "2:30:00",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];
}
