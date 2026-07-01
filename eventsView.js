// Events View Controller & Dashboard
const eventsView = {
  render(container) {
    const events = db.events.all();

    container.innerHTML = `
      <div class="view-wrapper">
        <div class="filter-bar">
          <button class="btn-primary" id="ev-add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            ${t("addEvent")}
          </button>
        </div>

        <div class="people-grid" style="margin-top: 24px;">
          ${events.map(e => {
            const ledger = this.getEventSummary(e.id);
            const percent = e.budget > 0 ? Math.min(100, Math.round((ledger.totalExpenses / e.budget) * 100)) : 0;
            return `
              <div class="person-card event-card" data-id="${e.id}" style="text-align: left; align-items: flex-start;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center; margin-bottom:12px;">
                  <span class="badge primary">${t(e.type)}</span>
                  <span class="badge info">${e.status}</span>
                </div>
                <h3 style="margin-bottom:6px;">${e.name}</h3>
                <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">
                  📅 ${e.date} &nbsp;•&nbsp; 📍 ${e.location || "N/A"}
                </div>
                
                <div style="width:100%; margin-bottom:14px;">
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; margin-bottom:4px;">
                    <span>${t("expenses")} (₹${ledger.totalExpenses.toLocaleString("en-IN")})</span>
                    <span>${percent}%</span>
                  </div>
                  <div style="height:6px; background-color:var(--bg-input); border-radius:3px; overflow:hidden;">
                    <div style="width:${percent}%; height:100%; background:var(--primary-gradient);"></div>
                  </div>
                </div>

                <div class="ledger-preview" style="border-top:1px solid var(--border-color); padding-top:12px;">
                  <div class="ledger-preview-item">
                    <span class="ledger-preview-val received">₹${ledger.totalGiftsReceived.toLocaleString("en-IN")}</span>
                    <span class="ledger-preview-label">${t("received")}</span>
                  </div>
                  <div class="ledger-preview-item">
                    <span class="ledger-preview-val given">₹${ledger.totalGiftsGiven.toLocaleString("en-IN")}</span>
                    <span class="ledger-preview-label">${t("given")}</span>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
          ${events.length === 0 ? `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">${t("noEventsFound")}</div>` : ""}
        </div>
      </div>
    `;

    // Bind event card clicks
    container.querySelectorAll(".event-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        navigateToView("events", { id });
      });
    });

    document.getElementById("ev-add-btn").addEventListener("click", () => this.openAddModal());
  },

  // Event Dashboard view showing full breakdown
  renderDashboard(container, eventId) {
    const ev = db.events.find(eventId);
    if (!ev) {
      container.innerHTML = `<h2>Event details not found.</h2>`;
      return;
    }

    const summary = this.getEventSummary(eventId);
    const remaining = ev.budget - summary.totalExpenses;
    const isOverBudget = remaining < 0;

    // Budget gauge percentage
    const percent = ev.budget > 0 ? Math.min(100, Math.round((summary.totalExpenses / ev.budget) * 100)) : 0;
    // Circular gauge properties
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    container.innerHTML = `
      <div class="view-wrapper">
        <div style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <button class="btn-secondary" onclick="navigateToView('events')">
            ← Back to Events List
          </button>
          <div style="display:flex; gap:12px;">
            <button class="btn-secondary" id="ev-dash-edit">${t("edit")}</button>
            <button class="btn-danger" id="ev-dash-delete">${t("delete")}</button>
          </div>
        </div>

        <!-- MAIN OVERVIEW SECTION -->
        <div class="event-dash-grid">
          
          <!-- LEFT CARD: DETAILS & GAUGE -->
          <div class="card-section" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; align-items:center;">
            <div>
              <span class="badge primary" style="margin-bottom:12px; display:inline-block;">${t(ev.type)}</span>
              <h2>${ev.name}</h2>
              <p style="margin-top:10px; color:var(--text-muted);">
                📅 <strong>${ev.date}</strong> <br>
                📍 ${ev.location}
              </p>
              <p style="margin-top:12px; font-size:0.9rem;">
                <i>${ev.description || "No description provided."}</i>
              </p>
            </div>
            
            <div class="progress-gauge-wrapper">
              <svg class="gauge-svg">
                <circle class="gauge-track" cx="90" cy="90" r="${radius}"></circle>
                <circle class="gauge-fill" cx="90" cy="90" r="${radius}" 
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${strokeDashoffset}"
                  style="stroke: ${isOverBudget ? "var(--color-spent)" : "var(--primary-color)"}">
                </circle>
                <text class="gauge-text" x="90" y="90">${percent}%</text>
              </svg>
              <div style="margin-top:10px; font-weight:700; text-align:center;">
                ₹${summary.totalExpenses.toLocaleString("en-IN")} ${t("spentOf")} ₹${ev.budget.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <!-- RIGHT CARD: SUMMARY METRICS -->
          <div class="card-section" style="display:flex; flex-direction:column; justify-content:space-around;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div class="fin-bubble received">
                <div class="fin-bubble-val received">₹${summary.totalGiftsReceived.toLocaleString("en-IN")}</div>
                <div class="fin-bubble-lbl">${t("totalGiftsReceived")}</div>
              </div>
              <div class="fin-bubble given">
                <div class="fin-bubble-val given">₹${summary.totalGiftsGiven.toLocaleString("en-IN")}</div>
                <div class="fin-bubble-lbl">${t("totalGiftsGiven")}</div>
              </div>
            </div>

            <div style="margin-top:20px; padding:16px; border-radius:var(--radius-md); background-color:${isOverBudget ? "rgba(231,76,60,0.06)" : "var(--bg-input)"}; border:1px solid ${isOverBudget ? "rgba(231,76,60,0.15)" : "var(--border-color)"};">
              <div style="font-weight:700; color: ${isOverBudget ? "var(--color-spent)" : "var(--text-muted)"}; font-size:0.85rem; text-transform:uppercase;">
                ${isOverBudget ? "⚠️ Over Budget Limit" : "💰 Remaining Budget"}
              </div>
              <div style="font-size:1.6rem; font-weight:800; font-family:var(--font-display); color: ${isOverBudget ? "var(--color-spent)" : "var(--color-received)"}">
                ₹${Math.abs(remaining).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

        </div>

        <!-- BREAKDOWN GRIDS -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px;">
          
          <!-- EXPENSES CATEGORY BREAKDOWN -->
          <div class="card-section">
            <h3 style="margin-bottom:16px;">💸 ${t("expenseBreakdown")}</h3>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${t("category")}</th>
                    <th>Transactions</th>
                    <th>${t("amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(summary.expensesByCategory).map(([cat, amt]) => `
                    <tr>
                      <td><strong>${t(cat)}</strong></td>
                      <td>${summary.expenses.filter(e => e.category === cat).length}</td>
                      <td style="font-weight:700; text-align:right;">₹${amt.toLocaleString("en-IN")}</td>
                    </tr>
                  `).join("")}
                  ${Object.keys(summary.expensesByCategory).length === 0 ? `<tr><td colspan="3" style="text-align:center;">No expenses logged for this event.</td></tr>` : ""}
                </tbody>
              </table>
            </div>
          </div>

          <!-- GIFTS TYPE BREAKDOWN -->
          <div class="card-section">
            <h3 style="margin-bottom:16px;">🎁 ${t("giftBreakdown")}</h3>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${t("giftType")}</th>
                    <th>${t("received")}</th>
                    <th>${t("given")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.keys(summary.giftsBreakdown).map(type => `
                    <tr>
                      <td><strong>${t(type)}</strong></td>
                      <td class="received" style="font-weight:700;">₹${summary.giftsBreakdown[type].received.toLocaleString("en-IN")}</td>
                      <td class="given" style="font-weight:700;">₹${summary.giftsBreakdown[type].given.toLocaleString("en-IN")}</td>
                    </tr>
                  `).join("")}
                  ${Object.keys(summary.giftsBreakdown).length === 0 ? `<tr><td colspan="3" style="text-align:center;">No gifts logged for this event.</td></tr>` : ""}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- PEOPLE INVOLVED IN THIS EVENT -->
        <div class="card-section">
          <h3 style="margin-bottom:16px;">👥 ${t("peopleInvolved")}</h3>
          <div class="people-grid">
            ${summary.peopleInvolved.map(p => {
              const initials = p.fullName.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
              return `
                <div class="person-card" onclick="navigateToView('personProfile', {id: '${p.id}'})">
                  <div class="avatar-wrapper">
                    ${p.photo ? 
                      `<img src="${p.photo}" class="avatar-circle" alt="${p.fullName}">` : 
                      `<div class="avatar-circle">${initials}</div>`
                    }
                    <span class="relation-badge">${t(p.relation)}</span>
                  </div>
                  <div class="person-name">${p.fullName}</div>
                  <div class="person-family">${p.city || ""}</div>
                </div>
              `;
            }).join("")}
            ${summary.peopleInvolved.length === 0 ? `<div style="color:var(--text-muted);">${t("noPeople")}</div>` : ""}
          </div>
        </div>

      </div>
    `;

    // Bind edit/delete triggers
    document.getElementById("ev-dash-edit").addEventListener("click", () => this.openEditModal(eventId));
    document.getElementById("ev-dash-delete").addEventListener("click", () => {
      if (confirm(t("confirmDelete"))) {
        db.events.delete(eventId);
        navigateToView("events");
      }
    });
  },

  // Helper calculating event sums, category breakdowns, and related people
  getEventSummary(eventId) {
    const expenses = db.expenses.all().filter(e => e.eventId === eventId);
    const giftsReceived = db.giftsReceived.all().filter(g => g.eventId === eventId);
    const giftsGiven = db.giftsGiven.all().filter(g => g.eventId === eventId);

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalGiftsReceived = giftsReceived.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    const totalGiftsGiven = giftsGiven.reduce((acc, curr) => acc + curr.estimatedValue, 0);

    // Group expenses by Category
    const expensesByCategory = {};
    expenses.forEach(e => {
      expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
    });

    // Group gifts by Type
    const giftsBreakdown = {};
    const giftTypes = ["Cash", "Gold", "Silver", "Electronics", "Property", "Other"];
    giftTypes.forEach(t => {
      giftsBreakdown[t] = { received: 0, given: 0 };
    });

    giftsReceived.forEach(g => {
      if (!giftsBreakdown[g.giftType]) giftsBreakdown[g.giftType] = { received: 0, given: 0 };
      giftsBreakdown[g.giftType].received += g.estimatedValue;
    });

    giftsGiven.forEach(g => {
      if (!giftsBreakdown[g.giftType]) giftsBreakdown[g.giftType] = { received: 0, given: 0 };
      giftsBreakdown[g.giftType].given += g.estimatedValue;
    });

    // Remove zeroed gift breakdowns
    Object.keys(giftsBreakdown).forEach(type => {
      if (giftsBreakdown[type].received === 0 && giftsBreakdown[type].given === 0) {
        delete giftsBreakdown[type];
      }
    });

    // Collect all involved people
    const peopleIds = new Set();
    expenses.forEach(e => { if (e.relatedPersonId) peopleIds.add(e.relatedPersonId); });
    giftsReceived.forEach(g => peopleIds.add(g.personId));
    giftsGiven.forEach(g => peopleIds.add(g.personId));

    const peopleInvolved = Array.from(peopleIds).map(id => db.people.find(id)).filter(Boolean);

    return {
      totalExpenses,
      totalGiftsReceived,
      totalGiftsGiven,
      expensesByCategory,
      giftsBreakdown,
      peopleInvolved,
      expenses
    };
  },

  getFormHtml(event = null) {
    const types = [
      "Wedding", "Engagement", "Birthday", "Anniversary", "BabyShower", "Housewarming", "NamingCeremony", "Diwali", "RakshaBandhan", "BhauBeej", "Custom"
    ];

    return `
      <form id="event-form">
        <div class="form-grid">
          <div class="form-group span-2">
            <label>${t("eventName")} *</label>
            <input type="text" name="name" value="${event ? event.name : ""}" required>
          </div>

          <div class="form-group">
            <label>${t("eventType")}</label>
            <select name="type">
              ${types.map(tKey => `<option value="${tKey}" ${event && event.type === tKey ? "selected" : ""}>${t(tKey)}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>${t("date")} *</label>
            <input type="date" name="date" value="${event ? event.date : ""}" required>
          </div>

          <div class="form-group">
            <label>${t("location")}</label>
            <input type="text" name="location" value="${event ? event.location : ""}">
          </div>

          <div class="form-group">
            <label>${t("budget")} (₹)</label>
            <input type="number" name="budget" value="${event ? event.budget : 0}" inputmode="numeric" pattern="[0-9]*">
          </div>

          <div class="form-group">
            <label>${t("status")}</label>
            <select name="status">
              <option value="Upcoming" ${event && event.status === "Upcoming" ? "selected" : ""}>Upcoming</option>
              <option value="Completed" ${event && event.status === "Completed" ? "selected" : ""}>Completed</option>
              <option value="Cancelled" ${event && event.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </div>

          <div class="form-group span-2">
            <label>${t("description")}</label>
            <textarea name="description" rows="3">${event ? event.description : ""}</textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" data-action="cancel">${t("cancel")}</button>
          <button type="submit" class="btn-primary">${t("save")}</button>
        </div>
      </form>
    `;
  },

  openAddModal() {
    const title = t("addEvent");
    const content = this.getFormHtml();

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      const newEv = db.events.create(data);
      if (window.app.currentView === "events" && !window.app.currentParams?.id) {
        this.render(document.getElementById("app-view"));
      } else {
        window.app.renderCurrentView();
      }
      return true;
    };

    window.app.showModal(title, content, onSave);
  },

  openEditModal(eventId) {
    const ev = db.events.find(eventId);
    if (!ev) return;

    const title = t("editEvent");
    const content = this.getFormHtml(ev);

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      db.events.update(eventId, data);
      
      // Refresh current page
      window.app.renderCurrentView();
      return true;
    };

    window.app.showModal(title, content, onSave);
  }
};
