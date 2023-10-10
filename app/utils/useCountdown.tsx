import {Dispatch, SetStateAction, useEffect} from 'react';

const useCountdown = (
  startTime: number,
  setStartTime: Dispatch<SetStateAction<number>>,
  onEndTime?: () => void,
) => {
  useEffect(() => {
    if (startTime <= 0) {
      setStartTime(0);
      return onEndTime && onEndTime();
    }

    const timer = setTimeout(() => {
      setStartTime(startTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startTime]);

  return;
};

export default useCountdown;
