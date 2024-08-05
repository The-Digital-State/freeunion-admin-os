import { Chip, makeStyles, TextField, Box } from '@material-ui/core';
import { useState } from 'react';

type TagsInputProps = {
  tags: string[];
  suggestedTags?: string[];
  onChange: (tags: string[]) => void;
  isMaterial?: boolean;
};
const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
}));

export const TagsInput = ({ tags, suggestedTags, onChange, isMaterial }: TagsInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const classes = useStyles();
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const duplicatedValues = tags.indexOf(e.target.value.trim());
      if (duplicatedValues !== -1) {
        setInputValue('');
        return;
      }
      if (!e.target.value.replace(/\s/g, '').length) return;

      onChange([...tags, inputValue]);
      setInputValue('');
    }
  };

  const handleDelete = (item: string) => {
    onChange(tags.filter((tag) => item !== tag));
  };

  return (
    <Box style={{ width: '440px' }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Тэги"
        placeholder="Напишите тег и нажмите Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Box style={{ maxWidth: '100%', display: 'flex', flexWrap: 'wrap' }}>
        {tags.map((item) => (
          <Chip key={item} tabIndex={-1} label={item} className={classes.chip} onDelete={() => handleDelete(item)} />
        ))}
      </Box>
      {!isMaterial && (
        <>
          <h3>Популярные теги:</h3>
          <Box style={{ maxWidth: '100%', display: 'flex', flexWrap: 'wrap' }}>
            {suggestedTags.map((item) => {
              if (tags.includes(item)) {
                return null;
              }

              return (
                <Chip
                  key={item}
                  tabIndex={-1}
                  label={item}
                  className={classes.chip}
                  onClick={() => {
                    onChange([...tags, item]);
                  }}
                />
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};
