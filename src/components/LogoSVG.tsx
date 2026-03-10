interface LogoSVGProps {
  className?: string
  strokeWidth?: number
  showFill?: boolean
}

export default function LogoSVG({
  className = '',
  strokeWidth = 4.2,
  showFill = true,
}: LogoSVGProps) {
  return (
    <svg viewBox="0 0 100 106" fill="none" className={className} style={{ overflow: 'visible' }}>
      <path
        id="p1"
        className="logo-stroke"
        strokeWidth={strokeWidth}
        d="M50 5C52.5 5 55.5 7 57 11.5L63.5 33C65.5 39.5 72 43.5 78.5 43.5L95 43.5C99 43.5 101 46.5 100 50C99 53.5 95 55.5 91 58.5L75 69.5C70 72.5 68 79 70 85L76.5 101C78 105 75 108 72 107.5C69 107 66 105 63 102L52.5 91.5C50.5 89 49.5 89 47.5 91.5L37 102C34 105 31 107 28 107.5C25 108 22 105 23.5 101L30 85C32 79 30 72.5 25 69.5L9 58.5C5 55.5 1 53.5 0 50C-1 46.5 1 43.5 5 43.5L21.5 43.5C28 43.5 34.5 39.5 36.5 33L43 11.5C44.5 7 47.5 5 50 5Z"
      />
      <path
        id="p2"
        className="logo-stroke"
        strokeWidth={1.8}
        d="M50 14C52 14 54 15.5 55 18.5L61.5 38C63.5 44.5 70 49 77.5 49L92 49C95 49 96.5 51.5 96 54C95.5 56.5 93 58.5 90 60.5L75.5 70.5C71 73.5 69 79.5 71 85.5L76.5 99.5C77.5 102 76 104 74 103.5C72 103 69.5 101.5 67 99L56 88C53.5 85.5 46.5 85.5 44 88L33 99C30.5 101.5 28 103 26 103.5C24 104 22.5 102 23.5 99.5L29 85.5C31 79.5 29 73.5 24.5 70.5L10 60.5C7 58.5 4.5 56.5 4 54C3.5 51.5 5 49 8 49L22.5 49C30 49 36.5 44.5 38.5 38L45 18.5C46 15.5 48 14 50 14Z"
      />
      <line id="l1"  className="logo-stroke" strokeWidth={1.3} x1="47"   y1="16"   x2="43.5" y2="36" />
      <line id="l2"  className="logo-stroke" strokeWidth={1.3} x1="53"   y1="16"   x2="56.5" y2="36" />
      <line id="l3"  className="logo-stroke" strokeWidth={1.3} x1="62.5" y1="34"   x2="75.5" y2="46" />
      <line id="l4"  className="logo-stroke" strokeWidth={1.3} x1="60.5" y1="39"   x2="75.5" y2="50" />
      <line id="l5"  className="logo-stroke" strokeWidth={1.3} x1="73.5" y1="70.5" x2="64"   y2="84" />
      <line id="l6"  className="logo-stroke" strokeWidth={1.3} x1="69.5" y1="69.5" x2="61"   y2="83" />
      <line id="l7"  className="logo-stroke" strokeWidth={1.3} x1="26.5" y1="70.5" x2="36"   y2="84" />
      <line id="l8"  className="logo-stroke" strokeWidth={1.3} x1="30.5" y1="69.5" x2="39"   y2="83" />
      <line id="l9"  className="logo-stroke" strokeWidth={1.3} x1="37.5" y1="34"   x2="24.5" y2="46" />
      <line id="l10" className="logo-stroke" strokeWidth={1.3} x1="39.5" y1="39"   x2="24.5" y2="50" />
      {showFill && (
        <circle id="cf" className="logo-fill" cx="50" cy="55" r="9.5" />
      )}
    </svg>
  )
}
