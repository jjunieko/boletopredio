import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Apartment as ApartmentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const cards = [
    {
      title: 'Meus Boletos',
      icon: ReceiptIcon,
      description: 'Visualize e gerencie seus boletos',
      action: () => navigate('/residents'),
      color: '#2196f3'
    },
    {
      title: 'Meu Apartamento',
      icon: ApartmentIcon,
      description: `${user.building} - Bloco ${user.block}, Apto ${user.apartment}`,
      action: () => navigate('/profile'),
      color: '#4caf50'
    },
    {
      title: 'Meu Perfil',
      icon: PersonIcon,
      description: user.name,
      action: () => navigate('/profile'),
      color: '#ff9800'
    }
  ];

  if (user.role === 'MANAGER') {
    cards.unshift({
      title: 'Gerenciar Boletos',
      icon: ReceiptIcon,
      description: 'Criar e gerenciar boletos',
      action: () => navigate('/bills'),
      color: '#f44336'
    });
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {user.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user.role === 'MANAGER' ? 'Painel do Síndico' : 'Painel do Morador'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${card.color}15`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2
                    }}
                  >
                    <card.icon 
                      sx={{ 
                        fontSize: 40,
                        color: card.color
                      }}
                    />
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={card.action}
                  sx={{ color: card.color }}
                >
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 