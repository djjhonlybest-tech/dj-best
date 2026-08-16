import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

export type PlanType = 'free' | 'pro' | 'elite';

interface ProContextValue {
  isPro: boolean;
  plan: PlanType;
  upgradeToPro: () => void;
  setPlan: (plan: PlanType) => void;
}

const ProContext = createContext<ProContextValue>({
  isPro: false,
  plan: 'free',
  upgradeToPro: () => {},
  setPlan: () => {},
});

export function ProProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [plan, setPlanState] = useState<PlanType>('free');

  const isPro = plan === 'pro' || plan === 'elite';

  const upgradeToPro = useCallback(() => {
    console.log('[ProContext] upgradeToPro called → navigating to /plans');
    router.push('/plans' as any);
  }, [router]);

  const setPlan = useCallback((newPlan: PlanType) => {
    console.log(`[ProContext] setPlan called: ${newPlan}`);
    setPlanState(newPlan);
  }, []);

  return (
    <ProContext.Provider value={{ isPro, plan, upgradeToPro, setPlan }}>
      {children}
    </ProContext.Provider>
  );
}

export function useProContext() {
  return useContext(ProContext);
}
