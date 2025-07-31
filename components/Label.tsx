import React, { ReactNode } from 'react'
import { Text } from 'react-native'

const Label = ({children}: {children: ReactNode}) => {
  return (
    <Text className='text-sm font-mregular text-gray-600'>{children}</Text>
  )
}

export default Label