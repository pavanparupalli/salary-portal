// ===============================
// FIXED MONTH ORDER (CRITICAL)
// ===============================
const MONTH_ORDER = ["Jan-2026", "Feb-2026", "Mar-2026"];

// ===============================
// ELEMENTS
// ===============================
const monthFromSelect = document.getElementById("monthSelect");
const monthToSelect   = document.getElementById("monthToSelect");
const employeeSelect  = document.getElementById("employeeSelect");

const empNameEl = document.getElementById("empName");
const grossEl   = document.getElementById("gross");
const daysEl    = document.getElementById("paidDays");
const basicEl   = document.getElementById("basic");
const pfEl      = document.getElementById("pf");
const esiEl     = document.getElementById("esi");
const advEl     = document.getElementById("adv");
const netEl     = document.getElementById("netSalary");
const titleEl   = document.getElementById("statementTitle");
const statement = document.getElementById("statement");

// ===============================
// HELPERS
// ===============================
function getMonthsInRange(from, to) {
  const start = MONTH_ORDER.indexOf(from);
  const end   = MONTH_ORDER.indexOf(to);
  if (start === -1 || end === -1 || start > end) return [];
  return MONTH_ORDER.slice(start, end + 1);
}

function findEmployee(month, sno) {
  return salaryData[month]?.find(e => e.sno === sno) || null;
}

// ===============================
// POPULATE EMPLOYEES
// ===============================
function populateEmployees() {
  employeeSelect.innerHTML = `<option value="">Select Employee</option>`;
  const fromMonth = monthFromSelect.value;
  if (!salaryData[fromMonth]) return;

  salaryData[fromMonth]
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.sno;
      opt.textContent = emp.name;
      employeeSelect.appendChild(opt);
    });
}

// ===============================
// GENERATE STATEMENT (CORRECT)
// ===============================
function generateStatement() {
  const from = monthFromSelect.value;
  const to   = monthToSelect.value;
  const sno  = Number(employeeSelect.value);

  if (!from || !to || !sno) {
    statement.style.display = "none";
    return;
  }

  const months = getMonthsInRange(from, to);
  if (!months.length) {
    alert("Invalid month range");
    return;
  }

  let gross = 0, days = 0, basic = 0, pf = 0, esi = 0, adv = 0, net = 0;
  let name = "";

  months.forEach(month => {
    const emp = findEmployee(month, sno);
    if (!emp) return;

    name  = emp.name;
    gross += emp.gross || 0;
    days  += emp.paidDays || 0;
    basic += emp.basic || 0;
    pf    += emp.pf || 0;
    esi   += emp.esi || 0;
    adv   += emp.adv || 0;
    net   += emp.netSalary || 0;
  });

  empNameEl.textContent = name;
  grossEl.textContent   = "₹ " + gross;
  daysEl.textContent    = days;
  basicEl.textContent   = "₹ " + basic;
  pfEl.textContent      = "₹ " + pf;
  esiEl.textContent     = "₹ " + esi;
  advEl.textContent     = "₹ " + adv;
  netEl.textContent     = "₹ " + net;

  titleEl.textContent =
    from === to
      ? `Salary Statement – ${from}`
      : `Consolidated Salary Statement – ${from} to ${to}`;

  statement.style.display = "block";
}

// ===============================
// EVENTS
// ===============================
monthFromSelect.addEventListener("change", () => {
  populateEmployees();
  generateStatement();
});
monthToSelect.addEventListener("change", generateStatement);
employeeSelect.addEventListener("change", generateStatement);
