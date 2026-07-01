// Dashboard View Controller (Dashboard 2.0 Command Center & Date Explorer)
const dashboardView = {
  render(container) {
    const people = db.people.all();
    const expenses = db.expenses.all();
    const giftsReceived = db.giftsReceived.all();
    const giftsGiven = db.giftsGiven.all();
    const events = db.events.all();

    const totalPeople = people.length;
    if (totalPeople === 0) {
      container.innerHTML = `
        <div class="view-wrapper" style="max-width: 600px; margin: 40px auto; text-align: center; padding: 40px; background-color: var(--bg-card); border-radius: var(--radius-md); border: var(--border-glass); box-shadow: var(--card-shadow);">
          <div style="font-size: 4rem; margin-bottom: 20px;">👋</div>
          <h2 style="margin-bottom: 12px; font-family: var(--font-display); font-size: 1.8rem; color: var(--text-primary);">
            Welcome to Family Relationship Ledger
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px; font-size: 0.95rem; line-height: 1.6;">
            Track your family tree, gifts received/given, return gift decisions, weddings, and relationship ledger summaries in a single place.
          </p>

          <div style="text-align: left; background-color: var(--bg-input); padding: 20px; border-radius: var(--radius-md); margin-bottom: 30px;">
            <h4 style="margin-bottom: 12px; color: var(--text-primary);">⚡ Quick Start Guide / जलद सुरुवात:</h4>
            <ol style="margin-left: 20px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
              <li><strong>Add Family Members</strong> (Build your directory)</li>
              <li><strong>Create Event Milestones</strong> (Weddings, Anniversaries, Festivals)</li>
              <li><strong>Track Gifts Received & Given</strong> (Keep ledger balances in check)</li>
              <li><strong>Record Shared Expenses</strong> (Manage vendors & catering costs)</li>
            </ol>
          </div>

          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" id="onboard-add-person" style="padding: 12px 24px; font-weight: 700;">
              👤 Add First Person / नवीन व्यक्ती जोडा
            </button>
            <button class="btn-secondary" id="onboard-seed-data" style="padding: 12px 24px; font-weight: 700;">
              ⚡ Load Demo Patil Family Ledger / डेमो डेटा लोड करा
            </button>
          </div>
        </div>
      `;

      container.querySelector("#onboard-add-person").addEventListener("click", () => {
        peopleView.openAddModal();
      });

      container.querySelector("#onboard-seed-data").addEventListener("click", () => {
        db.reset();
        window.app.navigateTo("dashboard");
      });
      return;
    }

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalGiftsRec = giftsReceived.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    const totalGiftsGiv = giftsGiven.reduce((acc, curr) => acc + curr.estimatedValue, 0);

    // reminders data
    const birthdays = this.getUpcomingBirthdays(people);
    const anniversaries = this.getUpcomingAnniversaries(people);

    // compile dynamic alerts based on settings toggles
    const activeNotifications = this.generateNotifications();

    // Consolidated Recent Activity: merge and sort last 10 entries of gifts received, gifts given, and expenses
    const recentActivities = [];

    giftsReceived.forEach(g => {
      const person = db.people.find(g.personId);
      recentActivities.push({
        name: person ? person.fullName : "Unknown",
        amount: g.estimatedValue,
        date: g.date,
        type: "received",
        icon: "📥",
        label: t("giftsReceived")
      });
    });

    giftsGiven.forEach(g => {
      const person = db.people.find(g.personId);
      recentActivities.push({
        name: person ? person.fullName : "Unknown",
        amount: g.estimatedValue,
        date: g.date,
        type: "given",
        icon: "📤",
        label: t("giftsGiven")
      });
    });

    expenses.forEach(e => {
      recentActivities.push({
        name: e.subcategory || t(e.category),
        amount: e.amount,
        date: e.date,
        type: "expense",
        icon: "💸",
        label: t("expenses")
      });
    });

    const sortedActivities = recentActivities
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);

    container.innerHTML = `
      <style>
        /* Dashboard Grid Layouts */
        .dash-reminders-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        @media (max-width: 768px) {
          .dash-reminders-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Floating Action Button (FAB) */
        .fab-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        .fab-menu {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fab-container.active .fab-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .fab-action {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .fab-action:hover {
          background-color: var(--bg-input);
          transform: scale(1.05);
        }
        .fab-trigger {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: 0 4px 16px rgba(108, 92, 231, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .fab-container.active .fab-trigger {
          background-color: var(--color-spent);
          transform: rotate(135deg);
        }
        .fab-trigger svg {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }

        /* Responsive Polish to ensure FAB does not overlap bottom navigation bar on mobile */
        @media (max-width: 768px) {
          .fab-container {
            bottom: 84px; /* Shift above the 60px bottom navigation bar */
            right: 16px;
          }
        }
      </style>

      <div class="view-wrapper">
        
        <!-- DASHBOARD NOTIFICATION CENTER -->
        ${this.renderNotificationCenter(activeNotifications)}

        <!-- 1. SUMMARY CARDS -->
        <div class="stats-grid" style="margin-bottom: 24px;">
          <div class="stat-card">
            <div class="stat-title">${t("totalPeople")}</div>
            <div class="stat-value">${totalPeople}</div>
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div class="stat-card">
            <div class="stat-title">${t("totalGiftsReceived")}</div>
            <div class="stat-value">₹${totalGiftsRec.toLocaleString("en-IN")}</div>
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div class="stat-card">
            <div class="stat-title">${t("totalGiftsGiven")}</div>
            <div class="stat-value">₹${totalGiftsGiv.toLocaleString("en-IN")}</div>
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4M5 20h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" /></svg>
          </div>
          <div class="stat-card">
            <div class="stat-title">${t("totalExpenses")}</div>
            <div class="stat-value">₹${totalExpenses.toLocaleString("en-IN")}</div>
            <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6m0 0h4m-4 0a3 3 0 110-6m0 6v3m3-3v3m2-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        <!-- GLOBAL DATE SEARCH & EXPLORER WIDGET -->
        <div class="card-section" style="margin-bottom: 24px;">
          <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            📅 Search By Date / दिनांक-आधारित शोध
          </h3>
          
          <!-- Mode Select & Date Inputs -->
          <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; align-items: flex-end;">
            <div class="form-group" style="flex: 1; min-width: 150px;">
              <label>Search Mode / पद्धती</label>
              <select id="explorer-mode" style="padding: 10px; font-weight:600;">
                <option value="single">Single Date / एक तारीख</option>
                <option value="range" selected>Date Range / तारीख श्रेणी</option>
              </select>
            </div>
            
            <div class="form-group" id="explorer-single-group" style="flex: 1; min-width: 150px; display: none;">
              <label>Select Date / तारीख निवडा</label>
              <input type="date" id="explorer-single-date" value="2026-07-01">
            </div>

            <div class="form-group explorer-range-group" style="flex: 1; min-width: 150px;">
              <label>Start Date / सुरुवात तारीख</label>
              <input type="date" id="explorer-start-date" value="2026-01-01">
            </div>
            
            <div class="form-group explorer-range-group" style="flex: 1; min-width: 150px;">
              <label>End Date / शेवट तारीख</label>
              <input type="date" id="explorer-end-date" value="2026-12-31">
            </div>
          </div>

          <!-- Advanced Filters & Sorting -->
          <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; align-items: flex-end;">
            <div class="form-group" style="flex: 1; min-width: 150px;">
              <label>Filter By / फिल्टर</label>
              <select id="explorer-filter" style="padding: 10px;">
                <option value="all">All Activities / सर्व</option>
                <option value="received">Gifts Received / मिळालेल्या भेटवस्तू</option>
                <option value="given">Gifts Given / दिलेल्या भेटवस्तू</option>
                <option value="expense">Expenses / खर्च</option>
                <option value="event">Events / कार्यक्रम</option>
                <option value="birthday">Birthdays / वाढदिवस</option>
                <option value="anniversary">Anniversaries / लग्नाचे वाढदिवस</option>
              </select>
            </div>

            <div class="form-group" style="flex: 1; min-width: 150px;">
              <label>Sort By / क्रमवारी</label>
              <select id="explorer-sort" style="padding: 10px;">
                <option value="newest">Newest First / नवीन आधी</option>
                <option value="oldest">Oldest First / जुने आधी</option>
                <option value="high-low">Amount: High to Low / रक्कम: जास्त ते कमी</option>
                <option value="low-high">Amount: Low to High / रक्कम: कमी ते जास्त</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" id="explorer-search-btn" style="padding: 10px 20px; font-weight:700;">🔍 Search</button>
              <button class="btn-secondary" id="explorer-export-csv" style="padding: 10px 14px;">CSV</button>
              <button class="btn-secondary" id="explorer-export-json" style="padding: 10px 14px;">JSON</button>
            </div>
          </div>

          <!-- Range Aggregates Box -->
          <div id="explorer-range-aggregates" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 20px; padding: 16px; background-color: var(--bg-input); border-radius: var(--radius-md);">
            <!-- Filled dynamically -->
          </div>

          <!-- Search Results List -->
          <div id="explorer-results" style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;">
            <!-- Filled dynamically -->
          </div>
        </div>

        <!-- 2 & 3. UPCOMING REMINDERS SECTIONS -->
        <div class="dash-reminders-grid">
          
          <!-- UPCOMING BIRTHDAYS -->
          <div class="card-section">
            <h3 style="margin-bottom:16px;">🎂 ${t("upcomingBirthdays")}</h3>
            <div class="feed-list">
              ${birthdays.length === 0 ? `
                <div style="color: var(--text-secondary); text-align: center; padding: 20px 0;">${t("noEvents")}</div>
              ` : ""}
              ${birthdays.map(m => {
                const daysText = m.daysRemaining === 0 ? (getLanguage() === "mr" ? "आज आहे!" : "Today!") :
                                 m.daysRemaining === 1 ? (getLanguage() === "mr" ? "उद्या!" : "Tomorrow!") :
                                 (getLanguage() === "mr" ? `${m.daysRemaining} दिवस शिल्लक` : `${m.daysRemaining} days remaining`);
                const valColor = m.daysRemaining <= 7 ? "var(--color-spent)" : "var(--text-secondary)";
                return `
                  <div class="feed-item" onclick="navigateToView('personProfile', {id: '${m.id}'})" style="cursor: pointer;">
                    <div class="feed-icon-circle event">🎂</div>
                    <div class="feed-details">
                      <div class="feed-title">${m.fullName}</div>
                      <div class="feed-subtitle">${t(m.relation)} • ${this.formatDayMonth(m.date)}</div>
                    </div>
                    <div class="feed-amount" style="font-size: 0.85rem; color: ${valColor}; font-weight: 700;">
                      ${daysText}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- UPCOMING ANNIVERSARIES -->
          <div class="card-section">
            <h3 style="margin-bottom:16px;">💑 ${t("upcomingAnniversaries")}</h3>
            <div class="feed-list">
              ${anniversaries.length === 0 ? `
                <div style="color: var(--text-secondary); text-align: center; padding: 20px 0;">${t("noEvents")}</div>
              ` : ""}
              ${anniversaries.map(m => {
                const daysText = m.daysRemaining === 0 ? (getLanguage() === "mr" ? "आज आहे!" : "Today!") :
                                 m.daysRemaining === 1 ? (getLanguage() === "mr" ? "उद्या!" : "Tomorrow!") :
                                 (getLanguage() === "mr" ? `${m.daysRemaining} दिवस शिल्लक` : `${m.daysRemaining} days remaining`);
                const valColor = m.daysRemaining <= 7 ? "var(--color-spent)" : "var(--text-secondary)";
                return `
                  <div class="feed-item" onclick="navigateToView('personProfile', {id: '${m.id}'})" style="cursor: pointer;">
                    <div class="feed-icon-circle event">💑</div>
                    <div class="feed-details">
                      <div class="feed-title">${m.fullName} & Family</div>
                      <div class="feed-subtitle">${t(m.relation)} • ${this.formatDayMonth(m.date)}</div>
                    </div>
                    <div class="feed-amount" style="font-size: 0.85rem; color: ${valColor}; font-weight: 700;">
                      ${daysText}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

        </div>

        <!-- 4. UNIFIED RECENT ACTIVITY (MAX 10 ENTRIES) -->
        <div class="card-section" style="margin-top: 24px;">
          <h3 style="margin-bottom:16px;">⚡ ${t("recentActivity")}</h3>
          <div class="feed-list">
            ${sortedActivities.map(act => {
              let colorClass = act.type; // received, given, expense
              return `
                <div class="feed-item" style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <div class="feed-icon-circle ${colorClass}">${act.icon}</div>
                    <div>
                      <div class="feed-title" style="font-weight: 700;">${act.name}</div>
                      <div class="feed-subtitle" style="font-size: 0.85rem; color: var(--text-secondary);">${act.label} • ${act.date}</div>
                    </div>
                  </div>
                  <div class="feed-amount ${colorClass}" style="font-weight: 800; font-size: 1.15rem; font-family: var(--font-display);">
                    ₹${act.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              `;
            }).join("")}
            ${sortedActivities.length === 0 ? `
              <div style="color: var(--text-secondary); text-align: center; padding: 20px 0;">No recent activities found.</div>
            ` : ""}
          </div>
        </div>

        <!-- 5. QUICK ACTION FLOATING ACTION BUTTON (FAB) -->
        <div class="fab-container" id="dashboard-fab-container">
          <div class="fab-menu">
            <div class="fab-action" id="fab-qa-person">
              <span>👤 ${t("addPerson")}</span>
            </div>
            <div class="fab-action" id="fab-qa-gift-rec">
              <span>📥 ${t("addGiftReceived")}</span>
            </div>
            <div class="fab-action" id="fab-qa-gift-giv">
              <span>📤 ${t("addGiftGiven")}</span>
            </div>
            <div class="fab-action" id="fab-qa-expense">
              <span>💸 ${t("addExpense")}</span>
            </div>
            <div class="fab-action" id="fab-qa-event">
              <span>🗓️ ${t("addEvent")}</span>
            </div>
          </div>
          <button class="fab-trigger" id="fab-main-trigger">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

      </div>
    `;

    // Bind FAB Actions
    const fabContainer = document.getElementById("dashboard-fab-container");
    const fabTrigger = document.getElementById("fab-main-trigger");

    fabTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      fabContainer.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      fabContainer.classList.remove("active");
    });

    document.getElementById("fab-qa-person").addEventListener("click", () => {
      peopleView.openAddModal();
    });
    document.getElementById("fab-qa-gift-rec").addEventListener("click", () => {
      giftsView.openAddModal("received");
    });
    document.getElementById("fab-qa-gift-giv").addEventListener("click", () => {
      giftsView.openAddModal("given");
    });
    document.getElementById("fab-qa-expense").addEventListener("click", () => {
      expensesView.openAddModal();
    });
    document.getElementById("fab-qa-event").addEventListener("click", () => {
      eventsView.openAddModal();
    });

    // Bind Date Explorer Actions
    this.bindExplorer(container);
  },

  bindExplorer(container) {
    const modeSelect = container.querySelector("#explorer-mode");
    const singleGroup = container.querySelector("#explorer-single-group");
    const rangeGroups = container.querySelectorAll(".explorer-range-group");
    const rangeAggs = container.querySelector("#explorer-range-aggregates");
    const resultsContainer = container.querySelector("#explorer-results");
    
    // Toggle single date vs date range inputs
    modeSelect.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "single") {
        singleGroup.style.display = "block";
        rangeGroups.forEach(g => g.style.display = "none");
        rangeAggs.style.display = "none";
      } else {
        singleGroup.style.display = "none";
        rangeGroups.forEach(g => g.style.display = "block");
        rangeAggs.style.display = "grid";
      }
    });

    const runSearch = () => {
      const mode = modeSelect.value;
      let start, end;
      
      if (mode === "single") {
        const val = container.querySelector("#explorer-single-date").value;
        start = val;
        end = val;
      } else {
        start = container.querySelector("#explorer-start-date").value;
        end = container.querySelector("#explorer-end-date").value;
      }

      if (!start || !end) return;

      // Compile raw matches
      let matches = this.compileAllActivities(start, end);

      // Filter by type
      const filter = container.querySelector("#explorer-filter").value;
      if (filter !== "all") {
        matches = matches.filter(m => m.type === filter);
      }

      // Sort
      const sort = container.querySelector("#explorer-sort").value;
      if (sort === "newest") {
        matches.sort((a, b) => b.date.localeCompare(a.date));
      } else if (sort === "oldest") {
        matches.sort((a, b) => a.date.localeCompare(b.date));
      } else if (sort === "high-low") {
        matches.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      } else if (sort === "low-high") {
        matches.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      }

      // Update Aggregates
      if (mode === "range") {
        const recTotal = matches.filter(m => m.type === "received").reduce((sum, m) => sum + (m.amount || 0), 0);
        const givTotal = matches.filter(m => m.type === "given").reduce((sum, m) => sum + (m.amount || 0), 0);
        const expTotal = matches.filter(m => m.type === "expense").reduce((sum, m) => sum + (m.amount || 0), 0);
        const evCount = matches.filter(m => m.type === "event").length;
        
        rangeAggs.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-secondary);">📥 Received</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--color-received); margin-top:4px;">₹${recTotal.toLocaleString("en-IN")}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-secondary);">📤 Given</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--color-given); margin-top:4px;">₹${givTotal.toLocaleString("en-IN")}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-secondary);">💸 Spent</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--color-spent); margin-top:4px;">₹${expTotal.toLocaleString("en-IN")}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-secondary);">📅 Events</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--primary-color); margin-top:4px;">${evCount}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-secondary);">⚡ Total Items</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-top:4px;">${matches.length}</div>
          </div>
        `;
      }

      // Render Results
      if (matches.length === 0) {
        resultsContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-secondary);">No results found.</div>`;
      } else {
        resultsContainer.innerHTML = matches.map(m => {
          let dotColor = "var(--border-focus)";
          if (m.type === "received") dotColor = "var(--color-received)";
          else if (m.type === "given") dotColor = "var(--color-given)";
          else if (m.type === "expense") dotColor = "var(--color-spent)";
          else if (m.type === "event") dotColor = "var(--primary-color)";
          else if (m.type === "birthday") dotColor = "var(--color-spent)";
          else if (m.type === "anniversary") dotColor = "var(--color-given)";

          return `
            <div class="feed-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-left:4px solid ${dotColor};">
              <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-size:1.2rem;">${m.icon}</span>
                <div>
                  <div style="font-weight:700; font-size:0.95rem;">${m.title}</div>
                  <div style="font-size:0.8rem; color:var(--text-secondary);">${m.date} ${m.notes ? `• <i>${m.notes}</i>` : ""}</div>
                </div>
              </div>
              <div style="font-family:var(--font-display); font-weight:800; font-size:1.05rem; color:${m.type === "received" ? "var(--color-received)" : m.type === "given" ? "var(--color-given)" : m.type === "expense" ? "var(--color-spent)" : "var(--text-main)"}">
                ${m.amount ? `₹${m.amount.toLocaleString("en-IN")}` : ""}
              </div>
            </div>
          `;
        }).join("");
      }

      this._lastSearchMatches = matches;
    };

    container.querySelector("#explorer-search-btn").addEventListener("click", runSearch);
    
    // Bind Exports
    container.querySelector("#explorer-export-json").addEventListener("click", () => {
      const data = this._lastSearchMatches || [];
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `date_search_export_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    container.querySelector("#explorer-export-csv").addEventListener("click", () => {
      const data = this._lastSearchMatches || [];
      let csvContent = "Type,Title,Date,Amount,Occasion,Notes\n";
      data.forEach(item => {
        const row = [
          item.type,
          `"${(item.title || "").replace(/"/g, '""')}"`,
          item.date,
          item.amount || 0,
          `"${(item.occasion || "").replace(/"/g, '""')}"`,
          `"${(item.notes || "").replace(/"/g, '""')}"`
        ];
        csvContent += row.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `date_search_export_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Run initial search
    runSearch();
  },

  compileAllActivities(startDateStr, endDateStr) {
    const people = db.people.all();
    const giftsReceived = db.giftsReceived.all();
    const giftsGiven = db.giftsGiven.all();
    const expenses = db.expenses.all();
    const events = db.events.all();

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const list = [];

    // 1. Gifts Received
    giftsReceived.forEach(g => {
      const d = new Date(g.date);
      if (d >= start && d <= end) {
        const person = db.people.find(g.personId);
        list.push({
          type: "received",
          icon: "🎁",
          title: `Gift Received: ${g.giftName} from ${person ? person.fullName : "Unknown"}`,
          date: g.date,
          amount: g.estimatedValue,
          occasion: g.occasion,
          notes: g.description || g.notes
        });
      }
    });

    // 2. Gifts Given
    giftsGiven.forEach(g => {
      const d = new Date(g.date);
      if (d >= start && d <= end) {
        const person = db.people.find(g.personId);
        list.push({
          type: "given",
          icon: "🎁",
          title: `Gift Given: ${g.giftName} to ${person ? person.fullName : "Unknown"}`,
          date: g.date,
          amount: g.estimatedValue,
          occasion: g.occasion,
          notes: g.description || g.notes
        });
      }
    });

    // 3. Expenses
    expenses.forEach(e => {
      const d = new Date(e.date);
      if (d >= start && d <= end) {
        list.push({
          type: "expense",
          icon: "💰",
          title: `Expense: ${e.category} (${e.subcategory || e.vendor || ""})`,
          date: e.date,
          amount: e.amount,
          occasion: e.eventId ? (db.events.find(e.eventId)?.name || "") : "",
          notes: e.description || e.notes
        });
      }
    });

    // 4. Events
    events.forEach(ev => {
      const d = new Date(ev.date);
      if (d >= start && d <= end) {
        list.push({
          type: "event",
          icon: "📅",
          title: `Event: ${ev.name}`,
          date: ev.date,
          amount: ev.budget || 0,
          occasion: ev.name,
          notes: `${ev.type} at ${ev.location}. ${ev.description}`
        });
      }
    });

    // 5. Birthdays & Anniversaries
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    for (let y = startYear; y <= endYear; y++) {
      people.forEach(p => {
        if (p.birthDate) {
          const parts = p.birthDate.split("-");
          if (parts.length === 3) {
            const bday = new Date(y, parseInt(parts[1]) - 1, parseInt(parts[2]));
            if (bday >= start && bday <= end) {
              const formattedDate = `${y}-${parts[1]}-${parts[2]}`;
              list.push({
                type: "birthday",
                icon: "🎂",
                title: `${p.fullName}'s Birthday`,
                date: formattedDate,
                amount: 0,
                notes: `Turning ${y - parseInt(parts[0])} years old!`
              });
            }
          }
        }

        if (p.anniversaryDate) {
          const parts = p.anniversaryDate.split("-");
          if (parts.length === 3) {
            const anniv = new Date(y, parseInt(parts[1]) - 1, parseInt(parts[2]));
            if (anniv >= start && anniv <= end) {
              const formattedDate = `${y}-${parts[1]}-${parts[2]}`;
              list.push({
                type: "anniversary",
                icon: "💐",
                title: `${p.fullName}'s Anniversary`,
                date: formattedDate,
                amount: 0,
                notes: `${y - parseInt(parts[0])} years of marriage celebration!`
              });
            }
          }
        }
      });
    }

    return list;
  },

  getSettings() {
    return {
      birthday: localStorage.getItem("family_ledger_notif_birthday") !== "false",
      anniversary: localStorage.getItem("family_ledger_notif_anniversary") !== "false",
      event: localStorage.getItem("family_ledger_notif_event") !== "false",
      followup: localStorage.getItem("family_ledger_notif_followup") !== "false"
    };
  },

  generateNotifications() {
    const settings = this.getSettings();
    const people = db.people.all();
    const events = db.events.all();
    const giftsReceived = db.giftsReceived.all();

    const notifications = [];

    const getDaysRemaining = (targetDateStr) => {
      if (!targetDateStr) return null;
      const parts = targetDateStr.split("-");
      if (parts.length !== 3) return null;

      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);

      const today = new Date();
      const currentYear = today.getFullYear();

      let occurrence = new Date(currentYear, month - 1, day);
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (occurrence < todayMidnight) {
        occurrence.setFullYear(currentYear + 1);
      }

      const diffTime = occurrence - todayMidnight;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getEventDaysRemaining = (eventDateStr) => {
      if (!eventDateStr) return null;
      const today = new Date();
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const parts = eventDateStr.split("-");
      if (parts.length !== 3) return null;
      const eventDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      if (eventDate < todayMidnight) return -1; // Passed

      const diffTime = eventDate - todayMidnight;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    // 1. Birthdays
    if (settings.birthday) {
      people.forEach(p => {
        if (p.birthDate) {
          const days = getDaysRemaining(p.birthDate);
          if ([0, 1, 7, 30].includes(days)) {
            notifications.push({
              id: `b-${p.id}-${days}`,
              personId: p.id,
              type: "birthday",
              daysRemaining: days,
              title: p.fullName,
              dateStr: p.birthDate,
              textEn: days === 0 ? `Today is ${p.fullName}'s Birthday` :
                      days === 1 ? `${p.fullName}'s Birthday Tomorrow` :
                      `${p.fullName}'s Birthday in ${days} days`,
              textMr: days === 0 ? `आज ${p.fullName} यांचा वाढदिवस आहे!` :
                      days === 1 ? `उद्या ${p.fullName} यांचा वाढदिवस आहे!` :
                      `${days} दिवसात ${p.fullName} यांचा वाढदिवस आहे`
            });
          }
        }
      });
    }

    // 2. Anniversaries
    if (settings.anniversary) {
      people.forEach(p => {
        if (p.anniversaryDate) {
          const days = getDaysRemaining(p.anniversaryDate);
          if ([0, 1, 7, 30].includes(days)) {
            notifications.push({
              id: `a-${p.id}-${days}`,
              personId: p.id,
              type: "anniversary",
              daysRemaining: days,
              title: p.fullName,
              dateStr: p.anniversaryDate,
              textEn: days === 0 ? `Today is ${p.fullName}'s Anniversary` :
                      days === 1 ? `${p.fullName}'s Anniversary Tomorrow` :
                      `${p.fullName}'s Anniversary in ${days} days`,
              textMr: days === 0 ? `आज ${p.fullName} यांचा लग्नाचा वाढदिवस आहे!` :
                      days === 1 ? `उद्या ${p.fullName} यांचा लग्नाचा वाढदिवस आहे!` :
                      `${days} दिवसात ${p.fullName} यांचा लग्नाचा वाढदिवस आहे`
            });
          }
        }
      });
    }

    // 3. Events
    if (settings.event) {
      events.forEach(e => {
        if (e.date) {
          const days = getEventDaysRemaining(e.date);
          if ([0, 1, 7, 30].includes(days)) {
            notifications.push({
              id: `e-${e.id}-${days}`,
              eventId: e.id,
              type: "event",
              daysRemaining: days,
              title: e.name,
              dateStr: e.date,
              textEn: days === 0 ? `Today is the event: ${e.name}` :
                      days === 1 ? `Event tomorrow: ${e.name}` :
                      `Event: ${e.name} in ${days} days`,
              textMr: days === 0 ? `आज कार्यक्रम आहे: ${e.name}` :
                      days === 1 ? `उद्या कार्यक्रम आहे: ${e.name}` :
                      `कार्यक्रम: ${days} दिवसात ${e.name} आहे`
            });
          }
        }
      });
    }

    // 4. Gift Follow-Ups
    if (settings.followup) {
      people.forEach(p => {
        let upcomingType = null;
        let days = null;
        
        if (p.birthDate) {
          days = getDaysRemaining(p.birthDate);
          if ([0, 1, 7, 30].includes(days)) upcomingType = "birthday";
        }
        
        if (!upcomingType && p.anniversaryDate) {
          days = getDaysRemaining(p.anniversaryDate);
          if ([0, 1, 7, 30].includes(days)) upcomingType = "anniversary";
        }

        if (upcomingType) {
          const personGifts = giftsReceived.filter(g => g.personId === p.id);
          if (personGifts.length > 0) {
            personGifts.sort((a, b) => b.date.localeCompare(a.date));
            const lastGift = personGifts[0];
            const yearStr = lastGift.date ? lastGift.date.split("-")[0] : "";
            
            notifications.push({
              id: `f-${p.id}-${upcomingType}-${days}`,
              personId: p.id,
              type: "followup",
              daysRemaining: days,
              title: p.fullName,
              textEn: `🎁 Last gift from ${p.fullName}: ₹${lastGift.estimatedValue.toLocaleString("en-IN")} (${yearStr}). Suggested follow-up reminder.`,
              textMr: `🎁 ${p.fullName} कडून शेवटची भेट: ₹${lastGift.estimatedValue.toLocaleString("en-IN")} (${yearStr}). फॉलो-अप भेट देण्याची सूचना.`
            });
          }
        }
      });
    }

    notifications.sort((a, b) => a.daysRemaining - b.daysRemaining);
    return notifications;
  },

  renderNotificationCenter(notifications) {
    if (notifications.length === 0) return "";

    const todayNotifs = notifications.filter(n => n.daysRemaining === 0);
    const tomorrowNotifs = notifications.filter(n => n.daysRemaining === 1);
    const upcoming7Notifs = notifications.filter(n => n.daysRemaining === 7);
    const upcoming30Notifs = notifications.filter(n => n.daysRemaining === 30);

    const renderGroupHtml = (title, items, borderStyle, badgeColor, badgeBg) => {
      if (items.length === 0) return "";
      return `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.8rem; font-weight: 800; color: ${badgeColor}; text-transform: uppercase; margin-bottom: 8px; display: inline-block; padding: 2px 8px; background-color: ${badgeBg}; border-radius: 4px;">
            ${title}
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${items.map(n => {
              const text = getLanguage() === "mr" ? n.textMr || n.textEn : n.textEn;
              let emoji = "🔔";
              if (n.type === "birthday") emoji = "🎂";
              else if (n.type === "anniversary") emoji = "💑";
              else if (n.type === "event") emoji = "🗓️";
              else if (n.type === "followup") emoji = "🎁";

              const clickAction = n.personId 
                ? `onclick="navigateToView('personProfile', {id: '${n.personId}'})"` 
                : n.eventId 
                  ? `onclick="navigateToView('events', {id: '${n.eventId}'})"` 
                  : "";

              return `
                <div class="feed-item" ${clickAction} style="padding: 12px 16px; border-left: 4px solid ${borderStyle}; background-color: var(--bg-card); display: flex; align-items: center; gap: 12px; cursor: ${clickAction ? "pointer" : "default"}; transition: transform var(--transition-fast);">
                  <span style="font-size: 1.2rem; flex-shrink: 0;">${emoji}</span>
                  <span style="font-size: 0.92rem; color: var(--text-main); font-weight: 600;">${text}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    };

    return `
      <div class="card-section" style="margin-bottom: 24px; padding: 24px; border: 1px solid var(--border-color); background: rgba(58, 28, 113, 0.02);">
        <h4 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-size: 1.1rem;">
          🔔 Notifications / सूचना केंद्र
        </h4>
        ${renderGroupHtml(getLanguage() === "mr" ? "आज" : "Today", todayNotifs, "var(--color-spent)", "var(--color-spent)", "rgba(231,76,60,0.08)")}
        ${renderGroupHtml(getLanguage() === "mr" ? "उद्या" : "Tomorrow", tomorrowNotifs, "var(--color-given)", "var(--color-given)", "rgba(243,156,18,0.08)")}
        ${renderGroupHtml(getLanguage() === "mr" ? "७ दिवस" : "7 Days", upcoming7Notifs, "rgba(58, 28, 113, 0.6)", "var(--primary-color)", "rgba(58,28,113,0.08)")}
        ${renderGroupHtml(getLanguage() === "mr" ? "३० दिवस" : "30 Days", upcoming30Notifs, "rgba(58, 28, 113, 0.6)", "var(--primary-color)", "rgba(58,28,113,0.08)")}
      </div>
    `;
  },

  getUpcomingMilestones(people) {
    const list = [];
    people.forEach(p => {
      if (p.birthDate) {
        const details = this.getNextOccurrence(p.birthDate);
        if (details) {
          list.push({
            id: p.id,
            fullName: p.fullName,
            relation: p.relation,
            type: "birthday",
            date: p.birthDate,
            nextDate: details.date,
            daysRemaining: details.daysRemaining
          });
        }
      }
      if (p.anniversaryDate) {
        const details = this.getNextOccurrence(p.anniversaryDate);
        if (details) {
          list.push({
            id: p.id,
            fullName: p.fullName,
            relation: p.relation,
            type: "anniversary",
            date: p.anniversaryDate,
            nextDate: details.date,
            daysRemaining: details.daysRemaining
          });
        }
      }
    });

    list.sort((a, b) => a.daysRemaining - b.daysRemaining);
    return list;
  },

  getUpcomingBirthdays(people) {
    const list = [];
    people.forEach(p => {
      if (p.birthDate) {
        const details = this.getNextOccurrence(p.birthDate);
        if (details) {
          list.push({
            id: p.id,
            fullName: p.fullName,
            relation: p.relation,
            type: "birthday",
            date: p.birthDate,
            nextDate: details.date,
            daysRemaining: details.daysRemaining
          });
        }
      }
    });
    list.sort((a, b) => a.daysRemaining - b.daysRemaining);
    return list.slice(0, 10);
  },

  getUpcomingAnniversaries(people) {
    const list = [];
    people.forEach(p => {
      if (p.anniversaryDate) {
        const details = this.getNextOccurrence(p.anniversaryDate);
        if (details) {
          list.push({
            id: p.id,
            fullName: p.fullName,
            relation: p.relation,
            type: "anniversary",
            date: p.anniversaryDate,
            nextDate: details.date,
            daysRemaining: details.daysRemaining
          });
        }
      }
    });
    list.sort((a, b) => a.daysRemaining - b.daysRemaining);
    return list.slice(0, 10);
  },

  getNextOccurrence(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;

    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    const today = new Date();
    const currentYear = today.getFullYear();

    let occurrence = new Date(currentYear, month - 1, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (occurrence < todayMidnight) {
      occurrence.setFullYear(currentYear + 1);
    }

    const diffTime = occurrence - todayMidnight;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      date: occurrence,
      daysRemaining: diffDays
    };
  },

  formatDayMonth(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsMr = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const month = getLanguage() === "mr" ? monthsMr[monthIndex] : months[monthIndex];
    return `${day} ${month}`;
  }
};
