import { useEffect, useRef } from 'react';

export const useCartCleanup = (isOpen: boolean) => {
  const cleanupInProgress = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        if (cleanupInProgress.current) return;
        cleanupInProgress.current = true;

        try {
          // Let Vaul handle its own cleanup
          const customOverlays = document.querySelectorAll('[data-testid="cart-overlay"]');
          customOverlays.forEach(overlay => {
            if (overlay && document.body.contains(overlay)) {
              overlay.remove();
            }
          });
        } catch (error) {
          console.error('Error during cart overlay cleanup:', error);
        } finally {
          cleanupInProgress.current = false;
        }
      }, 1000); // Increased delay to ensure Vaul cleanup completes

      return () => {
        clearTimeout(timeoutId);
        cleanupInProgress.current = false;
      };
    }
  }, [isOpen]);
};