import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CategoryData } from "../../types.ts";
import { createTreemap } from "./treemap-logic.ts";
import { fetchCryptoData } from "../../api/treemap.ts";

@customElement('treemap-element')
export class Treemap extends LitElement {
    static styles = css`
        :host {
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }

        #treemap {
            width: 100%;
            height: 500px;
        }

        .tooltip {
            position: absolute;
            visibility: hidden;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            pointer-events: none;
        }
    `;

    private data: CategoryData | null = null;

    render() {
        return html`
            <svg id="treemap"></svg>
            <div class="tooltip"></div>
        `;
    }

    async firstUpdated() {
        await this.loadData();
    }

    private async loadData() {
        try {
            const cryptoData = await fetchCryptoData();
            if (cryptoData) {
                this.data = cryptoData;
                this.drawTreemap();
            } else {
                console.error('Не удалось загрузить данные для тримапа.');
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    private drawTreemap() {
        if (this.data) {
            const treemapContainer = this.shadowRoot!.querySelector("#treemap")!;
            const tooltip = this.shadowRoot!.querySelector('.tooltip');
            createTreemap(this.data, treemapContainer, tooltip);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'treemap-element': Treemap;
    }
}
