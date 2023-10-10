import {useEffect, useState} from 'react';

const useTimeElapsed = (startTime: number) => {
  const [timePassed, setTimePassed] = useState(startTime);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) {
      return;
    }

    const timer = setTimeout(() => {
      setTimePassed(timePassed + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timePassed]);

  const stopTimer = () => {
    setActive(false);
  };

  return {timePassed, stopTimer};
};

export default useTimeElapsed;
