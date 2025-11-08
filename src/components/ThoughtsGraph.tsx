import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ThoughtEntry } from "../data/thoughts";
import type { BaseType } from "d3";

type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  title: string;
  tags: string[];
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type GraphLink = {
  source: GraphNode | string;
  target: GraphNode | string;
  sharedTags: number;
};

interface ThoughtsGraphProps {
  thoughts: ThoughtEntry[];
  onNodeClick?: (thoughtId: string) => void;
  highlightedId?: string | null;
}

// Calculate node radius based on content length
const calculateNodeRadius = (contentLength: number): number => {
  const MIN_RADIUS = 8;
  const MAX_RADIUS = 20;
  const MIN_CONTENT_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 3000;

  // Clamp content length to our range
  const clampedLength = Math.max(MIN_CONTENT_LENGTH, Math.min(MAX_CONTENT_LENGTH, contentLength));

  // Linear interpolation between min and max radius
  const normalizedLength = (clampedLength - MIN_CONTENT_LENGTH) / (MAX_CONTENT_LENGTH - MIN_CONTENT_LENGTH);
  return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * normalizedLength;
};

export const ThoughtsGraph = ({
  thoughts,
  onNodeClick,
  highlightedId,
}: ThoughtsGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const nodesRef = useRef<d3.Selection<SVGGElement | BaseType, GraphNode, SVGGElement, unknown> | null>(null);
  const labelsRef = useRef<d3.Selection<SVGTextElement | BaseType, GraphNode, SVGGElement, unknown> | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Separate effect for highlighting to avoid re-rendering the entire graph
  useEffect(() => {
    if (!nodesRef.current) return;

    nodesRef.current.selectAll("circle").each(function(d: any) {
      const circle = d3.select(this);
      const isHighlighted = highlightedId === d.id;

      if (isHighlighted) {
        circle
          .transition()
          .duration(300)
          .attr("r", d.radius * 1.15)
          .attr("fill", "rgba(157, 205, 180, 0.25)")
          .attr("stroke", "rgba(157, 205, 180, 0.5)")
          .attr("stroke-width", 1);
      } else {
        circle
          .transition()
          .duration(300)
          .attr("r", d.radius)
          .attr("fill", "rgba(157, 205, 180, 0.15)")
          .attr("stroke", "rgba(157, 205, 180, 0.3)")
          .attr("stroke-width", 1);
      }
    });
  }, [highlightedId]);

  // Watch for theme changes and update label colors without re-rendering
  useEffect(() => {
    const updateLabelColors = () => {
      if (!labelsRef.current) return;
      // Check if dark mode is active by looking at data-theme attribute
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      // Use the exact same colors as --color-text-primary
      const textColor = isDark ? '#e8eef5' : '#3c3d3b';
      labelsRef.current.style("fill", textColor);
    };

    // Update immediately
    updateLabelColors();

    // Create observer to watch for attribute changes on html element (theme changes)
    const observer = new MutationObserver(updateLabelColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || thoughts.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create nodes from thoughts with calculated radii based on content length
    const nodes: GraphNode[] = thoughts.map((thought) => ({
      id: thought.id,
      title: thought.title,
      tags: thought.tags || [],
      radius: calculateNodeRadius(thought.content.length),
    }));

    // Create links between nodes with shared tags
    const links: GraphLink[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sharedTags = nodes[i].tags.filter((tag) =>
          nodes[j].tags.includes(tag)
        );
        if (sharedTags.length > 0) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            sharedTags: sharedTags.length,
          });
        }
      }
    }

    // Create force simulation with gentler forces
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(80)
          .strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-100).distanceMax(200))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 5).strength(0.7))
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    // Create container group
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Set initial zoom to fill container better
    const initialScale = Math.min(width / 400, height / 400, 1.2);
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(initialScale).translate(-width / 2, -height / 2)
    );

    // Draw links FIRST (so they appear below nodes)
    const link = g
      .append("g")
      .attr("class", "links-layer")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(157, 205, 180, 0.15)")
      .attr("stroke-width", (d) => Math.min(d.sharedTags * 0.8, 1.5));

    // Draw nodes AFTER links (so they appear above)
    const node = g
      .append("g")
      .attr("class", "nodes-layer")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer");

    // Store nodes reference for highlighting
    nodesRef.current = node;

    // Apply drag behavior
    node.call(
      d3
        .drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
    );

    // Glass-material circles for nodes - matching back button and theme toggle
    node
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", "rgba(157, 205, 180, 0.15)")
      .attr("stroke", "rgba(157, 205, 180, 0.3)")
      .attr("stroke-width", 1)
      .attr("filter", "url(#glass-shadow)");

    // Add subtle node labels on hover - positioned above nodes
    // Set color based on current theme - matching --color-text-primary exactly
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e8eef5' : '#3c3d3b';

    const labels = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -(d.radius + 8))
      .attr("font-size", "10px")
      .style("fill", textColor)
      .attr("opacity", 0)
      .attr("pointer-events", "none")
      .text((d) => d.title);

    // Store labels reference for theme updates
    labelsRef.current = labels;

    // Hover effects - matching button hover behavior
    node
      .on("mouseenter", function (_event, d) {
        const circle = d3.select(this).select("circle");
        circle
          .transition()
          .duration(200)
          .attr("r", d.radius * 1.25)
          .attr("fill", "rgba(157, 205, 180, 0.25)")
          .attr("stroke", "rgba(157, 205, 180, 0.5)")
          .attr("stroke-width", 1);

        labels
          .filter((label) => label.id === d.id)
          .transition()
          .duration(200)
          .attr("opacity", 1);
      })
      .on("mouseleave", function (_event, d) {
        const circle = d3.select(this).select("circle");
        // Restore to default or highlighted state
        const currentHighlightedId = highlightedId;
        const isHighlighted = currentHighlightedId === d.id;

        circle
          .transition()
          .duration(200)
          .attr("r", isHighlighted ? d.radius * 1.15 : d.radius)
          .attr("fill", isHighlighted ? "rgba(157, 205, 180, 0.25)" : "rgba(157, 205, 180, 0.15)")
          .attr("stroke", isHighlighted ? "rgba(157, 205, 180, 0.5)" : "rgba(157, 205, 180, 0.3)")
          .attr("stroke-width", 1);

        labels
          .filter((label) => label.id === d.id)
          .transition()
          .duration(200)
          .attr("opacity", 0);
      })
      .on("click", (_event, d) => {
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);

      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    // Drag functions - restart simulation gently to allow dragging without affecting unconnected nodes
    function dragstarted(event: any, d: GraphNode) {
      // Restart simulation with very low alpha to enable dragging
      // This allows the dragged node to move without causing large movements in other nodes
      if (!event.active) simulation.alpha(0.01).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
      // Manually nudge the simulation to update positions
      simulation.alpha(Math.max(simulation.alpha(), 0.01));
    }

    function dragended(event: any, d: GraphNode) {
      // Release the node position constraint so it can settle naturally
      d.fx = null;
      d.fy = null;
      // Let the simulation continue briefly to allow the node to settle
      if (!event.active) {
        simulation.alphaTarget(0);
        simulation.alpha(0.05); // Small amount of energy to allow settling
      }
    }

    // Add glass shadow filter definition - matching button shadow
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glass-shadow");

    // Outer shadow
    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2);

    filter
      .append("feOffset")
      .attr("dx", 0)
      .attr("dy", 2)
      .attr("result", "offsetblur");

    filter
      .append("feFlood")
      .attr("flood-color", "rgba(157, 205, 180, 0.2)");

    filter
      .append("feComposite")
      .attr("in2", "offsetblur")
      .attr("operator", "in")
      .attr("result", "shadow");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "shadow");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [thoughts, dimensions, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-visible">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full overflow-visible"
      />
    </div>
  );
};
