import styles from './Details.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import useImageUrl from 'hooks/getImageUrl';
import AvatarWithStatus from 'components/AvatarWithStatus';
import { useTranslation } from 'next-i18next';
import { ActiveComponents, CoachesWithCategories, StateSetterType, User } from 'globalTypes';
import shaveSvg from '@images/share.svg';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';

type Props = {
  isNeed?: boolean;
  imageId: string;
  description: string;
  problemTitle: string;
  hashtags: Array<string> | undefined;
  category: string;
  index?: number;
  setActiveCoach?: StateSetterType<CoachesWithCategories | null>;
  user?: User;
  setActiveComponent?: StateSetterType<ActiveComponents>;
  isCoachPage?: boolean;
  isUserStatusVisible?: boolean;
  needOfferId?: string;
  coachId?: string;
  isActive?: boolean;
};

export default function Details({
  isNeed,
  imageId,
  description,
  problemTitle,
  hashtags,
  category,
  index,
  setActiveCoach,
  user,
  setActiveComponent,
  isCoachPage = false,
  isUserStatusVisible = true,
  needOfferId,
  isActive
}: Props) {
  const { t } = useTranslation('common');
  const [isCopiedToolTipOpen, setIsCopiedToolTipOpen] = useState(false);
  const imageSrc = useImageUrl(imageId);
  const avatarSrc = useImageUrl(
    !isCoachPage && !!user
      ? !isNeed && user.coachProfile?.coachPhoto
        ? user.coachProfile.coachPhoto.filename
        : user.avatar.filename
      : ''
  );

  const onClickCoach = () => {
    if (!user) return;
    if (!isNeed && setActiveComponent && setActiveCoach) {
      const newCoach = {
        areas: user?.areas || [],
        user: user
      };
      setActiveComponent('coachDetails');
      setActiveCoach(newCoach);
    }
  };

  const onCopyElement = () => {
    setIsCopiedToolTipOpen(true);
    const origin =
      typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const url = origin + '/' + (isNeed ? 'needs' : 'offers') + '?id=' + needOfferId;
    navigator.clipboard.writeText(url);
    setTimeout(() => setIsCopiedToolTipOpen(false), 2000);
  };

  return (
    <>
      <div className={classNames(styles.container)}>
        {!isCoachPage && !!user && (
          <div className={styles.userDetails}>
            <div className={styles.details}>
              <AvatarWithStatus imageSrc={avatarSrc} userId={user._id} />
              <span
                className={classNames(
                  !isNeed && !isCopiedToolTipOpen && styles.cursorPointer,
                  styles.name
                )}
                onClick={onClickCoach}>
                {user.firstName}
              </span>
            </div>
          </div>
        )}

        <div className={styles.offerDetails}>
          <div
            className={classNames(styles.imageWrapper, isCoachPage && styles.imageWrapperHeight)}>
            <Image
              className={classNames(styles.image, isNeed ? styles.needImage : styles.helpImage)}
              style={{ objectFit: 'cover' }}
              src={imageSrc}
              fill
              sizes="100vh"
              alt={index ? index + '-offerDetailImage' : 'offerDetailImage'}
            />
          </div>
          <div className={styles.basicInfo}>
            <span
              className={classNames(
                styles.categoryName,
                isNeed ? styles.categoryNeed : styles.categoryHelp
              )}>
              {t(category)}
            </span>
            <div className={styles.title}>{problemTitle}</div>
          </div>
          {isActive && (
            <div
              className={styles.shareImg}
              onClick={isCopiedToolTipOpen ? () => {} : onCopyElement}>
              <Image src={shaveSvg} alt="shareImg" height={24} width={24} />
              <Tooltip
                isOpen={isCopiedToolTipOpen}
                content="copied"
                anchorSelect=".my-anchor-element"
                place="top"
                className={styles.tooltip}
              />
            </div>
          )}
        </div>
        <div className={styles.moreInfo}>
          <p className={styles.description}>{description}</p>
          <div className={styles.hashtags}>
            {hashtags &&
              hashtags[0] !== '' &&
              hashtags.map((tag, index) => (
                <span key={index} className={classNames(isNeed ? styles.needTag : styles.helpTag)}>
                  #{tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
