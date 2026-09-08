function Logo({ size = 46, withWordmark = false, dark = false }) {
  return (
    <div className={`logo-wrap ${dark ? 'logo-dark' : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Logo de Aiden's System"
      >
        <defs>
          <linearGradient id="aiden-lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b2b4f" />
            <stop offset="1" stopColor="#0f1a30" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#aiden-lg)" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1.6"
          opacity="0.9"
        />
        <circle cx="32" cy="32" r="23"
          fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" />
        <text
          x="32"
          y="38.5"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="30"
          fontWeight="700"
          fill="#c9a227"
        >
          A
        </text>
        <circle cx="32" cy="53" r="2.6" fill="#c9a227" />
      </svg>
      {withWordmark && (
        <div className="logo-word">
          <strong>AIDEN&apos;S SYSTEM</strong>
          <span>SISTEMA DE FACTURACIÓN</span>
        </div>
      )}
    </div>
  )
}

export default Logo