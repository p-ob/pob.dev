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

const mailIcon = svg`<svg
  viewBox="0 0 20 20"
  aria-hidden="true"
  style="width: 1rem; height: 1rem; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;"
>
  <rect x="2" y="4" width="16" height="12" rx="2"></rect>
  <path d="m3 5.5 7 5 7-5"></path>
</svg>`;

const externalLinkIcon = svg`<svg
  viewBox="0 0 20 20"
  aria-hidden="true"
  style="width: 1rem; height: 1rem; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;"
>
  <path d="M8 4H4v12h12v-4"></path>
  <path d="M11 3h6v6"></path>
  <path d="M9.5 10.5 17 3"></path>
</svg>`;

// Points left; flipped with `transform: scaleX(-1)` where a right-pointing chevron is needed.
const chevronIcon = svg`<svg
  viewBox="0 0 20 20"
  aria-hidden="true"
  style="width: 1.1rem; height: 1.1rem; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;"
>
  <path d="M12.5 4.5 6 10l6.5 5.5"></path>
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

	#mobileBreakpoint;
	#mobileView = "main";

	constructor() {
		super();
		this.currentYear = new Date().getFullYear();
		this.author = {};
	}

	#openMobileNav() {
		const dialog = this.shadowRoot.querySelector("#mobile-nav-dialog");
		document.body.style.overflow = "hidden";
		dialog?.showModal();
	}

	#closeMobileNav() {
		const dialog = this.shadowRoot.querySelector("#mobile-nav-dialog");
		dialog?.close();
	}

	#onDialogClose() {
		document.body.style.overflow = "";
		this.#setMobileView("main");
	}

	#showMobileContact() {
		this.#setMobileView("contact");
	}

	#showMobileMain() {
		this.#setMobileView("main");
	}

	// #mobileView is intentionally a true private field, not a Lit reactive
	// property: it's pure internal UI state, never part of the element's
	// public attribute API, so re-renders are requested manually here.
	#setMobileView(view) {
		if (this.#mobileView === view) {
			return;
		}
		this.#mobileView = view;
		this.requestUpdate();
	}

	// Sets the scroll lock when a `show-modal` command is invoked natively; the
	// browser runs its default action (opening the dialog) after this fires.
	#onDialogCommand(event) {
		if (event.command === "show-modal") {
			document.body.style.overflow = "hidden";
		}
	}

	#handleDialogClick(event) {
		// `closedby="any"` handles light-dismiss natively where supported.
		if ("closedBy" in HTMLDialogElement.prototype) {
			return;
		}
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
		this.#mobileBreakpoint = window.matchMedia("(width <= 768px)");
		this.#mobileBreakpoint.addEventListener("change", this.#handleBreakpointChange);
		if (!("commandForElement" in HTMLButtonElement.prototype)) {
			this.#installCommandFallback();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#mobileBreakpoint?.removeEventListener("change", this.#handleBreakpointChange);
	}

	#handleBreakpointChange = () => {
		this.#closeMobileNav();
	};

	// Fallback for browsers without the Invoker Commands API (e.g. Safari < 26.2):
	// the `command`/`commandfor` attributes on the nav buttons are otherwise inert.
	#installCommandFallback() {
		this.shadowRoot.addEventListener("click", (event) => {
			const invoker = event.composedPath().find((el) => el instanceof HTMLElement && el.hasAttribute("commandfor"));
			if (!invoker) {
				return;
			}
			const target = this.shadowRoot.getElementById(invoker.getAttribute("commandfor"));
			if (!(target instanceof HTMLDialogElement)) {
				return;
			}
			if (invoker.getAttribute("command") === "show-modal") {
				this.#openMobileNav();
			} else if (invoker.getAttribute("command") === "close") {
				this.#closeMobileNav();
			}
		});
	}

	#renderNavItems() {
		return NAV_ITEMS.map((item) => html`<a class="nav-item" href="${item.href}">${item.text}</a>`);
	}

	#renderContactRow(icon, label, href, external) {
		if (!href) {
			return nothing;
		}
		return html`<a
			class="contact-detail"
			href="${href}"
			target="${external ? "_blank" : nothing}"
			rel="${external ? "noreferrer" : nothing}"
			>${icon}<span>${label}</span></a
		>`;
	}

	#renderContactList() {
		return html`
			<li>
				${this.#renderContactRow(mailIcon, this.author.email, this.author.email && `mailto:${this.author.email}`)}
			</li>
			<li>${this.#renderContactRow(externalLinkIcon, "GitHub", this.author.social.github, true)}</li>
			<li>${this.#renderContactRow(externalLinkIcon, "Bluesky", this.author.social.bluesky, true)}</li>
		`;
	}

	#renderContactButton() {
		return html`<div class="contact-me-container">
			<button type="button" class="nav-item contact-me" popovertarget="contact-details">Contact</button>
			<ul id="contact-details" class="contact-details" popover="">
				${this.#renderContactList()}
			</ul>
		</div>`;
	}

	#renderMobileNavMain() {
		return html`
			<div class="mobile-nav-main mobile-nav-panel" data-panel="main">
				${this.#renderNavItems()}
				<button type="button" class="nav-item contact-me mobile-drill-trigger" @click="${this.#showMobileContact}">
					<span>Contact</span>${chevronIcon}
				</button>
			</div>
			<div class="mobile-nav-main mobile-nav-panel" data-panel="contact">
				<button type="button" class="mobile-nav-back" @click="${this.#showMobileMain}">
					${chevronIcon}<span>Contact</span>
				</button>
				<ul class="contact-details mobile-contact-details">
					${this.#renderContactList()}
				</ul>
			</div>
		`;
	}

	render() {
		return html` <div class="site-root">
			<header>
				<!-- Hamburger menu button (mobile only) -->
				<button
					type="button"
					class="hamburger-menu"
					command="show-modal"
					commandfor="mobile-nav-dialog"
					aria-label="Open menu"
				>
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
			<dialog
				id="mobile-nav-dialog"
				closedby="any"
				@command="${this.#onDialogCommand}"
				@click="${this.#handleDialogClick}"
				@close="${this.#onDialogClose}"
			>
				<div class="mobile-nav-content">
					<button
						type="button"
						class="close-button"
						command="close"
						commandfor="mobile-nav-dialog"
						aria-label="Close menu"
					>
						×
					</button>
					<nav class="mobile-nav" data-view="${this.#mobileView}">
						${this.#renderMobileNavMain()}
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
			anchor-name: --site-header;
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
		}

		/* Scoped to the desktop nav only: the mobile drill-in button shares
		   .contact-me for typography but must not share this anchor-name,
		   or anchor positioning could resolve to whichever is last in tree order. */
		.top-nav .contact-me {
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
			border: 1px solid var(--faded-color, hsl(0, 0%, 70%));
			border-radius: 0.375rem;
			padding: 0.375rem;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		.contact-details {
			list-style: none;
			margin: 0;
			min-width: 12rem;
		}

		.contact-details li {
			padding: 0;
		}

		.contact-detail {
			display: flex;
			align-items: center;
			gap: 0.625rem;
			padding: 0.5rem 0.625rem;
			border-radius: 0.25rem;
			font-weight: normal;
			font-size: 1rem;
			text-decoration: none;
			transition: background-color 0.15s ease;
		}

		.contact-detail svg {
			flex-shrink: 0;
			opacity: 0.6;
		}

		.contact-detail:hover,
		.contact-detail:focus-visible {
			opacity: 1;
			background-color: color-mix(in srgb, currentColor 8%, transparent);
		}

		.contact-me-container {
			position: relative;
			display: flex;
		}

		.nav-item {
			font-weight: bold;
			font-size: 1.25rem;
		}

		/* Flush with the header's bottom border rather than floating below it;
		   the top corners are squared off and the top border dropped so the
		   popover reads as an extension of the header, not a detached tooltip. */
		.contact-details:popover-open {
			display: flex;
			flex-direction: column;
			gap: 0.125rem;
			position: fixed;
			inset: unset;
			margin: 0;
			top: anchor(--site-header bottom);
			left: anchor(--contact-button left);
			border-top: none;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
		}

		@media (prefers-reduced-motion: no-preference) {
			[popover] {
				transition:
					opacity 0.15s ease,
					overlay 0.15s ease allow-discrete,
					display 0.15s ease allow-discrete;
				opacity: 0;
			}

			[popover]:popover-open {
				opacity: 1;
			}

			@starting-style {
				[popover]:popover-open {
					opacity: 0;
				}
			}
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
			/* Clip the x-axis: the panel slide animates translateX, which would
			   otherwise briefly show a horizontal scrollbar. overflow-y: auto with
			   an unset overflow-x computes overflow-x to auto, so set it explicitly. */
			overflow-x: hidden;
			overflow-y: auto;
			min-height: 0;
			scrollbar-width: thin;
			scrollbar-color: color-mix(in srgb, currentColor 30%, transparent) transparent;
		}

		.mobile-nav-main {
			flex-direction: column;
			gap: 1.5rem;
			flex: 0 0 auto;
		}

		.mobile-nav .nav-item {
			font-weight: bold;
			font-size: 1.25rem;
		}

		/* Both drawer panels always exist in the DOM; only the one matching
		   the nav's data-view is shown, so the swap can be an ordinary CSS
		   transition (including animating display) instead of hand-rolled JS. */
		.mobile-nav-panel {
			display: none;
		}

		.mobile-nav[data-view="main"] .mobile-nav-panel[data-panel="main"],
		.mobile-nav[data-view="contact"] .mobile-nav-panel[data-panel="contact"] {
			display: flex;
		}

		@media (prefers-reduced-motion: no-preference) {
			.mobile-nav-panel {
				transition:
					opacity 0.15s ease,
					transform 0.15s ease,
					display 0.15s ease allow-discrete,
					overlay 0.15s ease allow-discrete;
				opacity: 0;
				transform: translateX(0.75rem);
			}

			.mobile-nav[data-view="main"] .mobile-nav-panel[data-panel="main"],
			.mobile-nav[data-view="contact"] .mobile-nav-panel[data-panel="contact"] {
				opacity: 1;
				transform: translateX(0);
			}

			@starting-style {
				.mobile-nav[data-view="main"] .mobile-nav-panel[data-panel="main"],
				.mobile-nav[data-view="contact"] .mobile-nav-panel[data-panel="contact"] {
					opacity: 0;
					transform: translateX(0.75rem);
				}
			}
		}

		.mobile-drill-trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
		}

		.mobile-drill-trigger svg {
			opacity: 0.5;
			transform: scaleX(-1);
		}

		.mobile-nav-back {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			background: none;
			border: none;
			cursor: pointer;
			color: inherit;
			padding: 0;
			margin: 0 0 0.5rem;
			font-family: inherit;
			font-weight: bold;
			font-size: 1.25rem;
			transition: opacity 0.2s ease;
		}

		.mobile-nav-back:hover {
			opacity: 0.7;
		}

		.mobile-nav-back svg {
			opacity: 0.6;
		}

		.mobile-contact-details {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			min-width: 0;
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
			.contact-me,
			[popover] {
				transition: none !important;
			}
		}

		@media (width <= 1024px) {
			.hide-tablet {
				display: none;
			}
		}

		@media (width <= 768px) {
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

			/* Show mobile dialog on mobile, but only once opened */
			#mobile-nav-dialog[open] {
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

		/* When printing, drop the site chrome (header, sidebar, footer) so only
		   the page content reaches paper. The shell lives in this shadow root, so
		   a light-DOM print stylesheet can't reach it — it has to be handled here. */
		@media print {
			.site-root {
				display: block;
				min-height: 0;
			}

			header,
			aside,
			footer {
				display: none;
			}

			main {
				margin: 0;
			}

			:host([page-type="article"]) ::slotted(*:not([slot])) {
				max-width: none;
			}
		}
	`;
}

customElements.define("pob-app", AppElement);
