const LANG = "pt-BR"
const CURRENCY = "BRL"

/**
 * Formats a numeric value into a currency string.
 * @param {number} value - The numeric value to be formatted.
 * @returns {string} The formatted currency string.
 */
function getFormattedCurrency(value: number): string {
  return Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export { getFormattedCurrency }
