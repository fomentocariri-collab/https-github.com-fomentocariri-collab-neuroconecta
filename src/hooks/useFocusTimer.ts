import { useState, useEffect, useCallback } from "react";
import {
  FocusTimerState,
  getInitialFocusTimerState,
  startFocusTimer,
  pauseFocusTimer,
  resetFocusTimer,
  switchFocusTimerMode,
  saveFocusTimerState,
  FOCUS_TIMER_EVENT,
} from "../utils/focusTimer";

export function useFocusTimer() {
  const [timerState, setTimerState] = useState<FocusTimerState>(getInitialFocusTimerState);

  // Sync across tabs and listen for changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "neuroconecta_focus_timer_state") {
        setTimerState(getInitialFocusTimerState());
      }
    };

    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<FocusTimerState>;
      if (customEvent.detail) {
        setTimerState(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(FOCUS_TIMER_EVENT, handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(FOCUS_TIMER_EVENT, handleCustom);
    };
  }, []);

  // Interval ticker when running
  useEffect(() => {
    let interval: any = null;

    if (timerState.isRunning && timerState.targetEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const left = Math.max(0, Math.ceil((timerState.targetEndTime! - now) / 1000));

        if (left <= 0) {
          // Timer finished
          clearInterval(interval);
          const nextMode = timerState.mode === "foco" ? "pausa" : "foco";
          const nextDuration = nextMode === "foco" ? 25 * 60 : 5 * 60;

          const finishedState: FocusTimerState = {
            mode: nextMode,
            isRunning: false,
            targetEndTime: null,
            remainingSeconds: nextDuration,
            totalDurationSeconds: nextDuration,
            lastUpdated: Date.now(),
          };

          saveFocusTimerState(finishedState);
          setTimerState(finishedState);

          // Notifications & feedback
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(
              nextMode === "pausa" ? "⏱️ Pausa Sensorial Iniciada!" : "🔔 Retorno ao Bloco de Foco!",
              {
                body:
                  nextMode === "pausa"
                    ? "Excelente trabalho! Descanse os olhos, alongue-se ou tome um copo de água."
                    : "Sua pausa sensorial terminou. Você pode retornar ao bloco de foco calmo.",
                icon: "/favicon.ico",
              }
            );
          }
        } else {
          setTimerState((prev) => ({
            ...prev,
            remainingSeconds: left,
            lastUpdated: now,
          }));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.targetEndTime, timerState.mode]);

  const handleStart = useCallback(() => {
    setTimerState((prev) => startFocusTimer(prev));
  }, []);

  const handlePause = useCallback(() => {
    setTimerState((prev) => pauseFocusTimer(prev));
  }, []);

  const handleReset = useCallback(() => {
    setTimerState((prev) => resetFocusTimer(prev.mode));
  }, []);

  const handleSwitchMode = useCallback((mode: "foco" | "pausa") => {
    setTimerState(() => switchFocusTimerMode(mode));
  }, []);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  return {
    timerState,
    startTimer: handleStart,
    pauseTimer: handlePause,
    resetTimer: handleReset,
    switchMode: handleSwitchMode,
    formatTime,
  };
}
