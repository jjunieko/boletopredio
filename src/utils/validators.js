export const validators = {
  // Validador de CPF
  cpf: {
    format: (value) => {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      
      // Aplica a máscara de CPF (xxx.xxx.xxx-xx)
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    },

    validate: (cpf) => {
      // Remove caracteres não numéricos
      cpf = cpf.replace(/\D/g, '');

      if (cpf.length !== 11) return false;

      // Verifica CPFs com dígitos repetidos
      if (/^(\d)\1{10}$/.test(cpf)) return false;

      // Validação do primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let digit = 11 - (sum % 11);
      if (digit > 9) digit = 0;
      if (digit !== parseInt(cpf.charAt(9))) return false;

      // Validação do segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      digit = 11 - (sum % 11);
      if (digit > 9) digit = 0;
      if (digit !== parseInt(cpf.charAt(10))) return false;

      return true;
    },

    message: 'CPF inválido'
  },

  // Validador de telefone
  telefone: {
    format: (value) => {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      
      // Aplica máscara conforme quantidade de dígitos
      if (numbers.length === 11) {
        // Celular com DDD (xx) xxxxx-xxxx
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
      } else if (numbers.length === 10) {
        // Telefone fixo com DDD (xx) xxxx-xxxx
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
      }
      return numbers;
    },

    validate: (telefone) => {
      // Remove caracteres não numéricos
      const numbers = telefone.replace(/\D/g, '');
      
      // Verifica se tem 10 (fixo) ou 11 (celular) dígitos
      return numbers.length === 10 || numbers.length === 11;
    },

    message: 'Telefone inválido'
  }
}; 