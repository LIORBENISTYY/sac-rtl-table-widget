(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 8px;
        border: 1px solid #ccc;
        text-align: left;
      }
      thead {
        background-color: #f2f2f2;
      }
    </style>
    <div id="root">
      <h3 id="caption"></h3>
      <table id="data-table">
        <thead></thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  class TableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._table = this._shadowRoot.getElementById("data-table");
      this._thead = this._table.querySelector("thead");
      this._tbody = this._table.querySelector("tbody");
      this._caption = this._shadowRoot.getElementById("caption");
      this._myDataSource = null;
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    set caption(value) {
      this._caption.innerText = value || "";
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    render() {
      if (!this._myDataSource || this._myDataSource.state !== "success") {
        return;
      }

      const dim = this._myDataSource.metadata.feeds.dimensions.values;
      const meas = this._myDataSource.metadata.feeds.measures.values;
      const data = this._myDataSource.data;

      // Clear table
      this._thead.innerHTML = "";
      this._tbody.innerHTML = "";

      // Header
      const headerRow = document.createElement("tr");
      dim.concat(meas).forEach(id => {
        const th = document.createElement("th");
        th.textContent = id;
        headerRow.appendChild(th);
      });
      this._thead.appendChild(headerRow);

      // Rows
      data.forEach(row => {
        const tr = document.createElement("tr");
        dim.concat(meas).forEach(id => {
          const td = document.createElement("td");
          const cell = row[id];
          td.textContent = cell ? (cell.label || cell.raw || "") : "";
          tr.appendChild(td);
        });
        this._tbody.appendChild(tr);
      });
    }
  }

  customElements.define("github-sap-table-widget", TableWidget);
})();
