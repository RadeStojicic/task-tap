import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui'
import { config } from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, 'config' | 'defaultTheme'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      {children}
    </TamaguiProvider>
  )
}
