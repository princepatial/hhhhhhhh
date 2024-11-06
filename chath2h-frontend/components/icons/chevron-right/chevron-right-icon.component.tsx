import {BaseIconProps} from "@interfaces/base-icon-props.interface";
import colorScheme from "@helpers/color-scheme";
import classNames from "classnames";
import styles from "./chevron-right-icon.module.scss";

interface ChevronRightIconComponentProps extends BaseIconProps {
    direction?: 'left' | 'right' | 'top' | 'bottom';
}

const ChevronRightIconComponent = (props: ChevronRightIconComponentProps) => {
    const width = props.width || 8;
    const height = props.height || 16;
    const color = props.color || colorScheme.black;
    const direction = props.direction || 'right';

    return (
        <svg width={width}
             height={height}
             className={classNames(
                 direction === 'left' && styles.left,
                 direction === 'right' && styles.right,
                 direction === 'top' && styles.top,
                 direction === 'bottom' && styles.bottom
             )}
             viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.474308 23.5257C0.158103 23.2095 0 22.8351 0 22.4025C0 21.9708 0.158103 21.5968 0.474308 21.2806L9.73913 12.0158L0.442688 2.71937C0.147562 2.42424 0 2.05534 0 1.61265C0 1.16996 0.158103 0.790514 0.474308 0.474308C0.790514 0.158103 1.1649 0 1.59747 0C2.0292 0 2.40316 0.158103 2.71937 0.474308L13.3439 11.1304C13.4704 11.2569 13.5602 11.3939 13.6133 11.5415C13.6656 11.6891 13.6917 11.8472 13.6917 12.0158C13.6917 12.1845 13.6656 12.3426 13.6133 12.4901C13.5602 12.6377 13.4704 12.7747 13.3439 12.9012L2.68775 23.5573C2.39262 23.8524 2.0292 24 1.59747 24C1.1649 24 0.790514 23.8419 0.474308 23.5257Z"
                fill={color}/>
        </svg>
    )
}

export default ChevronRightIconComponent;