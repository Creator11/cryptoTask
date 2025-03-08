import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './components/Treemap/Treemap.ts';
import './components/Graph/GraphVisualization.ts';

@customElement('my-element')
export class MyElement extends LitElement {
  render() {
    return html`
      <treemap-element></treemap-element>
      <graph-visualization></graph-visualization>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
