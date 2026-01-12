const tabs = document.querySelectorAll('.tab-item');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.getAttribute('data-target');

    // Nếu trình duyệt hỗ trợ, dùng View Transition để có hiệu ứng mờ dần (fade)
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        switchTab(tab, targetId);
      });
    } else {
      switchTab(tab, targetId);
    }
  });
});

function switchTab(activeTab, targetId) {
  // 1. Cập nhật trạng thái Tab
  document.querySelector('.tab-item.active').classList.remove('active');
  activeTab.classList.add('active');

  // 2. Cập nhật hiển thị Nội dung
  document.querySelector('.tab-panel.active').classList.remove('active');
  document.getElementById(targetId).classList.add('active');
}