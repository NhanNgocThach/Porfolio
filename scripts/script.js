// Function to load content dynamically without refreshing the page
function loadContent(url, targetElementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(targetElementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

// Example usage: Attach this to a button click
document.getElementById('loadButton').addEventListener('click', function() {
    loadContent('content.html', 'contentContainer');
});