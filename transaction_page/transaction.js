const btn = document.getElementById("addBtn");
const cancel = document.getElementById("cancelBtn");
const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");

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

function closeForm() {
    overlay.classList.add("hidden");
    formPopup.classList.add("hidden");
}


