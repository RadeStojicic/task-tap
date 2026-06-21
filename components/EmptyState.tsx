import type { ReactNode } from 'react'
import { Inbox } from '@tamagui/lucide-icons-2'
import { H4, Paragraph, YStack } from 'tamagui'

export function EmptyState({
  title,
  message,
  icon,
}: {
  title: string
  message?: string
  icon?: ReactNode
}) {
  return (
    <YStack flex={1} items="center" justify="center" gap="$3" px="$6" py="$10">
      <YStack bg="$color3" p="$4" rounded="$10">
        {icon ?? <Inbox size={28} color="$color10" />}
      </YStack>
      <H4 text="center" color="$color12">
        {title}
      </H4>
      {!!message && (
        <Paragraph text="center" color="$color10" maxW={320}>
          {message}
        </Paragraph>
      )}
    </YStack>
  )
}
