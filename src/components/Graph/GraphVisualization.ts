import {LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as d3 from 'd3';
import { GraphData, initialData, stepData2, stepData3, NodeData, LinkData } from '../../api/graph.ts';

@customElement('graph-visualization')
export class GraphVisualization extends LitElement {
    @property({ type: Object })
    data: GraphData = { nodes: [], links: [] };

    private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private simulation!: d3.Simulation<NodeData, LinkData>;
    private currentStep: number = 1;
    private linkSelection!: d3.Selection<SVGLineElement, LinkData, SVGGElement, unknown>;
    private nodeSelection!: d3.Selection<SVGCircleElement, NodeData, SVGGElement, unknown>;
    private nodeLabelSelection!: d3.Selection<SVGTextElement, NodeData, SVGGElement, unknown>;
    private linkLabelSelection!: d3.Selection<SVGTextElement, LinkData, SVGGElement, unknown>;

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            height: auto;
        }

        svg {
            width: 100%;
            height: 600px;
        }

        .links line {
            stroke: #999;
            stroke-width: 2px;
        }
        .nodes circle {
            stroke: #fff;
            stroke-width: 1.5px;
        }
        .labels text,
        .link-labels text {
            pointer-events: none;
            font-family: sans-serif;
        }
        .link-labels text {
            font-size: 10px;
            fill: #555;
        }
    `;

    render(): TemplateResult {
        return html`<svg></svg>`;
    }

    firstUpdated(): void {
        this.initGraph();
    }

    initGraph(): void {
        this.data = initialData;

        if (this.data.links && this.data.links.length > 0) {
            this.data.links = this.data.links.map((link: LinkData) => ({
                source: link.from || link.source,
                target: link.to || link.target,
                label: link.label || ""
            }));
        }

        const svgElement = this.renderRoot.querySelector('svg') as SVGSVGElement;
        this.svg = d3.select(svgElement);

        if (this.svg.select("g.links").empty()) {
            this.svg.append("g").attr("class", "links");
        }
        if (this.svg.select("g.nodes").empty()) {
            this.svg.append("g").attr("class", "nodes");
        }
        if (this.svg.select("g.labels").empty()) {
            this.svg.append("g").attr("class", "labels");
        }
        if (this.svg.select("g.link-labels").empty()) {
            this.svg.append("g").attr("class", "link-labels");
        }

        this.simulation = d3.forceSimulation<NodeData>(this.data.nodes)
            .force("link", d3.forceLink<NodeData, LinkData>(this.data.links)
                .id((d: NodeData) => d.address)
                .distance(250)
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(svgElement.clientWidth * 2 , svgElement.clientHeight / 2))

        this.updateGraph();

        this.simulation.on("tick", () => {
            this.linkSelection
                .attr("x1", (d: LinkData) => (d.source as NodeData).x!)
                .attr("y1", (d: LinkData) => (d.source as NodeData).y!)
                .attr("x2", (d: LinkData) => (d.target as NodeData).x!)
                .attr("y2", (d: LinkData) => (d.target as NodeData).y!);

            this.nodeSelection
                .attr("cx", (d: NodeData) => d.x!)
                .attr("cy", (d: NodeData) => d.y!);

            this.nodeLabelSelection
                .attr("x", (d: NodeData) => d.x!)
                .attr("y", (d: NodeData) => d.y!);

            this.linkLabelSelection
                .attr("x", (d: LinkData) => ((d.source as NodeData).x! + (d.target as NodeData).x!) / 2)
                .attr("y", (d: LinkData) => ((d.source as NodeData).y! + (d.target as NodeData).y!) / 2);
        });
    }

    updateGraph(): void {
        this.linkSelection = this.svg.select<SVGGElement>("g.links")
            .selectAll<SVGLineElement, LinkData>("line")
            .data(this.data.links, (d: LinkData) => (d.source as NodeData).address + "-" + (d.target as NodeData).address);
        this.linkSelection.exit().remove();
        this.linkSelection = this.linkSelection.enter()
            .append("line")
            .merge(this.linkSelection);

        this.nodeSelection = this.svg.select<SVGGElement>("g.nodes")
            .selectAll<SVGCircleElement, NodeData>("circle")
            .data(this.data.nodes, (d: NodeData) => d.address);
        this.nodeSelection.exit().remove();
        const newNodes = this.nodeSelection.enter()
            .append("circle")
            .attr("r", 20)
            .attr("fill", (d: NodeData) => d.not_open ? "#ff7f0e" : "#1f77b4")
            .call(d3.drag<SVGCircleElement, NodeData>()
                .on("start", (event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d: NodeData) => {
                    if (!event.active) this.simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d: NodeData) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d: NodeData) => {
                    if (!event.active) this.simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                })
            )
            .on("click", (_event: MouseEvent, d: NodeData) => this.handleNodeClick(d));
        this.nodeSelection = newNodes.merge(this.nodeSelection);

        this.nodeLabelSelection = this.svg.select<SVGGElement>("g.labels")
            .selectAll<SVGTextElement, NodeData>("text")
            .data(this.data.nodes, (d: NodeData) => d.address);
        this.nodeLabelSelection.exit().remove();
        const newLabels = this.nodeLabelSelection.enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .text((d: NodeData) => d.address_name);
        this.nodeLabelSelection = newLabels.merge(this.nodeLabelSelection);

        this.linkLabelSelection = this.svg.select<SVGGElement>("g.link-labels")
            .selectAll<SVGTextElement, LinkData>("text")
            .data(this.data.links, (d: LinkData) => (d.source as NodeData).address + "-" + (d.target as NodeData).address);
        this.linkLabelSelection.exit().remove();
        const newLinkLabels = this.linkLabelSelection.enter()
            .append("text")
            .attr("text-anchor", "middle")
            .text((d: LinkData) => d.label);
        this.linkLabelSelection = newLinkLabels.merge(this.linkLabelSelection);

        this.simulation.nodes(this.data.nodes);
        (this.simulation.force("link") as d3.ForceLink<NodeData, LinkData>).links(this.data.links);
        this.simulation.alpha(0.8).restart();
    }

    handleNodeClick(clickedNode: NodeData): void {
        if (!clickedNode.not_open) return;
        clickedNode.not_open = false;

        let newStepData: GraphData = { nodes: [], links: [] };
        if (this.currentStep === 1) {
            newStepData = stepData2;
            this.currentStep = 2;
        } else if (this.currentStep === 2) {
            newStepData = stepData3;
            this.currentStep = 3;
        } else {
            return;
        }
        this.mergeGraph(newStepData, clickedNode);
        this.updateGraph();
    }

    mergeGraph(newGraph: GraphData, clickedNode: NodeData): void {
        newGraph.nodes.forEach(newNode => {
            const exists = this.data.nodes.find(n => n.address === newNode.address);
            if (!exists) {
                this.data.nodes.push(newNode);
            }
        });
        if (newGraph.links && newGraph.links.length > 0) {
            newGraph.links.forEach(newLink => {
                const linkExists = this.data.links.find(l => {
                    const sourceAddress = typeof l.source === 'object' ? (l.source as NodeData).address : l.source;
                    const targetAddress = typeof l.target === 'object' ? (l.target as NodeData).address : l.target;
                    const newSource = typeof newLink.source === 'object' ? (newLink.source as NodeData).address : newLink.source;
                    const newTarget = typeof newLink.target === 'object' ? (newLink.target as NodeData).address : newLink.target;
                    return sourceAddress === newSource && targetAddress === newTarget;
                });
                if (!linkExists) {
                    this.data.links.push(newLink);
                }
            });
        } else {
            newGraph.nodes.forEach(newNode => {
                if (newNode.address !== clickedNode.address) {
                    const linkExists = this.data.links.find(l => {
                        const sourceAddress = typeof l.source === 'object' ? (l.source as NodeData).address : l.source;
                        const targetAddress = typeof l.target === 'object' ? (l.target as NodeData).address : l.target;
                        return sourceAddress === clickedNode.address && targetAddress === newNode.address;
                    });
                    if (!linkExists) {
                        this.data.links.push({
                            source: clickedNode.address,
                            target: newNode.address,
                            label: "new link"
                        });
                    }
                }
            });
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'graph-visualization': GraphVisualization;
    }
}