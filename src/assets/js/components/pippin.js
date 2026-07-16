import { LitElement, html, css } from "lit";

const AUTO_DISMISS_MS = 7000;
const EXIT_DURATION_MS = 650;
const DESTINATION = "/pippin/";
const SPRITE_SRC = "/assets/img/pippin-sprite.png";
const PINWHEEL_SRC = "/assets/img/pippin-pinwheel.png";

// Easter egg summoned by search.njk when someone searches "Pippin": a
// Duck Hunt-inspired illustration of a laughing Bernese Mountain Dog
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

	// position: fixed anchors to the layout viewport, which most mobile
	// browsers don't shrink when the on-screen keyboard opens -- only the
	// visual viewport shrinks. Without this, "bottom: 0" ends up behind the
	// keyboard instead of just above it. The visualViewport API reports the
	// actually-visible area, so track how much of the layout viewport it
	// currently obscures and feed that back in as extra bottom offset.
	#syncKeyboardInset = () => {
		const viewport = window.visualViewport;
		if (!viewport) {
			return;
		}
		const inset = Math.max(0, window.innerHeight - (viewport.height + viewport.offsetTop));
		this.style.setProperty("--pippin-keyboard-inset", `${inset}px`);
	};

	constructor() {
		super();
		this._state = "shown";
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener("keydown", this.#handleKeydown);
		this.#dismissTimer = setTimeout(() => this.#dismiss(), AUTO_DISMISS_MS);
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", this.#syncKeyboardInset);
			window.visualViewport.addEventListener("scroll", this.#syncKeyboardInset);
			this.#syncKeyboardInset();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener("keydown", this.#handleKeydown);
		clearTimeout(this.#dismissTimer);
		if (window.visualViewport) {
			window.visualViewport.removeEventListener("resize", this.#syncKeyboardInset);
			window.visualViewport.removeEventListener("scroll", this.#syncKeyboardInset);
		}
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
			<a href="${DESTINATION}" aria-label="It's Pippin! Click to see his puppy photo.">
				<span class="sprite">
					<img src="${SPRITE_SRC}" alt="" width="380" height="383" />
					<img class="pinwheel" src="${PINWHEEL_SRC}" alt="" width="89" height="64" />
				</span>
			</a>
		`;
	}

	static styles = css`
		:host {
			position: fixed;
			left: 50%;
			bottom: calc(max(1rem, env(safe-area-inset-bottom)) + var(--pippin-keyboard-inset, 0px));
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

		.sprite {
			display: block;
			position: relative;
		}

		.sprite > img:first-child {
			display: block;
			width: 100%;
			height: auto;
		}

		.pinwheel {
			position: absolute;
			left: 38.158%;
			top: 0;
			width: 23.421%;
			height: 16.71%;
			transform-origin: 49% 52%;
		}

		@media (prefers-reduced-motion: no-preference) {
			:host([data-state="shown"]) {
				animation:
					pippin-enter 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
					pippin-bob 3.4s ease-in-out 0.9s infinite;
			}

			:host([data-state="leaving"]) {
				animation: pippin-exit 0.6s ease-in forwards;
			}

			.pinwheel {
				animation: pippin-spin 1.1s linear infinite;
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

		/* A quick shake (a "giggle") at the start of each loop, then a smooth
		   rise-and-settle bob for the rest of the cycle. */
		@keyframes pippin-bob {
			0%,
			100% {
				transform: translate(-50%, 0) rotate(-1.5deg);
			}
			4% {
				transform: translate(-50%, 0) rotate(5deg);
			}
			8% {
				transform: translate(-50%, 0) rotate(-5deg);
			}
			12% {
				transform: translate(-50%, 0) rotate(4deg);
			}
			16% {
				transform: translate(-50%, 0) rotate(-2deg);
			}
			20% {
				transform: translate(-50%, -2px) rotate(0deg);
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
