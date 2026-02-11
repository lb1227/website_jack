import React, { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_STUDIOS = [
  {
    id: "main-studio",
    title: "Main Studio",
    status: "1 online",
    logo: "MS",
    channels: [{ id: "general", label: "general" }],
    members: [{ id: "you", name: "username", status: "online" }],
    messages: [
      { author: "System", text: "Welcome to your studio chat." },
      { author: "You", text: "Ready to build something new." },
    ],
  },
];

const CURRENT_USERNAME = "username";

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
  const [studios, setStudios] = useState(INITIAL_STUDIOS);
  const [activeServerId, setActiveServerId] = useState(INITIAL_STUDIOS[0].id);
  const [activeChannelId, setActiveChannelId] = useState(INITIAL_STUDIOS[0].channels[0].id);
  const [messageDraft, setMessageDraft] = useState("");
  const [showCreateStudioModal, setShowCreateStudioModal] = useState(false);
  const [newStudioName, setNewStudioName] = useState("");
  const [spacesWidth, setSpacesWidth] = useState(210);
  const [conversationsWidth, setConversationsWidth] = useState(320);
  const feedRef = useRef(null);

  const [messagesByServer, setMessagesByServer] = useState(() =>
    INITIAL_STUDIOS.reduce((acc, server) => {
      acc[server.id] = server.messages;
      return acc;
    }, {})
  );

  const activeServer = useMemo(
    () => studios.find((server) => server.id === activeServerId) || studios[0],
    [activeServerId, studios]
  );

  const activeChannel = useMemo(
    () => activeServer?.channels.find((channel) => channel.id === activeChannelId) || activeServer?.channels[0],
    [activeChannelId, activeServer]
  );

  const onlineCount = useMemo(
    () => activeServer?.members.filter((member) => member.status === "online").length || 0,
    [activeServer]
  );

  const unreadCount = useMemo(
    () => activeServer?.channels.filter((channel) => channel.unread).length || 0,
    [activeServer]
  );

  useEffect(() => {
    if (!activeServer && studios.length > 0) {
      setActiveServerId(studios[0].id);
      setActiveChannelId(studios[0].channels[0].id);
      return;
    }

    if (activeServer && !activeChannel) {
      setActiveChannelId(activeServer.channels[0].id);
    }
  }, [activeChannel, activeServer, studios]);

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
      [activeServer.id]: [...(prev[activeServer.id] || []), { author: "You", text: trimmedMessage }],
    }));
    setMessageDraft("");
  };

  const handleCreateStudio = (event) => {
    event.preventDefault();
    const trimmedName = newStudioName.trim();

    if (!trimmedName) {
      return;
    }

    const studioId = `studio-${Date.now()}`;
    const studioLabel = trimmedName
      .split(" ")
      .join("-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase() || "general";

    const newStudio = {
      id: studioId,
      title: trimmedName,
      status: "1 online",
      logo: getInitials(trimmedName),
      channels: [{ id: `${studioLabel}-general`, label: "general" }],
      members: [{ id: "you", name: CURRENT_USERNAME, status: "online" }],
      messages: [{ author: "System", text: `${trimmedName} created.` }],
    };

    setStudios((prev) => [...prev, newStudio]);
    setMessagesByServer((prev) => ({ ...prev, [studioId]: newStudio.messages }));
    setActiveServerId(studioId);
    setActiveChannelId(newStudio.channels[0].id);
    setNewStudioName("");
    setShowCreateStudioModal(false);
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
                  <span>{studios.length} active</span>
                </div>
                <div className="chat-spaces-list" role="list" aria-label="Spaces list">
                  {studios.map((server) => (
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
                  <button type="button" onClick={() => setShowCreateStudioModal(true)}>＋ New studio</button>
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
                    <input type="text" placeholder="Search threads" readOnly />
                  </div>
                </div>

                <div className="chat-conversations-list" role="list" aria-label="Thread list">
                  {activeServer?.channels.map((channel, index) => (
                    <button
                      key={channel.id}
                      className={`chat-conversation-item${channel.id === activeChannel.id ? " active" : ""}`}
                      type="button"
                      role="listitem"
                      onClick={() => setActiveChannelId(channel.id)}
                    >
                      <div>
                        <p>{`#${channel.label}`}</p>
                        <span>{THREAD_PREVIEWS[index % THREAD_PREVIEWS.length]}</span>
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
                    <p>{CURRENT_USERNAME}</p>
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
                    <p>{activeChannel ? `#${activeChannel.label}` : "#general"}</p>
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
                    placeholder={activeChannel ? `Message #${activeChannel.label}` : "Message #general"}
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
      {showCreateStudioModal ? (
        <div className="chat-create-studio-modal" role="dialog" aria-modal="true" aria-label="Create new studio">
          <form className="chat-create-studio-panel" onSubmit={handleCreateStudio}>
            <h3>Create new studio</h3>
            <p>Give your studio a name to get started.</p>
            <input
              type="text"
              value={newStudioName}
              onChange={(event) => setNewStudioName(event.target.value)}
              placeholder="Studio name"
              autoFocus
            />
            <div>
              <button type="button" onClick={() => setShowCreateStudioModal(false)}>
                Cancel
              </button>
              <button type="submit">Create studio</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
