const container = document.querySelector('.container');
const loginCard = document.querySelector('.login-card');
const startBtn = document.getElementById('btn');
const backBtn = document.getElementById('back-btn');
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');

// Slide từ Welcome đến Login/Register (Translate -50%)
startBtn.addEventListener('click', () => {
    container.classList.add('slide-active');
});

// Slide ngược trở lại từ Login/Register về Welcome
backBtn.addEventListener('click', () => {
    container.classList.remove('slide-active');
    // Tùy chọn: khôi phục về trạng thái đăng nhập khi quay trở lại
    // loginCard.classList.remove('right-panel-active'); 
});

// Trượt qua lại giữa Sign In và Sign Up
signUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.add('right-panel-active');
});

signInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.remove('right-panel-active');
});
