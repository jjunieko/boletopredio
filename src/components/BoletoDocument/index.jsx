import React from 'react';
import { Box, Typography, Grid, styled } from '@mui/material';

const BoletoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff'
}));

const BoletoDocument = React.forwardRef(({ boleto }, ref) => {
  return (
    <BoletoContainer ref={ref}>
      <Typography variant="h4" align="center" gutterBottom>
        {boleto.unidade}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Dados do Imóvel</Typography>
          <Typography variant="body1">
            Bloco {boleto.bloco} - Apto {boleto.apartamento}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Morador</Typography>
          <Typography variant="body1">{boleto.nomeCompleto}</Typography>
          <Typography variant="body2">CPF: {boleto.cpf}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3">{boleto.valor}</Typography>
        <Typography variant="subtitle1">
          Vencimento: {new Date(boleto.vencimento).toLocaleDateString('pt-BR')}
        </Typography>
      </Box>

      <Box sx={{ mt: 4, borderTop: '1px dashed #ccc', pt: 2 }}>
        <Typography variant="caption" display="block" align="center">
          Este documento é uma representação digital do boleto
        </Typography>
      </Box>
    </BoletoContainer>
  );
});

export default BoletoDocument; 