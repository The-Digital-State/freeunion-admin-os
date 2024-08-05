import { useState } from 'react';
import { Socials } from 'shared/interfaces/organization';
import { InputLabel, Select, MenuItem, FormControl, Box } from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';

const allSocials = [
  { type: Socials.telegram, title: 'Телеграм' },
  { type: Socials.youtube, title: 'YouTube' },
  { type: Socials.instagram, title: 'Инстаграм' },
  { type: Socials.facebook, title: 'Facebook' },
  { type: Socials.vk, title: 'Вконтакте' },
  { type: Socials.tiktok, title: 'TikTok' },
  { type: Socials.ok, title: 'Одноклассники' },
  { type: Socials.other, title: 'Другое' },
];

const AddNewSocial = ({ currentSocials, setCurrentSocials }) => {
  const [newSocial, setNewSocial] = useState<Socials | ''>('');

  const diffSocials = allSocials.filter(
    (social) => !currentSocials.find((currentSocial) => currentSocial.type === social.type)
  );

  if (diffSocials.length < 1) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
      <FormControl sx={{ mr: '20px' }}>
        <InputLabel id="social-network-label">Социальная сеть</InputLabel>
        <Select
          sx={{ width: '200px' }}
          label="Социальная сеть"
          labelId="social-network-label"
          id="demo-simple-select"
          value={newSocial}
          variant="outlined"
          onChange={(e) => setNewSocial(e.target.value)}
        >
          {diffSocials.map((social) => (
            <MenuItem key={social.type} value={social.type}>
              {social.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          const socialToAdd = allSocials.find((social) => social.type === newSocial);
          if (!socialToAdd) return;
          setCurrentSocials('social', [...currentSocials, socialToAdd]);
          setNewSocial('');
        }}
      >
        ДОБАВИТЬ
      </Button>
    </Box>
  );
};

export default AddNewSocial;
