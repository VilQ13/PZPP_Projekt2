$(document).ready(function () {
    let cellContainer = $(".input-cell-container");

   
    for (let i = 1; i <= 100; i++) {
        let answer = "";
        let n = i;
        while (n > 0) {
            let rem = n % 26;
            if (rem == 0) {
                answer = "Z" + answer;
                n = Math.floor(n / 26) - 1;
            } else {
                answer = String.fromCharCode(rem - 1 + 65) + answer;
                n = Math.floor(n / 26);
            }
        }

        let column = $(`<div class="column-name colId-${i}" id="colCod-${answer}">${answer}</div>`);
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }


    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        for (let j = 1; j <= 100; j++) {
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data-code="${colCode}"></div>`);
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }

    let selectedCell = null;
    let copiedData = null;
    let colorTarget = null; 

   
    $(".icon-color-fill").click(function (e) {
        if (!selectedCell) return;
        colorTarget = 'fill';
        showColorMenu(e.pageX, e.pageY);
    });

   
    $(".icon-color-text").click(function (e) {
        if (!selectedCell) return;
        colorTarget = 'text';
        showColorMenu(e.pageX, e.pageY);
    });


    function showColorMenu(x, y) {
        $("#colorMenu").css({ top: y + "px", left: x + "px", display: "block" });
    }


    $(document).on("click", function (e) {
        if (!$(e.target).closest('#colorMenu, .icon-color-fill, .icon-color-text').length) {
            $("#colorMenu").hide();
        }
    });


    const colors = [
        '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf',
        '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff',
        '#fffffc', '#d0f4de', '#f0efeb', '#a9def9'
    ];

    const colorMenu = document.getElementById("colorMenu");
    colorMenu.innerHTML = '';
    colors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-option';
        div.style.backgroundColor = color;
        div.onclick = () => {
            if (selectedCells.length > 0) {
                selectedCells.forEach(cell => {
                    if (colorTarget === 'fill') {
                        cell.css("background-color", color);
                    } else if (colorTarget === 'text') {
                        cell.css("color", color);
                    }
                });
            }
            $("#colorMenu").hide();
        };

        colorMenu.appendChild(div);
    });




    
    $(".input-cell-container").on("click", ".input-cell", function () {
        $(".input-cell").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true").focus();

    
        selectedCell = $(this);
        selectedCells = [$(this)];


        $(".formula-input").text(selectedCell.text());
    }); 


    $(".formula-input").on("input", function () {
        if (selectedCell) {
            selectedCell.text($(this).text());
        }
    });

    $(".icon-bold").click(function () {
        if (selectedCell) selectedCell.toggleClass("bold");
    });

 
    $(".icon-italic").click(function () {
        if (selectedCell) selectedCell.toggleClass("italic");
    });


    $(".icon-align-left").click(function () {
        if (selectedCell) selectedCell.css("text-align", "left");
    });
    $(".icon-align-center").click(function () {
        if (selectedCell) selectedCell.css("text-align", "center");
    });
    $(".icon-align-right").click(function () {
        if (selectedCell) selectedCell.css("text-align", "right");
    });


    $(".icon-copy").click(function () {
        if (selectedCells.length === 0) return;

        copiedData = selectedCells.map(cell => {
            return {
                html: cell.html(),
                classes: cell.attr("class"),
                coords: getCellCoords(cell)
            };
        });
    });


    $(".icon-cut").click(function () {
        if (selectedCells.length === 0) return;

        copiedData = selectedCells.map(cell => {
            return {
                html: cell.html(),
                classes: cell.attr("class"),
                coords: getCellCoords(cell)
            };
        });

        selectedCells.forEach(cell => {
            cell.empty().attr("class", "input-cell").css({
                "background-color": "",
                "color": "",
                "font-family": "",
                "font-size": "",
                "text-align": ""
            });
        });
    });



    $(document).on("keydown", function (e) {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedCells.length > 0) {
            selectedCells.forEach(cell => {
                cell.empty().attr("class", "input-cell").css({
                    "background-color": "",
                    "color": "",
                    "font-family": "",
                    "font-size": "",
                    "text-align": ""
                });
            });
            updateFormulaEditor();
            e.preventDefault();
        }
    });



    $(".icon-paste").click(function () {
        if (!copiedData || selectedCells.length === 0) return;

     
        copiedData.sort((a, b) => (a.coords.row - b.coords.row) || (a.coords.col - b.coords.col));

       
        const startCoords = getCellCoords(selectedCells[0]);

     
        const minRow = Math.min(...copiedData.map(d => d.coords.row));
        const minCol = Math.min(...copiedData.map(d => d.coords.col));

        copiedData.forEach(item => {

            const targetRow = startCoords.row + (item.coords.row - minRow);
            const targetCol = startCoords.col + (item.coords.col - minCol);

            const targetCell = getCellByCoords(targetRow, targetCol);
            if (targetCell.length) {
                targetCell.html(item.html);
                targetCell.attr("class", item.classes);
            }
        });
    });



    $(".font-select").on("change", function () {
        if (selectedCell) {
            let font = $(this).val();
            selectedCell.css("font-family", font);
        }
    });


    $(".size-select").on("change", function () {
        if (selectedCell) {
            let fontSize = $(this).val();
            selectedCell.css("font-size", fontSize + "px");
        }
    });


t
    $(".import").click(function () {
        $("#importFile").click();
    });


    $("#importFile").on("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            $(".input-cell-container").empty();
            for (let i = 0; i < 100; i++) {
                const row = $(`<div class="cell-row"></div>`);
                for (let j = 0; j < 100; j++) {
                    const cellValue = (sheet[i] && sheet[i][j]) ? sheet[i][j] : "";
                    const colCode = $(`.colId-${j + 1}`).attr("id")?.split("-")[1] || "";
                    const cell = $(`<div class="input-cell" contenteditable="false" id="row-${i + 1}-col-${j + 1}" data-code="${colCode}">${cellValue}</div>`);
                    row.append(cell);
                }
                $(".input-cell-container").append(row);
            }
        };
        reader.readAsArrayBuffer(file);
    });


    $(".export").click(function () {
        let data = [];
        $(".input-cell-container .cell-row").each(function () {
            let row = [];
            $(this).find(".input-cell").each(function () {
                row.push($(this).text());
            });
            data.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, "mexel_export.xlsx");
    });

    let isMouseDown = false;
    let startCell = null;
    let selectedCells = [];

    function getCellCoords(cell) {
    const id = cell.attr("id");
    const [, row, , col] = id.split("-");
    return { row: parseInt(row), col: parseInt(col) };
}

function getCellByCoords(row, col) {
    return $(`#row-${row}-col-${col}`);
}

function getRangeString(start, end) {
    let startCode = getCellByCoords(start.row, start.col).attr("data-code") + start.row;
    let endCode = getCellByCoords(end.row, end.col).attr("data-code") + end.row;
    return startCode === endCode ? startCode : `${startCode}:${endCode}`;
}

    function updateFormulaEditor() {
        if (selectedCells.length === 1) {
            const cell = selectedCells[0];
            const coord = getCellCoords(cell);  
            const code = cell.attr("data-code") + coord.row;
            $(".selected-cell").text(code);
        } else if (selectedCells.length > 1) {
            
            let minCol = Infinity, maxCol = -Infinity;
            let minRow = Infinity, maxRow = -Infinity;

            selectedCells.forEach(cell => {
                const c = getCellCoords(cell);
             
                const colCode = cell.attr("data-code").charCodeAt(0);

                if (colCode < minCol) minCol = colCode;
                if (colCode > maxCol) maxCol = colCode;
                if (c.row < minRow) minRow = c.row;
                if (c.row > maxRow) maxRow = c.row;
            });

      
            const startCol = String.fromCharCode(minCol);
            const endCol = String.fromCharCode(maxCol);

            const rangeStr = `${startCol}${minRow}:${endCol}${maxRow}`;

            $(".selected-cell").text(rangeStr);
        } else {
            $(".selected-cell").text("");
        }
    }





$(".input-cell-container").on("mousedown", ".input-cell", function (e) {
    isMouseDown = true;
    if (!e.ctrlKey) {
        $(".input-cell").removeClass("selected");
        selectedCells = [];
    }

    $(this).addClass("selected");
    selectedCells.push($(this));
    startCell = $(this);
    return false;
});

$(".input-cell-container").on("mouseenter", ".input-cell", function (e) {
    if (isMouseDown && !e.ctrlKey && startCell) {
        $(".input-cell").removeClass("selected");
        selectedCells = [];

        let start = getCellCoords(startCell);
        let end = getCellCoords($(this));

        let r1 = Math.min(start.row, end.row);
        let r2 = Math.max(start.row, end.row);
        let c1 = Math.min(start.col, end.col);
        let c2 = Math.max(start.col, end.col);

        for (let r = r1; r <= r2; r++) {
            for (let c = c1; c <= c2; c++) {
                let cell = getCellByCoords(r, c);
                cell.addClass("selected");
                selectedCells.push(cell);
            }
        }
    }
});

$(document).on("mouseup", function () {
    isMouseDown = false;
    updateFormulaEditor();
});

    $(document).on("keydown", function (e) {
      
        const isCtrl = e.ctrlKey || e.metaKey;

        if (isCtrl) {
            switch (e.key.toLowerCase()) {
                case 'c': 
                    if (selectedCells.length > 0) {
                        copiedData = selectedCells.map(cell => ({
                            html: cell.html(),
                            classes: cell.attr("class"),
                            coords: getCellCoords(cell)
                        }));
                        e.preventDefault();
                    }
                    break;

                case 'x':  
                    if (selectedCells.length > 0) {
                        copiedData = selectedCells.map(cell => ({
                            html: cell.html(),
                            classes: cell.attr("class"),
                            coords: getCellCoords(cell)
                        }));
                        selectedCells.forEach(cell => {
                            cell.empty().attr("class", "input-cell").css({
                                "background-color": "",
                                "color": "",
                                "font-family": "",
                                "font-size": "",
                                "text-align": ""
                            });
                        });
                        e.preventDefault();
                    }
                    break;

                case 'v':  
                    if (copiedData && selectedCells.length > 0) {
                       
                        const startCoords = getCellCoords(selectedCells[0]);

                        const minRow = Math.min(...copiedData.map(d => d.coords.row));
                        const minCol = Math.min(...copiedData.map(d => d.coords.col));

                        copiedData.forEach(item => {
                            const targetRow = startCoords.row + (item.coords.row - minRow);
                            const targetCol = startCoords.col + (item.coords.col - minCol);
                            const targetCell = getCellByCoords(targetRow, targetCol);
                            if (targetCell.length) {
                                targetCell.html(item.html);
                                targetCell.attr("class", item.classes);
                            }
                        });
                        e.preventDefault();
                        updateFormulaEditor();
                    }
                    break;

                case 'a':  
                    e.preventDefault();
                    selectedCells = [];
                    $(".input-cell").addClass("selected").each(function () {
                        selectedCells.push($(this));
                    });
                    updateFormulaEditor();
                    break;
            }
        }
    });





});

