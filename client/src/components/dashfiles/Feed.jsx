import React from "react"
import Box from "@mui/material/Box"
import Post from "../dashfiles/widgets/Post"


const Feed = () => {
  const posts = [
    {
      avatar: "",
      username: "example user",
      createdAt: "03/04/2023",
      image: "",
      body: `testing paragraph for user feed in dashboard`,
      _id: 0,
    }
  ]

  return (
    <Box flex={4} m='5px'>
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </Box>
  )
}

export default Feed
