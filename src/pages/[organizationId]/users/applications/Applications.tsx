import Head from 'react-helmet';
import { makeStyles } from '@material-ui/styles';
import Table from '../../../../components/molecules/Table';
import { Box, Divider, Typography } from '@material-ui/core';
import NavigationLayout from '../../../../components/layout/NavigationLayout/NavigationLayout';
import UsersPageTabLayout from '../../../../components/layout/UsersPageTabLayout/UsersPageTabLayout';
import { useContext, useEffect, useState } from 'react';
import NumberHighlight from '../../../../components/atoms/NumberHighlight';
import useApplications from '../../../../hooks/useApplications';
import usePagination from '../../../../hooks/usePagination';
import useFilters from '../../../../hooks/useFilters';
import useSelection from '../../../../hooks/useSelection';
import useSortBy from '../../../../hooks/useSortBy';
import { useParams } from 'react-router-dom';
import UserTableCell from '../../../../components/atoms/UserTableCell';
import dynamic from 'helpers/dynamic';
import DateTableCell from '../../../../components/atoms/DateTableCell';
import TableFooter from '../../../../components/molecules/TableFooter';
import { IApplication } from '../../../../services/api/applications';

import styles from './Applications.module.css';
import RejectApplicationModal from '../../../../components/organisms/RejectApplicationModal/RejectApplicationModal';
import FiltersList from '../../../../components/molecules/FiltersList';
import { FilterOperationType } from '../../../../services/api/types';
import { FilterListItem, FilterType } from '../../../../components/molecules/FiltersList/FiltersList';
import { TableColumn } from '../../../../components/molecules/Table/Table';
import { useSelector } from '../../../../redux';
import { ModalContext } from 'context/Modal';
import UserDetails from 'components/organisms/UserDetails';
import { User } from 'services/api/users';
import useUsers from 'hooks/useUsers';
import { useDispatch } from '../../../../redux';
import { getRequests, updateRequestsThunk } from 'redux/slices/requests';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ChatIcon } from '../../../../shared/icons/messages.svg';
import { RequestStatusesCodesEnum } from 'services/api/dictionaries';
import { toast } from 'react-toastify';
import { SortDirection } from 'types';

const AddAlertIcon = dynamic(require('@material-ui/icons/AddAlert'), {
  ssr: false,
});
const CheckCircle = dynamic(require('@material-ui/icons/CheckCircle'), {
  ssr: false,
});
const CancelSharp = dynamic(require('@material-ui/icons/CancelSharp'), {
  ssr: false,
});

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Applications() {
  const classes = useStyles();

  const { list, grandTotalCount, apply, reject } = useApplications();
  const { currentUser } = useUsers();

  const [listLocal, setListLocal] = useState<IApplication[]>(list.data);

  const params = useParams<{ organizationId?: string }>();

  const { organizationId } = params;
  const modalContext = useContext(ModalContext);

  const pagination = usePagination();
  const filters = useFilters();
  const selection = useSelection([]);
  const sortBy = useSortBy();
  const dispatch = useDispatch();
  const history = useHistory();

  const { dictionaries, profile } = useSelector((state) => {
    return {
      dictionaries: state.dictionaries,
      profile: state.profile,
    };
  });

  const isAdmin = currentUser.data?.permissions > 0;

  useEffect(() => {
    currentUser.fetch({
      organizationId: +organizationId,
      filters: {
        id: {
          value: profile.data.id,
          operation: FilterOperationType.EQ,
        },
      },
    });
  }, [profile.data]);

  useEffect(() => {
    list.fetch({
      organizationId: +organizationId,
      page: pagination.page,
      limit: pagination.perPage,
      filters: filters.values,
      sortBy:
        sortBy.field || sortBy.direction
          ? { field: sortBy.field, direction: sortBy.direction }
          : { field: 'created_at', direction: SortDirection.DESC },
    });
  }, [organizationId, pagination.page, pagination.perPage, filters.values, sortBy.direction, sortBy.field]);

  useEffect(() => {
    if (list?.loading) return;
    pagination.setPageCount(Math.ceil(list.totalCount / pagination.perPage));
  }, [list.totalCount, pagination.perPage]);

  useEffect(() => {
    grandTotalCount.fetch(Number(organizationId));
  }, [organizationId]);

  useEffect(() => {
    return () => {
      filters.resetFilters();
    };
  }, []);

  const tableColumns: TableColumn[] = [
    {
      id: 'user_id',
      Header: 'Все участники',
      Component: UserTableCell,
      sort: true,
      type: 'string',
    },
    {
      id: 'userId',
      Header: 'ID',
      sort: true,
      type: 'number',
    },
    {
      id: 'created_at',
      Header: 'Дата заявки',
      sort: true,
      type: 'date',
      Component: DateTableCell,
    },
    {
      id: 'status_text',
      Header: 'Статус',
      sort: true,
      type: 'string',
    },
    {
      id: 'comment',
      Header: 'Комментарий',
      sort: true,
      type: 'string',
    },
  ];

  const filterValues: FilterListItem[] = [
    {
      key: 'mainSearch',
      label: '',
      toolbarTitle: '',
      type: FilterType.STRING,
      operation: FilterOperationType.VAL,
      value: filters.values['mainSearch']?.value,
      selectByDefault: true,
    },
    {
      key: 'created_at',
      label: 'Дата поступления',
      toolbarTitle: 'Дата поступления',
      type: FilterType.DATE_RANGE,
      operation: FilterOperationType.BW,
      value: filters.values['created_at']?.value,
      selectByDefault: true,
    },
  ];

  const filterKeys = () => {
    return filterValues.map((item) => item.key);
  };

  useEffect(() => {
    if (!list?.data) {
      setListLocal([]);
    }

    const column = tableColumns.find((col) => col.id === sortBy.field);
    let applications = list.data;

    if (column) {
      applications = sortBy.sort(applications || [], column.type);
    }

    setListLocal(applications);
  }, [list.data, filters.values, sortBy.direction, sortBy.field]);

  const handleRowClick = (id, isUser?) => {
    // logic is bullshit
    modalContext.openModal(
      <UserDetails
        requestId={!isUser ? id : undefined}
        userId={isUser ? id : undefined}
        isAdmin={isAdmin}
        handleReferralClick={(id) => handleRowClick(id, true)}
        close={() => {
          // if (!customData) {
          //   loadData();
          // }
          modalContext.closeModal();
        }}
      />
    );
  };

  const applyAllApplication = async () => {
    try {
      await Promise.all(
        selection.selected.map((request) => {
          return apply.fetch({
            organizationId: +organizationId,
            request,
          });
        })
      );
    } finally {
      selection.onClear();
      list.fetch({
        organizationId: +organizationId,
        page: pagination.page,
        limit: pagination.perPage,
        filters: filters.values,
        sortBy:
          sortBy.field || sortBy.direction
            ? { field: sortBy.field, direction: sortBy.direction }
            : { field: 'created_at', direction: SortDirection.DESC },
      });
    }
  };

  const handleApplyApplication = async (request: number) => {
    try {
      await apply.fetch({
        organizationId: +organizationId,
        request,
      });
      dispatch(updateRequestsThunk(RequestStatusesCodesEnum.active, request));
      toast.success('Вы приняли пользователя!');
    } finally {
      list.fetch({
        organizationId: +organizationId,
        page: pagination.page,
        limit: pagination.perPage,
        filters: filters.values,
        sortBy:
          sortBy.field || sortBy.direction
            ? { field: sortBy.field, direction: sortBy.direction }
            : { field: 'created_at', direction: SortDirection.DESC },
      });
    }
  };

  const [applicationForReject, setApplicationForReject] = useState<IApplication>();
  const [isRejectApplicationMadalOpen, setRejectApplicationMadalOpen] = useState<boolean>(false);

  const handleRejectApplication = (applicationId: number) => {
    const application = list.data.find((item) => item.id === applicationId);
    setRejectApplicationMadalOpen(true);
    setApplicationForReject(application);
  };

  const submitRejectingApplication = async (request: number, comment: string) => {
    try {
      await reject.fetch({
        organizationId: +organizationId,
        request,
        comment,
      });
      dispatch(updateRequestsThunk(RequestStatusesCodesEnum.declined, request));
      toast.success('Вы отклонили заявку пользователя!');
    } finally {
      setRejectApplicationMadalOpen(false);
      setApplicationForReject(null);
      list.fetch({
        organizationId: +organizationId,
        page: pagination.page,
        limit: pagination.perPage,
        filters: filters.values,
        sortBy:
          sortBy.field || sortBy.direction
            ? { field: sortBy.field, direction: sortBy.direction }
            : { field: 'created_at', direction: SortDirection.DESC },
      });
    }
  };

  return (
    <>
      <Head>
        <title>Заявки</title>
      </Head>
      <UsersPageTabLayout
        title="Участники"
        actions={
          Number.isInteger(grandTotalCount.valueAll)
            ? [
                <Box key="all" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ marginRight: 1 }}>ВСЕГО: </Typography>
                  <NumberHighlight>{grandTotalCount.valueAll}</NumberHighlight>
                </Box>,
                <Box key="new" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ marginRight: 1 }}>НОВЫЕ: </Typography>
                  <NumberHighlight>{grandTotalCount.valueNew}</NumberHighlight>
                </Box>,
              ]
            : []
        }
      >
        <FiltersList
          availableKeys={filterKeys()}
          values={filterValues}
          onChange={filters.setValue}
          resetFilters={filters.resetFilters}
          isEmpty={filters.isEmpty()}
        />

        <Divider />

        <Table
          columns={tableColumns}
          data={listLocal.map((user) => {
            return {
              ...user,
              userId: user.user_id.id,
            };
          })}
          onClickRow={handleRowClick}
          actions={[
            {
              id: 'apply',
              title: 'Одобрить',
              onClick: handleApplyApplication,
              Icon: CheckCircle,
              iconClassName: styles.applyIcon,
              showCallback: (row: IApplication) => !row.status,
            },
            {
              id: 'reject',
              title: 'Отклонить',
              onClick: handleRejectApplication,
              Icon: CancelSharp,
              iconClassName: styles.rejectIcon,
              showCallback: (row: IApplication) => !row.status,
            },
            {
              id: 'chat',
              title: 'Чат',
              onClick: (id) => {
                const userId = listLocal.find((user) => user.id === id).user_id.id;
                history.push(`/${organizationId}/chat?id=${userId}&type=user`);
              },
              Icon: ChatIcon,
            },
            // {
            //   id: 'notify',
            //   title: 'Отправить уведомление',
            //   onClick: handleSendNotification,
            //   Icon: AddAlertIcon,
            // },
          ]}
          loading={list.loading || apply.loading}
          sortBy={sortBy}
          hasFooter
          {...selection}
        />
        <TableFooter
          count={list.totalCount}
          onPageChange={(value) => pagination.setPage(value + 1)}
          onRowsPerPageChange={(value) => pagination.setPerPage(value)}
          page={pagination.page - 1}
          rowsPerPage={pagination.perPage}
          rowsPerPageOptions={[10, 25, 50]}
          selected={selection.selected?.length}
          isAllSelected={selection.isAllSelected}
          mainAction={[
            {
              label: 'Одобрить все заявки',
              onClick: () => applyAllApplication(),
              disabled: selection.isAllSelected || !selection.selected.length,
            },
          ]}
        />
      </UsersPageTabLayout>
      <RejectApplicationModal
        open={isRejectApplicationMadalOpen}
        setOpen={setRejectApplicationMadalOpen}
        onSubmit={submitRejectingApplication}
        submitting={reject.loading}
        request={applicationForReject?.id}
      />
    </>
  );
}
