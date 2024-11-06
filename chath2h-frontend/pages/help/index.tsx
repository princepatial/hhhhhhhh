import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import styles from './helpCenter.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import classNames from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HelpNav from '@components/HelpCentre/HelpNav';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

const HelpCenter = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.container}>
      <HelpNav />
      <div className={styles.helpContent}>
        <div className={styles.topText}>
          <h1 className={styles.title}>
            {t('help-center_title')} - {t('help-center_subTitle')}
          </h1>
          <div className={styles.text}>
            <span className={styles.spanMargin}>
              {t('help-center_text_under_title')}
              <Link href="www.chath2h.com/steps" target="_blank" rel="noopener noreferrer">
                {t('help-center_link')}
              </Link>
            </span>
          </div>
        </div>

        <ol className={styles.mainList}>
          <li>
            <span className={styles.subtitle}>{t('help-center_getting_started')}</span>
            <ol>
              <li>{t('help-center_quick_start')}</li>
              <li>{t('help-center_comprehensive')}</li>

              <span className={styles.bold}>H2HCoach:</span>
              <li>
                <ol className={styles.liDecimal}>
                  <li>{t('help-center_engage_coach')}</li>
                  <li>{t('help-center_share_knowledge')}</li>
                </ol>
              </li>

              <span className={styles.bold}>{t('help-center_h2h_customer')}</span>
              <ol className={styles.liDecimal}>
                <li>{t('help-center_h2h_customer_actively')}</li>
                <li>{t('help-center_h2h_customer_benefit')}</li>
              </ol>

              <li>{t('help-center_actively_participating')}</li>
            </ol>
          </li>

          <li>
            <span className={styles.subtitle}>{t('help-center_step_1')}</span>
            <ol>
              <li>{t('help-center_step_1_upon_registration')}</li>
              <li>{t('help-center_step_1_crypto_wallet')}</li>
              <li>{t('help-center_step_1_navigate')}</li>
              <li>
                <span>{t('help-center_step_1_in_the_event')}</span>
                <ol className={styles.liDecimal}>
                  <li>{t('help-center_step_1_in_the_event_list_1')}</li>
                  <li>{t('help-center_step_1_in_the_event_list_2')}</li>
                  <li>{t('help-center_step_1_in_the_event_list_3')}</li>
                  <li>{t('help-center_step_1_in_the_event_list_4')}</li>
                </ol>
              </li>
            </ol>
          </li>

          <li>
            <span className={styles.subtitle}>{t('help-center_step_2')}</span>
            <ul className={styles.liNone}>
              <li>{t('help-center_step_2_description')}</li>
              <ol className={styles.liDecimal}>
                <li>{t('help-center_step_2_navigate_categories')}</li>
                <li>
                  {t('help-center_step_2_choose_category')}
                  <span>{t('help-center_step_2_cursor_categories')}</span>
                </li>

                <li>
                  {t('help-center_step_2_select')}
                  <span>{t('help-center_step_2_description_second')}</span>
                </li>

                <li>{t('help-center_step_2_need_help')}”</li>
                <li>{t('help-center_step_2_create_your_ad')}</li>
              </ol>
            </ul>
          </li>

          <li>
            <span className={styles.subtitle}>{t('help-center_step_3_title')}</span>
            <ul className={styles.liNone}>
              <li>{t('help-center_step_3_description')}</li>
              <ol className={styles.liDecimal}>
                <li>{t('help-center_step_3_navigate_categories')}</li>
                <li>
                  {t('help-center_step_3_choose_category')}
                  <span>{t('help-center_step_3_cursor_categories')}</span>
                </li>
                <li>
                  {t('help-center_step_3_select_role')}
                  <span>{t('help-center_step_3_role_description')}</span>
                </li>
                <li>{t('help-center_step_3_click_offer_help')}</li>
                <li>{t('help-center_step_3_create_offer')}</li>
              </ol>
            </ul>
          </li>

          <li>
            <span className={styles.subtitle}>{t('help-center-step_4_title')}</span>
            <ol>
              <li>{t('help-center-step_4_description')}</li>
              <ul className={styles.liNone}>
                <div>
                  <div className={styles.bold}>{t('help-center-step_4_earning_tokens')}</div>
                  <span>{t('help-center-step_4_earning_tokens_description')}</span>
                </div>
                <ol className={styles.liDecimal}>
                  <li>{t('help-center-step_4_navigate_needs_section')}</li>
                  <li>{t('help-center-step_4_click_specific_need')}</li>
                  <li>{t('help-center-step_4_start_chat_to_help')}</li>
                </ol>
                <div>
                  <div className={styles.bold}>{t('help-center-step_4_spending_tokens')}</div>
                  <span>{t('help-center-step_4_use_tokens_to_get_help')}</span>
                </div>
                <ol className={styles.liDecimal}>
                  <li>{t('help-center-step_4_explore_offers_section')}</li>
                  <li>{t('help-center-step_4_click_relevant_offer')}</li>
                  <li>{t('help-center-step_4_start_chat_to_seek_assistance')}</li>
                </ol>
              </ul>
            </ol>
          </li>

          <li>
            <span className={styles.subtitle}>{t('help-center_step_5_title')}</span>
            <ol>
              <li>{t('help-center_step_5_description')}</li>
              <li>
                <div className={styles.bold}>{t('help-center_step_5_usage_limitations')}</div>
                <span>{t('help-center_step_5_utilize_messages_exclusively')}</span>
                <ul className={styles.liNone}>
                  <ol className={styles.liDecimal}>
                    <li>{t('help-center_step_5_invite_to_chat')}</li>
                    <li>{t('help-center_step_5_make_appointments')}</li>
                  </ol>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <span className={styles.subtitle}>{t('help-center_step_6_title')}</span>
            <ol>
              <li>{t('help-center_step_6_start_and_manage_chats')}</li>
              <li>
                <div className={styles.bold}>{t('help-center_step_6_online_chat_partner')}</div>
                <span>{t('help-center_step_6_click_start_chat')}</span>
                <ol className={styles.liDecimal}>
                  <li>{t('help-center_step_6_immediate_response')}</li>
                  <li>{t('help-center_step_6_no_immediate_response')}</li>
                  <li>{t('help-center_step_6_make_appointments')}</li>
                </ol>
              </li>
              <li>
                <div className={styles.bold}>{t('help-center_step_6_offline_chat_partner')}</div>
                <span>{t('help-center_step_6_not_available_steps')}</span>
                <li>
                  <ol className={styles.liDecimal}>
                    <li>{t('help-center_step_6_three_messages_to_make_appointment')}</li>
                    <li>{t('help-center_step_6_each_message_emailed')}</li>
                    <li>{t('help-center_step_6_inbox_locked_after_third_message')}</li>
                    <li>{t('help-center_step_6_open_chat_window_anytime')}</li>
                    <li>{t('help-center_step_6_unlock_after_chat_or_seven_days')}</li>
                    <li>{t('help-center_step_6_arrange_future_calls_within_unlocked_mailbox')}</li>
                  </ol>
                </li>
              </li>
            </ol>
          </li>

          <li>
            <span className={styles.subtitle}>{t('help-center_step_7_title')}</span>
            <ol>
              <li>{t('help-center_step_7_manage_tokens')}</li>
              <ol className={classNames(styles.liDecimal, styles.marginLeft)}>
                <li>
                  <div className={styles.bold}>
                    {t('help-center_step_7_token_payment_in_advance')}
                  </div>
                  <span>{t('help-center_step_7_initiate_chat_pay_tokens')} </span>
                </li>
                <li>
                  <div className={styles.bold}>
                    {t('help-center_step_7_token_usage_during_chat')}
                  </div>
                  <span>{t('help-center_step_7_tokens_deducted_during_chat')} </span>
                </li>
                <li>
                  <div className={styles.bold}>{t('help-center_step_7_refund_unused_tokens')}</div>
                  <span>{t('help-center_step_7_after_chat_concludes_refund_tokens')} </span>
                </li>
                <li>
                  <div className={styles.bold}>
                    {t('help-center_step_7_internal_billing_process')}
                  </div>
                  <span>{t('help-center_step_7_billing_conducted_internally')}</span>
                </li>
                <li>
                  <div className={styles.bold}>
                    {t('help-center_step_7_actual_token_debit_credit')}
                  </div>
                  <span>
                    {t('help-center_step_7_actual_token_amount_debited_credited_after_chat')}
                  </span>
                </li>
              </ol>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  );
};
export default HelpCenter;
