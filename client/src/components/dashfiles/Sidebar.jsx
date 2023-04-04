import React from "react"

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material"

import {
  Home,
  Pages,
  Groups,
  AccountBox,
  Settings,
  ModeNight,
  LightMode,
} from "@mui/icons-material"


const Sidebar = ({ toogleThemeMode, themeMode }) => {
  let links = [
    { icon: <Home to="/Register"/>, title: "Homepage" },
    { icon: <Pages />, title: "Links" },
    { icon: <Groups />, title: "Users" },
    { icon: <Settings />, title: "Settings" },
    { icon: <AccountBox />, title: "Profile" },
  ]

  return (
    <Box
      flex={1}
      p={1}
      sx={{ display: { xs: "none", sm: "block" }, minWidth: "200px" }}
    >
      <Box position='fixed'>
        <List>
          {links.map(({ title, icon }, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component='a' to="/Register">
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* THEME MODE TOGGLER */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {themeMode === "dark" ? <ModeNight /> : <LightMode />}
              </ListItemIcon>
              <Switch onChange={toogleThemeMode} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}

export default Sidebar
