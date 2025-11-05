import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ThoughtEntry } from "../data/thoughts";

type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  title: string;
  tags: string[];
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

export const ThoughtsGraph = ({
  thoughts,
  onNodeClick,
  highlightedId,
}: ThoughtsGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const nodesRef = useRef<d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null);

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
          .attr("r", 14)
          .attr("fill", "rgba(157, 205, 180, 0.35)")
          .attr("stroke", "rgba(157, 205, 180, 0.9)")
          .attr("stroke-width", 2);
      } else {
        circle
          .transition()
          .duration(300)
          .attr("r", 12)
          .attr("fill", "rgba(157, 205, 180, 0.15)")
          .attr("stroke", "rgba(157, 205, 180, 0.5)")
          .attr("stroke-width", 1.5);
      }
    });
  }, [highlightedId]);

  useEffect(() => {
    if (!svgRef.current || thoughts.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create nodes from thoughts
    const nodes: GraphNode[] = thoughts.map((thought) => ({
      id: thought.id,
      title: thought.title,
      tags: thought.tags || [],
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

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(80)
          .strength((d: any) => d.sharedTags * 0.3)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

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

    // Draw links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(157, 205, 180, 0.2)")
      .attr("stroke-width", (d) => Math.min(d.sharedTags * 0.5, 2));

    // Draw nodes
    const node = g
      .append("g")
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

    // Glass-material circles for nodes
    node
      .append("circle")
      .attr("r", 12)
      .attr("fill", "rgba(157, 205, 180, 0.15)")
      .attr("stroke", "rgba(157, 205, 180, 0.5)")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glass-filter)");

    // Inner glow circle
    node
      .append("circle")
      .attr("r", 8)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.3)")
      .attr("stroke-width", 0.5);

    // Add subtle node labels on hover
    const labels = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", 25)
      .attr("font-size", "10px")
      .attr("fill", "var(--color-secondary)")
      .attr("opacity", 0)
      .attr("pointer-events", "none")
      .text((d) => d.title);

    // Hover effects
    node
      .on("mouseenter", function (_event, d) {
        const circle = d3.select(this).select("circle");
        circle
          .transition()
          .duration(200)
          .attr("r", 16)
          .attr("fill", "rgba(157, 205, 180, 0.4)")
          .attr("stroke", "rgba(157, 205, 180, 0.95)")
          .attr("stroke-width", 2.5);

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
          .attr("r", isHighlighted ? 14 : 12)
          .attr("fill", isHighlighted ? "rgba(157, 205, 180, 0.35)" : "rgba(157, 205, 180, 0.15)")
          .attr("stroke", isHighlighted ? "rgba(157, 205, 180, 0.9)" : "rgba(157, 205, 180, 0.5)")
          .attr("stroke-width", isHighlighted ? 2 : 1.5);

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

    // Drag functions
    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add glass filter definition
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glass-filter");

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2);

    filter
      .append("feOffset")
      .attr("dx", 0)
      .attr("dy", 1)
      .attr("result", "offsetblur");

    filter
      .append("feComponentTransfer")
      .append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.3);

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
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
