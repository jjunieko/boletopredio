import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={changeLanguage}
        size="small"
        sx={{ 
          backgroundColor: 'background.paper',
          '& .MuiSelect-select': {
            py: 1,
            pr: 4,
          },
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pt">Português</MenuItem>
        <MenuItem value="es">Español</MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSelector; 