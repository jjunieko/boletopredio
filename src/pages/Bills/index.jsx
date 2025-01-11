import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { billService } from '../../services/billService';
import { validators } from '../../utils/validators';

const Bills = () => {
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingBill, setEditingBill] = useState(null);
  const [newBill, setNewBill] = useState({
    id: '',
    building: '',
    block: '',
    apartment: '',
    complement: '',
    fullName: '',
    lastName: '',
    value: '',
    dueDate: '',
    document: '',
    phone: ''
  });

  useEffect(() => {
    setBills(billService.getAllBills());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply specific formatting for document and phone
    if (name === 'document') {
      formattedValue = validators.cpf.format(value);
    } else if (name === 'phone') {
      formattedValue = validators.telefone.format(value);
    }

    setNewBill(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!newBill.building.trim()) newErrors.building = 'Building is required';
    if (!newBill.block.trim()) newErrors.block = 'Block is required';
    if (!newBill.apartment.trim()) newErrors.apartment = 'Apartment is required';
    if (!newBill.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!newBill.value.trim()) newErrors.value = 'Value is required';
    if (!newBill.dueDate) newErrors.dueDate = 'Due date is required';

    // Document validation
    if (!newBill.document.trim()) {
      newErrors.document = 'Document is required';
    } else if (!validators.cpf.validate(newBill.document)) {
      newErrors.document = validators.cpf.message;
    }

    // Phone validation (optional but must be valid if provided)
    if (newBill.phone.trim() && !validators.telefone.validate(newBill.phone)) {
      newErrors.phone = validators.telefone.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingBill) {
        const updatedBill = billService.updateBill(editingBill.id, newBill);
        setBills(bills.map(b => b.id === editingBill.id ? updatedBill : b));
      } else {
        const savedBill = billService.saveBill(newBill);
        setBills([...bills, savedBill]);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving/updating bill:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingBill(null);
    setErrors({});
    setNewBill({
      id: '',
      building: '',
      block: '',
      apartment: '',
      complement: '',
      fullName: '',
      lastName: '',
      value: '',
      dueDate: '',
      document: '',
      phone: ''
    });
  };

  const handleDelete = (id) => {
    try {
      billService.deleteBill(id);
      setBills(bills.filter(bill => bill.id !== id));
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4">Bills</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          New Bill
        </Button>
      </Box>

      <Grid container spacing={3}>
        {bills.map((bill) => (
          <Grid item xs={12} sm={6} lg={4} key={bill.id}>
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
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setEditingBill(bill);
                    setNewBill(bill);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(bill.id)}
                >
                  Delete
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
      >
        <DialogTitle>
          {editingBill ? 'Edit Bill' : 'New Bill'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Building"
                  name="building"
                  value={newBill.building}
                  onChange={handleInputChange}
                  error={!!errors.building}
                  helperText={errors.building}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Block"
                  name="block"
                  value={newBill.block}
                  onChange={handleInputChange}
                  error={!!errors.block}
                  helperText={errors.block}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apartment"
                  name="apartment"
                  value={newBill.apartment}
                  onChange={handleInputChange}
                  error={!!errors.apartment}
                  helperText={errors.apartment}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Complement"
                  name="complement"
                  value={newBill.complement}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={newBill.fullName}
                  onChange={handleInputChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={newBill.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Value"
                  name="value"
                  value={newBill.value}
                  onChange={handleInputChange}
                  error={!!errors.value}
                  helperText={errors.value}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={newBill.dueDate}
                  onChange={handleInputChange}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Document"
                  name="document"
                  value={newBill.document}
                  onChange={handleInputChange}
                  error={!!errors.document}
                  helperText={errors.document}
                  required
                  inputProps={{
                    maxLength: 14
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newBill.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  inputProps={{
                    maxLength: 15
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingBill ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bills; 