import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    window.self = this;
    this.startup();
    this.state = {
      cells: window.cells
    };
  }

  weekDay = function(S) {
    return <span class="name"> {S} </span>;
  };

  Day = function(d, monthId, cellId) {
    return (
      <span
        className={"date" + d.event ? d.event : ""}
        data-toggle="modal"
        data-target="#myModal"
        data-
        onClick={() => {
          window.selectedUID = d.uid;
        }}
      >
        {d.content}
      </span>
    );
  };

  setState = function(state) {
    this.setState(state);
  };
  addEvent = function(event) {
    var uid = window.selectedUID;
    var eName = event.currentTarget.value;
    window.events[uid] = eName;
    window.localStorage.setItem("events", JSON.stringify(window.events));
    window.location.reload();
  };

  Main(cells) {
    //var cells = window.cells[window.selectedYear];
    var mains = [];
    for (var i = 0; i < cells.length; i++) {
      mains.push(this.Month(cells[i].content, cells[i].name, i));
    }

    return <div id="main">{mains}</div>;
  }

  Month(content, name) {
    var weekdays = [];
    for (var i = 0; i < this.weeksCells.length; i++) {
      weekdays.push(this.weekDay(this.weeksCells[i]));
    }
    var days = [];
    for (var j = 0; j < content.length; j++) {
      days.push(this.Day(content[j]));
    }

    return (
      <div class="month">
        <div class="monthname"> {name}</div>
        {weekdays}
        {days}
      </div>
    );
  }

  weeksCells = ["S", "M", "T", "W", "Th", "F", "Sa"];

  months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  createNewCells = function(year) {
    var returnval = [];
    for (var i = 0; i < this.months.length; i++) {
      var daysCells = [];

      for (var j = 0; j < 42; j++) {
        daysCells.push({
          cellId: j + 1,
          content: "",
          event: ""
        });
      }
      returnval.push({ name: this.months[i], year: year, content: daysCells });
    }
    return returnval;
  };

  updateCells() {
    this.setState({ cells: window.cells });
  }
  startup() {
    var d = new Date();

    window.cells = {};
    window.events = window.localStorage.getItem("events")
      ? JSON.parse(localStorage.getItem("events"))
      : {};

    window.selectedUID = null;
    window.currentYear = d.getFullYear();
    var path = parseInt(window.location.pathname.substring(1));

    window.selectedYear = path ? path : window.currentYear;

    var cy_1 = document.getElementById("CY-1");
    var cy1 = document.getElementById("CY1");
    var sy = document.getElementById("SY");
    var cy = document.getElementById("CY");

    cy_1.href = window.selectedYear - 1;
    cy_1.innerText = " < " + (window.selectedYear - 1);

    cy1.href = window.selectedYear + 1;
    cy1.innerText = " > " + (window.selectedYear + 1);

    var html = [];

    for (var i = window.currentYear - 100; i < window.currentYear + 100; i++) {
      html.push("<option>" + i + "</option>");
    }
    sy.innerHTML = html.join();
    sy.onchange = function() {
      window.location.href = "/" + this.value;
    };
    sy.value = window.selectedYear;

    cy.onclick = function() {
      window.location.href = "/" + window.currentYear;
    };

    this.daysCells(window.selectedYear);
  }
  redirect(value, event) {
    window.location.assign(
      value ? "/" + value : "/" + event.currentTarget.value
    );
  }

  populateData = function(year) {
    // populates the cells for the given year
    for (var i = 0; i < this.months.length; i++) {
      var d = new Date(year, i, 1);
      var startDay = d.getDay();
      var numberOfDays = 32 - new Date(year, i, 32).getDate();
      for (var j = 0; j < numberOfDays; j++) {
        window.cells[year][i].content[j + startDay].content = j + 1;
        window.cells[year][i].content[j + startDay].uid =
          year + "" + i + "" + j;
        window.cells[year][i].content[j + startDay].event =
          window.events[year + "" + i + "" + j];
      }
    }
    console.log("Populated new data");
    console.log(year, window.cells, window.uids);
  };

  daysCells = function(year) {
    year = parseInt(year);
    if (!window.cells[year]) {
      window.cells[year] = this.createNewCells(year);
      this.populateData(year);
      console.log("cells updated");
      console.log(window.cells);
    }
  };

  years = function() {
    var val = [];
    for (var i = 2018; i < 3018; i++) {
      val.push(<option>{i}</option>);
    }

    return val;
  };

  render() {
    return (
      <div className="App">
        {this.Main(this.state.cells[window.selectedYear])}

        <div
          class="modal fade"
          id="myModal"
          role="dialog"
          style={{ display: "none" }}
        >
          <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Add Event</h4>
                <button type="button" class="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div class="modal-body">
                <p>
                  {" "}
                  <b>Type of event: </b>
                  <select onChange={this.addEvent}>
                    <option value=""> None Selected..</option>
                    <option value="birthday">BirthDay</option>
                    <option value="holiday">Holiday</option>
                    <option value="busy">Busy</option>
                    <option value="aniversary">Aniversary</option>
                  </select>
                </p>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <i>
            <b>*events persist across sessions and are stored on browser </b>
          </i>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">Color</th>
                <th scope="col">Event type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  {" "}
                  <div
                    style={{
                      background: "pink",
                      width: "30px",
                      height: "30px"
                    }}
                  />
                </th>
                <td>BirthDay</td>
              </tr>
              <tr>
                <th scope="row">
                  {" "}
                  <div
                    style={{
                      background: "purple",
                      width: "30px",
                      height: "30px"
                    }}
                  />
                </th>
                <td>Holiday</td>
              </tr>
              <tr>
                <th scope="row">
                  {" "}
                  <div
                    style={{
                      background: "blue",
                      width: "30px",
                      height: "30px"
                    }}
                  />{" "}
                </th>
                <td>Aniversary</td>
              </tr>
              <tr>
                <th scope="row">
                  <div
                    style={{ background: "red", width: "30px", height: "30px" }}
                  />
                </th>
                <td>Busy</td>
              </tr>
            </tbody>
          </table>
        </footer>
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
rootElement.innerHTML = "";
ReactDOM.render(<App />, rootElement);
