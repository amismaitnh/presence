// script.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js: DOM loaded');
  
  const tableBody = document.getElementById('namesTableBody');
  const form = document.getElementById('namesForm');
  const clearButton = document.getElementById('clearNames');
  const maxRows = 18; // Maximum number of names allowed

  const defaultTitles = [
    'PRESENSI KEHADIRAN PESERTA',
    'SYURA PENGURUS HARIAN TETAP 6',
    'MASA BAKTI 2024/2025'
  ];
  
  // Function to populate the table with input fields and titles
  function populateTable() {
    tableBody.innerHTML = ''; // Clear existing rows
    const savedNames = JSON.parse(localStorage.getItem('attendanceNames')) || [];
    for (let i = 0; i < maxRows; i++) {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${i + 1}.</td>
                <td><input type="text" class="name-input" value="${savedNames[i] || ''}" maxlength="50"></td>
            `;
      tableBody.appendChild(row);
    }
    console.log('script.js: Table populated with', maxRows, 'rows');

    // Populate titles
    const savedTitles = JSON.parse(localStorage.getItem('reportTitles')) || defaultTitles;
    document.getElementById('title1').value = savedTitles[0] || '';
    document.getElementById('title2').value = savedTitles[1] || '';
    document.getElementById('title3').value = savedTitles[2] || '';
    console.log('script.js: Titles populated:', savedTitles);
  }
  
  // Function to save names and titles to localStorage
  function saveNames() {
    const inputs = document.querySelectorAll('.name-input');
    const names = Array.from(inputs)
      .map(input => input.value.trim())
      .filter(name => name !== '') // Only save non-empty names
      .slice(0, 18); // Limit to 18 names
    if (names.length === 0) {
      alert('Please enter at least one name.');
      console.warn('script.js: No valid names to save');
      return;
    }

    // Save titles
    const titles = [
      document.getElementById('title1').value.trim(),
      document.getElementById('title2').value.trim(),
      document.getElementById('title3').value.trim()
    ].filter(title => title !== '');

    localStorage.setItem('attendanceNames', JSON.stringify(names));
    localStorage.setItem('reportTitles', JSON.stringify(titles.length > 0 ? titles : []));
    console.log('script.js: Names saved to localStorage:', names);
    console.log('script.js: Titles saved to localStorage:', titles);
    alert('Names and titles saved successfully! They will appear in the attendance report and signature form.');
    window.dispatchEvent(new CustomEvent('namesUpdate')); // Trigger custom event
  }
  
  // Function to clear names and titles from localStorage and table
  function clearNames() {
    if (confirm('Are you sure you want to clear all names and titles? This action cannot be undone.')) {
      localStorage.removeItem('attendanceNames');
      localStorage.removeItem('reportTitles');
      populateTable();
      window.dispatchEvent(new CustomEvent('namesUpdate'));
      console.log('script.js: Names and titles cleared and namesUpdate dispatched');
    }
  }
  
  // Event listener for form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveNames();
    });
  } else {
    console.error('script.js: Names form not found');
  }
  
  // Event listener for clear button
  if (clearButton) {
    clearButton.addEventListener('click', clearNames);
  } else {
    console.error('script.js: Clear names button not found');
  }
  
  // Initial population of the table and titles
  populateTable();
});
