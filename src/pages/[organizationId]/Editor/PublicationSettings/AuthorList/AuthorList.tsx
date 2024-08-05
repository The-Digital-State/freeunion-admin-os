import { Box, List, ListItem, Typography } from '@material-ui/core';
import { uniqBy, remove } from 'lodash';
import { toast } from 'react-toastify';

import ChipButtonAdd from 'components/atoms/ChipButtonAdd';
import { ModalContext } from 'context/Modal';
import UsersTable from 'pages/[organizationId]/users/all/UsersTable/UsersTable';
import { useContext, useState } from 'react';
import { User } from 'types/User';
import { useStyles } from '../PublicationSettings';
import { Author } from './Author';
type AuthorListProps = {
  authors: User[];
  onChange: (authors: User[]) => void;
};

export const AuthorList = ({ authors, onChange }: AuthorListProps) => {
  const modalContext = useContext(ModalContext);

  const classes = useStyles();
  return (
    <Box className={classes.item}>
      <Typography className={classes.itemLabel}>Aвтор:</Typography>
      <List style={{ padding: 0 }}>
        {authors.length
          ? authors.map((author) => (
              <Author
                key={author.id}
                author={author}
                onDelete={() => onChange(remove(authors, (authorItem) => authorItem.id !== author.id))}
              />
            ))
          : null}
        <ListItem>
          <ChipButtonAdd
            label={'Добавить'}
            onClick={() => {
              modalContext.openModal(
                <UsersTable
                  actions={[
                    {
                      label: 'Добавить',
                      onClick: (selection, users) => {
                        modalContext.closeModal();

                        if (selection.isAllSelected) {
                          toast.error('Нельзя добавить сразу всех пользователей');
                          return;
                        }

                        const selectedUser: User[] = users.map((user) => {
                          return {
                            id: user.id,
                            public_avatar: user?.avatar,
                            public_name: user?.firstName,
                            public_family: user?.lastName,
                          };
                        });
                        onChange(uniqBy([...authors, ...selectedUser], 'id'));
                      },
                    },
                  ]}
                />,
                { maxWidth: false, title: 'Все участники' }
              );
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
