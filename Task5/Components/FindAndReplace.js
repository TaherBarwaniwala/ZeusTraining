import Column from "./Column.js";
import Grid from "./Grid.js";
import Scrollbar from "./Scollbar.js";
class FindAndReplace {
  /**
   *
   * @param {Grid} grid
   */
  constructor(grid) {
    this.onDragBound = (e) => this.Ondrag(e);
    this.onDragEndBound = () => this.OndragEnd();
    this.OnRowClickBound = (e) => this.OnRowClick(e);
    this.onReplaceBound = (e) => this.onReplace(e);
    this.onReplaceAllBound = (e) => this.onReplaceAll(e);
    this.Scrollbar = new Scrollbar();
    this.grid = grid;
    this.findtarget = null;
    this.offset = 0;
  }

  createWindow() {
    let container = document.createElement("div");
    let header = document.createElement("div");
    let selector = document.createElement("div");

    this.AddDragingSupport(header);

    let findWindow = this.createContainer(this.createFindSubWindow());
    let findOption = this.createOption("Find");
    let replaceOption = this.createOption("replace");
    let replaceWindow = this.createContainer(this.craeteReplaceSubWindow());
    this.createSubWindowListner(
      findOption,
      replaceOption,
      findWindow,
      replaceWindow
    );
    this.createSubWindowListner(
      replaceOption,
      findOption,
      replaceWindow,
      findWindow
    );

    let cancelationButton = this.createCancel();

    selector.className = "selector";
    header.className = "dialogHeader";
    header.innerText = "Find & Replace";
    container.className = "dialogContainer";

    findOption.classList.add(["active"]);
    findWindow.classList.add(["active"]);

    selector.appendChild(findOption);
    selector.appendChild(replaceOption);
    container.appendChild(cancelationButton);
    container.appendChild(header);
    container.appendChild(selector);
    container.appendChild(findWindow);
    container.appendChild(replaceWindow);

    document.body.appendChild(container);
  }
  /**
   *
   * @param {HTMLElement | null} elem
   * @returns
   */
  createContainer(elem) {
    let findWindow = document.createElement("div");
    if (elem) findWindow.appendChild(elem);
    findWindow.className = "subWindow";
    return findWindow;
  }
  /**
   *
   * @param {string } elem
   * @returns
   */
  createOption(elem) {
    let findOption = document.createElement("div");
    findOption.innerHTML = elem;
    findOption.className = "selectorOption";
    return findOption;
  }

  createCancel() {
    let cancelationButton = document.createElement("div");
    cancelationButton.innerText = "X";
    cancelationButton.className = "cancellationButton";
    cancelationButton.addEventListener("pointerdown", () =>
      document.body.removeChild(cancelationButton.parentElement)
    );
    return cancelationButton;
  }

  /**
   *
   * @param {HTMLElement} activeoption
   * @param {*HTMLElement} passiveoption
   * @param {*HTMLElement} activewindow
   * @param {*HTMLElement} passivewindow
   */
  createSubWindowListner(
    activeoption,
    passiveoption,
    activewindow,
    passivewindow
  ) {
    activeoption.addEventListener("pointerdown", () => {
      activeoption.classList.add(["active"]);
      passiveoption.classList.remove(["active"]);
      activewindow.classList.add(["active"]);
      passivewindow.classList.remove(["active"]);
    });
  }

  createFindSubWindow() {
    let subwindow = document.createElement("div");
    subwindow.className = "findSubWindow";
    let textInput = this.createTextInput("Find");
    subwindow.appendChild(textInput);
    let findButton = this.createButton("Find", "find");
    findButton.addEventListener("click", () =>
      this.OnFind(textInput.getElementsByTagName("input"))
    );
    let findAllButton = this.createButton("FindAll", "");
    findAllButton.addEventListener("click", (e) =>
      this.OnFindAll(e, textInput.getElementsByTagName("input"))
    );
    let buttonConatiner = this.createButtonsContainer([
      findButton,
      findAllButton,
    ]);
    let tableContainer = document.createElement("div");
    tableContainer.className = "tableContainer";
    subwindow.appendChild(tableContainer);
    subwindow.appendChild(buttonConatiner);
    return subwindow;
  }

  craeteReplaceSubWindow() {
    let subwindow = document.createElement("div");
    subwindow.className = "replaceSubWindow";
    let findInput = this.createTextInput("Find");
    findInput.getElementsByTagName("input")[0].classList.add(["find_input"]);
    let replaceInput = this.createTextInput("Replace");
    replaceInput
      .getElementsByTagName("input")[0]
      .classList.add(["replace_input"]);
    subwindow.appendChild(findInput);
    subwindow.appendChild(replaceInput);
    let findButton = this.createButton("Find", "find");
    findButton.addEventListener("click", () =>
      this.OnFind(findInput.getElementsByTagName("input"))
    );
    let findAllButton = this.createButton("FindAll", "findAll");
    findAllButton.addEventListener("click", (e) =>
      this.OnFindAll(e, findInput.getElementsByTagName("input"))
    );
    let replaceButton = this.createButton("Replace", "");
    let replaceAllButton = this.createButton("ReplaceAll");

    let buttonConatiner = this.createButtonsContainer([
      findButton,
      findAllButton,
      replaceButton,
      replaceAllButton,
    ]);
    let tableContainer = document.createElement("div");
    tableContainer.className = "tableContainer";
    replaceButton.addEventListener("click", this.onReplaceBound);
    replaceAllButton.addEventListener("click", this.onReplaceAllBound);
    subwindow.appendChild(tableContainer);
    subwindow.appendChild(buttonConatiner);
    return subwindow;
  }

  /**
   *
   * @param {string} labelText
   */
  createTextInput(labelText, resetOffset = false) {
    let textInput = document.createElement("div");
    textInput.className = "textInputContainer";
    let label = document.createElement("div");
    label.className = "label";
    label.innerText = labelText;
    let inputBox = document.createElement("input");
    if (resetOffset) {
      inputBox.addEventListener("keydown", (e) => {
        this.OnType(e);
        this.offset = 0;
      });
    } else {
      inputBox.addEventListener("keydown", (e) => this.OnType(e));
    }
    inputBox.type = "text";
    inputBox.className = "inputBox";
    textInput.appendChild(label);
    textInput.appendChild(inputBox);
    return textInput;
  }

  /**
   *
   * @param {string} text
   * @param {string} className
   * @returns
   */

  createButton(text, className) {
    let button = document.createElement("button");
    button.className = className;
    button.innerText = text;
    return button;
  }
  /**
   *
   * @param {Array<HTMLButtonElement>} buttons
   */
  createButtonsContainer(buttons) {
    let btnContainer = document.createElement("div");
    for (let btn of buttons) btnContainer.appendChild(btn);
    btnContainer.className = "buttonContainer";
    return btnContainer;
  }
  /**
   *
   * @param {Array<Object>} results
   */
  createResultTable(results) {
    let resTable = document.createElement("div");
    resTable.className = "table";
    let header = document.createElement("div");
    header.className = "TableTitle";
    header.innerText = "Result Found (" + results.length + ")";
    resTable.appendChild(header);
    let table = document.createElement("table");
    let theader = document.createElement("tr");
    let theading1 = document.createElement("th");
    let theading2 = document.createElement("th");
    theading1.innerText = "Cell";
    theading2.innerText = "Value";
    theader.appendChild(theading1);
    theader.appendChild(theading2);
    table.appendChild(theader);
    let rows = this.createResultRows(results);
    for (let i = 0; i < rows.length; i++) {
      table.appendChild(rows[i]);
    }
    resTable.appendChild(table);
    return resTable;
  }

  /**
   *
   * @param {Array<Array>} results
   * @returns {Array<HTMLTableRowElement>}
   */
  createResultRows(results) {
    let output = [];
    for (let res of results) {
      let row = document.createElement("tr");
      let col1 = document.createElement("td");
      col1.innerText = res[0] + res[1];
      let col2 = document.createElement("td");
      col2.innerText = res[2];
      row.appendChild(col1);
      row.appendChild(col2);
      row.addEventListener("click", this.OnRowClickBound);
      row.res = res;
      output.push(row);
    }
    if (output.length > 0) {
      output[0].classList.add(["active"]);
      output[0].click();
    }
    return output;
  }

  /**
   *
   * @param {HTMLElement} elem
   */

  AddDragingSupport(elem) {
    elem.addEventListener("pointerdown", (e) => {
      this.X = e.target.parentElement.getBoundingClientRect().x;
      this.Y = e.target.parentElement.getBoundingClientRect().y;
      this.pointerX = e.clientX;
      this.pointerY = e.clientY;
      this.elem = e.target.parentElement;
      window.addEventListener("pointermove", this.onDragBound);
      window.addEventListener("pointerup", this.onDragEndBound);
      window.addEventListener("pointercancel", this.onDragEndBound);
    });
  }

  /**
   * @param {KeyboardEvent} e
   */
  OnType(e) {
    e.stopImmediatePropagation(); // Prevent other handlers from running
    e.preventDefault(); // Prevent the default action of the key press

    const target = e.target;
    const value = target.value;
    const key = e.key;

    // Handle special keys
    switch (key) {
      case "Backspace":
        // Handle backspace: remove the character before the cursor
        const startPos = target.selectionStart;
        target.value = value.slice(0, startPos - 1) + value.slice(startPos);
        target.selectionStart = target.selectionEnd = startPos - 1;
        break;
      case "Delete":
        // Handle delete: remove the character after the cursor
        const cursorPos = target.selectionStart;
        target.value = value.slice(0, cursorPos) + value.slice(cursorPos + 1);
        target.selectionStart = target.selectionEnd = cursorPos;
        break;
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown":
        // Arrow keys do not modify the input value, just move the cursor
        break;
      default:
        // Handle regular keys (including space)
        if (key.length === 1) {
          // Single character key
          const insertPos = target.selectionStart;
          target.value =
            value.slice(0, insertPos) + key + value.slice(insertPos);
          target.selectionStart = target.selectionEnd = insertPos + 1;
        }
        break;
    }
  }
  /**
   *
   * @param {PointerEvent} e
   */

  Ondrag(e) {
    let offsetX = e.clientX - this.pointerX;
    let offsetY = e.clientY - this.pointerY;
    this.elem.style.left = this.X + offsetX + "px";
    this.elem.style.top = this.Y + offsetY + "px";
    this.elem.style.cursor = "garbbing";
  }

  /**
   *
   * @param {PointerEvent} e
   */

  OndragEnd() {
    window.removeEventListener("pointermove", this.onDragBound);
    window.removeEventListener("pointerup", this.onDragEndBound);
    window.removeEventListener("pointercancel", this.onDragEndBound);
    this.elem.style.cursor = "default";
  }

  /**
   * @param {PointerEvent} e
   */
  OnRowClick(e) {
    let res = e.currentTarget.res;
    setTimeout(
      this.MoveToCell,
      0,
      res,
      this.grid,
      this.getScrollXY,
      this.Scrollbar
    );
    if (this.findtarget) this.findtarget.classList.remove(["active"]);
    this.findtarget = e.currentTarget;
    this.findtarget.classList.add(["active"]);
  }

  /**
   *
   * @param {HTMLElement} inp
   * @returns
   */
  async OnFind(inp) {
    try {
      if (!inp[0].value || inp[0].value === "") return;
      await fetch(
        `http://localhost:5081/api/UserDataCollection/Find/${inp[0].value}/${this.offset}/${this.grid.sort}`
      ).then(async (res) => {
        res = await res.json();
        res = res["data"];
        if (!res || res.length === 0) {
          if (this.offset === 0) {
            return;
          } else {
            this.offset = 0;
            console.log(inp);
            let el = inp[0].parentElement.parentElement;
            let findButton = el.getElementsByClassName("find")[0];
            findButton.click();
            return;
          }
        }
        let output = [];
        let val = Number.isNaN(inp[0].value)
          ? parseInt(inp[0].value)
          : inp[0].value.toLowerCase();
        console.log(res);
        for (let r of res) {
          let i = 0;
          for (let key in r) {
            if (
              (typeof r[key] === "number" && r[key] === val) ||
              (typeof r[key] !== "number" && r[key].toLowerCase().includes(val))
            ) {
              let temp = [];
              temp[0] = Column.getindex(i);
              temp[1] = r["rownum"];
              temp[2] = r[key];
              output.push(temp);
            }
            i++;
          }
        }
        let table = this.createResultTable(output);
        let container = inp[0].parentElement.parentElement;
        let tableContainer = container.getElementsByClassName("tableContainer");
        tableContainer[0].innerHTML = "";
        tableContainer[0].appendChild(table);
        tableContainer[0].style.display = "block";
        this.offset += 1;
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param {PointerEvent} e
   * @param {HTMLInputElement} inp
   */
  async OnFindAll(e, inp) {
    try {
      if (!inp[0].value || inp[0].value === "") return;
      await fetch(
        `http://localhost:5081/api/UserDataCollection/FindAll/${inp[0].value}/${this.grid.sort}`
      ).then(async (res) => {
        res = await res.json();
        res = res["data"];
        let output = [];
        let val = Number.isNaN(inp[0].value)
          ? parseInt(inp[0].value)
          : inp[0].value.toLowerCase();
        console.log(res);
        for (let r of res) {
          let i = 0;
          for (let key in r) {
            if (
              (typeof r[key] === "number" && r[key] === val) ||
              (typeof r[key] !== "number" && r[key].toLowerCase().includes(val))
            ) {
              let temp = [];
              temp[0] = Column.getindex(i);
              temp[1] = r["rownum"];
              temp[2] = r[key];
              output.push(temp);
            }
            i++;
          }
        }
        let table = this.createResultTable(output);
        let container = inp[0].parentElement.parentElement;
        let tableContainer = container.getElementsByClassName("tableContainer");
        tableContainer[0].innerHTML = "";
        tableContainer[0].appendChild(table);
        tableContainer[0].style.display = "block";
      });
    } catch (e) {
      console.error(e);
    }
  }

  async onReplace(e) {
    let parentElement = e.currentTarget.parentElement.parentElement;
    let findButton = parentElement.getElementsByClassName("find")[0];
    await findButton.click();
    if (this.findtarget) {
      await this.findtarget.click();
      let cell = this.updateCell(e);
      let updateRowEvent = new CustomEvent("updateRows", {
        detail: {
          rows: [cell.row],
        },
      });
      document.dispatchEvent(updateRowEvent);
      if (this.findtarget.nextSibling) {
        this.findtarget.classList.remove(["active"]);
        this.findtarget = this.findtarget.nextSibling;
        this.findtarget.classList.add(["active"]);
        this.findtarget.click();
      }
      this.grid.draw();
    }
  }

  async onReplaceAll(e) {
    let parentElement = e.target.parentElement.parentElement;
    let findvalue = parentElement.getElementsByClassName("find_input")[0].value;
    let replacevalue =
      parentElement.getElementsByClassName("replace_input")[0].value;
    if (findvalue === "" || replacevalue === "") return;
    let findAllButton = parentElement.getElementsByClassName("findAll")[0];
    await findAllButton.click();
    await fetch(
      `http://localhost:5081/api/UserDataCollection/ReplaceAll/${findvalue}/${replacevalue}`,
      {
        method: "PUT",
      }
    ).then(async (res) => {
      res = await res.json();
      console.log(res);
    });
    let rows = parentElement.getElementsByTagName("tr");
    // poping heading rows

    for (let row of rows) {
      if (
        row.getElementsByTagName("th") ||
        row.getElementsByTagName("th").length > 0
      )
        continue;
      this.findtarget = row;
      this.updateCell(e);
    }
    this.grid.draw();
  }
  /**
   *
   * @param {Array} res
   * @param {Grid} grid
   * @param {Function} getScrollXY
   * @param {Scrollbar} Scrollbar
   */

  async MoveToCell(res, grid, getScrollXY, Scrollbar) {
    let coordinates = getScrollXY(
      res[1],
      Column.getNumericalIndex(res[0]),
      grid
    );
    console.log(coordinates);
    Scrollbar.scrollToXY(...coordinates);
    setTimeout(
      () => {
        grid.reset();
        grid.activecell = grid.rows[res[1]].getCell(
          Column.getNumericalIndex(res[0])
        );
        grid.activerow = res[1].toString();
        grid.activecol = Column.getNumericalIndex(res[0]);
        grid.activecell.isFocus = true;
        grid.draw();
      },
      500,
      grid,
      res
    );
  }

  /**
   *
   * @param {Number} rowIndex
   * @param {Number} columnIndex
   * @param {Grid} grid
   */
  getScrollXY(rowIndex, columnIndex, grid) {
    let X = 0;
    let Y = 0;
    if (grid.rows.hasOwnProperty(rowIndex.toString())) {
      Y = grid.rows[rowIndex].y;
    } else {
      let rowKeys = Object.keys(grid.rows).map((e) => parseInt(e));
      let closestIndex = rowKeys.pop();
      for (let rowi of rowKeys) {
        if (Math.abs(closestIndex - rowIndex) > Math.abs(rowi - rowIndex)) {
          closestIndex = rowi;
        }
      }
      if (closestIndex < rowIndex) {
        Y =
          grid.rows[closestIndex.toString()].y +
          (rowIndex - closestIndex - 1) * grid.cellHeight;
      } else {
        Y =
          grid.rows[closestIndex.toString()].y +
          grid.rows[closestIndex.toString()].cellHeight -
          (closestIndex - rowIndex - 1) * grid.cellHeight;
      }
    }
    if (grid.columns.hasOwnProperty(columnIndex.toString())) {
      X = grid.columns[columnIndex].x;
    } else {
      let colKeys = Object.keys(grid.columns).map((e) => parseInt(e));
      let closestcol = colKeys.pop();
      for (let coli of colKeys) {
        if (Math.abs(closestcol - columnIndex) > Math.abs(coli - columnIndex)) {
          closestcol = coli;
        }
      }
      if (closestcol < columnIndex) {
        X =
          grid.columns[closestcol.toString()].x +
          (columnIndex - closestcol - 1) * grid.cellWidth;
      } else {
        X =
          grid.columns[closestcol.toString()].x +
          grid.columns[closestcol.toString()].cellWidth -
          (closestcol - columnIndex - 1) * grid.cellWidth;
      }
    }
    return [X, Y];
  }
  /**
   * @param {Number} rowindex
   * @param {Number} columnindex
   */
  getCell(rowindex, columnindex) {
    return this.grid.rows[rowindex].getCell(columnindex);
  }

  updateCell(e) {
    let res = this.findtarget.res;
    let cell = this.getCell(res[1], Column.getNumericalIndex(res[0]));
    let replaceText =
      e.target.parentElement.parentElement.getElementsByClassName(
        "replace_input"
      )[0].value;
    let find = new RegExp(
      e.target.parentElement.parentElement.getElementsByClassName(
        "find_input"
      )[0].value,
      "ig"
    );
    cell.text = cell.text.replace(find, replaceText);
    return cell;
  }
}

export default FindAndReplace;
