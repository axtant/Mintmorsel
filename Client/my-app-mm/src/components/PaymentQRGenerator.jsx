
import QRCode from 'react-qr-code';

const PaymentQRGenerator = () => {

  const upiPaymentUrl = `tez://upi/pay?pa=merchant@upi&am=1000&tn=FoodOrder&cu=INR`;
  return (
    <div>

      <div className="mb-4 p-4 bg-gray-50 rounded">
        <QRCode
          value={upiPaymentUrl}
          size={256}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="H"
          className="mx-auto"
        />
      </div>

      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Scan with any UPI app (Paytm, Google Pay, PhonePe, etc.)
        </p>
      </div>
    </div>
  );
};

export default PaymentQRGenerator;
