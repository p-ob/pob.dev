import { html, css, LitElement, isServer } from "lit";

export class NoteElement extends LitElement {
	#internals;

	static properties = {
		type: { type: String },
	};

	static styles = css`
		:host {
			display: block;
			margin: 1em 0;
			border-radius: 0.5em;
			padding: 1em;
			font-size: 1rem;
			color: var(--font-color, hsl(0, 0%, 20%));
			background: var(--note-background, var(--blockquote-background-color, hsl(0, 0%, 96%)));
			border-left: 0.3em solid var(--note-accent, var(--blockquote-accent-color, hsl(0, 0%, 20%)));
			transition:
				background 0.2s,
				color 0.2s,
				border-color 0.2s;
		}

		:host([type="note"]) {
			--note-background: color-mix(in srgb, var(--page-background-color, hsl(0, 0%, 96%)), #2196f3 10%);
			--note-accent: #2196f3;
		}

		:host([type="warning"]) {
			--note-background: color-mix(in srgb, var(--page-background-color, hsl(0, 0%, 96%)), #ff9800 10%);
			--note-accent: #ff9800;
		}

		:host([type="error"]) {
			--note-background: color-mix(in srgb, var(--page-background-color, hsl(0, 0%, 96%)), #f44336 10%);
			--note-accent: #f44336;
		}

		:host([type="success"]) {
			--note-background: color-mix(in srgb, var(--page-background-color, hsl(0, 0%, 96%)), #4caf50 10%);
			--note-accent: #4caf50;
		}

		:host([type="info"]) {
			--note-background: color-mix(in srgb, var(--page-background-color, hsl(0, 0%, 96%)), #00bcd4 10%);
			--note-accent: #00bcd4;
		}

		::slotted(*) {
			margin: 0;
		}

		.note-label {
			font-weight: bold;
			letter-spacing: 0.05em;
			margin-bottom: 0.5em;
			font-size: 0.95em;
			text-transform: uppercase;
			display: block;
		}
	`;

	constructor() {
		super();
		this.type = "note";
		if (!isServer) {
			this.#internals = this.attachInternals();
			this.#internals.role = "note";
		}
	}

	render() {
		let label = "";
		switch (this.type) {
			case "warning":
				label = "WARNING";
				break;
			case "error":
				label = "ERROR";
				break;
			case "success":
				label = "SUCCESS";
				break;
			case "info":
				label = "INFO";
				break;
			case "note":
			default:
				label = "NOTE";
		}
		return html`
			${label ? html`<span class="note-label">${label}</span>` : ""}
			<slot></slot>
		`;
	}
}

customElements.define("pob-note", NoteElement);
