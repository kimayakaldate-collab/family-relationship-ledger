// People View Controller (Master People Directory & dynamic Family Groups)
const peopleView = {
  render(container) {
    const families = db.families.all();
    const relations = [
      "Father", "Mother", "Brother", "Sister", "Husband", "Wife", "Son", "Daughter",
      "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother", "Friend", "Relative", "OtherRelation"
    ];

    // Collect unique cities
    const cities = [...new Set(db.people.all().map(p => p.city).filter(Boolean))];

    container.innerHTML = `
      <div class="view-wrapper">
        <!-- SUB TAB NAVIGATION (ALL PEOPLE vs FAMILIES) -->
        <div class="tabs-header" style="margin-bottom: 24px;">
          <button class="tab-btn active" id="people-tab-all">👥 ${t("peopleList")}</button>
          <button class="tab-btn" id="people-tab-families">👨‍👩‍👧‍👦 ${t("familyManagement")}</button>
        </div>

        <!-- PEOPLE DIRECTORY VIEW SECTION -->
        <div id="people-list-view">
          <!-- FILTER & ACTION BAR -->
          <div class="filter-bar">
            <input type="text" id="p-search" placeholder="${t("searchPerson")}">
            
            <select id="p-filter-relation">
              <option value="">${t("filterRelation")}</option>
              ${relations.map(r => `<option value="${r}">${t(r)}</option>`).join("")}
            </select>
            
            <select id="p-filter-family">
              <option value="">${t("filterFamily")}</option>
              ${families.map(f => `<option value="${f.id}">${f.name}</option>`).join("")}
            </select>
            
            <select id="p-filter-city">
              <option value="">${t("filterCity")}</option>
              ${cities.map(c => `<option value="${c}">${c}</option>`).join("")}
            </select>

            <button class="btn-primary" id="p-add-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              ${t("addPerson")}
            </button>
            
            <button class="btn-secondary" id="p-merge-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              ${t("mergeDuplicates")}
            </button>
          </div>

          <!-- PEOPLE LIST GRID -->
          <div class="people-grid" id="people-list-grid">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- FAMILY GROUPS VIEW SECTION -->
        <div id="people-families-view" style="display: none;">
          <div class="people-grid" id="people-families-grid">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    const gridContainer = document.getElementById("people-list-grid");
    const familiesGrid = document.getElementById("people-families-grid");
    
    this.filterAndRender(gridContainer);

    // Bind sub-tab clicks
    const tabAll = document.getElementById("people-tab-all");
    const tabFamilies = document.getElementById("people-tab-families");
    const listView = document.getElementById("people-list-view");
    const familiesView = document.getElementById("people-families-view");

    tabAll.addEventListener("click", () => {
      tabAll.classList.add("active");
      tabFamilies.classList.remove("active");
      listView.style.display = "block";
      familiesView.style.display = "none";
      this.filterAndRender(gridContainer);
    });

    tabFamilies.addEventListener("click", () => {
      tabFamilies.classList.add("active");
      tabAll.classList.remove("active");
      listView.style.display = "none";
      familiesView.style.display = "block";
      this.renderFamiliesGrid(familiesGrid);
    });

    // Bind event listeners for filters
    document.getElementById("p-search").addEventListener("input", () => this.filterAndRender(gridContainer));
    document.getElementById("p-filter-relation").addEventListener("change", () => this.filterAndRender(gridContainer));
    document.getElementById("p-filter-family").addEventListener("change", () => this.filterAndRender(gridContainer));
    document.getElementById("p-filter-city").addEventListener("change", () => this.filterAndRender(gridContainer));

    // Bind action buttons
    document.getElementById("p-add-btn").addEventListener("click", () => this.openAddModal());
    document.getElementById("p-merge-btn").addEventListener("click", () => this.openMergeModal());
  },

  filterAndRender(gridContainer) {
    const query = document.getElementById("p-search").value.toLowerCase();
    const relation = document.getElementById("p-filter-relation").value;
    const familyId = document.getElementById("p-filter-family").value;
    const city = document.getElementById("p-filter-city").value;

    let people = db.people.all();

    // Filters logic
    if (query) {
      people = people.filter(p => p.fullName.toLowerCase().includes(query) || p.city.toLowerCase().includes(query));
    }
    if (relation) {
      people = people.filter(p => p.relation === relation);
    }
    if (familyId) {
      people = people.filter(p => p.familyId === familyId);
    }
    if (city) {
      people = people.filter(p => p.city === city);
    }

    if (people.length === 0) {
      gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">${t("noPeople")}</div>`;
      return;
    }

    gridContainer.innerHTML = people.map(p => {
      const familyName = p.familyId ? p.familyId : "";
      const initials = p.fullName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
      const ledger = db.getPersonLedger(p.id);

      // Financial quick indicators
      const receivedFormatted = ledger.totalReceived > 0 ? `₹${ledger.totalReceived.toLocaleString("en-IN")}` : "₹0";
      const givenFormatted = ledger.totalGiven > 0 ? `₹${ledger.totalGiven.toLocaleString("en-IN")}` : "₹0";

      return `
        <div class="person-card" data-id="${p.id}">
          <div class="avatar-wrapper">
            ${p.photo ? 
              `<img src="${p.photo}" class="avatar-circle" alt="${p.fullName}">` : 
              `<div class="avatar-circle">${initials}</div>`
            }
            <span class="relation-badge">${t(p.relation)}</span>
          </div>
          <div class="person-name">${p.fullName}</div>
          <div class="person-family">${familyName ? familyName : t("Relative")} ${p.city ? `• ${p.city}` : ""}</div>
          
          <div class="ledger-preview">
            <div class="ledger-preview-item">
              <span class="ledger-preview-val received">${receivedFormatted}</span>
              <span class="ledger-preview-label">${t("received")}</span>
            </div>
            <div class="ledger-preview-item">
              <span class="ledger-preview-val given">${givenFormatted}</span>
              <span class="ledger-preview-label">${t("given")}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind card clicks
    gridContainer.querySelectorAll(".person-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        const id = card.getAttribute("data-id");
        navigateToView("personProfile", { id });
      });
    });
  },

  // Renders the list of families dynamically computed
  renderFamiliesGrid(gridContainer) {
    const families = db.families.all();

    if (families.length === 0) {
      gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">${t("noFamilies")}</div>`;
      return;
    }

    gridContainer.innerHTML = families.map(f => {
      const summary = this.getFamilySummary(f.name);
      return `
        <div class="person-card family-group-card" data-family="${f.name}" style="text-align: left; align-items: flex-start; gap: 4px;">
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 1.25rem;">${f.name}</h3>
            <span class="badge primary">${summary.members.length} members</span>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">${t("received")}:</span>
              <span class="received" style="font-weight: 700;">₹${summary.totalReceived.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">${t("given")}:</span>
              <span class="given" style="font-weight: 700;">₹${summary.totalGiven.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">${t("expenses")}:</span>
              <span class="expense" style="font-weight: 700;">₹${summary.totalSpent.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 800; border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px;">
              <span>${t("netBalance")}:</span>
              <span style="color: ${summary.netBalance >= 0 ? "var(--color-received)" : "var(--color-spent)"}">
                ₹${summary.netBalance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind card clicks
    gridContainer.querySelectorAll(".family-group-card").forEach(card => {
      card.addEventListener("click", () => {
        const name = card.getAttribute("data-family");
        this.openFamilyLedgerModal(name);
      });
    });
  },

  // Dynamic calculations for family ledgers
  getFamilySummary(familyName) {
    const people = db.people.all();
    
    // Filter members matching family name
    const members = people.filter(p => p.familyId === familyName);

    let totalReceived = 0;
    let totalGiven = 0;
    let totalSpent = 0;

    members.forEach(m => {
      const ledger = db.getPersonLedger(m.id);
      totalReceived += ledger.totalReceived;
      totalGiven += ledger.totalGiven;
      totalSpent += ledger.totalSpent;
    });

    return {
      name: familyName,
      members,
      totalReceived,
      totalGiven,
      totalSpent,
      netBalance: totalReceived - totalGiven
    };
  },

  openFamilyLedgerModal(familyName) {
    const summary = this.getFamilySummary(familyName);
    const title = `${familyName} Summary`;

    const contentHtml = `
      <div style="margin-bottom: 24px;">
        <h4 style="margin-bottom: 12px; color:var(--text-muted); text-transform:uppercase; font-size:0.8rem;">👥 Family Members (${summary.members.length})</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${summary.members.map(m => `
            <a onclick="window.app.closeModal(); navigateToView('personProfile', {id: '${m.id}'});" 
               style="cursor: pointer; text-decoration: none; padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--bg-input); color: var(--text-main); font-size: 0.85rem; font-weight: 600;">
               👤 ${m.fullName} (${t(m.relation)})
            </a>
          `).join("")}
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
        <h4 style="margin-bottom: 12px; color:var(--text-muted); text-transform:uppercase; font-size:0.8rem;">📈 Family Aggregate Ledger</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="fin-bubble received">
            <div class="fin-bubble-val received">₹${summary.totalReceived.toLocaleString("en-IN")}</div>
            <div class="fin-bubble-lbl">${t("totalReceivedFrom")}</div>
          </div>
          <div class="fin-bubble given">
            <div class="fin-bubble-val given">₹${summary.totalGiven.toLocaleString("en-IN")}</div>
            <div class="fin-bubble-lbl">${t("totalGivenTo")}</div>
          </div>
          <div class="fin-bubble spent">
            <div class="fin-bubble-val spent">₹${summary.totalSpent.toLocaleString("en-IN")}</div>
            <div class="fin-bubble-lbl">${t("totalSpentOn")}</div>
          </div>
          <div class="fin-bubble balance">
            <div class="fin-bubble-val balance" style="color: ${summary.netBalance >= 0 ? "var(--color-received)" : "var(--color-spent)"}">
              ₹${summary.netBalance.toLocaleString("en-IN")}
            </div>
            <div class="fin-bubble-lbl">${t("netBalance")}</div>
          </div>
        </div>
      </div>

      <div class="form-actions" style="margin-top: 24px;">
        <button type="button" class="btn-primary" data-action="cancel">Close</button>
      </div>
    `;

    window.app.showModal(title, contentHtml);
  },

  getFormHtml(person = null) {
    const relations = [
      "Father", "Mother", "Brother", "Sister", "Husband", "Wife", "Son", "Daughter",
      "Uncle", "Aunt", "Cousin", "Grandfather", "Grandmother", "Friend", "Relative", "OtherRelation"
    ];

    return `
      <form id="person-form">
        <div class="photo-uploader" style="margin-bottom: 20px;">
          <div class="photo-preview-placeholder" id="photo-preview">
            ${person && person.photo ? `<img src="${person.photo}" style="width:100%;height:100%;object-fit:cover;">` : "📸"}
          </div>
          <div>
            <label style="font-weight:700; font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:8px;">${t("photo")}</label>
            <input type="file" id="person-photo-input" accept="image/*" style="font-size: 0.9rem;">
            <input type="hidden" name="photo" id="person-photo-base64" value="${person ? person.photo : ""}">
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group span-2">
            <label>${t("fullName")} *</label>
            <input type="text" name="fullName" value="${person ? person.fullName : ""}" required placeholder="First Name Last Name">
          </div>
          
          <div class="form-group">
            <label>${t("relation")}</label>
            <select name="relation">
              ${relations.map(r => `<option value="${r}" ${person && person.relation === r ? "selected" : ""}>${t(r)}</option>`).join("")}
            </select>
          </div>
          
          <div class="form-group">
            <label>Family Override (Optional)</label>
            <input type="text" name="familyOverride" value="${person && person.familyOverride ? person.familyOverride : ""}" placeholder="e.g. Deshmukh Family">
          </div>

          <div class="form-group">
            <label>${t("gender")}</label>
            <select name="gender">
              <option value="Male" ${person && person.gender === "Male" ? "selected" : ""}>Male</option>
              <option value="Female" ${person && person.gender === "Female" ? "selected" : ""}>Female</option>
              <option value="Other" ${person && person.gender === "Other" ? "selected" : ""}>Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>${t("mobile")}</label>
            <input type="text" name="mobileNumber" value="${person ? person.mobileNumber : ""}">
          </div>

          <div class="form-group">
            <label>${t("email")}</label>
            <input type="email" name="email" value="${person ? person.email : ""}">
          </div>

          <div class="form-group">
            <label>${t("city")}</label>
            <input type="text" name="city" value="${person ? person.city : ""}">
          </div>

          <div class="form-group span-2">
            <label>${t("address")}</label>
            <input type="text" name="address" value="${person ? person.address : ""}">
          </div>

          <div class="form-group">
            <label>${t("birthDate")}</label>
            <input type="date" name="birthDate" value="${person ? person.birthDate : ""}">
          </div>

          <div class="form-group">
            <label>${t("anniversaryDate")}</label>
            <input type="date" name="anniversaryDate" value="${person ? person.anniversaryDate : ""}">
          </div>

          <div class="form-group span-2">
            <label>${t("notes")}</label>
            <textarea name="notes" rows="2">${person ? person.notes : ""}</textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" data-action="cancel">${t("cancel")}</button>
          <button type="submit" class="btn-primary">${t("save")}</button>
        </div>
      </form>
    `;
  },

  setupPhotoBinding() {
    const fileInput = document.getElementById("person-photo-input");
    const base64Input = document.getElementById("person-photo-base64");
    const previewContainer = document.getElementById("photo-preview");

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          base64Input.value = base64;
          previewContainer.innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      });
    }
  },

  openAddModal() {
    const title = t("addPersonTitle");
    const content = this.getFormHtml();
    
    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      db.people.create(data);
      if (window.app.currentView === "people") {
        this.render(document.getElementById("app-view"));
      } else {
        window.app.renderCurrentView();
      }
      return true;
    };

    window.app.showModal(title, content, onSave);
    this.setupPhotoBinding();
  },

  openEditModal(personId) {
    const person = db.people.find(personId);
    if (!person) return;

    const title = t("editPersonTitle");
    const content = this.getFormHtml(person);

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      db.people.update(personId, data);
      
      window.app.renderCurrentView();
      return true;
    };

    window.app.showModal(title, content, onSave);
    this.setupPhotoBinding();
  },

  openMergeModal() {
    const people = db.people.all().sort((a,b) => a.fullName.localeCompare(b.fullName));
    const title = t("mergeDuplicates");

    const contentHtml = `
      <form id="merge-form">
        <div style="margin-bottom: 20px; font-size: 0.95rem; color: var(--text-muted);">
          ⚠️ ${t("confirmDelete").replace("delete this record", "merge profiles")} <br><br>
          Select the duplicate person profile to merge from (which will be deleted), and the target profile to merge into.
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Duplicate Person (Source - To Delete)</label>
            <select name="sourceId" required>
              <option value="">-- Select Person --</option>
              ${people.map(p => `<option value="${p.id}">${p.fullName} (${t(p.relation)})</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Master Person (Target - Keep)</label>
            <select name="targetId" required>
              <option value="">-- Select Person --</option>
              ${people.map(p => `<option value="${p.id}">${p.fullName} (${t(p.relation)})</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" data-action="cancel">${t("cancel")}</button>
          <button type="submit" class="btn-danger">${t("mergeDuplicates")}</button>
        </div>
      </form>
    `;

    const onSave = (formData) => {
      const sourceId = formData.get("sourceId");
      const targetId = formData.get("targetId");

      if (sourceId === targetId) {
        alert("Source and Target profiles cannot be the same!");
        return false;
      }

      const success = db.people.merge(sourceId, targetId);
      if (success) {
        this.render(document.getElementById("app-view"));
        return true;
      } else {
        alert("Failed to merge profiles.");
        return false;
      }
    };

    window.app.showModal(title, contentHtml, onSave);
  }
};
