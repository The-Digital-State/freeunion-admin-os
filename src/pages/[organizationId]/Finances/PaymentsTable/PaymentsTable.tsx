import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import useSortBy from 'hooks/useSortBy';

import { deletePaymentsThunk, getPaymentsThunk } from 'redux/slices/finance';

import { ModalContext } from 'context/Modal';

import { FilteredPaymentData, PaymentCreated, PaymentType } from 'shared/interfaces/finance';

import { Box, Typography } from '@material-ui/core';
import Table from 'components/molecules/Table';
import { TableColumn } from 'components/molecules/Table/Table';

import { toast } from 'react-toastify';

import PaymentCreation from '../PaymentCreation/PaymentCreation';

import { useDispatch, useSelector } from '../../../../redux';
import TrashIcon from '../../../../lib/material-kit/icons/Trash';
import { formatTableColumnDate } from 'helpers/formatTableColumnDate';

const columnsConfig: TableColumn[] = [
  {
    id: 'id',
    Header: 'ID',
    sort: false,
  },
  {
    id: 'title',
    Header: 'Все платежи',
    sort: false,
  },
  {
    id: 'type',
    Header: 'Тип платежа',
    sort: false,
  },
  {
    id: 'ammount',
    Header: 'Сумма',
    sort: false,
  },
  {
    id: 'date',
    Header: 'Дата создания',
    sort: false,
  },
  {
    id: 'status',
    Header: 'Статус',
    sort: false,
  },
];

const PaymentsTable = () => {
  const sortBy = useSortBy();
  const modalContext = useContext(ModalContext);
  const { organizationId } = useParams<{ organizationId }>();
  const [data, setData] = useState<FilteredPaymentData[]>();
  const dispatch = useDispatch();
  const payments: PaymentCreated[] = useSelector(({ finance }) => finance.payments);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getPaymentsThunk(organizationId));
      } catch (error) {
        toast.error(error);
      }
    })();
  }, [organizationId, dispatch]);

  useEffect(() => {
    setData(
      payments
        .map((payment) => {
          let paymentDateEnd;
          if (!!payment.date_end) {
            paymentDateEnd = new Date(payment.date_end);
            paymentDateEnd.setDate(new Date(payment.date_end).getDate() + 1);
          }
          const todayDate = new Date();
          return {
            id: payment.id,
            created_at: payment.created_at,
            type: !payment.type
              ? PaymentType.fundraising
              : payment.type === 2
              ? PaymentType.subscription
              : PaymentType.promotional,
            ammount: payment.ammount || '...',
            title: payment.title,
            status:
              !payment.auto_payments?.length && !payment.manual_payments?.length ? (
                <Typography sx={{ color: 'red' }}>Проблема</Typography>
              ) : !!payment.date_end && todayDate > paymentDateEnd ? (
                <Typography sx={{ color: 'gray' }}>Неактивен</Typography>
              ) : (
                'Активный'
              ),
          };
        })
        .reverse()
    );
  }, [organizationId, payments]);

  const handleRowClick = (id) => {
    modalContext.openModal(
      <PaymentCreation id={id} onClose={modalContext.closeModal} type={data.find((i) => i.id === id).type} />
    );
  };

  const handleDeletePayment = async (id: number) => {
    try {
      const isDelete = window.confirm('Вы действительно хотите удалить этот сбор?');

      if (isDelete) {
        dispatch(deletePaymentsThunk(+organizationId, id, data.find((i) => i.id === id).type));
        toast.success('Сбор удален');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      {data?.length ? (
        <Table
          sortBy={sortBy}
          columns={columnsConfig}
          data={data?.map((payment) => ({
            ...payment,
            date: formatTableColumnDate(payment.created_at),
          }))}
          onClickRow={handleRowClick}
          actions={[
            {
              id: 'delete',
              title: 'Удалить',
              onClick: handleDeletePayment,
              Icon: TrashIcon,
            },
          ]}
        />
      ) : (
        <Box sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>У вас нет сборов</Typography>
        </Box>
      )}
    </>
  );
};

export default PaymentsTable;
