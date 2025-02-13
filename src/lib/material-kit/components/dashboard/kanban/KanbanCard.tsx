import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, AvatarGroup, Box, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import CheckIcon from '../../../icons/Check';
import ChatAltIcon from '../../../icons/ChatAlt';
import DocumentTextIcon from '../../../icons/DocumentText';
import EyeIcon from '../../../icons/Eye';
import { useSelector } from '../../../store';
import type { RootState } from '../../../store';
import type { Card as CardType, Column, Member } from '../../../types/kanban';
import KanbanCardModal from './KanbanCardModal';

interface KanbanCardProps {
  cardId: string;
  dragging: boolean;
  index?: number;
  column: Column;
  style?: Record<any, any>;
}

interface PopulatedCard extends CardType {
  members: Member[];
}

const cardSelector = (state: RootState, cardId: string): PopulatedCard => {
  const { cards, members } = state.kanban;
  const card = cards.byId[cardId];

  return {
    ...card,
    members: card.memberIds.map((memberId: string) => members.byId[memberId]),
  };
};

const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>((props, ref) => {
  const { cardId, dragging, column, ...other } = props;
  const card = useSelector((state) => cardSelector(state, cardId));
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <Box
      ref={ref}
      sx={{
        outline: 'none',
        py: 1,
      }}
      {...other}
    >
      <Card
        onClick={handleOpen}
        raised={dragging}
        sx={{
          ...(dragging && {
            backgroundColor: 'background.paper',
          }),
          '&:hover': {
            backgroundColor: 'background.default',
          },
        }}
        variant={dragging ? 'elevation' : 'outlined'}
      >
        {card.cover && <CardMedia image={card.cover} sx={{ height: 200 }} />}
        <CardContent>
          <Typography color="textPrimary" variant="subtitle2">
            {card.name}
          </Typography>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 2,
              '& svg:not(:first-of-type)': {
                ml: 2,
              },
            }}
          >
            {card.isSubscribed && <EyeIcon fontSize="small" />}
            {card.attachments.length > 0 && <DocumentTextIcon fontSize="small" />}
            {card.checklists.length > 0 && <CheckIcon fontSize="small" />}
            {card.comments.length > 0 && <ChatAltIcon fontSize="small" />}
            <Box sx={{ flexGrow: 1 }} />
            {card.members.length > 0 && (
              <AvatarGroup max={5}>
                {card.members.map((member) => (
                  <Avatar key={member.id} src={member.avatar} />
                ))}
              </AvatarGroup>
            )}
          </Box>
        </CardContent>
      </Card>
      <KanbanCardModal card={card} column={column} onClose={handleClose} open={open} />
    </Box>
  );
});

KanbanCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  dragging: PropTypes.bool,
  index: PropTypes.number,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  style: PropTypes.object,
};

KanbanCard.defaultProps = {
  dragging: false,
};

export default KanbanCard;
