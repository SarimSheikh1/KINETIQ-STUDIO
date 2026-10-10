export const projects = [
  [
    "MONOFORM",
    "Branding",
    "Form follows feeling.",
    "A radical identity for a fictional fashion house. We built a modular visual language around the beauty of contrast.",
    "#C7B8FF",
    "monoform",
  ],
  [
    "SOLA",
    "Digital",
    "A brighter kind of energy.",
    "A fictional clean energy platform that turns complex choices into a clear, welcoming digital experience.",
    "#E8FF65",
    "sola",
  ],
  [
    "HORIZON",
    "Digital",
    "New perspectives, built in.",
    "An architectural discovery platform exploring the relationship between space, light and human connection.",
    "#A8CDD1",
    "horizon",
  ],
  [
    "FLORA",
    "Branding",
    "Wild by nature.",
    "A botanical identity with expressive typography, organic packaging and a thoughtful digital shop.",
    "#FF654F",
    "flora",
  ],
  [
    "NEXUS",
    "Experience",
    "Beyond the interface.",
    "An interactive technology exhibition where generative forms respond to the people exploring them.",
    "#B4BAFE",
    "nexus",
  ],
  [
    "NOIR",
    "Motion",
    "A study in after-hours.",
    "A fictional editorial campaign combining restrained art direction and cinematic motion.",
    "#B5B0A6",
    "noir",
  ],
].map(([title, category, summary, description, color, slug], i) => ({
  title,
  category,
  summary,
  description,
  color,
  slug,
  media: [`/images/${slug}.svg`],
  featured: i < 3,
  displayOrder: i,
  published: true,
}));
export const articles = [
  [
    "Designing for a world that won’t sit still",
    "Design",
    "Why the most enduring identities are built to evolve.",
    "An identity is a starting point, not a finish line. When we design systems, we leave room for the unexpected.\n\nStart with a strong idea. Then define the smallest set of rules that makes it recognisable. A colour, a rhythm, a particular way of moving: these can connect a thousand different expressions.\n\nTest your system where it will live. A tiny icon and a room-sized installation should feel like relatives, without becoming identical. The goal is coherence with room to breathe.",
  ],
  [
    "Motion is a language, not a layer",
    "Motion",
    "What happens when movement becomes part of the brief.",
    "Movement tells us where to look, what just happened, and what comes next. It deserves a place in the earliest design conversations.\n\nChoose a motion vocabulary before choosing effects. A calm product might move with short, soft transitions. An energetic campaign might use sharp cuts and overshoots. Consistency gives movement meaning.\n\nRespect the people using your work. Reduced motion is a design brief of its own. The experience must remain understandable when every animation is switched off.",
  ],
  [
    "Small teams. Expansive possibilities.",
    "Culture",
    "Making space for curiosity in the creative process.",
    "The best ideas rarely arrive fully formed. We make space for unfinished thoughts, honest questions and early prototypes.\n\nA small team can shorten the distance between an idea and an experiment. Bring strategy, design and development together early, and the work becomes more interesting.\n\nFeedback is a craft. Describe what you notice, explain why it matters, and offer a direction rather than prescribing every detail.",
  ],
  [
    "The case for playful interfaces",
    "Design",
    "A little surprise can make an interaction memorable.",
    "Playfulness works best when it helps a person understand something. A responsive sculpture can invite exploration. A joyful success state can celebrate a finished task.\n\nBuild the useful path first. Then introduce moments of delight around it. Never let decoration obscure a label or slow a critical action.",
  ],
  [
    "Building with a lighter footprint",
    "Technology",
    "Performance is part of the creative idea.",
    "Performance begins in the design file. Fewer competing elements can make a page feel more intentional and load faster.\n\nUse procedural visuals where they add value, lazy load heavier scenes, and serve the smallest asset that communicates the idea. Measure your choices on ordinary devices.",
  ],
  [
    "From a sketch to a shared world",
    "Process",
    "Why we prototype before we polish.",
    "A prototype makes an idea discussable. It gives everyone something concrete to react to.\n\nKeep the first version small. Explore one interaction or one composition. Learn what works, throw away what does not, and build confidence through the next experiment.",
  ],
].map(([title, category, excerpt, content], i) => ({
  title,
  category,
  excerpt,
  content,
  slug: `note-${i + 1}`,
  coverImage: projects[i].media[0],
  status: "published",
  publishedAt: "2026-09-01",
}));
export const team = [
  "Mira Vale|Creative Director|Shapes ambitious ideas into expressive identities.",
  "Arlo Reed|Design Lead|Connects editorial thinking with thoughtful interfaces.",
  "Zoya Finch|Creative Developer|Brings motion and interaction into the design process.",
  "Leo Park|Strategy Director|Finds the human truth at the heart of every brief.",
].map((s, i) => {
  const [name, role, biography] = s.split("|");
  return {
    name,
    role,
    biography,
    image: `/images/portrait-${i}.svg`,
    displayOrder: i,
  };
});
export const positions = [
  "Creative Developer|Engineering",
  "Brand Designer|Design",
  "Motion Designer|Motion",
].map((s, i) => {
  const [title, department] = s.split("|");
  return {
    title,
    department,
    type: "Remote / Full-time",
    slug: `role-${i + 1}`,
    description: `Sample position: help our fictional studio create thoughtful work across brands and digital experiences. You will collaborate from early concepts through delivery, share prototypes, and contribute your own perspective. We value a strong portfolio, clear communication and curiosity.`,
    status: "open",
    sample: true,
  };
});
