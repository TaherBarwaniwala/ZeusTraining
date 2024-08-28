class UpdateRow {
  constructor() {
    document.addEventListener("updateRows", (e) => this.updateRows(e));
  }

  /**
   *
   * @param {CustomEvent} e
   */
  updateRows(e) {
    let rows = e.detail.rows;
    let objs = [];
    for (let row of rows) {
      let obj = {};
      obj["Email"] = row.cells[1]?.text;
      obj["Name"] = row.cells[2]?.text;
      obj["Country"] = row.cells[3]?.text;
      obj["State"] = row.cells[4]?.text;
      obj["City"] = row.cells[5]?.text;
      obj["TelephoneNumber"] = row.cells[6]?.text;
      obj["AddressLine1"] = row.cells[7]?.text;
      obj["AddressLine2"] = row.cells[8]?.text;
      obj["DOB"] = row.cells[9]?.text;
      obj["FY2019_20"] = parseInt(row.cells[10]?.text);
      obj["FY2020_21"] = parseInt(row.cells[11]?.text);
      obj["FY2021_22"] = parseInt(row.cells[12]?.text);
      obj["FY2022_23"] = parseInt(row.cells[13]?.text);
      obj["FY2023_24"] = parseInt(row.cells[14]?.text);
      if (obj["Email"]) objs.push(obj);
    }

    fetch(`http://localhost:5081/api/UserDatas/BulkUpdate`, {
      method: "PUT",
      body: JSON.stringify(objs),
      headers: new Headers({ "content-type": "application/json" }),
    }).then((res) => console.log("Update Successfull"));
  }
}

export default UpdateRow;
