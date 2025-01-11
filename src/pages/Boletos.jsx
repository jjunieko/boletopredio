import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActions,
  Container,
  Paper,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { boletoService } from '../services/boletoService';
import { validators } from '../utils/validators';

const Boletos = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [boletos, setBoletos] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingBoleto, setEditingBoleto] = useState(null);
  const [novoBoleto, setNovoBoleto] = useState({
    id: '',
    unidade: '',
    bloco: '',
    apartamento: '',
    complemento: '',
    nomeCompleto: '',
    sobrenome: '',
    valor: '',
    vencimento: '',
    cpf: '',
    telefone: ''
  });

  // Carrega boletos ao iniciar
  useEffect(() => {
    setBoletos(boletoService.getAllBoletos());
  }, []);

  const formatarMoeda = (valor) => {
    const numero = valor.replace(/\D/g, '');
    const valorFormatado = (Number(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return valorFormatado;
  };

  const handleValorChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    setNovoBoleto({
      ...novoBoleto,
      valor: formatarMoeda(valor)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplica formatação específica para CPF e telefone
    if (name === 'cpf') {
      formattedValue = validators.cpf.format(value);
    } else if (name === 'telefone') {
      formattedValue = validators.telefone.format(value);
    }

    setNovoBoleto({
      ...novoBoleto,
      [name]: formattedValue
    });

    // Limpa erro do campo se existir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações básicas de campos obrigatórios
    if (!novoBoleto.bloco.trim()) {
      newErrors.bloco = 'Bloco é obrigatório';
    }
    if (!novoBoleto.apartamento.trim()) {
      newErrors.apartamento = 'Apartamento é obrigatório';
    }
    if (!novoBoleto.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome é obrigatório';
    }
    if (!novoBoleto.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
    }

    // Validação de CPF
    if (!novoBoleto.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validators.cpf.validate(novoBoleto.cpf)) {
      newErrors.cpf = validators.cpf.message;
    }

    // Validação de telefone
    if (novoBoleto.telefone.trim() && !validators.telefone.validate(novoBoleto.telefone)) {
      newErrors.telefone = validators.telefone.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (boleto) => {
    setEditingBoleto(boleto);
    setNovoBoleto(boleto);
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingBoleto) {
        // Atualiza boleto existente
        const boletoAtualizado = boletoService.updateBoleto(editingBoleto.id, novoBoleto);
        setBoletos(boletos.map(b => b.id === editingBoleto.id ? boletoAtualizado : b));
      } else {
        // Cria novo boleto
        const boletoSalvo = boletoService.saveBoleto(novoBoleto);
        setBoletos([...boletos, boletoSalvo]);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar/atualizar boleto:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingBoleto(null);
    setErrors({});
    setNovoBoleto({
      id: '',
      unidade: '',
      bloco: '',
      apartamento: '',
      complemento: '',
      nomeCompleto: '',
      sobrenome: '',
      valor: '',
      vencimento: '',
      cpf: '',
      telefone: ''
    });
  };

  const handleDelete = (id) => {
    try {
      boletoService.deleteBoleto(id);
      setBoletos(boletos.filter(boleto => boleto.id !== id));
    } catch (error) {
      console.error('Erro ao deletar boleto:', error);
    }
  };

  // Função para verificar permissões
  const hasPermission = () => {
    return user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.SINDICO;
  };

  // Função para filtrar boletos baseado no usuário
  const getBoletosFiltrados = () => {
    if (user?.role === ROLES.SUPER_ADMIN) {
      return boletos; // Vê todos os boletos
    } else if (user?.role === ROLES.SINDICO) {
      return boletos.filter(boleto => boleto.condominio === user.condominio);
    } else {
      // Usuário comum só vê seus próprios boletos
      return boletos.filter(boleto => 
        boleto.cpf === user.cpf || 
        boleto.apartamento === user.apartamento
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: { xs: 3, sm: 4 }
      }}>
        <Typography variant="h4" component="h1">
          Boletos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          fullWidth={false}
          sx={{ 
            minWidth: { xs: '100%', sm: 'auto' }
          }}
        >
          Novo Boleto
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {boletos.map((boleto) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={boleto.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {boleto.unidade}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Bloco {boleto.bloco} - Apto {boleto.apartamento}
                </Typography>
                <Typography variant="h5" color="primary.dark" sx={{ my: 2 }}>
                  {boleto.valor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vencimento: {new Date(boleto.vencimento).toLocaleDateString('pt-BR')}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(boleto)}
                  fullWidth
                >
                  Editar
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(boleto.id)}
                  fullWidth
                >
                  Excluir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleCloseDialog}
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, sm: 3 },
            width: 'calc(100% - 32px)',
            maxWidth: { sm: '600px', md: '900px' }
          }
        }}
      >
        <DialogTitle>
          {editingBoleto ? 'Editar Boleto' : 'Novo Boleto'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
            <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
              Identificação do Condomínio/Empresa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Prédio/Empresa"
                  required
                  value={novoBoleto.unidade}
                  onChange={(e) => setNovoBoleto({...novoBoleto, unidade: e.target.value})}
                  error={!!errors.unidade}
                  helperText={errors.unidade}
                  placeholder="Ex: Edifício Solar, Condomínio Vista Verde"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mb: 2, mt: 3, fontWeight: 'bold' }}>
              Dados do Imóvel
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Bloco"
                  required
                  value={novoBoleto.bloco}
                  onChange={(e) => setNovoBoleto({...novoBoleto, bloco: e.target.value})}
                  error={!!errors.bloco}
                  helperText={errors.bloco}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Apartamento"
                  required
                  value={novoBoleto.apartamento}
                  onChange={(e) => setNovoBoleto({...novoBoleto, apartamento: e.target.value})}
                  error={!!errors.apartamento}
                  helperText={errors.apartamento}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={novoBoleto.complemento}
                  onChange={(e) => setNovoBoleto({...novoBoleto, complemento: e.target.value})}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mb: 2, mt: 3, fontWeight: 'bold' }}>
              Dados do Morador
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  required
                  value={novoBoleto.nomeCompleto}
                  onChange={(e) => setNovoBoleto({...novoBoleto, nomeCompleto: e.target.value})}
                  error={!!errors.nomeCompleto}
                  helperText={errors.nomeCompleto}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sobrenome"
                  value={novoBoleto.sobrenome}
                  onChange={(e) => setNovoBoleto({...novoBoleto, sobrenome: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  required
                  value={novoBoleto.cpf}
                  onChange={handleInputChange}
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={novoBoleto.telefone}
                  onChange={handleInputChange}
                  error={!!errors.telefone}
                  helperText={errors.telefone}
                  inputProps={{ maxLength: 15 }}
                  placeholder="(00) 00000-0000"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mb: 2, mt: 3, fontWeight: 'bold' }}>
              Dados do Boleto
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor"
                  required
                  value={novoBoleto.valor}
                  onChange={handleValorChange}
                  placeholder="R$ 0,00"
                  error={!!errors.valor}
                  helperText={errors.valor}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Vencimento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={novoBoleto.vencimento}
                  onChange={(e) => setNovoBoleto({...novoBoleto, vencimento: e.target.value})}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
          >
            {editingBoleto ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Boletos; 