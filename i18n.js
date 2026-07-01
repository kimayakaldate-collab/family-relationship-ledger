// Internationalization (i18n) definitions for English and Marathi
const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    people: "People",
    events: "Events",
    expenses: "Expenses",
    giftsReceived: "Gifts Received",
    giftsGiven: "Gifts Given",
    reports: "Reports",
    settings: "Settings",

    // Dashboard
    searchPlaceholder: "Search person, event, gift, expense...",
    totalPeople: "Total People",
    totalExpenses: "Total Expenses",
    totalGiftsReceived: "Total Gifts Received",
    totalGiftsGiven: "Total Gifts Given",
    upcomingBirthdays: "Upcoming Birthdays",
    upcomingAnniversaries: "Upcoming Anniversaries",
    recentActivity: "Recent Activity",
    recentGifts: "Recent Gifts",
    recentExpenses: "Recent Expenses",
    recentEvents: "Recent Events",
    quickAdd: "Quick Add",
    addPerson: "Add Person",
    addExpense: "Add Expense",
    addGiftReceived: "Add Gift Received",
    addGiftGiven: "Add Gift Given",
    noActivity: "No recent activities recorded.",
    noGifts: "No gifts recorded.",
    noExpenses: "No expenses recorded.",
    noEvents: "No upcoming events.",

    // People Master
    peopleList: "People Directory",
    fullName: "Full Name",
    relation: "Relation",
    familyGroup: "Family Group",
    gender: "Gender",
    mobile: "Mobile Number",
    email: "Email ID",
    address: "Address",
    city: "City",
    birthDate: "Birth Date",
    anniversaryDate: "Anniversary Date",
    notes: "Notes",
    status: "Status",
    photo: "Photo",
    actions: "Actions",
    active: "Active",
    archived: "Archived",
    edit: "Edit",
    delete: "Delete",
    archive: "Archive",
    restore: "Restore",
    mergeDuplicates: "Merge Duplicates",
    searchPerson: "Search person...",
    filterRelation: "Filter by Relation",
    filterFamily: "Filter by Family",
    filterCity: "Filter by City",
    noPeople: "No people found.",
    addPersonTitle: "Add New Person",
    editPersonTitle: "Edit Person Details",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this record? This action cannot be undone.",
    relationshipHistory: "Relationship History",

    // Person Profile
    netBalance: "Net Balance",
    totalReceivedFrom: "Total Received",
    totalGivenTo: "Total Given",
    totalSpentOn: "Total Spent",
    overview: "Overview",
    received: "Received",
    given: "Given",
    timeline: "Timeline",
    contactInfo: "Contact Information",
    relationDetails: "Relation Details",
    netBalanceTooltip: "Total Received - Total Given",

    // Events
    eventManagement: "Events Directory",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    eventName: "Event Name",
    eventType: "Event Type",
    date: "Date",
    location: "Location",
    description: "Description",
    budget: "Budget",
    remainingBudget: "Remaining Budget",
    peopleInvolved: "People Involved",
    expenseBreakdown: "Expense Breakdown",
    giftBreakdown: "Gift Breakdown",
    documents: "Documents",
    photos: "Photos",
    noEventsFound: "No events found.",
    eventDashboard: "Event Dashboard",
    spentOf: "spent of",

    // Event Types
    Wedding: "Wedding",
    Engagement: "Engagement",
    Birthday: "Birthday",
    Anniversary: "Anniversary",
    BabyShower: "Baby Shower",
    Housewarming: "Housewarming",
    NamingCeremony: "Naming Ceremony",
    Diwali: "Diwali",
    RakshaBandhan: "Raksha Bandhan",
    BhauBeej: "Bhau Beej",
    Custom: "Custom Event",

    // Expenses
    addExpenseTitle: "Add New Expense",
    editExpenseTitle: "Edit Expense Details",
    category: "Category",
    subcategory: "Subcategory",
    relatedPerson: "Related Person",
    amount: "Amount (₹)",
    vendor: "Vendor",
    paymentMethod: "Payment Method",
    attachment: "Attachment",
    noExpensesFound: "No expenses found.",
    duplicate: "Duplicate",

    // Expense Categories
    Clothes: "Clothes",
    Jewellery: "Jewellery",
    Catering: "Catering",
    Hall: "Hall",
    Decoration: "Decoration",
    Photography: "Photography",
    Travel: "Travel",
    Accommodation: "Accommodation",
    Gifts: "Gifts",
    Miscellaneous: "Miscellaneous",

    // Gifts
    addGiftReceivedTitle: "Add Gift Received",
    addGiftGivenTitle: "Add Gift Given",
    editGiftReceivedTitle: "Edit Gift Received",
    editGiftGivenTitle: "Edit Gift Given",
    giftType: "Gift Type",
    giftName: "Gift Name / Item Name",
    estimatedValue: "Estimated Value (₹)",
    occasion: "Occasion / Event",
    noGiftsFound: "No gifts found.",

    // Gift Types
    Cash: "Cash",
    Gold: "Gold",
    Silver: "Silver",
    Electronics: "Electronics",
    Property: "Property",
    Other: "Other",

    // Family Groups
    familyManagement: "Family Groups",
    addFamily: "Add Family Group",
    familyName: "Family Name",
    members: "Members",
    noFamilies: "No family groups found.",

    // Reports
    reportsDashboard: "Reports Dashboard",
    personWiseReport: "Person-Wise Ledger",
    familyWiseReport: "Family-Wise Ledger",
    eventWiseReport: "Event-Wise Summary",
    weddingReport: "Wedding Financial Summary",
    expenseReport: "Categorized Expense Report",
    giftReport: "Gift Exchange Analysis",
    annualReport: "Annual Relationship Summary",
    exportPDF: "Export PDF",
    exportExcel: "Export Excel (CSV)",
    exportCSV: "Export CSV",
    generate: "Generate",

    // Settings
    appSettings: "App Settings",
    language: "Language / भाषा",
    theme: "Theme Mode",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    dangerZone: "Danger Zone",
    resetData: "Reset All Database Data",
    resetConfirm: "Warning! This will clear all family profiles, gifts, events, and expenses. Do you wish to proceed?",
    importBackup: "Import Data Backup",
    exportBackup: "Export Data Backup",
    aboutLedger: "Family Relationship Ledger",
    version: "Version 1.0.0",

    // Audit logs
    auditLogs: "System Activity Audit Log",
    activityCreate: "Created {entity}: {name}",
    activityUpdate: "Updated {entity}: {name}",
    activityDelete: "Deleted {entity}: {name}",

    // Relations English
    Father: "Father",
    Mother: "Mother",
    Brother: "Brother",
    Sister: "Sister",
    Husband: "Husband",
    Wife: "Wife",
    Son: "Son",
    Daughter: "Daughter",
    Uncle: "Uncle",
    Aunt: "Aunt",
    Cousin: "Cousin",
    Grandfather: "Grandfather",
    Grandmother: "Grandmother",
    Friend: "Friend",
    OtherRelation: "Other",

    // Reports Config Labels
    repSelectCategory: "Select Report Category",
    repNoReportSelected: "No Report Selected",
    repSelectCategoryDesc: "Select a report category from the left panel to begin analysis.",
    repSelectPerson: "Select Person",
    repSelectPersonDesc: "Generate complete gift ledger and spent history for a specific individual.",
    repSelectFamily: "Select Family Group",
    repSelectFamilyDesc: "Aggregate financial ledgers and gift counts for all members of a family group.",
    repSelectEvent: "Select Event",
    repSelectEventDesc: "See itemized costs, budgets, and all gifts received/given for a specific occasion.",
    repSelectWedding: "Select Wedding Event",
    repSelectWeddingDesc: "Detailed financial tracker and analysis for Wedding planning events.",
    repYearFilter: "Year Filter",
    repYearFilterDesc: "View expense breakdown by category with filters for years.",
    repAllYears: "All Years",
    repExchangeMode: "Exchange Mode",
    repExchangeModeDesc: "Analyze cash versus ornaments and other assets exchanged within your circle.",
    repBothModes: "Both Received & Given",
    repReportFor: "Report: {name}"
  },
  mr: {
    // Navigation
    dashboard: "डॅशबोर्ड",
    people: "नातेवाईक / व्यक्ती",
    events: "कार्यक्रम",
    expenses: "खर्च",
    giftsReceived: "मिळालेल्या भेटी",
    giftsGiven: "दिलेल्या भेटी",
    reports: "अहवाल",
    settings: "सेटिंग्ज",

    // Dashboard
    searchPlaceholder: "व्यक्ती, कार्यक्रम, भेट किंवा खर्च शोधा...",
    totalPeople: "एकूण व्यक्ती",
    totalExpenses: "एकूण खर्च",
    totalGiftsReceived: "एकूण मिळालेल्या भेटी",
    totalGiftsGiven: "एकूण दिलेल्या भेटी",
    upcomingBirthdays: "येणारे वाढदिवस",
    upcomingAnniversaries: "येणारे लग्नाचे वाढदिवस",
    recentActivity: "अलीकडील घडामोडी",
    recentGifts: "अलीकडील भेटी",
    recentExpenses: "अलीकडील खर्च",
    recentEvents: "येणारे कार्यक्रम",
    quickAdd: "त्वरित जोडा",
    addPerson: "व्यक्ती जोडा",
    addExpense: "खर्च जोडा",
    addGiftReceived: "मिळालेली भेट जोडा",
    addGiftGiven: "दिलेली भेट जोडा",
    noActivity: "कोणतीही अलीकडील नोंद नाही.",
    noGifts: "भेटींची कोणतीही नोंद नाही.",
    noExpenses: "खर्चाची कोणतीही नोंद नाही.",
    noEvents: "पुढील काळात कोणतेही कार्यक्रम नाहीत.",

    // People Master
    peopleList: "व्यक्तींची यादी",
    fullName: "पूर्ण नाव",
    relation: "नाते",
    familyGroup: "कुटुंब गट",
    gender: "लिंग",
    mobile: "मोबाईल क्रमांक",
    email: "ईमेल आयडी",
    address: "पत्ता",
    city: "शहर",
    birthDate: "जन्मतारीख",
    anniversaryDate: "लग्नाचा वाढदिवस",
    notes: "नोंद / टिप्पणी",
    status: "स्थिती",
    photo: "फोटो",
    actions: "कृती",
    active: "सक्रिय",
    archived: "अर्काईव्ह केलेले",
    edit: "संपादित करा",
    delete: "हटवा",
    archive: "अर्काईव्ह करा",
    restore: "पुनर्संचयित करा",
    mergeDuplicates: "एकसारखे नावे एकत्र करा",
    searchPerson: "नाव शोधा...",
    filterRelation: "नात्यानुसार फिल्टर",
    filterFamily: "कुटुंबानुसार फिल्टर",
    filterCity: "शहरांनुसार फिल्टर",
    noPeople: "कोणतीही व्यक्ती आढळली नाही.",
    addPersonTitle: "नवीन व्यक्ती जोडा",
    editPersonTitle: "माहिती संपादित करा",
    save: "जतन करा",
    cancel: "रद्द करा",
    confirmDelete: "तुम्हाला खात्री आहे की तुम्ही ही नोंद हटवू इच्छिता? ही कृती परत करता येणार नाही.",
    relationshipHistory: "संबंध इतिहास",

    // Person Profile
    netBalance: "निव्वळ शिल्लक",
    totalReceivedFrom: "एकूण मिळाले",
    totalGivenTo: "एकूण दिले",
    totalSpentOn: "एकूण खर्च",
    overview: "माहिती",
    received: "मिळालेले",
    given: "दिलेले",
    timeline: "इतिहास पट्टी (Timeline)",
    contactInfo: "संपर्क माहिती",
    relationDetails: "नाते तपशील",
    netBalanceTooltip: "एकूण मिळालेले - एकूण दिलेले",

    // Events
    eventManagement: "कार्यक्रम व्यवस्थापन",
    addEvent: "कार्यक्रम जोडा",
    editEvent: "कार्यक्रम संपादित करा",
    eventName: "कार्यक्रमाचे नाव",
    eventType: "कार्यक्रमाचा प्रकार",
    date: "दिनांक",
    location: "ठिकाण",
    description: "वर्णन",
    budget: "बजेट",
    remainingBudget: "उर्वरित बजेट",
    peopleInvolved: "सहभागी व्यक्ती",
    expenseBreakdown: "खर्चाचा तपशील",
    giftBreakdown: "भेटींचा तपशील",
    documents: "दस्तऐवज",
    photos: "फोटो",
    noEventsFound: "कोणताही कार्यक्रम आढळला नाही.",
    eventDashboard: "कार्यक्रम डॅशबोर्ड",
    spentOf: "खर्च एकूण पैकी",

    // Event Types
    Wedding: "लग्न",
    Engagement: "साखरपुडा",
    Birthday: "वाढदिवस",
    Anniversary: "लग्नाचा वाढदिवस",
    BabyShower: "डोहाळे जेवण",
    Housewarming: "गृहप्रवेश",
    NamingCeremony: "बारसे",
    Diwali: "दिवाळी",
    RakshaBandhan: "रक्षाबंधन",
    BhauBeej: "भाऊबीज",
    Custom: "इतर कार्यक्रम",

    // Expenses
    addExpenseTitle: "नवीन खर्च जोडा",
    editExpenseTitle: "खर्च संपादित करा",
    category: "वर्ग / श्रेणी",
    subcategory: "उपवर्ग",
    relatedPerson: "संबंधित व्यक्ती",
    amount: "रक्कम (₹)",
    vendor: "विक्रेता / दुकानदार",
    paymentMethod: "पैसे देण्याची पद्धत",
    attachment: "जोडलेले दस्तऐवज (Attachment)",
    noExpensesFound: "कोणताही खर्च आढळला नाही.",
    duplicate: "प्रत बनवा (Duplicate)",

    // Expense Categories
    Clothes: "कपडे",
    Jewellery: "दागिने",
    Catering: "केटरिंग / जेवण",
    Hall: "सभागृह / हॉल",
    Decoration: "डेकोरेशन",
    Photography: "फोटोग्राफी",
    Travel: "प्रवास",
    Accommodation: "राहण्याची सोय",
    Gifts: "भेटी",
    Miscellaneous: "इतर / किरकोळ",

    // Gifts
    addGiftReceivedTitle: "मिळालेली भेट जोडा",
    addGiftGivenTitle: "दिलेली भेट जोडा",
    editGiftReceivedTitle: "मिळालेली भेट संपादित करा",
    editGiftGivenTitle: "दिलेली भेट संपादित करा",
    giftType: "भेटीचा प्रकार",
    giftName: "भेटीचे / वस्तूचे नाव",
    estimatedValue: "अंदाजे किंमत (₹)",
    occasion: "प्रसंग / कार्यक्रम",
    noGiftsFound: "कोणतीही भेट आढळली नाही.",

    // Gift Types
    Cash: "रोख (Cash)",
    Gold: "सोने",
    Silver: "चांदी",
    Electronics: "इलेक्ट्रॉनिक्स",
    Property: "मालमत्ता / जमीन",
    Other: "इतर",

    // Family Groups
    familyManagement: "कुटुंब गट व्यवस्थापन",
    addFamily: "नवीन कुटुंब गट जोडा",
    familyName: "कुटुंबाचे नाव",
    members: "सदस्य",
    noFamilies: "कोणताही कुटुंब गट आढळला नाही.",

    // Reports
    reportsDashboard: "अहवाल व्यवस्थापन",
    personWiseReport: "व्यक्तीनुसार खातेवही",
    familyWiseReport: "कुटुंबानुसार खातेवही",
    eventWiseReport: "कार्यक्रमानुसार सारांश",
    weddingReport: "लग्नाचा आर्थिक अहवाल",
    expenseReport: "खर्चाचा वर्गीकरण अहवाल",
    giftReport: "भेटवस्तू देवाणघेवाण विश्लेषण",
    annualReport: "वार्षिक नातेसंबंध सारांश",
    exportPDF: "पीडीएफ निर्यात करा",
    exportExcel: "एक्सेल (CSV) निर्यात",
    exportCSV: "सीएसव्ही निर्यात",
    generate: "अहवाल तयार करा",

    // Settings
    appSettings: "अॅप सेटिंग्ज",
    language: "भाषा / Language",
    theme: "थीम मोड",
    darkMode: "डार्क मोड",
    lightMode: "लाईट मोड",
    dangerZone: "धोकादायक क्षेत्र (Danger Zone)",
    resetData: "सर्व डेटा हटवा / रीसेट करा",
    resetConfirm: "सावधान! यामुळे सर्व कुटुंब गट, व्यक्तींचे प्रोफाइल, खर्च आणि भेटींची माहिती कायमची पुसली जाईल. आपण पुढे जाऊ इच्छिता?",
    importBackup: "डेटा बॅकअप आयात करा",
    exportBackup: "डेटा बॅकअप निर्यात करा",
    aboutLedger: "कौटुंबिक नातेसंबंध नोंदवही",
    version: "आवृत्ती १.०.०",

    // Audit logs
    auditLogs: "सिस्टम ऑडिट लॉग",
    activityCreate: "जोडले {entity}: {name}",
    activityUpdate: "सुधारित केले {entity}: {name}",
    activityDelete: "हटवले {entity}: {name}",

    // Relations Marathi
    Father: "वडील",
    Mother: "आई",
    Brother: "भाऊ",
    Sister: "बहीण",
    Husband: "पती",
    Wife: "पत्नी",
    Son: "मुलगा",
    Daughter: "मुलगी",
    Uncle: "काका / मामा",
    Aunt: "काकू / मामी / मावशी / आत्या",
    Cousin: "चुलत/मावस भाऊ/बहीण",
    Grandfather: "आजोबा",
    Grandmother: "आजी",
    Friend: "मित्र / मैत्रीण",
    Relative: "नातेवाईक",
    OtherRelation: "इतर नाते",

    // Reports Config Labels
    repSelectCategory: "अहवाल श्रेणी निवडा",
    repNoReportSelected: "कोणताही अहवाल निवडलेला नाही",
    repSelectCategoryDesc: "विश्लेषण सुरू करण्यासाठी डाव्या पॅनेलमधून अहवाल श्रेणी निवडा.",
    repSelectPerson: "व्यक्ती निवडा",
    repSelectPersonDesc: "विशिष्ट व्यक्तीसाठी संपूर्ण भेटवस्तू खातेवही आणि खर्चाचा इतिहास तयार करा.",
    repSelectFamily: "कुटुंब गट निवडा",
    repSelectFamilyDesc: "कुटुंब गटातील सर्व सदस्यांसाठी आर्थिक खातेवही आणि भेटींची संख्या एकत्रित करा.",
    repSelectEvent: "कार्यक्रम निवडा",
    repSelectEventDesc: "विशिष्ट प्रसंगासाठी आयटमवार खर्च, बजेट आणि मिळालेल्या/दिलेल्या सर्व भेटी पहा.",
    repSelectWedding: "लग्न कार्यक्रम निवडा",
    repSelectWeddingDesc: "लग्न नियोजनाच्या कार्यक्रमांसाठी तपशीलवार आर्थिक ट्रॅकर आणि विश्लेषण.",
    repYearFilter: "वर्ष फिल्टर",
    repYearFilterDesc: "वर्षांच्या फिल्टरसह श्रेणीनुसार खर्चाचा तपशील पहा.",
    repAllYears: "सर्व वर्षे",
    repExchangeMode: "देवाणघेवाण मोड",
    repExchangeModeDesc: "तुमच्या वर्तुळात देवाणघेवाण झालेल्या रोख विरुद्ध दागिने आणि इतर मालमत्तेचे विश्लेषण करा.",
    repBothModes: "मिळालेले आणि दिलेले दोन्ही",
    repReportFor: "अहवाल: {name}"
  }
};

let currentLang = localStorage.getItem("family_ledger_lang") || "en";

function t(key, replacements = {}) {
  const dict = translations[currentLang] || translations.en;
  let text = dict[key] || translations.en[key] || key;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

function getLanguage() {
  return currentLang;
}

function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("family_ledger_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    return true;
  }
  return false;
}

// Export functions to global scope
window.translations = translations;
window.t = t;
window.getLanguage = getLanguage;
window.setLanguage = setLanguage;
