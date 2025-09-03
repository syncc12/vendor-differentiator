import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, TextField, Button, TableSortLabel, Typography, FormControlLabel
} from '@mui/material';

/**
 * Compare two values for sorting in descending order.
 */
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}


// Table columns for vendor data
const allColumns = [
  { id: 'name', label: 'Name', always: true },
  { id: 'price_monthly', label: 'Monthly Price ($)', always: false },
  { id: 'perf_latency_ms', label: 'Latency (ms)', always: false },
  { id: 'perf_uptime_pct', label: 'Uptime (%)', always: false },
  { id: 'integrations', label: 'Integrations', always: false },
  { id: 'has_sso', label: 'SSO', always: false },
  { id: 'hipaa', label: 'HIPAA', always: false },
  { id: 'soc2', label: 'SOC2', always: false },
  { id: 'iso27001', label: 'ISO 27001', always: false },
  { id: 'data_residency', label: 'Data Residency', always: false },
  { id: 'deployment_options', label: 'Deployment', always: false },
  { id: 'support_tier', label: 'Support Tier', always: false },
  { id: 'api', label: 'API', always: false },
];


/**
 * VendorTable displays all vendors in a sortable, filterable table with comparison support.
 */
export default function VendorTable() {
  const [vendors, setVendors] = useState([]);
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);

  // Fetch vendor data from backend API
  useEffect(() => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    axios.get(`${baseUrl}/api/vendors`)
      .then(res => setVendors(res.data))
      .catch(() => setVendors([]));
  }, []);

  // Handlers for filtering, sorting, and selection
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelect = (id) => {
    setSelected(selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id]);
  };
  // ...existing code...

  // Filter, sort, and compare logic
  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = stableSort(filtered, getComparator(order, orderBy));
  const compared = vendors.filter(v => selected.includes(v.id));

  // Render vendor table
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Technology Vendors</Typography>
      <TextField label="Filter by name" value={filter} onChange={handleFilterChange} sx={{ mb: 2 }} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {allColumns.map(col => (
                <TableCell key={col.id}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map(v => (
              <TableRow key={v.id}>
                <TableCell>
                  <Checkbox checked={selected.includes(v.id)} onChange={() => handleSelect(v.id)} />
                </TableCell>
                {allColumns.map(col => (
                  <TableCell key={col.id}>
                    {Array.isArray(v[col.id]) ? v[col.id].join(', ') : typeof v[col.id] === 'boolean' ? (v[col.id] ? 'Yes' : 'No') : v[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" sx={{ mt: 2 }} disabled={selected.length < 2} onClick={() => {}}>
        Compare Selected Vendors
      </Button>
      {selected.length >= 2 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6">Comparison</Typography>
          <Table>
            <TableHead>
              <TableRow>
                {allColumns.map(col => (
                  <TableCell key={col.id}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {compared.map(v => (
                <TableRow key={v.id}>
                  {allColumns.map(col => (
                    <TableCell key={col.id}>
                      {Array.isArray(v[col.id]) ? v[col.id].join(', ') : typeof v[col.id] === 'boolean' ? (v[col.id] ? 'Yes' : 'No') : v[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Paper>
  );
}
