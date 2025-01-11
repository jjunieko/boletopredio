import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Chip
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/residents')}
        >
          Voltar
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Detalhes do Boleto
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Edifício
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bill.building}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Localização
            </Typography>
            <Typography variant="body1" gutterBottom>
              Bloco {bill.block} - Apto {bill.apartment}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" color="primary" gutterBottom>
              {formatCurrency(bill.value)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Vencimento: ${new Date(bill.dueDate).toLocaleDateString()}`}
                color="default"
              />
              {new Date(bill.dueDate) < new Date() && (
                <Chip 
                  label="Vencido"
                  color="error"
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Baixar Boleto
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BillView; 