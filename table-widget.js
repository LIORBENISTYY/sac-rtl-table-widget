var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
          <style>
            .table-container {
              width: 100%;
              height: 100%;
              overflow: auto;
              font-family: Arial, sans-serif;
            }
            .custom-table {
              width: 100%;
              border-collapse: collapse;
              background-color: white;
            }
            .custom-table th {
              background-color: #f5f5f5;
              border: 1px solid #ddd;
              padding: 12px 8px;
              text-align: left;
              font-weight: bold;
              color: #333;
              position: sticky;
              top: 0;
              z-index: 10;
            }
            .custom-table td {
              border: 1px solid #ddd;
              padding: 8px;
              color: #333;
            }
            .custom-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .custom-table tr:hover {
              background-color: #f0f8ff;
            }
            .number-cell {
              text-align: right;
            }
            .table-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
            }
          </style>
          <div id="root" style="width: 100%; height: 100%;">
            <div class="table-container">
              <div class="table-title" id="tableTitle"></div>
              <table class="custom-table" id="dataTable">
                <thead id="tableHeader"></thead>
                <tbody id="tableBody"></tbody>
              </table>
            </div>
          </div>
        `;
  class TableWidgetPrepped extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");
      this._tableTitle = this._shadowRoot.getElementById("tableTitle");
      this._tableHeader = this._shadowRoot.getElementById("tableHeader");
      this._tableBody = this._shadowRoot.getElementById("tableBody");

      this._props = {};
      this._caption = "";

      this.render();
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    get caption() {
      return this._caption;
    }

    set caption(value) {
      this._caption = value;
      this.render();
    }

    async render() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        this._tableBody.innerHTML = "<tr><td colspan='100%'>No data available</td></tr>";
        return;
      }

      // Update title
      this._tableTitle.textContent = this._caption || "Data Table";

      const dimensions = this._myDataSource.metadata.feeds.dimensions.values;
      const measures = this._myDataSource.metadata.feeds.measures.values;
      
      // Build header
      let headerHTML = "<tr>";
      dimensions.forEach(dim => {
        headerHTML += `<th>${dim.description || dim.id}</th>`;
      });
      measures.forEach(measure => {
        headerHTML += `<th class="number-cell">${measure.description || measure.id}</th>`;
      });
      headerHTML += "</tr>";
      this._tableHeader.innerHTML = headerHTML;

      // Build body
      let bodyHTML = "";
      this._myDataSource.data.forEach(row => {
        bodyHTML += "<tr>";
        
        // Add dimension values
        dimensions.forEach(dim => {
          const value = row[dim.id] ? row[dim.id].label || row[dim.id].raw : "";
          bodyHTML += `<td>${value}</td>`;
        });
        
        // Add measure values
        measures.forEach(measure => {
          const value = row[measure.id] ? this.formatNumber(row[measure.id].raw) : "";
          bodyHTML += `<td class="number-cell">${value}</td>`;
        });
        
        bodyHTML += "</tr>";
      });
      
      this._tableBody.innerHTML = bodyHTML;
    }

    formatNumber(value) {
      if (value === null || value === undefined || value === "") {
        return "";
      }
      
      if (typeof value === "number") {
        return value.toLocaleString();
      }
      
      return value.toString();
    }
  }

  customElements.define("github-sap-table-widget", TableWidgetPrepped);
})();
