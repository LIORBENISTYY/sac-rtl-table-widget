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
                padding: 40px;
                color: #666;
                border: 2px dashed #ccc;
            }
        </style>
        <div class="container" id="container">
            <div class="title" id="title">טבלה דינמית</div>
            <div id="no-data" class="no-data">
                אנא חבר מקור נתונים<br>Please connect data source
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
            }
        </style>
        <div class="builder">
            <div class="form-group">
                <label>כותרת הטבלה:</label>
                <input type="text" id="title-input" placeholder="הכנס כותרת">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="rtl-input"> מצב RTL
                </label>
            </div>
            <button id="update-btn">עדכן</button>
        </div>
    `;

    // Main Widget
    class MinimalDynamicTable extends HTMLElement {
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

        get myBinding() {
            try {
                return this.dataBindings?.getDataBinding?.('myBinding');
            } catch (e) {
                console.warn('Error accessing data binding:', e);
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

            // Update title
            title.textContent = this._props.tableTitle;

            // Update RTL
            if (this._props.rtlMode) {
                container.classList.add('rtl');
            } else {
                container.classList.remove('rtl');
            }

            // Check data binding
            const dataBinding = this.myBinding;
            
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
                const dimensions = dataBinding.metadata?.dimensions || [];
                const measures = dataBinding.metadata?.measures || [];
                const data = dataBinding.data || [];

                // Build header
                let headerHTML = '<tr>';
                dimensions.forEach(dim => {
                    headerHTML += `<th>${dim.description || dim.id}</th>`;
                });
                measures.forEach(measure => {
                    headerHTML += `<th>${measure.description || measure.id}</th>`;
                });
                headerHTML += '</tr>';
                thead.innerHTML = headerHTML;

                // Build body
                let bodyHTML = '';
                const maxRows = Math.min(50, data.length); // Limit to 50 rows for performance
                
                for (let i = 0; i < maxRows; i++) {
                    const row = data[i];
                    bodyHTML += '<tr>';
                    
                    dimensions.forEach((dim, index) => {
                        const key = `dimensions_${index}`;
                        const value = row[key];
                        const displayValue = value?.label || value?.id || value || '';
                        bodyHTML += `<td>${displayValue}</td>`;
                    });
                    
                    measures.forEach((measure, index) => {
                        const key = `measures_${index}`;
                        const value = row[key];
                        let displayValue = '';
                        
                        if (value !== undefined && value !== null) {
                            if (typeof value === 'object') {
                                displayValue = value.formatted || value.raw || '';
                            } else {
                                displayValue = value.toString();
                            }
                        }
                        
                        bodyHTML += `<td>${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }
                
                tbody.innerHTML = bodyHTML;

            } catch (error) {
                console.error('Render error:', error);
                tbody.innerHTML = `<tr><td colspan="100%">Error: ${error.message}</td></tr>`;
            }
        }
    }

    // Builder Component
    class MinimalDynamicTableBuilder extends HTMLElement {
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

    // Register components
    customElements.define("minimal-dynamic-table", MinimalDynamicTable);
    customElements.define("minimal-dynamic-table-builder", MinimalDynamicTableBuilder);

})();
