/* eslint-disable react/jsx-props-no-spreading */
import {Box} from '@chakra-ui/layout'

function Card(chakraProps) {
  return (
    <Box
      p="4"
      background="white"
      border
      borderWidth="1px"
      borderColor="_gray"
      borderRadius="lg"
      w="full"
      {...chakraProps}
    />
  )
}

export {Card}
