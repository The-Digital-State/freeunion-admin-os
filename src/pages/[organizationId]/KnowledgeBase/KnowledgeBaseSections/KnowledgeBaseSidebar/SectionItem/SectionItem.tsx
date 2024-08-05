import React, { useEffect, useMemo, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useHistory, useParams } from 'react-router';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { routes } from 'Routes';
import { ISidebarData, ISidebarMaterials } from '../KnowledgeBaseSidebar';
import { useSelector } from '../../../../../../redux';
import MaterialItem from '../MaterialItem/MaterialItem';
import { withStyles } from '@material-ui/core';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { KbaseMaterialAdmin } from 'shared/interfaces/kbase';

export const MiuListItem = withStyles({
  root: {
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
  },
})(ListItem);

const SectionItem = React.memo(({ section }: { section: ISidebarData }) => {
  const history = useHistory();
  const { organizationId } = useParams<{ organizationId?: string }>();

  const sectionId = history.location.pathname.split('/')[4];

  const isActive = useMemo(() => {
    return +sectionId === section.id;
  }, [section.id, sectionId]);

  const [open, setOpen] = useState(isActive);

  const materials = useSelector(({ articles }) =>
    articles.materials.filter(
      (material: KbaseMaterialAdmin) => !!material.published_at && material.section_id === section.id
    )
  );

  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  const sidebarMaterials: ISidebarMaterials[] = useMemo(() => {
    if (!!materials.length) {
      return materials.map((material) => ({
        title: material.title,
        id: material.id,
        to: `${routes.kbase.getLinkCreateKbase(organizationId)}/${section.id}/material/${material.id}`,
        index: material.index,
      }));
    }
  }, [organizationId, materials, section.id]);

  const addNewArticle = {
    title: 'Добавить публикацию',
    to: `${routes.kbase.getLinkSection(organizationId, section.id)}/material/new`,
    icon: <AddCircleOutlineIcon />,
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
    history.push(`${routes.kbase.getLinkCreateKbase(organizationId)}/${section.id}`);
  };

  return (
    <React.Fragment>
      <MiuListItem button onClick={handleClick} selected={isActive}>
        <ExpandLessIcon
          sx={{
            mr: '5px',
            transition: 'all .3s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(90deg)',
          }}
        />
        <ListItemText primary={section.title} />
      </MiuListItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          padding: '0 0 0 20px',
        }}
      >
        <Droppable droppableId={`${section?.id}`} type="card">
          {(provided, snapshot): JSX.Element => (
            <div ref={provided.innerRef}>
              <MaterialItem title={addNewArticle.title} to={addNewArticle.to} icon={addNewArticle.icon} />
              {!!sidebarMaterials?.length &&
                sidebarMaterials
                  .sort((a, b) => a.index - b.index)
                  .map((material, index) => (
                    <Draggable draggableId={`${material.id}`} index={index} key={material.id}>
                      {(_provided): JSX.Element => (
                        <MaterialItem
                          key={material.id}
                          title={material.title}
                          to={material.to}
                          id={material.id}
                          section={material.section}
                          ref={_provided.innerRef}
                          {..._provided.draggableProps}
                          {..._provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Collapse>
    </React.Fragment>
  );
});

export default SectionItem;
