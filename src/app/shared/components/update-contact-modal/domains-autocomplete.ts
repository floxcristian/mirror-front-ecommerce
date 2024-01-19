export const DOMAIN_AUTOCOMPLETE = [
  'gmail.com',
  'hotmail.com',
  'yahoo.com',
  'outlook.com',
];

export interface IDomainAutocomplete {
  value: string;
}

export const getDomainsToAutocomplete = (): IDomainAutocomplete[] => {
  return DOMAIN_AUTOCOMPLETE.map((item) => ({ value: item }));
};
