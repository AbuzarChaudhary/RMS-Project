import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { returnService } from '@/services/returnService';
import { PATHS } from '@/routes/paths';

export default function BankDetailsPage() {
  const nav = useNavigate();
  const { flow } = useReturnFlow();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await returnService.submitBankDetails(flow.returnId, { bankName, accountNumber, beneficiaryName });
      nav(PATHS.RETURN_CONFIRMATION);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not save bank details.');
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.RETURN_REFUND_METHOD} title="Enter Banking Details" list>
      <Card className="bank-card">
        <form className="login-form" onSubmit={submit}>
          <Input label="Bank Name" id="bank" placeholder="Enter Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          <Input label="Account number" id="iban" placeholder="IBAN:1234-123456-234" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          <Input label="Beneficiary name" id="beneficiary" placeholder="xyz" value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} />
          {error ? <p role="alert" className="login-error">{error}</p> : null}
          <Button type="submit" size="lg" block disabled={busy}>{busy ? 'Submitting…' : 'Submit'}</Button>
        </form>
      </Card>
    </FlowStage>
  );
}
