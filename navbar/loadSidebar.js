fetch("../navbar/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar").innerHTML = data;

    const currentPath = window.location.pathname;

    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => link.classList.remove("active"));

    links.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    });
  });
