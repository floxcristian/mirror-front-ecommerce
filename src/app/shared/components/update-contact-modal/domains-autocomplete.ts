export const DOMAIN_AUTOCOMPLETE = [
  'gmail.com',
  'hotmail.com',
  'yahoo.com',
  'outlook.com',
];

export const getDomainsToAutocomplete = () => {
  return DOMAIN_AUTOCOMPLETE.map((item) => ({ value: item }));
};
