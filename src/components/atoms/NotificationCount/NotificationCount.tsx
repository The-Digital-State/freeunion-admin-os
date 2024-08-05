import { Box } from '@material-ui/core';

type NotificationCountProps = {
  count: number;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
};

const NotificationCount = ({ count, top, right, left, bottom }: NotificationCountProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: top,
        right: right,
        left: left,
        bottom: bottom,
        borderRadius: '50%',
        backgroundColor: 'crimson',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '12px',
      }}
    >
      {count}
    </Box>
  );
};

export default NotificationCount;
