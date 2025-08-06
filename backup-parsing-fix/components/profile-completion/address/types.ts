export interface AddressFormValues {
  addressType: 'residential' | 'postal';
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}
