
import { supabase } from '@/integrations/supabase/client'

interface LogErrorOptions {
  error: Error
  component?: string
}

export const logError = async ({ error, component }: LogErrorOptions) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    await supabase.functions.invoke('log-error', {
      body: {
        errorMessage: error.message,
        stackTrace: error.stack,
        component: component || 'global',
        userId,
      },
    })
  } catch (e) {
    console.error('Failed to log error to backend:', e)
  }
}

export const setupGlobalErrorHandling = () => {
  window.onerror = (message, source, lineno, colno, error) => {
    if (error) {
      logError({ error })
    } else {
      const syntheticError = new Error(message as string)
      syntheticError.stack = `${source} ${lineno}:${colno}`
      logError({ error: syntheticError })
    }
    // Let the default handler run
    return false
  }

  window.onunhandledrejection = (event) => {
    if (event.reason instanceof Error) {
      logError({ error: event.reason, component: 'unhandled-rejection' })
    } else {
      const syntheticError = new Error(JSON.stringify(event.reason))
      logError({ error: syntheticError, component: 'unhandled-rejection' })
    }
  }
}
