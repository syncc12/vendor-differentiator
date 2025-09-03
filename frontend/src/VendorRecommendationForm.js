import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Typography, Box, MenuItem, Chip, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';

/**
 * VendorRecommendationForm collects user criteria and displays vendor recommendations in a table.
 * Handles form state, API submission, and result rendering.
 */

// Default form values for recommendations
const defaultForm = {
  budget: 2500,
  must_haves: { sso: true, hipaa: false, soc2: true, eu_residency: false, api: true },
  importance: { price: 5, performance: 4, integrations: 5, security: 4, support: 3, deployment: 2 },
  required_integrations: ["Salesforce", "Okta"],
  nice_integrations: ["Slack", "HubSpot"],
  team_size: 1200,
  deployment: "either",
  data_residency: "any"
};

// List of available integrations
const integrationsList = ["Salesforce", "Okta", "Slack", "HubSpot"];

export default function VendorRecommendationForm() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const formSpacing = { mb: 3 };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const handleMustHaveChange = (key, value) => {
    setForm({ ...form, must_haves: { ...form.must_haves, [key]: value } });
  };
  const handleImportanceChange = (key, value) => {
    setForm({ ...form, importance: { ...form.importance, [key]: value } });
  };
  const handleIntegrationsChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await axios.post(`${baseUrl}/api/recommend`, form);
      setResult(res.data);
    } catch (err) {
      setResult({ error: 'Error fetching recommendations.' });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h5" gutterBottom align="center">Vendor Recommendation Criteria</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <TextField
              label="Budget"
              type="number"
              value={form.budget}
              onChange={e => handleChange('budget', Number(e.target.value))}
              sx={{ width: 200, ...formSpacing }}
            />
            <TextField
              label="Team Size"
              type="number"
              value={form.team_size}
              onChange={e => handleChange('team_size', Number(e.target.value))}
              sx={{ width: 200, ...formSpacing }}
            />
            <TextField
              select
              label="Deployment"
              value={form.deployment}
              onChange={e => handleChange('deployment', e.target.value)}
              sx={{ width: 200, ...formSpacing }}
            >
              <MenuItem value="saas">SaaS</MenuItem>
              <MenuItem value="self_hosted">Self Hosted</MenuItem>
              <MenuItem value="either">Either</MenuItem>
            </TextField>
            <TextField
              select
              label="Data Residency"
              value={form.data_residency}
              onChange={e => handleChange('data_residency', e.target.value)}
              sx={{ width: 200, ...formSpacing }}
            >
              <MenuItem value="us">US</MenuItem>
              <MenuItem value="eu">EU</MenuItem>
              <MenuItem value="any">Any</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Typography variant="subtitle1">Must Haves</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.keys(form.must_haves).map(key => (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox checked={form.must_haves[key]} onChange={e => handleMustHaveChange(key, e.target.checked)} />}
                    label={key.toUpperCase()}
                    sx={{ ...formSpacing }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Typography variant="subtitle1">Importance (1-5)</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.keys(form.importance).map(key => (
                  <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    type="number"
                    value={form.importance[key]}
                    onChange={e => handleImportanceChange(key, Number(e.target.value))}
                    inputProps={{ min: 1, max: 5 }}
                    sx={{ width: 100, ...formSpacing }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <TextField
              select
              label="Required Integrations"
              SelectProps={{ multiple: true }}
              value={form.required_integrations}
              onChange={e => handleIntegrationsChange('required_integrations', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              sx={{ width: 300, ...formSpacing }}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => <Chip key={value} label={value} />)}
                </Box>
              )}
            >
              {integrationsList.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Nice Integrations"
              SelectProps={{ multiple: true }}
              value={form.nice_integrations}
              onChange={e => handleIntegrationsChange('nice_integrations', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              sx={{ width: 300, ...formSpacing }}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => <Chip key={value} label={value} />)}
                </Box>
              )}
            >
              {integrationsList.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 0, mb: 0 }}>Submit</Button>
          </Box>
        </form>
      </Box>
      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Recommendations</Typography>
          {result.error ? (
            <Typography color="error">{result.error}</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2, minWidth: 900 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 180 }}>Vendor</TableCell>
                    <TableCell sx={{ width: 100 }}>Score</TableCell>
                    <TableCell sx={{ width: 220 }}>Requirements</TableCell>
                    <TableCell sx={{ width: 400 }}>Explanation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((rec, idx) => {
                    const missing = rec.explanation.filter(ex => ex.toLowerCase().includes('missing'));
                    const meetsAll = missing.length === 0;
                    return (
                      <TableRow key={idx} sx={meetsAll ? { backgroundColor: '#e8f5e9' } : { backgroundColor: '#fff3e0' }}>
                        <TableCell>{rec.vendor}</TableCell>
                        <TableCell>{rec.score.toFixed(2)}</TableCell>
                        <TableCell>
                          {meetsAll ? <Chip label="Meets all requirements" color="success" /> : missing.map((m, i) => <Chip key={i} label={m} color="warning" sx={{ mr: 0.5 }} />)}
                        </TableCell>
                        <TableCell>
                          {rec.explanation.map((ex, i) => <div key={i}>{ex}</div>)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
}
