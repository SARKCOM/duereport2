let excelData = [];
const correctPassword = '0000'; // Set your password here

function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === correctPassword) {
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        alert('Incorrect password');
    }
}

window.onload = function() {
    fetch('data.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            console.log('Excel Data:', excelData); // Debugging
            populateColumnSelect();
        })
        .catch(error => {
            console.error('Error fetching or processing the Excel file:', error); // Debugging
        });
};

function populateColumnSelect() {
    const columnSelect = document.getElementById('column-select');
    const headers = excelData[0];

    headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header;
        columnSelect.appendChild(option);
    });

    console.log('Headers:', headers); // Debugging
}

function searchData() {
    const columnSelect = document.getElementById('column-select');
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const columnIndex = parseInt(columnSelect.value, 10); // Ensure column index is an integer

    console.log('Selected Column Index:', columnIndex); // Debugging
    console.log('Search Term:', searchTerm); // Debugging

    const results = excelData.slice(1).filter(row => {
        if (row[columnIndex] !== undefined) {
            return row[columnIndex].toString().toLowerCase().includes(searchTerm);
        }
        return false;
    });

    console.log('Search Results:', results); // Debugging
    displayResults(results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'No results found';
        return;
    }

    const table = document.createElement('table');
    table.setAttribute('border', '1');

    // Create table header
    const headers = excelData[0];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    results.forEach(result => {
        const row = document.createElement('tr');
        result.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultsDiv.appendChild(table);
}
