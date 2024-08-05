import { Box, Grid, IconButton, TextField } from '@material-ui/core';
import { Done, Pending } from '@material-ui/icons';
import { ModalContext } from 'context/Modal';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { deleteAutoPostingChannelThunk } from 'redux/slices/news';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';
import formatServerError from 'shared/utils/formatServerError';
import { NewsAutoPost } from 'types/news';
import TrashIcon from '../../../../../lib/material-kit/icons/Trash';
import { useSelector, useDispatch } from '../../../../../redux';
import ChannelCodeModal from '../NewAutoPostingChannel/ChannelCodeModal/ChannelCodeModal';

const ChannelsAutoPosting = ({ organizationId }: { organizationId: string }) => {
  const autoPostingTelegrams: NewsAutoPost[] = useSelector(({ news }) => news.autoPostingTelegrams);
  const dispatch = useDispatch();
  const modalContext = useContext(ModalContext);

  const removeChannel = async (id: number) => {
    try {
      dispatch(deleteAutoPostingChannelThunk(organizationId, id));
      toast('Канал удален!');
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  const openModal = (verifyCode: string) => {
    modalContext.openModal(<ChannelCodeModal verifyCode={verifyCode} />);
  };

  if (!autoPostingTelegrams.length) {
    return null;
  }

  return (
    <Grid item md={12} xs={12} gap={4} p={4} pt={0} display="flex" flexDirection="column">
      {autoPostingTelegrams.map((item, index) => {
        return (
          <Box
            key={index}
            style={{
              display: 'flex',
            }}
          >
            <TextField
              name={`channel-${item.channel}-${index}`}
              style={{ width: '45%', height: 50, marginRight: 30 }}
              key={`${index}.channel`}
              fullWidth
              label="Ссылка на канал"
              placeholder={'@test_channel'}
              value={item.channel}
              disabled
              variant="outlined"
            />
            <TextField
              name={`channel-${item.name}-${index}`}
              style={{ width: '30%', height: 50, marginRight: 30 }}
              key={`${index}.name`}
              fullWidth
              label="Название канала"
              value={item.name}
              disabled
              variant="outlined"
            />

            <>
              <IconButton
                onClick={() => {
                  if (window.confirm('Вы действительно хотите удалить канал?')) {
                    removeChannel(item.id);
                  }
                }}
                data-tip
                data-for={`deleteAutoPostChannelTooltip`}
              >
                <TrashIcon />
              </IconButton>
              <Tooltip id="deleteAutoPostChannelTooltip" title="Удалить канал!" />
            </>
            <>
              <IconButton
                onClick={() => {
                  if (!item.verified) {
                    openModal(item.verify_code);
                  }
                  return;
                }}
                data-tip
                data-for={`checkAutoPostChannelTooltip`}
              >
                {item.verified ? <Done /> : <Pending />}
              </IconButton>
              <Tooltip
                id="checkAutoPostChannelTooltip"
                title={item.verified ? 'Канал верифицирован' : 'Посмотреть код'}
              />
            </>
          </Box>
        );
      })}
    </Grid>
  );
};

export default ChannelsAutoPosting;
