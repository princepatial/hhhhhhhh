import Button from '@components/Button';
import { TrashBinIconComponent } from '@components/icons';
import PencilIconComponent from '@components/icons/pencil-bin-icon/pencil-icon.component';
import axios from 'axios';
import classNames from 'classnames';
import { useGlobalState } from 'globalState';
import useImageUrl from 'hooks/getImageUrl';
import useIsInViewport from 'hooks/isInViewport';
import Image from 'next/image';
import Link from 'next/link';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from './Advertisement.module.scss';

const Advertisement = ({
  name,
  id,
  filename,
  redirectPath,
  openEditPopup,
  openDeletePopup
}: {
  name: string;
  id: string;
  filename: string;
  redirectPath: string;
  openEditPopup: () => void;
  openDeletePopup: () => void;
}) => {
  const [isAdmin] = useGlobalState('isAdmin');
  const [userSeenAd, setUserSeenAd] = useState([{}]);
  const adRef: MutableRefObject<HTMLImageElement | null> = useRef(null);
  const image = useImageUrl(filename);

  const handleClick = async () => {
    axios.post('/advertisement/visits', { id });
  };

  const adInViewport = useIsInViewport(adRef);

  useEffect(() => {
    const storageAds = Object.keys(sessionStorage)
      .filter((key) => key.includes('userSeenAd'))
      .map((key) => ({ [key]: true }));
    setUserSeenAd(storageAds || [{}]);
  }, []);

  useEffect(() => {
    const storageKey = 'userSeenAd ' + adRef.current?.alt;
    const seenAd = sessionStorage.getItem(storageKey);
    if (!seenAd && adInViewport) {
      sessionStorage.setItem(storageKey, 'true');
      setUserSeenAd((prev) => {
        return [...prev, { [storageKey]: true }];
      });
      axios.post('/advertisement/views', { id });
    }
  }, [userSeenAd, adInViewport]);

  return (
    <div>
      <div className={styles.container}>
        <Link rel="noopener noreferrer" target="_blank" href={redirectPath || ''}>
          <Image
            id={id}
            ref={adRef}
            className={classNames(styles.advert, isAdmin && styles.adminAdvert)}
            onClick={handleClick}
            alt={`ad ${name}`}
            src={image}
            width="0"
            height="0"
            sizes="100vw"
          />
        </Link>
        {isAdmin && (
          <div className={styles.action}>
            <Button style={styles.iconButton} onClick={openEditPopup} buttonColor="whiteGreen">
              <PencilIconComponent />
            </Button>
            <Button style={styles.iconButton} onClick={openDeletePopup} buttonColor="whiteRed">
              <TrashBinIconComponent />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advertisement;
