function initClassPage() {
    const classList = document.getElementById("classList");
    const classDetails = document.getElementById("classDetails");
    const searchInput = document.getElementById("searchInput");
  
    let groupedTerms = [];
    let currentTermIndex = 0;
    let searchMode = false;
    let searchResults = [];
    let searchPage = 0;
  
    function groupByTerm(data) {
      const grouped = {};
      data.forEach(cls => {
        if (!grouped[cls.term]) grouped[cls.term] = [];
        grouped[cls.term].push(cls);
      });
  
      const sorted = Object.keys(grouped).sort((a, b) => {
        const [termA, yearA] = a.split(" ");
        const [termB, yearB] = b.split(" ");
        const order = { Spring: 1, Summer: 2, Fall: 3, Winter: 4 };
  
        if (yearA !== yearB) return +yearB - +yearA;
        return order[termB] - order[termA];
      });
  
      return sorted.map(term => ({
        term,
        classes: grouped[term]
      }));
    }
  
    function renderTerm() {
      classList.innerHTML = "";
  
      if (searchMode) {
        const resultsPerPage = 4;
        const start = searchPage * resultsPerPage;
        const end = start + resultsPerPage;
        const visibleResults = searchResults.slice(start, end);
  
        const header = document.createElement("h5");
        const totalPages = Math.ceil(searchResults.length / resultsPerPage);
        header.textContent = `Search Results (${searchResults.length}) - Page ${searchPage + 1}/${totalPages}`;
        classList.appendChild(header);
  
        visibleResults.forEach(cls => {
          const card = document.createElement("div");
          card.className = "class-item-card";
          card.innerHTML = `
            <div onclick="showDetails('${cls.id}')">
              <h5>${cls.name}</h5>
              <p class="class-term">${cls.term}</p>
            </div>`;
          classList.appendChild(card);
        });
  
        renderSearchPagination();
        return;
      }
  
      const current = groupedTerms[currentTermIndex];
      if (!current) return;
  
      const termHeader = document.createElement("h5");
      termHeader.textContent = `${current.term} (${currentTermIndex + 1}/${groupedTerms.length})`;
      classList.appendChild(termHeader);
  
      current.classes.forEach(cls => {
        const card = document.createElement("div");
        card.className = "class-item-card";
        card.innerHTML = `
          <div onclick="showDetails('${cls.id}')">
            <h5>${cls.name}</h5>
            <p class="class-term">${cls.term}</p>
          </div>`;
        classList.appendChild(card);
      });
  
      renderPagination();
    }
  
    function renderPagination() {
      const nav = document.createElement("div");
      nav.style.display = "flex";
      nav.style.justifyContent = "space-between";
      nav.style.marginTop = "20px";
  
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "← Previous Term";
      prevBtn.disabled = currentTermIndex === 0;
      prevBtn.onclick = () => {
        currentTermIndex--;
        renderTerm();
      };
  
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Next Term →";
      nextBtn.disabled = currentTermIndex === groupedTerms.length - 1;
      nextBtn.onclick = () => {
        currentTermIndex++;
        renderTerm();
      };
  
      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      classList.appendChild(nav);
    }
  
    function renderSearchPagination() {
      const resultsPerPage = 4;
      const totalPages = Math.ceil(searchResults.length / resultsPerPage);
      if (totalPages <= 1) return;
  
      const nav = document.createElement("div");
      nav.style.display = "flex";
      nav.style.justifyContent = "space-between";
      nav.style.marginTop = "20px";
  
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "← Previous";
      prevBtn.disabled = searchPage === 0;
      prevBtn.onclick = () => {
        searchPage--;
        renderTerm();
      };
  
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Next →";
      nextBtn.disabled = searchPage >= totalPages - 1;
      nextBtn.onclick = () => {
        searchPage++;
        renderTerm();
      };
  
      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      classList.appendChild(nav);
    }
  
    function showDetails(id) {
      const cls = classes.find(c => c.id === id);
      if (!cls) return;
  
      classDetails.classList.remove("show");
      void classDetails.offsetWidth;
  
      let content = `<h4>${cls.name}</h4><ul>`;
      if (cls.projects && cls.projects.length > 0) {
        cls.projects.forEach(p => {
          const icon = p.type === "Essay" ? "📄" :
                       p.type === "Presentation" ? "🎤" :
                       p.type === "Video" ? "🎥" : "📁";
          content += `<li>${icon} ${p.title} – <a href="${p.link}" ${p.download ? "download" : 'target="_blank"'}>Download</a></li>`;
        });
      } else {
        content += `<li>No projects or essays listed.</li>`;
      }
      content += "</ul>";
  
      classDetails.innerHTML = content;
      classDetails.classList.add("fade-slide");
      setTimeout(() => {
        classDetails.classList.add("show");
      }, 10);
    }
  
    function filterClasses() {
      const keyword = searchInput.value.trim().toLowerCase();
      if (keyword === "") {
        searchMode = false;
        currentTermIndex = 0;
        renderTerm();
      } else {
        searchMode = true;
        searchPage = 0;
        searchResults = classes.filter(c => c.name.toLowerCase().includes(keyword));
        renderTerm();
      }
    }
  
    // 🌐 Global access
    window.showDetails = showDetails;
    window.filterClasses = filterClasses;
  
    // 🚀 Initialize
    groupedTerms = groupByTerm(classes);
    renderTerm();
    searchInput.addEventListener("input", filterClasses);
  }
  