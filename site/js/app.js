const UNLOCK_KEY = "cityu-guides-unlocked";

const els = {
  brand: document.getElementById("brand"),
  brandHero: document.getElementById("brand-hero"),
  tagline: document.getElementById("tagline"),
  grid: document.getElementById("book-grid"),
  gate: document.getElementById("gate"),
  gateClose: document.getElementById("gate-close"),
  gateDone: document.getElementById("gate-done"),
  gateIntro: document.getElementById("gate-intro"),
  gateSuccess: document.getElementById("gate-success"),
  gateTitle: document.getElementById("gate-title"),
  gateSubtitle: document.getElementById("gate-subtitle"),
  gateBookTitle: document.getElementById("gate-book-title"),
  gateCover: document.getElementById("gate-cover"),
  gateForm: document.getElementById("gate-form"),
  gateExternal: document.getElementById("gate-external"),
  gateUnlockManual: document.getElementById("gate-unlock-manual"),
  gateDownload: document.getElementById("gate-download"),
};

let catalog = null;
let activeBook = null;
let formLoadCount = 0;

function isUnlocked() {
  return sessionStorage.getItem(UNLOCK_KEY) === "1";
}

function setUnlocked() {
  sessionStorage.setItem(UNLOCK_KEY, "1");
}

function fileName(path) {
  return path.split("/").pop() || "guide";
}

function renderBooks(books) {
  if (!books.length) {
    els.grid.innerHTML =
      '<p class="loading">No guides yet. Add entries to <code>catalog.json</code>.</p>';
    return;
  }

  els.grid.innerHTML = "";

  books.forEach((book, index) => {
    const article = document.createElement("article");
    article.className = "book-card";
    article.style.animationDelay = `${index * 80}ms`;

    const unlocked = isUnlocked();
    const tags = [book.format, book.audience].filter(Boolean);

    article.innerHTML = `
      <div class="book-cover">
        <img src="${book.cover}" alt="" loading="lazy" />
      </div>
      <div class="book-meta">
        <h3>${book.title}</h3>
        ${book.subtitle ? `<p class="subtitle">${book.subtitle}</p>` : ""}
        <p class="description">${book.description}</p>
        <div class="book-tags">
          ${tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <button class="btn btn-primary" type="button" data-book-id="${book.id}">
          ${unlocked ? "Download guide" : "Get free guide"}
        </button>
      </div>
    `;

    article.querySelector("button").addEventListener("click", () => {
      if (isUnlocked()) {
        triggerDownload(book);
      } else {
        openGate(book);
      }
    });

    els.grid.appendChild(article);
  });
}

function triggerDownload(book) {
  const link = document.createElement("a");
  link.href = book.file;
  link.download = fileName(book.file);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function showSuccess(book) {
  els.gateIntro.hidden = true;
  els.gateSuccess.hidden = false;
  els.gateDownload.href = book.file;
  els.gateDownload.setAttribute("download", fileName(book.file));
  els.gateDownload.textContent = `Download “${book.title}”`;
}

function resetGateView() {
  els.gateIntro.hidden = false;
  els.gateSuccess.hidden = true;
}

function openGate(book) {
  activeBook = book;
  resetGateView();

  els.gateTitle.textContent = catalog.gate.title;
  els.gateSubtitle.textContent = catalog.gate.subtitle;
  els.gateBookTitle.textContent = book.title;
  els.gateCover.src = book.cover;
  els.gateCover.alt = `Cover for ${book.title}`;
  els.gateExternal.href = catalog.gate.formShareUrl;

  formLoadCount = 0;
  const embedUrl = book.formEmbedUrl || catalog.gate.formEmbedUrl;
  // Cache-bust so reopening the modal reliably starts a fresh form load cycle.
  els.gateForm.src = `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;

  if (typeof els.gate.showModal === "function") {
    els.gate.showModal();
  } else {
    els.gate.setAttribute("open", "");
  }
}

function closeGate() {
  if (typeof els.gate.close === "function") {
    els.gate.close();
  } else {
    els.gate.removeAttribute("open");
  }
  els.gateForm.src = "about:blank";
  activeBook = null;
  renderBooks(catalog.books);
}

function unlockAndShowSuccess() {
  if (!activeBook) return;
  setUnlocked();
  showSuccess(activeBook);
}

els.gateForm.addEventListener("load", () => {
  // Google Forms: first load = form, second load ≈ confirmation after submit.
  formLoadCount += 1;
  if (formLoadCount >= 2 && activeBook) {
    unlockAndShowSuccess();
  }
});

els.gateUnlockManual.addEventListener("click", unlockAndShowSuccess);
els.gateClose.addEventListener("click", closeGate);
els.gateDone.addEventListener("click", closeGate);

els.gate.addEventListener("click", (event) => {
  if (event.target === els.gate) closeGate();
});

els.gate.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeGate();
});

async function init() {
  const response = await fetch("catalog.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load catalog.json");

  catalog = await response.json();

  if (catalog.brand?.name) {
    document.title = `${catalog.brand.name} — Free eBooks`;
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
    '<p class="loading">Could not load the library. Check <code>catalog.json</code>.</p>';
});
