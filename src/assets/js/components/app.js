import { LitElement, html, css, svg, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";

const feedIcon = svg`<svg
  viewBox="0 0 25 25"
  aria-label="RSS feed"
  style="width: 1rem; aspect-ratio: 1/1; fill: var(--color-text);"
>
  <path d="M3.7 17.5a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z"></path>
  <path
    d="M.4 8.1c-.2 0-.4.2-.4.4v4.7c0 .2.2.4.4.4 6 0 10.9 4.9 10.9 11 0 .1.2.3.4.3h4.7c.2 0 .4-.2.4-.4v-.1C16.7 15.4 9.4 8.1.4 8.1z"
  ></path>
  <path
    d="M24.9 24.4C24.9 10.9 13.9 0 .4 0 .2 0 0 .2 0 .4v4.8c0 .2.2.4.4.4a19 19 0 0 1 18.9 19c0 .1.2.3.4.3h4.8c.2 0 .4-.2.4-.4v-.1z"
  ></path>
</svg>`;

const hamburgerIcon = svg`<svg
  viewBox="0 0 24 24"
  aria-label="Menu"
  style="width: 1.5rem; height: 1.5rem; fill: var(--font-color);"
>
  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
</svg>`;

// Navigation items configuration
const NAV_ITEMS = [
	{ text: "Home", href: "/" },
	{ text: "Blog", href: "/blog" },
	{ text: "Reading", href: "/reading" },
	{ text: "About", href: "/about" },
];

export class AppElement extends LitElement {
	static get properties() {
		return {
			currentYear: { type: Number, attribute: "current-year" },
			author: { type: Object },
			pageType: { type: String, attribute: "page-type" },
			repository: { type: String },
			source: { type: String },
			branch: { type: String },
			commitSha: { type: String, attribute: "commit-sha" },
		};
	}

	get #contactMeContainer() {
		return this.shadowRoot.querySelector(".contact-me-container");
	}

	constructor() {
		super();
		this.currentYear = new Date().getFullYear();
		this.author = {};
	}

	#openMobileNav() {
		const dialog = this.shadowRoot.querySelector("#mobile-nav-dialog");
		dialog?.showModal();
	}

	#closeMobileNav() {
		const dialog = this.shadowRoot.querySelector("#mobile-nav-dialog");
		dialog?.close();
	}

	#handleDialogClick(event) {
		const dialog = event.target;
		const rect = dialog.getBoundingClientRect();
		const isInDialog = (
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width
		);
		if (!isInDialog) {
			this.#closeMobileNav();
		}
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener("resize", this.#handleResize.bind(this));
		window.addEventListener("scroll", this.#setPopoverPosition.bind(this));

		// init
		this.#setPopoverPosition();
	}

	#handleResize() {
		this.#setPopoverPosition();
		this.#closeMobileNav();
	}

	#renderNavItems() {
		return NAV_ITEMS.map(
			(item) => html`<a class="nav-item" href="${item.href}">${item.text}</a>`
		);
	}

	#renderContactButton() {
		return html`<div class="contact-me-container hide-mobile">
			<button type="button" class="nav-item contact-me" popovertarget="contact-details">Contact</button>
			<ul id="contact-details" popover="" @toggle="${this.#onContactToggle}">
				<li>${this.#renderEmail()}</li>
				<li>${this.#renderExternalLink("GitHub", this.author.social.github)}</li>
				<li>${this.#renderExternalLink("Bluesky", this.author.social.bluesky)}</li>
			</ul>
		</div>`;
	}

	render() {
		return html` <div class="site-root">
			<header>
				<!-- Hamburger menu button (mobile only) -->
				<button type="button" class="hamburger-menu" @click="${this.#openMobileNav}" aria-label="Open menu">
					${hamburgerIcon}
				</button>

				<!-- Desktop navigation -->
				<nav class="top-nav">
					${this.#renderNavItems()}
					${this.#renderContactButton()}
					<a class="search nav-item" href="/search">Search</a>
					<a class="feed nav-item" href="/feed">${feedIcon}</a>
				</nav>
			</header>

			<!-- Mobile navigation dialog -->
			<dialog id="mobile-nav-dialog" @click="${this.#handleDialogClick}">
				<div class="mobile-nav-content">
					<button type="button" class="close-button" @click="${this.#closeMobileNav}" aria-label="Close menu">
						×
					</button>
					<nav class="mobile-nav">
						<div class="mobile-nav-main">
							${this.#renderNavItems()}
							${this.#renderContactButton()}
						</div>
						<div class="mobile-nav-footer">
							<hr class="nav-divider" />
							<a class="nav-item" href="/search">Search</a>
							<a class="nav-item" href="/feed">RSS Feed</a>
						</div>
					</nav>
				</div>
			</dialog>

			<main part="main">
				<slot></slot>
			</main>
			<aside><slot name="sidebar"></slot></aside>
			<footer>
				<span class="footer-contact-me">${this.#renderEmail()}</span>
				${this.#renderEditLink()}
				<small class="copyright">
					&copy; <span class="hide-mobile">Copyright</span> ${this.currentYear}, ${this.author.name}
					${this.commitSha ? html` | commit <code>${this.commitSha.slice(0, 7)}</code>` : ""}
				</small>
			</footer>
		</div>`;
	}

	#renderExternalLink(text, url, classlist) {
		classlist ??= "";
		const classes = {};
		for (const className of classlist.split(" ")) {
			classes[className] = true;
		}
		return html` <a class="external ${classMap(classes)}" target="_blank" rel="noreferrer" href="${url}">${text}</a> `;
	}

	#renderEmail() {
		const email = this.author.email;
		if (!email) {
			return nothing;
		}

		return html`<a href="mailto:${email}">${email}</a>`;
	}

	#renderEditLink() {
		const editUrl = new URL(this.source, `${this.repository}/edit/${this.branch}/`);
		return this.#renderExternalLink("Edit this page", editUrl, "hide-mobile");
	}

	/**
	 * TODO: Remove this when CSS Anchor positioning is supported
	 * @param {ToggleEvent} event
	 */
	#onContactToggle(event) {
		if (event.newState === "open") {
			this.#setPopoverPosition();
		}
	}

	#setPopoverPosition() {
		const popover = this.shadowRoot.querySelector("#contact-details");
		const boundingRect = this.#contactMeContainer.getBoundingClientRect();

		const top = boundingRect.top + boundingRect.height + window.scrollY;

		popover.style.top = `${top}px`;
		popover.style.left = `${boundingRect.left}px`;
	}

	static styles = css`
		:host([no-sidebar]) {
			.site-root {
				grid-template-areas:
					"header header header"
					"content content content"
					"footer footer footer";
			}

			aside {
				display: none;
			}
		}

		/* Hamburger menu - hidden on desktop, visible on mobile */
		.hamburger-menu {
			display: none;
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
			color: inherit;
		}

		::slotted(*:not([slot])) {
			width: 100%;
		}

		:host([page-type="article"]) {
			::slotted(*:not([slot])) {
				max-width: 100ch;
			}
		}

		* {
			font-family: inherit;
		}

		.site-root {
			display: grid;
			grid-template-areas:
				"header header header"
				"content content side"
				"footer footer footer";

			grid-template-columns: 20vw 1fr 20vw;
			grid-template-rows: auto 1fr auto;
			grid-gap: 10px;
			min-height: 100vh;
		}

		header {
			grid-area: header;
			padding: 1rem 2rem;
			position: sticky;
			top: 0;
			z-index: 999;
			background: var(--page-background-color);
			border-bottom: 1px solid var(--font-color);
		}

		main {
			grid-area: content;
			margin: 0 10vw;
			display: flex;
			justify-content: center;
		}

		aside {
			grid-area: side;
		}

		footer {
			grid-area: footer;
			display: flex;
			justify-content: center;
			align-items: center;

			.footer-contact-me,
			.copyright {
				margin-left: auto;
			}

			.footer-contact-me {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;
			}

			> * {
				padding-right: 1rem;
			}
		}

		.top-nav {
			display: flex;
			gap: 1rem;
		}

		a {
			color: inherit;
			text-decoration: none;
		}

		.contact-me {
			user-select: none;
			background: none;
			border: none;
			cursor: pointer;
			color: inherit;
			padding: 0;
			margin: 0;
			font-size: inherit;
		}

		.search {
			margin-left: auto;
		}

		.feed {
			fill: var(--font-color);
		}

		[popover] {
			background-color: var(--page-background-color);
			color: inherit;
		}

		.contact-me-container {
			position: relative;
			display: flex;
		}

		.nav-item {
			font-weight: bold;
			font-size: 1.25rem;
		}

		#contact-details:popover-open {
			position: absolute;
			inset: unset;
			margin-top: 1rem;
		}

		/* Mobile navigation dialog */
		#mobile-nav-dialog {
			display: none; /* Hidden on desktop */
			border: none;
			padding: 0;
			max-width: 75vw;
			width: 75vw;
			height: 100vh;
			max-height: 100vh;
			margin: 0;
			left: 0;
			top: 0;
			background-color: var(--page-background-color);
			color: inherit;
			box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
		}

		#mobile-nav-dialog::backdrop {
			background-color: rgba(0, 0, 0, 0.5);
		}

		@media (prefers-reduced-motion: no-preference) {
			#mobile-nav-dialog {
				transition: transform 0.3s ease-out, overlay 0.3s ease-out allow-discrete, display 0.3s ease-out allow-discrete;
				transform: translateX(-100%);
			}

			#mobile-nav-dialog[open] {
				transform: translateX(0);
			}

			@starting-style {
				#mobile-nav-dialog[open] {
					transform: translateX(-100%);
				}
			}
		}

		.mobile-nav-content {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: hidden;
			box-sizing: border-box;
			padding: 1rem;
		}

		.close-button {
			align-self: flex-end;
			background: none;
			border: none;
			font-size: 2rem;
			cursor: pointer;
			color: inherit;
			padding: 0;
			margin: 0;
			margin-bottom: 0.5rem;
			line-height: 1;
			flex-shrink: 0;
		}

		.mobile-nav {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow-y: auto;
			min-height: 0;
		}

		.mobile-nav-main {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			flex: 0 0 auto;
		}

		.mobile-nav .nav-item {
			font-weight: bold;
			font-size: 1.25rem;
		}

		.mobile-nav .contact-me-container {
			position: relative;
		}

		.mobile-nav-footer {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding-top: 1rem;
			margin-top: auto;
		}

		.mobile-nav-footer .nav-item {
			font-weight: bold;
			font-size: 1.25rem;
		}

		.nav-divider {
			border: none;
			border-top: 1px solid var(--font-color);
			opacity: 0.3;
			margin: 0;
		}

		@media (max-width: 768px) {
			.hide-mobile {
				display: none;
			}

			.site-root {
				grid-template-areas:
					"header header header"
					"content content content"
					"footer footer footer";
			}

			aside {
				display: none;
			}

			.nav-item {
				font-size: 1rem;
				font-weight: normal;
			}

			/* Show hamburger menu on mobile */
			.hamburger-menu {
				display: block;
			}

			/* Hide desktop navigation on mobile */
			.top-nav {
				display: none;
			}

			/* Show mobile dialog on mobile */
			#mobile-nav-dialog {
				display: block;
			}
		}
	`;
}

customElements.define("pob-app", AppElement);
