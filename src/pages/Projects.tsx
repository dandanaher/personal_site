import { useEffect, useMemo, useState, useRef } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import type { ProjectEntry } from "../data/projects";
import { projectEntries } from "../data/projects";
import { cn } from "../lib/utils";

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(
    projectEntries[0] ?? null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProject?.title]);

  const imageCount = selectedProject?.previewImages.length ?? 0;

  const currentImage = useMemo(() => {
    if (!selectedProject || imageCount === 0) {
      return "";
    }
    return selectedProject.previewImages[
      Math.min(activeImageIndex, imageCount - 1)
    ];
  }, [activeImageIndex, imageCount, selectedProject]);

  const showNavigation = imageCount > 1;

  const handleNext = () => {
    if (!showNavigation) return;
    setActiveImageIndex((prev) => (prev + 1) % imageCount);
  };

  const handlePrevious = () => {
    if (!showNavigation) return;
    setActiveImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  // Swipe handlers for mobile with page scroll prevention
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientY;

    // Prevent page scroll when swiping horizontally on carousel
    const diff = Math.abs(touchStartX.current - touchEndX.current);
    if (diff > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!selectedProject || selectedProject.previewImages.length <= 1) return;

    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next image
        handleNext();
      } else {
        // Swiped right - previous image
        handlePrevious();
      }
    }
  };

  return (
    // V2: bg-background, text-primary
    <div className="flex h-full flex-1 overflow-hidden bg-background text-primary">
      {/* Desktop: Two-panel layout */}
      <div className="hidden md:flex h-full flex-1 overflow-hidden">
        {/* Left Panel - Project Navigation */}
        {/* Light grey for light mode, off-white for dark mode */}
        <div className="flex w-[45%] flex-col border-r border-gray-200 dark:border-white/10">
          {/* Header */}
          <div className="border-b border-gray-200 pl-24 pr-8 pt-8 pb-10 dark:border-white/10">
            {/* V2: text-primary */}
            <h1 className="mb-1 font-serif text-5xl tracking-tight text-primary">
              Projects
            </h1>
            {/* V2: text-secondary */}
            <p className="font-serif text-sm text-secondary">
              {projectEntries.length} {projectEntries.length === 1 ? 'piece' : 'pieces'} of work
            </p>
          </div>

          {/* Project Cards */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-0">
              {projectEntries.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  stack={project.stack}
                  meta={project.meta}
                  onSelect={() => setSelectedProject(project)}
                  isActive={project.title === selectedProject?.title}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Project Showcase */}
        <div className="flex flex-1 flex-col overflow-hidden">
        {selectedProject ? (
          <div className="flex h-full flex-col px-10 pt-8 pb-10">
            {/* Project Header with CTA */}
            <div className="mb-6 flex-none">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div className="flex-1">
                  {/* V2: text-primary */}
                  <h2 className="mb-3 font-serif text-5xl leading-[1.1] tracking-tight text-primary">
                    {selectedProject.title}
                  </h2>
                  {/* V2: text-secondary */}
                  <p className="max-w-2xl text-lg leading-relaxed text-secondary">
                    {selectedProject.longDescription}
                  </p>
                </div>
              </div>

              {/* Meta Bar with CTA */}
              {/* Light grey for light mode, off-white for dark mode */}
              <div className="flex items-center justify-between gap-6 border-y border-gray-200 py-4 dark:border-white/10">
                <div className="flex items-center gap-6">
                  <div>
                    {/* V2: text-secondary */}
                    <p className="mb-1 font-serif text-xs uppercase tracking-widest text-secondary">
                      Status
                    </p>
                    {/* V2: text-primary */}
                    <p className="text-sm font-medium text-primary">
                      {/* FIX: Changed selectedBook.meta to selectedProject.meta */}
                      {selectedProject.meta}
                    </p>
                  </div>
                  {selectedProject.stack.length > 0 && (
                    <div>
                      {/* V2: text-secondary */}
                      <p className="mb-1 font-serif text-xs uppercase tracking-widest text-secondary">
                        Stack
                      </p>
                      {/* V2: text-primary */}
                      <p className="text-sm font-medium text-primary">
                        {selectedProject.stack.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Glass pill with green tint
                    className="group inline-flex items-center gap-2 rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg px-5 py-2.5 text-sm font-medium text-primary transition-[border-color,background-color,box-shadow] duration-300 hover:border-[rgba(157,205,180,0.5)] hover:bg-[rgba(157,205,180,0.25)] hover:shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                  >
                    <span>View Live</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative flex-1">
              {/* V2: bg-secondary/20, dark:bg-surface */}
              <div className="group relative h-full overflow-hidden rounded-xl bg-secondary/20 shadow-2xl shadow-black/10 dark:bg-surface">
                {currentImage ? (
                  <div
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                  >
                    {selectedProject.previewImages.map((imageSrc, index) => (
                      <img
                        key={`${selectedProject.title}-image-${index}`}
                        src={imageSrc}
                        alt={`${selectedProject.title} preview ${index + 1}`}
                        className="h-full w-full flex-shrink-0 object-contain"
                      />
                    ))}
                  </div>
                ) : (
                  // V2: text-secondary
                  <div className="flex h-full w-full items-center justify-center font-serif text-sm text-secondary">
                    No preview available
                  </div>
                )}
                {showNavigation && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevious}
                      // Glass material matching back button
                      className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg opacity-0 transition-all duration-300 hover:scale-110 hover:border-[rgba(157,205,180,0.5)] hover:bg-[rgba(157,205,180,0.25)] hover:shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95 focus-visible:opacity-100 group-hover:opacity-100"
                      aria-label="View previous screenshot"
                    >
                      <img
                        src="/icons/back_arrow.png"
                        alt="Previous"
                        className="h-3/5 w-3/5 object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.2))]"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      // Glass material matching back button
                      className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg opacity-0 transition-all duration-300 hover:scale-110 hover:border-[rgba(157,205,180,0.5)] hover:bg-[rgba(157,205,180,0.25)] hover:shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95 focus-visible:opacity-100 group-hover:opacity-100"
                      aria-label="View next screenshot"
                    >
                      <img
                        src="/icons/back_arrow.png"
                        alt="Next"
                        className="h-3/5 w-3/5 object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.2))] scale-x-[-1]"
                      />
                    </button>
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5 rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg px-4 py-2">
                      {selectedProject.previewImages.map((_, index) => (
                        <button
                          key={`${selectedProject.title}-dot-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            index === activeImageIndex
                              ? "w-8 bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          // V2: text-secondary
          <div className="flex h-full items-center justify-center">
            <p className="font-serif text-sm text-secondary">
              Select a project to view
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Mobile: Single column layout with expandable cards */}
      <div className="md:hidden flex flex-col flex-1 overflow-y-auto relative">
        {/* V1 MobileNav removed, V2's page container provides scroll */}

        {/* Page Title - fixed with fade */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-background">
          <div className="flex items-center justify-center px-16 pt-6 pb-4 pointer-events-none">
            <h1 className="font-serif text-2xl tracking-tight text-primary">
              Projects
            </h1>
          </div>
          {/* Fade gradient below title */}
          <div className="h-12 w-full bg-gradient-to-b from-background to-transparent pointer-events-none" />
        </div>

        {/* Projects list with inline details */}
        <div className="flex-1 px-6 pb-6 pt-24">
          <div className="space-y-6">
            {projectEntries.map((project, index) => (
              <div key={project.title} className="flex flex-col gap-4">
                {/* Project Card */}
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  stack={project.stack}
                  meta={project.meta}
                  onSelect={() => setSelectedProject(selectedProject?.title === project.title ? null : project)}
                  isActive={project.title === selectedProject?.title}
                  index={index}
                />

                {/* Expanded Project Details (shown when active) */}
                {selectedProject?.title === project.title && (
                  // Light grey for light mode, off-white for dark mode
                  <div className="flex flex-col gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
                    {/* Long description */}
                    {/* V2: text-secondary */}
                    <p className="text-sm leading-relaxed text-secondary">
                      {project.longDescription}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div>
                        {/* V2: text-secondary */}
                        <p className="mb-1 font-serif uppercase tracking-widest text-secondary">
                          Status
                        </p>
                        {/* V2: text-primary */}
                        <p className="text-sm font-medium text-primary">
                          {project.meta}
                        </p>
                      </div>
                      {project.stack.length > 0 && (
                        <div>
                          {/* V2: text-secondary */}
                          <p className="mb-1 font-serif uppercase tracking-widest text-secondary">
                            Stack
                          </p>
                          {/* V2: text-primary */}
                          <p className="text-sm font-medium text-primary">
                            {project.stack.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Images */}
                    {project.previewImages.length > 0 && (
                      <div className="relative">
                        <div
                          // V2: bg-secondary/20, dark:bg-surface
                          className="rounded-xl overflow-hidden bg-secondary/20 dark:bg-surface"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {/* Sliding container with all images */}
                          <div
                            className="flex transition-transform duration-300 ease-out"
                            style={{
                              transform: `translateX(-${activeImageIndex * 100}%)`,
                              touchAction: 'pan-y pinch-zoom',
                            }}
                          >
                            {project.previewImages.map((imageSrc, index) => (
                              <img
                                key={index}
                                src={imageSrc}
                                alt={`${project.title} preview ${index + 1}`}
                                className="w-full h-auto object-contain flex-shrink-0"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Image navigation dots only (no arrows) */}
                        {project.previewImages.length > 1 && (
                          <div className="flex items-center justify-center mt-3">
                            <div className="flex items-center gap-2 rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg px-4 py-2">
                              {project.previewImages.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveImageIndex(index)}
                                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                    index === activeImageIndex
                                      ? "w-8 bg-white"
                                      : "bg-white/50 hover:bg-white/75"
                                  }`}
                                  aria-label={`View image ${index + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA button */}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        // Glass pill with green tint
                        className="group inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg px-5 py-3 text-sm font-medium text-primary transition-[border-color,background-color,box-shadow] duration-300 hover:border-[rgba(157,205,180,0.5)] hover:bg-[rgba(157,205,180,0.25)] hover:shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      >
                        <span>View Live</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// V2 requires a default export for pages
export default Projects;

