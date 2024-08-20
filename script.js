const defaultMessageColor = "#76BF57"

const COLUMNS = 12;
const ROWS_AMOUNT = 10;

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
const SEND_TYPES = ['F', 'B', 'BE', 'OF']

const getValueFromColumn = (rowNumber, columnNumber) => {
    return document.getElementById(`row${rowNumber}-col${columnNumber}`).value.trim();
}

const adjustColumnWidths = () => {
    const rows = document.querySelectorAll('tbody tr');

    for (let col = 1; col <= COLUMNS; col++) {
        let maxWidth = 100;
        rows.forEach((row) => {
            const inputField = row.querySelector(`td:nth-child(${col}) input`);
            if (inputField) {
                const valueWidth = inputField.value.length * 10;
                maxWidth = Math.max(maxWidth, valueWidth);
            }
        });

        rows.forEach((row) => {
            const inputField = row.querySelector(`td:nth-child(${col}) input`);
            if (inputField) {
                inputField.style.width = (maxWidth + 20) + 'px';
            }
        });
    }
}

const displayMessage = (message, color=null) => {
    const messageElement = document.getElementById('infoMessage');
    messageElement.textContent = message
    if (color) {
        messageElement.style.background = color
    }
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
        messageElement.style.background = defaultMessageColor
    }, 3000);
}


const getLinkFromRow = (rowNumber) => {
    return document.getElementById(`row${rowNumber}-link`).value;
}


const copyLink = (rowNumber) => {
    const link = getLinkFromRow(rowNumber)
    if (!link) return
    navigator.clipboard.writeText(link)
    displayMessage(`Link from row ${rowNumber} copied`)
}
const getUnsubLinkFromRow = (rowNumber) => {
    return document.getElementById(`row${rowNumber}-unsub-link`).value;
}


const copyUnsubLink = (rowNumber) => {
    const link = getUnsubLinkFromRow(rowNumber)
    if (!link) return
    navigator.clipboard.writeText(link)
    displayMessage(`Unsub Link from row ${rowNumber} copied`, "#f57e47")
}

const copyALLLinks = () => {
    let allLinks = ""
    for (let i = 1; i <= ROWS_AMOUNT; i++) {
        const link = getLinkFromRow(i)
        const unsubLink = getUnsubLinkFromRow(i)

        allLinks +=`Row: ${i} Product: ${getValueFromColumn(i,8)}` + "\n" +"link : " + link + "\n" + "unsub: " + unsubLink + "\n\n" 
    }
    if (allLinks != ("\n"*10)){
        navigator.clipboard.writeText(allLinks)
        displayMessage(`All links copied to clipboard`)
    }
}


const handlePaste = (event) => {
    event.preventDefault();
    let paste = (event.clipboardData || window.clipboardData).getData('text');
    let values = paste.split(/\r?\n/);

    const inputField = event.target;
    const colIndex = Array.from(inputField.parentElement.parentElement.children).indexOf(inputField.parentElement) + 1;
    const rowIndex = Array.from(inputField.parentElement.parentElement.parentElement.children).indexOf(inputField.parentElement.parentElement) + 1;

    values.forEach((value, index) => {
        const id = `row${rowIndex + index}-col${colIndex-2}`
        const row = document.getElementById(id);
        if (row) {
            row.value = value.trim();
            localStorage.setItem(id, value.trim());
        }
    });

    adjustColumnWidths();
}





const updateLinks = () => {
    const marketerID = document.getElementById(`marketer_id`).value;
    if (!marketerID){
      displayMessage(`Marketer ID не вказано`, "red")
      return
    }

    for (let i = 1; i <= ROWS_AMOUNT; i++) {
        const linkInput = document.getElementById(`row${i}-link`);
        const unsubLinkInput = document.getElementById(`row${i}-unsub-link`);

        const domen = getValueFromColumn(i, 1) || "NO_DOMEN"
        const domenShortName = getValueFromColumn(i, 2) || "NO_SHORT_NAME"
        const tracking = getValueFromColumn(i, 3) || "NO_TRACKING"
        const rtgnf = getValueFromColumn(i, 4) || "NO_RTGNF"
        const unsubRtgnf = getValueFromColumn(i, 5) || "NO_UNSUB_RTGNF"

        const ESPName = getValueFromColumn(i, 6)
        const mailTag = ESP_MAIL_TAGS[ESPName] || "WRONG_ESP_NAME";
        const sendType = getValueFromColumn(i, 7) || "NO_TYPE"
        if (!SEND_TYPES.includes(sendType)) {
            send_type = "WRONG_SEND_TYPE";
        }
        const productInfo = getValueFromColumn(i, 8) || "NO_PRODUCT_INFO"



        link = `https://${tracking}/${rtgnf}?email=${mailTag}&domain=${marketerID}${domenShortName}&type=${sendType}&product=${productInfo}`;
        linkInput.value = link;

        console.log(link)
        console.log(`link for row ${i} created`)

        unsubLink = `https://${tracking}/${unsubRtgnf}?email=unsub`;
        unsubLinkInput.value = unsubLink;

        console.log(unsubLink)
        console.log(`unsub link for row ${i} created`)
    }

    adjustColumnWidths()
    displayMessage(`Links created`)
}


const createTable = () => {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const headers = [ "#",'Copy',
                      'Domen', 'Domen short name', 'Tracking', 'RT GNF',"UNSUB RT GNF", 'ESP name','Type', 'Product info',
                      'Link', "Unsub Link"];
    headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    for (let row = 1; row <= ROWS_AMOUNT; row++) {
        const tr = document.createElement('tr');

        const numberTd = document.createElement('td');
        numberTd.textContent = row
        tr.appendChild(numberTd);

        const actionTd = document.createElement('td');
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Link';
        copyButton.addEventListener('click', () => copyLink(row));
        
        const copyButton2 = document.createElement('button'); 
        copyButton2.textContent = 'Copy Unsub Link';        
        copyButton2.addEventListener('click', () => copyUnsubLink(row));
        copyButton2.classList.add('copy-unsub');

        actionTd.appendChild(copyButton);
        actionTd.appendChild(copyButton2);
        actionTd.style = "min-width: 150px;"
        tr.appendChild(actionTd);

        for (let col = 1; col <= 8; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            const id = `row${row}-col${col}`;
            input.id = id
            input.addEventListener("paste", handlePaste);

            input.value = localStorage.getItem(id) || "";
            input.addEventListener("input", function() {
                localStorage.setItem(id, input.value);
            });

            if (col == 5){
                input.placeholder="UNSUB"
            }

            td.appendChild(input);
            tr.appendChild(td);
        }

        const linkTd = document.createElement('td');
        const linkInput = document.createElement('input');
        linkInput.type = 'text';
        linkInput.id = `row${row}-link`;
        linkInput.readOnly = true;
        linkTd.appendChild(linkInput);
        tr.appendChild(linkTd);

        const unsubLinkTd = document.createElement('td');
        const unsubLinkInput = document.createElement('input');
        unsubLinkInput.type = 'text';
        unsubLinkInput.id = `row${row}-unsub-link`;
        unsubLinkInput.readOnly = true;
        unsubLinkTd.appendChild(unsubLinkInput);
        tr.appendChild(unsubLinkTd);


        tbody.appendChild(tr);
    }


    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    adjustColumnWidths()
}

const setUpMarketerInput = () =>{
    marketerInput = document.getElementById('marketer_id')
    marketerInput.value = localStorage.getItem("marketer_id") || "";
    marketerInput.addEventListener('input', () => {
        localStorage.setItem('marketer_id', marketerInput.value);
    });
}

const resetAll = () => {
    const userConfirmed = confirm('Ви точно хочете очистити всі поля в таблиці?');
    if (userConfirmed) {
        const inputs = document.querySelectorAll('#table-container input');
    inputs.forEach(input => {
          input.value = "";
          localStorage.setItem(input.id, "");
      });
    displayMessage("All fields have been cleared", "#fcce26")
      }

     adjustColumnWidths();
}

window.onload = () => {
    createTable();
    setUpMarketerInput()

    document.getElementById('generate-links').addEventListener('click', () => {
        updateLinks();
    });
    document.getElementById('reset-all').addEventListener('click', () => {
        resetAll();
    });
    document.getElementById('copy-all').addEventListener('click', () => {
        copyALLLinks();
    });
};
