// Settings View Controller (Toggles, backups, resets, and notifications preferences)
const settingsView = {
  render(container) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const currentLang = getLanguage();

    container.innerHTML = `
      <div class="view-wrapper" style="max-width: 800px;">
        
        <!-- GENERAL INTERFACE PREFERENCES -->
        <div class="card-section">
          <h3 style="margin-bottom:20px;">🎨 Interface Preferences</h3>
          
          <div class="form-grid">
            <div class="form-group">
              <label>${t("language")}</label>
              <select id="set-lang" style="font-weight:600;">
                <option value="en" ${currentLang === "en" ? "selected" : ""}>English (EN)</option>
                <option value="mr" ${currentLang === "mr" ? "selected" : ""}>मराठी (MR)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>${t("theme")}</label>
              <select id="set-theme" style="font-weight:600;">
                <option value="light" ${!isDark ? "selected" : ""}>☀️ ${t("lightMode")}</option>
                <option value="dark" ${isDark ? "selected" : ""}>🌙 ${t("darkMode")}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SMART NOTIFICATION PREFERENCES -->
        <div class="card-section">
          <h3 style="margin-bottom:20px;">🔔 Notification Preferences</h3>
          
          <div style="display:flex; flex-direction:column; gap:16px;">
            <label style="display:flex; align-items:center; gap:12px; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="notif-birthday" ${localStorage.getItem("family_ledger_notif_birthday") !== "false" ? "checked" : ""} style="width:18px; height:18px; cursor:pointer;">
              <span>Enable Birthday Notifications / वाढदिवसाच्या सूचना सुरू करा</span>
            </label>
            
            <label style="display:flex; align-items:center; gap:12px; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="notif-anniversary" ${localStorage.getItem("family_ledger_notif_anniversary") !== "false" ? "checked" : ""} style="width:18px; height:18px; cursor:pointer;">
              <span>Enable Anniversary Notifications / लग्नाच्या वाढदिवसाच्या सूचना सुरू करा</span>
            </label>
            
            <label style="display:flex; align-items:center; gap:12px; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="notif-event" ${localStorage.getItem("family_ledger_notif_event") !== "false" ? "checked" : ""} style="width:18px; height:18px; cursor:pointer;">
              <span>Enable Event Notifications / कार्यक्रमांच्या सूचना सुरू करा</span>
            </label>
            
            <label style="display:flex; align-items:center; gap:12px; font-weight:600; cursor:pointer;">
              <input type="checkbox" id="notif-followup" ${localStorage.getItem("family_ledger_notif_followup") !== "false" ? "checked" : ""} style="width:18px; height:18px; cursor:pointer;">
              <span>Enable Gift Follow-Up Suggestions / भेटवस्तू फॉलो-अप सूचना सुरू करा</span>
            </label>
          </div>
        </div>

        <!-- DATABASE BACKUP TOOLS -->
        <div class="card-section">
          <h3 style="margin-bottom:12px;">💾 Database & Backup Tools</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">
            Export your entire family directory, event milestones, and ledger transactions to a JSON backup file, or restore details from an existing backup.
          </p>

          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <button class="btn-primary" id="set-export-btn">
              📥 ${t("exportBackup")}
            </button>
            
            <button class="btn-secondary" id="set-import-btn" style="position:relative;">
              📤 ${t("importBackup")}
              <input type="file" id="set-import-file" accept=".json" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer;">
            </button>
          </div>
        </div>

        <!-- DANGER ZONE -->
        <div class="card-section" style="border: 1px solid rgba(231,76,60,0.25); background-color:rgba(231,76,60,0.02);">
          <h3 style="color:var(--color-spent); margin-bottom:12px;">⚠️ ${t("dangerZone")}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">
            Clearing database will delete all people profiles, family groupings, weddings, and gift balances. The system will revert to the default Patil Family demo ledger.
          </p>
          
          <button class="btn-danger" id="set-reset-btn">
            🔄 ${t("resetData")}
          </button>
        </div>

        <!-- APP CREDIT METADATA -->
        <div style="text-align:center; margin-top:40px; font-size:0.8rem; color:var(--text-muted);">
          <h4>${t("aboutLedger")}</h4>
          <p>Designed for premium, fast offline-first relationship tracking.</p>
          <p style="margin-top:6px;">${t("version")}</p>
        </div>

      </div>
    `;

    // Bind preference events
    document.getElementById("set-lang").addEventListener("change", (e) => {
      setLanguage(e.target.value);
      document.getElementById("lang-select").value = e.target.value;
      window.app.translateStaticUI();
      window.app.renderCurrentView();
    });

    document.getElementById("set-theme").addEventListener("change", (e) => {
      const mode = e.target.value;
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem("family_ledger_theme", mode);
      window.app.theme = mode;
      window.app.updateThemeButtonIcon();
    });

    // Bind checkbox changes
    document.getElementById("notif-birthday").addEventListener("change", (e) => {
      localStorage.setItem("family_ledger_notif_birthday", e.target.checked ? "true" : "false");
    });
    document.getElementById("notif-anniversary").addEventListener("change", (e) => {
      localStorage.setItem("family_ledger_notif_anniversary", e.target.checked ? "true" : "false");
    });
    document.getElementById("notif-event").addEventListener("change", (e) => {
      localStorage.setItem("family_ledger_notif_event", e.target.checked ? "true" : "false");
    });
    document.getElementById("notif-followup").addEventListener("change", (e) => {
      localStorage.setItem("family_ledger_notif_followup", e.target.checked ? "true" : "false");
    });

    // Reset database action
    document.getElementById("set-reset-btn").addEventListener("click", () => {
      if (confirm(t("resetConfirm"))) {
        db.reset();
        window.app.navigateTo("dashboard");
      }
    });

    // Export Backup Action
    document.getElementById("set-export-btn").addEventListener("click", () => {
      const dataStr = db.exportData();
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `family_relationship_ledger_backup_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    // Import Backup Action
    document.getElementById("set-import-file").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const success = db.importData(event.target.result);
        if (success) {
          alert("Backup database imported successfully!");
          window.app.navigateTo("dashboard");
        } else {
          alert("Failed to import database file. Please verify it is a valid backup JSON.");
        }
      };
      reader.readAsText(file);
    });
  }
};
