import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building2, Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RazorpayPaymentProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'];
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'Freecharge'];

export function RazorpayPayment({ amount, customerName, customerEmail, customerPhone, onSuccess, onCancel }: RazorpayPaymentProps) {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const simulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const paymentId = `pay_demo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      onSuccess(paymentId);
    }, 2500);
  };

  const canPay = () => {
    switch (method) {
      case 'upi': return upiId.includes('@');
      case 'card': return cardNumber.length >= 16 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardName.length > 0;
      case 'netbanking': return selectedBank !== '';
      case 'wallet': return selectedWallet !== '';
    }
  };

  const methods: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: 'upi', label: 'UPI', icon: <Smartphone className="h-4 w-4" /> },
    { key: 'card', label: 'Card', icon: <CreditCard className="h-4 w-4" /> },
    { key: 'netbanking', label: 'Netbanking', icon: <Building2 className="h-4 w-4" /> },
    { key: 'wallet', label: 'Wallet', icon: <Wallet className="h-4 w-4" /> },
  ];

  if (processing) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 z-[100]" />
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Processing Payment</h3>
              <p className="text-sm text-gray-500 mt-1">Please do not close this window...</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
            </div>
            <p className="text-xs text-gray-400 mt-4">🔒 Sandbox Mode — No real charge</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[100]" onClick={onCancel} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-[#072654] text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Kavi Women's World</p>
                <p className="text-xs text-blue-200">{customerEmail}</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Amount */}
          <div className="bg-[#0b3a7d] text-white px-4 py-3 flex justify-between items-center">
            <span className="text-sm">Amount Payable</span>
            <span className="text-xl font-bold">₹{amount.toLocaleString()}</span>
          </div>

          {/* Sandbox badge */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
            <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">SANDBOX</span>
            <span className="text-xs text-amber-700">Test mode — no real payment will be processed</span>
          </div>

          <div className="flex">
            {/* Method tabs */}
            <div className="w-28 border-r border-gray-100 bg-gray-50 shrink-0">
              {methods.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`w-full px-3 py-3.5 text-left text-xs font-medium flex items-center gap-2 transition-colors ${
                    method === m.key ? 'bg-white text-blue-700 border-l-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>

            {/* Method content */}
            <div className="flex-1 p-4 min-h-[260px]">
              {method === 'upi' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-gray-800">Pay via UPI</h4>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Enter UPI ID</label>
                    <Input
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="text-sm"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">e.g. 9876543210@ybl, user@paytm</p>
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800">Card Details</h4>
                  <Input
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="Card Number"
                    className="text-sm font-mono"
                  />
                  <Input
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Name on Card"
                    className="text-sm"
                  />
                  <div className="flex gap-3">
                    <Input
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="MM/YY"
                      className="text-sm font-mono"
                    />
                    <Input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="CVV"
                      className="text-sm font-mono w-24"
                    />
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800">Select Bank</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {BANKS.map(bank => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`border rounded-lg p-3 text-xs font-medium text-left transition-colors ${
                          selectedBank === bank ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === 'wallet' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800">Select Wallet</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {WALLETS.map(w => (
                      <button
                        key={w}
                        onClick={() => setSelectedWallet(w)}
                        className={`border rounded-lg p-3 text-xs font-medium text-left transition-colors ${
                          selectedWallet === w ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={simulatePayment}
                disabled={!canPay()}
                className="w-full mt-6 bg-[#072654] hover:bg-[#0b3a7d] text-white h-11"
              >
                Pay ₹{amount.toLocaleString()}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-center gap-2 text-gray-400">
            <span className="text-[11px]">Secured by</span>
            <span className="text-[11px] font-bold text-gray-600">Razorpay</span>
            <span className="text-[11px]">🔒</span>
          </div>
        </div>
      </div>
    </>
  );
}
