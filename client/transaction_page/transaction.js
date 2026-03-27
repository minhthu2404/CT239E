const btn = document.getElementById("addBtn");
const cancel = document.getElementById("cancelBtn");
const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");
const transactionForm = document.getElementById("transactionForm");

// Ẩn tất cả modal khi tải trang (tránh CSS ID selector ghi đè class hidden)
if (overlay) overlay.style.display = 'none';
if (formPopup) formPopup.style.display = 'none';



function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("input-date").value = today;
}

let editTransactionId = null;

btn.onclick = function () {
    overlay.style.display = 'flex';
    formPopup.style.display = 'flex';
    document.querySelector('.add-title').textContent = "Thêm giao dịch mới";
    setTodayDate();
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

    overlay.style.display = 'flex';
    formPopup.style.display = 'flex';
};

let currentDeleteId = null;
const confirmDeletionPopup = document.getElementById('confirm-deletion');
const cancelDeleteBtn = confirmDeletionPopup.querySelector('.delete-option button:first-child');
const confirmDeleteBtn = confirmDeletionPopup.querySelector('.delete-option button:last-child');

window.deleteTransaction = function (id) {
    currentDeleteId = id;
    confirmDeletionPopup.style.display = 'flex';
};

cancelDeleteBtn.onclick = function () {
    confirmDeletionPopup.style.display = 'none';
    currentDeleteId = null;
};

confirmDeleteBtn.onclick = function () {
    if (!currentDeleteId) return;

    fetch(`http://localhost:3000/api/transactions/${currentDeleteId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            confirmDeletionPopup.style.display = 'none';
            currentDeleteId = null;
            const toast = document.getElementById('success-toast');
            if (toast) {
                document.getElementById('toast-message').textContent = "Xóa giao dịch thành công!";
                toast.style.display = 'flex';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 2000);
            }
            
            loadTransactions();
        })
        .catch(err => {
            console.error(err);
            alert("Có lỗi xảy ra khi xóa.");
        });
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
    overlay.style.display = 'none';
    formPopup.style.display = 'none';
    transactionForm.reset();
    editTransactionId = null;
    document.querySelector('.add-title').textContent = "Thêm giao dịch mới";
    setTodayDate();
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
            const toast = document.getElementById('success-toast');
            if (toast) {
                const isEdit = !!editTransactionId;
                document.getElementById('toast-message').textContent = isEdit ? "Sửa giao dịch thành công!" : "Thêm giao dịch thành công!";
                toast.style.display = 'flex';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 2000);
            }

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

// ─── AI Form: Nhập ghi chú bằng AI ──────────────────────────────────────────

const aiOverlay = document.getElementById('ai-overlay');
const aiNoteInput = document.getElementById('ai-note-input');
const aiError = document.getElementById('ai-error');
const aiParseBtn = document.getElementById('ai-parse-btn');
const aiBtnText = document.getElementById('ai-btn-text');
const aiBtnLoading = document.getElementById('ai-btn-loading');

// Map type AI → radio value của form
const AI_TYPE_MAP = {
    income: 'thu',
    expense: 'chi'
};

// Map category AI → option value category của form
const AI_CATEGORY_MAP = {
    // Thu nhập
    salary: 'salary', lương: 'salary',
    bonus: 'bonus', thưởng: 'bonus',
    interest: 'interest', 'lãi suất': 'interest',
    sale: 'sale', 'bán đồ': 'sale',
    other_thu: 'other_thu',
    // Chi tiêu
    food: 'food', 'ăn uống': 'food',
    movement: 'movement', 'di chuyển': 'movement',
    house: 'house', 'nhà cửa': 'house',
    shopping: 'shopping', 'mua sắm': 'shopping',
    entertainment: 'entertainment', 'giải trí': 'entertainment',
    health: 'health', 'sức khỏe': 'health',
    education: 'education', 'giáo dục': 'education',
    gift: 'gift', 'quà tặng': 'gift',
    other_chi: 'other_chi'
};

function openAIForm() {
    aiOverlay.style.display = 'flex';
    aiNoteInput.value = '';
    showAIError('');
    aiError.style.display = 'none';
    setTimeout(() => aiNoteInput.focus(), 60);
}

function closeAIForm() {
    aiOverlay.style.display = 'none';
}

// Đảm bảo ẩn khi tải trang
if (aiOverlay) aiOverlay.style.display = 'none';

function useExample(btn) {
    aiNoteInput.value = btn.textContent;
    aiNoteInput.focus();
}

async function parseWithAI() {
    const note = aiNoteInput.value.trim();
    if (!note) {
        showAIError('Vui lòng nhập ghi chú giao dịch!');
        aiNoteInput.focus();
        return;
    }

    // Bật loading
    setAILoading(true);
    aiError.classList.add('hidden');

    try {
        const response = await fetch('http://localhost:3000/api/ai/parse-transaction-note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note })
        });

        const data = await response.json();

        if (!response.ok) {
            showAIError(data.message || 'AI không thể phân tích ghi chú này. Hãy thử cách diễn đạt khác.');
            return;
        }

        // Điền dữ liệu vào form thủ công
        const formType = AI_TYPE_MAP[data.type] || 'chi';
        const formCategory = AI_CATEGORY_MAP[data.category] || '';

        // Chọn đúng radio type
        const typeRadio = document.querySelector(`input[name="type"][value="${formType}"]`);
        if (typeRadio) {
            typeRadio.checked = true;
            updateCategories(formType);
        }

        // Điền số tiền
        if (data.amount) {
            document.getElementById('amount').value = data.amount;
        }

        // Điền ngày
        if (data.date) {
            document.getElementById('input-date').value = data.date;
        }

        // Điền danh mục (sau khi updateCategories đã render options)
        setTimeout(() => {
            const catSelect = document.getElementById('opt-category');
            if (catSelect && formCategory) {
                catSelect.value = formCategory;
            }
        }, 50);

        // Điền ghi chú gốc
        document.getElementById('input-note').value = note;

        // Đóng AI modal
        closeAIForm();

        // Mở form thủ công với dữ liệu đã điền sẵn
        document.querySelector('.add-title').textContent = 'Thêm giao dịch mới';
        overlay.style.display = 'flex';
        formPopup.style.display = 'flex';

    } catch (err) {
        console.error('AI parse error:', err);
        showAIError('Không kết nối được server. Hãy kiểm tra server đang chạy.');
    } finally {
        setAILoading(false);
    }
}

function setAILoading(isLoading) {
    aiParseBtn.disabled = isLoading;
    if (isLoading) {
        aiBtnText.classList.add('hidden');
        aiBtnLoading.classList.remove('hidden');
    } else {
        aiBtnText.classList.remove('hidden');
        aiBtnLoading.classList.add('hidden');
    }
}

function showAIError(msg) {
    if (!msg) {
        aiError.style.display = 'none';
        aiError.textContent = '';
        return;
    }
    aiError.textContent = msg;
    aiError.style.display = 'block';
}

// Cho phép nhấn Enter (Ctrl+Enter hoặc Shift+Enter = xuống dòng, Enter = parse)
aiNoteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        parseWithAI();
    }
});

// Expose functions toàn cục
window.openAIForm = openAIForm;
window.closeAIForm = closeAIForm;
window.useExample = useExample;
window.parseWithAI = parseWithAI;