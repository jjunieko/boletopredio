export const formatters = {
  currency: {
    format: (value) => {
      // Remove todos os caracteres não numéricos
      const number = value.replace(/\D/g, '');
      
      // Converte para centavos
      const cents = number.padStart(3, '0');
      const reais = cents.slice(0, -2);
      const centavos = cents.slice(-2);

      // Adiciona pontos para milhares
      const formattedReais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // Retorna no formato R$ X,XX
      return `R$ ${formattedReais || '0'},${centavos}`;
    },
    
    parse: (value) => {
      // Remove todos os caracteres não numéricos
      const number = value.replace(/\D/g, '');
      
      // Converte para formato decimal
      return number ? (parseInt(number) / 100).toFixed(2) : '0.00';
    },

    clean: (value) => {
      // Remove formatação e retorna apenas números
      return value.replace(/\D/g, '');
    }
  }
}; 