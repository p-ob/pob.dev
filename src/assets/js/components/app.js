import { LitElement, html, css, svg, nothing } from "lit";

const externalLinkIcon = svg`
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
    <path
      d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"
    ></path>
  </svg>
`;

export class AppElement extends LitElement {
  static get properties() {
    return {
      currentYear: { type: Number, attribute: "current-year" },
      author: { type: Object },
      pageType: { type: String, attribute: "page-type" },
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
            <button type="button" class="contact-me" popovertarget="contact-details">My links</button>
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
        <small class="copyright">&copy; Copyright ${this.currentYear}, ${this.author.name}</small>
      </footer>
    </div>`;
  }

  #renderExternalLink(name, url) {
    return html` <a class="external" target="_blank" rel="noreferrer" href="${url}">${name}${externalLinkIcon}</a> `;
  }

  #renderEmail() {
    const email = this.author.email;
    if (!email) {
      return nothing;
    }

    return html`<a href="mailto:${email}">${email}</a>`;
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

    :host([page-type="article"]) {
      ::slotted(*:not([slot])) {
        max-width: 800px;
				margin: 0 10vw;
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

      height: 100vh;
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
        gap: 1rem;
      }
    }

    .top-nav {
      display: flex;
      gap: 1rem;
    }

    a {
      color: inherit;
    }

    a.external svg {
      fill: currentColor;
      width: 1rem;
      height: 1rem;
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
      background-color: var(--page-background-color);;
      color: inherit;
    }

    .contact-me-container {
      position: relative;
    }

    #contact-details:popover-open {
      position: absolute;
      inset: unset;
    }
  `;
}

customElements.define("pob-app", AppElement);
