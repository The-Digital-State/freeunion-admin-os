import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, makeStyles, Typography } from '@material-ui/core';
import useLists from '../../../hooks/useLists';
// import usePagination from '../../../hooks/usePagination';
import Table from '../../molecules/Table';
import Modal from '../../molecules/Modal';
// import TableFooter from '../../molecules/TableFooter';

const MembersList = ({ onClickRow }) => {
  const params = useParams<{ organizationId?: string }>();
  // const pagination = usePagination();
  const { list } = useLists();

  const { organizationId } = params;

  useEffect(() => {
    list.fetch({ organizationId: +organizationId, page: 0, limit: 0 });
    // list.fetch({ organizationId: +organizationId, page: pagination.page, limit: pagination.perPage });
  }, [organizationId]);
  // }, [organizationId, pagination.page, pagination.perPage]);

  const handleRowClick = (id) => {
    onClickRow(list.data.find((x) => x.id === id));
  };

  return (
    <>
      <Table
        columns={[
          {
            id: 'id',
            Header: 'ID',
          },
          {
            id: 'name',
            Header: 'Название',
          },
        ]}
        data={list.data}
        onClickRow={handleRowClick}
        loading={list.loading}
      />
      {/* <TableFooter
        count={list.totalCount}
        onPageChange={(value) => pagination.setPage(value + 1)}
        onRowsPerPageChange={(value) => pagination.setPerPage(value)}
        page={pagination.page - 1}
        rowsPerPage={pagination.perPage}
        rowsPerPageOptions={[10, 25, 50]}
      /> */}
    </>
  );
};

const useStyles = makeStyles({
  paper: {
    minWidth: 700,
    maxWidth: 'fit-content',
    minHeight: 200,
  },
});

export interface IAllUsersAddSelectedToListModal {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (id: number) => void;
  submitting: boolean;
  disabled?: boolean;
  selected: number;
}

const AllUsersAddSelectedToListModal = ({
  open,
  setOpen,
  onSubmit,
  submitting,
  disabled,
  selected,
}: IAllUsersAddSelectedToListModal) => {
  const classes = useStyles();
  const [list, setList] = useState<{ id: number; name: string }>(null);

  const _disabled = !Number.isInteger(list?.id);

  useEffect(() => {
    if (!open) {
      setList(null);
    }
  }, [open]);

  return (
    <Modal
      title="Добавить в Список"
      submitLabel="Добавить"
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={() => onSubmit(list.id)}
      submitting={submitting}
      disabled={disabled || _disabled}
      classes={classes}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ m: 1 }}>
          <Typography color="textPrimary" variant="subtitle2">
            Добавить выбранных пользователей ({selected}) в список{' '}
            {list?.name ? `"${list.name}"` : <i>[не выбранно]</i>}
          </Typography>
        </Box>
        <Box sx={{ m: 1 }}>
          <MembersList onClickRow={(list) => setList(list)} />
        </Box>
      </Box>
    </Modal>
  );
};

export default AllUsersAddSelectedToListModal;
