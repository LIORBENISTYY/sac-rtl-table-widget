(function() {
    // Main widget template
    let mainTemplate = document.createElement("template");
    mainTemplate.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: Arial, Helvetica, sans-serif;
            }
            .table-container {
                width: 100%;
                height: 100%;
                overflow: auto;
                padding: 20px;
                box-sizing: border-box;
                direction: ltr;
            }
            .table-container.rtl {
                direction: rtl;
            }
            .widget-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #32363a;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th, td {
                border: 1px solid #e5e5e5;
                padding: 12px;
                text-align: left;
            }
            .rtl th, .rtl td {
                text-align: right;
            }
            th {
                background-color: #f7f7f7;
                font-weight: 600;
                color: #32363a;
            }
            tr:nth-child(even) {
                background-color: #fafafa;
            }
            tr:hover {
                background-color: #f0f0f0;
            }
            .number-cell {
                text-align: right;
                font-variant-numeric: tabular-nums;
            }
            .rtl .number-cell {
                text-align: left;
            }
            .no-data {
                text-align: center;
                padding: 40px;
                color: #6a6d70;
                font-style: italic;
                border: 2px dashed #ccc;
                border-radius: 8px;
                margin: 20px 0;
            }
            .loading {
                text-align: center;
                padding: 40px;
                color: #0070f3;
            }
        </style>
        <div class="table-container" id="table-container">
            <div class="widget-title" id="widget-title">טבלה דינמית</div>
            <div id="no-data" class="no-data">
                אנא חבר מקור נתונים בפאנל הבנייה<br>
                Please connect a data source in the Builder Panel
            </div>
            <div id="loading" class="loading" style="display: none;">
                טוען נתונים...<br>
                Loading data...
            </div>
            <table id="data-table" style="display: none;">
                <thead id="table-head"></thead>
                <tbody id="table-body"></tbody>
            </table>
        </div>
    `;

    // Builder template
    let builderTemplate = document.createElement("template");
    builderTemplate.innerHTML = `
        <style>
            .builder-container {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 400px;
            }
            .form-group {
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 15px;
            }
            .form-group:last-child {
                border-bottom: none;
            }
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #32363a;
                font-size: 14px;
            }
            input[type="text"], input[type="number"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
            }
            input[type="checkbox"] {
                margin-right: 8px;
                transform: scale(1.2);
            }
            .checkbox-label {
                display: flex;
                align-items: center;
                font-weight: normal;
                cursor: pointer;
            }
            input[type="submit"] {
                background-color: #0070f3;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
                margin-top: 10px;
            }
            input[type="submit"]:hover {
                background-color: #0051cc;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #0070f3;
                margin-bottom: 10px;
                border-bottom: 2px solid #0070f3;
                padding-bottom: 5px;
            }
            .help-text {
                font-size: 12px;
                color: #666;
                font-style: italic;
                margin-top: 5px;
            }
        </style>
        <div class="builder-container">
            <form id="properties-form">
                <div class="section-title">הגדרות כלליות / General Settings</div>
                
                <div class="form-group">
                    <label for="table-title">כותרת הטבלה / Table Title:</label>
                    <input type="text" id="table-title" placeholder="הכנס כותרת לטבלה">
                    <div class="help-text">הכותרת שתוצג מעל הטבלה</div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="rtl-mode"> מצב עברית (RTL) / Hebrew Mode
                    </label>
                    <div class="help-text">הפעל עבור תצוגה מימין לשמאל</div>
                </div>

                <div class="section-title">הגדרות טבלה / Table Settings</div>
                
                <div class="form-group">
                    <label for="max-rows">מספר שורות מקסימלי / Max Rows:</label>
                    <input type="number" id="max-rows" min="1" max="1000" placeholder="100">
                    <div class="help-text">מגביל את מספר השורות המוצגות</div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="show-totals"> הצג סיכומים / Show Totals
                    </label>
                    <div class="help-text">מציג שורת סיכום עבור מדדים מספריים</div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="striped-rows"> שורות מפוספסות / Striped Rows
                    </label>
                    <div class="help-text">צבע רקע מתחלף בין השורות</div>
                </div>

                <div class="section-title">הגדרות נתונים / Data Settings</div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="format-numbers"> פורמט מספרים / Format Numbers
                    </label>
                    <div class="help-text">מעצב מספרים עם פסיקים ומטבע</div>
                </div>

                <div class="form-group">
                    <label for="currency-symbol">סמל מטבע / Currency Symbol:</label>
                    <input type="text" id="currency-symbol" placeholder="₪" maxlength="3">
                    <div class="help-text">הסמל שיוצג ליד ערכים מספריים</div>
                </div>

                <input type="submit" value="עדכן הגדרות / Update Settings">
            </form>
        </div>
    `;

    // Main Widget Component
    class DynamicHebrewTable extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
            
            // Default properties
            this._props = {
                tableTitle: "טבלה דינמית",
                rtlMode: true,
                maxRows: 100,
                showTotals: false,
                stripedRows: true,
                formatNumbers: true,
                currencySymbol: "₪"
            };

            // Data storage
            this._tableData = null;
            this._metadata = null;
        }

        // SAC lifecycle methods
        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = {...this._props, ...changedProperties};
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this._render();
        }

        onCustomWidgetResize(width, height) {
            // Handle resize if needed
        }

        // Data binding access method
        get myBinding() {
            return this.dataBindings?.getDataBinding?.('myBinding');
        }

        // Property getters and setters
        get tableTitle() { return this._props.tableTitle; }
        set tableTitle(value) { 
            this._props.tableTitle = value;
            this._render();
        }

        get rtlMode() { return this._props.rtlMode; }
        set rtlMode(value) { 
            this._props.rtlMode = !!value;
            this._render();
        }

        get maxRows() { return this._props.maxRows; }
        set maxRows(value) { 
            this._props.maxRows = parseInt(value) || 100;
            this._render();
        }

        get showTotals() { return this._props.showTotals; }
        set showTotals(value) { 
            this._props.showTotals = !!value;
            this._render();
        }

        get stripedRows() { return this._props.stripedRows; }
        set stripedRows(value) { 
            this._props.stripedRows = !!value;
            this._render();
        }

        get formatNumbers() { return this._props.formatNumbers; }
        set formatNumbers(value) { 
            this._props.formatNumbers = !!value;
            this._render();
        }

        get currencySymbol() { return this._props.currencySymbol; }
        set currencySymbol(value) { 
            this._props.currencySymbol = value || "₪";
            this._render();
        }

        _render() {
            const titleElement = this._shadowRoot.querySelector('#widget-title');
            const containerElement = this._shadowRoot.querySelector('#table-container');
            const noDataElement = this._shadowRoot.querySelector('#no-data');
            const loadingElement = this._shadowRoot.querySelector('#loading');
            const tableElement = this._shadowRoot.querySelector('#data-table');

            // Update title
            if (titleElement) {
                titleElement.textContent = this._props.tableTitle || "טבלה דינמית";
            }

            // Apply RTL mode
            if (containerElement) {
                if (this._props.rtlMode) {
                    containerElement.classList.add('rtl');
                } else {
                    containerElement.classList.remove('rtl');
                }
            }

            // Check for data binding
            const dataBinding = this.myBinding;
            
            if (!dataBinding) {
                // No data binding configured
                noDataElement.style.display = 'block';
                loadingElement.style.display = 'none';
                tableElement.style.display = 'none';
                return;
            }

            if (!dataBinding.data || dataBinding.data.length === 0) {
                // Data binding exists but no data yet
                noDataElement.style.display = 'none';
                loadingElement.style.display = 'block';
                tableElement.style.display = 'none';
                return;
            }

            // We have data - render the table
            noDataElement.style.display = 'none';
            loadingElement.style.display = 'none';
            tableElement.style.display = 'table';

            this._renderTable(dataBinding);
        }

        _renderTable(dataBinding) {
            const tableHead = this._shadowRoot.querySelector('#table-head');
            const tableBody = this._shadowRoot.querySelector('#table-body');
            const table = this._shadowRoot.querySelector('#data-table');

            try {
                // Get dimensions and measures from metadata
                const dimensions = dataBinding.metadata?.dimensions || [];
                const measures = dataBinding.metadata?.measures || [];
                const data = dataBinding.data || [];

                // Build table header
                let headerHTML = '<tr>';
                
                dimensions.forEach(dim => {
                    const displayName = dim.description || dim.id;
                    headerHTML += `<th>${displayName}</th>`;
                });
                
                measures.forEach(measure => {
                    const displayName = measure.description || measure.id;
                    headerHTML += `<th>${displayName}</th>`;
                });
                
                headerHTML += '</tr>';
                tableHead.innerHTML = headerHTML;

                // Apply striped rows styling
                if (this._props.stripedRows) {
                    table.classList.add('striped');
                } else {
                    table.classList.remove('striped');
                }

                // Build table body (limit rows if needed)
                const maxRows = Math.min(this._props.maxRows, data.length);
                let bodyHTML = '';
                let totals = {};

                for (let i = 0; i < maxRows; i++) {
                    const row = data[i];
                    bodyHTML += '<tr>';
                    
                    // Add dimension cells
                    dimensions.forEach((dim, index) => {
                        const key = `dimensions_${index}`;
                        const value = row[key];
                        let displayValue = '';
                        
                        if (value !== undefined && value !== null) {
                            displayValue = value.label || value.id || value.toString();
                        }
                        
                        bodyHTML += `<td>${displayValue}</td>`;
                    });
                    
                    // Add measure cells
                    measures.forEach((measure, index) => {
                        const key = `measures_${index}`;
                        const value = row[key];
                        let displayValue = '';
                        
                        if (value !== undefined && value !== null) {
                            let numericValue = 0;
                            
                            if (typeof value === 'object') {
                                displayValue = value.formatted || value.raw || '';
                                numericValue = parseFloat(value.raw) || 0;
                            } else {
                                numericValue = parseFloat(value) || 0;
                                displayValue = value.toString();
                            }
                            
                            // Format numbers if enabled
                            if (this._props.formatNumbers && !isNaN(numericValue)) {
                                displayValue = this._formatNumber(numericValue);
                            }
                            
                            // Calculate totals
                            if (this._props.showTotals && !isNaN(numericValue)) {
                                if (!totals[key]) totals[key] = 0;
                                totals[key] += numericValue;
                            }
                        }
                        
                        bodyHTML += `<td class="number-cell">${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }

                // Add totals row if enabled
                if (this._props.showTotals && Object.keys(totals).length > 0) {
                    bodyHTML += '<tr style="font-weight: bold; background-color: #f0f0f0; border-top: 2px solid #ccc;">';
                    
                    // Empty cells for dimensions
                    dimensions.forEach((dim, index) => {
                        if (index === 0) {
                            bodyHTML += `<td>סה"כ / Total</td>`;
                        } else {
                            bodyHTML += `<td></td>`;
                        }
                    });
                    
                    // Total cells for measures
                    measures.forEach((measure, index) => {
                        const key = `measures_${index}`;
                        const total = totals[key] || 0;
                        const formattedTotal = this._props.formatNumbers ? this._formatNumber(total) : total.toString();
                        bodyHTML += `<td class="number-cell">${formattedTotal}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }
                
                tableBody.innerHTML = bodyHTML;

            } catch (error) {
                console.error('Error rendering table:', error);
                tableBody.innerHTML = `<tr><td colspan="100%">שגיאה בהצגת הנתונים / Error rendering data: ${error.message}</td></tr>`;
            }
        }

        _formatNumber(value) {
            if (isNaN(value)) return value;
            
            const formatted = new Intl.NumberFormat('he-IL', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(value);
            
            return this._props.currencySymbol ? `${this._props.currencySymbol}${formatted}` : formatted;
        }
    }

    // Builder Component
    class DynamicHebrewTableBuilder extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(builderTemplate.content.cloneNode(true));
            
            // Add form submit handler
            this._shadowRoot.querySelector('#properties-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this._updateProperties();
            });
        }

        _updateProperties() {
            const properties = {
                tableTitle: this._shadowRoot.querySelector('#table-title').value,
                rtlMode: this._shadowRoot.querySelector('#rtl-mode').checked,
                maxRows: parseInt(this._shadowRoot.querySelector('#max-rows').value) || 100,
                showTotals: this._shadowRoot.querySelector('#show-totals').checked,
                stripedRows: this._shadowRoot.querySelector('#striped-rows').checked,
                formatNumbers: this._shadowRoot.querySelector('#format-numbers').checked,
                currencySymbol: this._shadowRoot.querySelector('#currency-symbol').value || "₪"
            };
            
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties }
            }));
        }

        // Property getters and setters
        get tableTitle() { return this._shadowRoot.querySelector('#table-title').value; }
        set tableTitle(value) { this._shadowRoot.querySelector('#table-title').value = value || ""; }

        get rtlMode() { return this._shadowRoot.querySelector('#rtl-mode').checked; }
        set rtlMode(value) { this._shadowRoot.querySelector('#rtl-mode').checked = !!value; }

        get maxRows() { return parseInt(this._shadowRoot.querySelector('#max-rows').value) || 100; }
        set maxRows(value) { this._shadowRoot.querySelector('#max-rows').value = value || 100; }

        get showTotals() { return this._shadowRoot.querySelector('#show-totals').checked; }
        set showTotals(value) { this._shadowRoot.querySelector('#show-totals').checked = !!value; }

        get stripedRows() { return this._shadowRoot.querySelector('#striped-rows').checked; }
        set stripedRows(value) { this._shadowRoot.querySelector('#striped-rows').checked = !!value; }

        get formatNumbers() { return this._shadowRoot.querySelector('#format-numbers').checked; }
        set formatNumbers(value) { this._shadowRoot.querySelector('#format-numbers').checked = !!value; }

        get currencySymbol() { return this._shadowRoot.querySelector('#currency-symbol').value; }
        set currencySymbol(value) { this._shadowRoot.querySelector('#currency-symbol').value = value || "₪"; }
    }

    // Register both components
    customElements.define("dynamic-hebrew-table", DynamicHebrewTable);
    customElements.define("dynamic-hebrew-table-builder", DynamicHebrewTableBuilder);
})();
