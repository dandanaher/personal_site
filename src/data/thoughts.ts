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
  id: "helloWorld",
  title: "Hello World",
  date: "2025-10-10",
  excerpt: "The first post on this site! Posted in development",
  content: `Hello! This is the first blog post on this site ever. It's also the first time I've written a blog post. What am I supposed to write? Who am I writing it for? Is it supposed to be interesting? To me or to you, the one reading this?

I suppose it doesn't matter. I just feel good that I finally have a "place" to share my thoughts. Not a page in a book that never leaves my bag, but a corner of the internet. My site, my own domain! It's a really cool feeling, even if I don't yet know what it will become.

I'll answer a few questions I think you may have, but mostly questions I have for myself:

Why so much green? It's the best color.

What's the point of this? Who knows! I like it.

What do you do? I'm a student at the moment, studying aerospace, but I also like web development, as you can see.

Where are you from? London! Born to English and Canadian parents.`,
  tags: ["meta", "introduction"],
  readTime: 2,
},
{
  id: "nasaAdmin",
  title: "On the next 15 years of spaceflight",
  date: "2025-11-06",
  excerpt: "Jared Isaacman as just been nominated to lead NASA as administrator. My thoughts:",
  content: ``,
  tags: ["spaceflight", "tech", "the future"],
  readTime: 2,
},
];
