import { createContext, useContext, useMemo, useState } from 'react';

const ReturnFlowContext = createContext(null);

/**
 * Holds the multi-step return/exchange state as the user moves across screens
 * (order → item → return|exchange → reason → photo/AI → refund method → receipt).
 * This is what lets the same backend flow drive several routes without losing
 * context. STUB — extend the shape as you build each step.
 */
const initialFlow = {
  orderId: null,
  selectedItem: null,
  flowType: null,        // 'return' | 'exchange'
  reason: null,
  photos: [],
  verificationResult: null,
  refundMethod: null,    // 'account' | 'store_credit'
  rmaId: null,
};

export function ReturnFlowProvider({ children }) {
  const [flow, setFlow] = useState(initialFlow);

  const value = useMemo(
    () => ({
      flow,
      updateFlow: (patch) => setFlow((prev) => ({ ...prev, ...patch })),
      resetFlow: () => setFlow(initialFlow),
    }),
    [flow]
  );

  return <ReturnFlowContext.Provider value={value}>{children}</ReturnFlowContext.Provider>;
}

export function useReturnFlow() {
  const ctx = useContext(ReturnFlowContext);
  if (!ctx) throw new Error('useReturnFlow must be used within a ReturnFlowProvider');
  return ctx;
}
