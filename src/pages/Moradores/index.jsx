import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { boletoService } from '../../services/boletoService';

const Moradores = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [boletosMorador, setBoletosMorador] = useState([]);

  useEffect(() => {
    const loadBoletos = () => {
      const boletos = boletoService.getBoletosByUser(user);
      setBoletosMorador(boletos);
    };

    loadBoletos();
    
    // Atualiza quando houver mudanças no localStorage
    window.addEventListener('storage', loadBoletos);
    return () => window.removeEventListener('storage', loadBoletos);
  }, [user]);

  const handleBoletoClick = (boletoId) => {
    navigate(`/moradores/${boletoId}`);
  };

  return (
    <Container>
      {boletosMorador.length > 0 ? (
        <Grid container spacing={3}>
          {boletosMorador.map((boleto) => (
            <Grid item xs={12} md={6} lg={4} key={boleto.id}>
              <Card 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleBoletoClick(boleto.id)}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {boleto.unidade}
                  </Typography>
                  <Typography variant="body1">
                    Valor: {boleto.valor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vencimento: {new Date(boleto.vencimento).toLocaleDateString('pt-BR')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum boleto encontrado
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Moradores; 