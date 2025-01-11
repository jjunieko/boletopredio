const STORAGE_KEY = 'bills';

export const billService = {
  getAllBills() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  },

  getBillById(id) {
    const bills = this.getAllBills();
    return bills.find(bill => bill.id === id);
  },

  getBillsByUser(user) {
    const bills = this.getAllBills();
    return bills.filter(bill => 
      bill.document === user.document || 
      (bill.block === user.block && bill.apartment === user.apartment)
    );
  },

  saveBill(bill) {
    const bills = this.getAllBills();
    const newBill = {
      ...bill,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedBills = [...bills, newBill];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));
    return newBill;
  },

  updateBill(id, updatedBill) {
    const bills = this.getAllBills();
    const index = bills.findIndex(bill => bill.id === id);
    
    if (index === -1) {
      throw new Error('Bill not found');
    }

    const updatedBills = [...bills];
    updatedBills[index] = {
      ...updatedBills[index],
      ...updatedBill,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));
    return updatedBills[index];
  },

  deleteBill(id) {
    const bills = this.getAllBills();
    const updatedBills = bills.filter(bill => bill.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));
  }
}; 