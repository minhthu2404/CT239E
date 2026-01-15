//Sliding Window

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

//Show Password
const eyeButtons = document.querySelectorAll('.eyeSlash');

const eyeOpenPath = `<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>`;
const eyeClosePath = `<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>`;

eyeButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const inputPassWord = document.getElementById(targetId);
        const eyeIcon = this.querySelector('svg');

        if (inputPassWord) {
            const currentType = inputPassWord.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            inputPassWord.setAttribute('type', newType);
            eyeIcon.innerHTML = (newType === 'password') ? eyeClosePath : eyeOpenPath;
        }
    });
});

//Form Validation
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

function showError (input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    formGroup.classList.add('error');
    input.classList.add('invalid');
    if (errorElement){
        errorElement.innerText = message;
    }
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    const errorElement =  formGroup.querySelector('.error-message');
    formGroup.classList.remove('error');
    input.classList.remove('invalid');
    if(errorElement){
        errorElement.innerText = ' ';
    }
}

function getFieldName(input){
    const id = input.id;
    if(id === 'username' || id === 'new-name') return 'Tên đăng nhập';
    if(id === 'new-email') return 'Email';
    if(id.includes('password')) return 'Mật khẩu';
    return input.placeholder;
}

function checkRequired (inputs){
    let isValid = true;
    //Duyệt qua từng input 
    inputs.forEach(input => {
        if(input.value.trim() === ''){
            showError(input, `Vui lòng nhập ${getFieldName(input).toLowerCase()}`);
            isValid = false;
        }else{
            showSuccess(input);
        }
    });
    return isValid;
}

function checkLegth(input, min, max){
    if(input.value.length < min){
        showError(input, `${getFieldName(input)} phải có ít nhất ${min} ký tự`);
        return false;
    }else if(input.value.length > max){
        showError(input, `${getFieldName(input)} tối đa ${max} ký tự`);
        return false;
    }else{
        showSuccess(input);
        return true;
    }
}

function checkEmail (input){
    const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(emailReg.test(input.value.trim())){
        showSuccess(input);
        return true;
    }else{
        showError(input, `Email không hợp lệ!`);
        return false;
    }
}

function checkPwdMatch (input1, input2){
    if(input1.value !== input2.value){
        showError(input2, `Mật khẩu không đúng!`);
        return false;
    }else{
        showSuccess(input);
        return true;
    }
}

//Login-form event listen

loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('username');
    const passWord = document.getElementById('login-password');
    const isRequiredValid = checkRequired([username, passWord]);
    if(isRequiredValid){
        //API call
        alert('Login successfully!');
    }
});

//Register-form event listen

registerForm.addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('new-name');
    const email = document.getElementById('new-email');
    const password = document.getElementById('register-password');
    const confirmpwd = document.getElementById('confirm-password');
    let valid = checkRequired([username,email,password,confirmpwd]);
    //Quy tắc toán tử &&
    valid = checkEmail(email) && valid;
    valid = checkLegth(password,8,20) && valid;
    valid = checkPwdMatch (password, confirmpwd) && valid;
    if (valid){
        //API call
        alert('Register successfully!');
    }
});