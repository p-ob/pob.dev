import { LitElement, html, svg, css } from "lit";

const AUTO_DISMISS_MS = 7000;
const EXIT_DURATION_MS = 650;
const DESTINATION = "/pippin/";

// Easter egg summoned by search.njk when someone searches "Pippin": an
// animated cartoon of a Bernese Mountain Dog puppy in a pinwheel beanie
// flies up from the bottom of the screen. It's a link to a hidden page
// with his real photo.
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
			<svg viewBox="0 0 200 230" role="img" aria-hidden="true" focusable="false">
				<!-- ears -->
				<path d="M38,92 C16,110 8,152 30,178 C48,162 54,122 58,96 Z" fill="#15171b" />
				<path d="M162,92 C184,110 192,152 170,178 C152,162 146,122 142,96 Z" fill="#15171b" />

				<!-- body -->
				<rect x="35" y="150" width="130" height="72" rx="32" fill="#15171b" />
				<ellipse cx="100" cy="196" rx="40" ry="34" fill="#faf8f2" />
				<rect x="35" y="188" width="20" height="34" rx="9" fill="#a4592b" />
				<rect x="145" y="188" width="20" height="34" rx="9" fill="#a4592b" />

				<!-- head -->
				<circle cx="100" cy="118" r="55" fill="#15171b" />

				<!-- cheeks -->
				<ellipse cx="66" cy="138" rx="12" ry="16" fill="#a4592b" />
				<ellipse cx="134" cy="138" rx="12" ry="16" fill="#a4592b" />

				<!-- blaze -->
				<path
					d="M100,68 C122,74 132,100 129,126 C126,152 114,170 100,172 C86,170 74,152 71,126 C68,100 78,74 100,68 Z"
					fill="#faf8f2"
				/>

				<!-- eyebrows -->
				<ellipse cx="79" cy="96" rx="10" ry="6" fill="#a4592b" transform="rotate(-10 79 96)" />
				<ellipse cx="121" cy="96" rx="10" ry="6" fill="#a4592b" transform="rotate(10 121 96)" />

				<!-- eyes, closed and happy -->
				<path d="M70,116 Q80,104 90,116" stroke="#15171b" stroke-width="5" fill="none" stroke-linecap="round" />
				<path d="M110,116 Q120,104 130,116" stroke="#15171b" stroke-width="5" fill="none" stroke-linecap="round" />

				<!-- nose -->
				<ellipse cx="100" cy="138" rx="10" ry="7" fill="#15171b" />
				<ellipse cx="97" cy="136" rx="2.5" ry="1.5" fill="#585858" />

				<!-- open, giggling mouth -->
				<path d="M87,149 Q100,169 113,149 Q100,159 87,149 Z" fill="#5b2f22" />
				<ellipse cx="100" cy="157" rx="7" ry="5.5" fill="#ff8fa3" />

				<!-- paws raised in a giggle -->
				<g transform="rotate(-24 52 152)">
					<ellipse cx="52" cy="152" rx="15" ry="19" fill="#faf8f2" />
					<line x1="45" y1="138" x2="45" y2="132" stroke="#15171b" stroke-width="2.5" stroke-linecap="round" />
					<line x1="52" y1="136" x2="52" y2="129" stroke="#15171b" stroke-width="2.5" stroke-linecap="round" />
					<line x1="59" y1="138" x2="60" y2="132" stroke="#15171b" stroke-width="2.5" stroke-linecap="round" />
				</g>
				<g transform="rotate(24 148 152)">
					<ellipse cx="148" cy="152" rx="15" ry="19" fill="#faf8f2" />
					<line x1="141" y1="138" x2="141" y2="132" stroke="#15171b" stroke-width="2.5" stroke-linecap="round" />
					<line x1="148" y1="136" x2="148" y2="129" stroke="#15171b" stroke-width="2.5" stroke-linecap="round" />
					<line x1="155" y1="138" x2="156" y2="132" stroke="#15171b" stroke-width="2.5" stroke-linecap="round" />
				</g>

				<!-- pinwheel beanie -->
				<g transform="rotate(-6 100 60)">
					<polygon points="100,38 51,73 74,55" fill="#3457c9" />
					<polygon points="100,38 74,55 100,50" fill="#e63946" />
					<polygon points="100,38 100,50 126,55" fill="#f4c22c" />
					<polygon points="100,38 126,55 149,73" fill="#2a9d55" />
					<path d="M51,73 Q100,96 149,73 L149,83 Q100,106 51,83 Z" fill="#1d3557" />
					<line x1="100" y1="38" x2="122" y2="10" stroke="#e63946" stroke-width="4" stroke-linecap="round" />
					<g class="pinwheel">
						<polygon points="122,10 132,1 132,10" fill="#e63946" />
						<polygon points="122,10 131,19 122,19" fill="#f4c22c" />
						<polygon points="122,10 112,19 112,10" fill="#e63946" />
						<polygon points="122,10 113,1 122,1" fill="#f4c22c" />
						<circle cx="122" cy="10" r="3" fill="#1d3557" />
					</g>
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
			width: min(42vw, 210px);
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
				transform-origin: 122px 10px;
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
