const btn = document.getElementById("addBtn");
const cancel = document.getElementById("cancelBtn");
const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");
const transactionForm = document.getElementById("transactionForm");

btn.onclick = function () {
    overlay.classList.remove("hidden");
    formPopup.classList.remove("hidden");
};

// bấm nút Hủy
cancel.onclick = function () {
    closeForm();
};

// bấm ra ngoài (overlay)
overlay.onclick = function () {
    closeForm();
};

// chặn click trong form
formPopup.onclick = function (e) {
    e.stopPropagation();
};

const categories = {
    thu: [
        { value: "salary", text: "Lương" },
        { value: "bonus", text: "Thưởng" },
        { value: "interest", text: "Lãi suất" },
        { value: "sale", text: "Bán đồ" },
        { value: "other", text: "Khác" }
    ],
    chi: [
        { value: "food", text: "Ăn uống" },
        { value: "movement", text: "Di chuyển" },
        { value: "house", text: "Nhà cửa" },
        { value: "shopping", text: "Mua sắm" },
        { value: "entertainment", text: "Giải trí" },
        { value: "health", text: "Sức khỏe" },
        { value: "education", text: "Giáo dục" },
        { value: "gift", text: "Quà tặng" },
        { value: "other", text: "Khác" }
    ]
};

const typeRadios = document.getElementsByName("type");
const categorySelect = document.getElementById("opt-category");

function updateCategories(type) {
    categorySelect.innerHTML = '<option value="">-- Chọn loại --</option>';
    const options = categories[type] || [];
    options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        categorySelect.appendChild(option);
    });
}

// Lắng nghe sự kiện thay đổi radio button
typeRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        updateCategories(this.value);
    });
});

// Khởi tạo danh mục ban đầu (mặc định là 'thu' theo HTML)
updateCategories(document.querySelector('input[name="type"]:checked').value);

function closeForm() {
    overlay.classList.add("hidden");
    formPopup.classList.add("hidden");
    transactionForm.reset();
    // Reset về danh mục mặc định sau khi reset form
    setTimeout(() => {
        const checkedType = document.querySelector('input[name="type"]:checked');
        if (checkedType) updateCategories(checkedType.value);
    }, 0);
}

transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('input-date').value;
    const category = document.getElementById('opt-category').value;
    const note = document.getElementById('input-note').value;

    if (!amount || !date || !category) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
        alert("Vui lòng đăng nhập lại!");
        return;
    }

    const transaction = {
        type: type,
        amount: parseFloat(amount),
        date: date,
        category: category,
        note: note,
        username: user.username
    };

    fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert("Thêm giao dịch thành công!");
            closeForm();
            loadTransactions();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Có lỗi xảy ra khi lưu giao dịch. Hãy chắc chắn Server đang chạy.");
        });
});

// Hàm tải danh sách giao dịch
async function loadTransactions() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.username) return;

        const response = await fetch(`http://localhost:3000/api/transactions?username=${user.username}`);
        if (!response.ok) throw new Error('Failed to load transactions');
        const transactions = await response.json();

        const list = document.getElementById('history-list');
        list.innerHTML = '';

        if (transactions.length === 0) {
            list.innerHTML = 'Chưa có giao dịch nào';
            return;
        }

        transactions.forEach(t => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const date = new Date(t.date).toLocaleDateString('vi-VN');
            const amount = new Intl.NumberFormat('vi-VN').format(t.amount) + 'đ';

            let catText = t.category;
            for (const type in categories) {
                const found = categories[type].find(c => c.value === t.category);
                if (found) {
                    catText = found.text;
                    break;
                }
            }

            const isThu = t.type === 'thu';
            const color = isThu ? '#1D8B6E' : '#E73B55';

            item.innerHTML = `
                <div class="info" style="display: flex; flex-direction: column; gap: 6px;">
                    <div class="cat-name" style="font-weight: bold; font-family: Montserrat;">${catText}</div>
                    <div class="date" style="font-size: 0.9em; color: gray;">${date}</div>
                    <div class="note-text" style="font-size: 0.8em; color: #555;">${t.note || ''}</div>
                </div>
                <div class="amount" style="color: ${color}; font-weight: bold;">
                    ${isThu ? '+' : '-'}${amount}
                </div>
            `;
            list.appendChild(item);
        });

    } catch (e) {
        console.error('Error loading transactions:', e);
    }
}

// Gọi tin khi trang tải xong
loadTransactions();