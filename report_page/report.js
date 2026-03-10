let allTransactions = [];
let trendChartInstance = null;
// Ánh xạ danh mục để lấy Tên, Màu sắc và Icon
const categoriesMap = {
    // Chi
    'food': { text: 'Ăn uống', color: '#FF9800', bg: '#FFF3E0', icon: '<i class="fa-solid fa-mug-hot"></i>' },
    'shopping': { text: 'Mua sắm', color: '#4285F4', bg: '#E8F0FE', icon: '<i class="fa-solid fa-bag-shopping"></i>' },
    'movement': { text: 'Di chuyển', color: '#34A853', bg: '#E6F4EA', icon: '<i class="fa-solid fa-car"></i>' },
    'entertainment': { text: 'Giải trí', color: '#A142F4', bg: '#F3E8FF', icon: '<i class="fa-solid fa-film"></i>' },
    'house': { text: 'Nhà cửa', color: '#FF5252', bg: '#FFEBEE', icon: '<i class="fa-solid fa-house"></i>' },
    'health': { text: 'Sức khỏe', color: '#00BCD4', bg: '#E0F7FA', icon: '<i class="fa-solid fa-heart-pulse"></i>' },
    'education': { text: 'Giáo dục', color: '#3F51B5', bg: '#E8EAF6', icon: '<i class="fa-solid fa-book"></i>' },
    'gift': { text: 'Quà tặng', color: '#E91E63', bg: '#FCE4EC', icon: '<i class="fa-solid fa-gift"></i>' },
    'other_chi': { text: 'Khác', color: '#9E9E9E', bg: '#F5F5F5', icon: '<i class="fa-solid fa-ellipsis"></i>' }
};

document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("opt");
    const monthDisplay = document.getElementById("month-display");

    // Lấy ngày hiện tại để set giá trị tháng/năm mặc định
    const now = new Date();
    const currentMonthStr = String(now.getMonth() + 1).padStart(2, '0');
    monthSelect.value = `${now.getFullYear()}-${currentMonthStr}`;
    monthDisplay.innerHTML = `<i class="fa-regular fa-calendar" style="margin-right: 8px;"></i>Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

    // Load dữ liệu lần đầu
    loadReportData();

    // Lắng nghe sự kiện đổi tháng/năm
    monthSelect.addEventListener("change", function () {
        if (this.value) {
            const parts = this.value.split('-');
            monthDisplay.innerHTML = `<i class="fa-regular fa-calendar" style="margin-right: 8px;"></i>Tháng ${parseInt(parts[1])}/${parts[0]}`;
        }
        processData(this.value);
    });
});

async function loadReportData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) {
            window.location.href = '../welcome_page/welcome_spendwise.html';
            return;
        }

        const response = await fetch(`http://localhost:3000/api/transactions?username=${user.username}`);
        if (!response.ok) throw new Error('Không thể tải giao dịch');
        allTransactions = await response.json();

        // Xử lý dữ liệu cho tháng/năm đang chọn
        const selectedMonthVal = document.getElementById("opt").value;
        processData(selectedMonthVal);

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu báo cáo:', error);
    }
}

function processData(monthYearStr) {
    if (allTransactions.length === 0 || !monthYearStr) return;

    const parts = monthYearStr.split('-');
    const currentYear = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    // Lọc giao dịch tháng được chọn và tháng trước đó
    const currentMonthTransactions = allTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === currentYear;
    });

    let prevMonth = month - 1;
    let prevYear = currentYear;
    if (prevMonth === 0) {
        prevMonth = 12;
        prevYear = currentYear - 1;
    }

    const prevMonthTransactions = allTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === prevMonth && d.getFullYear() === prevYear;
    });

    updateSummaryCards(currentMonthTransactions, prevMonthTransactions, month, currentYear);
    renderTrendChart(currentMonthTransactions);
    renderAllocationList(currentMonthTransactions);
    renderTransactionList(currentMonthTransactions);
}

// Cập nhật các thẻ
function updateSummaryCards(currTx, prevTx, month, year) {
    const fmt = new Intl.NumberFormat('vi-VN');

    // Tháng hiện tại
    let currExpense = 0;
    const currCatTotals = {};

    currTx.forEach(t => {
        if (t.type === 'chi') {
            currExpense += t.amount;
            currCatTotals[t.category] = (currCatTotals[t.category] || 0) + t.amount;
        }
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const currAvgPerDay = currExpense / daysInMonth;

    // Tìm Danh mục lớn nhất
    let topCatId = null;
    let topCatAmount = 0;
    for (const cat in currCatTotals) {
        if (currCatTotals[cat] > topCatAmount) {
            topCatAmount = currCatTotals[cat];
            topCatId = cat;
        }
    }
    const topCatName = topCatId ? (categoriesMap[topCatId] ? categoriesMap[topCatId].text : topCatId) : "---";
    const topCatPercent = currExpense > 0 ? ((topCatAmount / currExpense) * 100).toFixed(0) : 0;

    // Tháng trước (Để tính % thay đổi)
    let prevExpense = 0;
    prevTx.forEach(t => {
        if (t.type === 'chi') prevExpense += t.amount;
    });
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
    const prevAvgPerDay = prevExpense / daysInPrevMonth;

    // Hiển thị thẻ (Card 1, 2, 3)
    const card1Value = document.querySelector('#card-1 .value-card span');
    const card1NoteVal = document.querySelector('#card-1 .note .value-note');
    const card1NoteText = document.querySelector('#card-1 .note');

    const card2Value = document.querySelector('#card-2 .value-card span');
    const card2NoteVal = document.querySelector('#card-2 .note .value-note');
    const card2NoteText = document.querySelector('#card-2 .note');

    const card3Value = document.querySelector('#card-3 .value-card span');
    const card3NoteVal = document.querySelector('#card-3 .note .value-note');

    if (card1Value) card1Value.textContent = fmt.format(currExpense);
    if (card2Value) card2Value.textContent = fmt.format(Math.round(currAvgPerDay));
    if (card3Value) card3Value.textContent = topCatName;
    if (card3NoteVal) card3NoteVal.textContent = topCatPercent;

    // Hàm gắn phần trăm biến động vào Note
    const applyPercentageDiff = (cur, prev, noteValEl, noteTextEl) => {
        if (!noteValEl || !noteTextEl) return;
        if (prev === 0) {
            noteValEl.textContent = "100";
            noteTextEl.innerHTML = `+<span class="value-note">100</span>% so với tháng trước`;
            noteTextEl.className = 'note chitieu'; // Đỏ (Tăng chi là xấu)
            return;
        }

        const diff = cur - prev;
        const percent = Math.abs((diff / prev) * 100).toFixed(0);
        noteValEl.textContent = percent;

        if (diff > 0) {
            noteTextEl.innerHTML = `+<span class="value-note">${percent}</span>% so với tháng trước`;
            noteTextEl.className = 'note chitieu'; // Đỏ (Tăng chi phí)
        } else if (diff < 0) {
            noteTextEl.innerHTML = `-<span class="value-note">${percent}</span>% so với tháng trước`;
            noteTextEl.className = 'note trungbinh'; // Xanh lá (Giảm chi phí)
        } else {
            noteTextEl.innerHTML = `Không đổi so với tháng trước`;
            noteTextEl.className = 'note';
        }
    };

    applyPercentageDiff(currExpense, prevExpense, card1NoteVal, card1NoteText);
    applyPercentageDiff(currAvgPerDay, prevAvgPerDay, card2NoteVal, card2NoteText);
}

// Cập nhật biểu đồ Xu hướng chi tiêu
function renderTrendChart(currTx) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    // Phân bổ các ngày vào 4 Tuần (Tượng trưng: Tuần 1:Ngày 1-7, Tuần 2:8-14, Tuần 3:15-21, Tuần 4:22+)
    let weeks = [0, 0, 0, 0];
    currTx.forEach(t => {
        if (t.type === 'chi') {
            const date = new Date(t.date).getDate();
            if (date <= 7) weeks[0] += t.amount;
            else if (date <= 14) weeks[1] += t.amount;
            else if (date <= 21) weeks[2] += t.amount;
            else weeks[3] += t.amount;
        }
    });

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(110, 110, 225, 0.4)');
    gradient.addColorStop(1, 'rgba(110, 110, 225, 0)');

    if (trendChartInstance) trendChartInstance.destroy();

    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
            datasets: [{
                label: 'Chi tiêu',
                data: weeks,
                borderColor: '#6e6ee1',
                backgroundColor: gradient,
                borderWidth: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6e6ee1',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#888' }
                },
                y: {
                    display: false,
                    min: 0,
                    beginAtZero: true
                }
            },
            layout: {
                padding: { bottom: 20, top: 10 }
            }
        }
    });
}

// Cập nhật Phân bổ danh mục
function renderAllocationList(currTx) {
    const listContainer = document.getElementById('allocationList');
    if (!listContainer) return;

    let totalExpense = 0;
    const catTotals = {};

    currTx.forEach(t => {
        if (t.type === 'chi') {
            totalExpense += t.amount;
            catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
        }
    });

    if (totalExpense === 0) {
        listContainer.innerHTML = '<p style="color:#888; text-align:center;">Chưa có dữ liệu phân bổ</p>';
        return;
    }

    // Sắp xếp danh mục từ lớn đến nhỏ
    const sortedCats = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a]);

    // Lấy top 4
    const top4 = sortedCats.slice(0, 4);

    let html = '';
    top4.forEach(catId => {
        const amount = catTotals[catId];
        const percent = ((amount / totalExpense) * 100).toFixed(0);

        let catInfo = categoriesMap[catId];
        // Fallback default format nếu danh mục không tồn tại trong map
        if (!catInfo) {
            catInfo = { text: catId, color: '#ccc', bg: '#f0f0f0', icon: '' };
        }

        html += `
            <div class="allocation-item">
                <div class="allocation-info">
                    <div class="allocation-name">
                        <div class="dot" style="background-color: ${catInfo.color}"></div>
                        <span>${catInfo.text}</span>
                    </div>
                    <div class="allocation-percent">${percent}%</div>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percent}%; background-color: ${catInfo.color}"></div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
}

// Cập nhật chi tiết giao dịch 
function renderTransactionList(currTx) {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;

    if (currTx.length === 0) {
        transactionList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Chưa có giao dịch nào</div>';
        return;
    }

    // Lọc theo "chi" và rắp xếp lại mới nhất trên cùng
    const sortedTx = [...currTx].filter(t => t.type === 'chi').sort((a, b) => new Date(b.date) - new Date(a.date));

    // Lấy tối đa 5 items
    const recentTx = sortedTx;

    let html = '';
    const fmt = new Intl.NumberFormat('vi-VN');

    recentTx.forEach(t => {
        const d = new Date(t.date);
        const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

        const catInfo = categoriesMap[t.category] || { text: t.category, color: '#9E9E9E', bg: '#F5F5F5', icon: '<i class="fa-solid fa-receipt"></i>' };
        const amountStr = (t.type === 'chi' ? '-' : '+') + fmt.format(t.amount) + ' đ';
        // const amountStr = '-' + fmt.format(t.amount) + ' đ';

        html += `
            <div class="table-row">
                <div class="col-date">${dateStr}</div>
                <div class="col-cat" style="display: flex; align-items: center; gap: 10px;">
                    <div class="trans-icon" style="background-color: ${catInfo.bg}; color: ${catInfo.color};">
                        ${catInfo.icon}
                    </div>
                    <span style="font-weight: 500; color: #333;">${catInfo.text}</span>
                </div>
                <div class="col-amount">${amountStr}</div>
                <div class="col-note">${t.note || ''}</div>
            </div>
        `;
    });

    transactionList.innerHTML = html;
}