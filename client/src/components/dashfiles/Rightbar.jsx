import React from "react"
import {
  Box,
  Typography,
  AvatarGroup,
} from "@mui/material"

const Rightbar = () => {
  return (
    <Box flex={2} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position='fixed' width={300} gap={2}>
        <Typography variant='h6' fontWeight={200}>
         Active Users
        </Typography>

        <AvatarGroup max={7} sx={{ justifyContent: "center" }}>
         S
        </AvatarGroup>

      
   
      
        
      </Box>
    </Box>
  )
}






export default Rightbar
