"use strict";

class PropertyList {
  constructor(element) {
    this.element = element;
    this.list = [];
  }

  setList(entities) {
    this.list = entities;
    this.update();
  }

  update() {
    this.element.empty();
    for (const entity of this.list) {
      let table = $(document.createElement("table"));
      this.element.append(table);
      let tbody = $(document.createElement("tbody"));
      table.append(tbody);
      for (const key in entity.props) {
        const val = entity.props[key];
        let row =  $(document.createElement("tr"));
        tbody.append(row);
        let keyCell = $(document.createElement("td"));
        row.append(keyCell);
        let valCell = $(document.createElement("td"));
        row.append(valCell);
        keyCell.html(key);
        valCell.html(val.toString());
      }
    }
  }
};