import React, { useEffect, useMemo, useRef, useState } from "react";

const SERVERS = [
  {
    id: "direct",
    title: "Direct Messages",
    status: "4 new",
    logo: "PU",
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
  {
    id: "jun-park",
    title: "Jun Park",
    status: "Typing...",
    logo: "JP",
    channels: [
      { id: "profile", label: "profile" },
      { id: "media", label: "media" },
    ],
    members: [
      { id: "jun", name: "Jun Park", status: "online" },
      { id: "you", name: "You", status: "idle" },
    ],
    messages: [
      { author: "Jun", text: "Are you open to a crossover collab?" },
      { author: "You", text: "Absolutely — send me the outline when ready." },
    ],
  },
  {
    id: "yara-bell",
    title: "Yara Bell",
    status: "Online",
    logo: "YB",
    channels: [
      { id: "creative", label: "creative" },
      { id: "drafts", label: "drafts" },
    ],
    members: [
      { id: "yara", name: "Yara Bell", status: "online" },
      { id: "you", name: "You", status: "offline" },
    ],
    messages: [
      { author: "Yara", text: "Just shared the concept art in the drive." },
      { author: "You", text: "It looks stunning! I’ll reply with notes soon." },
    ],
  },
];

export default function ChatOverlay() {
  const CHAT_SPLITTER_WIDTH = 10;
  const CHAT_DETAIL_MIN_WIDTH = 360;
  const CHAT_SPACES_MIN_WIDTH = 220;
  const CHAT_CONVERSATIONS_MIN_WIDTH = 220;

  const [isOpen, setIsOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState(SERVERS[0].id);
  const [activeChannelId, setActiveChannelId] = useState(SERVERS[0].channels[0].id);
  const [messageDraft, setMessageDraft] = useState("");
  const [spacesWidth, setSpacesWidth] = useState(300);
  const [conversationsWidth, setConversationsWidth] = useState(320);
  const [dragInfo, setDragInfo] = useState(null);
  const [shellPosition, setShellPosition] = useState({ left: null, top: null });
  const [shellDragInfo, setShellDragInfo] = useState(null);
  const shellBodyRef = useRef(null);
  const shellRef = useRef(null);
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

  useEffect(() => {
    if (!dragInfo) return;

    const handlePointerMove = (event) => {
      const shellBodyWidth = shellBodyRef.current?.clientWidth;
      if (!shellBodyWidth) return;

      const deltaX = event.clientX - dragInfo.startX;
      if (dragInfo.type === "spaces") {
        const maxSpacesWidth =
          shellBodyWidth - conversationsWidth - CHAT_DETAIL_MIN_WIDTH - CHAT_SPLITTER_WIDTH * 2;
        const nextSpacesWidth = Math.max(
          CHAT_SPACES_MIN_WIDTH,
          Math.min(maxSpacesWidth, dragInfo.startSpacesWidth + deltaX)
        );
        setSpacesWidth(nextSpacesWidth);
      }

      if (dragInfo.type === "conversations") {
        const maxConversationsWidth =
          shellBodyWidth - spacesWidth - CHAT_DETAIL_MIN_WIDTH - CHAT_SPLITTER_WIDTH * 2;
        const nextConversationsWidth = Math.max(
          CHAT_CONVERSATIONS_MIN_WIDTH,
          Math.min(maxConversationsWidth, dragInfo.startConversationsWidth + deltaX)
        );
        setConversationsWidth(nextConversationsWidth);
      }
    };

    const handlePointerUp = () => {
      setDragInfo(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [conversationsWidth, dragInfo, spacesWidth]);

  useEffect(() => {
    if (!isOpen || shellPosition.left !== null || shellPosition.top !== null) return;

    const shellElement = shellRef.current;
    if (!shellElement) return;

    const shellWidth = shellElement.offsetWidth;
    const shellHeight = shellElement.offsetHeight;
    setShellPosition({
      left: Math.max((window.innerWidth - shellWidth) / 2, 0),
      top: Math.max((window.innerHeight - shellHeight) / 2, 0),
    });
  }, [isOpen, shellPosition.left, shellPosition.top]);

  useEffect(() => {
    if (!shellDragInfo) return;

    const handlePointerMove = (event) => {
      const shellElement = shellRef.current;
      if (!shellElement) return;

      const maxLeft = Math.max(window.innerWidth - shellElement.offsetWidth, 0);
      const maxTop = Math.max(window.innerHeight - shellElement.offsetHeight, 0);
      const nextLeft = Math.min(Math.max(shellDragInfo.startLeft + event.clientX - shellDragInfo.startX, 0), maxLeft);
      const nextTop = Math.min(Math.max(shellDragInfo.startTop + event.clientY - shellDragInfo.startY, 0), maxTop);

      setShellPosition({ left: nextLeft, top: nextTop });
    };

    const handlePointerUp = () => {
      setShellDragInfo(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [shellDragInfo]);

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
          <div
            className="chat-shell chat-shell--studio"
            role="dialog"
            aria-modal="true"
            aria-label="PensUp chat"
            ref={shellRef}
            style={{
              left: shellPosition.left !== null ? `${shellPosition.left}px` : undefined,
              top: shellPosition.top !== null ? `${shellPosition.top}px` : undefined,
            }}
          >
            <header
              className="chat-shell-header chat-shell-header--studio chat-shell-header--draggable"
              onPointerDown={(event) => {
                if (event.target.closest("button, input, textarea, a")) return;

                event.preventDefault();
                const shellRect = shellRef.current?.getBoundingClientRect();
                setShellDragInfo({
                  startX: event.clientX,
                  startY: event.clientY,
                  startLeft: shellRect?.left ?? shellPosition.left ?? 0,
                  startTop: shellRect?.top ?? shellPosition.top ?? 0,
                });
              }}
            >
              <div>
                <p className="chat-shell-title">Studio Inbox</p>
                <p className="chat-shell-subtitle">Drafts, collabs, and creative sprints in one place.</p>
              </div>
              <div className="chat-shell-header-actions">
                <button className="chat-shell-pill" type="button">
                  Focus: All
                </button>
                <button className="chat-shell-pill" type="button">
                  Activity: Live
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
            <div
              className={`chat-shell-body chat-shell-body--studio${dragInfo ? " is-resizing" : ""}`}
              ref={shellBodyRef}
              style={{
                "--chat-spaces-width": `${spacesWidth}px`,
                "--chat-conversations-width": `${conversationsWidth}px`,
                "--chat-detail-min-width": `${CHAT_DETAIL_MIN_WIDTH}px`,
              }}
            >
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
              <div
                className="chat-column-resizer"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize spaces panel"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setDragInfo({
                    type: "spaces",
                    startX: event.clientX,
                    startSpacesWidth: spacesWidth,
                  });
                }}
              />
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
              <div
                className="chat-column-resizer"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize categories panel"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setDragInfo({
                    type: "conversations",
                    startX: event.clientX,
                    startConversationsWidth: conversationsWidth,
                  });
                }}
              />
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
