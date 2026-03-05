const btn_add = document.getElementsByClassName("setup");
const btn_adjust = document.getElementsByClassName("adjust");
const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");
const title = document.getElementById("form-title");
const cancel = document.getElementById("cancelBtn");

const categoryIcon = document.getElementById("form-category-icon");
const categoryText = document.getElementById("form-category-text");

// mở form
for (let i = 0; i < btn_add.length; i++) {
    btn_add[i].addEventListener("click", function () {
        overlay.classList.remove("hidden");
        title.innerText = "Thiết lập ngân sách";

        const category = this.dataset.category;
        const iconClass = this.closest('.budget').querySelector('.budget-title i').className;
        categoryText.innerText = category;
        categoryIcon.className = iconClass;
    });
}

//mở form chỉnh sửa
for (let i = 0; i < btn_adjust.length; i++) {
    btn_adjust[i].addEventListener("click", function () {
        overlay.classList.remove("hidden");
        title.innerText = "Chỉnh sửa thiết lập";

        const category = this.dataset.category;
        const iconClass = this.closest('.budget').querySelector('.budget-title i').className;
        categoryText.innerText = category;
        categoryIcon.className = iconClass;
    })
}

function closeForm() {
    overlay.classList.add("hidden");
}

//đóng form
cancel.addEventListener("click", closeForm);
overlay.addEventListener("click", closeForm);

formPopup.addEventListener("click", function (e) {
    e.stopPropagation();
});
