//Hàm lọc dữ liệu theo tháng



function updateSummaryCards (transactions){
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'thu'){
            totalIncome += t.amount;
        }else{
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