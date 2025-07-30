var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
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
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .container.rtl {
        direction: rtl;
      }
      .table-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #333;
        text-align: center;
      }
      .rtl .table-title {
        text-align: right;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        margin-top: 10px;
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
        position: sticky;
        top: 0;
        z-index: 1;
      }
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      tbody tr:hover {
        background-color: #e6f3ff;
      }
      .no-data {
        text-align: center;
        padding: 40px;
        color: #666;
        border: 2px dashed #ccc;
        margin-top: 20px;
        border-radius: 8px;
      }
      .loading {
        text-align: center;
        padding: 40px;
        color: #999;
      }
      .error {
        color: #d32f2f;
        background-color: #ffebee;
        padding: 15px;
        border-radius: 4px;
        border: 1px solid #f8bbd9;
        margin-top: 10px;
      }
    </style>
    <div id="root" class="container" style="width: 100%; height: 100%;">
      <div class="table-title" id="tableTitle">טבלה דינמית</div>
      <div id="content"></div>
    </div>
  `;

  class RTLDynamicTable extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");
      this._titleElement = this._shadowRoot.getElementById("tableTitle");
      this._contentElement = this._shadowRoot.getElementById("content");

      this._props = {
        width: 600,
        height: 420,
        tableTitle: "טבלה דינמית",
        rtlMode: true,
        dimensionFeed: [],
        measureFeed: []
      };

      this.render();
    }

    onCustomWidgetResize(width, height) {
      this._props.width = width;
      this._props.height = height;
      this.render();
    }

    // Properties getters and setters
    get tableTitle() {
      return this._props.tableTitle;
    }

    set tableTitle(value) {
      this._props.tableTitle = value || "טבלה דינמית";
      this._updateTitle();
    }

    get rtlMode() {
      return this._props.rtlMode;
    }

    set rtlMode(value) {
      this._props.rtlMode = !!value;
      this._updateRTL();
    }

    get width() {
      return this._props.width;
    }

    set width(value) {
      this._props.width = value;
    }

    get height() {
      return this._props.height;
    }

    set height(value) {
      this._props.height = value;
    }

    get dimensionFeed() {
      return this._props.dimensionFeed;
    }

    set dimensionFeed(value) {
      this._props.dimensionFeed = value || [];
    }

    get measureFeed() {
      return this._props.measureFeed;
    }

    set measureFeed(value) {
      this._props.measureFeed = value || [];
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    _updateTitle() {
      if (this._titleElement) {
        this._titleElement.textContent = this._props.tableTitle;
      }
    }

    _updateRTL() {
      if (this._root) {
        if (this._props.rtlMode) {
          this._root.classList.add('rtl');
        } else {
          this._root.classList.remove('rtl');
        }
      }
    }

    async render() {
      // Update title and RTL mode
      this._updateTitle();
      this._updateRTL();

      if (!this._myDataSource || this._myDataSource.state !== "success") {
        this._showNoData();
        return;
      }

      try {
        this._renderTable();
      } catch (error) {
        this._showError(error.message);
      }
    }

    _showNoData() {
      this._contentElement.innerHTML = `
        <div class="no-data">
          אנא חבר מקור נתונים<br>
          Please connect data source
        </div>
      `;
    }

    _showError(message) {
      this._contentElement.innerHTML = `
        <div class="error">
          שגיאה: ${message}<br>
          Error: ${message}
        </div>
      `;
    }

    _renderTable() {
      if (!this._myDataSource.metadata || !this._myDataSource.data) {
        this._showNoData();
        return;
      }

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values || [];
      const measures = this._myDataSource.metadata.feeds.measures.values || [];
      const data = this._myDataSource.data || [];

      if (dimensions.length === 0 && measures.length === 0) {
        this._showNoData();
        return;
      }

      // Build table HTML
      let tableHTML = '<table>';
      
      // Header
      tableHTML += '<thead><tr>';
      dimensions.forEach(dimension => {
        const label = dimension.description || dimension.label || dimension.id || 'Dimension';
        tableHTML += `<th>${this._escapeHtml(label)}</th>`;
      });
      measures.forEach(measure => {
        const label = measure.description || measure.label || measure.id || 'Measure';
        tableHTML += `<th>${this._escapeHtml(label)}</th>`;
      });
      tableHTML += '</tr></thead>';

      // Body
      tableHTML += '<tbody>';
      const maxRows = Math.min(100, data.length); // Limit for performance

      for (let i = 0; i < maxRows; i++) {
        const row = data[i];
        tableHTML += '<tr>';

        // Dimension values
        dimensions.forEach(dimension => {
          const value = row[dimension.id];
          let displayValue = '';
          
          if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
              displayValue = value.label || value.description || value.id || value.raw || '';
            } else {
              displayValue = value.toString();
            }
          }
          
          tableHTML += `<td>${this._escapeHtml(displayValue)}</td>`;
        });

        // Measure values
        measures.forEach(measure => {
          const value = row[measure.id];
          let displayValue = '';
          
          if (value !== undefined && value !== null) {
            if (typeof value === 'object') {
              displayValue = value.formatted || value.raw || '';
            } else {
              displayValue = value.toString();
            }
          }
          
          tableHTML += `<td>${this._escapeHtml(displayValue)}</td>`;
        });

        tableHTML += '</tr>';
      }

      tableHTML += '</tbody></table>';

      if (data.length > maxRows) {
        tableHTML += `<div style="text-align: center; margin-top: 10px; color: #666;">
          מציג ${maxRows} מתוך ${data.length} שורות | Showing ${maxRows} of ${data.length} rows
        </div>`;
      }

      this._contentElement.innerHTML = tableHTML;
    }

    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Methods for API compatibility
    getDimensions() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        return [];
      }
      return this._myDataSource.metadata.feeds.dimensions.values || [];
    }

    getMeasures() {
      if (!this._myDataSource || !this._myDataSource.metadata) {
        return [];
      }
      return this._myDataSource.metadata.feeds.measures.values || [];
    }

    getDimensionsOnFeed() {
      return this.getDimensions().map(d => d.id);
    }

    getMeasuresOnFeed() {
      return this.getMeasures().map(m => m.id);
    }

    getDataSource() {
      return this._myDataSource;
    }

    // Event methods
    fireOnResultChanged() {
      this.dispatchEvent(new CustomEvent('onResultChanged', {
        detail: {
          dataSource: this._myDataSource
        }
      }));
    }

    fireOnClick(rowData) {
      this.dispatchEvent(new CustomEvent('onClick', {
        detail: {
          data: rowData
        }
      }));
    }
  }

  customElements.define("minimal-dynamic-table", RTLDynamicTable);
})();
