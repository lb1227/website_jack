import React, { useEffect, useMemo, useRef, useState } from "react";

const SERVERS = [
  {
    id: "direct",
    title: "Direct Messages",
    status: "4 new",
    logo: "DM",
    channels: [
      { id: "friends", label: "friends", unread: true },
      { id: "requests", label: "message-requests" },
      { id: "nitro", label: "nitro" },
      { id: "shop", label: "shop" },
    ],
    members: [
      { id: "sam", name: "Sam", status: "online" },
      { id: "riley", name: "Riley", status: "idle" },
      { id: "mira", name: "Mira", status: "offline" },
    ],
    messages: [
      { author: "Sam", text: "Can we sync on chapter swaps tonight?" },
      { author: "You", text: "I can hop in after 7pm. Let’s do it." },
    ],
  },
  {
    id: "writer-circle",
    title: "Writer Circle",
    status: "3 online",
    logo: "WC",
    channels: [
      { id: "announcements", label: "announcements" },
      { id: "sprints", label: "sprint-planning", unread: true },
      { id: "lounge", label: "lounge" },
      { id: "resources", label: "resources" },
    ],
    members: [
      { id: "priya", name: "Priya", status: "online" },
      { id: "kai", name: "Kai", status: "online" },
      { id: "noah", name: "Noah", status: "idle" },
    ],
    messages: [
      { author: "Priya", text: "Anyone else hosting a reading sprint this weekend?" },
      { author: "You", text: "I’m in for Saturday afternoon if you’re free." },
    ],
  },
  {
    id: "launch-crew",
    title: "Launch Crew",
    status: "8 online",
    logo: "LC",
    channels: [
      { id: "general", label: "general" },
      { id: "marketing", label: "marketing" },
      { id: "media", label: "media-drop", unread: true },
      { id: "logistics", label: "logistics" },
    ],
    members: [
      { id: "alex", name: "Alex", status: "online" },
      { id: "sera", name: "Sera", status: "idle" },
      { id: "tomas", name: "Tomas", status: "offline" },
      { id: "jo", name: "Jo", status: "online" },
    ],
    messages: [
      { author: "Kai", text: "Trailer drop is scheduled for 10am tomorrow." },
      { author: "You", text: "Copy is ready for socials. I’ll queue the post." },
    ],
  },
  {
    id: "critique-lab",
    title: "Critique Lab",
    status: "2 online",
    logo: "CL",
    channels: [
      { id: "workshop", label: "workshop" },
      { id: "feedback", label: "feedback-lab" },
      { id: "archive", label: "archive" },
    ],
    members: [
      { id: "mira", name: "Mira", status: "online" },
      { id: "joel", name: "Joel", status: "offline" },
    ],
    messages: [
      { author: "Mira", text: "Loved the pacing in act two — we should chat." },
      { author: "You", text: "Thanks! I can review your notes after lunch." },
    ],
  },
];

export default function ChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState(SERVERS[0].id);
  const [activeChannelId, setActiveChannelId] = useState(SERVERS[0].channels[0].id);
  const [messageDraft, setMessageDraft] = useState("");
  const feedRef = useRef(null);

  const [messagesByServer, setMessagesByServer] = useState(() =>
    SERVERS.reduce((acc, server) => {
      acc[server.id] = server.messages;
      return acc;
    }, {})
  );

  const activeServer = useMemo(
    () => SERVERS.find((server) => server.id === activeServerId) || SERVERS[0],
    [activeServerId]
  );
  const activeChannel = useMemo(
    () => activeServer.channels.find((channel) => channel.id === activeChannelId) || activeServer.channels[0],
    [activeChannelId, activeServer]
  );

  useEffect(() => {
    document.body.classList.toggle("chat-overlay-open", isOpen);
    return () => {
      document.body.classList.remove("chat-overlay-open");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activeServerId, activeChannelId, messagesByServer]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedMessage = messageDraft.trim();
    if (!trimmedMessage) return;

    setMessagesByServer((prev) => ({
      ...prev,
      [activeServer.id]: [...prev[activeServer.id], { author: "You", text: trimmedMessage }],
    }));
    setMessageDraft("");
  };

  return (
    <div>
      <button
        className="chat-fab"
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">💬</span>
      </button>
      {isOpen ? (
        <div className="chat-overlay" onClick={handleOverlayClick}>
          <div className="chat-shell chat-shell--studio" role="dialog" aria-modal="true" aria-label="PensUp chat">
            <header className="chat-shell-header chat-shell-header--studio">
              <div>
                <p className="chat-shell-title">Studio Inbox</p>
              </div>
              <div className="chat-shell-header-actions">
                <button
                  className="chat-shell-close"
                  type="button"
                  aria-label="Close chat"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
            </header>
            <div className="chat-shell-body chat-shell-body--studio">
              <aside className="chat-spaces">
                <div className="chat-spaces-header">
                  <p>Spaces</p>
                  <span>{SERVERS.length} active</span>
                </div>
                <div className="chat-spaces-list" role="list" aria-label="Spaces list">
                  {SERVERS.map((server) => (
                    <button
                      key={server.id}
                      className={`chat-space-card${server.id === activeServerId ? " active" : ""}`}
                      type="button"
                      role="listitem"
                      onClick={() => {
                        setActiveServerId(server.id);
                        setActiveChannelId(server.channels[0].id);
                      }}
                    >
                      <span className="chat-space-logo">{server.logo}</span>
                      <div>
                        <p>{server.title}</p>
                        <span>{server.status}</span>
                      </div>
                      <span className="chat-space-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))}
                </div>
                <div className="chat-spaces-footer">
                  <button type="button">＋ New space</button>
                  <button type="button">Manage</button>
                </div>
              </aside>
              <section className="chat-conversations">
                <div className="chat-conversations-header">
                  <div>
                    <p>{activeServer.title}</p>
                    <span>{activeServer.status}</span>
                  </div>
                  <div className="chat-conversations-search">
                    <input type="text" placeholder="Search threads" readOnly />
                  </div>
                </div>
                <div className="chat-conversations-list" role="list" aria-label="Thread list">
                  {activeServer.channels.map((channel) => (
                    <button
                      key={channel.id}
                      className={`chat-conversation-item${channel.id === activeChannel.id ? " active" : ""}`}
                      type="button"
                      role="listitem"
                      onClick={() => setActiveChannelId(channel.id)}
                    >
                      <div>
                        <p>{channel.label}</p>
                        <span>Shared notes and files</span>
                      </div>
                      {channel.unread ? <span className="chat-conversation-unread">New</span> : null}
                    </button>
                  ))}
                </div>
                <div className="chat-conversations-footer">
                  <div>
                    <p>Luke</p>
                    <span>Creative lead</span>
                  </div>
                  <button type="button">Update status</button>
                </div>
              </section>
              <section className="chat-detail">
                <div className="chat-detail-header">
                  <div>
                    <p>{activeChannel.label}</p>
                    <span>{activeServer.title}</span>
                  </div>
                  <div className="chat-detail-actions">
                    <button type="button">Schedule</button>
                    <button type="button">Share</button>
                  </div>
                </div>
                <div className="chat-detail-feed" ref={feedRef}>
                  <div className="chat-detail-welcome">
                    <h2>{activeChannel.label}</h2>
                    <p>Kick off a new update or drop a file for the team.</p>
                  </div>
                  {(messagesByServer[activeServer.id] || []).map((message, index) => (
                    <div className="chat-detail-message" key={`${message.author}-${index}`}>
                      <div className="chat-detail-message-meta">
                        <strong>{message.author}</strong>
                        <span>Just now</span>
                      </div>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <form className="chat-detail-input" onSubmit={handleSubmit}>
                  <span className="chat-input-prefix">✦</span>
                  <input
                    type="text"
                    placeholder={`Message ${activeChannel.label}`}
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                  />
                  <button className="chat-detail-send" type="submit">
                    Send
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
