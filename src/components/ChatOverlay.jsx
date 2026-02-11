import React, { useEffect, useMemo, useRef, useState } from "react";

const SERVERS = [
  {
    id: "direct",
    title: "Direct Messages",
    status: "3 online",
    logo: "DM",
    channels: [
      { id: "sam", label: "Sam", unread: true },
      { id: "riley", label: "Riley" },
      { id: "jordan", label: "Jordan", unread: true },
    ],
    members: [
      { id: "sam", name: "Sam", status: "online" },
      { id: "riley", name: "Riley", status: "online" },
      { id: "jordan", name: "Jordan", status: "online" },
    ],
    messages: [
      { author: "Sam", text: "Can we sync on chapter swaps tonight?" },
      { author: "Jordan", text: "I can do a quick pass on chapter 4 after lunch." },
      { author: "You", text: "Perfect — sending notes in 10." },
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

const THREAD_PREVIEWS = [
  "Draft links, edits, and approvals",
  "Planning updates and next steps",
  "Voice notes and chapter comments",
  "Assets, docs, and quick handoffs",
];

const TIMESTAMPS = ["2m", "15m", "42m", "1h", "3h"];

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


export default function ChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState(SERVERS[0].id);
  const [activeChannelId, setActiveChannelId] = useState(SERVERS[0].channels[0].id);
  const [messageDraft, setMessageDraft] = useState("");
  const [spacesWidth, setSpacesWidth] = useState(210);
  const [conversationsWidth, setConversationsWidth] = useState(320);
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

  const onlineCount = useMemo(
    () => activeServer.members.filter((member) => member.status === "online").length,
    [activeServer]
  );

  const unreadCount = useMemo(
    () => activeServer.channels.filter((channel) => channel.unread).length,
    [activeServer]
  );

  const isDirectMessages = activeServer.id === "direct";

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

  const startResize = (target) => (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const initialSpaces = spacesWidth;
    const initialConversations = conversationsWidth;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;

      if (target === "spaces") {
        setSpacesWidth(Math.min(320, Math.max(150, initialSpaces + delta)));
      }

      if (target === "conversations") {
        setConversationsWidth(Math.min(460, Math.max(240, initialConversations + delta)));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
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
          <div
            className="chat-shell chat-shell--studio"
            role="dialog"
            aria-modal="true"
            aria-label="PensUp chat"
            style={{
              "--chat-spaces-width": `${spacesWidth}px`,
              "--chat-conversations-width": `${conversationsWidth}px`,
            }}
          >
            <header className="chat-shell-header chat-shell-header--studio">
              <div>
                <p className="chat-shell-title">Studio Comms</p>
                <p className="chat-shell-subtitle">Focused team chat for your studio</p>
              </div>
              <div className="chat-shell-header-actions">
                <button className="chat-shell-pill" type="button">
                  Focus mode
                </button>
                <button className="chat-shell-pill chat-shell-pill--ghost" type="button">
                  Schedule
                </button>
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
                  <p>Studios</p>
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
                        ⌁
                      </span>
                    </button>
                  ))}
                </div>
                <div className="chat-spaces-footer">
                  <button type="button">＋ New studio</button>
                  <button type="button">Invite</button>
                </div>
              </aside>

              <button
                className="chat-resize-handle"
                type="button"
                aria-label="Resize studios panel"
                onMouseDown={startResize("spaces")}
              />

              <section className="chat-conversations">
                <div className="chat-conversations-header">
                  <div className="chat-conversations-heading">
                    <p>{activeServer.title}</p>
                    <span>{activeServer.status}</span>
                  </div>
                  <div className="chat-conversations-search">
                    <input type="text" placeholder={isDirectMessages ? "Search friends" : "Search threads"} readOnly />
                  </div>
                </div>

                <div className="chat-conversations-list" role="list" aria-label="Thread list">
                  {activeServer.channels.map((channel, index) => (
                    <button
                      key={channel.id}
                      className={`chat-conversation-item${channel.id === activeChannel.id ? " active" : ""}`}
                      type="button"
                      role="listitem"
                      onClick={() => setActiveChannelId(channel.id)}
                    >
                      <div>
                        <p>{isDirectMessages ? channel.label : `#${channel.label}`}</p>
                        <span>{isDirectMessages ? "Direct conversation" : THREAD_PREVIEWS[index % THREAD_PREVIEWS.length]}</span>
                      </div>
                      <div className="chat-conversation-meta">
                        <span>{TIMESTAMPS[index % TIMESTAMPS.length]}</span>
                        {channel.unread ? <span className="chat-conversation-unread">New</span> : null}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="chat-conversations-footer">
                  <div>
                    <p>Luke Harper</p>
                    <span>Creative lead</span>
                  </div>
                  <button type="button">Update status</button>
                </div>
              </section>

              <button
                className="chat-resize-handle"
                type="button"
                aria-label="Resize threads panel"
                onMouseDown={startResize("conversations")}
              />

              <section className="chat-detail">
                <div className="chat-detail-header">
                  <div>
                    <p>{isDirectMessages ? activeChannel.label : `#${activeChannel.label}`}</p>
                    <span>{activeServer.title}</span>
                  </div>
                  <div className="chat-detail-header-chips">
                    <span>{onlineCount} online</span>
                    <span>{unreadCount} unread</span>
                  </div>
                </div>

                <div className="chat-detail-highlight">
                  <p>Today’s sprint objective</p>
                  <strong>Finalize scene polish + handoff notes before 7:00 PM.</strong>
                </div>

                <div className="chat-detail-feed" ref={feedRef}>
                  {(messagesByServer[activeServer.id] || []).map((message, index) => {
                    const isCurrentUser = message.author === "You";
                    return (
                      <article
                        className={`chat-detail-message${isCurrentUser ? " is-current-user" : ""}`}
                        key={`${message.author}-${index}`}
                      >
                        <span className={`chat-detail-avatar${isCurrentUser ? " is-current-user" : ""}`}>
                          {getInitials(message.author)}
                        </span>
                        <div>
                          <div className="chat-detail-message-meta">
                            <strong>{message.author}</strong>
                            <span>{TIMESTAMPS[index % TIMESTAMPS.length]} ago</span>
                          </div>
                          <p>{message.text}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <form className="chat-detail-input" onSubmit={handleSubmit}>
                  <span className="chat-input-prefix">✦</span>
                  <input
                    type="text"
                    placeholder={isDirectMessages ? `Message ${activeChannel.label}` : `Message #${activeChannel.label}`}
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                  />
                  <button className="chat-detail-send" type="submit">
                    Send
                  </button>
                </form>
              </section>

            </div>

            <button
              className="chat-shell-edge-handle"
              type="button"
              aria-label="Resize chat container"
              onMouseDown={startResize("shell")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
