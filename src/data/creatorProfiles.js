export const CREATOR_PROFILES = [
  {
    id: "ariela-ross",
    name: "Ariela Ross",
    tags: "Epic fantasy · Mythic retellings · Serial fiction",
    bio:
      "Ariela writes long-form fantasy that leans on lyrical prose, sweeping battles, and slow-burn alliances. She hosts weekly craft notes and annotated chapter drops.",
    avatar: "https://picsum.photos/seed/ariela-ross/200/200",
    background: "https://picsum.photos/seed/ariela-ross-bg/1600/900",
    counts: {
      works: 3,
      followers: 18240,
      subscribers: 5120,
      following: 21,
    },
    works: [
      {
        title: "Rhapsody of Ember",
        cover: "https://picsum.photos/seed/ember-works/160/160",
        status: "Ongoing",
        detail: "12 chapters · 9.6 rating",
      },
      {
        title: "The Glass Orchard",
        cover: "https://picsum.photos/seed/glass-orchard/160/160",
        status: "New release",
        detail: "4 chapters · 9.3 rating",
      },
      {
        title: "Mythic Rewrites",
        cover: "https://picsum.photos/seed/mythic-rewrites/160/160",
        status: "Season 2",
        detail: "14 chapters · 9.2 rating",
      },
    ],
  },
  {
    id: "marcos-lune",
    name: "Marcos Lune",
    tags: "Coastal drama · Character studies · Reader polls",
    bio:
      "Marcos builds layered coastal dramas with interactive reader polls and live afterword salons. He shares behind-the-scenes location audio with subscribers.",
    avatar: "https://picsum.photos/seed/marcos-lune/200/200",
    background: "https://picsum.photos/seed/marcos-lune-bg/1600/900",
    counts: {
      works: 2,
      followers: 14350,
      subscribers: 3890,
      following: 18,
    },
    works: [
      {
        title: "Harborlight",
        cover: "https://picsum.photos/seed/harborlight/160/160",
        status: "Ongoing",
        detail: "18 chapters · 9.4 rating",
      },
      {
        title: "Low Tide Legends",
        cover: "https://picsum.photos/seed/low-tide-legends/160/160",
        status: "Complete",
        detail: "10 chapters · 9.1 rating",
      },
    ],
  },
  {
    id: "sanaa-bell",
    name: "Sanaa Bell",
    tags: "Sci-fi noir · Interactive dossiers · Tech mystery",
    bio:
      "Sanaa blends neon noir with investigative storytelling, layering interactive dossiers and reader-submitted clues into each arc.",
    avatar: "https://picsum.photos/seed/sanaa-bell/200/200",
    background: "https://picsum.photos/seed/sanaa-bell-bg/1600/900",
    counts: {
      works: 4,
      followers: 20110,
      subscribers: 6100,
      following: 33,
    },
    works: [
      {
        title: "Neon Caravan",
        cover: "https://picsum.photos/seed/neon-caravan/160/160",
        status: "Season 1",
        detail: "10 chapters · 9.3 rating",
      },
      {
        title: "Inkbound Circuit",
        cover: "https://picsum.photos/seed/inkbound-circuit/160/160",
        status: "Prelaunch",
        detail: "Trailer · 2 previews",
      },
      {
        title: "Starlit Syntax",
        cover: "https://picsum.photos/seed/starlit-syntax/160/160",
        status: "Complete",
        detail: "12 chapters · 9.0 rating",
      },
    ],
  },
  {
    id: "elyse-hart",
    name: "Elyse Hart",
    tags: "Mystery · Found documents · Reader sleuths",
    bio:
      "Elyse curates puzzle-forward mysteries with community sleuthing nights and hidden artifact drops for subscribers.",
    avatar: "https://picsum.photos/seed/elyse-hart/200/200",
    background: "https://picsum.photos/seed/elyse-hart-bg/1600/900",
    counts: {
      works: 2,
      followers: 12680,
      subscribers: 2740,
      following: 27,
    },
    works: [
      {
        title: "The Silent Archive",
        cover: "https://picsum.photos/seed/silent-archive/160/160",
        status: "Ongoing",
        detail: "8 chapters · 9.1 rating",
      },
      {
        title: "Frames of the Fallen",
        cover: "https://picsum.photos/seed/frames-fallen/160/160",
        status: "Complete",
        detail: "11 chapters · 8.9 rating",
      },
    ],
  },
];

export const creatorProfileById = (creatorId) =>
  CREATOR_PROFILES.find((profile) => profile.id === creatorId);
