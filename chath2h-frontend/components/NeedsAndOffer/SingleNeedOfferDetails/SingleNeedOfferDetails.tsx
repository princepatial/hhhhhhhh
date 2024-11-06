import classNames from 'classnames';
import {PageViewState} from 'globalTypes';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
import Image from 'next/image';
import styles from './SingleNeedOfferDetails.module.scss';

type Props = {
    isActive?: boolean;
    hasChats?: boolean;
    pageViewState?: PageViewState;
    index: number | string;
    isNeed?: boolean;
    showPriceInfo?: boolean;
    category: string;
    id: string;
    title: string;
    description: string;
    hashtags?: string[];
    imageSrc: string;
};

const SingleNeedOfferDetails = ({
                                    isActive,
                                    hasChats,
                                    pageViewState,
                                    imageSrc,
                                    isNeed,
                                    index,
                                    category,
                                    id,
                                    title,
                                    description,
                                    showPriceInfo,
                                    hashtags
                                }: Props) => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const redirect = () => {
        if (!hasChats || !pageViewState) return;
        router.push(`/${pageViewState}/${id}`);
    };

    return (
        <>
            <div
                className={classNames(
                    styles.content,
                    !isActive && styles.notActive,
                    hasChats && styles.pointer
                )}
                onClick={redirect}>
                <div className={styles.image}>
                    <Image
                        style={{objectFit: 'cover'}}
                        src={imageSrc}
                        fill
                        className={classNames(isNeed ? styles.imageNeed : styles.imageOffer)}
                        alt={'-myNeed-' + index}
                    />
                </div>
                <div className={styles.text}>
                    <div className={styles.title}>
          <span
              className={classNames(
                  styles.titleCategory,
                  isNeed ? styles.colorRed : styles.colorGreen
              )}>
            {t(category)}
              {' / '}
          </span>
                        <span className={styles.titleCategory}>{title}</span>
                    </div>

                    <span className={styles.description}>{description}</span>
                    {hashtags &&
                        hashtags[0] !== '' &&
                        hashtags.map((item, index) => (
                            <span
                                key={index}
                                className={classNames(styles.hashtags, isNeed ? styles.colorRed : styles.colorGreen)}>
              #{item}{' '}
            </span>
                        ))}
                </div>
            </div>
            {showPriceInfo &&
                <div className={classNames(
                    styles.content,
                    !isActive && styles.notActive,
                    hasChats && styles.pointer,
                    styles.price_info)}>
                    {isNeed
                        ? t('PayEarnInfoPopup_subtitle_coach')
                        : t('PayEarnInfoPopup_subtitle_user')}
                </div>
            }
        </>
    );
};

export default SingleNeedOfferDetails;
