(function() {
    'use strict';
    
    // Main widget template
    let mainTemplate = document.createElement("template");
    mainTemplate.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: Arial, sans-serif;
            }
            .container {
                padding: 20px;
                direction: ltr;
                height: 100%;
                box-sizing: border-box;
            }
            .container.rtl {
                direction: rtl;
            }
            .title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .rtl th, .rtl td {
                text-align: right;
            }
            th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #fafafa;
            }
            tr:hover {
                background-color: #f0f0f0;
            }
            .measure-cell {
                text-align: right;
                font-variant-numeric: tabular-nums;
            }
            .rtl .measure-cell {
                text-align: left;
            }
            .no-data {
                text-align: center;
                padding: 40px;
                color: #666;
                border: 2px dashed #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            .loading {
                text-align: center;
                padding: 40px;
                color: #0070f3;
            }
        </style>
        <div class="container" id="container">
            <div class="title" id="title">טבלה דינמית</div>
            <div id="no-data" class="no-data">
                <h3>אין נתונים להצגה</h3>
                <p>לחיבור נתונים:</p>
                <ol style="text-align: right; display: inline-block;">
                    <li>לחץ ימין על הווידג'ט → "Edit Data"</li>
                    <li>או חפש כרטיסיית "Data" בפאנל הימני</li>
                    <li>גרור ממדים אל "dimensions"</li>
                    <li>גרור מדדים אל "measures"</li>
                </ol>
                <hr style="margin: 20px 0;">
                <h3>No Data to Display</h3>
                <p>To connect data:</p>
                <ol style="text-align: left; display: inline-block;">
                    <li>Right-click widget → "Edit Data"</li>
                    <li>Or find "Data" tab in right panel</li>
                    <li>Drag dimensions to "dimensions"</li>
                    <li>Drag measures to "measures"</li>
                </ol>
            </div>
            <div id="loading" class="loading" style="display: none;">
                טוען נתונים... / Loading data...
            </div>
            <table id="table" style="display: none;">
                <thead id="thead"></thead>
                <tbody id="tbody"></tbody>
            </table>
        </div>
    `;

    // Builder template
    let builderTemplate = document.createElement("template");
    builderTemplate.innerHTML = `
        <style>
            .builder {
                padding: 20px;
                font-family: Arial, sans-serif;
            }
            .info-box {
                background: #e3f2fd;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
                border-left: 4px solid #2196f3;
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input[type="text"], input[type="number"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            input[type="checkbox"] {
                margin-right: 8px;
            }
            .checkbox-label {
                display: flex;
                align-items: center;
                font-weight: normal;
                cursor: pointer;
            }
            button {
                background: #0070f3;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
            }
            button:hover {
                background: #0051cc;
            }
        </style>
        <div class="builder">
            <div class="info-box">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">📊 הוראות חיבור נתונים</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.4;">
                    <strong>לחיבור נתונים לטבלה:</strong><br>
                    1. לחץ ימין על הווידג'ט ← "Edit Data"<br>
                    2. או חפש כרטיסית "Data" בפאנל הימני<br>
                    3. גרור ממדים (dimensions) מהדגם<br>
                    4. גרור מדדים (measures) מהדגם<br><br>
                    <strong>To connect data to table:</strong><br>
                    1. Right-click widget → "Edit Data"<br>
                    2. Or find "Data" tab in right panel<br>
                    3. Drag dimensions from model<br>
                    4. Drag measures from model
                </p>
            </div>
            
            <div class="form-group">
                <label>כותרת הטבלה / Table Title:</label>
                <input type="text" id="title-input" placeholder="הכנס כותרת">
            </div>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="rtl-input"> מצב עברית (RTL) / Hebrew Mode
                </label>
            </div>
            
            <div class="form-group">
                <label>מספר שורות מקסימלי / Max Rows:</label>
                <input type="number" id="max-rows-input" min="1" max="1000" placeholder="100">
            </div>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="format-numbers-input"> פורמט מספרים / Format Numbers
                </label>
            </div>
            
            <div class="form-group">
                <label>סמל מטבע / Currency Symbol:</label>
                <input type="text" id="currency-input" placeholder="₪" maxlength="3">
            </div>
            
            <button id="update-btn">עדכן הגדרות / Update Settings</button>
        </div>
    `;

    // Main Widget
    class HebrewDynamicTable extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
            
            this._props = {
                tableTitle: "טבלה דינמית",
                rtlMode: true,
                maxRows: 100,
                formatNumbers: true,
                currencySymbol: "₪"
            };
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if (changedProperties) {
                this._props = {...this._props, ...changedProperties};
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this._render();
        }

        onCustomWidgetResize(width, height) {
            // Handle resize if needed
        }

        // Data binding access - this is the key part!
        get myDataBinding() {
            try {
                return this.dataBindings?.getDataBinding?.('myDataBinding');
            } catch (e) {
                console.warn('Error accessing data binding:', e);
                return null;
            }
        }

        // Property getters and setters
        get tableTitle() { return this._props.tableTitle; }
        set tableTitle(value) { 
            this._props.tableTitle = value || "טבלה דינמית";
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
            const container = this._shadowRoot.getElementById('container');
            const title = this._shadowRoot.getElementById('title');
            const noData = this._shadowRoot.getElementById('no-data');
            const loading = this._shadowRoot.getElementById('loading');
            const table = this._shadowRoot.getElementById('table');

            // Update title
            title.textContent = this._props.tableTitle;

            // Update RTL
            if (this._props.rtlMode) {
                container.classList.add('rtl');
            } else {
                container.classList.remove('rtl');
            }

            // Check data binding
            const dataBinding = this.myDataBinding;
            
            if (!dataBinding) {
                noData.style.display = 'block';
                loading.style.display = 'none';
                table.style.display = 'none';
                return;
            }

            if (!dataBinding.data || dataBinding.data.length === 0) {
                noData.style.display = 'none';
                loading.style.display = 'block';
                table.style.display = 'none';
                return;
            }

            noData.style.display = 'none';
            loading.style.display = 'none';
            table.style.display = 'table';
            this._renderTable(dataBinding);
        }

        _renderTable(dataBinding) {
            const thead = this._shadowRoot.getElementById('thead');
            const tbody = this._shadowRoot.getElementById('tbody');

            try {
                const dimensions = dataBinding.metadata?.dimensions || [];
                const measures = dataBinding.metadata?.mainStructureMembers || [];
                const data = dataBinding.data || [];

                // Build header
                let headerHTML = '<tr>';
                
                // Add dimension headers
                Object.values(dimensions).forEach(dim => {
                    headerHTML += `<th>${dim.description || dim.id}</th>`;
                });
                
                // Add measure headers  
                Object.values(measures).forEach(measure => {
                    headerHTML += `<th>${measure.label || measure.id}</th>`;
                });
                
                headerHTML += '</tr>';
                thead.innerHTML = headerHTML;

                // Build body
                let bodyHTML = '';
                const maxRows = Math.min(this._props.maxRows, data.length);
                
                for (let i = 0; i < maxRows; i++) {
                    const row = data[i];
                    bodyHTML += '<tr>';
                    
                    // Add dimension cells
                    Object.keys(dimensions).forEach(dimKey => {
                        const value = row[dimKey];
                        const displayValue = value?.label || value?.id || value || '';
                        bodyHTML += `<td>${displayValue}</td>`;
                    });
                    
                    // Add measure cells
                    Object.keys(measures).forEach(measureKey => {
                        const value = row[measureKey];
                        let displayValue = '';
                        
                        if (value !== undefined && value !== null) {
                            if (typeof value === 'object') {
                                displayValue = value.formatted || value.raw || '';
                            } else {
                                displayValue = value.toString();
                            }
                            
                            // Format numbers if enabled
                            if (this._props.formatNumbers && value.raw && !isNaN(value.raw)) {
                                displayValue = this._formatNumber(value.raw);
                            }
                        }
                        
                        bodyHTML += `<td class="measure-cell">${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }
                
                tbody.innerHTML = bodyHTML;

            } catch (error) {
                console.error('Render error:', error);
                tbody.innerHTML = `<tr><td colspan="100%">שגיאה בהצגת נתונים: ${error.message}</td></tr>`;
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
    class HebrewDynamicTableBuilder extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(builderTemplate.content.cloneNode(true));
            
            this._shadowRoot.getElementById('update-btn').addEventListener('click', () => {
                this._updateProperties();
            });
        }

        _updateProperties() {
            const properties = {
                tableTitle: this._shadowRoot.getElementById('title-input').value,
                rtlMode: this._shadowRoot.getElementById('rtl-input').checked,
                maxRows: parseInt(this._shadowRoot.getElementById('max-rows-input').value) || 100,
                formatNumbers: this._shadowRoot.getElementById('format-numbers-input').checked,
                currencySymbol: this._shadowRoot.getElementById('currency-input').value || "₪"
            };
            
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: { properties }
            }));
        }

        // Property getters and setters
        get tableTitle() { 
            return this._shadowRoot.getElementById('title-input').value; 
        }
        set tableTitle(value) { 
            this._shadowRoot.getElementById('title-input').value = value || ""; 
        }

        get rtlMode() { 
            return this._shadowRoot.getElementById('rtl-input').checked; 
        }
        set rtlMode(value) { 
            this._shadowRoot.getElementById('rtl-input').checked = !!value; 
        }

        get maxRows() { 
            return parseInt(this._shadowRoot.getElementById('max-rows-input').value) || 100; 
        }
        set maxRows(value) { 
            this._shadowRoot.getElementById('max-rows-input').value = value || 100; 
        }

        get formatNumbers() { 
            return this._shadowRoot.getElementById('format-numbers-input').checked; 
        }
        set formatNumbers(value) { 
            this._shadowRoot.getElementById('format-numbers-input').checked = !!value; 
        }

        get currencySymbol() { 
            return this._shadowRoot.getElementById('currency-input').value; 
        }
        set currencySymbol(value) { 
            this._shadowRoot.getElementById('currency-input').value = value || "₪"; 
        }
    }

    // Register components
    customElements.define("hebrew-dynamic-table", HebrewDynamicTable);
    customElements.define("hebrew-dynamic-table-builder", HebrewDynamicTableBuilder);

})();
