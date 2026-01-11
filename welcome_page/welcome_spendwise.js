const btn = document.getElementById('btn');
const container = document.querySelector('.welcome-section');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    var targetURL = "dangnhap.html";
     if (!document.startViewTransition){
        window.location.href = targetURL;
        return;
     }

     document.startViewTransition(() => {
        window.location.href = targetURL;
     });
});

btn.addEventListener('click', function(e) {
    e.preventDefault();
    var link = e.href;
    container.classList.add('fade-out');
    //Đợi animation chạy xong (500ms) rồi mới chuyển trang
    setTimeout(() => {
        window.location.href = link;
    }, 500);
});