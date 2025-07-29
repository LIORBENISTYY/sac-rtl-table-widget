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
                padding: 15px;
                direction: ltr;
                height: 100%;
                box-sizing: border-box;
            }
            .container.rtl {
                direction: rtl;
            }
            .title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            .rtl th, .rtl td {
                text-align: right;
            }
            th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            .no-data {
                text-align: center;
                padding: 30px;
                color: #666;
                border: 2px dashed #ccc;
            }
        </style>
        <div class="container" id="container">
            <div class="title" id="title">טבלה דינמית</div>
            <div id="no-data" class="no-data">
                אין נתונים - חבר מקור נתונים<br>
                No data - Connect data source
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
                padding: 15px;
                font-family: Arial, sans-serif;
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input[type="text"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            input[type="checkbox"] {
                margin-right: 8px;
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
        </style>
        <div class="builder">
            <div class="form-group">
                <label>כותרת:</label>
                <input type="text" id="title-input" placeholder="הכנס כותרת">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="rtl-input"> RTL
                </label>
            </div>
            <button id="update-btn">עדכן</button>
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
                rtlMode: true
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

        get myDataBinding() {
            try {
                return this.dataBindings && this.dataBindings.getDataBinding ? 
                       this.dataBindings.getDataBinding('myDataBinding') : null;
            } catch (e) {
                return null;
            }
        }

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

        _render() {
            const container = this._shadowRoot.getElementById('container');
            const title = this._shadowRoot.getElementById('title');
            const noData = this._shadowRoot.getElementById('no-data');
            const table = this._shadowRoot.getElementById('table');

            title.textContent = this._props.tableTitle;

            if (this._props.rtlMode) {
                container.classList.add('rtl');
            } else {
                container.classList.remove('rtl');
            }

            const dataBinding = this.myDataBinding;
            
            if (!dataBinding || !dataBinding.data || dataBinding.data.length === 0) {
                noData.style.display = 'block';
                table.style.display = 'none';
                return;
            }

            noData.style.display = 'none';
            table.style.display = 'table';
            this._renderTable(dataBinding);
        }

        _renderTable(dataBinding) {
            const thead = this._shadowRoot.getElementById('thead');
            const tbody = this._shadowRoot.getElementById('tbody');

            try {
                const data = dataBinding.data || [];
                if (data.length === 0) return;

                // Get first row to determine structure
                const firstRow = data[0];
                const columns = Object.keys(firstRow);

                // Build header
                let headerHTML = '<tr>';
                columns.forEach(col => {
                    const displayName = col.replace('dimensions_', 'ממד ').replace('measures_', 'מדד ');
                    headerHTML += `<th>${displayName}</th>`;
                });
                headerHTML += '</tr>';
                thead.innerHTML = headerHTML;

                // Build body
                let bodyHTML = '';
                const maxRows = Math.min(50, data.length);
                
                for (let i = 0; i < maxRows; i++) {
                    const row = data[i];
                    bodyHTML += '<tr>';
                    
                    columns.forEach(col => {
                        const value = row[col];
                        let displayValue = '';
                        
                        if (value && typeof value === 'object') {
                            displayValue = value.label || value.formatted || value.raw || value.id || '';
                        } else {
                            displayValue = value || '';
                        }
                        
                        bodyHTML += `<td>${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }
                
                tbody.innerHTML = bodyHTML;

            } catch (error) {
                console.error('Render error:', error);
                tbody.innerHTML = `<tr><td colspan="100%">שגיאה: ${error.message}</td></tr>`;
            }
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
            const title = this._shadowRoot.getElementById('title-input').value;
            const rtl = this._shadowRoot.getElementById('rtl-input').checked;
            
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        tableTitle: title,
                        rtlMode: rtl
                    }
                }
            }));
        }

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
    }

    // Register components - CRITICAL: These must match the JSON tags exactly
    customElements.define("hebrew-dynamic-table", HebrewDynamicTable);
    customElements.define("hebrew-dynamic-table-builder", HebrewDynamicTableBuilder);

})();
