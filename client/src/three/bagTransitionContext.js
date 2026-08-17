import { createContext, useContext } from 'react';

/**
 * Context + hook + imperative singleton for the 3D bag zoom transition.
 * The provider (BagTransitionEngine.jsx) supplies navigateWithBag; non-React
 * call sites (Navbar) can use the singleton `bagTransitionApi`.
 */
export const TransitionContext = createContext(null);

export function useBagTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useBagTransition must be used within BagTransitionProvider');
  return ctx;
}

export const bagTransitionApi = {
  navigateWithBag: () => {},
};
