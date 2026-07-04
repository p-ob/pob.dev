import { LitElement, html, css, svg } from "lit";

const printerIcon = svg`<svg viewBox="0 0 24 24" aria-hidden="true" part="icon">
	<path d="M6 9V3h12v6" />
	<path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
	<rect x="6" y="14" width="12" height="7" rx="1" />
</svg>`;

/**
 * A button that prints the current page via `window.print()`.
 *
 * Attributes:
 *   - `label`    accessible name / tooltip (default "Print")
 *   - `floating` render as a fixed bottom-right floating action button
 *
 * Progressive enhancement: the click handler is the only affordance this adds,
 * but printing is always reachable from the browser's own menu, so the page is
 * fully usable if this component never hydrates.
 */
export class PrintButtonElement extends LitElement {
	static properties = {
		label: { type: String },
		floating: { type: Boolean, reflect: true },
	};

	constructor() {
		super();
		this.label = "Print";
		this.floating = false;
	}

	#print() {
		window.print();
	}

	render() {
		return html`
			<button type="button" part="button" aria-label="${this.label}" title="${this.label}" @click="${this.#print}">
				${printerIcon}
				<slot></slot>
			</button>
		`;
	}

	static styles = css`
		:host {
			--print-button-size: 3.25rem;
			display: inline-flex;
		}

		button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			min-width: var(--print-button-size);
			height: var(--print-button-size);
			padding: 0 1rem;
			border: 1px solid var(--print-button-border, color-mix(in srgb, var(--font-color, #333), transparent 75%));
			border-radius: 999px;
			background: var(--print-button-background, var(--page-background-color, #fff));
			color: var(--print-button-color, var(--font-color, #333));
			font: inherit;
			cursor: pointer;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
			transition:
				transform 0.2s ease,
				box-shadow 0.2s ease,
				background 0.2s ease;
		}

		/* Icon-only (no slotted label): keep it a perfect circle. */
		:host(:not([has-label])) button {
			padding: 0;
			width: var(--print-button-size);
		}

		button:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
			background: var(
				--print-button-hover,
				color-mix(in srgb, var(--page-background-color, #fff), var(--font-color, #333) 8%)
			);
		}

		button:focus-visible {
			outline: 2px solid var(--font-color, #333);
			outline-offset: 2px;
		}

		svg {
			width: 1.4rem;
			height: 1.4rem;
			flex-shrink: 0;
			fill: none;
			stroke: currentColor;
			stroke-width: 1.5;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		::slotted(*) {
			margin: 0;
		}

		/* Floating action button placement. */
		:host([floating]) {
			position: fixed;
			right: 1.5rem;
			bottom: 1.5rem;
			z-index: 50;
		}

		@media (prefers-reduced-motion: reduce) {
			button {
				transition: none;
			}

			button:hover {
				transform: none;
			}
		}

		/* Never print the print button itself. */
		@media print {
			:host {
				display: none;
			}
		}
	`;

	updated() {
		// Toggle a reflecting hook so the circle-vs-pill styling can key off
		// whether the default slot actually has content.
		const hasLabel = this.textContent.trim().length > 0;
		this.toggleAttribute("has-label", hasLabel);
	}
}

customElements.define("pob-print-button", PrintButtonElement);
