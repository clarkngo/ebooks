const els = {
  brand: document.getElementById("brand"),
  brandHero: document.getElementById("brand-hero"),
  tagline: document.getElementById("tagline"),
  grid: document.getElementById("book-grid"),
};

let catalog = null;

function fileName(path) {
  try {
    const cleaned = path.split("?")[0];
    return cleaned.split("/").pop() || "ebook";
  } catch {
    return "ebook";
  }
}

function isExternalUrl(path) {
  return /^https?:\/\//i.test(path);
}

function triggerDownload(book) {
  const link = document.createElement("a");
  link.href = book.file;
  link.rel = "noopener";
  if (isExternalUrl(book.file)) {
    link.target = "_blank";
  } else {
    link.download = fileName(book.file);
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderBooks(books) {
  if (!books.length) {
    els.grid.innerHTML = "<p class=\"loading\">No ebooks yet.</p>";
    return;
  }

  els.grid.innerHTML = "";

  books.forEach((book, index) => {
    const article = document.createElement("article");
    article.className = "book-card";
    article.style.animationDelay = `${index * 80}ms`;

    const tags = [book.format, book.audience].filter(Boolean);
    const label = book.cta || "Download";

    article.innerHTML = `
      <div class="book-cover">
        <img src="${book.cover}" alt="" width="320" height="432" loading="lazy" />
      </div>
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
    coverImg.alt = `Cover for ${book.title}`;

    article.querySelector("button").addEventListener("click", () => {
      triggerDownload(book);
    });

    els.grid.appendChild(article);
  });
}

async function init() {
  const response = await fetch("catalog.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load catalog.json");

  catalog = await response.json();

  if (catalog.brand?.name) {
    document.title = catalog.brand.name;
    els.brandHero.textContent = catalog.brand.name;
    els.brand.querySelector(".brand-name").textContent = catalog.brand.name;
  }

  if (catalog.brand?.tagline) {
    els.tagline.textContent = catalog.brand.tagline;
  }

  renderBooks(catalog.books || []);
}

init().catch((error) => {
  console.error(error);
  els.grid.innerHTML =
    "<p class=\"loading\">Could not load the library. Check catalog.json.</p>";
});
