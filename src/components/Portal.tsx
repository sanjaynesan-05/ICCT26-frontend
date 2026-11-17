import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Renders children directly into <body>.
 *
 * Use for full-screen overlays (modals, viewers, menus): an ancestor with a CSS
 * transform, filter or backdrop-filter (e.g. a scroll-in animation) would otherwise
 * turn `position: fixed` into "fixed to that ancestor" and break the overlay.
 */
const Portal = ({ children }: { children: ReactNode }) =>
  typeof document === 'undefined' ? null : createPortal(children, document.body)

export default Portal
