import { LitElement, html, svg, css } from "lit";

const AUTO_DISMISS_MS = 7000;
const EXIT_DURATION_MS = 650;
const DESTINATION = "/pippin/";

// Easter egg summoned by search.njk when someone searches "Pippin": a
// blocky, Duck Hunt-inspired sprite of a laughing Bernese Mountain Dog
// puppy in a rainbow pinwheel beanie flies up from the bottom of the
// screen. It's a link to a hidden page with his real photo.
export class PippinElement extends LitElement {
	static properties = {
		_state: { state: true },
	};

	#dismissTimer;
	#handleKeydown = (event) => {
		if (event.key === "Escape") {
			this.#dismiss();
		}
	};

	constructor() {
		super();
		this._state = "shown";
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener("keydown", this.#handleKeydown);
		this.#dismissTimer = setTimeout(() => this.#dismiss(), AUTO_DISMISS_MS);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener("keydown", this.#handleKeydown);
		clearTimeout(this.#dismissTimer);
	}

	updated() {
		this.setAttribute("data-state", this._state);
	}

	#dismiss() {
		if (this._state === "leaving") {
			return;
		}
		clearTimeout(this.#dismissTimer);
		this._state = "leaving";
		setTimeout(() => this.remove(), EXIT_DURATION_MS);
	}

	render() {
		return html`
			<a href="${DESTINATION}" aria-label="It's Pippin! Click to see his puppy photo.">${this.#renderSvg()}</a>
		`;
	}

	#renderSvg() {
		return svg`
			<svg viewBox="0 -40 200 290" role="img" aria-hidden="true" focusable="false" shape-rendering="crispEdges">
				<!-- ears: big angular flaps splayed up and out, Duck Hunt-style -->
				<polygon points="68,90 68,50 20,0 35,55" fill="#17181c" />
				<polygon points="132,90 132,50 180,0 165,55" fill="#17181c" />

				<!-- head -->
				<rect x="50" y="40" width="100" height="110" fill="#17181c" />

				<!-- blaze -->
				<rect x="80" y="55" width="40" height="95" fill="#faf8f2" />

				<!-- eyebrows -->
				<rect x="60" y="60" width="18" height="14" fill="#a4592b" />
				<rect x="122" y="60" width="18" height="14" fill="#a4592b" />

				<!-- cheeks -->
				<rect x="52" y="100" width="20" height="30" fill="#a4592b" />
				<rect x="128" y="100" width="20" height="30" fill="#a4592b" />

				<!-- eyes, closed and happy -->
				<rect x="88" y="93" width="10" height="4" fill="#17181c" />
				<rect x="102" y="93" width="10" height="4" fill="#17181c" />

				<!-- nose -->
				<rect x="90" y="118" width="20" height="14" fill="#17181c" />

				<!-- open, giggling mouth -->
				<rect x="85" y="134" width="30" height="16" fill="#4a2b22" />
				<rect x="88" y="134" width="8" height="6" fill="#faf8f2" />
				<rect x="104" y="134" width="8" height="6" fill="#faf8f2" />
				<rect x="94" y="142" width="12" height="8" fill="#ff8fa3" />

				<!-- paws bunched together, laughing -->
				<rect x="25" y="140" width="35" height="40" fill="#faf8f2" />
				<rect x="30" y="134" width="6" height="6" fill="#17181c" />
				<rect x="40" y="131" width="6" height="6" fill="#17181c" />
				<rect x="50" y="134" width="6" height="6" fill="#17181c" />
				<rect x="140" y="140" width="35" height="40" fill="#faf8f2" />
				<rect x="144" y="134" width="6" height="6" fill="#17181c" />
				<rect x="154" y="131" width="6" height="6" fill="#17181c" />
				<rect x="164" y="134" width="6" height="6" fill="#17181c" />

				<!-- body -->
				<rect x="35" y="175" width="130" height="65" fill="#17181c" />
				<rect x="70" y="185" width="60" height="55" fill="#faf8f2" />
				<rect x="35" y="210" width="25" height="30" fill="#a4592b" />
				<rect x="140" y="210" width="25" height="30" fill="#a4592b" />

				<!-- rainbow pinwheel beanie -->
				<rect x="45" y="40" width="110" height="7" fill="#1d3557" />
				<rect x="50" y="33" width="100" height="7" fill="#e63946" />
				<rect x="58" y="26" width="84" height="7" fill="#f3722c" />
				<rect x="66" y="19" width="68" height="7" fill="#f4c22c" />
				<rect x="74" y="12" width="52" height="7" fill="#43aa8b" />
				<rect x="82" y="5" width="36" height="7" fill="#277da1" />
				<rect x="90" y="-2" width="20" height="7" fill="#6a4c93" />
				<line x1="100" y1="-2" x2="120" y2="-25" stroke="#e63946" stroke-width="4" stroke-linecap="round" />
				<g class="pinwheel">
					<polygon points="120,-25 130,-34 130,-25" fill="#e63946" />
					<polygon points="120,-25 129,-16 120,-16" fill="#f4c22c" />
					<polygon points="120,-25 110,-16 110,-25" fill="#e63946" />
					<polygon points="120,-25 111,-34 120,-34" fill="#f4c22c" />
					<circle cx="120" cy="-25" r="3" fill="#1d3557" />
				</g>

				<!-- giggle marks -->
				<path
					d="M162,102 Q172,108 164,116"
					stroke="#8891a3"
					stroke-width="3"
					fill="none"
					stroke-linecap="round"
					opacity="0.8"
				/>
				<path
					d="M170,116 Q182,122 172,132"
					stroke="#8891a3"
					stroke-width="3"
					fill="none"
					stroke-linecap="round"
					opacity="0.6"
				/>
			</svg>
		`;
	}

	static styles = css`
		:host {
			position: fixed;
			left: 50%;
			bottom: max(1rem, env(safe-area-inset-bottom));
			z-index: 900;
			width: min(38vw, 190px);
			transform: translate(-50%, 140%);
			opacity: 0;
			pointer-events: none;
			filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.35));
		}

		:host([data-state="shown"]) {
			pointer-events: auto;
			transform: translate(-50%, 0);
			opacity: 1;
		}

		:host([data-state="leaving"]) {
			opacity: 0;
		}

		a {
			display: block;
			width: 100%;
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
		}

		a:focus-visible {
			outline: 3px solid #58a6ff;
			outline-offset: 4px;
			border-radius: 999px;
		}

		svg {
			display: block;
			width: 100%;
			height: auto;
		}

		@media (prefers-reduced-motion: no-preference) {
			:host([data-state="shown"]) {
				animation:
					pippin-enter 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
					pippin-bob 3.1s ease-in-out 0.9s infinite;
			}

			:host([data-state="leaving"]) {
				animation: pippin-exit 0.6s ease-in forwards;
			}

			.pinwheel {
				animation: pippin-spin 1.3s linear infinite;
				transform-origin: 120px -25px;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			:host {
				transition: opacity 0.3s ease;
			}
		}

		@keyframes pippin-enter {
			from {
				transform: translate(-50%, 140%) rotate(-6deg);
				opacity: 0;
			}
			70% {
				transform: translate(-50%, -6%) rotate(4deg);
				opacity: 1;
			}
			100% {
				transform: translate(-50%, 0%) rotate(0deg);
				opacity: 1;
			}
		}

		@keyframes pippin-bob {
			0%,
			100% {
				transform: translate(-50%, 0) rotate(-1.5deg);
			}
			50% {
				transform: translate(-50%, -12px) rotate(1.5deg);
			}
		}

		@keyframes pippin-exit {
			from {
				transform: translate(-50%, 0) rotate(0deg);
				opacity: 1;
			}
			to {
				transform: translate(-50%, 140%) rotate(8deg);
				opacity: 0;
			}
		}

		@keyframes pippin-spin {
			to {
				transform: rotate(360deg);
			}
		}
	`;
}

customElements.define("pob-pippin", PippinElement);
