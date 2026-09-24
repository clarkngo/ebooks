const els = {
  brand: document.getElementById("brand"),
  tagline: document.getElementById("tagline"),
  root: document.getElementById("series-root"),
};

let catalog = null;

function openRead(book) {
  const url = book.readUrl || book.companion || book.file;
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function groupBySeries(books) {
  const order = [];
  const map = new Map();

  books.forEach((book) => {
    const key = book.series || "Other";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(book);
  });

  return order.map((series) => ({ series, books: map.get(series) }));
}

function seriesTone(series) {
  if (/lithoi|lithos/i.test(series)) return "tone-lithos";
  if (/ouroboros/i.test(series)) return "tone-ouroboros";
  return "tone-default";
}

function renderBookCard(book, index) {
  const article = document.createElement("article");
  article.className = "book-card";
  article.style.animationDelay = `${index * 70}ms`;

  const tags = [book.format, book.audience].filter(Boolean);
  const label = book.cta || "Read online";

  article.innerHTML = `
    <button type="button" class="book-cover-btn" aria-label="Read ${book.series ? `${book.series}: ${book.title}` : book.title} online">
      <span class="book-cover">
        <img src="${book.cover}" alt="" width="320" height="432" loading="lazy" />
      </span>
    </button>
    <div class="book-meta">
      <h3>${book.title}</h3>
      ${book.subtitle ? `<p class="subtitle">${book.subtitle}</p>` : ""}
      <p class="description">${book.description}</p>
      <div class="book-tags">
        ${tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <button type="button" class="btn btn-primary">${label}</button>
    </div>
  `;

  const coverImg = article.querySelector(".book-cover img");
  coverImg.alt = `Cover for ${book.series ? `${book.series} — ${book.title}` : book.title}`;

  article.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => openRead(book));
  });

  return article;
}

function renderBooks(books) {
  if (!books.length) {
    els.root.innerHTML = "<p class=\"loading\">No ebooks yet.</p>";
    return;
  }

  els.root.innerHTML = "";
  const groups = groupBySeries(books);
  let stagger = 0;

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = `series ${seriesTone(group.series)}`;
    section.setAttribute("aria-labelledby", `series-${group.series.replace(/\s+/g, "-").toLowerCase()}`);

    const head = document.createElement("div");
    head.className = "series-head";
    head.innerHTML = `
      <p class="series-kicker">Series</p>
      <h2 id="series-${group.series.replace(/\s+/g, "-").toLowerCase()}">${group.series}</h2>
    `;
    section.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "book-grid";

    group.books.forEach((book) => {
      grid.appendChild(renderBookCard(book, stagger));
      stagger += 1;
    });

    section.appendChild(grid);
    els.root.appendChild(section);
  });
}

async function init() {
  const response = await fetch("catalog.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load catalog.json");

  catalog = await response.json();

  if (catalog.brand?.name) {
    document.title = catalog.brand.name;
    els.brand.querySelector(".brand-name").textContent = catalog.brand.name;
  }

  if (catalog.brand?.tagline && els.tagline) {
    els.tagline.textContent = catalog.brand.tagline;
  }

  renderBooks(catalog.books || []);
}

init().catch((error) => {
  console.error(error);
  els.root.innerHTML =
    "<p class=\"loading\">Could not load the library. Check catalog.json.</p>";
});
