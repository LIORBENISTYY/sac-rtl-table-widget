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
        </style>
        <div class="table-container" id="table-container">
            <div class="widget-title" id="widget-title">טבלת דמו סטטית</div>
            <table>
                <thead>
                    <tr>
                        <th>מוצר</th>
                        <th>קטגוריה</th>
                        <th>מכירות</th>
                        <th>רווח</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <tr>
                        <td>אייפון 15</td>
                        <td>אלקטרוניקה</td>
                        <td class="number-cell">₪4,500</td>
                        <td class="number-cell">₪1,200</td>
                    </tr>
                    <tr>
                        <td>מקבוק פרו</td>
                        <td>אלקטרוניקה</td>
                        <td class="number-cell">₪9,500</td>
                        <td class="number-cell">₪2,000</td>
                    </tr>
                    <tr>
                        <td>כיסא משרדי</td>
                        <td>רהיטים</td>
                        <td class="number-cell">₪1,300</td>
                        <td class="number-cell">₪400</td>
                    </tr>
                    <tr>
                        <td>מנורת שולחן</td>
                        <td>רהיטים</td>
                        <td class="number-cell">₪350</td>
                        <td class="number-cell">₪100</td>
                    </tr>
                    <tr>
                        <td>ספל קפה</td>
                        <td>מטבח</td>
                        <td class="number-cell">₪60</td>
                        <td class="number-cell">₪30</td>
                    </tr>
                </tbody>
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
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #32363a;
            }
            input[type="text"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
            }
            input[type="submit"] {
                background-color: #0070f3;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            input[type="submit"]:hover {
                background-color: #0051cc;
            }
        </style>
        <div class="builder-container">
            <form id="properties-form">
                <div class="form-group">
                    <label for="table-title">כותרת הטבלה:</label>
                    <input type="text" id="table-title" placeholder="הכנס כותרת לטבלה">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="rtl-mode"> מצב עברית (RTL)
                    </label>
                </div>
                <input type="submit" value="עדכן הגדרות">
            </form>
        </div>
    `;

    // Main Widget Component
    class StaticTable extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(mainTemplate.content.cloneNode(true));
            
            // Default properties
            this._props = {
                tableTitle: "טבלת דמו סטטית",
                rtlMode: true
            };
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

        // Property getters and setters
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

        _render() {
            const titleElement = this._shadowRoot.querySelector('#widget-title');
            const containerElement = this._shadowRoot.querySelector('#table-container');
            
            if (titleElement) {
                titleElement.textContent = this._props.tableTitle || "טבלת דמו סטטית";
            }
            
            if (containerElement) {
                if (this._props.rtlMode) {
                    containerElement.classList.add('rtl');
                } else {
                    containerElement.classList.remove('rtl');
                }
            }
        }
    }

    // Builder Component
    class StaticTableBuilder extends HTMLElement {
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
            const tableTitle = this._shadowRoot.querySelector('#table-title').value;
            const rtlMode = this._shadowRoot.querySelector('#rtl-mode').checked;
            
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        tableTitle: tableTitle,
                        rtlMode: rtlMode
                    }
                }
            }));
        }

        // Property getters and setters
        get tableTitle() {
            return this._shadowRoot.querySelector('#table-title').value;
        }

        set tableTitle(value) {
            this._shadowRoot.querySelector('#table-title').value = value || "";
        }

        get rtlMode() {
            return this._shadowRoot.querySelector('#rtl-mode').checked;
        }

        set rtlMode(value) {
            this._shadowRoot.querySelector('#rtl-mode').checked = !!value;
        }
    }

    // Register both components
    customElements.define("static-table", StaticTable);
    customElements.define("static-table-builder", StaticTableBuilder);
})();
