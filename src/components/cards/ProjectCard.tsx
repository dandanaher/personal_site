import { cn } from "../../lib/utils";

type ProjectCardProps = {
  title?: string;
  description?: string;
  stack?: string[];
  link?: string;
  meta?: string;
  className?: string;
  onSelect?: () => void;
  isActive?: boolean;
  index?: number;
};

const ProjectCard = ({
  title = "Example Project",
  description = "Project description goes here",
  stack = [],
  link,
  meta = "Recent work",
  className,
  onSelect,
  isActive,
  index = 0,
}: ProjectCardProps) => {
  const content = (
    <div className="relative">
      <div className="mb-2">
        <h3 className="font-serif text-xl leading-tight tracking-tight text-primary">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-secondary">
        {description}
      </p>
    </div>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          // Base styles
          "group relative mb-2 w-full overflow-hidden rounded-xl border p-6 text-left backdrop-blur-lg transition-all duration-300",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          // Conditional styles based on isActive
          isActive
            ? // Active: Green glass material
              "border-[rgba(157,205,180,0.5)] bg-[rgba(157,205,180,0.25)] shadow-[0_3px_10px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]"
            : // Inactive: Clear glass material (transparent with blur)
              "border-white/20 bg-transparent shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-[rgba(157,205,180,0.3)] hover:bg-[rgba(157,205,180,0.1)] hover:shadow-[0_2px_6px_rgba(157,205,180,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] dark:border-white/10 dark:hover:border-[rgba(157,205,180,0.3)]",
          className
        )}
      >
        {/* Active indicator dot - positioned absolutely over content */}
        {isActive && (
          <div className="absolute right-6 top-6 z-20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9dcdb4] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9dcdb4] shadow-lg shadow-[#9dcdb4]/50"></span>
            </span>
          </div>
        )}

        {/* Content */}
        <div className="relative">
          {content}
        </div>
      </button>
    );
  }

  return (
    <div className={cn(
      // Glass material for non-interactive cards
      "mb-2 rounded-xl border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] p-6 shadow-[0_2px_6px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg",
      className
    )}>
      {content}
    </div>
  );
};

export default ProjectCard;
