import { ISidebarMaterials } from '../KnowledgeBaseSidebar';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import React, { useMemo } from 'react';
import { ListItem } from '@material-ui/core';

const MaterialItem = React.forwardRef<HTMLDivElement, ISidebarMaterials>((props, ref) => {
  const { title, id, to, section, icon, ...other } = props;
  const history = useHistory();
  const materialId = history.location.pathname.split('/')[6];
  const newSection = history.location.pathname.split('/')[4];

  const isActive = useMemo(() => {
    return (
      +materialId === id ||
      (newSection === 'new' && to === history.location.pathname) ||
      (materialId === 'new' && to === history.location.pathname)
    );
  }, [id, materialId, newSection, history.location.pathname, to]);

  const toMaterial = () => {
    history.push(to);
  };

  return (
    <div ref={ref} {...other}>
      <ListItem
        button
        onClick={toMaterial}
        selected={isActive}
        sx={{
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: 'transparent',
            color: '#828ecc',
            '& .MuiListItemIcon-root': {
              color: '#828ecc',
            },
          },
          '&:hover': {
            background: 'transparent',
            color: '#828ecc',
            '& .MuiListItemText-root': {
              color: '#828ecc',
            },
            '& .MuiListItemIcon-root': {
              color: '#828ecc',
            },
          },
          paddingTop: '3px',
          paddingBottom: '3px',
        }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={title} primaryTypographyProps={{ fontSize: '14px' }} />
      </ListItem>
    </div>
  );
});

export default MaterialItem;
