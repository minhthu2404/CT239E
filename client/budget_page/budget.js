const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");
const title = document.getElementById("form-title");
const cancel = document.getElementById("cancelBtn");
const categoryIcon = document.getElementById("form-category-icon");
const categoryText = document.getElementById("form-category-text");
const budgetForm = document.getElementById("budget-form");
const amountInput = document.getElementById("amount");

let currentBudgets = [];
let currentTransactions = [];
let currentDeleteCategory = null;

const confirmDeletionPopup = document.getElementById("confirm-deletion");

const cancelDeleteBtn = confirmDeletionPopup.querySelector(
  ".delete-option button:first-child",
);

const confirmDeleteBtn = confirmDeletionPopup.querySelector(
  ".delete-option button:last-child",
);

const categoryMap = {
  "Ăn uống": "food",
  "Di chuyển": "movement",
  "Nhà cửa": "house",
  "Mua sắm": "shopping",
  "Giải trí": "entertainment",
  "Sức khỏe": "health",
  "Giáo dục": "education",
  "Quà tặng": "gift",
};

function getCurrentMonthStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

async function loadBudgetData() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.username) return;

  const monthStr = getCurrentMonthStr();

  try {
    // Fetch budgets
    const budgetsRes = await fetch(
      `http://localhost:3000/api/budgets?username=${user.username}&month=${monthStr}`,
    );
    if (budgetsRes.ok) {
      currentBudgets = await budgetsRes.json();
    }

    // Fetch all transactions and filter for current month
    const transRes = await fetch(
      `http://localhost:3000/api/transactions?username=${user.username}`,
    );
    if (transRes.ok) {
      const allTransactions = await transRes.json();
      currentTransactions = allTransactions.filter((t) => {
        const tDate = new Date(t.date);
        const tMonthStr = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, "0")}`;
        return tMonthStr === monthStr;
      });
    }

    updateUI();
  } catch (err) {
    console.error("Error loading budget data:", err);
  }
}

function updateUI() {
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = getDaysInMonth(now.getFullYear(), now.getMonth() + 1);
  const remainingDays = daysInMonth - currentDay + 1; // including today

  const budgetElements = document.querySelectorAll(".budget");

  budgetElements.forEach((el) => {
    const categoryName = el.querySelector(".budget-title span").innerText;
    const categoryValue = categoryMap[categoryName] || categoryName;

    const budgetObj = currentBudgets.find((b) => b.category === categoryValue);
    const adjustBtn = el.querySelector(".adjust");
    const deleteBtn = el.querySelector(".delete-budget");
    const settingContainer = el.querySelector(".budget-setting");

    if (budgetObj) {
      // Calculate spent
      const spent = currentTransactions
        .filter((t) => t.category === categoryValue && t.type === "chi")
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budgetObj.amount - spent;
      const dailyAvg =
        remaining > 0 ? Math.floor(remaining / remainingDays) : 0;

      const percent =
        budgetObj.amount > 0
          ? Math.min(Math.round((spent / budgetObj.amount) * 100), 100)
          : 0;
      const progressColor =
        percent > 90 ? "#E73B55" : percent > 75 ? "#FF9800" : "#1D8B6E";

      adjustBtn.style.display = "block";
      if (deleteBtn) deleteBtn.style.display = "block";
      settingContainer.innerHTML = `
                <div class="budget-details">
                    <div class="budget-amounts">
                        <div class="amount-item">
                            <span class="label">Đã chi</span>
                            <span class="value spent">${new Intl.NumberFormat("vi-VN").format(spent)} đ</span>
                        </div>
                        <div class="amount-item" style="text-align: right;">
                            <span class="label">Ngân sách</span>
                            <span class="value total">${new Intl.NumberFormat("vi-VN").format(budgetObj.amount)} đ</span>
                        </div>
                    </div>
                    
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percent}%; background-color: ${progressColor};"></div>
                    </div>
                    
                    <div class="budget-status">
                        <div class="remaining">
                            ${remaining >= 0 ? "Còn lại:" : "Vượt ngân sách:"} <span style="color: ${remaining >= 0 ? "#1D8B6E" : "#E73B55"}; font-weight: bold;">
                                ${new Intl.NumberFormat("vi-VN").format(Math.abs(remaining))} đ
                            </span>
                        </div>
                        <div class="daily-avg">
                            Ngày: <span>${new Intl.NumberFormat("vi-VN").format(dailyAvg)} đ</span>
                        </div>
                    </div>
                </div>
            `;
    } else {
      adjustBtn.style.display = "none";
      if (deleteBtn) deleteBtn.style.display = "none";
      settingContainer.innerHTML = `
                <p>Chưa thiết lập ngân sách</p>
                <button type="button" class="setup" data-category="${categoryName}">Thiết lập ngay</button>
            `;
    }
  });

  // Reattach event listeners for dynamic setup buttons
  attachFormOpeners();
  attachDeleteButtons();
}

function openForm(categoryName, iconClass) {
  overlay.classList.remove("hidden");
  const budgetObj = currentBudgets.find(
    (b) => b.category === categoryMap[categoryName],
  );

  if (budgetObj) {
    title.innerText = "Chỉnh sửa thiết lập";
    amountInput.value = budgetObj.amount;
  } else {
    title.innerText = "Thiết lập ngân sách";
    amountInput.value = "";
  }

  categoryText.innerText = categoryName;
  categoryText.dataset.categoryValue = categoryMap[categoryName];
  categoryIcon.className = iconClass;
}

function attachFormOpeners() {
  const btn_add = document.querySelectorAll(".setup");
  const btn_adjust = document.querySelectorAll(".adjust");

  btn_add.forEach((btn) => {
    btn.onclick = function () {
      const category = this.dataset.category;
      const iconClass =
        this.closest(".budget").querySelector(".budget-title i").className;
      openForm(category, iconClass);
    };
  });

  btn_adjust.forEach((btn) => {
    btn.onclick = function () {
      const category = this.dataset.category;
      const iconClass =
        this.closest(".budget").querySelector(".budget-title i").className;
      openForm(category, iconClass);
    };
  });
}

function openDeleteConfirm(categoryName) {
  currentDeleteCategory = categoryName;
  confirmDeletionPopup.style.display = "flex";
}   

function attachDeleteButtons() {
  const btn_delete = document.querySelectorAll(".delete-budget");

  btn_delete.forEach((btn) => {
    btn.onclick = function () {
      const categoryName = this.dataset.category;
      openDeleteConfirm(categoryName);
    };
  });
}

cancelDeleteBtn.onclick = function () {
  confirmDeletionPopup.style.display = "none";
  currentDeleteCategory = null;
};

confirmDeleteBtn.onclick = async function () {
  if (!currentDeleteCategory) return;

  const categoryValue = categoryMap[currentDeleteCategory];

  const user = JSON.parse(localStorage.getItem("user"));
  const monthStr = getCurrentMonthStr();

  try {
    const res = await fetch(
      `http://localhost:3000/api/budgets?username=${user.username}&category=${categoryValue}&month=${monthStr}`,
      { method: "DELETE" },
    );

    if (res.ok) {
      confirmDeletionPopup.style.display = "none";
      currentDeleteCategory = null;

      loadBudgetData();
    } else {
      alert("Lỗi khi xóa ngân sách");
    }
  } catch (err) {
    console.error(err);
  }
};

function closeForm() {
  overlay.classList.add("hidden");
}

cancel.addEventListener("click", closeForm);
overlay.addEventListener("click", closeForm);

formPopup.addEventListener("click", function (e) {
  e.stopPropagation();
});

budgetForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.username) {
    alert("Vui lòng đăng nhập!");
    return;
  }

  const amount = amountInput.value;
  const categoryValue = categoryText.dataset.categoryValue;
  const monthStr = getCurrentMonthStr();

  try {
    const res = await fetch("http://localhost:3000/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        category: categoryValue,
        month: monthStr,
        amount: parseFloat(amount),
      }),
    });

    if (res.ok) {
      closeForm();
      loadBudgetData(); // Reload budgets and update UI
    } else {
      alert("Lỗi khi lưu ngân sách.");
    }
  } catch (err) {
    console.error("Error saving budget:", err);
  }
});

// Initial load
loadBudgetData();
