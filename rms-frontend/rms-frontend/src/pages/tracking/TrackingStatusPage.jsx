import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import { TimerIcon, TruckIcon, CheckIcon, WarehouseIcon } from '@/components/common/Icons';
import { PATHS } from '@/routes/paths';

const ICONS = [TimerIcon, TruckIcon, CheckIcon, WarehouseIcon];

export default function TrackingStatusPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const tracking = state?.tracking;

  useEffect(() => { if (!tracking) nav(PATHS.TRACK, { replace: true }); }, [tracking, nav]);
  if (!tracking) return null;

  return (
    <FlowStage backTo={PATHS.TRACK} list>
      <h2 className="stage__heading">ORDER DETAILS :</h2>
      <div className="timeline">
        {tracking.timeline.map((step, i) => {
          const Icon = ICONS[i] || CheckIcon;
          return (
            <div className="tl__step" key={step.stage}>
              <span className={`tl__dot${step.done ? '' : ' tl__dot--pending'}`}><Icon /></span>
              <span className="tl__label">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div className="status__list">
        <p className="status__line">RMA ID : {tracking.rmaId}</p>
        <p className="status__line">Receiver Address : {tracking.receiverAddress}</p>
        <p className="status__line">Phone Number : {tracking.phone}</p>
        <p className="status__line">Order Status : <span className="status__badge">{tracking.orderStatus}</span></p>
      </div>
    </FlowStage>
  );
}
