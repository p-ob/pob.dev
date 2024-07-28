import { LitElement, html, css, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";

export class AppElement extends LitElement {
  static get properties() {
    return {
      currentYear: { type: Number, attribute: "current-year" },
      author: { type: Object },
      pageType: { type: String, attribute: "page-type" },
      repository: { type: String },
      source: { type: String },
      branch: { type: String },
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

  render() {
    return html` <div class="site-root">
      <header>
        <nav class="top-nav">
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
          <div class="contact-me-container">
            <button type="button" class="contact-me" popovertarget="contact-details">Contact</button>
            <ul id="contact-details" popover="" @toggle="${this.#onContactToggle}">
              <li>${this.#renderEmail()}</li>
              <li>${this.#renderExternalLink("GitHub", this.author.social.github)}</li>
              <li>${this.#renderExternalLink("Mastodon", this.author.social.mastodon)}</li>
              <li>${this.#renderExternalLink("LinkedIn", this.author.social.linkedIn)}</li>
              <li>${this.#renderExternalLink("Twitter", this.author.social.twitter)}</li>
            </ul>
          </div>
          <a class="search" href="/search">Search</a>
        </nav>
      </header>
      <main part="main">
        <slot></slot>
      </main>
      <aside><slot name="sidebar"></slot></aside>
      <footer>
        <span class="footer-contact-me">Contact: ${this.#renderEmail()}</span>
        ${this.#renderEditLink()}
        <small class="copyright">&copy; Copyright ${this.currentYear}, ${this.author.name}</small>
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
    return this.#renderExternalLink("Edit this page", editUrl, "edit-link");
  }

  /**
   * TODO: Remove this when CSS Anchor positioning is supported
   * @param {ToggleEvent} event
   */
  #onContactToggle(event) {
    if (event.newState === "open") {
      const popover = event.target;
      const boundingRect = this.#contactMeContainer.getBoundingClientRect();

      popover.style.top = `${boundingRect.top + boundingRect.height}px`;
      popover.style.left = `${boundingRect.left}px`;
    }
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

    @media (max-width: 768px) {
      .site-root {
        grid-template-areas:
          "header header header"
          "content content content"
          "footer footer footer";
      }

      aside {
        display: none;
      }

			.edit-link {
				display: none;
			}
    }

    :host([page-type="article"]) {
      ::slotted(*:not([slot])) {
        max-width: 800px;
      }
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

      * {
        padding-right: 1rem;
      }
    }

    .top-nav {
      display: flex;
      gap: 1rem;
    }

    a {
      color: inherit;
    }

    .contact-me {
      user-select: none;
      background: none;
      border: none;
      text-decoration: underline;
      cursor: pointer;
      color: inherit;
      padding: 0;
      margin: 0;
      font-size: inherit;
    }

    .search {
      margin-left: auto;
    }

    [popover] {
      background-color: var(--page-background-color);
      color: inherit;
    }

    .contact-me-container {
      position: relative;
    }

    #contact-details:popover-open {
      position: absolute;
      inset: unset;
			margin-top: 1rem;
    }
  `;
}

customElements.define("pob-app", AppElement);
