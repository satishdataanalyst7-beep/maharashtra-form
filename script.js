// ============================================================
//  Maharashtra Staff Replacement Form – script.js
//  Handles: Dependent dropdown + Google Sheets submission
// ============================================================

// ── 1. YOUR GOOGLE APPS SCRIPT WEB APP URL ──────────────────
// After deploying your Apps Script (see Code.gs), paste the
// URL here between the quotes ↓
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnQydaD_o6MIPNpdsFQjLfdV1AuTZpW-8ZnZ2Nmi5lFsxku4mzqY8V43CdyK4vU1ZF3g/exec";

// ── 2. Division → Districts mapping ─────────────────────────
const divisionDistricts = {
  "Akola": [
    "AKOLA", "AMRAVATI", "BULDHANA", "WASHIM", "YAVATMAL"
  ],
  "CHHATRAPATI SAMBHAJINAGAR": [
    "CHHATRAPATI SAMBHAJINAGAR", "HINGOLI", "JALNA", "PARBHANI"
  ],
  "Kolhapur": [
    "KOLHAPUR", "KOLHAPUR-ICHALKARANJI", "RATNAGIRI", "SANGLI", "SINDHUDURG"
  ],
  "Latur": [
    "BEED", "DHARASHIV", "LATUR", "NANDED"
  ],
  "Nagpur": [
    "BHANDARA", "CHANDRAPUR", "GADCHIROLI", "GONDIA", "NAGPUR", "WARDHA"
  ],
  "Nashik": [
    "AHMADNAGAR", "DHULE", "JALGAON", "NANDURBAR", "NASHIK"
  ],
  "Pune": [
    "PUNE", "SATARA", "SOLAPUR"
  ],
  "Thane": [
    "MUMBAI CITY", "MUMBAI SUBURBAN EAST", "MUMBAI SUBURBAN WEST",
    "PALGHAR", "RAIGAD", "THANE"
  ]
};

// ── 3. Dependent Dropdown Logic ──────────────────────────────
const divisionSelect  = document.getElementById("division");
const districtSelect  = document.getElementById("district");

divisionSelect.addEventListener("change", function () {
  const selected = this.value;

  // Clear old options
  districtSelect.innerHTML = "";

  if (!selected) {
    districtSelect.innerHTML = '<option value="">-- Select Division First --</option>';
    return;
  }

  // Add placeholder
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select District --";
  districtSelect.appendChild(placeholder);

  // Populate matching districts
  const districts = divisionDistricts[selected] || [];
  districts.forEach(function (dist) {
    const opt = document.createElement("option");
    opt.value = dist;
    opt.textContent = dist;
    districtSelect.appendChild(opt);
  });
});

// ── 4. Form Submission to Google Sheets ─────────────────────
const form      = document.getElementById("replacementForm");
const submitBtn = document.getElementById("submitBtn");
const btnText   = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const successMsg = document.getElementById("successMsg");
const errorMsg   = document.getElementById("errorMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Hide old messages
  successMsg.style.display = "none";
  errorMsg.style.display   = "none";

  // Loading state
  submitBtn.disabled    = true;
  btnText.style.display = "none";
  btnLoader.style.display = "inline";

  // Collect form data
  const formData = {
    date:               document.getElementById("date").value,
    division:           document.getElementById("division").value,
    district:           document.getElementById("district").value,
    replacementAgainst: document.getElementById("replacementAgainst").value,
    name:               document.getElementById("name").value,
    designation:        document.getElementById("designation").value,
    mobile:             document.getElementById("mobile").value,
    email:              document.getElementById("email").value,
    communication:      document.getElementById("communication").value,
    technicalKnowledge: document.getElementById("technicalKnowledge").value,
    joiningDate:        document.getElementById("joiningDate").value,
    experience:         document.getElementById("experience").value,
    remarks:            document.getElementById("remarks").value,
    submittedAt:        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",            // Required for Apps Script
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    // no-cors returns opaque response (status 0) – treat as success
    successMsg.style.display = "block";
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    form.reset();
    // Reset district dropdown too
    districtSelect.innerHTML = '<option value="">-- Select Division First --</option>';

  } catch (err) {
    console.error("Submission error:", err);
    errorMsg.style.display = "block";
    errorMsg.scrollIntoView({ behavior: "smooth", block: "center" });
  } finally {
    submitBtn.disabled      = false;
    btnText.style.display   = "inline";
    btnLoader.style.display = "none";
  }
});

// ── 5. Reset helper (called by reset button) ─────────────────
function resetForm() {
  successMsg.style.display = "none";
  errorMsg.style.display   = "none";
  districtSelect.innerHTML = '<option value="">-- Select Division First --</option>';
}
