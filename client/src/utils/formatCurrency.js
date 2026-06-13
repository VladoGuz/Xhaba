/**
 * Formatea un número como moneda local de México (MXN)
 * @param {number|string} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada (e.g. $1,500.00 MXN)
 */
export const formatMXN = (amount) => {
  const number = Number(amount);
  if (isNaN(number)) return '$0.00 MXN';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(number) + ' MXN';
};
