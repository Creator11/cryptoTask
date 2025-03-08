import * as d3 from 'd3';
import { CategoryData } from "../../types.ts";

export function createTreemap(data: CategoryData, svgElement: SVGElement, tooltipElement: HTMLElement | null) {
    const width = window.innerWidth;
    const height = 1000;

    const root = d3.treemap()
        .size([width, height])
        .padding(3)
        .round(true)(
            d3.hierarchy(data)
                .sum(d => d.market_cap)
                .sort((a, b) => b.market_cap - a.market_cap)
        );

    const svg = d3.select(svgElement)
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif; display: flex; justify-content: center; align-items: center;");

    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const format = d3.format(",d");

    leaf.append("rect")
        .attr("fill", d => d.data.market_cap_change_24h > 0 ? "#4CAF50" : "#F44336")
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("fill-opacity", 0.9);

            if (tooltipElement) {
                tooltipElement.innerHTML = `
                <div>${d.data.name}</div>
                <div>Market Cap: ${d.data.market_cap.toLocaleString()}</div>
                <div >
                    ${d.data.top_3_coins.map(url => `<img src="${url}" width="28" />`).join('')}
                </div>
            `;
                tooltipElement.style.visibility = "visible";
                tooltipElement.style.left = `${event.pageX + 10}px`;
                tooltipElement.style.top = `${event.pageY + 10}px`;
            }
        })
        .on("mousemove", (event) => {
            if (tooltipElement) {
                tooltipElement.style.left = `${event.pageX + 10}px`;
                tooltipElement.style.top = `${event.pageY + 10}px`;
            }
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("fill-opacity", 0.6);

            if (tooltipElement) {
                tooltipElement.style.visibility = "hidden";
            }
        });

    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = `clip-${Math.random().toString(36).substr(2, 9)}`))
        .append("use")
        .attr("xlink:href", d => d.leafUid);

    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
        .style("pointer-events", "none")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.data.market_cap)))
        .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);
}
