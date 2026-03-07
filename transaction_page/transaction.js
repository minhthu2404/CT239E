const btn = document.getElementById("addBtn");
const cancel = document.getElementById("cancelBtn");
const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");
const transactionForm = document.getElementById("transactionForm");

let editTransactionId = null;

btn.onclick = function () {
    overlay.classList.remove("hidden");
    formPopup.classList.remove("hidden");
    document.querySelector('.add-title').textContent = "Thêm giao dịch mới";
};

window.editTransaction = function (t) {
    document.querySelector('.add-title').textContent = "Sửa giao dịch";
    editTransactionId = t._id;
    document.querySelector(`input[name="type"][value="${t.type}"]`).checked = true;
    updateCategories(t.type);
    document.getElementById('amount').value = t.amount;
    document.getElementById('input-date').value = t.date.substring(0, 10);
    document.getElementById('opt-category').value = t.category;
    document.getElementById('input-note').value = t.note || '';

    overlay.classList.remove("hidden");
    formPopup.classList.remove("hidden");
};

window.deleteTransaction = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
        fetch(`http://localhost:3000/api/transactions/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert("Đã xóa giao dịch!");
                loadTransactions();
            })
            .catch(err => {
                console.error(err);
                alert("Có lỗi xảy ra khi xóa.");
            });
    }
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
        { value: "other_thu", text: "Khác" }
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
        { value: "other_chi", text: "Khác" }
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
    editTransactionId = null;
    document.querySelector('.add-title').textContent = "Thêm giao dịch mới";
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

    const url = editTransactionId
        ? `http://localhost:3000/api/transactions/${editTransactionId}`
        : 'http://localhost:3000/api/transactions';
    const method = editTransactionId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
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
            alert(editTransactionId ? "Sửa giao dịch thành công!" : "Thêm giao dịch thành công!");
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

        const dateFilter = document.getElementById('search-date') ? document.getElementById('search-date').value : '';
        const categoryFilter = document.getElementById('search-category') ? document.getElementById('search-category').value : '';
        const noteFilter = document.getElementById('search-note') ? document.getElementById('search-note').value : '';

        let url = `http://localhost:3000/api/transactions?username=${user.username}`;
        if (dateFilter) url += `&date=${encodeURIComponent(dateFilter)}`;
        if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;
        if (noteFilter) url += `&note=${encodeURIComponent(noteFilter)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load transactions');
        let transactions = await response.json();

        // Lọc thêm trên client để đảm bảo tìm kiếm ghi chú hoạt động ngay cả khi backend không thay đổi
        if (noteFilter) {
            const lowerNote = noteFilter.toLowerCase();
            transactions = transactions.filter(t => {
                let catText = t.category;
                for (const type in categories) {
                    const found = categories[type].find(c => c.value === t.category);
                    if (found) {
                        catText = found.text;
                        break;
                    }
                }
                const matchNote = t.note && t.note.toLowerCase().includes(lowerNote);
                const matchCategory = catText && catText.toLowerCase().includes(lowerNote);
                return matchNote || matchCategory;
            });
        }

        // Xử lý sắp xếp trên client
        const sortOpt = document.getElementById('sort-opt');

        transactions.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            if (sortOpt && sortOpt.value === 'amount') {
                // Lọc theo 'Số tiền': Ưu tiên số tiền lớn nhất, nếu cùng số tiền thì theo ngày mới nhất
                if (b.amount !== a.amount) {
                    return b.amount - a.amount;
                }
                return dateB - dateA;
            } else {
                // Lọc theo 'Ngày' (Mặc định): Ưu tiên ngày mới nhất, nếu cùng ngày thì số tiền lớn nhất
                if (dateB !== dateA) {
                    return dateB - dateA;
                }
                return b.amount - a.amount;
            }
        });

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
                <div class="info" style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
                    <div class="cat-name" style="font-weight: bold; font-family: Montserrat;">${catText}</div>
                    <div class="date" style="font-size: 0.9em; color: gray;">${date}</div>
                    <div class="note-text" style="font-size: 0.8em; color: #555;">${t.note || ''}</div>
                </div>
                <div class="amount" style="color: ${color}; font-weight: 400; text-align: right; padding-right: 15px;">
                    ${isThu ? '+' : '-'}${amount}
                </div>`;

            const actions = document.createElement('div');
            actions.className = 'actions';
            actions.style.display = 'flex';
            actions.style.gap = '10px';

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
            editBtn.className = "action-btn";
            editBtn.onclick = () => window.editTransaction(t);
            editBtn.title = "Sửa";

            const delBtn = document.createElement('button');
            delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            delBtn.className = "action-btn delete";
            delBtn.onclick = () => window.deleteTransaction(t._id);
            delBtn.title = "Xóa";

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);

            item.appendChild(actions);
            list.appendChild(item);
        });

    } catch (t) {
        console.error('Error loading transactions:', t);
    }
}

// Lắng nghe sự kiện tìm kiếm và sắp xếp
const searchNoteObj = document.getElementById('search-note');
if (searchNoteObj) {
    searchNoteObj.addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(loadTransactions, 300);
    });
}
const searchDateObj = document.getElementById('search-date');
if (searchDateObj) searchDateObj.addEventListener('change', loadTransactions);

const searchCategoryObj = document.getElementById('search-category');
if (searchCategoryObj) searchCategoryObj.addEventListener('change', loadTransactions);

const sortOptObj = document.getElementById('sort-opt');
if (sortOptObj) sortOptObj.addEventListener('change', loadTransactions);

// Gọi tin khi trang tải xong
loadTransactions();