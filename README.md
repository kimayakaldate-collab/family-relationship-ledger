# Family Relationship Ledger

A premium, offline-first Family Relationship Management System designed to help families track directories, gifts given/received, wedding/festival budgets, return gift decisions, and long-term financial relationships.

Unlike standard expense trackers, this application functions as a hybrid CRM and Relationship Ledger, answering instant family queries like:
* *"What did Suresh Kaka give us for Kimaya's Wedding?"*
* *"What did we spend on Rajesh Mama's housewarming return gift?"*
* *"When is Sunita Kaki's next anniversary and what did we give her last year?"*

---

## 🚀 Key Features

* **Command Center Dashboard 2.0**: Consolidated status cards, separate birthdays/anniversaries remining feeds, and unified recent transaction logs.
* **Unified Memory Timeline**: Chronological relationship histories grouped by years (descending), complete with advanced filters (Gifts, Expenses, Events, Birthdays, Anniversaries).
* **Smart Notification Engine**: Urgency-categorized notification alerts (Today, Tomorrow, 7 Days, 30 Days) with local storage preference settings.
* **Image Uploader**: Attachment support for Gift Received and Gift Given records up to 10MB (JPG, PNG, WEBP) with zoomable previews.
* **Date-Based Explorer**: Advanced range filters to calculate aggregate budgets, transaction counts, and download filtered lists to CSV/JSON.
* **Surname-Based Auto Family Groupings**: Automatically clusters people into families based on last names with manual override support.
* **Backup & Restore**: Zero-dependency offline backup export/import utility.
* **Double Localization**: Instantly switch between English and Marathi (मराठी) layouts.
* **WCAG AA Dark Mode**: Contrast-compliant dark/light themes with accessible form inputs and high-contrast placeholder texts.

---

## 📸 Screenshots

*(Place screenshots here before public deployment)*

* **Dashboard View**: `[ Placeholder for Dashboard 2.0 Screenshot ]`
* **People & Family Groups**: `[ Placeholder for People Directory Screenshot ]`
* **Wedding & Event Ledgers**: `[ Placeholder for Event Budgets Screenshot ]`
* **Timeline Feed**: `[ Placeholder for Family Memory Timeline Screenshot ]`
* **Notifications**: `[ Placeholder for Notifications Widget Screenshot ]`
* **Reports Export panel**: `[ Placeholder for CSV Reports Panel Screenshot ]`

---

## 🛠️ Installation & Setup

Because the application is designed to be completely offline-first with zero dependencies, you can start running it instantly:

### Method 1: Direct File Launch
Double-click [index.html](file:///f:/Kimaya/exin%20app/index.html) in your workspace directory to open the application in any modern web browser.

### Method 2: Local HTTP Server
Run a light web server in the directory to access the application via localhost:
```bash
# Using python
python -m http.server 8000

# Using Node.js npx
npx serve .
```
Access the application at `http://localhost:8000`.

---

## 💾 Backup & Restore Guide

1. Go to **Settings / सेटिंग्ज** in the navigation sidebar.
2. Click **Export Backup / बॅकअप निर्यात करा** to save your entire database as a single offline `.json` file.
3. To load data on a new device, click **Import Backup / बॅकअप आयात करा** and upload the `.json` file.

---

## 🗺️ Future Roadmap

* **OCR Receipt Scanner**: Auto-extract vendor amounts from printed bills.
* **Google Contacts Sync**: Import family contact details with one click.
* **SMS Wish Sender**: Directly send WhatsApp/SMS birthday wishes from the dashboard.
* **Multi-User Sync**: Optional peer-to-peer sync over local Wi-Fi networks.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
