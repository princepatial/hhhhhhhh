import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { sideMenu } from './config';
import styles from './sidebar.module.scss';
import { useTranslation } from 'next-i18next';

type NavItem = {
  label: string;
  to: string;
  children?: Array<NavItem>;
};

type NavItemProps = {
  isActive: boolean;
  item: NavItem;
};

const resolveLinkPath = (childTo: string, parentTo: string) => `${parentTo}/${childTo}`;

const NavItemHeader = ({ isActive, item: { label, children, to } }: NavItemProps) => {
  const [expanded, setExpand] = useState<boolean>(false);

  const onExpandChange = () => {
    setExpand((expanded: boolean) => !expanded);
  };

  return (
    <>
      <button
        className={classNames(styles.navItem, styles.navItemHeaderButton)}
        onClick={onExpandChange}>
        <span className={styles.navLabel}>{label}</span>
      </button>

      {expanded && (
        <div className={styles.subItems}>
          {children?.map((item: NavItem, index: number) => {
            const key = `${item.label}-${index}`;

            const { label, children } = item;

            if (children) {
              return (
                <div key={key}>
                  <NavItemHeader
                    isActive={isActive}
                    item={{
                      ...item,
                      to: resolveLinkPath(to, item.to)
                    }}
                  />
                </div>
              );
            }

            return (
              <Link key={key} href={resolveLinkPath(item.to, to)} className={styles.navItem}>
                <span className={styles.navLabel}>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

const NavItem: FC<NavItemProps> = (props) => {
  const { t } = useTranslation();
  const {
    item: { label, to, children },
    isActive
  } = props;

  if (children) {
    return <NavItemHeader isActive={isActive} item={props.item} />;
  }

  return (
    <Link href={to} className={classNames(styles.navItem, isActive && styles.activeNavItem)}>
      <span className={styles.navLabel}>{t(label)}</span>
    </Link>
  );
};

const Sidebar = () => {
  const router = useRouter();

  return (
    <nav className={styles.sidebar}>
      {sideMenu.map((item, index) => {
        return (
          <NavItem
            isActive={router.pathname === item.to}
            key={`${item.label}-${index}`}
            item={item}
          />
        );
      })}
    </nav>
  );
};

export default Sidebar;
