import { toast as burntToast } from 'burnt'

export function showToast(title: string, options?: { message?: string }) {
  burntToast({ title, message: options?.message, preset: 'done', duration: 4 })
}
