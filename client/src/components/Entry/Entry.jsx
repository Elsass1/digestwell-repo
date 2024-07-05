import React, { useState } from 'react';
import { deleteEntry, editEntry } from '../../apiService';
import {
  Container,
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { blue } from '@mui/material/colors';

const Entry = ({
  name,
  select,
  createdAt,
  id,
  isEditing,
  health_impact,
  setEntriesList,
  symptoms,
  stool_type,
  is_bleeding,
  other_symptoms,
}) => {
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedSelect, setUpdatedSelect] = useState(select);
  const [updatedHealthImpact, setUpdatedHealthImpact] = useState(
    health_impact || 'Neutral'
  );

  const handleDelete = () => {
    deleteEntry(id).then(() => {
      setEntriesList((prevList) => prevList.filter((entry) => entry.id !== id));
    });
  };

  const toggleEdit = () => {
    setEntriesList((prevList) =>
      prevList.map((entry) =>
        entry.id === id ? { ...entry, isEditing: !entry.isEditing } : entry
      )
    );
  };

  const handleSave = async () => {
    const editedEntry = {
      name: updatedName,
      select: updatedSelect,
      health_impact: updatedHealthImpact,
    };

    await editEntry(id, editedEntry);

    setEntriesList((prevList) => {
      const updatedEntries = prevList.map((entry) => {
        if (entry.id === id) {
          return { ...entry, ...editedEntry, isEditing: false };
        } else {
          return entry;
        }
      });
      return updatedEntries;
    });
  };

  function colorPicker(value) {
    switch (value) {
      case 'Beneficial':
        return {
          color: 'green',
          fontWeight: 'bold',
        };
      case 'Neutral':
        return {
          color: 'secondary.main',
          fontWeight: 'bold',
        };
      case 'Avoid':
        return {
          color: 'red',
          fontWeight: 'bold',
        };
      default:
        return blue;
    }
  }

  const handleChangeName = (event) => {
    setUpdatedName(event.target.value);
  };

  const handleChangeSelect = (event) => {
    setUpdatedSelect(event.target.value);
  };

  const handleHealthImpact = (event) => {
    setUpdatedHealthImpact(event.target.value);
  };

  return (
    <Container maxWidth='md' sx={{ mb: 2 }}>
      <Paper elevation={10} sx={{ p: 2, borderRadius: '20px' }}>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            width='100%'
          >
            <Box display='flex' flexDirection='column' gap={1} flexGrow={1}>
              {(name || select) && (
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  gap={3}
                >
                  {isEditing ? (
                    <>
                      <TextField
                        type='text'
                        value={updatedName}
                        onChange={handleChangeName}
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        required
                      />
                      <Select
                        value={updatedSelect}
                        onChange={handleChangeSelect}
                        sx={{ minWidth: 150, mt: 1 }}
                      >
                        <MenuItem value='Food'>Food</MenuItem>
                        <MenuItem value='Beverage'>Beverage</MenuItem>
                        <MenuItem value='Medication'>Medication</MenuItem>
                        <MenuItem value='Supplement'>Supplement</MenuItem>
                      </Select>
                      <Select
                        value={updatedHealthImpact}
                        onChange={handleHealthImpact}
                        sx={{ minWidth: 150, mt: 1 }}
                      >
                        <MenuItem value='Beneficial'>Beneficial</MenuItem>
                        <MenuItem value='Neutral'>Neutral</MenuItem>
                        <MenuItem value='Avoid'>Avoid</MenuItem>
                      </Select>
                    </>
                  ) : (
                    <>
                      <Typography variant='body1' noWrap>
                        {name}
                      </Typography>
                      {select && (
                        <Typography
                          variant='body1'
                          sx={{ color: 'primary.main' }}
                          noWrap
                        >
                          {select}
                        </Typography>
                      )}
                      <Typography
                        variant='body1'
                        sx={{
                          color: colorPicker(health_impact),
                        }}
                        noWrap
                      >
                        {health_impact}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
              <Box display={'flex'}>
                {stool_type && (
                  <Box display={'flex'}>
                    <Typography variant='body1' fontWeight={'bold'} noWrap>
                      Stool Type:
                    </Typography>
                    <Box ml={2}>{stool_type}</Box>
                  </Box>
                )}
                {stool_type && (
                  <Box display={'flex'}>
                    <Typography
                      variant='body1'
                      fontWeight={'bold'}
                      ml={5}
                      noWrap
                    >
                      Bleeding:
                    </Typography>
                    <Box ml={2}> {is_bleeding ? 'Yes' : 'No'}</Box>
                  </Box>
                )}
              </Box>
              {other_symptoms && (
                <Box display={'flex'}>
                  <Typography variant='body1' fontWeight={'bold'} noWrap>
                    Symptoms:
                  </Typography>
                  <Box ml={2}>{other_symptoms}</Box>
                </Box>
              )}
            </Box>

            <Box display='flex' flexDirection='row' gap={1}>
              {isEditing ? (
                <BookmarkAddedIcon
                  onClick={handleSave}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.dark',
                    '&:hover': {
                      color: 'secondary.main',
                    },
                  }}
                />
              ) : (
                <EditCalendarIcon
                  onClick={toggleEdit}
                  sx={{
                    cursor: 'pointer',
                    color: 'secondary.main',
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  }}
                />
              )}
              <DeleteOutlineIcon
                onClick={handleDelete}
                cursor='pointer'
                color='error'
              />
            </Box>
          </Box>
          <Typography
            variant='body2'
            color='textSecondary'
            sx={{ alignSelf: 'flex-end', mt: 2 }}
          >
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Entry;
