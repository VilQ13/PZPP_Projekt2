const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        let myEvent = button.dataset['command'];
        if (myEvent === "insertImage" || myEvent === "createLink") {
            let url = prompt("Enter your Link Here: ");
            document.execCommand(myEvent, false, url);
        }
        else if (myEvent === "formatBlock") {
            let formattingValue = button.dataset['block'];
            document.execCommand(myEvent, false, formattingValue);
        }
        else {
            document.execCommand(myEvent, false, null);
        }
    })
});

document.getElementById('loadFileBtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const contentOutput = document.querySelector('.contentOutput');

    if (extension === 'txt') {
        const reader = new FileReader();
        reader.onload = function (e) {
            contentOutput.innerText = e.target.result;
            adjustHeight();
        };
        reader.readAsText(file);
    } else if (extension === 'docx') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const arrayBuffer = e.target.result;
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(function (result) {
                    contentOutput.innerHTML = result.value;
                    adjustHeight();
                })
                .catch(function (err) {
                    console.error("DOCX import error:", err);
                    alert("Ошибка при чтении Word-файла");
                });
        };
        reader.readAsArrayBuffer(file);
    }
});


document.getElementById('exportTxtBtn').addEventListener('click', function () {
    const content = document.querySelector('.contentOutput').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.txt';
    link.click();
});

document.getElementById('exportPdfBtn').addEventListener('click', function () {
    const element = document.querySelector('.contentOutput');
    const options = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
});

document.getElementById('exportDocBtn').addEventListener('click', function () {
    const content = document.querySelector('.contentOutput').innerHTML;

   
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Document</title>
        </head>
        <body>${content}</body>
        </html>
    `;

    const converted = htmlDocx.asBlob(html); 
    saveAs(converted, 'document.docx');       
});



const contentOutput = document.querySelector('.contentOutput');

function adjustHeight() {
    contentOutput.style.height = 'auto';
    contentOutput.style.height = contentOutput.scrollHeight + 'px';
}


contentOutput.addEventListener('input', adjustHeight);


window.addEventListener('DOMContentLoaded', adjustHeight);

const fontSelect = document.getElementById('fontSelect');

fontSelect.addEventListener('change', () => {
    const selectedFont = fontSelect.value;
    document.execCommand('fontName', false, selectedFont);
});


const fontSizeSelect = document.getElementById('fontSizeSelect');

fontSizeSelect.addEventListener('change', () => {
    const selectedSize = fontSizeSelect.value + 'pt';
    const selection = window.getSelection();

    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = selectedSize;
    span.appendChild(range.extractContents());
    range.insertNode(span);
});

