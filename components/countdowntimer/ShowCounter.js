import DateTimeDisplay from './DateTimeDisplay';

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
      <div className="countdown-link">
        <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 0} />
        <p>:</p>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={hours <= 1} />
        <p>:</p>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={minutes <= 2} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
      </div>
    </div>
  );
};

export default ShowCounter;
