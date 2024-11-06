import AdminLayout from '@components/AdminLayout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAdminAds } from 'queries/adsQuery';
import Image from 'next/image';
import styles from './advert-stats.module.scss';
import useImageUrl from 'hooks/getImageUrl';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const headers = [
  'advert-stats_header_image',
  'advert-stats_header_name',
  'advert-stats_header_redirectPath',
  'advert-stats_header_visits',
  'advert-stats_header_views'
];

const AdvertStats = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: adminAdsData } = useAdminAds();
  const { t } = useTranslation('common');
  return (
    <AdminLayout>
      <table className={styles.container}>
        <thead>
          <tr>
            {headers.map((headerItem) => (
              <th scope="col">{t(headerItem)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {adminAdsData?.map((ad) => {
            const { name, redirectPath, visits, views, image } = ad;
            const imageLink = useImageUrl(image.filename);
            const isLonger = redirectPath.length > 120;
            const redirectPathToShow = isLonger ? redirectPath.slice(0, 120) + '...' : redirectPath;
            return (
              <tr>
                <td className={styles.imageWrapper}>
                  <Image fill src={imageLink} alt={`ad-image-${name}`}></Image>
                </td>
                <td scope="row">{name}</td>
                <td>
                  <Link href={redirectPath}>{redirectPathToShow}</Link>
                </td>
                <td>{visits}</td>
                <td>{views}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default AdvertStats;
