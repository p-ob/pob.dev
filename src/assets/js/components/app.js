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
          <a class="nav-item" href="/">Home</a>
          <a class="nav-item" href="/blog">Blog</a>
          <a class="nav-item" href="/about">About</a>
          <div class="contact-me-container">
            <button type="button" class="nav-item contact-me" popovertarget="contact-details">Contact</button>
            <ul id="contact-details" popover="" @toggle="${this.#onContactToggle}">
              <li>${this.#renderEmail()}</li>
              <li>${this.#renderExternalLink("GitHub", this.author.social.github)}</li>
              <li>${this.#renderExternalLink("Mastodon", this.author.social.mastodon)}</li>
              <li>${this.#renderExternalLink("LinkedIn", this.author.social.linkedIn)}</li>
              <li>${this.#renderExternalLink("Twitter", this.author.social.twitter)}</li>
            </ul>
          </div>
          <a class="search nav-item" href="/search">Search</a>
          <a class="feed nav-item" href="/feed">${feedIcon}</a>
        </nav>
      </header>
      <main part="main">
        <slot></slot>
      </main>
      <aside><slot name="sidebar"></slot></aside>
      <footer>
        <span class="footer-contact-me">${this.#renderEmail()}</span>
        ${this.#renderEditLink()}
        <small class="copyright"
          >&copy; <span class="hide-mobile">Copyright</span> ${this.currentYear}, ${this.author.name}</small
        >
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
    }
  `;
}

customElements.define("pob-app", AppElement);
