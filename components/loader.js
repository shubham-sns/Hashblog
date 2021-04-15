import {Spinner} from '@chakra-ui/react'

function Loader({show}) {
  if (!show) return null

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="_blue"
      size="xl"
    />
  )
}

export {Loader}
