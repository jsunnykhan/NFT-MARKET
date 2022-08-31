import React from 'react';
import { useCountdown } from '../../helper/hooks/useCountdown';
import ShowCounter from './ShowCounter';

const CountdownTimer = ({ targetDate, setTimeRemaining }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  if (days + hours + minutes + seconds === 0) {
    setTimeRemaining(false);
    return <ShowCounter days={0} hours={0} minutes={0} seconds={0} />;
  } else if (days + hours + minutes + seconds < 0) {
    return <ShowCounter days={0} hours={0} minutes={0} seconds={0} />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
