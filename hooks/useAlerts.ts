'use client'

import { useEffect, useState } from 'react'
import useStore from '@/store'

interface Alert {
  id: string
  message: string
  type: string
  ticker?: string
}

export function useAlerts() {
  const alerts = useStore((state) => state.alerts)
  const removeAlert = useStore((state) => state.removeAlert)

  return {
    alerts,
    removeAlert,
  }
}
