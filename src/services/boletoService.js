const STORAGE_KEY = 'boletos';

export const boletoService = {
  getAllBoletos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  },

  getBoletoById(id) {
    const boletos = this.getAllBoletos();
    return boletos.find(boleto => boleto.id === id);
  },

  getBoletosByUser(user) {
    const boletos = this.getAllBoletos();
    return boletos.filter(boleto => 
      boleto.cpf === user.cpf || 
      (boleto.bloco === user.bloco && boleto.apartamento === user.apartamento)
    );
  },

  saveBoleto(boleto) {
    const boletos = this.getAllBoletos();
    const newBoleto = {
      ...boleto,
      id: Date.now().toString(), // Identificador único
      createdAt: new Date().toISOString()
    };
    
    const updatedBoletos = [...boletos, newBoleto];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoletos));
    return newBoleto;
  },

  deleteBoleto(id) {
    const boletos = this.getAllBoletos();
    const updatedBoletos = boletos.filter(boleto => boleto.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoletos));
  },

  updateBoleto(id, updatedBoleto) {
    const boletos = this.getAllBoletos();
    const index = boletos.findIndex(boleto => boleto.id === id);
    
    if (index === -1) {
      throw new Error('Boleto não encontrado');
    }

    const updatedBoletos = [...boletos];
    updatedBoletos[index] = {
      ...updatedBoletos[index],
      ...updatedBoleto,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBoletos));
    return updatedBoletos[index];
  }
}; 