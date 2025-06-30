import { useEffect, useState } from 'react';

type Props = {
  from: number;
};
const useCountDown = ({ from }: Props) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (count <= 0) return;

    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000); // decrease every second

    return () => clearInterval(interval);
  }, [count]);

  return count;
};

export default useCountDown;
