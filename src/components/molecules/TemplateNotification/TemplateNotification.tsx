import { Box, InputAdornment, TextField } from '@material-ui/core';

const TemplateNotification = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          m: -1,
          p: 2,
          paddingBottom: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
              }}
              variant="outlined"
            />
          </Box>
        </Box>
        {}
      </Box>
    </>
  );
};

export default TemplateNotification;
