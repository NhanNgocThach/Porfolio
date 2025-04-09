// ===== Load tab content dynamically =====
function loadTab(tabName) {
    fetch(`content/${tabName}.html`)
      .then(res => res.text())
      .then(html => {
        const content = document.getElementById('main-content');
        content.innerHTML = html;
        updateLanguage(); // re-apply language keys
      });
  }
  
  // ===== Toggle sidebar for mobile =====
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
  }
  
  // ===== Toggle dark/light mode with icon change =====
  function toggleMode() {
    const body = document.body;
    const icon = document.getElementById("modeIcon");
  
    body.classList.toggle("dark-mode");
  
    if (icon) {
      if (body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    }
  }
  
  // ===== Language control =====
  let currentLanguage = 'en';
  
  function changeLanguage(lang) {
    currentLanguage = lang;
    updateLanguage();
  }
  
  function updateLanguage() {
    fetch(`lang/${currentLanguage}.json`)
      .then(res => res.json())
      .then(data => {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(el => {
          const key = el.getAttribute('data-lang');
          if (data[key]) {
            el.innerText = data[key];
          }
        });
      });
  }
  
  // ===== Initialize =====
  document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('en'); // Default language
  });
  