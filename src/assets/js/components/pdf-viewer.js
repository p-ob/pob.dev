import { html, css, LitElement, isServer, nothing } from "lit";

/**
 * Canvas-based PDF slide-deck viewer built on PDF.js.
 *
 * Progressive enhancement: the host template keeps a plain download link
 * alongside this element, so a browser that can't load PDF.js (JS disabled,
 * network failure, missing `import.meta.resolve` support) still lets
 * visitors get the slides.
 */
export class PdfViewerElement extends LitElement {
	static properties = {
		src: { type: String },
		label: { type: String },
		_pageNum: { state: true },
		_pageCount: { state: true },
		_error: { state: true },
	};

	static styles = css`
		:host {
			display: block;
		}

		.pdf-viewer {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.75em;
		}

		canvas {
			max-width: 100%;
			height: auto;
			border: 1px solid var(--faded-color, hsl(0, 0%, 70%));
		}

		.pdf-controls {
			display: flex;
			align-items: center;
			gap: 1em;
			font-size: 0.9em;
		}

		button {
			padding: 0.35em 0.9em;
			font: inherit;
			font-weight: 600;
			color: var(--font-color, hsl(0, 0%, 20%));
			background: var(--blockquote-background-color, hsl(0, 0%, 90%));
			border: 1px solid var(--faded-color, hsl(0, 0%, 70%));
			border-radius: 0.25em;
			cursor: pointer;
			transition: background 0.15s ease;
		}

		button:hover:not(:disabled) {
			background: var(--faded-color, hsl(0, 0%, 80%));
		}

		button:disabled {
			opacity: 0.5;
			cursor: default;
		}
	`;

	#canvas;
	#pdfDoc = null;
	#renderTask = null;
	#resizeObserver;

	constructor() {
		super();
		this.src = "";
		this.label = "slides";
		this._pageNum = 1;
		this._pageCount = 0;
		this._error = false;
	}

	render() {
		if (this._error) {
			return nothing;
		}

		return html`
			<div class="pdf-viewer">
				<canvas aria-label="${this.label}, page ${this._pageNum}"></canvas>
				<div class="pdf-controls">
					<button type="button" @click="${this.#prevPage}" ?disabled="${this._pageNum <= 1}">Previous</button>
					<span>Page ${this._pageNum} of ${this._pageCount || "…"}</span>
					<button type="button" @click="${this.#nextPage}" ?disabled="${this._pageNum >= this._pageCount}">Next</button>
				</div>
			</div>
		`;
	}

	async firstUpdated() {
		if (isServer || !this.src) {
			return;
		}

		this.#canvas = this.shadowRoot.querySelector("canvas");

		try {
			const pdfjsLib = await import("pdfjs-dist");
			pdfjsLib.GlobalWorkerOptions.workerSrc = import.meta.resolve("pdfjs-dist/build/pdf.worker.mjs");

			this.#pdfDoc = await pdfjsLib.getDocument({ url: this.src }).promise;
			this._pageCount = this.#pdfDoc.numPages;
			await this.#renderPage(1);

			this.#resizeObserver = new ResizeObserver(() => this.#renderPage(this._pageNum));
			this.#resizeObserver.observe(this);
		} catch {
			this._error = true;
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#resizeObserver?.disconnect();
		this.#renderTask?.cancel();
	}

	async #prevPage() {
		if (this._pageNum > 1) {
			await this.#renderPage(this._pageNum - 1);
		}
	}

	async #nextPage() {
		if (this._pageNum < this._pageCount) {
			await this.#renderPage(this._pageNum + 1);
		}
	}

	async #renderPage(num) {
		if (!this.#pdfDoc || !this.#canvas) {
			return;
		}

		this.#renderTask?.cancel();

		const page = await this.#pdfDoc.getPage(num);
		const containerWidth = this.clientWidth || 800;
		const unscaledWidth = page.getViewport({ scale: 1 }).width;
		const outputScale = window.devicePixelRatio || 1;
		const viewport = page.getViewport({ scale: containerWidth / unscaledWidth });

		this.#canvas.width = Math.floor(viewport.width * outputScale);
		this.#canvas.height = Math.floor(viewport.height * outputScale);
		this.#canvas.style.width = `${Math.floor(viewport.width)}px`;
		this.#canvas.style.height = `${Math.floor(viewport.height)}px`;

		this.#renderTask = page.render({
			canvasContext: this.#canvas.getContext("2d"),
			viewport,
			transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null,
		});

		try {
			await this.#renderTask.promise;
			this._pageNum = num;
		} catch (err) {
			if (err?.name !== "RenderingCancelledException") {
				throw err;
			}
		}
	}
}

customElements.define("pob-pdf-viewer", PdfViewerElement);
