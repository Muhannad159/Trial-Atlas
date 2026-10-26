export function AtlasIllustration() {
  return (
    <div className="atlas-art" aria-hidden="true">
      <svg viewBox="0 0 540 360" fill="none">
        <defs>
          <radialGradient id="wash">
            <stop stopColor="#dfece0" />
            <stop offset="1" stopColor="#fafbf7" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="grid"
            width="27"
            height="27"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".8" fill="#abbfb2" opacity=".6" />
          </pattern>
        </defs>
        <ellipse cx="275" cy="170" rx="260" ry="180" fill="url(#wash)" />
        <rect width="540" height="330" fill="url(#grid)" />
        <g stroke="#a7bcae" strokeWidth=".8" opacity=".7">
          <ellipse cx="285" cy="162" rx="146" ry="143" />
          <ellipse cx="285" cy="162" rx="98" ry="143" />
          <ellipse cx="285" cy="162" rx="47" ry="143" />
          <path d="M139 162h292M154 99h262M155 225h260M193 49h183M193 275h183" />
        </g>
        <g fill="#c1d6c6" stroke="#fafbf7" strokeWidth="2">
          <path d="m161 101 26-29 35-8 26 12-8 24 15 16-21 18-22-7-8 21-19-5-5-20z" />
          <path d="m216 162 24 1 17 25-7 24-19 33-12-6 4-28-13-24z" />
          <path d="m280 88 24-18 27 8 14-13 34 20 25 13-2 24-24 7-18-16-11 19-18-11-22 7-13-17-20-3z" />
          <path d="m287 137 30-8 25 27-12 27-15 32-19-10-14-35z" />
          <path d="m365 211 28-12 18 13-6 18-30 5-12-13z" />
        </g>
        <g stroke="#237c67" strokeDasharray="3 5" opacity=".7">
          <path d="M196 112Q269 45 320 105M320 105Q371 117 388 155M196 112Q224 174 239 201M320 105Q282 139 310 167" />
        </g>
        {[
          [196, 112],
          [320, 105],
          [388, 155],
          [239, 201],
          [310, 167],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="13" fill="#2b8c6c" opacity=".12" />
            <circle
              cx={x}
              cy={y}
              r="5"
              fill="#18725b"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        ))}
        <g transform="translate(18 225)">
          <rect width="172" height="68" rx="7" fill="white" stroke="#d8e2d6" />
          <circle cx="22" cy="24" r="4" fill="#287348" />
          <text x="34" y="28" fill="#35634b" fontSize="9" fontFamily="Arial">
            RESEARCH WITHOUT BORDERS
          </text>
          <text x="18" y="48" fill="#526d65" fontSize="10" fontFamily="Arial">
            Find possibilities. See the context.
          </text>
        </g>
        <g transform="translate(357 42)">
          <rect width="165" height="48" rx="6" fill="white" stroke="#d8e2d6" />
          <text x="15" y="20" fill="#172e38" fontSize="10" fontFamily="Arial">
            Public records. Connected.
          </text>
          <text x="15" y="35" fill="#647a70" fontSize="9" fontFamily="Arial">
            Studies · Locations · Evidence
          </text>
        </g>
      </svg>
      <span className="art-label">An illustration of connected research</span>
    </div>
  );
}
