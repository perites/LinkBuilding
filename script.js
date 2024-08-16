// Function to adjust the column width based on the largest input value
function adjustColumnWidths() {
  const rows = document.querySelectorAll('tbody tr');
  const columns = 7; // We have 7 columns

  for (let col = 1; col <= columns; col++) {
    let maxWidth = 0;

    // Loop through each row in the column to find the maximum content width
    rows.forEach((row) => {
      const inputField = row.querySelector(`td:nth-child(${col}) input`);
      if (inputField) {
        const valueWidth = inputField.value.length * 8; // Estimate width based on character count
        maxWidth = Math.max(maxWidth, valueWidth);
      }
    });

    // Apply the width to each cell in this column
    rows.forEach((row) => {
      const inputField = row.querySelector(`td:nth-child(${col}) input`);
      if (inputField) {
        inputField.style.width = Math.max(maxWidth, 100) + 'px';
      }
    });
  }
}



function handlePaste(event) {
  event.preventDefault();
  let paste = (event.clipboardData || window.clipboardData).getData('text');
  let values = paste.split(/\r?\n/);

  const inputField = event.target;
  const colIndex = Array.from(inputField.parentElement.parentElement.children).indexOf(inputField.parentElement) + 1; // Get the column index
  const rowIndex = Array.from(inputField.parentElement.parentElement.parentElement.children).indexOf(inputField.parentElement.parentElement) + 1; // Get the row index

  values.forEach((value, index) => {
    let row = document.getElementById(`row${rowIndex + index}-col${colIndex-2}`);
    if (row) {
      row.value = value.trim();
    }
  });

  // Adjust the column widths after populating
  adjustColumnWidths();
}

// Function to update the link column for each row based on the "domen" column
function updateLinks() {


    let marketer_id = document.getElementById(`marketer_id`).value;
    if (!marketer_id){
      const messageElement = document.getElementById('copyMessage');
        messageElement.textContent = `Marketer ID не вказано`
                messageElement.style.display = 'block';
                old_color = messageElement.style.background
                messageElement.style.background = "red"

                // Hide the message after 3 seconds
                setTimeout(() => {
                    messageElement.style.display = 'none'
                    messageElement.style.background = old_color
                }, 3000);
      return
    }

    const ESP_MAIL_TAGS = {
    "Infusionsoft": "~Contact.Email~",
    "Getresponse": "[[email]]",
    "Sendpulse": "{{email}}",
    "SendX": "{{.Email}}",
    "ExactTarget": "%%emailaddr%%",
    "Engagebay": "{{Subscriber.email}}",
    "Esputnik": "%EMAIL%",
    "Egoi": "!email",
    "GIST": "{{ subscriber.email | default: ' '}}",
    "Remarkety": "{$shopper.email}",
    "Ontraport": "[Email]",
    "Iterable": "{{email}}",
    "ElasticEmail": "{email}",
    "Omnisend": "[[contact.email]]",
    "ActiveCampaign": "%EMAIL%",
    "Intercom": "{{ email }}",
    "Marketo": "{{lead.Email Address}}",
    "SalesManago": "$email$",
    "Dextra": "{{ profile.email }}"
}

SEND_TYPES = ['F', 'B', 'BE', 'OF']


  for (let i = 1; i <= 10; i++) {
    let str_link = ""
    let linkInput = document.getElementById(`row${i}-link`);


    let domen = document.getElementById(`row${i}-col1`).value.trim();
    let domen_short_name = document.getElementById(`row${i}-col2`).value.trim();
    let trecker = document.getElementById(`row${i}-col3`).value.trim();
    let rtgnf = document.getElementById(`row${i}-col4`).value.trim();

    let esp_name = document.getElementById(`row${i}-col5`).value.trim();
    let mail_tag = ESP_MAIL_TAGS[esp_name] || "WRONG_ESP_NAME";

    let send_type = document.getElementById(`row${i}-col6`).value.trim();
   if (!SEND_TYPES.includes(send_type)) {
        send_type = "WRONG_SEND_TYPE";
    }



    let product_info = document.getElementById(`row${i}-col7`).value.trim();


    str_link = `https://${trecker}/${rtgnf}?email=${mail_tag}&domain=${marketer_id || "MARKETER_ID_NOT_SPECIFIED"}${domen_short_name}&type=${send_type}&product=${product_info}`;


     linkInput.value = str_link;

     console.log(str_link)
     console.log(`link for row ${i} created`)

  }
  const messageElement = document.getElementById('copyMessage');
        messageElement.textContent = `Links created`
                messageElement.style.display = 'block';

                // Hide the message after 3 seconds
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
}

// Function to copy the link from a specific row's "Link" column
function copyLink(rowNumber) {

  let linkInput = document.getElementById(`row${rowNumber}-link`);
  if (linkInput && linkInput.value) {
    navigator.clipboard.writeText(linkInput.value)
      .then(() => {
        const messageElement = document.getElementById('copyMessage');
        messageElement.textContent = `Link from row ${rowNumber} copied to clipboard`
                messageElement.style.display = 'block';

                // Hide the message after 3 seconds
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
        console.log("Link copied");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
}

function copyALLLinks (){

let allLinks = ""
for (let i = 1; i <= 10; i++) {
    


    let link_str = document.getElementById(`row${i}-link`).value.trim();
    allLinks = allLinks+ "\n" + link_str



  

  }

navigator.clipboard.writeText(allLinks)
      .then(() => {
        const messageElement = document.getElementById('copyMessage');
        messageElement.textContent = `All links copied to clipboard`
                messageElement.style.display = 'block';

                // Hide the message after 3 seconds
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
        console.log("All Links copied");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });

}

// Function to create and populate the table
function createTable() {
  const tableContainer = document.getElementById('table-container');
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create table header
  const headerRow = document.createElement('tr');
  const headers = [ "#",
  'Copy', 
    'Domen', 'Domen short name', 'Tracking', 'RT GNF', 'ESP name',
    'Type', 'Product info',  'Link'
  ];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Create table rows and cells
  for (let row = 1; row <= 10; row++) {
    const tr = document.createElement('tr');

    const numberTd = document.createElement('td');
    numberTd.textContent  = row
    tr.appendChild(numberTd);


    // Add Action column with Copy Link button
    const actionTd = document.createElement('td');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Link';
    copyButton.addEventListener('click', () => copyLink(row));
    actionTd.appendChild(copyButton);
    tr.appendChild(actionTd);


    for (let col = 1; col <= 7; col++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `row${row}-col${col}`;
      td.appendChild(input);
      tr.appendChild(td);
    }
    

    


    // Add Link column
    const linkTd = document.createElement('td');
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.id = `row${row}-link`;
    linkInput.readOnly = true;
    linkTd.appendChild(linkInput);
    tr.appendChild(linkTd);


    tbody.appendChild(tr);


  }

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);


  // Add paste event listeners to all input fields

document.querySelectorAll('input').forEach(inputField => {

    inputField.addEventListener("paste", handlePaste);
  });
  // Adjust column widths after the table is created
  adjustColumnWidths();
}


// Initialize the table on page load
window.onload = () => {
  createTable();

  // Ensure the button event listener is added after the table is created
  document.getElementById('generate-links').addEventListener('click', () => {
    updateLinks(); // Update the links before generating
  });

  document.getElementById('copy-all').addEventListener('click', () => {
    copyALLLinks(); // Update the links before generating
  });

  // Attach input event listeners to all input fields


};
