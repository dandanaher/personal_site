export type ThoughtEntry = {
  id: string;
  title: string;
  date: string; // ISO format: YYYY-MM-DD
  excerpt: string;
  content: string;
  tags?: string[];
  readTime?: number; // minutes
};

// Add new blog posts below
export const thoughtEntries: ThoughtEntry[] = [
  {
    id: "welcome",
    title: "Welcome to My Thoughts",
    date: "2025-01-15",
    excerpt:
      "An introduction to this space where I share reflections on spaceflight, engineering, and technology.",
    content: `This is a space where I'll be sharing thoughts, reflections, and insights on topics that fascinate me - primarily spaceflight, aerospace engineering, and the technology that makes it all possible.

Since watching the first Falcon Heavy flight in 2018, I've been captivated by humanity's push beyond Earth. The engineering challenges, the audacious goals, and the relentless innovation in the space industry continue to inspire my studies and personal projects.

Here you'll find musings on recent launches, engineering deep dives, book reflections, and occasional tangents into web development and other interests. Consider this a digital notebook of sorts - raw, unfiltered thoughts as I navigate my journey through aerospace engineering and beyond.

Thanks for stopping by.`,
    tags: ["meta", "introduction"],
    readTime: 2,
  },
  {
    id: "why-spaceflight",
    title: "Why Spaceflight Matters",
    date: "2025-01-10",
    excerpt:
      "Reflections on humanity's drive to explore beyond Earth and why it's worth pursuing.",
    content: `There's something profoundly human about the desire to explore. We've crossed oceans, climbed mountains, and ventured into the deepest parts of our planet. Spaceflight is the natural continuation of that impulse - the next frontier.

But it's more than just exploration for exploration's sake. The challenges of operating in space push the boundaries of what's possible in engineering, materials science, computing, and countless other fields. The technologies developed for space often find applications back on Earth, from water purification systems to advanced materials.

More importantly, spaceflight offers perspective. Seeing Earth from space - that pale blue dot suspended in the vastness - reminds us of our shared home and shared destiny. It's a unifying force in an often divided world.

The work being done by companies like SpaceX, Blue Origin, and traditional aerospace giants isn't just about rockets and satellites. It's about securing humanity's long-term future, expanding our understanding of the universe, and pushing the limits of human achievement.

That's why I've dedicated my studies to aerospace engineering. That's why I spend countless hours following launches, reading mission reports, and contributing to spaceflight media projects. Because this matters. Because the future is up there, waiting for us to reach it.`,
    tags: ["spaceflight", "philosophy", "engineering"],
    readTime: 3,
  },
];
