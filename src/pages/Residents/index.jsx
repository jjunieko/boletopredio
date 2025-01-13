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
  Button,
  Chip
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { billService } from '../../services/billService';
import Loading from '../../components/Loading';

const Residents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userBills, setUserBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBills = async () => {
      try {
        setIsLoading(true);
        const bills = billService.getBillsByUser(user);
        setUserBills(bills);
      } catch (error) {
        console.error('Erro ao carregar boletos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBills();
    window.addEventListener('storage', loadBills);
    return () => window.removeEventListener('storage', loadBills);
  }, [user]);

  const handleBillClick = (billId) => {
    navigate(`/residents/${billId}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return <Loading message="Carregando seus boletos..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Meus Boletos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualize e baixe seus boletos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {userBills.map((bill) => (
          <Grid item xs={12} sm={6} md={4} key={bill.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {bill.building}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Bloco {bill.block} - Apto {bill.apartment}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, mb: 1, color: 'primary.dark' }}>
                  {formatCurrency(bill.value)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Vencimento: ${new Date(bill.dueDate).toLocaleDateString()}`}
                    color="default"
                    size="small"
                  />
                  {new Date(bill.dueDate) < new Date() && (
                    <Chip 
                      label="Vencido"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth
                  variant="contained"
                  onClick={() => handleBillClick(bill.id)}
                >
                  Visualizar Detalhes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {userBills.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 4,
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 1
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum boleto encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Você não possui boletos para visualização no momento
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Residents; 