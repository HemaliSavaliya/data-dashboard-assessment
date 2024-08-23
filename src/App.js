import React from "react";
import "./App.css";
import { GetSpreadSheetData } from "./component/data";
import PivotTable from "./component/PivotTable";
import TableView from "./component/TableView";

function App() {
  const { data, isLoading } = GetSpreadSheetData();
  return (
    <div className="App">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <React.Fragment>
          <TableView {...{ data, isLoading }} />
          <PivotTable {...{ data, isLoading }} />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
