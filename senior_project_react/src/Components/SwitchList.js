import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function SwitchList() {
  const [checked, setChecked] = React.useState(['wifi']);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}
    >
      <ListItem>
        <ListItemIcon>
          <LocationOnIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-wifi" primary="Use My Location" />
        <Switch
          edge="end"
          onChange={handleToggle('location')}
          checked={checked.indexOf('location') !== -1}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <SecurityIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-bluetooth" primary="Private Mode" />
        <Switch
          edge="end"
          onChange={handleToggle('private')}
          checked={checked.indexOf('private') !== -1}
          inputProps={{
            'aria-labelledby': 'switch-list-label-bluetooth',
          }}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-bluetooth" primary=" Notifications" />
        <Switch
          edge="end"
          onChange={handleToggle('notifications')}
          checked={checked.indexOf('notifications') !== -1}
          inputProps={{
            'aria-labelledby': 'switch-list-label-bluetooth',
          }}
        />
      </ListItem>
    </List>
  );
}