import AdminLayout from '@components/AdminLayout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import Calendar from 'react-calendar';
import { requestDownloadFile } from 'helpers';
import { getTokensTransactions } from 'queries/tokensQuery/tokens';
import Button from '@components/Button';
import styles from './admin.module.scss';
import { useTranslation } from 'next-i18next';

type ChoosenDataType = {
  fromDate?: Date | null;
  toDate?: Date | null;
};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const AdminPanel = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');

  const [choosenData, setChoosenData] = useState<null | ChoosenDataType>(null);

  const exportData = async (isExcel: boolean = false) => {
    const options = {
      isExcel,
      fromDate: choosenData?.fromDate ? choosenData?.fromDate.toString() : undefined,
      toDate: choosenData?.toDate ? choosenData?.toDate.toString() : undefined
    };
    const data = await getTokensTransactions(options);
    if (!data) return;
    requestDownloadFile(data, 'tokens-transaction', isExcel);
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <Calendar
          selectRange
          onChange={(value: Value) => {
            if (!Array.isArray(value)) return;
            setChoosenData({ fromDate: value[0], toDate: value[1] });
          }}
        />
        <div className={styles.text}>{t('users_generate')}</div>
        <div className={styles.buttons}>
          <Button text={'xlsx'} onClick={() => exportData(true)} />
          <Button text="csv" onClick={() => exportData()} />
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default AdminPanel;
