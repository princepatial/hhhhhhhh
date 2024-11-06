import AdminLayout from '@components/AdminLayout';
import {
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import axios from 'axios';
import classNames from 'classnames';
import { User } from 'globalTypes';
import { useFilteredUsers } from 'queries/userQuery';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import styles from './users.module.scss';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Button from '@components/Button';
import { getUsersToFile } from 'queries/userQuery/user';
import { TFunction } from 'i18next';
import { requestDownloadFile } from 'helpers';

type ColumnsProps = {
  t: TFunction<'common', undefined>;
  functions: {
    handleDisableOrEnableUser: (id: string, disable: boolean) => void;
    handleSendTokens: (id: string, firstName: string, amount: number) => void;
  };
};

const getColumns = ({
  functions: { handleDisableOrEnableUser, handleSendTokens },
  t
}: ColumnsProps) => {
  const cols: ColumnDef<User & { grantTokens?: string }>[] = [
    { accessorKey: 'email', header: t('admin_users_header_email') },
    { accessorKey: 'firstName', header: t('admin_users_header_first-name') },
    { accessorKey: 'lastName', header: t('admin_users_header_last-name') },
    { accessorKey: 'city', header: t('admin_users_header_city') },
    {
      accessorKey: 'grantTokens',
      header: t('admin_users_header_grant-tokens'),
      enableColumnFilter: false,
      cell: (row: CellContext<User, any>) => {
        const [number, setNumber] = useState<number | null>(null);

        const onSendAction = () => {
          if (!number) return;
          handleSendTokens(row.row.original._id, row.row.original.firstName, number);
          setNumber(0);
        };

        return (
          <div className={styles.grantCell}>
            <input
              type="number"
              min={0}
              onChange={(e) => setNumber(Number(e.target.value))}
              placeholder={'0'}
              value={number || undefined}
              pattern="[0-9]*"
            />
            <Button
              style={styles.sendButton}
              text={t('admin_users_button_send')}
              buttonColor="limeGreen"
              disabled={number === 0}
              onClick={onSendAction}
            />
          </div>
        );
      }
    },
    {
      accessorKey: 'isDisabled',
      header: t('admin_users_header_disabled'),
      cell: (row: CellContext<User, unknown>) => {
        const value = row.getValue();
        return String(!!value);
      }
    },
    {
      accessorKey: '_id',
      header: t('admin_users_header_action'),
      enableColumnFilter: false,
      cell: (row: CellContext<User, unknown>) => {
        const { isDisabled } = row.row.original;

        return (
          <div>
            <button
              className={classNames(
                styles.actionButton,
                isDisabled ? styles.enableButton : styles.disableButton
              )}
              onClick={() => {
                handleDisableOrEnableUser(String(row.getValue()), !isDisabled);
              }}>
              {isDisabled ? t('admin_users_button_enable') : t('admin_users_button_disable')}
            </button>
          </div>
        );
      }
    }
  ];

  return cols;
};

enum RadioFiltersType {
  ALL = 'all',
  FALSE = 'false',
  TRUE = 'true'
}

const RadioFilters = ({
  column,
  id,
  type
}: {
  column: Column<User>;
  id: string;
  type: RadioFiltersType;
}) => {
  const text = type.charAt(0).toUpperCase() + type.slice(1);
  const setValue = RadioFiltersType.ALL === type ? null : RadioFiltersType.TRUE === type;
  return (
    <div>
      <input
        type="radio"
        id={type}
        name={id}
        onChange={(e) => {
          if (e.target.checked) {
            column.setFilterValue(setValue);
          }
        }}
      />
      <label htmlFor={type}>{text}</label>
    </div>
  );
};

function Filter({ column }: { column: Column<User> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
    />
  );
}
const pageSizes = [10, 20, 30, 50];

const Users = () => {
  const { t } = useTranslation('common');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState<number>(pageSizes[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleDisableOrEnableUser = async (id: string, disable: boolean) => {
    const result = await axios.patch(`/users/disableOrEnable/${id}`, { isDisabled: disable });

    if (result.status === 200) {
      refetch();
      toast.success(t(`Manage_user_${disable ? 'disabled' : 'enabled'}_success`));
    } else {
      toast.error(t(`Manage_user_${disable ? 'disabled' : 'enabled'}_error`));
    }
  };

  const handleSendTokens = async (id: string, firstName: string, amount: number) => {
    try {
      if (amount === 0) throw 'Wrong amount';

      const result = await axios.post('/token-transaction/grant-tokens', { id, amount });

      if (result.status === 201) {
        toast.success(
          firstName + t(`Manage_user_amount_success`) + amount + t('Manage_user_amount_success_2')
        );
      }
    } catch (err) {
      toast.error(t(`Manage_user_amount_error`));
    }
  };

  const columns = useMemo(
    () => getColumns({ functions: { handleDisableOrEnableUser, handleSendTokens }, t }),
    []
  );

  const { data: filteredUsers, refetch } = useFilteredUsers(
    pageSize,
    currentPage,
    sorting,
    columnFilters
  );

  useEffect(() => {
    if (filteredUsers && filteredUsers.totalPages < 1) {
      setCurrentPage(1);
      return;
    }
    if (filteredUsers && filteredUsers.page && filteredUsers.page > filteredUsers.totalPages) {
      setCurrentPage(filteredUsers.totalPages);
      return;
    }
  }, [filteredUsers]);

  const table = useReactTable({
    data: filteredUsers?.users ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: filteredUsers?.page ?? 1,
        pageSize: filteredUsers?.limit ?? 10
      }
    },
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters
  });

  const exportData = async (isExcel: boolean = false) => {
    const data = await getUsersToFile(isExcel);
    if (!data) return;
    requestDownloadFile(data, 'users-list', isExcel);
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.users}>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={styles.colTitle}
                            onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽'
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            header.id === 'isDisabled' ? (
                              <div className={styles.radioButtons}>
                                {Object.values(RadioFiltersType).map((item, index) => {
                                  return (
                                    <RadioFilters
                                      key={index}
                                      column={header.column}
                                      id={header.id}
                                      type={item}
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              <div>
                                <Filter column={header.column} />
                              </div>
                            )
                          ) : null}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>

          <div className={styles.paginationContainer}>
            <button onClick={() => setCurrentPage(1)} disabled={!filteredUsers?.hasPrevPage}>
              {'<<'}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!filteredUsers?.hasPrevPage}>
              {'<'}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!filteredUsers?.hasNextPage}>
              {'>'}
            </button>
            <button
              onClick={() =>
                setCurrentPage(filteredUsers?.totalPages ? filteredUsers?.totalPages : 1)
              }
              disabled={!filteredUsers?.hasNextPage}>
              {'>>'}
            </button>
            <span className={styles.pageNumber}>
              <div>{t(`Manage_user_pagination_page`)}</div>
              <strong>
                {filteredUsers?.page} of {filteredUsers?.totalPages}
              </strong>
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}>
              {pageSizes.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {t(`Manage_user_pagination_show`)} {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.exportButtons}>
          <div className={styles.text}>{t('users_generate')}</div>
          <div className={styles.buttons}>
            <Button text="xlsx" onClick={() => exportData(true)} />
            <Button text="csv" onClick={() => exportData()} />
          </div>
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

export default Users;
