// Reports View Controller (Export engines and custom ledger builders)
const reportsView = {
  render(container) {
    const reportTypes = [
      { id: "person", title: t("personWiseReport"), desc: "Detail transaction logs of a single person.", icon: "👤" },
      { id: "family", title: t("familyWiseReport"), desc: "Aggregated metrics for a family unit.", icon: "👨‍👩‍👧‍👦" },
      { id: "event", title: t("eventWiseReport"), desc: "Comprehensive expenses & gifts breakdown per event.", icon: "🗓️" },
      { id: "wedding", title: t("weddingReport"), desc: "Focused wedding planner financial report.", icon: "💑" },
      { id: "expense", title: t("expenseReport"), desc: "Itemized and categorized expense report.", icon: "💸" },
      { id: "gift", title: t("giftReport"), desc: "Gift exchange analysis (Cash, Gold, Silver).", icon: "🎁" }
    ];

    container.innerHTML = `
      <div class="view-wrapper">
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:32px;">
          
          <!-- LEFT CARD: SELECT REPORT TYPE -->
          <div class="card-section">
            <h3 style="margin-bottom:20px;">📊 ${t("repSelectCategory")}</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${reportTypes.map(r => `
                <div class="feed-item report-selector-card" data-report="${r.id}" style="cursor:pointer; border-color:var(--border-color);">
                  <div class="feed-icon-circle event" style="font-size:1.2rem;">${r.icon}</div>
                  <div class="feed-details">
                    <div class="feed-title">${r.title}</div>
                    <div class="feed-subtitle" style="font-size:0.75rem;">${r.desc}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- RIGHT CARD: REPORT PARAMETERS & RENDER VIEW -->
          <div class="card-section" id="report-details-container">
            <div style="text-align:center; padding:60px 0; color:var(--text-muted);">
              <h3>${t("repNoReportSelected")}</h3>
              <p style="margin-top:10px;">${t("repSelectCategoryDesc")}</p>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind report card selections
    container.querySelectorAll(".report-selector-card").forEach(card => {
      card.addEventListener("click", () => {
        container.querySelectorAll(".report-selector-card").forEach(c => c.style.borderColor = "var(--border-color)");
        card.style.borderColor = "var(--primary-color)";
        
        const type = card.getAttribute("data-report");
        this.renderReportConfig(type);
      });
    });
  },

  renderReportConfig(type) {
    const detailsContainer = document.getElementById("report-details-container");
    const people = db.people.all().sort((a,b) => a.fullName.localeCompare(b.fullName));
    const families = db.families.all();
    const events = db.events.all();

    let configHtml = "";

    switch (type) {
      case "person":
        configHtml = `
          <h3>👤 ${t("personWiseReport")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t("repSelectPersonDesc")}</p>
          <div class="form-grid">
            <div class="form-group span-2">
              <label>${t("repSelectPerson")}</label>
              <select id="rep-param-person">
                ${people.map(p => `<option value="${p.id}">${p.fullName} (${t(p.relation)})</option>`).join("")}
              </select>
            </div>
          </div>
        `;
        break;

      case "family":
        configHtml = `
          <h3>👨‍👩‍👧‍👦 ${t("familyWiseReport")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t("repSelectFamilyDesc")}</p>
          <div class="form-grid">
            <div class="form-group span-2">
              <label>${t("repSelectFamily")}</label>
              <select id="rep-param-family">
                ${families.map(f => `<option value="${f.id}">${f.name}</option>`).join("")}
              </select>
            </div>
          </div>
        `;
        break;

      case "event":
        configHtml = `
          <h3>🗓️ ${t("eventWiseReport")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t("repSelectEventDesc")}</p>
          <div class="form-grid">
            <div class="form-group span-2">
              <label>${t("repSelectEvent")}</label>
              <select id="rep-param-event">
                ${events.map(e => `<option value="${e.id}">${e.name} (${e.date})</option>`).join("")}
              </select>
            </div>
          </div>
        `;
        break;

      case "wedding":
        const weddings = events.filter(e => e.type === "Wedding");
        configHtml = `
          <h3>💑 ${t("weddingReport")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t("repSelectWeddingDesc")}</p>
          <div class="form-grid">
            <div class="form-group span-2">
              <label>${t("repSelectWedding")}</label>
              <select id="rep-param-wedding">
                ${weddings.map(w => `<option value="${w.id}">${w.name} (${w.date})</option>`).join("")}
              </select>
            </div>
          </div>
        `;
        break;

      case "expense":
        configHtml = `
          <h3>💸 ${t("expenseReport")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t("repYearFilterDesc")}</p>
          <div class="form-grid">
            <div class="form-group span-2">
              <label>${t("repYearFilter")}</label>
              <select id="rep-param-year">
                <option value="">${t("repAllYears")}</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        `;
        break;

      case "gift":
        configHtml = `
          <h3>🎁 ${t("giftReport")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t("repExchangeModeDesc")}</p>
          <div class="form-grid">
            <div class="form-group span-2">
              <label>${t("repExchangeMode")}</label>
              <select id="rep-param-giftmode">
                <option value="both">${t("repBothModes")}</option>
                <option value="received">${t("received")}</option>
                <option value="given">${t("given")}</option>
              </select>
            </div>
          </div>
        `;
        break;
    }

    detailsContainer.innerHTML = `
      ${configHtml}
      
      <div style="display:flex; gap:12px; margin-top:20px; margin-bottom:24px;">
        <button class="btn-primary" id="rep-generate-btn">${t("generate")}</button>
      </div>

      <!-- REPORT DISPLAY BLOCK -->
      <div id="report-output-block" style="display:none; border-top: 1px solid var(--border-color); padding-top:24px;">
        <!-- Rendered dynamically -->
      </div>
    `;

    document.getElementById("rep-generate-btn").addEventListener("click", () => {
      this.generateReport(type);
    });
  },

  generateReport(type) {
    const outputBlock = document.getElementById("report-output-block");
    outputBlock.style.display = "block";

    let html = "";
    this.currentReportData = null; // Stored for CSV exports
    this.currentReportName = `Report_${type}_${Date.now()}`;

    if (type === "person") {
      const personId = document.getElementById("rep-param-person").value;
      const person = db.people.find(personId);
      const ledger = db.getPersonLedger(personId);

      this.currentReportData = {
        headers: ["Date", "Type", "Item/Description", "Occasion", "Amount (₹)"],
        rows: ledger.timeline.map(item => [
          item.date,
          item.type.toUpperCase(),
          item.title,
          item.occasion || "-",
          item.value
        ])
      };

      html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h4>Report: ${person.fullName}</h4>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="reportsView.exportCSV()">${t("exportCSV")}</button>
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="window.print()">Print PDF</button>
          </div>
        </div>

        <div style="display:flex; gap:16px; margin-bottom:20px;">
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">RECEIVED</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-received)">₹${ledger.totalReceived.toLocaleString("en-IN")}</div>
          </div>
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">GIVEN</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-given)">₹${ledger.totalGiven.toLocaleString("en-IN")}</div>
          </div>
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">SPENT ON THEM</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-spent)">₹${ledger.totalSpent.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Item/Description</th>
                <th>Occasion</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${ledger.timeline.map(item => `
                <tr>
                  <td>${item.date}</td>
                  <td><span class="badge ${item.type === "received" ? "primary" : item.type === "given" ? "saffron" : "info"}">${item.type.toUpperCase()}</span></td>
                  <td><strong>${item.title}</strong></td>
                  <td>${item.occasion || "-"}</td>
                  <td style="font-weight:700;" class="${item.type === "received" ? "received" : item.type === "given" ? "given" : "expense"}">
                    ₹${item.value.toLocaleString("en-IN")}
                  </td>
                </tr>
              `).join("")}
              ${ledger.timeline.length === 0 ? `<tr><td colspan="5" style="text-align:center;">No history recorded.</td></tr>` : ""}
            </tbody>
          </table>
        </div>
      `;
    } 
    
    else if (type === "family") {
      const familyId = document.getElementById("rep-param-family").value;
      const family = db.families.find(familyId);
      const members = db.people.all().filter(p => p.familyId === familyId);

      // Aggregate calculations
      let totalRec = 0;
      let totalGiv = 0;
      let totalSpent = 0;
      const memberRows = [];

      members.forEach(p => {
        const ledger = db.getPersonLedger(p.id);
        totalRec += ledger.totalReceived;
        totalGiv += ledger.totalGiven;
        totalSpent += ledger.totalSpent;
        memberRows.push({
          name: p.fullName,
          relation: p.relation,
          received: ledger.totalReceived,
          given: ledger.totalGiven,
          spent: ledger.totalSpent,
          balance: ledger.netBalance
        });
      });

      this.currentReportData = {
        headers: ["Member Name", "Relation", "Total Received (₹)", "Total Given (₹)", "Total Spent (₹)", "Net Balance (₹)"],
        rows: memberRows.map(m => [m.name, m.relation, m.received, m.given, m.spent, m.balance])
      };

      html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h4>Report: ${family.name} Summary</h4>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="reportsView.exportCSV()">${t("exportCSV")}</button>
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="window.print()">Print PDF</button>
          </div>
        </div>

        <div style="display:flex; gap:16px; margin-bottom:20px;">
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">FAMILY RECEIVED</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-received)">₹${totalRec.toLocaleString("en-IN")}</div>
          </div>
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">FAMILY GIVEN</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-given)">₹${totalGiv.toLocaleString("en-IN")}</div>
          </div>
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">TOTAL SPENT ON FAMILY</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-spent)">₹${totalSpent.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Relation</th>
                <th>Received</th>
                <th>Given</th>
                <th>Spent</th>
                <th>Net Balance</th>
              </tr>
            </thead>
            <tbody>
              ${memberRows.map(m => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td><span class="badge primary">${t(m.relation)}</span></td>
                  <td class="received">₹${m.received.toLocaleString("en-IN")}</td>
                  <td class="given">₹${m.given.toLocaleString("en-IN")}</td>
                  <td class="expense">₹${m.spent.toLocaleString("en-IN")}</td>
                  <td style="font-weight:700; color: ${m.balance >= 0 ? "var(--color-received)" : "var(--color-spent)"}">
                    ₹${m.balance.toLocaleString("en-IN")}
                  </td>
                </tr>
              `).join("")}
              ${memberRows.length === 0 ? `<tr><td colspan="6" style="text-align:center;">No family members listed.</td></tr>` : ""}
            </tbody>
          </table>
        </div>
      `;
    } 
    
    else if (type === "event" || type === "wedding") {
      const paramId = type === "event" ? "rep-param-event" : "rep-param-wedding";
      const eventId = document.getElementById(paramId).value;
      const event = db.events.find(eventId);

      if (!event) {
        outputBlock.innerHTML = `<h4>No event chosen.</h4>`;
        return;
      }

      const summary = eventsView.getEventSummary(eventId);
      
      this.currentReportData = {
        headers: ["Type", "Item Name / Description", "Category/GiftType", "Value / Cost (₹)"],
        rows: [
          ...summary.expenses.map(e => ["EXPENSE", e.description || e.subcategory || "Expense", e.category, e.amount]),
          ...db.giftsReceived.all().filter(g => g.eventId === eventId).map(g => ["GIFT_RECEIVED", g.giftName, g.giftType, g.estimatedValue]),
          ...db.giftsGiven.all().filter(g => g.eventId === eventId).map(g => ["GIFT_GIVEN", g.giftName, g.giftType, g.estimatedValue])
        ]
      };

      html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h4>Report: ${event.name} Event Summary</h4>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="reportsView.exportCSV()">${t("exportCSV")}</button>
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="window.print()">Print PDF</button>
          </div>
        </div>

        <div style="display:flex; gap:16px; margin-bottom:20px;">
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">EVENT BUDGET</div>
            <div style="font-size:1.2rem; font-weight:700;">₹${event.budget.toLocaleString("en-IN")}</div>
          </div>
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">TOTAL SPENT</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-spent)">₹${summary.totalExpenses.toLocaleString("en-IN")}</div>
          </div>
          <div style="flex-grow:1; text-align:center; padding:10px; background-color:var(--bg-input); border-radius:var(--radius-sm);">
            <div style="font-size:0.8rem; color:var(--text-muted);">GIFTS VALUE</div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--color-received)">₹${summary.totalGiftsReceived.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Item Name / Description</th>
                <th>Category / GiftType</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${this.currentReportData.rows.map(row => `
                <tr>
                  <td><span class="badge ${row[0] === "EXPENSE" ? "info" : row[0] === "GIFT_RECEIVED" ? "primary" : "saffron"}">${row[0]}</span></td>
                  <td><strong>${row[1]}</strong></td>
                  <td>${t(row[2])}</td>
                  <td style="font-weight:700;">₹${row[3].toLocaleString("en-IN")}</td>
                </tr>
              `).join("")}
              ${this.currentReportData.rows.length === 0 ? `<tr><td colspan="4" style="text-align:center;">No records linked to this event.</td></tr>` : ""}
            </tbody>
          </table>
        </div>
      `;
    } 
    
    else if (type === "expense") {
      const year = document.getElementById("rep-param-year").value;
      let expenses = db.expenses.all();

      if (year) {
        expenses = expenses.filter(e => e.date.startsWith(year));
      }

      // Group totals
      const totals = {};
      expenses.forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      });

      this.currentReportData = {
        headers: ["Category", "Amount spent (₹)"],
        rows: Object.entries(totals)
      };

      html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h4>Expenses Category Breakdown ${year ? `(${year})` : "(All time)"}</h4>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="reportsView.exportCSV()">${t("exportCSV")}</button>
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="window.print()">Print PDF</button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(totals).map(([cat, amt]) => `
                <tr>
                  <td><strong>${t(cat)}</strong></td>
                  <td style="font-weight:700;" class="expense">₹${amt.toLocaleString("en-IN")}</td>
                </tr>
              `).join("")}
              ${Object.keys(totals).length === 0 ? `<tr><td colspan="2" style="text-align:center;">No expenses recorded.</td></tr>` : ""}
            </tbody>
          </table>
        </div>
      `;
    } 
    
    else if (type === "gift") {
      const mode = document.getElementById("rep-param-giftmode").value;
      let received = db.giftsReceived.all();
      let given = db.giftsGiven.all();

      const totals = {};
      const giftTypes = ["Cash", "Gold", "Silver", "Clothes", "Electronics", "Property", "Jewellery", "Custom Item", "Other"];
      
      giftTypes.forEach(t => {
        totals[t] = { received: 0, given: 0 };
      });

      received.forEach(g => {
        if (totals[g.giftType]) totals[g.giftType].received += g.estimatedValue;
      });
      given.forEach(g => {
        if (totals[g.giftType]) totals[g.giftType].given += g.estimatedValue;
      });

      this.currentReportData = {
        headers: ["Gift Type", "Received Value (₹)", "Given Value (₹)"],
        rows: Object.entries(totals).map(([type, val]) => [type, val.received, val.given])
      };

      html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h4>Gift Ornaments & Cash Exchange Summary</h4>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="reportsView.exportCSV()">${t("exportCSV")}</button>
            <button class="btn-secondary" style="padding:6px 12px; font-size:0.85rem;" onclick="window.print()">Print PDF</button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Gift Type</th>
                ${mode === "both" || mode === "received" ? `<th>Total Received</th>` : ""}
                ${mode === "both" || mode === "given" ? `<th>Total Given</th>` : ""}
              </tr>
            </thead>
            <tbody>
              ${Object.entries(totals).map(([type, val]) => `
                <tr>
                  <td><strong>${t(type)}</strong></td>
                  ${mode === "both" || mode === "received" ? `<td class="received" style="font-weight:700;">₹${val.received.toLocaleString("en-IN")}</td>` : ""}
                  ${mode === "both" || mode === "given" ? `<td class="given" style="font-weight:700;">₹${val.given.toLocaleString("en-IN")}</td>` : ""}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    outputBlock.innerHTML = html;
  },

  // High performance client-side CSV download
  exportCSV() {
    if (!this.currentReportData) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Write headers
    csvContent += this.currentReportData.headers.join(",") + "\n";

    // Write rows
    this.currentReportData.rows.forEach(row => {
      // Escape strings containing commas
      const escapedRow = row.map(val => {
        if (typeof val === "string") {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvContent += escapedRow.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${this.currentReportName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
