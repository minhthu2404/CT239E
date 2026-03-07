fetch("../navbar/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar").innerHTML = data;

    const currentPath = window.location.pathname;

    const links = document.querySelectorAll(".sidebar .link a");

    links.forEach(link => link.classList.remove("active"));

    links.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    });

    // Cập nhật thông tin người dùng 
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser && localUser.username) {
      fetch(`http://localhost:3000/api/user/${localUser.username}`)
        .then(res => res.json())
        .then(user => {
          const sidebarUsername = document.querySelector('.sidebar .user .username span');
          if (sidebarUsername) {
            sidebarUsername.textContent = user.username;
          }
        })
        .catch(err => console.error('Sidebar user fetch error:', err));
    }

    // Xử lý đăng xuất
    const logoutBtn = document.querySelector('.sidebar .logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = logoutBtn.href;
      });
    }

    // Loader
    const pageLoader = document.getElementById("page-loader");
    if (pageLoader) {
      setTimeout(() => {
        pageLoader.classList.add("fade-out");
      }, 300);
    }
  });
