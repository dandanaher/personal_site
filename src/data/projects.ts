// This file contains the project data, adapted from V1.
// Image paths have been updated to point to the /public/images/ directory.

export type ProjectEntry = {
  title: string;
  description: string;
  stack: string[];
  link: string;
  meta: string;
  longDescription: string;
  previewImages: string[];
};

// Add new project entries below
export const projectEntries: ProjectEntry[] = [
  {
    title: "Macrodata Refinement",
    description: "If you liked Severance, you'll enjoy this little MDR simulator I built for fun. Best enjoyed in fullscreen, on desktop.",
    stack: ["HTML", "CSS", "GitHub Pages"],
    link: "https://lumon-volunteering.github.io/macrodatarefinement/",
    meta: "Live Project",
    longDescription:
      "An interactive recreation of Lumon's Macrodata Refinement terminal, focused on mood, atmosphere, and minimalistic gameplay loops inspired by the show. Built as a web experiment to explore nostalgia-rich interfaces and motion design. All hand-crafted animations using SVGs (and a few hand-drawn images in Procreate). Saves locally to the browser so you can make progress like a real refiner!",
    previewImages: [
      "/images/projects images/mdr/MDR_Screenshot1.png",
      "/images/projects images/mdr/MDR_Screenshot2.png",
      "/images/projects images/mdr/MDR_Screenshot3.png",
      "/images/projects images/mdr/MDR_Screenshot4.png",
    ],
  },
];
