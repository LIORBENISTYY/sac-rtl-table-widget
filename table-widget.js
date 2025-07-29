(function() {
    'use strict';
    
    // Main widget template
    const mainTemplate = document.createElement("template");
    mainTemplate.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: Arial, sans-serif;
                box-sizing: border-box;
            }
            .table-container {
                width: 100%;
                height: 100%;
                overflow: auto;
                padding: 15px;
                box-sizing: border-box;
                direction: ltr;
            }
            .table-container.rtl {
                direction: rtl;
            }
            .widget-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
                border: 1px solid #ddd;
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
            .number-cell {
                text-align: right;
            }
            .rtl .number-cell {
                text-align: left;
            }
            .no-data {
                text-align: center;
                padding: 20px;
                color: #666;
                border: 1px dashed #ccc;
                margin: 10px 0;
            }
        </style>
        <div class="table-container" id="container">
            <div class="widget-title" id="title">טבלה דינמית</div>
            <div id="no-data" class="no-data">
                אנא חבר מקור נתונים<br>Please connect data source
            </div>
            <table id="data-table" style="display: none;">
                <thead id="table-head"></thead>
                <tbody id="table-body"></tbody>
            </table>
        </div>
    `;

    // Builder template
    const builderTemplate = document.createElement("template");
    builderTemplate.innerHTML = `
        <style>
            .builder {
                font-family: Arial, sans-serif;
                padding: 15px;
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
                border-radius: 3px;
                box-sizing: border-box;
            }
            input[type="checkbox"] {
                margin-right: 5px;
            }
            button {
                background-color: #0070f3;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
        </style>
        <div class="builder">
            <div class="form-group">
                <label>כותרת הטבלה:</label>
                <input type="text" id="table-title" placeholder="הכנס כותרת">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="rtl-mode"> מצב RTL
                </label>
            </div>
            <button type="button" id="update-btn">עדכן</button>
        </div>
    `;

    // Main Widget Class
    class DynamicHebrewTable extends HTMLElement {
        constructor() {
            super();
            
            try {
                this._shadowRoot = this.attachShadow({mode: "open"});
                this._shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
                
                this._props = {
                    tableTitle: "טבלה דינמית",
                    rtlMode: true
                };
                
                console.log("DynamicHebrewTable constructed successfully");
            } catch (error) {
                console.error("Error in DynamicHebrewTable constructor:", error);
            }
        }

        connectedCallback() {
            try {
                console.log("DynamicHebrewTable connected");
                this._render();
            } catch (error) {
                console.error("Error in connectedCallback:", error);
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            try {
                if (changedProperties) {
                    Object.assign(this._props, changedProperties);
                }
            } catch (error) {
                console.error("Error in onCustomWidgetBeforeUpdate:", error);
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            try {
                this._render();
            } catch (error) {
                console.error("Error in onCustomWidgetAfterUpdate:", error);
            }
        }

        get tableTitle() {
            return this._props.tableTitle;
        }

        set tableTitle(value) {
            this._props.tableTitle = value;
            this._render();
        }

        get rtlMode() {
            return this._props.rtlMode;
        }

        set rtlMode(value) {
            this._props.rtlMode = !!value;
            this._render();
        }

        get myBinding() {
            try {
                return this.dataBindings && this.dataBindings.getDataBinding 
                    ? this.dataBindings.getDataBinding('myBinding') 
                    : null;
            } catch (error) {
                console.error("Error accessing data binding:", error);
                return null;
            }
        }

        _render() {
            try {
                const container = this._shadowRoot.getElementById('container');
                const title = this._shadowRoot.getElementById('title');
                const noData = this._shadowRoot.getElementById('no-data');
                const table = this._shadowRoot.getElementById('data-table');

                // Update title
                if (title) {
                    title.textContent = this._props.tableTitle || "טבלה דינמית";
                }

                // Apply RTL
                if (container) {
                    if (this._props.rtlMode) {
                        container.classList.add('rtl');
                    } else {
                        container.classList.remove('rtl');
                    }
                }

                // Check for data
                const dataBinding = this.myBinding;
                
                if (!dataBinding || !dataBinding.data || dataBinding.data.length === 0) {
                    noData.style.display = 'block';
                    table.style.display = 'none';
                    return;
                }

                noData.style.display = 'none';
                table.style.display = 'table';
                this._renderTable(dataBinding);

            } catch (error) {
                console.error("Error in _render:", error);
            }
        }

        _renderTable(dataBinding) {
            try {
                const tableHead = this._shadowRoot.getElementById('table-head');
                const tableBody = this._shadowRoot.getElementById('table-body');
                
                if (!dataBinding.metadata || !dataBinding.data) {
                    return;
                }

                const dimensions = dataBinding.metadata.dimensions || [];
                const measures = dataBinding.metadata.measures || [];
                const data = dataBinding.data;

                // Build header
                let headerHTML = '<tr>';
                dimensions.forEach(dim => {
                    headerHTML += `<th>${dim.description || dim.id}</th>`;
                });
                measures.forEach(measure => {
                    headerHTML += `<th>${measure.description || measure.id}</th>`;
                });
                headerHTML += '</tr>';
                tableHead.innerHTML = headerHTML;

                // Build body
                let bodyHTML = '';
                const maxRows = Math.min(50, data.length); // Limit to 50 rows for performance
                
                for (let i = 0; i < maxRows; i++) {
                    const row = data[i];
                    bodyHTML += '<tr>';
                    
                    // Dimensions
                    dimensions.forEach((dim, index) => {
                        const key = `dimensions_${index}`;
                        const value = row[key];
                        const displayValue = value ? (value.label || value.id || value.toString()) : '';
                        bodyHTML += `<td>${displayValue}</td>`;
                    });
                    
                    // Measures
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
                        
                        bodyHTML += `<td class="number-cell">${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                }

                tableBody.innerHTML = bodyHTML;

            } catch (error) {
                console.error("Error in _renderTable:", error);
                const tableBody = this._shadowRoot.getElementById('table-body');
                if (tableBody) {
                    tableBody.innerHTML = '<tr><td colspan="100%">Error rendering data</td></tr>';
                }
            }
        }
    }

    // Builder Class
    class DynamicHebrewTableBuilder extends HTMLElement {
        constructor() {
            super();
            
            try {
                this._shadowRoot = this.attachShadow({mode: "open"});
                this._shadowRoot.appendChild(builderTemplate.content.cloneNode(true));
                
                const updateBtn = this._shadowRoot.getElementById('update-btn');
                if (updateBtn) {
                    updateBtn.addEventListener('click', () => {
                        this._updateProperties();
                    });
                }
                
                console.log("DynamicHebrewTableBuilder constructed successfully");
            } catch (error) {
                console.error("Error in DynamicHebrewTableBuilder constructor:", error);
            }
        }

        _updateProperties() {
            try {
                const tableTitle = this._shadowRoot.getElementById('table-title').value;
                const rtlMode = this._shadowRoot.getElementById('rtl-mode').checked;
                
                const event = new CustomEvent("propertiesChanged", {
                    detail: {
                        properties: {
                            tableTitle: tableTitle,
                            rtlMode: rtlMode
                        }
                    }
                });
                
                this.dispatchEvent(event);
            } catch (error) {
                console.error("Error in _updateProperties:", error);
            }
        }

        get tableTitle() {
            const input = this._shadowRoot.getElementById('table-title');
            return input ? input.value : '';
        }

        set tableTitle(value) {
            const input = this._shadowRoot.getElementById('table-title');
            if (input) {
                input.value = value || '';
            }
        }

        get rtlMode() {
            const checkbox = this._shadowRoot.getElementById('rtl-mode');
            return checkbox ? checkbox.checked : false;
        }

        set rtlMode(value) {
            const checkbox = this._shadowRoot.getElementById('rtl-mode');
            if (checkbox) {
                checkbox.checked = !!value;
            }
        }
    }

    // Register components
    try {
        if (!customElements.get("dynamic-hebrew-table")) {
            customElements.define("dynamic-hebrew-table", DynamicHebrewTable);
            console.log("dynamic-hebrew-table registered successfully");
        }
        
        if (!customElements.get("dynamic-hebrew-table-builder")) {
            customElements.define("dynamic-hebrew-table-builder", DynamicHebrewTableBuilder);
            console.log("dynamic-hebrew-table-builder registered successfully");
        }
    } catch (error) {
        console.error("Error registering custom elements:", error);
    }

})();
