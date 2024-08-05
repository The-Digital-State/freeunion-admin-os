import React, { ReactElement, useMemo } from 'react';

import { Box } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useParams } from 'react-router';
import { routes } from 'Routes';
import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from '../../../../../redux';
import SectionItem from './SectionItem/SectionItem';
import MaterialItem from './MaterialItem/MaterialItem';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { dragMaterial } from 'services/api/kbase';
import { getMaterialsAction } from 'redux/slices/articles';
import { KbaseMaterialAdmin, KbaseSectionLight } from 'shared/interfaces/kbase';

export interface ISidebarMaterials {
  title: string;
  id?: number;
  icon?: ReactElement<any, any>;
  to?: string;
  section?: KbaseSectionLight;
  index?: number;
}

export interface ISidebarData {
  title: string;
  id?: number;
  icon?: ReactElement<any, any>;
  to?: string;
  firstLevel?: boolean;
  items?: ISidebarMaterials[];
}

export default function KnowledgeBaseSidebar(): JSX.Element {
  const dispatch = useDispatch();
  const { organizationId } = useParams<{ organizationId?: string }>();

  const sections: KbaseSectionLight[] = useSelector(({ articles }) => articles.sections);
  const materials: KbaseMaterialAdmin[] = useSelector(({ articles }) => articles.materials);

  const sidebarSections: ISidebarData[] = useMemo(() => {
    return sections.map((section) => ({
      title: section.name,
      id: section.id,
      to: `${routes.kbase.getLinkCreateKbase(organizationId)}/${section.id}`,
    }));
  }, [sections, organizationId]);

  const addNewSection: ISidebarData = {
    title: 'Добавить раздел',
    to: `${routes.kbase.getLinkCreateKbase(organizationId)}/new`,
    icon: <AddCircleOutlineIcon />,
  };

  const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
    try {
      if (!destination) {
        return;
      }
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      let sectionMaterials = materials
        .filter((material) => material.section_id === +source.droppableId)
        .sort((a, b) => a.index - b.index);

      let rowIndex = sectionMaterials[destination.index].index;

      if (source.index > destination.index) {
        rowIndex -= 1;
      } else if (destination.index === 0) {
        rowIndex = 1;
      }

      await dragMaterial(+organizationId, draggableId, rowIndex);
      await dispatch(getMaterialsAction(+organizationId));
      toast('Материал перемещен!');
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  return (
    <Box
      sx={{
        width: '30%',
      }}
    >
      <MaterialItem key="newSection" title={addNewSection.title} to={addNewSection.to} icon={addNewSection.icon} />
      <DragDropContext onDragEnd={handleDragEnd}>
        {sidebarSections.map((section) => (
          <SectionItem key={section.id} section={section} />
        ))}
      </DragDropContext>
    </Box>
  );
}
