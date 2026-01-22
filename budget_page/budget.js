const btn_add = document.getElementsByClassName("setup");
const btn_adjust= document.getElementsByClassName("adjust");
const overlay = document.getElementById("overlay");
const formPopup = document.getElementById("formPopup");
const title = document.getElementById("form-title");
const cancel = document.getElementById("cancelBtn");

// mở form
for (let i = 0; i < btn_add.length; i++) {
    btn_add[i].addEventListener("click", function () {
        overlay.classList.remove("hidden");
        title.innerText = "Thiết lập ngân sách";
    });
}

//mở form chỉnh sửa
for (let i=0; i < btn_adjust.length; i++){
    btn_adjust[i].addEventListener("click", function(){
        overlay.classList.remove("hidden");
        title.innerText = "Chỉnh sửa thiết lập";
    })
}

function closeForm(){
    overlay.classList.add("hidden");
}

//đóng form
cancel.addEventListener("click",closeForm);
overlay.addEventListener("click",closeForm);

formPopup.addEventListener("click", function (e) {
    e.stopPropagation();
});
