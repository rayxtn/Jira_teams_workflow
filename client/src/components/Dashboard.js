import React, { useState } from "react"
import Navbar from "../components/dashfiles/Navbar"
import Sidebar from "../components/dashfiles/Sidebar"
import Feed from "../components/dashfiles/Feed"
import Rightbar from "../components/dashfiles/Rightbar"
import MyFab from "../components/dashfiles/widgets/MyFab"

// MUI things

import { createTheme, Stack, Box, ThemeProvider } from "@mui/material"

const Dashboard = () => {
  const [mode, setMode] = useState("light")
  const toogleThemeMode = () => setMode(mode === "light" ? "dark" : "light")

  const theme = createTheme({
    palette: {
      mode,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor={"background.default"} color={"text.primary"}>
        <Navbar />
        <Stack direction='row' justifyContent='space-between' gap='10px'>
          <Sidebar toogleThemeMode={toogleThemeMode} themeMode={mode} />
          <Feed />
          <Rightbar />
        </Stack>

        <MyFab />
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard