import React, { useEffect, useMemo, useRef, useState } from "react";

const SERVERS = [
  {
    id: "direct",
    title: "Direct Messages",
    status: "4 new",
    logo: "PU",
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
    messages: [
      { author: "Yara", text: "Just shared the concept art in the drive." },
      { author: "You", text: "It looks stunning! I’ll reply with notes soon." },
    ],
  },
];

export default function ChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState(SERVERS[0].id);
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
  }, [activeServerId, messagesByServer]);

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
                        onClick={() => setActiveServerId(server.id)}
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
              <section className="chat-thread">
                <div className="chat-thread-header">
                  <p className="chat-thread-title">{activeServer.title}</p>
                  <span className="chat-thread-status">{activeServer.status}</span>
                </div>
                <div className="chat-thread-feed" ref={feedRef}>
                  {(messagesByServer[activeServer.id] || []).map((message, index) => (
                    <div className="chat-thread-message" key={`${message.author}-${index}`}>
                      <strong>{message.author}</strong>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <form className="chat-thread-input" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Message the channel"
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                  />
                  <button className="btn primary" type="submit">
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
