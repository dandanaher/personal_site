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
  excerpt: "Jared Isaacman has been nominated to lead NASA as administrator. My thoughts:",
  content: `The saga with Sean Duffy has come to a close. NASA will not- in fact- be incorporated into the Department for Transportation (whew). Instead, the Trump admin has finally ceded to the calls of the greater spaceflight community, and nominated Isaacman, for a second time (!), to lead the agency through what could be a transformative period in its history on par with the Apollo era.

Jared is unlike any NASA admin we've seen before. He's not a politician or a bureaucrat who wants to use NASA as a vessel to fund expensive, overpromised and underdelivered projects to appease congress. He dropped out of high school at 15, built a successful payments empire from the ground up, trained to become a pilot, is one of the only people to privately own (and fly) MiG-29s, and last year went farther than anybody since Apollo and got *out of his spacecraft* to complete the first private spacewalk in history, 870 miles from Earth's surface. The question isn't whether he's qualified- that is a debate far beyond settled, imo- but can he, as a representative of the coming commercial space revolution, successfully lead a 67 year old government agency along for the ride?

China and Project Athena:

I'm going to talk about Isaacman's plan for restoring NASA to its former glory, and beating China in the return to the Moon.

1) Reorganize and Empower

In his own words, end the "death by a thousand cuts". NASA has become too risk-averse. We accept death as a necessary byproduct of progress in seemingly every other industry bar spaceflight. Minimising death is important, but it's grown to such a degree that the risk-averse culture of modern day NASA is actually hindering engineers from being able to build truly transformative technology. Some risk IS worth taking. Especially in spaceflight, which is the culmination and epitome of thousands of years of human exploratory spirit. We conquered the entire Earth, and now we must go forth into the rest of the solar system, or die trying.

2) The High Ground of Space
	
WIP 
	`,
  tags: ["spaceflight", "tech", "the future"],
  readTime: 2,
},
];
