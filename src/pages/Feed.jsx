import React, { useMemo, useState } from "react";

const FEED_SECTIONS = {
  Trending: [
    {
      id: "trend-1",
      name: "Ari Vega",
      handle: "@ariwrites",
      time: "2h",
      content:
        "My serialized mystery hit 50k reads overnight. Dropping the cliffhanger chapter tonight. 🕵️‍♀️",
      stats: { replies: 84, reposts: 240, likes: "5.3k" },
    },
    {
      id: "trend-2",
      name: "Jun Park",
      handle: "@juniverse",
      time: "4h",
      content:
        "Plot twist reveal thread: how to seed a sci-fi mystery across six episodes without spoilers.",
      stats: { replies: 32, reposts: 118, likes: "2.1k" },
    },
    {
      id: "trend-3",
      name: "Samira Holt",
      handle: "@samiraholt",
      time: "6h",
      content:
        "Reader polls are in — 72% want the romance arc to stay slow burn. We listen. 🌙",
      stats: { replies: 19, reposts: 51, likes: 980 },
    },
  ],
  Newest: [
    {
      id: "new-1",
      name: "Leo Grant",
      handle: "@leog",
      time: "7m",
      content:
        "Just published Episode 1 of " +
        "“Halcyon Drift.” Drop by if you love dreamy cyberpunk + found family.",
      stats: { replies: 6, reposts: 12, likes: 64 },
    },
    {
      id: "new-2",
      name: "Mia Torres",
      handle: "@miastories",
      time: "18m",
      content:
        "Quick update: bonus scene went live for subscribers. Sneak peek in the comments!",
      stats: { replies: 14, reposts: 9, likes: 105 },
    },
    {
      id: "new-3",
      name: "Nico L",
      handle: "@nicoletters",
      time: "35m",
      content:
        "Writing sprint check-in: 2,000 words done, 1 matcha consumed, 0 regrets.",
      stats: { replies: 3, reposts: 4, likes: 42 },
    },
  ],
  Following: [
    {
      id: "follow-1",
      name: "Priya Desai",
      handle: "@priyainks",
      time: "1h",
      content:
        "Studio day: recording audio narration for Chapter 9. Any VO tips appreciated!",
      stats: { replies: 11, reposts: 17, likes: 221 },
    },
    {
      id: "follow-2",
      name: "Rowan Blake",
      handle: "@rowanblake",
      time: "3h",
      content:
        "Moodboard drop for the next saga: neon markets, rain-soaked alleys, secret ink guilds.",
      stats: { replies: 27, reposts: 66, likes: "1.4k" },
    },
    {
      id: "follow-3",
      name: "Hana Kim",
      handle: "@hanakim",
      time: "5h",
      content:
        "Live Q&A tomorrow! Ask anything about pacing serialized fantasy releases.",
      stats: { replies: 8, reposts: 13, likes: 198 },
    },
  ],
};

const TRENDING_TOPICS = [
  { label: "#InkboundCircuit", subtitle: "Epic sci-fi launches" },
  { label: "#SlowBurnSeason", subtitle: "Romance poll results" },
  { label: "#CreatorTips", subtitle: "Thread: cliffhangers" },
  { label: "#AudioSaga", subtitle: "Narration sessions" },
];

export default function Feed() {
  const tabs = Object.keys(FEED_SECTIONS);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const feedItems = useMemo(() => FEED_SECTIONS[activeTab], [activeTab]);

  return (
    <main className="feed-page">
      <div className="feed-layout">
        <section className="feed-main">
          <div className="feed-tabs" role="tablist" aria-label="Feed categories">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`feed-tab ${activeTab === tab ? "active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Trending" && (
            <div className="feed-panel feed-whats-happening">
              <h2>What’s happening</h2>
              <ul>
                {TRENDING_TOPICS.map((topic) => (
                  <li key={topic.label}>
                    <span>{topic.label}</span>
                    <small>{topic.subtitle}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="feed-stream">
            {feedItems.map((item) => (
              <article className="feed-card" key={item.id}>
                <div className="feed-avatar" aria-hidden="true">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="feed-content">
                  <div className="feed-meta">
                    <span className="feed-name">{item.name}</span>
                    <span className="feed-handle">{item.handle}</span>
                    <span className="feed-time">· {item.time}</span>
                  </div>
                  <p>{item.content}</p>
                  <div className="feed-actions" aria-label="Post actions">
                    <button type="button">💬 {item.stats.replies}</button>
                    <button type="button">🔁 {item.stats.reposts}</button>
                    <button type="button">❤️ {item.stats.likes}</button>
                    <button type="button">↗ Share</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
