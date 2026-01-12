// ===============================
// FIXED MONTH ORDER (CRITICAL)
// ===============================
const MONTH_ORDER = ["Jan-2026", "Feb-2026", "Mar-2026"];

// ===============================
// ELEMENTS
// ===============================
const monthFromSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
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
  // Find employee by sno
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
  const month = monthFromSelect.value;
  const sno = Number(employeeSelect.value);

  if (!month || !sno) {
    statement.style.display = "none";
    return;
  }

  const empArr = salaryData[month];
  if (!empArr) {
    statement.style.display = "none";
    return;
  }
  const emp = empArr.find(e => e.sno === sno);
  if (!emp) {
    statement.style.display = "none";
    return;
  }

  empNameEl.textContent = emp.name;
  grossEl.textContent   = "₹ " + (emp.gross || 0);
  daysEl.textContent    = emp.paidDays || 0;
  basicEl.textContent   = "₹ " + (emp.basic || 0);
  pfEl.textContent      = "₹ " + (emp.pf || 0);
  esiEl.textContent     = "₹ " + (emp.esi || 0);
  document.getElementById("professionalTax").textContent = "₹ " + (emp.professionalTax || 0);
  advEl.textContent     = "₹ " + (emp.adv || 0);
  netEl.textContent     = "₹ " + (emp.netSalary || 0);

  titleEl.textContent = `Salary Statement – ${month}`;
  statement.style.display = "block";
}

// ===============================
// EVENTS
// ===============================
monthFromSelect.addEventListener("change", () => {
  populateEmployees();
  generateStatement();
});
employeeSelect.addEventListener("change", generateStatement);
yearSelect.addEventListener("change", generateStatement);
