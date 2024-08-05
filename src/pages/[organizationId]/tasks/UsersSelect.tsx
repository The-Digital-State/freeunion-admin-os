import { Checkbox, FormControl, ListItemText, InputLabel, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from '../../../redux';
import { setFilteredIds } from 'shared/slices/tasks';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function UsersSelect({ getOrganizationUsers, orgId }) {
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();
  const filteredIds = useSelector(state => state.tasks.filteredIds);

  React.useEffect(() => {
    (async () => {
      if (getOrganizationUsers && orgId) {
        const { data } = await getOrganizationUsers({ organizationId: orgId });
        setUsers(data);
      }
    })();
  }, [orgId]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    dispatch(setFilteredIds(value))
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="users-multiple-checkbox-label">Участники</InputLabel>
        <Select
          labelId="users-multiple-checkbox-label"
          id="users-multiple-checkbox"
          multiple
          value={filteredIds}
          onChange={handleChange}
          input={<OutlinedInput label="Участники" />}
          renderValue={(selected) => {
            return selected.map(key => {
              const user = users.find(({ id }) => key === id);
              return `${user?.firstName} ${user?.lastName}`;
            }).join(', ')
          }}
          MenuProps={MenuProps}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Checkbox checked={filteredIds.indexOf(user.id) > -1} />
              <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}