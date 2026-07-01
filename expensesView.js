// Expenses View Controller
const expensesView = {
  render(container) {
    const categories = ["Clothes", "Jewellery", "Catering", "Hall", "Decoration", "Photography", "Travel", "Accommodation", "Gifts", "Miscellaneous"];
    const paymentMethods = ["Cash", "Card", "UPI", "Net Banking", "Cheque"];
    const events = db.events.all();
    const people = db.people.all();

    container.innerHTML = `
      <div class="view-wrapper">
        <!-- SEARCH & FILTERS -->
        <div class="filter-bar">
          <input type="text" id="exp-search" placeholder="Search vendor, description...">
          
          <select id="exp-filter-cat">
            <option value="">Filter by Category</option>
            ${categories.map(c => `<option value="${c}">${t(c)}</option>`).join("")}
          </select>
          
          <select id="exp-filter-event">
            <option value="">Filter by Event</option>
            ${events.map(e => `<option value="${e.id}">${e.name}</option>`).join("")}
          </select>

          <select id="exp-filter-method">
            <option value="">Filter by Method</option>
            ${paymentMethods.map(m => `<option value="${m}">${m}</option>`).join("")}
          </select>

          <button class="btn-primary" id="exp-add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:18px;height:18px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            ${t("addExpense")}
          </button>
        </div>

        <!-- DATA TABLE -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>${t("date")}</th>
                <th>${t("category")}</th>
                <th>${t("subcategory")}</th>
                <th>${t("relatedPerson")}</th>
                <th>${t("vendor")}</th>
                <th>${t("paymentMethod")}</th>
                <th>${t("amount")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody id="expenses-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const tableBody = document.getElementById("expenses-table-body");
    this.filterAndRender(tableBody);

    // Bind filters
    document.getElementById("exp-search").addEventListener("input", () => this.filterAndRender(tableBody));
    document.getElementById("exp-filter-cat").addEventListener("change", () => this.filterAndRender(tableBody));
    document.getElementById("exp-filter-event").addEventListener("change", () => this.filterAndRender(tableBody));
    document.getElementById("exp-filter-method").addEventListener("change", () => this.filterAndRender(tableBody));

    // Bind add button
    document.getElementById("exp-add-btn").addEventListener("click", () => this.openAddModal());
  },

  filterAndRender(tableBody) {
    const query = document.getElementById("exp-search").value.toLowerCase();
    const category = document.getElementById("exp-filter-cat").value;
    const eventId = document.getElementById("exp-filter-event").value;
    const method = document.getElementById("exp-filter-method").value;

    let list = db.expenses.all();

    if (query) {
      list = list.filter(e => 
        e.description.toLowerCase().includes(query) || 
        e.vendor.toLowerCase().includes(query) || 
        (e.subcategory && e.subcategory.toLowerCase().includes(query))
      );
    }
    if (category) {
      list = list.filter(e => e.category === category);
    }
    if (eventId) {
      list = list.filter(e => e.eventId === eventId);
    }
    if (method) {
      list = list.filter(e => e.paymentMethod === method);
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color:var(--text-muted);">${t("noExpensesFound")}</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(e => {
      const person = e.relatedPersonId ? db.people.find(e.relatedPersonId) : null;
      return `
        <tr>
          <td>${e.date}</td>
          <td><span class="badge primary">${t(e.category)}</span></td>
          <td>${e.subcategory || "-"}</td>
          <td>${person ? `<a onclick="navigateToView('personProfile', {id:'${person.id}'})" style="cursor:pointer; font-weight:600; text-decoration:underline; color:var(--primary-color);">${person.fullName}</a>` : "-"}</td>
          <td>${e.vendor || "-"}</td>
          <td><span class="badge info">${e.paymentMethod}</span></td>
          <td style="font-weight:700;" class="expense">₹${e.amount.toLocaleString("en-IN")}</td>
          <td>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" style="padding: 4px 8px; font-size:0.8rem;" onclick="expensesView.openEditModal('${e.id}')">${t("edit")}</button>
              <button class="btn-secondary" style="padding: 4px 8px; font-size:0.8rem; border-color:var(--saffron-gold); color:var(--saffron-gold);" onclick="expensesView.duplicateExpense('${e.id}')">${t("duplicate")}</button>
              <button class="btn-danger" style="padding: 4px 8px; font-size:0.8rem;" onclick="expensesView.deleteExpense('${e.id}')">${t("delete")}</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  getFormHtml(expense = null) {
    const categories = ["Clothes", "Jewellery", "Catering", "Hall", "Decoration", "Photography", "Travel", "Accommodation", "Gifts", "Miscellaneous"];
    const paymentMethods = ["Cash", "Card", "UPI", "Net Banking", "Cheque"];
    const events = db.events.all();
    const people = db.people.all().sort((a,b) => a.fullName.localeCompare(b.fullName));

    return `
      <form id="expense-form">
        <div class="form-grid">
          <div class="form-group">
            <label>${t("category")} *</label>
            <select name="category" required>
              ${categories.map(c => `<option value="${c}" ${expense && expense.category === c ? "selected" : ""}>${t(c)}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>${t("subcategory")}</label>
            <input type="text" name="subcategory" value="${expense ? expense.subcategory : ""}">
          </div>

          <div class="form-group">
            <label>${t("amount")} *</label>
            <input type="number" name="amount" value="${expense ? expense.amount : ""}" required inputmode="numeric" pattern="[0-9]*">
          </div>

          <div class="form-group">
            <label>${t("date")} *</label>
            <input type="date" name="date" value="${expense ? expense.date : new Date().toISOString().split("T")[0]}" required>
          </div>

          <div class="form-group">
            <label style="display:flex; justify-content:space-between; align-items:center;">
              <span>Linked Event</span>
              <a href="#" id="expense-inline-event-btn" style="text-decoration:underline; font-size:0.75rem; color:var(--primary-color); font-weight:700;">+ Add New</a>
            </label>
            <select name="eventId" id="expense-event-select">
              <option value="">-- Select Event --</option>
              ${events.map(e => `<option value="${e.id}" ${expense && expense.eventId === e.id ? "selected" : ""}>${e.name}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>${t("relatedPerson")}</label>
            <select name="relatedPersonId">
              <option value="">-- Select Person --</option>
              ${people.map(p => `<option value="${p.id}" ${expense && expense.relatedPersonId === p.id ? "selected" : ""}>${p.fullName} (${t(p.relation)})</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>${t("vendor")}</label>
            <input type="text" name="vendor" value="${expense ? expense.vendor : ""}">
          </div>

          <div class="form-group">
            <label>${t("paymentMethod")}</label>
            <select name="paymentMethod">
              ${paymentMethods.map(m => `<option value="${m}" ${expense && expense.paymentMethod === m ? "selected" : ""}>${m}</option>`).join("")}
            </select>
          </div>

          <div class="form-group span-2">
            <label>${t("description")}</label>
            <input type="text" name="description" value="${expense ? expense.description : ""}">
          </div>

          <div class="form-group span-2">
            <label>${t("notes")}</label>
            <textarea name="notes" rows="2">${expense ? expense.notes : ""}</textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" data-action="cancel">${t("cancel")}</button>
          <button type="submit" class="btn-primary">${t("save")}</button>
        </div>
      </form>
    `;
  },

  bindFormEvents(expenseId = null) {
    const inlineEventBtn = document.getElementById("expense-inline-event-btn");
    if (inlineEventBtn) {
      inlineEventBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Save current form state
        const currentForm = document.getElementById("expense-form");
        const tempExpenseData = Object.fromEntries(new FormData(currentForm).entries());

        if (expenseId) {
          tempExpenseData.id = expenseId;
        }

        const title = t("addEvent");
        const content = eventsView.getFormHtml();

        const onEventSave = (eventFormData) => {
          const eventData = Object.fromEntries(eventFormData.entries());
          const newEvent = db.events.create(eventData);

          tempExpenseData.eventId = newEvent.id;

          if (expenseId) {
            expensesView.openEditModal(expenseId, tempExpenseData);
          } else {
            expensesView.openAddModal(tempExpenseData);
          }
          return true;
        };

        const onEventCancel = () => {
          if (expenseId) {
            expensesView.openEditModal(expenseId, tempExpenseData);
          } else {
            expensesView.openAddModal(tempExpenseData);
          }
        };

        window.app.showModal(title, content, onEventSave, onEventCancel);
      });
    }
  },

  openAddModal(preFill = null) {
    const title = t("addExpenseTitle");
    const content = this.getFormHtml(preFill);

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      db.expenses.create(data);
      if (window.app.currentView === "expenses") {
        this.render(document.getElementById("app-view"));
      } else {
        window.app.renderCurrentView();
      }
      return true;
    };

    window.app.showModal(title, content, onSave);
    this.bindFormEvents();
  },

  openEditModal(expenseId, preFill = null) {
    const exp = preFill || db.expenses.find(expenseId);
    if (!exp) return;

    const title = t("editExpenseTitle");
    const content = this.getFormHtml(exp);

    const onSave = (formData) => {
      const data = Object.fromEntries(formData.entries());
      db.expenses.update(expenseId, data);
      
      window.app.renderCurrentView();
      return true;
    };

    window.app.showModal(title, content, onSave);
    this.bindFormEvents(expenseId);
  },

  duplicateExpense(expenseId) {
    const exp = db.expenses.find(expenseId);
    if (!exp) return;

    const clone = { ...exp };
    delete clone.id;

    this.openAddModal(clone);
  },

  deleteExpense(expenseId) {
    if (confirm(t("confirmDelete"))) {
      db.expenses.delete(expenseId);
      window.app.renderCurrentView();
    }
  }
};
