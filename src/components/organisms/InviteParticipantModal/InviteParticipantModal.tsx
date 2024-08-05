import { useState } from 'react';
import { Box } from '@material-ui/core';
import Modal from '../../molecules/Modal';
import dynamic from 'helpers/dynamic';
import { generateLink } from '../../../services/api/invite-links';
import { generateInviteLinkString } from '../../../helpers/generate-invite-link';
import { useSelector } from '../../../redux';
import { useParams } from 'react-router-dom';

const AddAlertIcon = dynamic(require('@material-ui/icons/AddAlert'), {
  ssr: false,
});
const GroupIcon = dynamic(require('@material-ui/icons/Group'), { ssr: false });

export interface IInviteParticipantModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit?: (name: string) => void;
  submitting?: boolean;
  disabled?: boolean;
}

const InviteParticipantModal = ({ open, setOpen, submitting, disabled }: IInviteParticipantModalProps) => {
  const params = useParams<{ organizationId?: string }>();
  const { data: profile } = useSelector((state) => state.profile);
  const { organizationId } = params;

  const [loading, setLoading] = useState(false);

  const [generatedLink, setGeneratedLink] = useState<string>();
  const [isLimitExceeded, setIsLimitExceededStatus] = useState<boolean>(false);
  const [linkWasCopied, setLinkWasCopiedStatus] = useState<boolean>(false);

  const generateInviteLink = async () => {
    try {
      setLoading(true);
      const result = await generateLink(organizationId);
      // if (result.invites === 0) {
      //   setIsLimitExceededStatus(true);
      //   setLoading(false);
      //   return;
      // }
      const { id, code } = result;
      const link = generateInviteLinkString(id, code);
      setGeneratedLink(link);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator?.clipboard?.writeText(
      'Приглашение действительно 24 часа. \nПри переходе из Беларуси включите VPN! \n' + generatedLink
    );

    setLinkWasCopiedStatus(true);
  };

  const _disabled = disabled || submitting;

  let content;
  if (isLimitExceeded) {
    content = (
      <>
        <Box sx={{ pb: 1 }}>Вам доступно 20 приглашений в сутки.</Box>
        <Box>Ваш лимит ссылок на сегодня исчерпан, попробуйте завтра.</Box>
      </>
    );
  }

  if (!isLimitExceeded) {
    content = generatedLink ? (
      <>
        <Box
          sx={{
            backgroundColor: 'background.default',
            p: 2,
            borderRadius: 1,
            wordBreak: 'break-word',
            color: '#EE1C29',
          }}
        >
          {generatedLink}
        </Box>
        <Box sx={{ p: 2 }}>{linkWasCopied && <span>Ссылка-приглашение успешно скопирована в буфер обмена.</span>}</Box>
      </>
    ) : (
      <>
        <Box sx={{ display: 'flex', pt: 1, pb: 1 }}>
          <Box sx={{ pr: 3 }}>
            <AddAlertIcon />
          </Box>
          <Box sx={{ textTransform: 'uppercase' }}>
            На странице “Безопасность” этот человек будет отмечен как ваше доверенное лицо. Вам доступно два приглашения
            в сутки, администратор может пригласить на платформу (в объединение) до 20 человек в сутки.
          </Box>
        </Box>
        <Box sx={{ display: 'flex', pt: 1, pb: 1 }}>
          <Box sx={{ pr: 3 }}>
            <GroupIcon />
          </Box>
          <Box sx={{ textTransform: 'uppercase' }}>
            на платформу попадают лишь доверенные люди - те, за кого поручился кто-то. если вдруг внутри оказывается
            нехороший человек, можно отследить, кто пригласил его в систему и увидеть целую ветку неблагонадежных людей.
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Modal
      title="Отправьте ссылку-приглашение человеку,которому вы доверяете"
      submitLabel={generatedLink ? 'Скопировать ссылку' : 'Генерировать ссылку-приглашение'}
      open={open}
      onClose={() => {
        setOpen(false);
        setLinkWasCopiedStatus(false);
        setGeneratedLink(null);
        setIsLimitExceededStatus(false);
      }}
      onSubmit={() => (generatedLink ? copyLink() : generateInviteLink())}
      submitting={submitting || loading}
      disabled={disabled || _disabled}
      maxWidth="lg"
    >
      <Box
        sx={{
          minHeight: 100,
          minWidth: 700,
          width: 700,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {open && content}
      </Box>
    </Modal>
  );
};

export default InviteParticipantModal;
