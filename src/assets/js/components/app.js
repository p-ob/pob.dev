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

	constructor() {
		super();
		this.currentYear = new Date().getFullYear();
		this.author = {};
	}

	#openMobileNav() {
		const dialog = this.shadowRoot.querySelector("#mobile-nav-dialog");
		dialog?.showModal();
		document.body.style.overflow = "hidden";
	}

	#closeMobileNav() {
		const dialog = this.shadowRoot.querySelector("#mobile-nav-dialog");
		dialog?.close();
	}

	#onDialogClose() {
		document.body.style.overflow = "";
	}

	#handleDialogClick(event) {
		const dialog = event.target;
		const rect = dialog.getBoundingClientRect();
		const isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			this.#closeMobileNav();
		}
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener("resize", this.#handleResize.bind(this));
	}

	#handleResize() {
		this.#closeMobileNav();
	}

	#renderNavItems() {
		return NAV_ITEMS.map((item) => html`<a class="nav-item" href="${item.href}">${item.text}</a>`);
	}

	#renderContactButton() {
		return html`<div class="contact-me-container hide-mobile">
			<button type="button" class="nav-item contact-me" popovertarget="contact-details">Contact</button>
			<ul id="contact-details" popover="">
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
					${this.#renderNavItems()} ${this.#renderContactButton()}
					<a class="search nav-item" href="/search">Search</a>
					<a class="feed nav-item" href="/feed">${feedIcon}</a>
				</nav>
			</header>

			<!-- Mobile navigation dialog -->
			<dialog id="mobile-nav-dialog" @click="${this.#handleDialogClick}" @close="${this.#onDialogClose}">
				<div class="mobile-nav-content">
					<button type="button" class="close-button" @click="${this.#closeMobileNav}" aria-label="Close menu">×</button>
					<nav class="mobile-nav">
						<div class="mobile-nav-main">${this.#renderNavItems()} ${this.#renderContactButton()}</div>
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
					&copy; <span class="hide-tablet">Copyright</span> ${this.currentYear}, ${this.author.name}
					${this.commitSha ? html` | commit ${this.#renderCommitLink()}` : ""}
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
		const editUrl = new URL(this.source, `${this.repository}edit/${this.branch}/`);
		return this.#renderExternalLink("Edit this page", editUrl, "hide-tablet");
	}

	#renderCommitLink() {
		const commitUrl = new URL(this.source, `${this.repository}blob/${this.commitSha}/`);
		return html`<a class="external" target="_blank" rel="noreferrer" href="${commitUrl.href}"
			><code>${this.commitSha.slice(0, 7)}</code></a
		>`;
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
			transition: opacity 0.2s ease;
		}

		.hamburger-menu:hover {
			opacity: 0.7;
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
			min-height: 100dvh;
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
			position: relative;

			.footer-contact-me {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;
				margin-right: 1rem;
			}

			.copyright {
				position: absolute;
				right: 2rem;
			}
		}

		.top-nav {
			display: flex;
			gap: 1rem;
		}

		a {
			color: inherit;
			text-decoration: none;
			transition: opacity 0.2s ease;
		}

		a:hover {
			opacity: 0.7;
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
			transition: opacity 0.2s ease;
			anchor-name: --contact-button;
		}

		.contact-me:hover {
			opacity: 0.7;
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
			border: 1px solid var(--faded-color);
			border-radius: 0.5rem;
			padding: 0.5rem 0;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		#contact-details {
			list-style: none;
			margin: 0;
		}

		#contact-details li {
			padding: 0.375rem 1rem;
		}

		#contact-details a {
			font-weight: normal;
			font-size: 1rem;
			text-decoration: none;
		}

		#contact-details a:hover {
			opacity: 1;
			text-decoration: underline;
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
			inset: unset;
			margin: 0;
			position-anchor: --contact-button;
			position-area: bottom span-right;
			margin-top: 0.5rem;
		}

		/* Mobile navigation dialog */
		#mobile-nav-dialog {
			display: none; /* Hidden on desktop */
			border: none;
			padding: 0;
			max-width: 75vw;
			width: 75vw;
			height: 100dvh;
			max-height: 100dvh;
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
				transition:
					transform 0.3s ease-out,
					overlay 0.3s ease-out allow-discrete,
					display 0.3s ease-out allow-discrete;
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
			transition: opacity 0.2s ease;
		}

		.close-button:hover {
			opacity: 0.7;
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

		/* Respect reduced motion preferences */
		@media (prefers-reduced-motion: reduce) {
			a,
			button,
			.hamburger-menu,
			.close-button,
			.contact-me {
				transition: none !important;
			}
		}

		@media (width <= 1024px) {
			.hide-tablet {
				display: none;
			}
		}

		@media (width <= 768px) {
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

			/* Mobile footer adjustments */
			footer {
				flex-direction: column;
				gap: 0.5rem;
				padding: 1rem;

				.copyright {
					position: static;
					text-align: center;
				}

				.footer-contact-me {
					display: none;
				}
			}
		}
	`;
}

customElements.define("pob-app", AppElement);
