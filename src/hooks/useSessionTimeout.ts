
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
}

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onTimeout,
  onWarning
}: UseSessionTimeoutOptions = {}) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [warningShown, setWarningShown] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(timeoutMinutes * 60);
    setWarningShown(false);
    setIsActive(true);
  }, [timeoutMinutes]);

  const handleActivity = useCallback(() => {
    if (isActive) {
      resetTimer();
    }
  }, [isActive, resetTimer]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [handleActivity]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        
        if (newTimeLeft <= warningMinutes * 60 && !warningShown) {
          setWarningShown(true);
          onWarning?.();
          toast({
            title: "Session Warning",
            description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
            variant: "destructive"
          });
        }
        
        if (newTimeLeft <= 0) {
          setIsActive(false);
          onTimeout?.();
          toast({
            title: "Session Expired",
            description: "You have been logged out due to inactivity.",
            variant: "destructive"
          });
          return 0;
        }
        
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, warningMinutes, warningShown, onTimeout, onWarning, toast]);

  const extendSession = useCallback(() => {
    resetTimer();
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  }, [resetTimer, toast]);

  return {
    timeLeft,
    isActive,
    extendSession,
    resetTimer,
    warningShown
  };
};
