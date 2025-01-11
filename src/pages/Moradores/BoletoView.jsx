import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { boletoService } from '../../services/boletoService';
import BoletoDocument from '../../components/BoletoDocument';

const BoletoView = () => {
  const { boletoId } = useParams();
  const navigate = useNavigate();
  const [boleto, setBoleto] = useState(null);

  useEffect(() => {
    const loadBoleto = () => {
      const foundBoleto = boletoService.getBoletoById(boletoId);
      if (foundBoleto) {
        setBoleto(foundBoleto);
      } else {
        navigate('/moradores');
      }
    };

    loadBoleto();
  }, [boletoId, navigate]);

  if (!boleto) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/moradores')}
        >
          Voltar
        </Button>
      </Box>

      <Paper elevation={3}>
        <BoletoDocument boleto={boleto} />
      </Paper>
    </Container>
  );
};

export default BoletoView; 