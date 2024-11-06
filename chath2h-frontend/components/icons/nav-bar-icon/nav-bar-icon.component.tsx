import {BaseIconProps} from "@interfaces/base-icon-props.interface";
import classNames from "classnames";
import styles from "./nav-bar-icon.module.scss";
import {MouseEventHandler} from "react";
import colorScheme from "@helpers/color-scheme";

interface NavBarIconProps extends BaseIconProps {
    isOpened: boolean;
    onClick?: MouseEventHandler | undefined;
}

const NavBarIconComponent = (props: NavBarIconProps) => {
    const width = props.width || 40;
    const height = props.height || 40;
    const isOpened = props.isOpened;
    const color = props.color || colorScheme.white;
    return (
        <svg width={width} height={height}
             onClick={props.onClick}
             className={classNames(isOpened && styles.opened)} viewBox="0 0 60 40">
            <path className={styles.topLine} stroke={color} strokeWidth="3" strokeLinecap="round"
                  strokeLinejoin="round" d="M10,10 L50,10 Z"></path>
            <path className={styles.middleLine} stroke={color} strokeWidth="3" strokeLinecap="round"
                  strokeLinejoin="round" d="M10,20 L50,20 Z"></path>
            <path className={styles.bottomLine} stroke={color} strokeWidth="3" strokeLinecap="round"
                  strokeLinejoin="round" d="M10,30 L50,30 Z"></path>
        </svg>

    );
}

export default NavBarIconComponent;