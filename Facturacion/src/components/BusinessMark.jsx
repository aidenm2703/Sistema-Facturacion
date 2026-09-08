import { markSvg } from '../utils/businessImages'

function BusinessMark({ id, size = 22, color }) {
  const glyph = id ? markSvg(id) : markSvg('general')
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      className="business-mark"
      style={{ color: color || 'currentColor' }}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
    </svg>
  )
}

export default BusinessMark