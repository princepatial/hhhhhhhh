import { useEffect, useRef, useState } from 'react';
import styles from './ScrollTop.module.scss';
import { ChevronRightIconComponent } from '@components/icons';
import { useRouter } from 'next/router';

const ScrollTop = () => {
  const router = useRouter();
  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const [scrollingUp, setScrollingUp] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setScrollingUp(prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [prevScrollPos]);

  useEffect(() => {
    if (scrollingUp) {
      setScrollingUp(false);
    }
  }, [router.asPath]);

  return (
    <div className={styles.container}>
      {scrollingUp && (
        <div className={styles.scrollWrapper} onClick={scrollTop}>
          <ChevronRightIconComponent direction="bottom" color="#e8e8e8" width={50} />
        </div>
      )}
    </div>
  );
};

export default ScrollTop;
