//Đảm bảo các phần tử HTML đã tồn tại trước khi JavaScript can thiệp vào.

document.addEventListener('DOMContentLoaded', function () {
    const localUser = JSON.parse(localStorage.getItem('user'));
    //Hiển thị tên đăng nhập trên trang 
    if (localUser && localUser.username) {
        fetch(`http://localhost:3000/api/user/${localUser.username}`)
            .then(res => {
                if (!res.ok) throw new Error('User check failed');
                return res.json();
            })
            .then(user => {
                const userNameElement = document.getElementById('user-name');
                if (userNameElement) {
                    userNameElement.textContent = user.username;
                }
            })
            .catch(err => {
                console.error('Error fetching user:', err);
                window.location.href = '../welcome_page/welcome_spendwise.html';
            });
    } else {
        // Chuyển về đăng nhập nếu không tìm thấy user
        window.location.href = '../welcome_page/welcome_spendwise.html';
    }

    loadOverviewData();
});

//Hàm lấy dữ liệu từ server
async function loadOverviewData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) return; // Should handle not logged in better, but for now just return

        const response = await fetch(`http://localhost:3000/api/transactions?username=${user.username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const transactions = await response.json();

        // Cập nhật các cards
        updateSummaryCards(transactions);
        // Chuẩn bị dữ liệu cho chart
        renderDoughnutChart(transactions);
        renderLineChart(transactions);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu tổng quan:', error);
    }
}

function updateSummaryCards(transactions) {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'thu') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    // Định dạng đơn vị tiền tệ
    const formatter = new Intl.NumberFormat('vi-VN');

    const card1 = document.querySelector('#card-1 .value-card span'); // Số dư hiện tại
    const card2 = document.querySelector('#card-2 .value-card span'); // Thu nhập
    const card3 = document.querySelector('#card-3 .value-card span'); // Chi tiêu

    //Hiển thị dữ liệu
    if (card1) card1.textContent = formatter.format(balance);
    if (card2) card2.textContent = formatter.format(totalIncome);
    if (card3) card3.textContent = formatter.format(totalExpense);
}

let doughnutChartInstance = null;
let lineChartInstance = null;

function renderDoughnutChart(transactions) {
    const expenseTransactions = transactions.filter(t => t.type === 'chi');

    // Kiểm tra xem có giao dịch chi phí nào không.
    if (expenseTransactions.length === 0) {
        // Biểu đồ trống
    }

    // Gom nhóm theo loại
    const categoryTotals = {};
    expenseTransactions.forEach(t => {
        if (categoryTotals[t.category]) {
            categoryTotals[t.category] += t.amount;
        } else {
            categoryTotals[t.category] = t.amount;
        }
    });

    //map(): vòng lặp biến đổi
    const labels = Object.keys(categoryTotals).map(cat => getCategoryName(cat)); //Lấy tên danh mục
    const data = Object.values(categoryTotals); //Lấy giá trị (con số)

    // Màu cho các loại
    const backgroundColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#e7e9ed', '#767676', '#58595b', '#a7a9ac'
    ];

    const ctxCanvas = document.getElementById('doughnut-chart');
    if (!ctxCanvas) return;
    const ctx = ctxCanvas.getContext('2d');

    if (doughnutChartInstance) doughnutChartInstance.destroy();

    doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Chi tiêu theo danh mục',
                data: data,
                backgroundColor: backgroundColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Cơ cấu chi tiêu',
                    font: { size: 18 }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderLineChart(transactions) {
    // Sắp xếp giao dịch theo ngày
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Gom nhóm theo ngày
    const dateGroups = {};
    transactions.forEach(t => {
        if (!dateGroups[t.date]) {
            dateGroups[t.date] = { thu: 0, chi: 0 };
        }
        dateGroups[t.date][t.type] += t.amount;
    });

    // Lấy dữ liệu của 7 ngày gần nhất hoặc tất cả các ngày nếu ít hơn.
    const dates = Object.keys(dateGroups).sort(); // định dạng ngày: YYYY-MM-DD

    const incomeData = dates.map(date => dateGroups[date].thu);
    const expenseData = dates.map(date => dateGroups[date].chi);

    // Định dạng cách hiển thị ngày (DD/MM)
    const displayDates = dates.map(date => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    const ctxCanvas = document.getElementById('line-chart');
    if (!ctxCanvas) return;
    const ctx = ctxCanvas.getContext('2d');

    if (lineChartInstance) lineChartInstance.destroy();

    lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: displayDates,
            datasets: [
                {
                    label: 'Thu nhập',
                    data: incomeData,
                    borderColor: '#1D8B6E', // Green
                    backgroundColor: 'rgba(29, 139, 110, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Chi tiêu',
                    data: expenseData,
                    borderColor: '#E73B55', // Red
                    backgroundColor: 'rgba(231, 59, 85, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Thu nhập & Chi tiêu theo thời gian',
                    font: { size: 16 }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getCategoryName(key) {
    const map = {
        'food': 'Ăn uống',
        'moverment': 'Di chuyển',
        'house': 'Nhà cửa',
        'shopping': 'Mua sắm',
        'entertainment': 'Giải trí',
        'health': 'Sức khỏe',
        'education': 'Giáo dục',
        'gift': 'Quà tặng',
        'other': 'Khác'
    };
    return map[key] || key;
}
