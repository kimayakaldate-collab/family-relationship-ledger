// Person Profile View Controller (The main ledger page)
const personProfileView = {
  render(container, personId) {
    const person = db.people.find(personId);
    if (!person) {
      container.innerHTML = `<h2>Person profile not found.</h2>`;
      return;
    }

    // Fetch financial logs
    const ledger = db.getPersonLedger(personId);
    const initials = person.fullName.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
    const family = person.familyId ? db.families.find(person.familyId) : null;

    // Compile dynamic timeline items (merge gifts, expenses, events, birthdays, anniversaries)
    const timelineItems = this.compileTimeline(person, ledger);
    
    // Sort and Group by Year
    const grouped = {};
    timelineItems.forEach(item => {
      if (!item.date) return;
      const year = item.date.split("-")[0];
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    });

    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => b.date.localeCompare(a.date));
    });

    // Summary Interaction Dates
    const interactionDates = timelineItems
      .filter(item => ["received", "given", "expense", "event"].includes(item.type))
      .map(item => item.date)
      .filter(Boolean)
      .sort();

    const firstInteraction = interactionDates.length > 0 ? interactionDates[0] : "-";
    const lastInteraction = interactionDates.length > 0 ? interactionDates[interactionDates.length - 1] : "-";

    container.innerHTML = `
      <div class="view-wrapper">
        
        <!-- PROFILE HEADER CARD -->
        <div class="profile-header-card">
          <div class="profile-avatar">
            ${person.photo ? 
              `<img src="${person.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : 
              `<div>${initials}</div>`
            }
          </div>
          
          <div class="profile-bio">
            <h2>${person.fullName}</h2>
            <div class="profile-badge-row">
              <span class="badge primary">${t(person.relation)}</span>
              ${family ? `<span class="badge saffron">${family.name}</span>` : ""}
              ${person.city ? `<span class="badge info">📍 ${person.city}</span>` : ""}
            </div>
            <div style="font-size:0.9rem; color:var(--text-muted);">
              ${person.mobileNumber ? `📞 ${person.mobileNumber} &nbsp;•&nbsp; ` : ""}
              ${person.email ? `✉️ ${person.email}` : ""}
            </div>
          </div>
          
          <div style="display:flex; gap:12px;">
            <button class="btn-secondary" id="prof-edit-btn">${t("edit")}</button>
            <button class="btn-danger" id="prof-delete-btn">${t("delete")}</button>
          </div>
        </div>

        <!-- RELATIONSHIP SUMMARY FINANCIAL BUBBLES -->
        <div style="display:flex; gap:20px; margin-bottom:32px; flex-wrap:wrap;">
          <div class="fin-bubble received">
            <div class="fin-bubble-val received">₹${ledger.totalReceived.toLocaleString("en-IN")}</div>
            <div class="fin-bubble-lbl">${t("totalReceivedFrom")}</div>
          </div>
          <div class="fin-bubble given">
            <div class="fin-bubble-val given">₹${ledger.totalGiven.toLocaleString("en-IN")}</div>
            <div class="fin-bubble-lbl">${t("totalGivenTo")}</div>
          </div>
          <div class="fin-bubble spent">
            <div class="fin-bubble-val spent">₹${ledger.totalSpent.toLocaleString("en-IN")}</div>
            <div class="fin-bubble-lbl">${t("totalSpentOn")}</div>
          </div>
          <div class="fin-bubble balance">
            <div class="fin-bubble-val balance" style="color: ${ledger.netBalance >= 0 ? "var(--color-received)" : "var(--color-spent)"}">
              ₹${ledger.netBalance.toLocaleString("en-IN")}
            </div>
            <div class="fin-bubble-lbl">${t("netBalance")}</div>
          </div>
        </div>

        <!-- TAB NAVIGATION -->
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="timeline">${t("timeline")}</button>
          <button class="tab-btn" data-tab="overview">${t("overview")}</button>
          <button class="tab-btn" data-tab="received">${t("received")} (${ledger.received.length})</button>
          <button class="tab-btn" data-tab="given">${t("given")} (${ledger.given.length})</button>
          <button class="tab-btn" data-tab="expenses">${t("expenses")} (${ledger.expenses.length})</button>
        </div>

        <!-- TAB CONTENTS -->
        <div class="tabs-content">
          
          <!-- TIMELINE TAB -->
          <div class="tab-pane active" id="tab-timeline">
            
            <!-- SUMMARY INTERACTION HEADER -->
            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; padding: 20px; background-color: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="flex: 1; min-width: 140px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">📅 First Interaction</div>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${firstInteraction}</div>
              </div>
              <div style="flex: 1; min-width: 140px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">📅 Last Interaction</div>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${lastInteraction}</div>
              </div>
              <div style="flex: 1; min-width: 120px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">📥 Received Total</div>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--color-received); margin-top: 4px;">₹${ledger.totalReceived.toLocaleString("en-IN")}</div>
              </div>
              <div style="flex: 1; min-width: 120px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">📤 Given Total</div>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--color-given); margin-top: 4px;">₹${ledger.totalGiven.toLocaleString("en-IN")}</div>
              </div>
              <div style="flex: 1; min-width: 120px;">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">💸 Spent Total</div>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--color-spent); margin-top: 4px;">₹${ledger.totalSpent.toLocaleString("en-IN")}</div>
              </div>
            </div>

            <!-- TIMELINE SEARCH / FILTER BAR -->
            <div class="timeline-filters" style="display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap;">
              <button class="btn-secondary filter-btn active" data-filter="all">All / सर्व</button>
              <button class="btn-secondary filter-btn" data-filter="gift">🎁 Gifts / भेटवस्तू</button>
              <button class="btn-secondary filter-btn" data-filter="expense">💰 Expenses / खर्च</button>
              <button class="btn-secondary filter-btn" data-filter="event">📅 Events / कार्यक्रम</button>
              <button class="btn-secondary filter-btn" data-filter="birthday">🎂 Birthdays / वाढदिवस</button>
              <button class="btn-secondary filter-btn" data-filter="anniversary">💐 Anniversaries / लग्नाचे वाढदिवस</button>
            </div>

            <!-- VERTICAL TIMELINE LAYOUT -->
            <div class="timeline-v-container" style="position: relative; padding-left: 24px; border-left: 3px solid var(--border-color); margin-top: 20px;">
              ${Object.keys(grouped).length === 0 ? `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary); margin-left:-24px;">No timeline items found.</div>
              ` : ""}
              
              ${Object.keys(grouped).sort((a,b) => b - a).map(year => {
                const yearItems = grouped[year];
                return `
                  <div class="timeline-year-group" data-year="${year}">
                    <!-- YEAR HEADER -->
                    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-color); margin: 32px 0 16px -36px; display: flex; align-items: center; gap: 8px;">
                      <span style="background-color: var(--primary-color); color: #fff; padding: 2px 12px; border-radius: 20px; font-size: 0.9rem; font-family: var(--font-display);">${year}</span>
                    </div>

                    <!-- ENTRIES -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                      ${yearItems.map(item => {
                        let dotColor = "var(--border-focus)";
                        if (item.type === "received") dotColor = "var(--color-received)";
                        else if (item.type === "given") dotColor = "var(--color-given)";
                        else if (item.type === "expense") dotColor = "var(--color-spent)";
                        else if (item.type === "event") dotColor = "var(--primary-color)";
                        else if (item.type === "birthday") dotColor = "var(--color-spent)";
                        else if (item.type === "anniversary") dotColor = "var(--color-given)";
                        
                        return `
                          <div class="timeline-card" data-type="${item.type}" style="display: flex; align-items: center; justify-content: space-between; background-color: var(--bg-card); border: var(--border-glass); box-shadow: var(--card-shadow); padding: 16px; border-radius: var(--radius-md); position: relative; gap: 16px; flex-wrap: wrap;">
                            <!-- Vertical Dot anchor on left border line -->
                            <div style="position: absolute; left: -31px; top: 50%; transform: translateY(-50%); width: 12px; height: 12px; border-radius: 50%; background-color: ${dotColor}; border: 3px solid var(--surface-bg); box-shadow: 0 0 0 2px var(--border-color);"></div>

                            <div style="display: flex; align-items: center; gap: 16px; flex-grow: 1; min-width: 200px;">
                              <!-- Icon Circle -->
                              <div style="width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: var(--bg-input); font-size: 1.25rem; flex-shrink: 0;">
                                ${item.icon}
                              </div>

                              <!-- Details -->
                              <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                  <span style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">${item.title}</span>
                                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${item.date}</span>
                                </div>
                                
                                ${item.occasion ? `<div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">📅 Event: ${item.occasion}</div>` : ""}
                                ${item.notes ? `<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">"${item.notes}"</div>` : ""}
                                
                                <!-- Image thumbnail if exists -->
                                ${item.photo ? `
                                  <div style="margin-top: 8px;">
                                    <img src="${item.photo}" onclick="giftsView.openImageViewer('${item.title}', '${item.photo}')" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-color); cursor: zoom-in; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                  </div>
                                ` : ""}
                              </div>
                            </div>

                            <!-- Amount -->
                            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; color: ${item.type === "received" ? "var(--color-received)" : item.type === "given" ? "var(--color-given)" : item.type === "expense" ? "var(--color-spent)" : "var(--text-main)"}; flex-shrink: 0; min-width: 80px; text-align: right;">
                              ${item.amount ? `₹${item.amount.toLocaleString("en-IN")}` : ""}
                            </div>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>

          </div>

          <!-- OVERVIEW TAB -->
          <div class="tab-pane" id="tab-overview">
            <div class="card-section">
              <h3 style="margin-bottom:20px;">👤 ${t("contactInfo")} & ${t("relationDetails")}</h3>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div>
                  <p><strong>${t("fullName")}:</strong> ${person.fullName}</p>
                  <p style="margin-top:10px;"><strong>${t("relation")}:</strong> ${t(person.relation)}</p>
                  <p style="margin-top:10px;"><strong>${t("familyGroup")}:</strong> ${family ? family.name : "None"}</p>
                  <p style="margin-top:10px;"><strong>${t("city")}:</strong> ${person.city || "-"}</p>
                  <p style="margin-top:10px;"><strong>${t("address")}:</strong> ${person.address || "-"}</p>
                </div>
                <div>
                  <p><strong>${t("birthDate")}:</strong> ${person.birthDate || "-"}</p>
                  <p style="margin-top:10px;"><strong>${t("anniversaryDate")}:</strong> ${person.anniversaryDate || "-"}</p>
                  <p style="margin-top:10px;"><strong>${t("gender")}:</strong> ${person.gender}</p>
                  <p style="margin-top:10px;"><strong>${t("notes")}:</strong> ${person.notes || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- RECEIVED TAB -->
          <div class="tab-pane" id="tab-received">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${t("date")}</th>
                    <th>${t("giftName")}</th>
                    <th>${t("giftType")}</th>
                    <th>${t("occasion")}</th>
                    <th>${t("estimatedValue")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${ledger.received.map(g => `
                    <tr>
                      <td>${g.date}</td>
                      <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                          ${g.attachmentData ? `<img src="${g.attachmentData}" onclick="giftsView.openImageViewer('${g.giftName}', '${g.attachmentData}')" style="width:36px; height:36px; border-radius:var(--radius-sm); object-fit:cover; cursor:zoom-in; border:1px solid var(--border-color);">` : ""}
                          <strong>${g.giftName}</strong>
                        </div>
                      </td>
                      <td><span class="badge primary">${t(g.giftType)}</span></td>
                      <td>${g.occasion}</td>
                      <td class="received" style="font-weight:700;">₹${g.estimatedValue.toLocaleString("en-IN")}</td>
                    </tr>
                  `).join("")}
                  ${ledger.received.length === 0 ? `<tr><td colspan="5" style="text-align:center;">${t("noGiftsFound")}</td></tr>` : ""}
                </tbody>
              </table>
            </div>
          </div>

          <!-- GIVEN TAB -->
          <div class="tab-pane" id="tab-given">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${t("date")}</th>
                    <th>${t("giftName")}</th>
                    <th>${t("giftType")}</th>
                    <th>${t("occasion")}</th>
                    <th>${t("estimatedValue")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${ledger.given.map(g => `
                    <tr>
                      <td>${g.date}</td>
                      <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                          ${g.attachmentData ? `<img src="${g.attachmentData}" onclick="giftsView.openImageViewer('${g.giftName}', '${g.attachmentData}')" style="width:36px; height:36px; border-radius:var(--radius-sm); object-fit:cover; cursor:zoom-in; border:1px solid var(--border-color);">` : ""}
                          <strong>${g.giftName}</strong>
                        </div>
                      </td>
                      <td><span class="badge saffron">${t(g.giftType)}</span></td>
                      <td>${g.occasion}</td>
                      <td class="given" style="font-weight:700;">₹${g.estimatedValue.toLocaleString("en-IN")}</td>
                    </tr>
                  `).join("")}
                  ${ledger.given.length === 0 ? `<tr><td colspan="5" style="text-align:center;">${t("noGiftsFound")}</td></tr>` : ""}
                </tbody>
              </table>
            </div>
          </div>

          <!-- EXPENSES TAB -->
          <div class="tab-pane" id="tab-expenses">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${t("date")}</th>
                    <th>${t("category")}</th>
                    <th>${t("subcategory")}</th>
                    <th>${t("vendor")}</th>
                    <th>${t("amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${ledger.expenses.map(e => `
                    <tr>
                      <td>${e.date}</td>
                      <td><strong>${t(e.category)}</strong></td>
                      <td>${e.subcategory || "-"}</td>
                      <td>${e.vendor || "-"}</td>
                      <td class="expense" style="font-weight:700;">₹${e.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  `).join("")}
                  ${ledger.expenses.length === 0 ? `<tr><td colspan="5" style="text-align:center;">${t("noExpensesFound")}</td></tr>` : ""}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    `;

    // Bind tab clicks
    container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tabName = btn.getAttribute("data-tab");
        container.querySelectorAll(".tab-pane").forEach(pane => {
          pane.classList.remove("active");
          if (pane.id === `tab-${tabName}`) {
            pane.classList.add("active");
          }
        });
      });
    });

    // Bind timeline filter bar clicks
    container.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");
        container.querySelectorAll(".timeline-year-group").forEach(group => {
          let visibleInGroup = 0;
          group.querySelectorAll(".timeline-card").forEach(card => {
            const cardType = card.getAttribute("data-type");
            let isVisible = false;

            if (filter === "all") {
              isVisible = true;
            } else if (filter === "gift" && (cardType === "received" || cardType === "given")) {
              isVisible = true;
            } else if (filter === cardType) {
              isVisible = true;
            }

            if (isVisible) {
              card.style.display = "flex";
              visibleInGroup++;
            } else {
              card.style.display = "none";
            }
          });

          // Toggle year group visibility
          if (visibleInGroup === 0) {
            group.style.display = "none";
          } else {
            group.style.display = "block";
          }
        });
      });
    });

    // Profile action buttons binding
    document.getElementById("prof-edit-btn").addEventListener("click", () => {
      peopleView.openEditModal(personId);
    });

    document.getElementById("prof-delete-btn").addEventListener("click", () => {
      if (confirm(t("confirmDelete"))) {
        db.people.delete(personId);
        navigateToView("people");
      }
    });
  },

  compileTimeline(person, ledger) {
    const items = [];
    const birthDateStr = person.birthDate;
    const anniversaryDateStr = person.anniversaryDate;

    // 1. Gifts Received
    ledger.received.forEach(g => {
      items.push({
        id: g.id,
        type: "received",
        icon: "🎁",
        title: `${t("giftsReceived")}: ${g.giftName}`,
        date: g.date,
        amount: g.estimatedValue,
        occasion: g.occasion,
        eventId: g.eventId,
        notes: g.description || g.notes,
        photo: g.attachmentData || ""
      });
    });

    // 2. Gifts Given
    ledger.given.forEach(g => {
      items.push({
        id: g.id,
        type: "given",
        icon: "🎁",
        title: `${t("giftsGiven")}: ${g.giftName}`,
        date: g.date,
        amount: g.estimatedValue,
        occasion: g.occasion,
        eventId: g.eventId,
        notes: g.description || g.notes,
        photo: g.attachmentData || ""
      });
    });

    // 3. Expenses
    ledger.expenses.forEach(e => {
      items.push({
        id: e.id,
        type: "expense",
        icon: "💰",
        title: `${t("expenses")}: ${e.category} (${e.subcategory || e.vendor || ""})`,
        date: e.date,
        amount: e.amount,
        occasion: e.eventId ? (db.events.find(e.eventId)?.name || "") : "",
        eventId: e.eventId,
        notes: e.description || e.notes,
        photo: e.attachmentData || ""
      });
    });

    // 4. Events linked through gifts/expenses
    const linkedEventIds = new Set();
    items.forEach(item => {
      if (item.eventId) linkedEventIds.add(item.eventId);
    });
    
    // Also scan events to see if they are named after the person
    const firstName = person.fullName.split(" ")[0].toLowerCase();
    db.events.all().forEach(ev => {
      if (ev.name.toLowerCase().includes(firstName)) {
        linkedEventIds.add(ev.id);
      }
    });

    linkedEventIds.forEach(evId => {
      const ev = db.events.find(evId);
      if (ev) {
        items.push({
          id: ev.id,
          type: "event",
          icon: "📅",
          title: `${t("event")}: ${ev.name}`,
          date: ev.date,
          occasion: ev.name,
          eventId: ev.id,
          notes: ev.description || `${ev.type} at ${ev.location}`
        });
      }
    });

    // Determine span of years to generate birthdays & anniversaries
    const allDates = items.map(item => item.date).filter(Boolean);
    let startYear = new Date().getFullYear();
    let endYear = startYear;

    if (allDates.length > 0) {
      const years = allDates.map(d => parseInt(d.split("-")[0])).filter(Boolean);
      startYear = Math.min(...years, startYear);
      endYear = Math.max(...years, endYear);
    }

    for (let y = startYear; y <= endYear; y++) {
      if (birthDateStr) {
        const parts = birthDateStr.split("-");
        if (parts.length === 3) {
          items.push({
            id: `bday-${y}`,
            type: "birthday",
            icon: "🎂",
            title: `${person.fullName}'s Birthday`,
            date: `${y}-${parts[1]}-${parts[2]}`,
            notes: `Turning ${y - parseInt(parts[0])} years old!`
          });
        }
      }

      if (anniversaryDateStr) {
        const parts = anniversaryDateStr.split("-");
        if (parts.length === 3) {
          items.push({
            id: `anniv-${y}`,
            type: "anniversary",
            icon: "💐",
            title: `${person.fullName}'s Anniversary`,
            date: `${y}-${parts[1]}-${parts[2]}`,
            notes: `${y - parseInt(parts[0])} years of marriage celebration!`
          });
        }
      }
    }

    return items;
  }
};
