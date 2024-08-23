import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { LineChart, PieChart } from "@mui/x-charts";

const groupBy = (data, key) => {
  return data.reduce((result, item) => {
    const groupKey = item[key];

    // Skip invalid keys
    if (groupKey === "NaN-NaN" || isNaN(groupKey)) {
      return result;
    }

    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);

    return result;
  }, {});
};

const extractDateField = (item, dateField) => {
  const date = new Date(item[dateField]);
  return {
    month: `${date.getFullYear()}-${date.getMonth() + 1}`,
    year: date.getFullYear(),
    week: getWeekNumber(date),
  };
};

const convertDateToNumeric = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date.getTime() : 0;
};

const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

const PivotTable = ({ data, isLoading }) => {
  const [groupByKey, setGroupByKey] = useState("month");
  const [filter, setFilter] = useState("");

  if (isLoading) return <p>Loading...</p>;

  const dateField = "out_of_service_date";

  const transformedData = data.map((item) => ({
    ...item,
    ...extractDateField(item, dateField),
    numericDate: convertDateToNumeric(item[dateField]),
  }));

  const groupedData = groupBy(transformedData, groupByKey);
  const filteredGroupedData = Object.keys(groupedData)
    .filter((key) => key !== "NaN-NaN" || key !== "NAN")
    .filter((key) => (filter ? key === filter : true))
    .reduce((obj, key) => {
      obj[key] = groupedData[key];
      return obj;
    }, {});

    const chartData = Object.keys(filteredGroupedData).map((key) => {
      return {
        label: key,
        value: filteredGroupedData[key].reduce(
          (sum, item) => sum + item.numericDate,
          0
        ),
      };
    });

  return (
    <Box
      sx={{
        padding: "30px",
        margin: "0 30px",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={2}>
        {/* <Grid item xs={12} md={6}></Grid> */}
        {/* <Grid item xs={12} md={6}>
          <TextField
            label="Filter"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Grid> */}
        <Grid xs={12} md={12}>
          <Typography
            sx={{
              fontSize: "20px",
              textTransform: "uppercase",
              fontWeight: "600",
              textAlign: "start",
            }}
          >
            Out of Service Data
          </Typography>
        </Grid>
        <Grid
          xs={12}
          md={5}
          sx={{
            padding: "20px",
            paddingLeft: '0'
          }}
        >
          <Box
            sx={{
              height: "300px",
              background: "#f3f6f9",
              boxSizing: "border-box",
              padding: "20px",
            }}
          >
            <Typography>Out of Service Data</Typography>
            <PieChart
              series={[
                {
                  data: chartData,
                },
              ]}
              width={270}
              height={300}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={7}>
          <InputLabel
            sx={{
              textAlign: "start",
              fontSize: "14px",
              marginBottom: "3px",
            }}
          >
            Group By
          </InputLabel>
          <Select
            value={groupByKey}
            onChange={(e) => setGroupByKey(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              width: "200px",
              margin: "0",
              background: "#f3f6f9",
              display: "block",
              textAlign: 'start'
            }}
          >
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="week">Week</MenuItem>
          </Select>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "500px",
              overflow: "auto",
              marginTop: "30px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: "0",
                      background: "#f3f6f9",
                      zIndex: "1",
                    }}
                  >
                    {groupByKey}
                  </TableCell>
                  <TableCell
                    sx={{
                      position: "sticky",
                      top: "0",
                      background: "#f3f6f9",
                      zIndex: "1",
                    }}
                  >
                    Out of Service
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(filteredGroupedData).map((group, index) => (
                  <TableRow key={index}>
                    <TableCell>{group}</TableCell>
                    <TableCell>
                      {filteredGroupedData[group].reduce(
                        (sum, item) => sum + item.numericDate,
                        0
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PivotTable;
