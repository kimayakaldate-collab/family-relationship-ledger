// Relational Database Engine using LocalStorage
// Implements audit logging, seeding, relational Integrity, and smart searching.

const DB_PREFIX = "family_ledger_";

const TABLES = {
  PEOPLE: "people",
  FAMILIES: "families",
  EVENTS: "events",
  EXPENSES: "expenses",
  GIFTS_RECEIVED: "gifts_received",
  GIFTS_GIVEN: "gifts_given",
  ACTIVITIES: "activities"
};

// Default seed data representing the Patil Family & typical events
const SEED_DATA = {
  [TABLES.FAMILIES]: [
    { id: "fam-1", name: "Patil Family", description: "Immediate household family" },
    { id: "fam-2", name: "Deshmukh Family", description: "Maternal uncle's family" },
    { id: "fam-3", name: "Kadam Family", description: "In-laws household" },
    { id: "fam-4", name: "Joshi Family", description: "Close neighbours and friends" }
  ],
  [TABLES.PEOPLE]: [
    { id: "p-1", fullName: "Anandrao Patil", relation: "Father", familyId: "Patil Family", gender: "Male", mobileNumber: "9876543210", email: "anandrao.patil@gmail.com", address: "Shivaji Nagar", city: "Pune", notes: "Head of the family.", birthDate: "1965-08-12", anniversaryDate: "1992-05-18", photo: "", status: "Active", dateAdded: "2024-01-01" },
    { id: "p-2", fullName: "Sunita Patil", relation: "Mother", familyId: "Patil Family", gender: "Female", mobileNumber: "9876543211", email: "sunita.patil@gmail.com", address: "Shivaji Nagar", city: "Pune", notes: "Maintains wedding notebook.", birthDate: "1970-11-04", anniversaryDate: "1992-05-18", photo: "", status: "Active", dateAdded: "2024-01-01" },
    { id: "p-3", fullName: "Kimaya Patil", relation: "Sister", familyId: "Patil Family", gender: "Female", mobileNumber: "9876543212", email: "kimaya.patil@gmail.com", address: "Baner Road", city: "Pune", notes: "Wedding event core person.", birthDate: "1996-05-15", anniversaryDate: "2025-11-20", photo: "", status: "Active", dateAdded: "2024-01-01" },
    { id: "p-4", fullName: "Rahul Patil", relation: "Brother", familyId: "Patil Family", gender: "Male", mobileNumber: "9876543213", email: "rahul.patil@gmail.com", address: "Shivaji Nagar", city: "Pune", notes: "Handles logistics.", birthDate: "1999-09-22", anniversaryDate: "", photo: "", status: "Active", dateAdded: "2024-01-01" },
    { id: "p-5", fullName: "Amit Deshmukh", relation: "Uncle", familyId: "Deshmukh Family", gender: "Male", mobileNumber: "9822334455", email: "amit.deshmukh@yahoo.com", address: "Kothrud", city: "Pune", notes: "Maternal uncle (Mama).", birthDate: "1973-04-30", anniversaryDate: "1999-12-05", photo: "", status: "Active", dateAdded: "2024-01-05" },
    { id: "p-6", fullName: "Priya Deshmukh", relation: "Cousin", familyId: "Deshmukh Family", gender: "Female", mobileNumber: "9988776655", email: "priya.d@gmail.com", address: "Kothrud", city: "Pune", notes: "Daughter of Amit Mama.", birthDate: "1997-02-14", anniversaryDate: "", photo: "", status: "Active", dateAdded: "2024-01-10" },
    { id: "p-7", fullName: "Rajesh Deshmukh", relation: "Uncle", familyId: "Deshmukh Family", gender: "Male", mobileNumber: "9822445566", email: "rajesh.d@yahoo.com", address: "Kothrud", city: "Pune", notes: "Maternal uncle (Chhota Mama).", birthDate: "1978-07-15", anniversaryDate: "2005-06-20", photo: "", status: "Active", dateAdded: "2024-01-10" },
    { id: "p-8", fullName: "Anita Patil", relation: "Relative", familyId: "Patil Family", gender: "Female", mobileNumber: "9822556677", email: "anita.p@gmail.com", address: "Hadapsar", city: "Pune", notes: "Aunt from father's side.", birthDate: "1972-03-25", anniversaryDate: "1994-11-23", photo: "", status: "Active", dateAdded: "2024-01-12" },
    { id: "p-9", fullName: "Suresh Patil", relation: "Uncle", familyId: "Patil Family", gender: "Male", mobileNumber: "9822667788", email: "suresh.p@gmail.com", address: "Hadapsar", city: "Pune", notes: "Paternal uncle.", birthDate: "1968-09-18", anniversaryDate: "1994-11-23", photo: "", status: "Active", dateAdded: "2024-01-12" },
    { id: "p-10", fullName: "Mahesh Deshmukh", relation: "Relative", familyId: "Deshmukh Family", gender: "Male", mobileNumber: "9833112233", email: "mahesh.d@gmail.com", address: "Kharadi", city: "Pune", notes: "Cousin uncle.", birthDate: "1980-12-10", anniversaryDate: "2008-05-14", photo: "", status: "Active", dateAdded: "2024-01-15" },
    { id: "p-11", fullName: "Kavita Deshmukh", relation: "Relative", familyId: "Deshmukh Family", gender: "Female", mobileNumber: "9833223344", email: "kavita.d@gmail.com", address: "Kharadi", city: "Pune", notes: "Cousin aunt.", birthDate: "1984-06-08", anniversaryDate: "2008-05-14", photo: "", status: "Active", dateAdded: "2024-01-15" },
    { id: "p-12", fullName: "Vikram Patil", relation: "Uncle", familyId: "Patil Family", gender: "Male", mobileNumber: "9844112233", email: "vikram.p@gmail.com", address: "Aundh", city: "Pune", notes: "Paternal uncle.", birthDate: "1975-01-20", anniversaryDate: "2002-06-18", photo: "", status: "Active", dateAdded: "2024-01-20" },
    { id: "p-13", fullName: "Sandeep Patil", relation: "Relative", familyId: "Patil Family", gender: "Male", mobileNumber: "9844223344", email: "sandeep.p@gmail.com", address: "Aundh", city: "Pune", notes: "Cousin brother.", birthDate: "1994-04-14", anniversaryDate: "", photo: "", status: "Active", dateAdded: "2024-01-20" },
    { id: "p-14", fullName: "Swati Patil", relation: "Relative", familyId: "Patil Family", gender: "Female", mobileNumber: "9844334455", email: "swati.p@gmail.com", address: "Aundh", city: "Pune", notes: "Cousin sister.", birthDate: "1996-08-08", anniversaryDate: "", photo: "", status: "Active", dateAdded: "2024-01-20" },
    { id: "p-15", fullName: "Nilesh Deshmukh", relation: "Cousin", familyId: "Deshmukh Family", gender: "Male", mobileNumber: "9855112233", email: "nilesh.d@gmail.com", address: "Kothrud", city: "Pune", notes: "Amit Mama's son.", birthDate: "2000-10-30", anniversaryDate: "", photo: "", status: "Active", dateAdded: "2024-01-22" },
    { id: "p-16", fullName: "Renu Deshmukh", relation: "Relative", familyId: "Deshmukh Family", gender: "Female", mobileNumber: "9855223344", email: "renu.d@gmail.com", address: "Kothrud", city: "Pune", notes: "Aunt (Mami).", birthDate: "1977-05-02", anniversaryDate: "1999-12-05", photo: "", status: "Active", dateAdded: "2024-01-22" },
    { id: "p-17", fullName: "Sunil Kadam", relation: "In-Law", familyId: "Kadam Family", gender: "Male", mobileNumber: "9866112233", email: "sunil.k@gmail.com", address: "Chinchwad", city: "Pune", notes: "Saurabh's Father.", birthDate: "1966-02-12", anniversaryDate: "1993-02-28", photo: "", status: "Active", dateAdded: "2024-02-01" },
    { id: "p-18", fullName: "Rohini Kadam", relation: "In-Law", familyId: "Kadam Family", gender: "Female", mobileNumber: "9866223344", email: "rohini.k@gmail.com", address: "Chinchwad", city: "Pune", notes: "Saurabh's Mother.", birthDate: "1971-09-09", anniversaryDate: "1993-02-28", photo: "", status: "Active", dateAdded: "2024-02-01" },
    { id: "p-19", fullName: "Saurabh Joshi", relation: "Friend", familyId: "Joshi Family", gender: "Male", mobileNumber: "9877112233", email: "saurabh.j@gmail.com", address: "Baner", city: "Pune", notes: "Close family friend.", birthDate: "1995-12-25", anniversaryDate: "2023-11-20", photo: "", status: "Active", dateAdded: "2024-02-05" },
    { id: "p-20", fullName: "Pooja Joshi", relation: "Friend", familyId: "Joshi Family", gender: "Female", mobileNumber: "9877223344", email: "pooja.j@gmail.com", address: "Baner", city: "Pune", notes: "Saurabh's wife.", birthDate: "1996-03-25", anniversaryDate: "2023-11-20", photo: "", status: "Active", dateAdded: "2024-02-05" }
  ],
  [TABLES.EVENTS]: [
    { id: "ev-1", name: "Kimaya's Wedding", type: "Wedding", date: "2025-11-20", location: "Laxmi Lawns, Pune", description: "Grand wedding celebration.", budget: 1500000, status: "Completed" },
    { id: "ev-2", name: "Kimaya's 28th Birthday", type: "Birthday", date: "2024-05-15", location: "Barbeque Nation, Pune", description: "Family dinner.", budget: 15000, status: "Completed" },
    { id: "ev-3", name: "Diwali Laxmi Pujan 2025", type: "Diwali", date: "2025-11-01", location: "Patil Residence", description: "Annual family gathering.", budget: 25000, status: "Completed" },
    { id: "ev-4", name: "Rahul's Graduation Ceremony", type: "Graduation", date: "2024-07-10", location: "COEP Auditorium", description: "Rahul graduating engineering.", budget: 20000, status: "Completed" },
    { id: "ev-5", name: "Amit Mama's 50th Birthday", type: "Birthday", date: "2023-04-30", location: "Deshmukh Residence", description: "Milestone celebration.", budget: 50000, status: "Completed" },
    { id: "ev-6", name: "Priya's Engagement", type: "Engagement", date: "2026-05-20", location: "Grand Sheraton, Pune", description: "Engagement ceremony.", budget: 500000, status: "Completed" },
    { id: "ev-7", name: "Housewarming Ceremony", type: "Housewarming", date: "2024-10-12", location: "Baner Flat", description: "Satyanarayan Puja.", budget: 80000, status: "Completed" },
    { id: "ev-8", name: "Ganesh Chaturthi 2025", type: "Festival", date: "2025-09-07", location: "Patil Residence", description: "Gauri Ganpati arrival.", budget: 40000, status: "Completed" },
    { id: "ev-9", name: "Vikram's Anniversary Dinner", type: "Anniversary", date: "2025-06-18", location: "J W Marriott, Pune", description: "Private family dining.", budget: 30000, status: "Completed" },
    { id: "ev-10", name: "Pooja Joshi's Birthday Party", type: "Birthday", date: "2026-03-25", location: "Joshi Flat", description: "Weekend get together.", budget: 10000, status: "Completed" }
  ],
  [TABLES.EXPENSES]: [
    { id: "exp-1", eventId: "ev-1", category: "Catering", subcategory: "Traditional Maharashtrian Lunch", relatedPersonId: "p-3", amount: 350000, date: "2025-11-19", description: "Catering advance.", notes: "Vendor receipt #890.", attachmentName: "", attachmentData: "", vendor: "Shree Swayampaka Caterers", paymentMethod: "Cash" },
    { id: "exp-2", eventId: "ev-1", category: "Clothes", subcategory: "Bridal Paithani Saree", relatedPersonId: "p-3", amount: 50000, date: "2025-10-10", description: "Special silk Paithani.", notes: "UPI payment.", attachmentName: "", attachmentData: "", vendor: "Yeola Paithani Emporium", paymentMethod: "UPI" },
    { id: "exp-3", eventId: "ev-1", category: "Jewellery", subcategory: "Gold Mangalsutra", relatedPersonId: "p-3", amount: 120000, date: "2025-10-25", description: "Traditional design gold pendant.", notes: "Father's account.", attachmentName: "", attachmentData: "", vendor: "PNG Jewellers, Pune", paymentMethod: "Card" },
    { id: "exp-4", eventId: "ev-1", category: "Hall", subcategory: "Lawn Booking", relatedPersonId: null, amount: 200000, date: "2025-05-01", description: "Venue rental advance.", notes: "Receipt in file.", vendor: "Laxmi Lawns Manager", paymentMethod: "Net Banking" },
    { id: "exp-5", eventId: "ev-1", category: "Decoration", subcategory: "Stage Floral Decor", relatedPersonId: "p-3", amount: 80000, date: "2025-11-19", description: "Stage marigold decor.", notes: "Paid via UPI.", vendor: "Flora Designers", paymentMethod: "UPI" },
    { id: "exp-6", eventId: "ev-1", category: "Photography", subcategory: "Pre-wedding & Wedding Shoot", relatedPersonId: "p-4", amount: 150000, date: "2025-11-20", description: "Drone and video coverage.", notes: "Paid 50% advance.", vendor: "Pixel Perfect Studios", paymentMethod: "Net Banking" },
    { id: "exp-7", eventId: "ev-1", category: "Printing", subcategory: "Invitation Cards", relatedPersonId: "p-4", amount: 25000, date: "2025-08-12", description: "Laminated premium cards.", notes: "UPI payment.", vendor: "Elegant Press, Pune", paymentMethod: "UPI" },
    { id: "exp-8", eventId: "ev-1", category: "Miscellaneous", subcategory: "Pooja Materials", relatedPersonId: "p-2", amount: 15000, date: "2025-11-18", description: "Coconuts, flowers, sweets.", notes: "Cash paid.", vendor: "Local Market Vendor", paymentMethod: "Cash" },
    { id: "exp-9", eventId: "ev-2", category: "Catering", subcategory: "Dinner buffet", relatedPersonId: "p-3", amount: 12000, date: "2024-05-15", description: "Birthday party buffet.", notes: "Card payment.", vendor: "Barbeque Nation", paymentMethod: "Card" },
    { id: "exp-10", eventId: "ev-3", category: "Miscellaneous", subcategory: "Diwali Crackers & Sweets", relatedPersonId: "p-1", amount: 18000, date: "2025-10-31", description: "Crackers and dry fruit boxes.", notes: "Paid in cash.", vendor: "Saras Sweets", paymentMethod: "Cash" },
    { id: "exp-11", eventId: "ev-4", category: "Catering", subcategory: "Lunch party", relatedPersonId: "p-4", amount: 15000, date: "2024-07-10", description: "COEP graduation lunch.", notes: "Paid via UPI.", vendor: "COEP Cafeteria", paymentMethod: "UPI" },
    { id: "exp-12", eventId: "ev-5", category: "Decoration", subcategory: "Baloon & Banner Decor", relatedPersonId: "p-5", amount: 10000, date: "2023-04-29", description: "50th birthday decorations.", notes: "Cash payment.", vendor: "Party Decorators", paymentMethod: "Cash" },
    { id: "exp-13", eventId: "ev-6", category: "Hall", subcategory: "Hall rental advance", relatedPersonId: "p-6", amount: 150000, date: "2026-02-15", description: "Sheraton Banquet hall.", notes: "Paid via netbanking.", vendor: "Sheraton Booking", paymentMethod: "Net Banking" },
    { id: "exp-14", eventId: "ev-6", category: "Clothes", subcategory: "Groom & Bride wear", relatedPersonId: "p-6", amount: 80000, date: "2026-04-10", description: "Engagement dress sets.", notes: "Paid via card.", vendor: "Manyavar, Pune", paymentMethod: "Card" },
    { id: "exp-15", eventId: "ev-7", category: "Miscellaneous", subcategory: "Puja Samagri", relatedPersonId: "p-1", amount: 12000, date: "2024-10-11", description: "Puja flowers and fruits.", notes: "Cash paid.", vendor: "Temple Vendor", paymentMethod: "Cash" },
    { id: "exp-16", eventId: "ev-8", category: "Miscellaneous", subcategory: "Ganpati idol & decoration", relatedPersonId: "p-2", amount: 20000, date: "2025-09-06", description: "Clay Ganpati idol & eco decor.", notes: "UPI payment.", vendor: "Artisan Gokhale", paymentMethod: "UPI" },
    { id: "exp-17", eventId: "ev-9", category: "Catering", subcategory: "Family dining buffet", relatedPersonId: "p-12", amount: 25000, date: "2025-06-18", description: "Anniversary dinner.", notes: "Card payment.", vendor: "J W Marriott Restaurant", paymentMethod: "Card" },
    { id: "exp-18", eventId: "ev-10", category: "Catering", subcategory: "Snacks & Drinks", relatedPersonId: "p-20", amount: 8000, date: "2026-03-25", description: "Birthday party snacks.", notes: "Cash paid.", vendor: "Local Grocery Store", paymentMethod: "Cash" },
    { id: "exp-19", eventId: null, category: "Miscellaneous", subcategory: "Medical health checkup", relatedPersonId: "p-1", amount: 5000, date: "2025-04-12", description: "Father annual health checkup.", notes: "UPI paid.", vendor: "Apollo Clinic", paymentMethod: "UPI" },
    { id: "exp-20", eventId: null, category: "Miscellaneous", subcategory: "Mobile Recharge", relatedPersonId: "p-3", amount: 1500, date: "2025-09-18", description: "Kimaya mobile annual pack.", notes: "UPI paid.", vendor: "Jio App", paymentMethod: "UPI" },
    { id: "exp-21", eventId: "ev-1", category: "Catering", subcategory: "Breakfast Catering", relatedPersonId: "p-3", amount: 70000, date: "2025-11-20", description: "Breakfast for wedding morning.", notes: "UPI paid.", vendor: "Shree Swayampaka Caterers", paymentMethod: "UPI" },
    { id: "exp-22", eventId: "ev-1", category: "Clothes", subcategory: "Family Wear Dupattas", relatedPersonId: "p-2", amount: 20000, date: "2025-10-15", description: "Matching silk dupattas.", notes: "Cash paid.", vendor: "Peshwai Sarees", paymentMethod: "Cash" },
    { id: "exp-23", eventId: "ev-1", category: "Hall", subcategory: "Extra Rooms Reservation", relatedPersonId: null, amount: 60000, date: "2025-11-19", description: "Guest lodging extra rooms.", notes: "Net banking.", vendor: "Laxmi Lodges", paymentMethod: "Net Banking" },
    { id: "exp-24", eventId: "ev-1", category: "Decoration", subcategory: "Welcome Arch & Carpet", relatedPersonId: "p-4", amount: 30000, date: "2025-11-19", description: "Main gate welcome arch.", notes: "UPI payment.", vendor: "Flora Designers", paymentMethod: "UPI" },
    { id: "exp-25", eventId: "ev-1", category: "Photography", subcategory: "Photo Albums Printing", relatedPersonId: "p-4", amount: 40000, date: "2026-01-10", description: "Printed laminated hardbound albums.", notes: "UPI payment.", vendor: "Pixel Perfect Studios", paymentMethod: "UPI" },
    { id: "exp-26", eventId: "ev-6", category: "Catering", subcategory: "High Tea & Sweets", relatedPersonId: "p-6", amount: 90000, date: "2026-05-20", description: "Engagement ceremony catering.", notes: "Paid via card.", vendor: "Sheraton Catering", paymentMethod: "Card" },
    { id: "exp-27", eventId: "ev-6", category: "Decoration", subcategory: "Scented Flower Garlands", relatedPersonId: "p-6", amount: 20000, date: "2026-05-19", description: "Garlands for stage.", notes: "Cash paid.", vendor: "Local Flower vendor", paymentMethod: "Cash" },
    { id: "exp-28", eventId: "ev-7", category: "Catering", subcategory: "Traditional Lunch", relatedPersonId: "p-1", amount: 40000, date: "2024-10-12", description: "Lunch buffet for guests.", notes: "UPI paid.", vendor: "Annapurna Caterers", paymentMethod: "UPI" },
    { id: "exp-29", eventId: "ev-8", category: "Miscellaneous", subcategory: "Puja Modak Sweets", relatedPersonId: "p-2", amount: 10000, date: "2025-09-07", description: "Ukdiche modak sweet box orders.", notes: "Cash paid.", vendor: "Modak House", paymentMethod: "Cash" },
    { id: "exp-30", eventId: "ev-9", category: "Miscellaneous", subcategory: "Anniversary Gift wrap", relatedPersonId: "p-12", amount: 5000, date: "2025-06-18", description: "Gift wrap and decorations.", notes: "Cash paid.", vendor: "Gift Shop", paymentMethod: "Cash" }
  ],
  [TABLES.GIFTS_RECEIVED]: [
    { id: "gr-1", personId: "p-5", eventId: "ev-2", occasion: "Kimaya's Birthday", giftType: "Cash", giftName: "Shagun Cash", description: "Birthday shagun.", estimatedValue: 1000, date: "2024-05-15", notes: "From Amit Mama." },
    { id: "gr-2", personId: "p-6", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Gold", giftName: "Gold Ring (4 grams)", description: "Bridal ring.", estimatedValue: 28000, date: "2025-11-20", notes: "From Priya Cousin." },
    { id: "gr-3", personId: "p-5", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Silver", giftName: "Silver Plate and Glass Set", description: "Puja silver plate.", estimatedValue: 8500, date: "2025-11-20", notes: "From Amit Mama." },
    { id: "gr-4", personId: "p-7", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Gold", giftName: "Gold Chain (8 grams)", description: "Necklace chain.", estimatedValue: 55000, date: "2025-11-20", notes: "From Rajesh Mama." },
    { id: "gr-5", personId: "p-8", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Clothes", giftName: "Silk Saree", description: "South silk saree.", estimatedValue: 6000, date: "2025-11-20", notes: "From Anita Kaku." },
    { id: "gr-6", personId: "p-9", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Cash", giftName: "Wedding Shagun Cash", description: "Shagun cash envelope.", estimatedValue: 5000, date: "2025-11-20", notes: "From Suresh Kaka." },
    { id: "gr-7", personId: "p-10", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Silver", giftName: "Silver Bowl Set", description: "Two silver bowls.", estimatedValue: 4000, date: "2025-11-20", notes: "From Mahesh Kaka." },
    { id: "gr-8", personId: "p-12", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Cash", giftName: "Shagun Cash Envelope", description: "Cash envelope.", estimatedValue: 11000, date: "2025-11-20", notes: "From Vikram Kaka." },
    { id: "gr-9", personId: "p-13", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Other", giftName: "Microwave Oven", description: "LG microwave.", estimatedValue: 12000, date: "2025-11-20", notes: "From Sandeep Dada." },
    { id: "gr-10", personId: "p-14", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Other", giftName: "Duffel Travel Bag Set", description: "VIP bags.", estimatedValue: 5000, date: "2025-11-20", notes: "From Swati Didi." },
    { id: "gr-11", personId: "p-17", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Gold", giftName: "Gold Pendant Necklace", description: "In-laws gold gift.", estimatedValue: 75000, date: "2025-11-20", notes: "From Sunil Kadam (In-laws)." },
    { id: "gr-12", personId: "p-19", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Other", giftName: "Home Decorative Vase", description: "Friend wedding gift.", estimatedValue: 3000, date: "2025-11-20", notes: "From Saurabh Joshi." },
    { id: "gr-13", personId: "p-5", eventId: "ev-5", occasion: "Amit's 50th Birthday", giftType: "Other", giftName: "Leather Wallet", description: "Birthday party gift.", estimatedValue: 2000, date: "2023-04-30", notes: "Received by Amit Mama." },
    { id: "gr-14", personId: "p-6", eventId: "ev-6", occasion: "Priya's Engagement", giftType: "Gold", giftName: "Gold Earrings (3 grams)", description: "Engagement jewellery.", estimatedValue: 21000, date: "2026-05-20", notes: "Received by Priya." },
    { id: "gr-15", personId: "p-1", eventId: "ev-7", occasion: "Housewarming", giftType: "Silver", giftName: "Silver Niranjan Diya", description: "Satyanarayan puja gift.", estimatedValue: 3500, date: "2024-10-12", notes: "From Anandrao Patil." },
    { id: "gr-16", personId: "p-7", eventId: "ev-8", occasion: "Ganesh Chaturthi", giftType: "Cash", giftName: "Festival Shagun", description: "Prasad shagun.", estimatedValue: 1000, date: "2025-09-07", notes: "From Rajesh Mama." },
    { id: "gr-17", personId: "p-9", eventId: "ev-8", occasion: "Ganesh Chaturthi", giftType: "Other", giftName: "Sweet Box", description: "Ganpati sweets.", estimatedValue: 500, date: "2025-09-07", notes: "From Suresh Kaka." },
    { id: "gr-18", personId: "p-12", eventId: "ev-9", occasion: "Vikram's Anniversary", giftType: "Clothes", giftName: "Suit Piece", description: "Raymond suit length.", estimatedValue: 5000, date: "2025-06-18", notes: "From Vikram Kaka." },
    { id: "gr-19", personId: "p-20", eventId: "ev-10", occasion: "Pooja's Birthday", giftType: "Other", giftName: "Handbag", description: "Birthday gift bag.", estimatedValue: 2500, date: "2026-03-25", notes: "From Pooja Joshi." },
    { id: "gr-20", personId: "p-3", eventId: null, occasion: "Makar Sankranti", giftType: "Clothes", giftName: "Black Dress Set", description: "Sankranti gift.", estimatedValue: 3500, date: "2026-01-14", notes: "From Kimaya." },
    { id: "gr-21", personId: "p-5", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Cash", giftName: "Wedding Gift Cash", description: "Cash envelope.", estimatedValue: 10000, date: "2025-11-20", notes: "From Amit Mama." },
    { id: "gr-22", personId: "p-7", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Silver", giftName: "Silver Coins (50 grams)", description: "Saraswati silver coins.", estimatedValue: 5000, date: "2025-11-20", notes: "From Rajesh Mama." },
    { id: "gr-23", personId: "p-8", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Cash", giftName: "Shagun Envelope", description: "Cash gift.", estimatedValue: 2000, date: "2025-11-20", notes: "From Anita Kaku." },
    { id: "gr-24", personId: "p-10", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Clothes", giftName: "Paithani Saree", description: "Yeola silk saree.", estimatedValue: 8000, date: "2025-11-20", notes: "From Mahesh Kaka." },
    { id: "gr-25", personId: "p-18", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Silver", giftName: "Silver Puja Plate set", description: "Plate, bowl, spoon.", estimatedValue: 12000, date: "2025-11-20", notes: "From Rohini Kadam." }
  ],
  [TABLES.GIFTS_GIVEN]: [
    { id: "gg-1", personId: "p-6", eventId: "", occasion: "Priya's Birthday", giftType: "Cash", giftName: "Birthday Envelope Shagun", description: "Birthday shagun.", estimatedValue: 1500, date: "2026-02-14", notes: "Gave Priya." },
    { id: "gg-2", personId: "p-5", eventId: "ev-3", occasion: "Diwali", giftType: "Other", giftName: "Sweet Box & Dry Fruits", description: "Diwali return gift.", estimatedValue: 3500, date: "2025-11-01", notes: "Gave Amit Mama." },
    { id: "gg-3", personId: "p-7", eventId: "ev-3", occasion: "Diwali", giftType: "Other", giftName: "Sweet Box & dry fruits", description: "Diwali return gift.", estimatedValue: 3500, date: "2025-11-01", notes: "Gave Rajesh Mama." },
    { id: "gg-4", personId: "p-8", eventId: "ev-3", occasion: "Diwali", giftType: "Other", giftName: "Sweet Box & dry fruits", description: "Diwali return gift.", estimatedValue: 3500, date: "2025-11-01", notes: "Gave Anita Kaku." },
    { id: "gg-5", personId: "p-9", eventId: "ev-3", occasion: "Diwali", giftType: "Other", giftName: "Sweet Box & dry fruits", description: "Diwali return gift.", estimatedValue: 3500, date: "2025-11-01", notes: "Gave Suresh Kaka." },
    { id: "gg-6", personId: "p-10", eventId: "ev-3", occasion: "Diwali", giftType: "Other", giftName: "Sweet Box & dry fruits", description: "Diwali return gift.", estimatedValue: 3500, date: "2025-11-01", notes: "Gave Mahesh Kaka." },
    { id: "gg-7", personId: "p-12", eventId: "ev-3", occasion: "Diwali", giftType: "Other", giftName: "Sweet Box & dry fruits", description: "Diwali return gift.", estimatedValue: 3500, date: "2025-11-01", notes: "Gave Vikram Kaka." },
    { id: "gg-8", personId: "p-13", eventId: "ev-4", occasion: "Graduation", giftType: "Other", giftName: "Wrist Watch", description: "Titan watch.", estimatedValue: 4000, date: "2024-07-10", notes: "Gave Sandeep." },
    { id: "gg-9", personId: "p-14", eventId: "ev-4", occasion: "Graduation", giftType: "Clothes", giftName: "Kurti Set", description: "Cotton designer set.", estimatedValue: 2500, date: "2024-07-10", notes: "Gave Swati." },
    { id: "gg-10", personId: "p-5", eventId: "ev-5", occasion: "Amit's 50th Birthday", giftType: "Clothes", giftName: "Suit Length Fabric", description: "Raymond fabric.", estimatedValue: 6000, date: "2023-04-30", notes: "Gave Amit Mama." },
    { id: "gg-11", personId: "p-15", eventId: "ev-5", occasion: "Amit's 50th Birthday", giftType: "Cash", giftName: "Shagun Cash", description: "Party envelope.", estimatedValue: 1000, date: "2023-04-30", notes: "Gave Nilesh." },
    { id: "gg-12", personId: "p-6", eventId: "ev-6", occasion: "Priya's Engagement", giftType: "Gold", giftName: "Gold Pendant (2.5 grams)", description: "Engagement gift.", estimatedValue: 17500, date: "2026-05-20", notes: "Gave Priya." },
    { id: "gg-13", personId: "p-16", eventId: "ev-6", occasion: "Priya's Engagement", giftType: "Clothes", giftName: "Paithani Saree", description: "Silk Mami wear.", estimatedValue: 9000, date: "2026-05-20", notes: "Gave Renu Mami." },
    { id: "gg-14", personId: "p-5", eventId: "ev-7", occasion: "Housewarming", giftType: "Silver", giftName: "Silver Glass Set", description: "Griha pravesh gift.", estimatedValue: 5000, date: "2024-10-12", notes: "Gave Amit Mama." },
    { id: "gg-15", personId: "p-7", eventId: "ev-7", occasion: "Housewarming", giftType: "Silver", giftName: "Silver Plate", description: "Griha pravesh plate.", estimatedValue: 6500, date: "2024-10-12", notes: "Gave Rajesh Mama." },
    { id: "gg-16", personId: "p-17", eventId: "ev-8", occasion: "Ganesh Chaturthi", giftType: "Other", giftName: "Ganpati Pooja Lamp", description: "Brass diya set.", estimatedValue: 3000, date: "2025-09-07", notes: "Gave Sunil Kadam." },
    { id: "gg-17", personId: "p-18", eventId: "ev-8", occasion: "Ganesh Chaturthi", giftType: "Clothes", giftName: "Saree & Kurta set", description: "Parents-in-law festival gifts.", estimatedValue: 8000, date: "2025-09-07", notes: "Gave Rohini Kadam." },
    { id: "gg-18", personId: "p-12", eventId: "ev-9", occasion: "Vikram's Anniversary", giftType: "Silver", giftName: "Silver Frame", description: "Silver double frame.", estimatedValue: 4500, date: "2025-06-18", notes: "Gave Vikram Kaka." },
    { id: "gg-19", personId: "p-20", eventId: "ev-10", occasion: "Pooja's Birthday", giftType: "Other", giftName: "Perfume Set", description: "Branded perfume.", estimatedValue: 3500, date: "2026-03-25", notes: "Gave Pooja." },
    { id: "gg-20", personId: "p-19", eventId: "ev-10", occasion: "Pooja's Birthday", giftType: "Other", giftName: "Leather Belt & Wallet set", description: "Saurabh gift.", estimatedValue: 2000, date: "2026-03-25", notes: "Gave Saurabh Joshi." },
    { id: "gg-21", personId: "p-6", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Clothes", giftName: "Engagement Lehenga Choli", description: "For cousin bride.", estimatedValue: 15000, date: "2025-11-20", notes: "Gave Priya." },
    { id: "gg-22", personId: "p-5", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Clothes", giftName: "Wedding Kurta Pajama set", description: "For Uncle.", estimatedValue: 5000, date: "2025-11-20", notes: "Gave Amit Mama." },
    { id: "gg-23", personId: "p-7", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Clothes", giftName: "Wedding Kurta Pajama set", description: "For Uncle.", estimatedValue: 5000, date: "2025-11-20", notes: "Gave Rajesh Mama." },
    { id: "gg-24", personId: "p-17", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Gold", giftName: "Gold Ring (6 grams)", description: "Groom gold ring.", estimatedValue: 42000, date: "2025-11-20", notes: "Gave Saurabh Kadam." },
    { id: "gg-25", personId: "p-18", eventId: "ev-1", occasion: "Kimaya's Wedding", giftType: "Clothes", giftName: "Saree & Shalu", description: "For Mother-in-law.", estimatedValue: 12000, date: "2025-11-20", notes: "Gave Rohini Kadam." }
  ],
  [TABLES.ACTIVITIES]: [
    { id: "act-1", timestamp: "2024-01-01T10:00:00.000Z", actionType: "CREATE", entityType: "System", entityId: "0", description: "Expanded seed data populated successfully." }
  ]
};

// Database class
class Database {
  constructor() {
    this.init();
  }

  init() {
    // If database is empty, seed it with default data
    const isSeeded = localStorage.getItem(DB_PREFIX + "seeded");
    if (!isSeeded) {
      this.reset();
    }
  }

  // Load all tables into memory from LocalStorage
  readTable(table) {
    const raw = localStorage.getItem(DB_PREFIX + table);
    return raw ? JSON.parse(raw) : [];
  }

  // Write in-memory tables back to LocalStorage
  writeTable(table, data) {
    localStorage.setItem(DB_PREFIX + table, JSON.stringify(data));
  }

  // Generate ID helper
  generateId(prefix = "id") {
    return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }

  resolvePersonFamily(fullName, familyOverride) {
    if (familyOverride && familyOverride.trim()) {
      return familyOverride.trim();
    }
    const parts = fullName.trim().split(/\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : "";
    return surname ? `${surname} Family` : "General Family";
  }

  // Relational helper functions
  // PEOPLE CRUD
  people = {
    all: () => {
      return this.readTable(TABLES.PEOPLE);
    },
    find: (id) => {
      const all = this.readTable(TABLES.PEOPLE);
      return all.find(p => p.id === id);
    },
    create: (data) => {
      const all = this.readTable(TABLES.PEOPLE);
      const resolvedFamily = this.resolvePersonFamily(data.fullName, data.familyOverride);
      const newPerson = {
        id: this.generateId("p"),
        fullName: data.fullName,
        relation: data.relation || "OtherRelation",
        familyOverride: data.familyOverride || "",
        familyId: resolvedFamily, // maintain compatibility
        gender: data.gender || "Male",
        mobileNumber: data.mobileNumber || "",
        email: data.email || "",
        address: data.address || "",
        city: data.city || "",
        notes: data.notes || "",
        birthDate: data.birthDate || "",
        anniversaryDate: data.anniversaryDate || "",
        photo: data.photo || "",
        status: data.status || "Active",
        dateAdded: new Date().toISOString().split("T")[0]
      };
      all.push(newPerson);
      this.writeTable(TABLES.PEOPLE, all);
      this.logActivity("CREATE", "Person", newPerson.id, `Added family member / friend: ${newPerson.fullName}`);
      return newPerson;
    },
    update: (id, data) => {
      const all = this.readTable(TABLES.PEOPLE);
      const index = all.findIndex(p => p.id === id);
      if (index !== -1) {
        const newFullName = data.fullName !== undefined ? data.fullName : all[index].fullName;
        const newOverride = data.familyOverride !== undefined ? data.familyOverride : all[index].familyOverride;
        const resolvedFamily = this.resolvePersonFamily(newFullName, newOverride);

        all[index] = { 
          ...all[index], 
          ...data,
          familyId: resolvedFamily,
          familyOverride: newOverride
        };
        this.writeTable(TABLES.PEOPLE, all);
        this.logActivity("UPDATE", "Person", id, `Updated profile details for: ${all[index].fullName}`);
        return all[index];
      }
      return null;
    },
    delete: (id) => {
      const all = this.readTable(TABLES.PEOPLE);
      const person = all.find(p => p.id === id);
      if (person) {
        const filtered = all.filter(p => p.id !== id);
        this.writeTable(TABLES.PEOPLE, filtered);
        this.logActivity("DELETE", "Person", id, `Deleted record of: ${person.fullName}`);
        return true;
      }
      return false;
    },
    merge: (sourceId, targetId) => {
      const source = this.people.find(sourceId);
      const target = this.people.find(targetId);
      if (!source || !target) return false;

      const gr = this.readTable(TABLES.GIFTS_RECEIVED);
      gr.forEach(g => {
        if (g.personId === sourceId) g.personId = targetId;
      });
      this.writeTable(TABLES.GIFTS_RECEIVED, gr);

      const gg = this.readTable(TABLES.GIFTS_GIVEN);
      gg.forEach(g => {
        if (g.personId === sourceId) g.personId = targetId;
      });
      this.writeTable(TABLES.GIFTS_GIVEN, gg);

      const exp = this.readTable(TABLES.EXPENSES);
      exp.forEach(e => {
        if (e.relatedPersonId === sourceId) e.relatedPersonId = targetId;
      });
      this.writeTable(TABLES.EXPENSES, exp);

      this.people.delete(sourceId);
      this.logActivity("UPDATE", "Person", targetId, `Merged duplicate profile "${source.fullName}" into "${target.fullName}"`);
      return true;
    }
  };

  // FAMILIES CRUD (Now generated dynamically based on surnames)
  families = {
    all: () => {
      const people = this.readTable(TABLES.PEOPLE);
      const familiesMap = {};

      people.forEach(p => {
        const parts = p.fullName.trim().split(/\s+/);
        const surname = parts.length > 1 ? parts[parts.length - 1] : "";
        const defaultFamily = surname ? `${surname} Family` : "General Family";
        const famName = p.familyOverride && p.familyOverride.trim() ? p.familyOverride.trim() : defaultFamily;

        if (!familiesMap[famName]) {
          familiesMap[famName] = {
            id: famName,
            name: famName,
            description: `Generated family group for members of ${famName.replace(" Family", "")}.`
          };
        }
      });

      return Object.values(familiesMap);
    },
    find: (id) => {
      return this.families.all().find(f => f.id === id);
    },
    create: (data) => {
      return { id: data.name, name: data.name };
    },
    update: (id, data) => {
      return { id, ...data };
    },
    delete: (id) => {
      const people = this.readTable(TABLES.PEOPLE);
      people.forEach(p => {
        const parts = p.fullName.trim().split(/\s+/);
        const surname = parts.length > 1 ? parts[parts.length - 1] : "";
        const defaultFamily = surname ? `${surname} Family` : "General Family";
        const actualFam = p.familyOverride && p.familyOverride.trim() ? p.familyOverride.trim() : defaultFamily;
        
        if (actualFam === id) {
          p.familyOverride = "";
          p.familyId = defaultFamily;
        }
      });
      this.writeTable(TABLES.PEOPLE, people);
      this.logActivity("DELETE", "Family", id, `Removed override for family group: ${id}`);
      return true;
    }
  };

  // EVENTS CRUD
  events = {
    all: () => {
      return this.readTable(TABLES.EVENTS).sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    find: (id) => {
      return this.readTable(TABLES.EVENTS).find(e => e.id === id);
    },
    create: (data) => {
      const all = this.readTable(TABLES.EVENTS);
      const newEvent = {
        id: this.generateId("ev"),
        name: data.name,
        type: data.type || "Custom",
        date: data.date,
        location: data.location || "",
        description: data.description || "",
        budget: Number(data.budget) || 0,
        status: data.status || "Upcoming"
      };
      all.push(newEvent);
      this.writeTable(TABLES.EVENTS, all);
      this.logActivity("CREATE", "Event", newEvent.id, `Added event: ${newEvent.name} (${newEvent.date})`);
      return newEvent;
    },
    update: (id, data) => {
      const all = this.readTable(TABLES.EVENTS);
      const index = all.findIndex(e => e.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], ...data, budget: Number(data.budget || 0) };
        this.writeTable(TABLES.EVENTS, all);
        this.logActivity("UPDATE", "Event", id, `Modified event settings: ${all[index].name}`);
        return all[index];
      }
      return null;
    },
    delete: (id) => {
      const all = this.readTable(TABLES.EVENTS);
      const event = all.find(e => e.id === id);
      if (event) {
        const filtered = all.filter(e => e.id !== id);
        this.writeTable(TABLES.EVENTS, filtered);

        // Clean event references in expenses, gifts
        const exp = this.readTable(TABLES.EXPENSES);
        exp.forEach(e => {
          if (e.eventId === id) e.eventId = "";
        });
        this.writeTable(TABLES.EXPENSES, exp);

        const gr = this.readTable(TABLES.GIFTS_RECEIVED);
        gr.forEach(g => {
          if (g.eventId === id) g.eventId = "";
        });
        this.writeTable(TABLES.GIFTS_RECEIVED, gr);

        const gg = this.readTable(TABLES.GIFTS_GIVEN);
        gg.forEach(g => {
          if (g.eventId === id) g.eventId = "";
        });
        this.writeTable(TABLES.GIFTS_GIVEN, gg);

        this.logActivity("DELETE", "Event", id, `Deleted event record: ${event.name}`);
        return true;
      }
      return false;
    }
  };

  // EXPENSES CRUD
  expenses = {
    all: () => {
      return this.readTable(TABLES.EXPENSES).sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    find: (id) => {
      return this.readTable(TABLES.EXPENSES).find(e => e.id === id);
    },
    create: (data) => {
      const all = this.readTable(TABLES.EXPENSES);
      const newExp = {
        id: this.generateId("exp"),
        eventId: data.eventId || "",
        category: data.category || "Miscellaneous",
        subcategory: data.subcategory || "",
        relatedPersonId: data.relatedPersonId || null,
        amount: Number(data.amount) || 0,
        date: data.date,
        description: data.description || "",
        notes: data.notes || "",
        attachmentName: data.attachmentName || "",
        attachmentData: data.attachmentData || "",
        vendor: data.vendor || "",
        paymentMethod: data.paymentMethod || "Cash"
      };
      all.push(newExp);
      this.writeTable(TABLES.EXPENSES, all);
      this.logActivity("CREATE", "Expense", newExp.id, `Spent ₹${newExp.amount} on ${newExp.category} (${newExp.subcategory || newExp.description})`);
      return newExp;
    },
    update: (id, data) => {
      const all = this.readTable(TABLES.EXPENSES);
      const index = all.findIndex(e => e.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], ...data, amount: Number(data.amount || 0) };
        this.writeTable(TABLES.EXPENSES, all);
        this.logActivity("UPDATE", "Expense", id, `Modified expense entry for: ${all[index].category} (₹${all[index].amount})`);
        return all[index];
      }
      return null;
    },
    delete: (id) => {
      const all = this.readTable(TABLES.EXPENSES);
      const exp = all.find(e => e.id === id);
      if (exp) {
        const filtered = all.filter(e => e.id !== id);
        this.writeTable(TABLES.EXPENSES, filtered);
        this.logActivity("DELETE", "Expense", id, `Removed expense entry for: ${exp.category} (₹${exp.amount})`);
        return true;
      }
      return false;
    }
  };

  // GIFTS RECEIVED CRUD
  giftsReceived = {
    all: () => {
      return this.readTable(TABLES.GIFTS_RECEIVED).sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    find: (id) => {
      return this.readTable(TABLES.GIFTS_RECEIVED).find(g => g.id === id);
    },
    create: (data) => {
      const all = this.readTable(TABLES.GIFTS_RECEIVED);
      const newGift = {
        id: this.generateId("gr"),
        personId: data.personId,
        eventId: data.eventId || "",
        occasion: data.occasion || "",
        giftType: data.giftType || "Cash",
        giftName: data.giftName,
        description: data.description || "",
        estimatedValue: Number(data.estimatedValue) || 0,
        date: data.date,
        notes: data.notes || "",
        attachmentName: data.attachmentName || "",
        attachmentData: data.attachmentData || ""
      };
      all.push(newGift);
      this.writeTable(TABLES.GIFTS_RECEIVED, all);

      const person = this.people.find(data.personId);
      const personName = person ? person.fullName : "Unknown Person";
      this.logActivity("CREATE", "GiftReceived", newGift.id, `Received ${newGift.giftType} (${newGift.giftName}, ₹${newGift.estimatedValue}) from ${personName}`);
      return newGift;
    },
    update: (id, data) => {
      const all = this.readTable(TABLES.GIFTS_RECEIVED);
      const index = all.findIndex(g => g.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], ...data, estimatedValue: Number(data.estimatedValue || 0) };
        this.writeTable(TABLES.GIFTS_RECEIVED, all);
        this.logActivity("UPDATE", "GiftReceived", id, `Updated gift received: ${all[index].giftName}`);
        return all[index];
      }
      return null;
    },
    delete: (id) => {
      const all = this.readTable(TABLES.GIFTS_RECEIVED);
      const gift = all.find(g => g.id === id);
      if (gift) {
        const filtered = all.filter(g => g.id !== id);
        this.writeTable(TABLES.GIFTS_RECEIVED, filtered);
        this.logActivity("DELETE", "GiftReceived", id, `Removed gift received: ${gift.giftName}`);
        return true;
      }
      return false;
    }
  };

  // GIFTS GIVEN CRUD
  giftsGiven = {
    all: () => {
      return this.readTable(TABLES.GIFTS_GIVEN).sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    find: (id) => {
      return this.readTable(TABLES.GIFTS_GIVEN).find(g => g.id === id);
    },
    create: (data) => {
      const all = this.readTable(TABLES.GIFTS_GIVEN);
      const newGift = {
        id: this.generateId("gg"),
        personId: data.personId,
        eventId: data.eventId || "",
        occasion: data.occasion || "",
        giftType: data.giftType || "Cash",
        giftName: data.giftName,
        description: data.description || "",
        estimatedValue: Number(data.estimatedValue) || 0,
        date: data.date,
        notes: data.notes || "",
        attachmentName: data.attachmentName || "",
        attachmentData: data.attachmentData || ""
      };
      all.push(newGift);
      this.writeTable(TABLES.GIFTS_GIVEN, all);

      const person = this.people.find(data.personId);
      const personName = person ? person.fullName : "Unknown Person";
      this.logActivity("CREATE", "GiftGiven", newGift.id, `Gave ${newGift.giftType} (${newGift.giftName}, ₹${newGift.estimatedValue}) to ${personName}`);
      return newGift;
    },
    update: (id, data) => {
      const all = this.readTable(TABLES.GIFTS_GIVEN);
      const index = all.findIndex(g => g.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], ...data, estimatedValue: Number(data.estimatedValue || 0) };
        this.writeTable(TABLES.GIFTS_GIVEN, all);
        this.logActivity("UPDATE", "GiftGiven", id, `Updated gift given: ${all[index].giftName}`);
        return all[index];
      }
      return null;
    },
    delete: (id) => {
      const all = this.readTable(TABLES.GIFTS_GIVEN);
      const gift = all.find(g => g.id === id);
      if (gift) {
        const filtered = all.filter(g => g.id !== id);
        this.writeTable(TABLES.GIFTS_GIVEN, filtered);
        this.logActivity("DELETE", "GiftGiven", id, `Removed gift given: ${gift.giftName}`);
        return true;
      }
      return false;
    }
  };

  // AUDIT LOG ACTIVITIES
  activities = {
    all: () => {
      return this.readTable(TABLES.ACTIVITIES).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  };

  logActivity(actionType, entityType, entityId, description) {
    const all = this.readTable(TABLES.ACTIVITIES);
    const newAct = {
      id: this.generateId("act"),
      timestamp: new Date().toISOString(),
      actionType,
      entityType,
      entityId,
      description
    };
    all.push(newAct);
    // Limit to 200 items to keep storage healthy
    if (all.length > 200) all.shift();
    this.writeTable(TABLES.ACTIVITIES, all);
  }

  // Get person ledger details (Summary of totals, Timeline, etc)
  getPersonLedger(personId) {
    const received = this.giftsReceived.all().filter(g => g.personId === personId);
    const given = this.giftsGiven.all().filter(g => g.personId === personId);
    const spent = this.expenses.all().filter(e => e.relatedPersonId === personId);

    const totalReceived = received.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    const totalGiven = given.reduce((acc, curr) => acc + curr.estimatedValue, 0);
    const totalSpent = spent.reduce((acc, curr) => acc + curr.amount, 0);

    // Timeline calculations: Sort everything by date chronologically
    const timelineItems = [];

    received.forEach(r => {
      timelineItems.push({
        type: "received",
        date: r.date,
        title: r.giftName,
        value: r.estimatedValue,
        giftType: r.giftType,
        occasion: r.occasion,
        eventId: r.eventId,
        raw: r
      });
    });

    given.forEach(g => {
      timelineItems.push({
        type: "given",
        date: g.date,
        title: g.giftName,
        value: g.estimatedValue,
        giftType: g.giftType,
        occasion: g.occasion,
        eventId: g.eventId,
        raw: g
      });
    });

    spent.forEach(s => {
      timelineItems.push({
        type: "expense",
        date: s.date,
        title: `${s.category} (${s.subcategory || s.description})`,
        value: s.amount,
        occasion: s.eventId ? (this.events.find(s.eventId)?.name || "") : "General Expense",
        eventId: s.eventId,
        raw: s
      });
    });

    timelineItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      totalReceived,
      totalGiven,
      totalSpent,
      netBalance: totalReceived - totalGiven,
      timeline: timelineItems,
      received,
      given,
      expenses: spent
    };
  }

  // Universal Search
  universalSearch(query) {
    if (!query) return { people: [], families: [], events: [], giftsReceived: [], giftsGiven: [], expenses: [] };
    const q = query.toLowerCase();

    const people = this.people.all().filter(p => 
      p.fullName.toLowerCase().includes(q) ||
      p.relation.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      (p.notes && p.notes.toLowerCase().includes(q))
    );

    const families = this.families.all().filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );

    const events = this.events.all().filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q))
    );

    const giftsReceived = this.giftsReceived.all().filter(g => {
      const person = this.people.find(g.personId);
      return g.giftName.toLowerCase().includes(q) ||
        g.giftType.toLowerCase().includes(q) ||
        g.occasion.toLowerCase().includes(q) ||
        (person && person.fullName.toLowerCase().includes(q)) ||
        (g.notes && g.notes.toLowerCase().includes(q));
    });

    const giftsGiven = this.giftsGiven.all().filter(g => {
      const person = this.people.find(g.personId);
      return g.giftName.toLowerCase().includes(q) ||
        g.giftType.toLowerCase().includes(q) ||
        g.occasion.toLowerCase().includes(q) ||
        (person && person.fullName.toLowerCase().includes(q)) ||
        (g.notes && g.notes.toLowerCase().includes(q));
    });

    const expenses = this.expenses.all().filter(e => {
      const person = e.relatedPersonId ? this.people.find(e.relatedPersonId) : null;
      return e.category.toLowerCase().includes(q) ||
        (e.subcategory && e.subcategory.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q) ||
        e.paymentMethod.toLowerCase().includes(q) ||
        e.vendor.toLowerCase().includes(q) ||
        (person && person.fullName.toLowerCase().includes(q));
    });

    return { people, families, events, giftsReceived, giftsGiven, expenses };
  }

  // Backup and reset
  reset() {
    Object.entries(SEED_DATA).forEach(([table, data]) => {
      this.writeTable(table, data);
    });
    localStorage.setItem(DB_PREFIX + "seeded", "true");
    this.logActivity("CREATE", "System", "0", "Database initialized / reset with Patil Family demo ledger");
  }

  exportData() {
    const data = {};
    Object.values(TABLES).forEach(t => {
      data[t] = this.readTable(t);
    });
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.values(TABLES).forEach(t => {
        if (data[t]) {
          this.writeTable(t, data[t]);
        }
      });
      localStorage.setItem(DB_PREFIX + "seeded", "true");
      this.logActivity("UPDATE", "System", "0", "Database imported from local JSON backup file");
      return true;
    } catch (e) {
      console.error("Failed to import data: ", e);
      return false;
    }
  }
}

// Global instance
window.db = new Database();
