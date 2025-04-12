function initClassPage() {
  const classList = document.getElementById("classList");
  const classDetails = document.getElementById("classDetails");
  const searchInput = document.getElementById("searchInput");

  let groupedTerms = [];
  let currentTermIndex = 0;
  let searchMode = false;
  let searchResults = [];
  let showAllResults = false;

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

      const maxResults = 4;
      const resultsToShow = showAllResults ? searchResults : searchResults.slice(0, maxResults);

      resultsToShow.forEach(cls => {
        const card = createClassCard(cls);
        classList.appendChild(card);
      });

      if (searchResults.length > maxResults && !showAllResults) {
        const moreBtn = document.createElement("button");
        moreBtn.textContent = "Show More Results";
        moreBtn.className = "btn btn-sm btn-outline-primary mt-2";
        moreBtn.onclick = () => {
          showAllResults = true;
          renderTerm();
        };
        classList.appendChild(moreBtn);
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
        const icon =
          p.type === "Essay" ? "📄" :
          p.type === "Presentation" ? "🎤" :
          p.type === "Video" ? "🎥" : "📁";

          content += `<li>${icon} ${p.title} – 
          <button onclick="downloadFile('${p.link}')" title="This file is for educational use only.">Download</button>
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
      showAllResults = false;
      renderTerm();
    } else {
      searchMode = true;
      showAllResults = false;
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
