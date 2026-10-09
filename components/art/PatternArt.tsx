/** Geometric textile-inspired artwork in Pamsika colours. Decorative only. */
export function PatternArt({className='',id='pam'}:{className?:string;id?:string}){
 return <svg className={`pattern-art ${className}`} viewBox="0 0 480 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
   <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0b1830"/><stop offset=".55" stopColor="#06101f"/><stop offset="1" stopColor="#1a0f05"/></linearGradient>
   <pattern id={`${id}-band`} width="80" height="120" patternUnits="userSpaceOnUse">
    <path d="M0 60 40 20 80 60 40 100Z" fill="none" stroke="#2f80d6" strokeWidth="1.5" opacity=".75"/>
    <path d="M40 38 62 60 40 82 18 60Z" fill="#005ABD" opacity=".55"/>
    <path d="M40 50 50 60 40 70 30 60Z" fill="#FF7A00"/>
    <path d="M0 0h80M0 120h80" stroke="#ffffff" strokeOpacity=".14"/>
    <path d="M0 6 10 0 20 6 30 0 40 6 50 0 60 6 70 0 80 6" fill="none" stroke="#ff9224" strokeOpacity=".7"/>
    <path d="M0 114 10 120 20 114 30 120 40 114 50 120 60 114 70 120 80 114" fill="none" stroke="#ff9224" strokeOpacity=".7"/>
   </pattern>
   <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#9cc3ee" opacity=".35"/></pattern>
   <radialGradient id={`${id}-glow`} cx=".7" cy=".25" r=".7"><stop offset="0" stopColor="#2f80d6" stopOpacity=".55"/><stop offset="1" stopColor="#2f80d6" stopOpacity="0"/></radialGradient>
  </defs>
  <rect width="480" height="600" fill={`url(#${id}-bg)`}/>
  <rect width="480" height="600" fill={`url(#${id}-dots)`}/>
  <rect x="40" y="-20" width="160" height="640" fill={`url(#${id}-band)`} transform="rotate(-12 240 300)"/>
  <rect x="290" y="-20" width="80" height="640" fill={`url(#${id}-band)`} opacity=".7" transform="rotate(-12 240 300)"/>
  <circle cx="360" cy="150" r="120" fill={`url(#${id}-glow)`}/>
  <circle cx="360" cy="150" r="64" fill="none" stroke="#ffffff" strokeOpacity=".22"/>
  <circle cx="360" cy="150" r="96" fill="none" stroke="#ffffff" strokeOpacity=".1"/>
 </svg>;
}
