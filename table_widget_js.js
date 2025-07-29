(function() {
    let template = document.createElement("template");
    template.innerHTML = `
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
                direction: ltr;
            }
            .table-container.rtl {
                direction: rtl;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            th, td {
                border: 1px solid #e5e5e5;
                padding: 8px 12px;
                text-align: left;
                vertical-align: top;
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
                color: #6a6d70;
                font-style: italic;
            }
        </style>
        <div class="table-container" id="container">
            <div id="no-data" class="no-data">
                Please configure dimensions and measures in the Builder Panel.
            </div>
            <table id="data-table" style="display: none;">
                <thead id="table-head"></thead>
                <tbody id="table-body"></tbody>
            </table>
        </div>
    `;

    class RTLDynamicTable extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            
            // Initialize properties
            this._rtlMode = false;
        }

        // Required SAC lifecycle methods
        onCustomWidgetBeforeUpdate(changedProperties) {
            // Called before widget update
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            // Called after widget update
            this._render();
        }

        onCustomWidgetResize(width, height) {
            // Called when widget is resized
        }

        // Property getters and setters
        get rtlMode() {
            return this._rtlMode;
        }

        set rtlMode(value) {
            this._rtlMode = !!value;
            this._render();
        }

        // Data binding access
        get myBinding() {
            return this.dataBindings?.getDataBinding?.('myBinding');
        }

        _render() {
            const container = this._shadowRoot.querySelector('#container');
            const table = this._shadowRoot.querySelector('#data-table');
            const noDataDiv = this._shadowRoot.querySelector('#no-data');
            const tableHead = this._shadowRoot.querySelector('#table-head');
            const tableBody = this._shadowRoot.querySelector('#table-body');

            // Apply RTL mode
            if (this._rtlMode) {
                container.classList.add('rtl');
            } else {
                container.classList.remove('rtl');
            }

            // Check if we have data binding
            const dataBinding = this.myBinding;
            if (!dataBinding || !dataBinding.data || dataBinding.data.length === 0) {
                table.style.display = 'none';
                noDataDiv.style.display = 'block';
                return;
            }

            noDataDiv.style.display = 'none';
            table.style.display = 'table';

            try {
                // Get dimensions and measures from metadata
                const dimensions = dataBinding.metadata?.dimensions || [];
                const measures = dataBinding.metadata?.measures || [];

                // Build table header
                let headerHTML = '<tr>';
                
                dimensions.forEach(dim => {
                    headerHTML += `<th>${dim.description || dim.id}</th>`;
                });
                
                measures.forEach(measure => {
                    headerHTML += `<th>${measure.description || measure.id}</th>`;
                });
                
                headerHTML += '</tr>';
                tableHead.innerHTML = headerHTML;

                // Build table body
                let bodyHTML = '';
                
                dataBinding.data.forEach(row => {
                    bodyHTML += '<tr>';
                    
                    // Add dimension cells
                    dimensions.forEach((dim, index) => {
                        const key = `dimensions_${index}`;
                        const value = row[key] ? (row[key].label || row[key]) : '';
                        bodyHTML += `<td>${value}</td>`;
                    });
                    
                    // Add measure cells
                    measures.forEach((measure, index) => {
                        const key = `measures_${index}`;
                        const value = row[key];
                        let displayValue = '';
                        
                        if (value !== undefined && value !== null) {
                            if (typeof value === 'object') {
                                displayValue = value.formatted || value.raw || '';
                            } else {
                                displayValue = value;
                            }
                        }
                        
                        bodyHTML += `<td class="measure-cell">${displayValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                });
                
                tableBody.innerHTML = bodyHTML;

            } catch (error) {
                console.error('Error rendering table:', error);
                tableBody.innerHTML = '<tr><td colspan="100%">Error rendering data</td></tr>';
            }
        }
    }

    customElements.define("rtl-dynamic-table", RTLDynamicTable);
})();