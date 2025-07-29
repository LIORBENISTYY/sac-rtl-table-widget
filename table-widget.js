(function() {
    'use strict';

    // Builder Component
    class HebrewTableBuilder extends HTMLElement {
        constructor() {
            super();
            const template = document.createElement("template");
            template.innerHTML = `
                <style>
                    #form {
                        font-family: Arial, sans-serif;
                        width: 400px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    
                    .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #0070f3;
                        margin: 20px 0 10px 0;
                        border-bottom: 2px solid #0070f3;
                        padding-bottom: 5px;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                    }
                    
                    td {
                        padding: 8px 5px;
                        text-align: left;
                        font-size: 14px;
                        vertical-align: middle;
                    }
                    
                    .label-col {
                        width: 140px;
                        font-weight: bold;
                        color: #333;
                    }
                    
                    input[type="text"], input[type="number"], select {
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ccc;
                        border-radius: 5px;
                        font-size: 13px;
                        box-sizing: border-box;
                    }
                    
                    input[type="checkbox"] {
                        transform: scale(1.2);
                        margin-right: 8px;
                    }
                    
                    input[type="submit"] {
                        background-color: #0070f3;
                        color: white;
                        padding: 12px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        width: 100%;
                        margin-top: 10px;
                    }
                    
                    input[type="submit"]:hover {
                        background-color: #0051cc;
                    }
                    
                    .checkbox-row {
                        display: flex;
                        align-items: center;
                    }
                    
                    .help-text {
                        font-size: 11px;
                        color: #666;
                        font-style: italic;
                        margin-top: 5px;
                    }
                    
                    .info-box {
                        background: #e3f2fd;
                        border: 1px solid #2196f3;
                        border-radius: 5px;
                        padding: 15px;
                        margin-bottom: 20px;
                    }
                    
                    .info-box h4 {
                        margin: 0 0 10px 0;
                        color: #1976d2;
                    }
                    
                    .info-box p {
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                </style>
                
                <form id="form">
                    <div class="info-box">
                        <h4>📊 איך להזין נתונים / How to Input Data</h4>
                        <p>
                            <strong>להזנת נתונים:</strong><br>
                            1. השתמש בסקריפט: <code>hebrewTable_1.setTableData(data)</code><br>
                            2. או חבר את הווידג'ט למקור נתונים בסטורי<br><br>
                            <strong>To input data:</strong><br>
                            1. Use script: <code>hebrewTable_1.setTableData(data)</code><br>
                            2. Or connect widget to data source in story
                        </p>
                    </div>
                    
                    <div class="section-title">הגדרות כלליות / General Settings</div>
                    <table>
                        <tr>
                            <td class="label-col">כותרת הטבלה / Table Title</td>
                            <td><input id="table_title" type="text" placeholder="הכנס כותרת לטבלה"></td>
                        </tr>
                        <tr>
                            <td class="label-col">מצב RTL / RTL Mode</td>
                            <td>
                                <div class="checkbox-row">
                                    <input type="checkbox" id="rtl_mode" checked>
                                    <span>הפעל כיוון עברית</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    
                    <div class="section-title">הגדרות תצוגה / Display Settings</div>
                    <table>
                        <tr>
                            <td class="label-col">מספר שורות מקסימלי / Max Rows</td>
                            <td>
                                <input id="max_rows" type="number" min="1" max="1000" value="100" placeholder="100">
                                <div class="help-text">מגביל את מספר השורות המוצגות</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="label-col">הצג מספור / Show Numbering</td>
                            <td>
                                <div class="checkbox-row">
                                    <input type="checkbox" id="show_numbering">
                                    <span>הוסף עמודת מספור</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="label-col">שורות מפוספסות / Striped Rows</td>
                            <td>
                                <div class="checkbox-row">
                                    <input type="checkbox" id="striped_rows" checked>
                                    <span>צבע רקע מתחלף</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    
                    <div class="section-title">הגדרות מספרים / Number Settings</div>
                    <table>
                        <tr>
                            <td class="label-col">פורמט מספרים / Format Numbers</td>
                            <td>
                                <div class="checkbox-row">
                                    <input type="checkbox" id="format_numbers" checked>
                                    <span>הוסף פסיקים ומטבע</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="label-col">סמל מטבע / Currency Symbol</td>
                            <td>
                                <input id="currency_symbol" type="text" value="₪" maxlength="3" placeholder="₪">
                                <div class="help-text">הסמל שיוצג ליד מספרים</div>
                            </td>
                        </tr>
                    </table>
                    
                    <input value="עדכן הגדרות / Update Settings" type="submit">
                </form>
            `;
            
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        }

        _submit(event) {
            event.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        tableTitle: this.tableTitle,
                        rtlMode: this.rtlMode,
                        maxRows: this.maxRows,
                        showNumbering: this.showNumbering,
                        stripedRows: this.stripedRows,
                        formatNumbers: this.formatNumbers,
                        currencySymbol: this.currencySymbol
                    }
                }
            }));
        }

        // Property getters and setters
        get tableTitle() {
            return this._shadowRoot.getElementById("table_title").value;
        }
        set tableTitle(value) {
            this._shadowRoot.getElementById("table_title").value = value;
        }

        get rtlMode() {
            return this._shadowRoot.getElementById("rtl_mode").checked;
        }
        set rtlMode(value) {
            this._shadowRoot.getElementById("rtl_mode").checked = !!value;
        }

        get maxRows() {
            return parseInt(this._shadowRoot.getElementById("max_rows").value) || 100;
        }
        set maxRows(value) {
            this._shadowRoot.getElementById("max_rows").value = value || 100;
        }

        get showNumbering() {
            return this._shadowRoot.getElementById("show_numbering").checked;
        }
        set showNumbering(value) {
            this._shadowRoot.getElementById("show_numbering").checked = !!value;
        }

        get stripedRows() {
            return this._shadowRoot.getElementById("striped_rows").checked;
        }
        set stripedRows(value) {
            this._shadowRoot.getElementById("striped_rows").checked = !!value;
        }

        get formatNumbers() {
            return this._shadowRoot.getElementById("format_numbers").checked;
        }
        set formatNumbers(value) {
            this._shadowRoot.getElementById("format_numbers").checked = !!value;
        }

        get currencySymbol() {
            return this._shadowRoot.getElementById("currency_symbol").value;
        }
        set currencySymbol(value) {
            this._shadowRoot.getElementById("currency_symbol").value = value || "₪";
        }
    }

    // Main Widget Component
    class HebrewTable extends HTMLElement {
        constructor() {
            super();
            const template = document.createElement("template");
            template.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 100%;
                        font-family: Arial, sans-serif;
                    }
                    
                    .container {
                        padding: 20px;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        direction: ltr;
                    }
                    
                    .container.rtl {
                        direction: rtl;
                    }
                    
                    .card {
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                        border-radius: 10px;
                        padding: 20px;
                        background: white;
                        height: calc(100% - 40px);
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .table-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        color: #333;
                        text-align: center;
                    }
                    
                    .table-wrapper {
                        flex: 1;
                        overflow: auto;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 14px;
                    }
                    
                    th, td {
                        border: 1px solid #e5e5e5;
                        padding: 12px 8px;
                        text-align: left;
                        vertical-align: middle;
                    }
                    
                    .rtl th, .rtl td {
                        text-align: right;
                    }
                    
                    th {
                        background-color: #f7f7f7;
                        font-weight: 600;
                        color: #32363a;
                        position: sticky;
                        top: 0;
                        z-index: 10;
                    }
                    
                    tbody tr:nth-child(even) {
                        background-color: #fafafa;
                    }
                    
                    tbody tr:hover {
                        background-color: #f0f0f0;
                    }
                    
                    .number-cell {
                        text-align: right !important;
                        font-variant-numeric: tabular-nums;
                        font-family: 'Courier New', monospace;
                    }
                    
                    .rtl .number-cell {
                        text-align: left !important;
                    }
                    
                    .numbering-cell {
                        background-color: #f0f0f0;
                        font-weight: bold;
                        text-align: center !important;
                        width: 50px;
                        min-width: 50px;
                    }
                    
                    .no-data {
                        text-align: center;
                        padding: 60px 20px;
                        color: #666;
                        font-size: 16px;
                        border: 2px dashed #ccc;
                        border-radius: 10px;
                        background-color: #fafafa;
                    }
                    
                    .no-data .icon {
                        font-size: 48px;
                        margin-bottom: 15px;
                        opacity: 0.5;
                    }
                </style>
                
                <div class="container" id="container">
                    <div class="card">
                        <div class="table-title" id="tableTitle">טבלה עברית דינמית</div>
                        <div id="no-data" class="no-data">
                            <div class="icon">📊</div>
                            <div>אין נתונים להצגה</div>
                            <div style="font-size: 12px; margin-top: 10px; color: #999;">
                                השתמש בשיטת setTableData() או חבר מקור נתונים
                            </div>
                        </div>
                        <div class="table-wrapper" id="table-wrapper" style="display: none;">
                            <table id="myTable">
                                <thead id="tableHeader"></thead>
                                <tbody id="tableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            
            this._tableTitle = this._shadowRoot.querySelector("#tableTitle");
            this._myTable = this._shadowRoot.querySelector("#myTable");
            this._container = this._shadowRoot.querySelector("#container");
            this._noData = this._shadowRoot.querySelector("#no-data");
            this._tableWrapper = this._shadowRoot.querySelector("#table-wrapper");
            
            this._props = {
                tableTitle: "טבלה עברית דינמית",
                rtlMode: true,
                maxRows: 100,
                showNumbering: false,
                stripedRows: true,
                formatNumbers: true,
                currencySymbol: "₪"
            };
            
            this._tableData = null;
        }

        // SAC lifecycle methods
        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = {...this._props, ...changedProperties};
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this._updateDisplay();
        }

        // Property getters and setters
        get tableTitle() { return this._props.tableTitle; }
        set tableTitle(value) { 
            this._props.tableTitle = value;
            this._updateDisplay();
        }

        get rtlMode() { return this._props.rtlMode; }
        set rtlMode(value) { 
            this._props.rtlMode = !!value;
            this._updateDisplay();
        }

        get maxRows() { return this._props.maxRows; }
        set maxRows(value) { 
            this._props.maxRows = parseInt(value) || 100;
            this._renderTable();
        }

        get showNumbering() { return this._props.showNumbering; }
        set showNumbering(value) { 
            this._props.showNumbering = !!value;
            this._renderTable();
        }

        get stripedRows() { return this._props.stripedRows; }
        set stripedRows(value) { 
            this._props.stripedRows = !!value;
            this._updateStriping();
        }

        get formatNumbers() { return this._props.formatNumbers; }
        set formatNumbers(value) { 
            this._props.formatNumbers = !!value;
            this._renderTable();
        }

        get currencySymbol() { return this._props.currencySymbol; }
        set currencySymbol(value) { 
            this._props.currencySymbol = value || "₪";
            this._renderTable();
        }

        // Main method to set table data (like Dynamo Table)
        setTableData(data) {
            this._tableData = data;
            this._renderTable();
        }

        _updateDisplay() {
            // Update title
            this._tableTitle.textContent = this._props.tableTitle || "טבלה עברית דינמית";
            
            // Update RTL mode
            if (this._props.rtlMode) {
                this._container.classList.add('rtl');
            } else {
                this._container.classList.remove('rtl');
            }
        }

        _updateStriping() {
            const tbody = this._shadowRoot.querySelector('#tableBody');
            if (tbody) {
                if (this._props.stripedRows) {
                    tbody.classList.add('striped');
                } else {
                    tbody.classList.remove('striped');
                }
            }
        }

        _renderTable() {
            if (!this._tableData || !Array.isArray(this._tableData) || this._tableData.length === 0) {
                this._noData.style.display = 'block';
                this._tableWrapper.style.display = 'none';
                return;
            }

            this._noData.style.display = 'none';
            this._tableWrapper.style.display = 'block';

            try {
                const tableHeader = this._shadowRoot.querySelector('#tableHeader');
                const tableBody = this._shadowRoot.querySelector('#tableBody');
                
                // Clear existing content
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';

                // Get column keys from first row
                const columns = Object.keys(this._tableData[0]);
                
                // Build header
                let headerHTML = '<tr>';
                
                if (this._props.showNumbering) {
                    headerHTML += '<th class="numbering-cell">#</th>';
                }
                
                columns.forEach(column => {
                    const displayName = this._formatColumnName(column);
                    headerHTML += `<th>${displayName}</th>`;
                });
                
                headerHTML += '</tr>';
                tableHeader.innerHTML = headerHTML;

                // Build body with row limit
                const maxRows = Math.min(this._props.maxRows, this._tableData.length);
                let bodyHTML = '';
                
                for (let i = 0; i < maxRows; i++) {
                    const row = this._tableData[i];
                    bodyHTML += '<tr>';
                    
                    if (this._props.showNumbering) {
                        bodyHTML += `<td class="numbering-cell">${i + 1}</td>`;
                    }
                    
                    columns.forEach(column => {
                        const value = row[column];
                        const cellClass = this._isNumericValue(value) ? 'number-cell' : '';
                        const displayValue = this._formatCellValue(value);
                        bodyHTML += `<td class="${cellClass}">${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }
                
                tableBody.innerHTML = bodyHTML;
                this._updateStriping();

            } catch (error) {
                console.error('Error rendering Hebrew table:', error);
                tableBody.innerHTML = `<tr><td colspan="100%">שגיאה בטעינת הנתונים: ${error.message}</td></tr>`;
            }
        }

        _formatColumnName(column) {
            // Convert camelCase to readable format
            return column
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        }

        _isNumericValue(value) {
            if (value === null || value === undefined || value === '') return false;
            const num = parseFloat(value);
            return !isNaN(num) && isFinite(num);
        }

        _formatCellValue(value) {
            if (value === null || value === undefined) return '';
            
            if (this._props.formatNumbers && this._isNumericValue(value)) {
                const num = parseFloat(value);
                const formatted = new Intl.NumberFormat('he-IL', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }).format(num);
                
                return this._props.currencySymbol ? `${this._props.currencySymbol}${formatted}` : formatted;
            }
            
            return String(value);
        }
    }

    // Register both components
    customElements.define("hebrew-table", HebrewTable);
    customElements.define("hebrew-table-builder", HebrewTableBuilder);

})();
