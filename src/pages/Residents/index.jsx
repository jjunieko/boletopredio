import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { billService } from '../../services/billService';

const Residents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userBills, setUserBills] = useState([]);

  useEffect(() => {
    const loadBills = () => {
      const bills = billService.getBillsByUser(user);
      setUserBills(bills);
    };

    loadBills();
    window.addEventListener('storage', loadBills);
    return () => window.removeEventListener('storage', loadBills);
  }, [user]);

  const handleBillClick = (billId) => {
    navigate(`/residents/${billId}`);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bills
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and download your bills
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {userBills.map((bill) => (
          <Grid item xs={12} sm={6} md={4} key={bill.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {bill.building}
                </Typography>
                <Typography variant="body1">
                  Block {bill.block} - Apt {bill.apartment}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, color: 'primary.dark' }}>
                  {bill.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due Date: {new Date(bill.dueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => handleBillClick(bill.id)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {userBills.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No bills found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Residents; 