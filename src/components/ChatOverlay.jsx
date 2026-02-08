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
          <div className="chat-shell" role="dialog" aria-modal="true" aria-label="PensUp chat">
            <header className="chat-shell-header">
              <div>
                <p className="chat-shell-title">UpChat</p>
              </div>
              <button
                className="chat-shell-close"
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </header>
            <div className="chat-shell-body">
              <aside className="chat-sidebar">
                <div className="chat-server-list" role="list" aria-label="Server list">
                  {SERVERS.map((server, index) => (
                    <React.Fragment key={server.id}>
                      {index === 1 ? <span className="chat-server-divider" aria-hidden="true" /> : null}
                      <button
                        className={`chat-server-icon${server.id === activeServerId ? " active" : ""}`}
                        type="button"
                        role="listitem"
                        aria-label={server.title}
                        onClick={() => {
                          setActiveServerId(server.id);
                          setActiveChannelId(server.channels[0].id);
                        }}
                      >
                        <span className="chat-server-logo">{server.logo}</span>
                      </button>
                    </React.Fragment>
                  ))}
                  <button className="chat-server-icon chat-server-add" type="button" role="listitem">
                    <span className="chat-server-logo">＋</span>
                  </button>
                </div>
              </aside>
              <section className="chat-channel-panel">
                <div className="chat-channel-header">
                  <p>{activeServer.title}</p>
                  <span>{activeServer.status}</span>
                </div>
                <div className="chat-channel-search">
                  <input type="text" placeholder="Search" readOnly />
                </div>
                <div className="chat-channel-list" role="list" aria-label="Channel list">
                  {activeServer.channels.map((channel) => (
                    <button
                      key={channel.id}
                      className={`chat-channel-item${channel.id === activeChannel.id ? " active" : ""}`}
                      type="button"
                      role="listitem"
                      onClick={() => setActiveChannelId(channel.id)}
                    >
                      <span className="chat-channel-hash">#</span>
                      <span>{channel.label}</span>
                      {channel.unread ? <span className="chat-channel-unread" aria-label="Unread" /> : null}
                    </button>
                  ))}
                </div>
                <div className="chat-channel-footer">
                  <div>
                    <p>Luke</p>
                    <span>Noneyobeezwax</span>
                  </div>
                  <div className="chat-channel-footer-actions">
                    <button type="button" aria-label="Mute">
                      🔇
                    </button>
                    <button type="button" aria-label="Settings">
                      ⚙️
                    </button>
                  </div>
                </div>
              </section>
              <section className="chat-thread">
                <div className="chat-thread-header">
                  <div className="chat-thread-title-group">
                    <p className="chat-thread-title">
                      <span className="chat-thread-hash">#</span>
                      {activeChannel.label}
                    </p>
                    <span className="chat-thread-status">{activeServer.status}</span>
                  </div>
                  <div className="chat-thread-actions">
                    <button type="button" aria-label="Notifications">
                      🔔
                    </button>
                    <button type="button" aria-label="Pinned messages">
                      📌
                    </button>
                    <button type="button" aria-label="Members">
                      👥
                    </button>
                  </div>
                </div>
                <div className="chat-thread-feed" ref={feedRef}>
                  <div className="chat-thread-welcome">
                    <h2>Welcome to {activeServer.title}</h2>
                    <p>This is the beginning of the {activeChannel.label} channel.</p>
                  </div>
                  {(messagesByServer[activeServer.id] || []).map((message, index) => (
                    <div className="chat-thread-message" key={`${message.author}-${index}`}>
                      <strong>{message.author}</strong>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <form className="chat-thread-input" onSubmit={handleSubmit}>
                  <span className="chat-input-prefix">＋</span>
                  <input
                    type="text"
                    placeholder={`Message #${activeChannel.label}`}
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                  />
                  <div className="chat-input-actions" aria-hidden="true">
                    <span>😀</span>
                    <span>📎</span>
                    <span>🎁</span>
                  </div>
                </form>
              </section>
              <aside className="chat-members">
                <div className="chat-members-header">
                  <p>Members</p>
                  <span>{activeServer.members.length}</span>
                </div>
                <div className="chat-members-list">
                  {activeServer.members.map((member) => (
                    <div className="chat-member" key={member.id}>
                      <span className={`chat-member-avatar ${member.status}`} aria-hidden="true">
                        {member.name[0]}
                      </span>
                      <div>
                        <p>{member.name}</p>
                        <span>{member.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
