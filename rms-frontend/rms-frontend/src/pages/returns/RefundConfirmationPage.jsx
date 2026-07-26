import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { PATHS } from '@/routes/paths';

export default function RefundConfirmationPage() {
  const nav = useNavigate();
  return (
    <FlowStage backTo={PATHS.RETURN_BANK_DETAILS}>
      <p className="msg msg--center">Refund will be processed within 3-5 working days after receiving the parcel</p>
      <div className="row-center"><Button size="lg" pill onClick={() => nav(PATHS.RECEIPT)}>CONTINUE</Button></div>
    </FlowStage>
  );
}
