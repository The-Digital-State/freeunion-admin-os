import React from 'react';
import { Box, NativeSelect, FormControl, TextField, IconButton, InputAdornment } from '@material-ui/core';
import NotificationPageTabLayout from '../../../../components/layout/NotificationPageTabLayout/NotificationPageTabLayout';
import Head from 'react-helmet';
import Search from '../../../../lib/material-kit/icons/Search';

export default function AllNotification() {
  return (
    <>
      <Head>
        <title>Уведомления</title>
      </Head>
      <NotificationPageTabLayout
        title="Уведомления объединения"
        actions={[
          <Box key="all" sx={{ marginTop: 1.5, alignItems: 'center' }}>
            <FormControl>
              <NativeSelect defaultValue={1} disableUnderline={true}>
                <option value={1}>Все</option>
                <option value={2}>Исходящие</option>
                <option value={3}>Входящие</option>
              </NativeSelect>
            </FormControl>
          </Box>,
        ]}
      >
        <Box sx={{ p: 3, maxWidth: '100%' }}>
          <Box sx={{ maxWidth: '458px' }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton></IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Поиск"
              variant="outlined"
            />
          </Box>
        </Box>
      </NotificationPageTabLayout>
    </>
  );
}
