// SPA Application Router & Core View Controller

class App {
  constructor() {
    this.currentView = "dashboard";
    this.currentParams = null;
    this.theme = localStorage.getItem("family_ledger_theme") || "light";
    this.init();
  }

  init() {
    // Apply initial theme
    document.documentElement.setAttribute("data-theme", this.theme);
    this.updateThemeButtonIcon();

    // Bind navigation actions
    document.querySelectorAll(".nav-item, .bottom-nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const view = item.getAttribute("data-view");
        if (view) {
          this.navigateTo(view);
        }
      });
    });

    // Language selector change
    const langSelect = document.getElementById("lang-select");
    langSelect.value = getLanguage();
    langSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
      this.translateStaticUI();
      this.renderCurrentView();
    });

    // Theme Toggle action
    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.toggleTheme();
    });

    // Modal Close operations
    document.getElementById("modal-close-btn").addEventListener("click", () => {
      this.closeModal();
    });
    document.getElementById("global-modal").addEventListener("click", (e) => {
      if (e.target.id === "global-modal") {
        this.closeModal();
      }
    });

    // Universal Smart Search setup
    this.setupUniversalSearch();

    // Initial translation and routing
    this.translateStaticUI();
    this.navigateTo("dashboard");
  }

  // Translate static labels in sidebar, headers, and footer
  translateStaticUI() {
    const lang = getLanguage();
    document.title = t("aboutLedger");
    document.getElementById("global-search").placeholder = t("searchPlaceholder");

    // Loop through elements marked with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        el.textContent = t(key);
      }
    });
  }

  // Routing navigation
  navigateTo(view, params = null) {
    this.currentView = view;
    this.currentParams = params;

    // Update active nav styles (both desktop sidebar and mobile bottom-nav)
    document.querySelectorAll(".nav-item, .bottom-nav-item").forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-view") === view) {
        item.classList.add("active");
      }
    });

    this.renderCurrentView();
  }

  // Re-render active view in page container
  renderCurrentView() {
    const container = document.getElementById("app-view");
    const titleEl = document.getElementById("rendered-title");
    const subtitleEl = document.getElementById("rendered-subtitle");

    // Close any open search popovers or modal states
    this.hideSearchResults();

    switch (this.currentView) {
      case "dashboard":
        titleEl.textContent = t("dashboard");
        subtitleEl.textContent = t("page-subtitle", { defaultValue: "Quick view of your family ties and ledgers" });
        dashboardView.render(container);
        break;
      case "people":
        titleEl.textContent = t("people");
        subtitleEl.textContent = t("peopleList");
        peopleView.render(container);
        break;
      case "personProfile":
        const personId = this.currentParams?.id;
        const person = db.people.find(personId);
        titleEl.textContent = person ? person.fullName : t("people");
        subtitleEl.textContent = t("relationshipHistory");
        personProfileView.render(container, personId);
        break;
      case "events":
        if (this.currentParams?.id) {
          const ev = db.events.find(this.currentParams.id);
          titleEl.textContent = ev ? ev.name : t("events");
          subtitleEl.textContent = t("eventDashboard");
          eventsView.renderDashboard(container, this.currentParams.id);
        } else {
          titleEl.textContent = t("events");
          subtitleEl.textContent = t("eventManagement");
          eventsView.render(container);
        }
        break;
      case "expenses":
        titleEl.textContent = t("expenses");
        subtitleEl.textContent = t("noExpensesFound"); // fallback subtitle
        expensesView.render(container);
        break;
      case "giftsReceived":
        titleEl.textContent = t("giftsReceived");
        subtitleEl.textContent = t("noGiftsFound");
        giftsView.render(container, "received");
        break;
      case "giftsGiven":
        titleEl.textContent = t("giftsGiven");
        subtitleEl.textContent = t("noGiftsFound");
        giftsView.render(container, "given");
        break;
      case "reports":
        titleEl.textContent = t("reports");
        subtitleEl.textContent = t("reportsDashboard");
        reportsView.render(container);
        break;
      case "settings":
        titleEl.textContent = t("settings");
        subtitleEl.textContent = t("appSettings");
        settingsView.render(container);
        break;
      default:
        container.innerHTML = `<h2>View "${this.currentView}" not implemented.</h2>`;
    }
  }

  // Universal Smart Search UI logic
  setupUniversalSearch() {
    const searchInput = document.getElementById("global-search");
    const resultsOverlay = document.getElementById("search-results");

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      if (!q) {
        this.hideSearchResults();
        return;
      }

      const results = db.universalSearch(q);
      this.renderSearchResults(results, resultsOverlay);
    });

    // Close results when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        this.hideSearchResults();
      }
    });
  }

  renderSearchResults(results, container) {
    const hasResults = Object.values(results).some(arr => arr.length > 0);
    if (!hasResults) {
      container.innerHTML = `<div style="padding: 10px; color: var(--text-muted); font-size: 0.9rem;">No matches found.</div>`;
      container.classList.add("active");
      return;
    }

    let html = "";

    // People matches
    if (results.people.length > 0) {
      html += `<div class="search-result-group">
        <div class="search-result-group-title">${t("people")}</div>`;
      results.people.forEach(p => {
        html += `<div class="search-result-item" data-action="person" data-id="${p.id}">
          <div class="search-result-item-name">${p.fullName}</div>
          <div class="search-result-item-desc">${t(p.relation)} • ${p.city}</div>
        </div>`;
      });
      html += `</div>`;
    }

    // Events matches
    if (results.events.length > 0) {
      html += `<div class="search-result-group">
        <div class="search-result-group-title">${t("events")}</div>`;
      results.events.forEach(e => {
        html += `<div class="search-result-item" data-action="event" data-id="${e.id}">
          <div class="search-result-item-name">${e.name}</div>
          <div class="search-result-item-desc">${t(e.type)} • ${e.date}</div>
        </div>`;
      });
      html += `</div>`;
    }

    // Gifts Received matches
    if (results.giftsReceived.length > 0) {
      html += `<div class="search-result-group">
        <div class="search-result-group-title">${t("giftsReceived")}</div>`;
      results.giftsReceived.forEach(g => {
        const p = db.people.find(g.personId);
        html += `<div class="search-result-item" data-action="giftsReceived">
          <div class="search-result-item-name">${g.giftName} (₹${g.estimatedValue})</div>
          <div class="search-result-item-desc">${p ? p.fullName : ""} • ${g.occasion}</div>
        </div>`;
      });
      html += `</div>`;
    }

    // Gifts Given matches
    if (results.giftsGiven.length > 0) {
      html += `<div class="search-result-group">
        <div class="search-result-group-title">${t("giftsGiven")}</div>`;
      results.giftsGiven.forEach(g => {
        const p = db.people.find(g.personId);
        html += `<div class="search-result-item" data-action="giftsGiven">
          <div class="search-result-item-name">${g.giftName} (₹${g.estimatedValue})</div>
          <div class="search-result-item-desc">${p ? p.fullName : ""} • ${g.occasion}</div>
        </div>`;
      });
      html += `</div>`;
    }

    // Expenses matches
    if (results.expenses.length > 0) {
      html += `<div class="search-result-group">
        <div class="search-result-group-title">${t("expenses")}</div>`;
      results.expenses.forEach(ex => {
        html += `<div class="search-result-item" data-action="expenses">
          <div class="search-result-item-name">${t(ex.category)} • ₹${ex.amount}</div>
          <div class="search-result-item-desc">${ex.description || ex.vendor}</div>
        </div>`;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
    container.classList.add("active");

    // Bind click events on search results
    container.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        const action = item.getAttribute("data-action");
        const id = item.getAttribute("data-id");
        this.hideSearchResults();
        document.getElementById("global-search").value = "";

        if (action === "person") {
          this.navigateTo("personProfile", { id });
        } else if (action === "event") {
          this.navigateTo("events", { id });
        } else {
          this.navigateTo(action);
        }
      });
    });
  }

  hideSearchResults() {
    document.getElementById("search-results").classList.remove("active");
  }

  // Theme Management
  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("family_ledger_theme", this.theme);
    this.updateThemeButtonIcon();
  }

  updateThemeButtonIcon() {
    const btn = document.getElementById("theme-toggle");
    if (this.theme === "dark") {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>`;
    } else {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>`;
    }
  }

  // Global Modal System wrapper
  showModal(title, contentHtml, onSaveCallback = null, onCancelCallback = null) {
    const modal = document.getElementById("global-modal");
    document.getElementById("modal-title").textContent = title;
    
    const contentContainer = document.getElementById("modal-content");
    contentContainer.innerHTML = contentHtml;
    
    modal.classList.add("active");
    
    // Store active cancel callback
    this.activeModalCancelCallback = onCancelCallback;
    
    const form = contentContainer.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (onSaveCallback) {
          const success = onSaveCallback(new FormData(form));
          if (success !== false) {
            this.activeModalCancelCallback = null; // Prevent cancel trigger
            this.closeModal();
          }
        }
      });

      const cancelBtn = form.querySelector("[data-action='cancel']");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.closeModal();
        });
      }
    }
  }

  closeModal() {
    document.getElementById("global-modal").classList.remove("active");
    document.getElementById("modal-content").innerHTML = "";
    if (this.activeModalCancelCallback) {
      const cb = this.activeModalCancelCallback;
      this.activeModalCancelCallback = null;
      cb();
    }
  }
}

// Instantiate and bind to window
window.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});

// Helper wrapper for layout rendering navigation
window.navigateToView = (view, params = null) => {
  if (window.app) {
    window.app.navigateTo(view, params);
  }
};
