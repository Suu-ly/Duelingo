import {Dispatch, SetStateAction, useEffect} from 'react';

const useCountdown = (
  startTime: number | null,
  setStartTime: Dispatch<SetStateAction<number | null>>,
  onEndTime?: () => void,
) => {
  useEffect(() => {
    if (startTime !== null) {
      if (startTime <= 0) {
        setStartTime(0);
        return onEndTime && onEndTime();
      }

      const timer = setTimeout(() => {
        setStartTime(startTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else return;
  }, [startTime]);

  return;
};

export default useCountdown;
