import { FC, ReactNode } from 'react';
import styles from './adminLayout.module.scss';
import Sidebar from './Sidebar';

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.aside}>
          <Sidebar />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
