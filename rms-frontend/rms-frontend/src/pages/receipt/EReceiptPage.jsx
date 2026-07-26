import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { PrinterIcon } from '@/components/common/Icons';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { returnService } from '@/services/returnService';
import { PATHS } from '@/routes/paths';

export default function EReceiptPage() {
  const nav = useNavigate();
  const { flow } = useReturnFlow();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!flow.rmaId) { nav(PATHS.HOME, { replace: true }); return; }
    returnService.getReceipt(flow.rmaId)
      .then(setReceipt)
      .catch((e) => setError(e?.response?.data?.error || 'Could not load the receipt.'));
  }, [flow.rmaId, nav]);

  return (
    <FlowStage backTo={PATHS.HOME}>
      <p className="rcpt__note">Attach this label to the parcel before shipping.</p>
      <div className="rcpt">
        <h3 className="rcpt__title">RMA GENERATED !</h3>
        {error ? <p className="rcpt__line" style={{ color: '#ff8a8a' }}>{error}</p> : null}
        {!receipt && !error ? <p className="rcpt__line">Loading…</p> : null}
        {receipt ? (
          <>
            <p className="rcpt__line">RMA  ID : {receipt.rmaId}</p>
            <p className="rcpt__line">Item : {receipt.productName}</p>
            <p className="rcpt__line">Type : {receipt.requestType}</p>
            <p className="rcpt__line">Phone Number : {receipt.phone}</p>
            <p className="rcpt__line">Issue Date : {receipt.issueDate}</p>
            <p className="rcpt__line">Receiver : {receipt.receiverName}</p>
            <p className="rcpt__line">Reciever Address : {receipt.receiverAddress}</p>
          </>
        ) : null}
      </div>
      <div className="row-center">
        <Button size="md" pill onClick={() => window.print()}><PrinterIcon style={{ width: 18, height: 18 }} /> Download PDF</Button>
      </div>
    </FlowStage>
  );
}
