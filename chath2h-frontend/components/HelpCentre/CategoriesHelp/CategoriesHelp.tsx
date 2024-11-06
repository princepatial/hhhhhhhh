import { useTranslation } from 'next-i18next';
import styles from './CategoriesHelp.module.scss';
import classNames from 'classnames';
import Link from 'next/link';

const CategoriesHelp = () => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <div className={styles.titleLink}>
        <h1 className={styles.title}>{t('CategoriesHelp_title')}</h1>
        <Link className={styles.link} href="/areas">
          {t('CategoriesHelp_link_areas')}
        </Link>
      </div>

      <div className={styles.content}>{t('CategoriesHelp_content1')}</div>
      <div className={styles.subtitle}>{t('CategoriesHelp_subtitle1')}</div>
      <div className={styles.content}>{t('CategoriesHelp_content2')}</div>
      <div className={styles.subtitle}>{t('CategoriesHelp_subtitle2')}</div>
      <div className={styles.content}>{t('CategoriesHelp_content3')}</div>

      <div className={styles.tableWrapper}>
        <span className={styles.warning}>{t('CategoriesHelp_warning')}</span>

        <table className={styles.table}>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_at_home')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_at_home1')}</li>
                <li>{t('CategoriesHelp_at_home2')}</li>
                <li>{t('CategoriesHelp_at_home3')}</li>
                <li>{t('CategoriesHelp_at_home4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_assets')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_assets1')}</li>
                <li>{t('CategoriesHelp_assets2')}</li>
                <li>{t('CategoriesHelp_assets3')}</li>
                <li>{t('CategoriesHelp_assets4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_bad_luck')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_bad_luck1')}</li>
                <li>{t('CategoriesHelp_bad_luck2')}</li>
                <li>{t('CategoriesHelp_bad_luck3')}</li>
                <li>{t('CategoriesHelp_bad_luck4')}</li>
                <li>{t('CategoriesHelp_bad_luck5')}</li>
                <li>{t('CategoriesHelp_bad_luck6')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_bravery')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_bravery1')}</li>
                <li>{t('CategoriesHelp_bravery2')}</li>
                <li>{t('CategoriesHelp_bravery3')}</li>
                <li>{t('CategoriesHelp_bravery4')}</li>
                <li>{t('CategoriesHelp_bravery5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_emigration')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_emigration1')}</li>
                <li>{t('CategoriesHelp_emigration2')}</li>
                <li>{t('CategoriesHelp_emigration3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_faith')}</td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_faith1')}</li>
                <li>{t('CategoriesHelp_faith2')}</li>
                <li>{t('CategoriesHelp_faith3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_family')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_family1')}</li>
                <li>{t('CategoriesHelp_family2')}</li>
                <li>{t('CategoriesHelp_family3')}</li>
                <li>{t('CategoriesHelp_family4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_freeTime')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_free_time1')}</li>
                <li>{t('CategoriesHelp_free_time2')}</li>
                <li>{t('CategoriesHelp_free_time3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_friends')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_friends1')}</li>
                <li>{t('CategoriesHelp_friends2')}</li>
                <li>{t('CategoriesHelp_friends3')}</li>
                <li>{t('CategoriesHelp_friends4')}</li>
                <li>{t('CategoriesHelp_friends5')}</li>
                <li>{t('CategoriesHelp_friends6')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_guilt_and_atonement')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_guilt1')}</li>
                <li>{t('CategoriesHelp_guilt2')}</li>
                <li>{t('CategoriesHelp_guilt3')}</li>
                <li>{t('CategoriesHelp_guilt4')}</li>
                <li>{t('CategoriesHelp_guilt5')}</li>
                <li>{t('CategoriesHelp_guilt6')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_happiness')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_happiness1')}</li>
                <li>{t('CategoriesHelp_happiness2')}</li>
                <li>{t('CategoriesHelp_happiness3')}</li>
                <li>{t('CategoriesHelp_happiness4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_health')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_health1')}</li>
                <li>{t('CategoriesHelp_health2')}</li>
                <li>{t('CategoriesHelp_health3')}</li>
                <li>{t('CategoriesHelp_health4')}</li>
                <li>{t('CategoriesHelp_health5')}</li>
                <li>{t('CategoriesHelp_health6')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_hobby')}</td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_hobby1')}</li>
                <li>{t('CategoriesHelp_hobby2')}</li>
                <li>{t('CategoriesHelp_hobby3')}</li>
                <li>{t('CategoriesHelp_hobby4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_illness')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_illness1')}</li>
                <li>{t('CategoriesHelp_illness2')}</li>
                <li>{t('CategoriesHelp_illness3')}</li>
                <li>{t('CategoriesHelp_illness4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_job')}</td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_job1')}</li>
                <li>{t('CategoriesHelp_job2')}</li>
                <li>{t('CategoriesHelp_job3')}</li>
                <li>{t('CategoriesHelp_job4')}</li>
                <li>{t('CategoriesHelp_job5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_love')}</td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_love1')}</li>
                <li>{t('CategoriesHelp_love2')}</li>
                <li>{t('CategoriesHelp_love3')}</li>
                <li>{t('CategoriesHelp_love4')}</li>
                <li>{t('CategoriesHelp_love5')}</li>
              </ul>
            </td>
          </tr>

          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_neighbors')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_neighbors1')}</li>
                <li>{t('CategoriesHelp_neighbors2')}</li>
                <li>{t('CategoriesHelp_neighbors3')}</li>
                <li>{t('CategoriesHelp_neighbors4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_parents')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_parents1')}</li>
                <li>{t('CategoriesHelp_parents2')}</li>
                <li>{t('CategoriesHelp_parents3')}</li>
                <li>{t('CategoriesHelp_parents4')}</li>
                <li>{t('CategoriesHelp_parents5')}</li>
                <li>{t('CategoriesHelp_parents6')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_pets')}</td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_pets1')}</li>
                <li>{t('CategoriesHelp_pets2')}</li>
                <li>{t('CategoriesHelp_pets3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_planet')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_planet1')}</li>
                <li>{t('CategoriesHelp_planet2')}</li>
                <li>{t('CategoriesHelp_planet3')}</li>
                <li>{t('CategoriesHelp_planet4')}</li>
                <li>{t('CategoriesHelp_planet5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_profession')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_profession1')}</li>
                <li>{t('CategoriesHelp_profession2')}</li>
                <li>{t('CategoriesHelp_profession3')}</li>
                <li>{t('CategoriesHelp_profession4')}</li>
                <li>{t('CategoriesHelp_profession5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_relationships')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_relationships1')}</li>
                <li>{t('CategoriesHelp_relationships2')}</li>
                <li>{t('CategoriesHelp_relationships3')}</li>
                <li>{t('CategoriesHelp_relationships4')}</li>
                <li>{t('CategoriesHelp_relationships5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_school')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_school1')}</li>
                <li>{t('CategoriesHelp_school2')}</li>
                <li>{t('CategoriesHelp_school3')}</li>
                <li>{t('CategoriesHelp_school4')}</li>
                <li>{t('CategoriesHelp_school5')}</li>
                <li>{t('CategoriesHelp_school6')}</li>
                <li>{t('CategoriesHelp_school7')}</li>
                <li>{t('CategoriesHelp_school8')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_social_media')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_social_media1')}</li>
                <li>{t('CategoriesHelp_social_media2')}</li>
                <li>{t('CategoriesHelp_social_media3')}</li>
                <li>{t('CategoriesHelp_social_media4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_son_daughter')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_son_daughter1')}</li>
                <li>{t('CategoriesHelp_son_daughter2')}</li>
                <li>{t('CategoriesHelp_son_daughter3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_start-up')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_start-up1')}</li>
                <li>{t('CategoriesHelp_start-up2')}</li>
                <li>{t('CategoriesHelp_start-up3')}</li>
                <li>{t('CategoriesHelp_start-up4')}</li>
                <li>{t('CategoriesHelp_start-up5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_study')}</td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_study1')}</li>
                <li>{t('CategoriesHelp_study2')}</li>
                <li>{t('CategoriesHelp_study3')}</li>
                <li>{t('CategoriesHelp_study4')}</li>
                <li>{t('CategoriesHelp_study5')}</li>
                <li>{t('CategoriesHelp_study6')}</li>
                <li>{t('CategoriesHelp_study7')}</li>
                <li>{t('CategoriesHelp_study8')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_trauma')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_trauma1')}</li>
                <li>{t('CategoriesHelp_trauma2')}</li>
                <li>{t('CategoriesHelp_trauma3')}</li>
                <li>{t('CategoriesHelp_trauma4')}</li>
                <li>{t('CategoriesHelp_trauma5')}</li>
                <li>{t('CategoriesHelp_trauma6')}</li>
                <li>{t('CategoriesHelp_trauma7')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_vacation')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_vacation1')}</li>
                <li>{t('CategoriesHelp_vacation2')}</li>
                <li>{t('CategoriesHelp_vacation3')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_violence')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_violence1')}</li>
                <li>{t('CategoriesHelp_violence2')}</li>
                <li>{t('CategoriesHelp_violence3')}</li>
                <li>{t('CategoriesHelp_violence4')}</li>
                <li>{t('CategoriesHelp_violence5')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>
              {t('areas_work_colleagues')}
            </td>
            <td>
              <ul className={styles.list}>
                <li>{t('CategoriesHelp_work1')}</li>
                <li>{t('CategoriesHelp_work2')}</li>
                <li>{t('CategoriesHelp_work3')}</li>
                <li>{t('CategoriesHelp_work4')}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className={classNames(styles.categoryName, styles.subtitle)}>{t('areas_other')}</td>
            <td>
              <div className={styles.list}>{t('CategoriesHelp_work_other')}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default CategoriesHelp;
