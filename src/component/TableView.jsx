// src/TableView.js
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  TextField,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { GetSpreadSheetData } from "./data";
import "./table.css";

const TableView = ({ data, isLoading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filters, setFilters] = useState({ entity_type: "" });

  const handleSorting = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangePerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const filteredData = useMemo(() => {
    if (isLoading || !data) return [];
    return data
      .filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
      .filter((item) =>
        filters.entity_type ? item.entity_type === filters.entity_type : true
      );
  }, [data, isLoading, search, filters, order]);

  const sortedData = useMemo(() => {
    if (!filteredData.length) return [];
    return filteredData.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    if (!sortedData.length) return [];
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage, order, orderBy]);

  const chartData = useMemo(() => {
    if (!filteredData.length) return [];
    const counts = filteredData.reduce((acc, item) => {
      const dateKey = item["out_of_service_date"];
      if (dateKey) {
        const month = new Date(dateKey).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.keys(counts).map((month) => counts[month]);
  }, [filteredData]);

  const chartXData = useMemo(() => {
    if (!filteredData.length) return [];
    const counts = filteredData.reduce((acc, item) => {
      const dateKey = item["out_of_service_date"];
      if (dateKey) {
        const month = new Date(dateKey).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.keys(counts).map((month) => month);
  }, [filteredData]);

  console.log(chartData);

  //   if (isLoading) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        padding: "30px",
        paddingBottom: "0",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <InputLabel
            sx={{
              textAlign: "start",
              fontSize: "14px",
              marginBottom: "3px",
            }}
          >
            Search
          </InputLabel>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={handleSearchChange}
            sx={{
              margin: "0",
              background: "#f3f6f9",
            }}
            className="input-main"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <InputLabel
            sx={{
              textAlign: "start",
              fontSize: "14px",
              marginBottom: "3px",
            }}
          >
            Entity Type
          </InputLabel>
          <Select
            name="entity_type"
            value={filters.entity_type}
            onChange={handleFilterChange}
            fullWidth
            variant="outlined"
            sx={{
              background: "#f3f6f9",
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="CARRIER">Carrier</MenuItem>
            <MenuItem value="SUPPLIER">Supplier</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "30px",
        }}
      >
        <Grid xs={12} md={12}>
          <Typography
            sx={{
              fontSize: "20px",
              textTransform: "uppercase",
              fontWeight: "600",
              textAlign: "start",
              marginBottom: "20px",
              paddingLeft: "20px",
            }}
          >
            Out of Service per Month
          </Typography>
        </Grid>
        <Grid
          xs={12}
          md={5}
          sx={{
            padding: "20px",
            paddingTop: "0",
          }}
        >
          <Box
            sx={{
              background: "#f3f6f9",
              boxSizing: "border-box",
              padding: "20px",
            }}
          >
            <BarChart
              width={510}
              height={300}
              series={[
                {
                  data: chartData,
                  label: "Out of Service per Month",
                },
              ]}
              xAxis={[{ data: chartXData, scaleType: "band" }]}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={7}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "500px",
              overflow: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(data?.[0] || {}).map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        position: "sticky",
                        top: "0",
                        background: "#f3f6f9",
                        zIndex: "1",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleSorting(key)}
                      >
                        {key}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangePerPage}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableView;
