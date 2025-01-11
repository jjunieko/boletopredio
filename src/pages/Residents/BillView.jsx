import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { billService } from '../../services/billService';

const BillView = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const loadBill = () => {
      const foundBill = billService.getBillById(billId);
      if (foundBill) {
        setBill(foundBill);
      } else {
        navigate('/residents');
      }
    };

    loadBill();
  }, [billId, navigate]);

  if (!bill) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/residents')}
        >
          Back
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bill Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Building
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bill.building}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1" gutterBottom>
              Block {bill.block} - Apt {bill.apartment}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" color="primary" gutterBottom>
              Amount: {bill.value}
            </Typography>
            <Typography variant="body1">
              Due Date: {new Date(bill.dueDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BillView; 