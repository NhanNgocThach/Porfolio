/* ==============================
   UPDATED class-page.js
   ============================== */

   function initClassPage() {
    const classList = document.getElementById("classList");
    const classDetails = document.getElementById("classDetails");
    const searchInput = document.getElementById("searchInput");
  
    let groupedTerms = [];
    let currentTermIndex = 0;
    let searchMode = false;
    let searchResults = [];
    let currentSearchPage = 0;
    const CARD_HEIGHT_LIMIT = 500; // height before switching to next page (can adjust)
  
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
        const header = document.createElement("h5");
        header.textContent = `Search Results (${searchResults.length})`;
        classList.appendChild(header);
  
        let container = document.createElement("div");
        container.className = "class-card-container";
        classList.appendChild(container);
  
        let totalHeight = 0;
        let cardsOnPage = [];
        for (let i = 0; i < searchResults.length; i++) {
          const card = createClassCard(searchResults[i]);
          container.appendChild(card);
  
          const height = card.offsetHeight || 90; // estimate if not rendered yet
          totalHeight += height;
  
          if (totalHeight > CARD_HEIGHT_LIMIT) {
            // remove last and break to new page
            container.removeChild(card);
            break;
          } else {
            cardsOnPage.push(card);
          }
        }
  
        if (searchResults.length > cardsOnPage.length) {
          const nav = document.createElement("div");
          nav.className = "pagination-nav";
          nav.innerHTML = `<button onclick="renderSearchMore()">Next →</button>`;
          classList.appendChild(nav);
        }
        return;
      }
  
      const current = groupedTerms[currentTermIndex];
      if (!current) return;
  
      const termHeader = document.createElement("h5");
      termHeader.textContent = `${current.term} (${currentTermIndex + 1}/${groupedTerms.length})`;
      classList.appendChild(termHeader);
  
      current.classes.forEach(cls => {
        const card = createClassCard(cls);
        classList.appendChild(card);
      });
  
      renderPagination();
    }
  
    function renderPagination() {
      if (searchMode) return;
  
      const nav = document.createElement("div");
      nav.className = "pagination-nav";
  
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "← Next Term";
      prevBtn.disabled = currentTermIndex === 0;
      prevBtn.onclick = () => {
        currentTermIndex--;
        renderTerm();
      };
  
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Previous Term →";
      nextBtn.disabled = currentTermIndex === groupedTerms.length - 1;
      nextBtn.onclick = () => {
        currentTermIndex++;
        renderTerm();
      };
  
      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      classList.appendChild(nav);
    }
  
    function renderSearchMore() {
      currentSearchPage++;
      searchMode = true;
      renderTerm();
    }
  
    function createClassCard(cls) {
      const card = document.createElement("div");
      card.className = "class-item-card";
      card.innerHTML = `
        <div onclick="showDetails('${cls.id}')">
          <h5>${cls.name}</h5>
          <p class="class-term">${cls.term}</p>
        </div>
      `;
      return card;
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
                       p.type === "Presentation" ? "🖥️" :
                       p.type === "Video" ? "🎥" : "📁";
          content += `
            <li>
              <span class="project-title">${icon} ${p.title}</span>
              <button onclick="downloadFile('${p.link}')" title="Download this file">💾</button>
            </li>`;
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
        currentSearchPage = 0;
        renderTerm();
      } else {
        searchMode = true;
        currentSearchPage = 0;
        searchResults = classes.filter(c => c.name.toLowerCase().includes(keyword));
        renderTerm();
      }
    }
  
    window.showDetails = showDetails;
    window.filterClasses = filterClasses;
    groupedTerms = groupByTerm(classes);
    renderTerm();
    searchInput.addEventListener("input", filterClasses);
  }
  
  function downloadFile(filePath) {
    const a = document.createElement("a");
    a.href = filePath;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  