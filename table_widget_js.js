(function() {
    let template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: var(--sapFontFamily, "72", Arial, Helvetica, sans-serif);
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
                font-size: var(--sapFontSize, 14px);
            }
            th, td {
                border: 1px solid var(--sapList_BorderColor, #e5e5e5);
                padding: 8px 12px;
                text-align: left;
                vertical-align: top;
            }
            .rtl th, .rtl td {
                text-align: right;
            }
            th {
                background-color: var(--sapList_HeaderBackground, #f7f7f7);
                font-weight: 600;
                color: var(--sapList_HeaderTextColor, #32363a);
            }
            tr:nth-child(even) {
                background-color: var(--sapList_AlternatingBackground, #fafafa);
            }
            tr:hover {
                background-color: var(--sapList_Hover_Background, #f0f0f0);
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
                color: var(--sapContent_ForegroundTextColor, #6a6d70);
                font-style: italic;
            }
        </style>
        <div class="table-container" id="container">
            <div id="no-data" class="no-data" style="display: none;">
                No data available. Please configure dimensions and measures.
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
            this._dataBinding = null;
            this._dimensions = [];
            this._measures = [];
            this._data = [];
        }

        // Property getters and setters
        get rtlMode() {
            return this._rtlMode;
        }

        set rtlMode(value) {
            this._rtlMode = value;
        }

        // Data binding methods
        getDataBinding() {
            return this._dataBinding;
        }

        setDataBinding(dataBinding) {
            this._dataBinding = dataBinding;
            if (dataBinding && dataBinding.data) {
                this.processData(dataBinding);
            }
        }

        processData(dataBinding) {
            try {
                // Extract dimensions and measures from data binding
                this._dimensions = [];
                this._measures = [];
                this._data = [];

                if (dataBinding.metadata) {
                    // Process dimensions
                    if (dataBinding.metadata.dimensions) {
                        this._dimensions = dataBinding.metadata.dimensions.map(dim => ({
                            id: dim.id,
                            description: dim.description || dim.id,
                            type: 'dimension'
                        }));
                    }

                    // Process measures  
                    if (dataBinding.metadata.measures) {
                        this._measures = dataBinding.metadata.measures.map(measure => ({
                            id: measure.id,
                            description: measure.description || measure.id,
                            type: 'measure',
                            formatString: measure.formatString
                        }));
                    }
                }

                // Process data rows
                if (dataBinding.data && Array.isArray(dataBinding.data)) {
                    this._data = dataBinding.data.map(row => {
                        const processedRow = {};
                        
                        // Add dimension values
                        this._dimensions.forEach(dim => {
                            processedRow[dim.id] = row[dim.id] ? row[dim.id].label || row[dim.id] : '';
                        });

                        // Add measure values
                        this._measures.forEach(measure => {
                            const value = row[measure.id];
                            if (value !== undefined && value !== null) {
                                processedRow[measure.id] = typeof value === 'object' ? 
                                    (value.raw !== undefined ? value.raw : value.formatted || value) : value;
                            } else {
                                processedRow[measure.id] = '';
                            }
                        });

                        return processedRow;
                    });
                }

                console.log('Processed data:', {
                    dimensions: this._dimensions,
                    measures: this._measures,
                    data: this._data
                });

            } catch (error) {
                console.error('Error processing data:', error);
                this._dimensions = [];
                this._measures = [];
                this._data = [];
            }
        }

        formatValue(value, formatString) {
            if (value === null || value === undefined || value === '') {
                return '';
            }
            
            // If it's a number and we have a format string, apply basic formatting
            if (typeof value === 'number' && formatString) {
                return new Intl.NumberFormat().format(value);
            }
            
            return value.toString();
        }

        // Lifecycle methods
        onCustomWidgetBeforeUpdate(oChangedProperties) {
            // Called before widget update
        }

        onCustomWidgetAfterUpdate(oChangedProperties) {
            this.redraw();
        }

        onCustomWidgetResize(width, height) {
            // Handle resize if needed
        }

        redraw() {
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

            // Check if we have data to display
            if (this._dimensions.length === 0 && this._measures.length === 0) {
                table.style.display = 'none';
                noDataDiv.style.display = 'block';
                return;
            }

            noDataDiv.style.display = 'none';
            table.style.display = 'table';

            // Build table header
            let headerHTML = '<tr>';
            
            // Add dimension headers
            this._dimensions.forEach(dim => {
                headerHTML += `<th>${dim.description}</th>`;
            });
            
            // Add measure headers
            this._measures.forEach(measure => {
                headerHTML += `<th>${measure.description}</th>`;
            });
            
            headerHTML += '</tr>';
            tableHead.innerHTML = headerHTML;

            // Build table body
            let bodyHTML = '';
            
            if (this._data.length === 0) {
                const colSpan = this._dimensions.length + this._measures.length;
                bodyHTML = `<tr><td colspan="${colSpan}" style="text-align: center; font-style: italic;">No data rows available</td></tr>`;
            } else {
                this._data.forEach(row => {
                    bodyHTML += '<tr>';
                    
                    // Add dimension cells
                    this._dimensions.forEach(dim => {
                        const value = row[dim.id] || '';
                        bodyHTML += `<td>${value}</td>`;
                    });
                    
                    // Add measure cells
                    this._measures.forEach(measure => {
                        const value = row[measure.id];
                        const formattedValue = this.formatValue(value, measure.formatString);
                        bodyHTML += `<td class="measure-cell">${formattedValue}</td>`;
                    });
                    
                    bodyHTML += '</tr>';
                });
            }
            
            tableBody.innerHTML = bodyHTML;
        }
    }

    customElements.define("rtl-dynamic-table", RTLDynamicTable);
})();