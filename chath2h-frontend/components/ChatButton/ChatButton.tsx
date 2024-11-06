import chatImg from '@images/chat_outline.svg';
import {useTranslation} from 'next-i18next';
import Image from 'next/image';
import {MouseEventHandler} from 'react';
import styles from './ChatButton.module.scss';
import Button from '@components/Button';
import {Tooltip} from "react-tooltip";
import classNames from "classnames";

type Props = {
    handleClick: MouseEventHandler<HTMLButtonElement>;
    text?: string;
    disabled?: boolean;
    showTooltip?: boolean;
    isCoach?: boolean;
};

const ChatButton = ({handleClick, text, disabled, showTooltip, isCoach = false}: Props) => {
    const {t} = useTranslation('common');
    return (
        <div className={classNames(styles.buttonWrapper, 'my-anchor-element')}>
            <Button
                disabled={disabled}
                text={!text ? t('ChatButton_start_chat') : text}
                onClick={handleClick}
                style={styles.chatButton}
                data-tooltip-id={showTooltip && 'price-tooltip'}
                data-tooltip-content={isCoach
                    ? t('PayEarnInfoPopup_subtitle_coach')
                    : t('PayEarnInfoPopup_subtitle_user')}
                buttonColor="whiteGreen">
                <Image src={chatImg} alt="chat" className={styles.image}/>
            </Button>
            <Tooltip positionStrategy="fixed" place="top-end" className="tooltip-index" id="price-tooltip"/>
        </div>
    );
};
export default ChatButton;
