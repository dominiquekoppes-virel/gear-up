function initSearch() {
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  
  if (!searchInput) return;
  
  // Create results container if it doesn't exist
  if (!searchResults) {
    searchResults = document.createElement('ul');
    searchResults.id = 'search-results';
    searchResults.className = 'search-results';
    searchInput.parentNode.appendChild(searchResults);
  }
  
  var searchData = {};
  var searchIndex = {};
  
  // Load search data
  fetch('/gear-up/assets/js/search-data.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
      // Build simple search index
      Object.keys(data).forEach(key => {
        var item = data[key];
        searchIndex[key] = (item.title + ' ' + item.content).toLowerCase();
      });
    })
    .catch(error => console.log('Search data not loaded:', error));
  
  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }
    
    query = query.toLowerCase();
    var results = [];
    
    Object.keys(searchIndex).forEach(key => {
      if (searchIndex[key].includes(query)) {
        results.push(searchData[key]);
      }
    });
    
    displayResults(results.slice(0, 5)); // Show max 5 results
  }
  
  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<li class="no-results">No results found</li>';
    } else {
      searchResults.innerHTML = results.map(result => 
        `<li><a href="${result.url}">${result.title}</a></li>`
      ).join('');
    }
    searchResults.style.display = 'block';
  }
  
  // Event listeners
  searchInput.addEventListener('input', function(e) {
    performSearch(e.target.value);
  });
  
  searchInput.addEventListener('focus', function(e) {
    if (e.target.value) performSearch(e.target.value);
  });
  
  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearch);
} else {
  initSearch();
}
