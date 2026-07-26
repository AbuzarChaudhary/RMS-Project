import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import { CameraIcon } from '@/components/common/Icons';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { PATHS } from '@/routes/paths';

export default function DefectPhotoPage() {
  const nav = useNavigate();
  const { updateFlow } = useReturnFlow();
  const inputRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0] || null;
    updateFlow({ photoFile: file });
    nav(PATHS.RETURN_VERIFICATION);
  };

  return (
    <FlowStage backTo={PATHS.RETURN_REASON}>
      <button type="button" className="photo" onClick={() => inputRef.current?.click()}>
        <CameraIcon />
        <span className="photo__label">TAKE PHOTO</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onFile} />
    </FlowStage>
  );
}
