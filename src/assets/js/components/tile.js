import { LitElement, html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

export class TileElement extends LitElement {
	#internals;

	static get properties() {
		return {
			href: { type: String },
			target: { type: String },
			padding: { type: String },
		};
	}

	constructor() {
		super();
		this.href = "";
		this.target = "";
		this.padding = "1rem";
		this.#internals = this.attachInternals();
		this.#internals.role = "article";
	}

	render() {
		const isLink = this.href && this.href.trim() !== "";

		if (isLink) {
			const hasTarget = this.target && this.target.trim() !== "";
			const rel = hasTarget ? "noopener noreferrer" : undefined;

			return html`
				<a
					href="${this.href}"
					part="tile-link"
					target="${ifDefined(hasTarget ? this.target : undefined)}"
					rel="${ifDefined(rel)}">
					<slot></slot>
				</a>
			`;
		}

		return html`
			<div part="tile-container">
				<slot></slot>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
			height: 100%;
		}

		a,
		div {
			display: flex;
			flex-direction: column;
			height: 100%;
			text-decoration: none;
			color: inherit;
			padding: var(--tile-padding, 1rem);
			border-radius: 12px;
			transition: all 0.2s ease;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			background: color-mix(in srgb, var(--page-background-color), white 50%);
		}

		a:hover,
		:host([hoverable]) div:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		/* Dark mode support */
		@media (prefers-color-scheme: dark) {
			a,
			div {
				background: color-mix(in srgb, var(--page-background-color), white 8%);
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
			}

			a:hover,
			:host([hoverable]) div:hover {
				background: color-mix(in srgb, var(--page-background-color), white 10%);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
			}
		}

		/* Respect reduced motion */
		@media (prefers-reduced-motion: reduce) {
			a,
			div {
				transition: none !important;
			}
		}
	`;
}

customElements.define("pob-tile", TileElement);
