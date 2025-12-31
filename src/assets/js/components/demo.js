import { html, css, LitElement } from "lit";

export class DemoElement extends LitElement {
	static properties = {
		_showPreview: { state: true },
	};

	static styles = css`
		:host {
			display: block;
			margin: 1em 0;
		}

		.demo-container {
			border: 1px solid var(--faded-color, hsl(0, 0%, 70%));
			border-radius: 0.5em;
			overflow: hidden;
		}

		.code-section {
			position: relative;
		}

		::slotted(syntax-highlight) {
			margin: 0 !important;
			border: none !important;
			border-radius: 0 !important;
		}

		.toolbar {
			display: flex;
			align-items: center;
			gap: 0.75em;
			padding: 0.5em 1em;
			background: var(--code-background-color, hsl(0, 0%, 93%));
			border-top: 1px solid var(--faded-color, hsl(0, 0%, 70%));
		}

		.run-button {
			display: inline-flex;
			align-items: center;
			gap: 0.35em;
			padding: 0.35em 0.75em;
			font-size: 0.85em;
			font-weight: 600;
			color: var(--font-color, hsl(0, 0%, 20%));
			background: var(--blockquote-background-color, hsl(0, 0%, 90%));
			border: 1px solid var(--faded-color, hsl(0, 0%, 70%));
			border-radius: 0.25em;
			cursor: pointer;
			transition: background 0.15s ease, opacity 0.15s ease;
		}

		.run-button:hover:not(:disabled) {
			background: var(--faded-color, hsl(0, 0%, 80%));
		}

		.run-button:disabled {
			opacity: 0.5;
			cursor: default;
		}

		.run-button svg {
			width: 0.9em;
			height: 0.9em;
			fill: currentColor;
		}

		.preview-section {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows 0.25s ease-out;
		}

		.preview-section.open {
			grid-template-rows: 1fr;
		}

		.preview-inner {
			min-height: 0;
			overflow: hidden;
		}

		.preview-content {
			border-top: 1px solid var(--faded-color, hsl(0, 0%, 70%));
		}

		.preview-header {
			display: flex;
			align-items: center;
			gap: 0.5em;
			padding: 0.5em 1em;
			background: var(--code-background-color, hsl(0, 0%, 93%));
			border-bottom: 1px solid var(--faded-color, hsl(0, 0%, 70%));
		}

		.preview-label {
			font-size: 0.75em;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: var(--font-color, hsl(0, 0%, 20%));
			opacity: 0.6;
		}

		.demo-frame {
			width: 100%;
			border: none;
			display: block;
		}
	`;

	#iframe = null;
	#htmlContent = null;

	constructor() {
		super();
		this._showPreview = false;
	}

	render() {
		return html`
			<div class="demo-container">
				<div class="code-section">
					<slot @slotchange=${this.#onSlotChange}></slot>
				</div>
				<div class="toolbar">
					<button
						class="run-button"
						@click=${this.#runDemo}
						?disabled=${this._showPreview}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M8 5v14l11-7z" />
						</svg>
						Run
					</button>
				</div>
				<div class="preview-section ${this._showPreview ? "open" : ""}">
					<div class="preview-inner">
						<div class="preview-content">
							<div class="preview-header">
								<span class="preview-label">Output</span>
							</div>
							<iframe class="demo-frame" sandbox="allow-scripts"></iframe>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	firstUpdated() {
		this.#iframe = this.shadowRoot.querySelector(".demo-frame");
		this.#extractCode();
	}

	#onSlotChange() {
		this.#extractCode();
	}

	#extractCode() {
		const slot = this.shadowRoot.querySelector("slot");
		const assignedNodes = slot?.assignedNodes({ flatten: true }) || [];

		for (const node of assignedNodes) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				// For <syntax-highlight>, get innerHTML and decode entities
				if (node.tagName === "SYNTAX-HIGHLIGHT") {
					this.#htmlContent = this.#decodeHtmlEntities(node.innerHTML || "");
					return;
				}

				// Check for <code> element
				if (node.tagName === "CODE") {
					this.#htmlContent = this.#decodeHtmlEntities(node.textContent || "");
					return;
				}

				// Check for <code> inside the element
				const codeElement = node.querySelector("code");
				if (codeElement) {
					this.#htmlContent = this.#decodeHtmlEntities(codeElement.textContent || "");
					return;
				}
			}
		}
	}

	#runDemo() {
		if (this._showPreview || !this.#htmlContent) {
			return;
		}
		this._showPreview = true;
		this.#renderDemo();
	}

	#renderDemo() {
		if (!this.#iframe || !this.#htmlContent) {
			return;
		}

		// Create the iframe document with dark mode support
		const iframeDoc = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<style>
		body {
			margin: 1em;
			font-family: system-ui, -apple-system, sans-serif;
			color: hsl(0, 0%, 20%);
			background: hsl(0, 0%, 100%);
		}

		@media (prefers-color-scheme: dark) {
			body {
				color: hsl(0, 0%, 91%);
				background: hsl(220, 4%, 14%);
			}
		}
	</style>
</head>
<body>
${this.#htmlContent}
</body>
</html>`;

		// Use srcdoc for security (combined with sandbox attribute)
		this.#iframe.srcdoc = iframeDoc;

		// Auto-resize iframe after content loads
		this.#iframe.onload = () => {
			this.#resizeIframe();
		};
	}

	#decodeHtmlEntities(text) {
		const textarea = document.createElement("textarea");
		textarea.innerHTML = text;
		return textarea.value;
	}

	#resizeIframe() {
		if (!this.#iframe?.contentDocument?.body) {
			return;
		}

		// Get the content height and add padding for breathing room
		const contentHeight = this.#iframe.contentDocument.body.scrollHeight;
		this.#iframe.style.height = `${contentHeight + 32}px`;
	}
}

customElements.define("pob-demo", DemoElement);
