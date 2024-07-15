// Sample data to simulate Excel data
let excelData = [
    { "Account Name": "John Doe", "Account Number": "123456789", "Account Type": "Savings" },
    { "Account Name": "Jane Smith", "Account Number": "987654321", "Account Type": "Checking" },
    // Add more sample data as needed
];

let headers = Object.keys(excelData[0]);
let password = "yourpassword"; // Change this to your desired password

// Function to check password
function checkPassword() {
    let inputPassword = document.getElementById('password-input').value;
    if (inputPassword === password) {
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        populateColumnSelect();
    } else {
        alert("Incorrect password!");
    }
}

// Function to populate the dropdown with column names
function populateColumnSelect() {
    let columnSelect = document.getElementById('column-select');
    headers.forEach(header => {
        let option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        columnSelect.appendChild(option);
    });
}

// Function to search data based on selected column and input value
function searchData() {
    let columnSelect = document.getElementById('column-select');
    let searchInput = document.getElementById('search-input').value.toLowerCase();
    let selectedColumn = columnSelect.value;

    let results = excelData.filter(row => row[selectedColumn].toLowerCase().includes(searchInput));

    displayResults(results);
}

// Function to display search results in a table
function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length > 0) {
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let headerRow = document.createElement('tr');
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        results.forEach(row => {
            let tr = document.createElement('tr');
            headers.forEach(header => {
                let td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        resultsContainer.appendChild(table);
    } else {
        resultsContainer.textContent = 'No results found';
    }
}

// Call populateColumnSelect on load if password is already correct
if (document.getElementById('main-container').style.display !== 'none') {
    populateColumnSelect();
}
