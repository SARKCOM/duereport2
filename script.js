let excelData = [];
const correctPassword = 'jpf123'; // Set your password here

function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === correctPassword) {
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        loadExcelData(); // Load Excel data after the password is confirmed
    } else {
        alert('You are not authorized. Please check the password.');
    }
}

function loadExcelData() {
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
            excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: true });

            console.log('Excel Data:', excelData); // Debugging
            convertFirstColumnDates();
        })
        .catch(error => {
            console.error('Error fetching or processing the Excel file:', error); // Debugging
        });
}

function convertFirstColumnDates() {
    if (excelData.length > 0) {
        const convertedData = excelData.map(row => {
            const newRow = [];
            if (typeof row[0] === 'number' && isExcelDate(row[0])) {
                newRow.push(convertExcelDate(row[0]));
            } else {
                newRow.push(row[0]);
            }
            return newRow;
        });

        displayResults(convertedData);
    }
}

function isExcelDate(value) {
    // Excel date serial numbers are typically large integers
    return value > 25569; // January 1, 1970, in Excel date serial number
}

function convertExcelDate(excelSerial) {
    // Excel date serial numbers are days since January 1, 1900
    // JavaScript dates are milliseconds since January 1, 1970
    const excelEpoch = new Date(1899, 11, 30); // Excel incorrectly treats 1900 as a leap year
    const msPerDay = 24 * 60 * 60 * 1000;
    const jsDate = new Date(excelEpoch.getTime() + excelSerial * msPerDay);
    return jsDate.toLocaleDateString(); // Format date as needed
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'No results found';
        return;
    }

    results.forEach(result => {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        const row = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');

        th.textContent = "Date"; // Fixed header for the first column
        td.textContent = result[0];

        row.appendChild(th);
        row.appendChild(td);
        tbody.appendChild(row);

        table.appendChild(tbody);
        resultsDiv.appendChild(table);
    });
}
