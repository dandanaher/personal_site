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
{
  id: "rustRevolution",
  title: "Why Rust is Changing Systems Programming",
  date: "2025-09-15",
  excerpt: "A deep dive into Rust's memory safety guarantees and why major companies are adopting it for critical infrastructure.",
  content: `Rust has been the most loved programming language for eight consecutive years in Stack Overflow's developer survey, and for good reason. Its ownership model provides memory safety without garbage collection, eliminating entire classes of bugs that plague C and C++ programs.

Major tech companies are taking notice. Microsoft has stated that 70% of their security vulnerabilities are memory safety issues, and they're now writing new Windows components in Rust. Google is using it in Android, and AWS builds critical infrastructure with it.

The borrow checker is intimidating at first, but it forces you to think about memory management at compile time rather than debugging segfaults at 3 AM. Once you understand the ownership model, it becomes second nature, and you'll wonder how you ever lived without it.

The ecosystem is maturing rapidly. Cargo makes dependency management a breeze, and the community has built incredible tools like Tokio for async runtime, Serde for serialization, and Axum for web development. The future of systems programming is looking very rusty, and I'm here for it.`,
  tags: ["programming", "rust", "systems", "tech"],
  readTime: 4,
},
{
  id: "quantumComputing",
  title: "Quantum Computing: Beyond the Hype",
  date: "2025-08-22",
  excerpt: "Separating quantum computing reality from fiction, and understanding when it will actually be useful.",
  content: `Quantum computing has been "just around the corner" for decades now. But recent breakthroughs suggest we might actually be approaching an inflection point where quantum computers can solve real problems better than classical ones.

The key is understanding what quantum computers are good at. They won't replace your laptop. They're specialized tools for specific problems: simulating quantum systems for drug discovery, optimizing complex logistics, and breaking certain types of encryption.

Google's Willow chip recently demonstrated quantum error correction, a crucial milestone. IBM is making quantum computers available via the cloud. But we're still in the ENIAC era of quantum computing - the machines are massive, error-prone, and require extreme cooling.

The real question isn't when quantum computers will arrive, but when they'll be useful enough to justify their enormous cost. For most applications, classical computers will remain king for the foreseeable future. But for those specific problems where quantum mechanics can be exploited, the potential is revolutionary.`,
  tags: ["quantum computing", "science", "tech", "the future"],
  readTime: 5,
},
{
  id: "coffeeScience",
  title: "The Perfect Cup: Coffee Science",
  date: "2025-07-30",
  excerpt: "How understanding extraction chemistry transformed my morning routine into a daily ritual.",
  content: `Coffee is just water passing through ground beans, right? Wrong. It's a complex extraction process involving hundreds of chemical compounds, temperature gradients, and precise timing.

I used to think expensive equipment was pretentious. Then I learned about extraction ratios and the coffee compass. Under-extracted coffee is sour and thin. Over-extracted is bitter and harsh. The sweet spot requires controlling grind size, water temperature, contact time, and coffee-to-water ratio.

My morning routine now involves: grinding beans fresh (oxidation is the enemy), heating water to exactly 200°F (boiling is too hot), and timing the bloom phase to let CO2 escape. It sounds obsessive, but the difference is remarkable.

The fascinating part is how variables interact. Finer grind increases extraction but can lead to bitterness. Higher temperature extracts faster but can scorch delicate flavors. It's a delicate dance of chemistry and physics, all to extract the perfect balance of acids, sugars, and oils from those magical beans.`,
  tags: ["coffee", "science", "lifestyle", "chemistry"],
  readTime: 3,
},
{
  id: "darkForests",
  title: "The Dark Forest Theory and Cosmic Silence",
  date: "2025-06-18",
  excerpt: "Why haven't we found aliens? Maybe because the universe is a dark forest, and we're all hiding.",
  content: `The Fermi Paradox asks: if the universe is so vast and old, where is everybody? The Dark Forest theory, popularized by Liu Cixin, offers a chilling answer: they're hiding, and so should we.

The theory goes like this: survival is the primary need of civilization. Resources are limited. If you detect another civilization, you face an impossible game theory problem. They might be friendly, but you can't know for sure. The stakes are civilization-ending. The safest move is to strike first, or stay hidden.

This could explain the Great Silence. Advanced civilizations have learned to minimize their electromagnetic signature. Earth has been broadcasting radio signals for only a century - a cosmic eyeblink. Perhaps we're loudly announcing our presence in a forest full of hunters.

METI (Messaging Extraterrestrial Intelligence) projects deliberately broadcast signals to the stars. Some scientists think this is incredibly reckless. Others argue that we've already made ourselves known, and staying silent now won't help. The debate raises profound questions about risk, first contact, and humanity's place in the cosmos.`,
  tags: ["philosophy", "space", "fermi paradox", "science fiction"],
  readTime: 4,
},
{
  id: "minimalismDesign",
  title: "Minimalism in Design: Less is More",
  date: "2025-05-10",
  excerpt: "How constraints breed creativity and why removing elements often improves the final product.",
  content: `Dieter Rams' tenth principle: Good design is as little design as possible. It sounds simple, but it's one of the hardest principles to follow. Our instinct is to add, not subtract.

Look at the iPhone's original design. No physical keyboard, minimal buttons, a single home button. Critics said it would fail. Apple removed features and created something revolutionary. The constraint forced them to rethink the entire interface.

In web design, every element competes for attention. More features, more buttons, more options - until the user is paralyzed by choice. The paradox of choice is real. Constraint clarifies. Remove the unnecessary, and what remains becomes powerful.

I've started applying this to my code. Every dependency is debt. Every feature is maintenance burden. Before adding anything, I ask: is this essential? Usually, it's not. The best solution is often the one that removes complexity rather than manages it.

Minimalism isn't about having less. It's about making room for what matters.`,
  tags: ["design", "minimalism", "philosophy", "creativity"],
  readTime: 3,
},
{
  id: "learningPublic",
  title: "Learning in Public: Why I Started This Blog",
  date: "2025-04-25",
  excerpt: "Documenting the learning process, mistakes and all, creates better understanding and helps others.",
  content: `I used to wait until I was an expert before sharing anything. The result? I never shared anything. Perfectionism is procrastination in disguise.

Learning in public flips the script. Document what you learn as you learn it. Share your mistakes. Show your thought process. It's uncomfortable at first, but the benefits are massive.

Writing forces clarity. You don't truly understand something until you can explain it. Many times I've started writing about a concept only to realize I didn't understand it as well as I thought. The act of articulation reveals the gaps.

It also creates luck. When you share your learning journey, people with similar interests find you. You get feedback, corrections, and new perspectives. The internet becomes less of a broadcast medium and more of a conversation.

This blog is my learning in public experiment. I'm not an expert in most of what I write about - I'm learning, questioning, and exploring. If that helps someone else on a similar journey, that's a beautiful side effect.`,
  tags: ["meta", "learning", "writing", "personal growth"],
  readTime: 3,
},
{
  id: "aiAlignment",
  title: "The AI Alignment Problem We're Not Talking About",
  date: "2025-03-14",
  excerpt: "Beyond existential risk, there's a more immediate alignment problem: AI systems optimizing for engagement over wellbeing.",
  content: `Most AI alignment discussion focuses on superintelligent AGI and existential risk. That's important, but there's a more immediate problem: today's AI systems are already misaligned with human flourishing.

Recommendation algorithms optimize for engagement, not wellbeing. They've discovered that outrage, anxiety, and tribalism keep people clicking. These systems are working exactly as designed - they're just optimized for the wrong objective function.

It's a specification problem. We asked for engagement, and we got it, along with all the negative externalities. The AI isn't malfunctioning; we specified the wrong goal. This is alignment failure at a smaller, but very real scale.

The hard part is that wellbeing is subjective and hard to measure. Engagement is concrete and trackable. We've optimized for what we can measure rather than what we should measure. Classic McNamara fallacy.

Solving this requires rethinking our objective functions. What does human flourishing look like in a world saturated with AI? How do we measure it? How do we encode it? These questions matter now, not in some hypothetical AGI future.`,
  tags: ["AI", "ethics", "tech", "philosophy", "the future"],
  readTime: 4,
},
{
  id: "japanTravel",
  title: "Three Weeks in Japan: A Developer's Perspective",
  date: "2025-02-08",
  excerpt: "What happens when a software engineer experiences the intersection of ancient tradition and cutting-edge technology.",
  content: `Japan broke my brain in the best way. Here's a country that seamlessly blends 1,000-year-old temples with robot restaurants and vending machines that sell everything from hot ramen to fresh eggs.

The trains run on time to the second. Not approximately - to the actual second. The average delay for the Shinkansen is measured in seconds per year. As someone who's debugged distributed systems, I have immense respect for that level of precision.

What struck me most was the attention to detail. Every interaction, every product, every service is thoughtfully designed. Convenience store packaging is an art form. The user experience of simply existing in Tokyo is remarkable - it just works, and works beautifully.

I visited TeamLab Borderless, a digital art museum that's part gallery, part algorithmic experience. The installations respond to visitors, creating unique experiences through computer vision and generative art. It's what happens when engineers and artists collaborate without compromise.

Japan taught me that technology and tradition aren't opposing forces. The most compelling future might not be the one that abandons the past, but the one that brings it along for the ride.`,
  tags: ["travel", "japan", "tech", "culture", "design"],
  readTime: 4,
},
{
  id: "climateOptimism",
  title: "Climate Optimism Without Denial",
  date: "2025-01-20",
  excerpt: "Why being optimistic about climate solutions doesn't mean ignoring the severity of the problem.",
  content: `Climate doomerism is understandable but counterproductive. Yes, the situation is serious. No, despair doesn't help. We need clear-eyed optimism: acknowledging the challenge while believing in our ability to solve it.

The data actually supports optimism. Solar and wind are now cheaper than fossil fuels in most places. Battery technology is improving exponentially. Electric vehicles are approaching price parity. The S-curve is bending upward.

We've solved massive coordination problems before. The hole in the ozone layer was real and scary. We banned CFCs globally, and it's healing. This isn't blind faith - it's pattern recognition from past success combined with current technological trajectories.

The key is massive, rapid action. Not individual lifestyle changes (though those help), but systemic transformation. Policy changes, infrastructure investment, and technology deployment at scale. This is an engineering problem, and engineers are good at solving problems when properly motivated and resourced.

Optimism is a moral imperative. The next generation deserves adults who believe in a livable future and are working to create it, not those who've given up.`,
  tags: ["climate", "environment", "optimism", "the future", "tech"],
  readTime: 3,
},
{
  id: "deepWork",
  title: "Reclaiming Deep Work in a Distracted World",
  date: "2024-12-15",
  excerpt: "How I restructured my environment and habits to protect extended periods of focused, undistracted work.",
  content: `The ability to focus deeply is becoming simultaneously more rare and more valuable. We've created an information environment optimized for distraction, then wonder why deep work feels impossible.

I realized I was spending most of my day in shallow work - emails, Slack messages, quick context switches. I felt busy but accomplished little of substance. The work that mattered required deep focus, and I wasn't protecting that time.

My deep work protocol: Phone in another room. Internet blocker active. 90-minute blocks with clear objectives. No meetings before noon. It sounds extreme, but the results are undeniable. I accomplish more in one deep work session than in a full day of distracted half-work.

The key insight: deep work is a skill that requires practice. Your ability to focus is like a muscle - it atrophies without use. If you spend all day switching contexts, you'll lose the ability to focus deeply even when you try.

Protecting deep work isn't about productivity optimization - it's about creating the conditions for doing meaningful work. The kind of work that actually matters, that you'll be proud of, that makes a difference. Everything else is just noise.`,
  tags: ["productivity", "focus", "personal growth", "lifestyle"],
  readTime: 3,
},
];
