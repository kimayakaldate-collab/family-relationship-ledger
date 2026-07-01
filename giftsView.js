// Unified Gifts View Controller (Handles Received & Given modes)
const giftsView = {
  render(container, mode = "received") {
    this.currentMode = mode; // "received" or "given"
    
    const giftTypes = ["Cash", "Gold", "Silver", "Clothes", "Electronics", "Property", "Jewellery", "Custom Item", "Other"];
    const events = db.events.all();
    const people = db.people.all();

    const titleKey = mode === "received" ? "giftsReceived" : "giftsGiven";
    const addBtnKey = mode === "received" ? "addGiftReceived" : "addGiftGiven";

    container.innerHTML = `
      <div class="view-wrapper">
        <!-- SEARCH & FILTERS -->
        <div class="filter-bar">
          <input type="text" id="g-search" placeholder="Search gift name, occasion...">
          
          <select id="g-filter-type">
            <option value="">Filter by Type</option>
            ${giftTypes.map(t => `<option value="${t}">${t}</option>`).join("")}
          </select>
          
          <select id="g-filter-event">
            <option value="">Filter by Event</option>
            ${events.map(e => `<option value="${e.id}">${e.name}</option>`).join("")}
          </select>

          <select id="g-filter-person">
            <option value="">Filter by Person</option>
            ${people.map(p => `<option value="${p.id}">${p.fullName}</option>`).join("")}
          </select>

          <button class="btn-primary" id="g-add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            ${t(addBtnKey)}
          </button>
        </div>

        <!-- DATA TABLE -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>${t("date")}</th>
                <th>${mode === "received" ? "Received From" : "Given To"}</th>
                <th>${t("giftName")}</th>
                <th>${t("giftType")}</th>
                <th>${t("occasion")}</th>
                <th>${t("estimatedValue")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody id="gifts-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const tableBody = document.getElementById("gifts-table-body");
    this.filterAndRender(tableBody);

    // Bind filters
    document.getElementById("g-search").addEventListener("input", () => this.filterAndRender(tableBody));
    document.getElementById("g-filter-type").addEventListener("change", () => this.filterAndRender(tableBody));
    document.getElementById("g-filter-event").addEventListener("change", () => this.filterAndRender(tableBody));
    document.getElementById("g-filter-person").addEventListener("change", () => this.filterAndRender(tableBody));

    // Bind add button
    document.getElementById("g-add-btn").addEventListener("click", () => this.openAddModal(mode));
  },

  filterAndRender(tableBody) {
    const query = document.getElementById("g-search").value.toLowerCase();
    const giftType = document.getElementById("g-filter-type").value;
    const eventId = document.getElementById("g-filter-event").value;
    const personId = document.getElementById("g-filter-person").value;

    let list = this.currentMode === "received" ? db.giftsReceived.all() : db.giftsGiven.all();

    if (query) {
      list = list.filter(g => 
        g.giftName.toLowerCase().includes(query) || 
        g.occasion.toLowerCase().includes(query) ||
        (g.notes && g.notes.toLowerCase().includes(query))
      );
    }
    if (giftType) {
      list = list.filter(g => g.giftType === giftType);
    }
    if (eventId) {
      list = list.filter(g => g.eventId === eventId);
    }
    if (personId) {
      list = list.filter(g => g.personId === personId);
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color:var(--text-muted);">${t("noGiftsFound")}</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(g => {
      const person = db.people.find(g.personId);
      const valColorClass = this.currentMode === "received" ? "received" : "given";
      
      return `
        <tr>
          <td>${g.date}</td>
          <td>${person ? `<a onclick="navigateToView('personProfile', {id:'${person.id}'})" style="cursor:pointer; font-weight:600; text-decoration:underline; color:var(--primary-color);">${person.fullName}</a>` : "Unknown"}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              ${g.attachmentData ? `<img src="${g.attachmentData}" class="gift-thumbnail" onclick="giftsView.openImageViewer('${g.giftName}', '${g.attachmentData}')" style="width:36px; height:36px; border-radius:var(--radius-sm); object-fit:cover; cursor:zoom-in; border:1px solid var(--border-color); flex-shrink:0;">` : ""}
              <strong>${g.giftName}</strong>
            </div>
          </td>
          <td><span class="badge info">${g.giftType}</span></td>
          <td>${g.occasion || "-"}</td>
          <td style="font-weight:700;" class="${valColorClass}">₹${g.estimatedValue.toLocaleString("en-IN")}</td>
          <td>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" style="padding: 4px 8px; font-size:0.8rem;" onclick="giftsView.openEditModal('${g.id}', '${this.currentMode}')">${t("edit")}</button>
              <button class="btn-secondary" style="padding: 4px 8px; font-size:0.8rem; border-color:var(--saffron-gold); color:var(--saffron-gold);" onclick="giftsView.duplicateGift('${g.id}', '${this.currentMode}')">${t("duplicate")}</button>
              <button class="btn-danger" style="padding: 4px 8px; font-size:0.8rem;" onclick="giftsView.deleteGift('${g.id}', '${this.currentMode}')">${t("delete")}</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  getFormHtml(gift = null, mode = "received") {
    const giftTypes = ["Cash", "Gold", "Silver", "Clothes", "Electronics", "Property", "Jewellery", "Custom Item", "Other"];
    const events = db.events.all();
    
    let personName = "";
    if (gift && gift.personId) {
      const personObj = db.people.find(gift.personId);
      if (personObj) {
        personName = personObj.fullName;
      }
    }

    return `
      <form id="gift-form">
        <div class="form-grid">
          <div class="form-group autocomplete-wrapper">
            <label>${mode === "received" ? "Sender (From Person)" : "Recipient (To Person)"} *</label>
            <input type="text" id="gift-person-search" value="${personName}" placeholder="Type name to search or create..." autocomplete="off" required>
            <input type="hidden" name="personId" id="gift-person-id" value="${gift ? gift.personId : ""}" required>
            <div class="autocomplete-results" id="gift-person-results"></div>
          </div>

          <div class="form-group">
            <label>${t("giftType")} *</label>
            <select name="giftType" required>
              ${giftTypes.map(t => `<option value="${t}" ${gift && gift.giftType === t ? "selected" : ""}>${t}</option>`).join("")}
            </select>
          </div>

          <div class="form-group span-2">
            <label>${t("giftName")} *</label>
            <input type="text" name="giftName" value="${gift ? gift.giftName : ""}" required placeholder="e.g. Saffron Shagun Envelope, Diamond Ring, etc.">
          </div>

          <div class="form-group">
            <label>${t("estimatedValue")} *</label>
            <input type="number" name="estimatedValue" value="${gift ? gift.estimatedValue : ""}" required inputmode="numeric" pattern="[0-9]*">
          </div>

          <div class="form-group">
            <label>${t("date")} *</label>
            <input type="date" name="date" value="${gift ? gift.date : new Date().toISOString().split("T")[0]}" required>
          </div>

          <div class="form-group">
            <label>Occasion Details</label>
            <input type="text" name="occasion" value="${gift ? gift.occasion : ""}" placeholder="e.g. Wedding, Birthday ceremony">
          </div>

          <div class="form-group">
            <label style="display:flex; justify-content:space-between; align-items:center;">
              <span>Linked Event</span>
              <a href="#" id="gift-inline-event-btn" style="text-decoration:underline; font-size:0.75rem; color:var(--primary-color); font-weight:700;">+ Add New</a>
            </label>
            <select name="eventId" id="gift-event-select">
              <option value="">-- Select Event --</option>
              ${events.map(e => `<option value="${e.id}" ${gift && gift.eventId === e.id ? "selected" : ""}>${e.name}</option>`).join("")}
            </select>
          </div>

          <!-- GIFT PHOTO UPLOADER FEATURE -->
          <div class="form-group span-2">
            <label>Gift Photo / भेटवस्तूचा फोटो</label>
            <div class="photo-uploader" style="display: flex; align-items: center; gap: 16px; margin-top: 8px;">
              <div id="gift-photo-preview" class="photo-preview-placeholder" style="width: 80px; height: 80px; border-radius: var(--radius-md); border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: var(--bg-input); flex-shrink: 0;">
                ${gift && gift.attachmentData ? `<img src="${gift.attachmentData}" style="width: 100%; height: 100%; object-fit: cover;">` : "🎁"}
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; flex-grow: 1;">
                <input type="file" id="gift-photo-input" accept="image/png, image/jpeg, image/jpg, image/webp" style="font-size: 0.9rem;">
                <input type="hidden" name="attachmentData" id="gift-photo-base64" value="${gift && gift.attachmentData ? gift.attachmentData : ""}">
                <input type="hidden" name="attachmentName" id="gift-photo-filename" value="${gift && gift.attachmentName ? gift.attachmentName : ""}">
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn-secondary" id="gift-photo-remove-btn" style="padding: 6px 12px; font-size: 0.8rem; display: ${gift && gift.attachmentData ? "inline-flex" : "none"};">${t("delete")}</button>
                </div>
              </div>
            </div>
            <div id="gift-photo-error" style="color: var(--color-spent); font-size: 0.8rem; margin-top: 4px; display: none;"></div>
          </div>

          <div class="form-group span-2">
            <label>${t("description")}</label>
            <input type="text" name="description" value="${gift ? gift.description : ""}">
          </div>

          <div class="form-group span-2">
            <label>${t("notes")}</label>
            <textarea name="notes" rows="2">${gift ? gift.notes : ""}</textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" data-action="cancel">${t("cancel")}</button>
          <button type="submit" class="btn-primary">${t("save")}</button>
        </div>
      </form>
    `;
  },

  bindAutocomplete(mode) {
    const searchInput = document.getElementById("gift-person-search");
    const idInput = document.getElementById("gift-person-id");
    const resultsDiv = document.getElementById("gift-person-results");

    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      idInput.value = ""; 

      if (!val) {
        resultsDiv.innerHTML = "";
        resultsDiv.classList.remove("active");
        return;
      }

      const query = val.toLowerCase();
      const people = db.people.all();
      const matches = people.filter(p => p.fullName.toLowerCase().includes(query));

      let html = "";
      matches.forEach(p => {
        html += `
          <div class="autocomplete-item" data-id="${p.id}" data-name="${p.fullName}">
            <span>${p.fullName}</span>
            <span class="item-sub">${t(p.relation)} ${p.city ? `• ${p.city}` : ""}</span>
          </div>
        `;
      });

      const exactMatch = matches.find(p => p.fullName.toLowerCase() === query);
      if (!exactMatch) {
        html += `
          <div class="autocomplete-item autocomplete-create-btn" data-action="create" data-name="${val}">
            <span>+ Create New Person "${val}"</span>
            <span class="item-sub">(Default: Relative)</span>
          </div>
        `;
      }

      resultsDiv.innerHTML = html;
      resultsDiv.classList.add("active");
    });

    resultsDiv.addEventListener("click", (e) => {
      const item = e.target.closest(".autocomplete-item");
      if (!item) return;

      const action = item.getAttribute("data-action");
      const name = item.getAttribute("data-name");

      if (action === "create") {
        const newPerson = db.people.create({
          fullName: name,
          relation: "Relative",
          familyId: ""
        });
        searchInput.value = newPerson.fullName;
        idInput.value = newPerson.id;
      } else {
        const id = item.getAttribute("data-id");
        searchInput.value = name;
        idInput.value = id;
      }

      resultsDiv.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".autocomplete-wrapper")) {
        resultsDiv.classList.remove("active");
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (resultsDiv.classList.contains("active")) {
          e.preventDefault();
          const firstItem = resultsDiv.querySelector(".autocomplete-item");
          if (firstItem) firstItem.click();
        }
      }
    });
  },

  // Image Upload Binding logic with validations
  bindPhotoUploader() {
    const fileInput = document.getElementById("gift-photo-input");
    const base64Input = document.getElementById("gift-photo-base64");
    const filenameInput = document.getElementById("gift-photo-filename");
    const previewDiv = document.getElementById("gift-photo-preview");
    const removeBtn = document.getElementById("gift-photo-remove-btn");
    const errorDiv = document.getElementById("gift-photo-error");

    if (!fileInput) return;

    fileInput.addEventListener("change", (e) => {
      errorDiv.style.display = "none";
      errorDiv.textContent = "";
      
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        errorDiv.textContent = "Supported formats: JPG, JPEG, PNG, WEBP.";
        errorDiv.style.display = "block";
        fileInput.value = "";
        return;
      }

      // Max size: 10 MB
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        errorDiv.textContent = "Image size exceeds 10 MB limit.";
        errorDiv.style.display = "block";
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        base64Input.value = base64;
        filenameInput.value = file.name;
        previewDiv.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
        removeBtn.style.display = "inline-flex";
      };
      reader.readAsDataURL(file);
    });

    removeBtn.addEventListener("click", () => {
      base64Input.value = "";
      filenameInput.value = "";
      previewDiv.innerHTML = "🎁";
      fileInput.value = "";
      removeBtn.style.display = "none";
      errorDiv.style.display = "none";
    });
  },

  bindFormEvents(mode, giftId = null) {
    this.bindAutocomplete(mode);
    this.bindPhotoUploader();

    const inlineEventBtn = document.getElementById("gift-inline-event-btn");
    if (inlineEventBtn) {
      inlineEventBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Save current form state
        const currentForm = document.getElementById("gift-form");
        const tempGiftData = Object.fromEntries(new FormData(currentForm).entries());
        const searchInput = document.getElementById("gift-person-search");
        if (searchInput) {
          tempGiftData._personSearchVal = searchInput.value;
        }

        if (giftId) {
          tempGiftData.id = giftId;
        }

        const title = t("addEvent");
        const content = eventsView.getFormHtml();

        const onEventSave = (eventFormData) => {
          const eventData = Object.fromEntries(eventFormData.entries());
          const newEvent = db.events.create(eventData);

          tempGiftData.eventId = newEvent.id;

          if (giftId) {
            giftsView.openEditModal(giftId, mode, tempGiftData);
          } else {
            giftsView.openAddModal(mode, tempGiftData);
          }
          
          const newSearchInput = document.getElementById("gift-person-search");
          if (newSearchInput && tempGiftData._personSearchVal) {
            newSearchInput.value = tempGiftData._personSearchVal;
          }
          return true;
        };

        const onEventCancel = () => {
          if (giftId) {
            giftsView.openEditModal(giftId, mode, tempGiftData);
          } else {
            giftsView.openAddModal(mode, tempGiftData);
          }
          const newSearchInput = document.getElementById("gift-person-search");
          if (newSearchInput && tempGiftData._personSearchVal) {
            newSearchInput.value = tempGiftData._personSearchVal;
          }
        };

        window.app.showModal(title, content, onEventSave, onEventCancel);
      });
    }
  },

  // Interactive zoomable image viewer popup
  openImageViewer(giftName, base64Data) {
    const title = giftName;
    const contentHtml = `
      <div style="text-align: center; position: relative; max-height: 60vh; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #0c0814; border-radius: var(--radius-md); border:1px solid var(--border-color);">
        <img id="viewer-zoom-img" src="${base64Data}" style="max-width: 100%; max-height: 60vh; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: zoom-in;" data-zoom="1">
      </div>
      <div style="display:flex; justify-content:center; gap:16px; margin-top:16px;">
        <button type="button" class="btn-secondary" id="viewer-zoom-in-btn" style="padding:8px 16px;">🔍 Zoom In</button>
        <button type="button" class="btn-secondary" id="viewer-zoom-out-btn" style="padding:8px 16px;">🔍 Zoom Out</button>
        <button type="button" class="btn-primary" data-action="cancel" style="padding:8px 16px;">Close</button>
      </div>
    `;

    window.app.showModal(title, contentHtml);

    const img = document.getElementById("viewer-zoom-img");
    const zoomIn = document.getElementById("viewer-zoom-in-btn");
    const zoomOut = document.getElementById("viewer-zoom-out-btn");

    if (img && zoomIn && zoomOut) {
      let scale = 1;
      
      const updateZoom = () => {
        img.style.transform = `scale(${scale})`;
        img.style.cursor = scale > 1 ? "zoom-out" : "zoom-in";
      };

      zoomIn.addEventListener("click", () => {
        scale = Math.min(3, scale + 0.25);
        updateZoom();
      });

      zoomOut.addEventListener("click", () => {
        scale = Math.max(1, scale - 0.25);
        updateZoom();
      });

      img.addEventListener("click", () => {
        scale = scale === 1 ? 2 : 1;
        updateZoom();
      });
    }
  },

  openAddModal(mode = "received", preFill = null) {
    const title = mode === "received" ? t("addGiftReceivedTitle") : t("addGiftGivenTitle");
    const content = this.getFormHtml(preFill, mode);

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      if (mode === "received") {
        db.giftsReceived.create(data);
      } else {
        db.giftsGiven.create(data);
      }

      if (window.app.currentView === "giftsReceived" || window.app.currentView === "giftsGiven") {
        this.render(document.getElementById("app-view"), mode);
      } else {
        window.app.renderCurrentView();
      }
      return true;
    };

    window.app.showModal(title, content, onSave);
    this.bindFormEvents(mode);
  },

  openEditModal(giftId, mode = "received", preFill = null) {
    const gift = preFill || (mode === "received" ? db.giftsReceived.find(giftId) : db.giftsGiven.find(giftId));
    if (!gift) return;

    const title = mode === "received" ? t("editGiftReceivedTitle") : t("editGiftGivenTitle");
    const content = this.getFormHtml(gift, mode);

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      if (mode === "received") {
        db.giftsReceived.update(giftId, data);
      } else {
        db.giftsGiven.update(giftId, data);
      }
      
      window.app.renderCurrentView();
      return true;
    };

    window.app.showModal(title, content, onSave);
    this.bindFormEvents(mode, giftId);
  },

  duplicateGift(giftId, mode = "received") {
    const gift = mode === "received" ? db.giftsReceived.find(giftId) : db.giftsGiven.find(giftId);
    if (!gift) return;

    const clone = { ...gift };
    delete clone.id;

    this.openAddModal(mode, clone);
  },

  deleteGift(giftId, mode = "received") {
    if (confirm(t("confirmDelete"))) {
      if (mode === "received") {
        db.giftsReceived.delete(giftId);
      } else {
        db.giftsGiven.delete(giftId);
      }
      window.app.renderCurrentView();
    }
  }
};
