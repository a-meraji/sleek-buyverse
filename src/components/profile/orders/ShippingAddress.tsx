interface ShippingAddressProps {
  address: any;
}

export const ShippingAddress = ({ address }: ShippingAddressProps) => {
  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Shipping Address</h4>
      <p className="text-sm text-gray-500">
        {address.street}<br />
        {address.city}, {address.state} {address.zipCode}
      </p>
    </div>
  );
};