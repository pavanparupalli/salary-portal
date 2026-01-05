const monthFromSelect = document.getElementById("monthSelect");
const monthToSelect   = document.getElementById("monthToSelect");
const employeeSelect  = document.getElementById("employeeSelect");

const empNameEl = document.getElementById("empName");
const grossEl   = document.getElementById("gross");
const daysEl    = document.getElementById("paidDays");
const basicEl   = document.getElementById("basic");
const titleEl   = document.getElementById("statementTitle");
const statement = document.getElementById("statement");

// Find employee by S.No (SAFE)
function findEmployee(month, sno) {
  return salaryData[month]?.find(e => e.sno == sno);
}

// Populate employees when FROM month changes
function populateEmployees() {
  employeeSelect.innerHTML = `<option value="">Select Employee</option>`;

  const fromMonth = monthFromSelect.value;
  if (!fromMonth || !salaryData[fromMonth]) return;

  const employees = [...salaryData[fromMonth]].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  employees.forEach(emp => {
    const opt = document.createElement("option");
    opt.value = emp.sno;      // 🔑 USE S.NO
    opt.textContent = emp.name;
    employeeSelect.appendChild(opt);
  });
}

// Generate statement (single or consolidated)
function generateStatement() {
  const fromMonth = monthFromSelect.value;
  const toMonth   = monthToSelect.value;
  const sno       = employeeSelect.value;

  if (!fromMonth || !toMonth || !sno) {
    statement.style.display = "none";
    return;
  }

  const months = Object.keys(salaryData);
  const start = months.indexOf(fromMonth);
  const end   = months.indexOf(toMonth);

  if (start === -1 || end === -1 || start > end) {
    alert("Invalid month range");
    return;
  }

  let gross = 0, days = 0, basic = 0, name = "";

  for (let i = start; i <= end; i++) {
    const emp = findEmployee(months[i], sno);
    if (!emp) continue;

    name = emp.name;
    gross += Number(emp.gross);
    days  += Number(emp.paidDays);
    basic += Number(emp.basic);
  }

  empNameEl.textContent = name;
  grossEl.textContent   = "₹ " + gross.toLocaleString();
  daysEl.textContent    = days;
  basicEl.textContent   = "₹ " + basic.toLocaleString();

  titleEl.textContent =
    fromMonth === toMonth
      ? `Salary Statement – ${fromMonth}`
      : `Consolidated Salary Statement – ${fromMonth} to ${toMonth}`;

  statement.style.display = "block";
}

// EVENTS
monthFromSelect.addEventListener("change", () => {
  populateEmployees();
  generateStatement();
});
monthToSelect.addEventListener("change", generateStatement);
employeeSelect.addEventListener("change", generateStatement);
