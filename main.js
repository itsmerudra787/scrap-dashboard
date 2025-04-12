async function fetchData() {
  const res = await fetch('/api/scrap');
  const data = await res.json();
  const tbody = document.getElementById('scrap-table-body');
  tbody.innerHTML = '';
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.className = 'border-t';
    row.innerHTML = \`
      <td class="py-2 px-4">\${item.type}</td>
      <td class="py-2 px-4"><input type="number" value="\${item.quantity}" onchange="updateValue(\${index}, 'quantity', this.value)" class="w-20 border px-1"/></td>
      <td class="py-2 px-4"><input type="number" value="\${item.price}" onchange="updateValue(\${index}, 'price', this.value)" class="w-20 border px-1"/></td>
      <td class="py-2 px-4">\${item.quantity * item.price}</td>
      <td class="py-2 px-4"><button onclick="removeRow(\${index})" class="text-red-500">Delete</button></td>
    \`;
    tbody.appendChild(row);
  });
}

async function updateValue(index, field, value) {
  const res = await fetch('/api/scrap');
  const data = await res.json();
  data[index][field] = parseFloat(value);
  await fetch('/api/scrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  fetchData();
}

async function removeRow(index) {
  const res = await fetch('/api/scrap');
  const data = await res.json();
  data.splice(index, 1);
  await fetch('/api/scrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  fetchData();
}

function downloadCSV() {
  fetch('/api/scrap')
    .then(res => res.json())
    .then(data => {
      const csv = ['Type,Quantity,Price,Total'];
      data.forEach(d => {
        csv.push(\`\${d.type},\${d.quantity},\${d.price},\${d.quantity * d.price}\`);
      });
      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scrap_report.csv';
      a.click();
    });
}

function downloadPDF() {
  alert('For PDF export, use browser print to PDF or integrate jsPDF later.');
}

fetchData();
