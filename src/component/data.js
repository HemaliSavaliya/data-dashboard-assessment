import { useQuery } from "react-query";
import * as XLSX from "xlsx";

const fetchSpreadsheetData = async () => {
  const spreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE/export?format=xlsx&gid=1874221723";
  const response = await fetch(spreadsheetUrl);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Add a limit of 100 rows
  const limitedData = jsonData.slice(0, 260);

  return limitedData;
};

export const GetSpreadSheetData = () => {
  return useQuery("spreadsheetData", fetchSpreadsheetData);
};
