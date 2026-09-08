let seed = 0

export function notify({ type = 'info', title = '', message = '', duration = 3800 }) {
  const id = ++seed
  try {
    window.dispatchEvent(
      new CustomEvent('aiden-toast', {
        detail: { id, type, title, message, duration },
      }),
    )
  } catch {
    /* ignore */
  }
}

export const toast = {
  success: (title, message) => notify({ type: 'success', title, message }),
  info: (title, message) => notify({ type: 'info', title, message }),
  warning: (title, message) => notify({ type: 'warning', title, message }),
  danger: (title, message) => notify({ type: 'danger', title, message }),
}