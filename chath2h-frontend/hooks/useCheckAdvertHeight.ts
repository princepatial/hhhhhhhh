import { MutableRefObject, useEffect, useState } from 'react';

const useCheckAdvertHeight = (refAdvert: MutableRefObject<HTMLDivElement | null>) => {
  const [isAdvertHigherThanWindow, setIsAdvertHigherThanWindow] = useState(false);

  useEffect(() => {
    if (!window || !refAdvert.current) return;

    const windowHeight = window.innerHeight;
    if (refAdvert.current.clientHeight > windowHeight - 100) {
      setIsAdvertHigherThanWindow(true);
    }
  }, [refAdvert.current?.clientHeight, setIsAdvertHigherThanWindow]);
  return isAdvertHigherThanWindow;
};

export default useCheckAdvertHeight;
