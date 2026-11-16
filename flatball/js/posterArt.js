// Dynamic Broadcast Poster SVG Art Engine for Flatball Tactics
// Generates team- & weather-reactive Ultimate Frisbee silhouette action graphics and pro-style club crests.

export const POSTER_RIBBON_DISC_SVG = `<svg class="ribbon-disc-oval" viewBox="0 0 36 18" fill="none" aria-hidden="true">
  <ellipse cx="18" cy="9" rx="16.5" ry="7.6" fill="#0B1F33" stroke="#FFFFFF" stroke-width="1.5"/>
  <path d="M5 11.5 C11 7.5, 18 6.2, 27 6.8" stroke="#00E5FF" stroke-width="2.1" stroke-linecap="round"/>
  <circle cx="24.5" cy="6.6" r="1.9" fill="#FFFFFF"/>
  <path d="M14 11.8 L22.5 7.4 L26 9.2" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="29.5" cy="5.6" rx="3.1" ry="1.3" transform="rotate(-15 29.5 5.6)" fill="#FFFFFF"/>
</svg>`;

export function getPlayerCrestSvg() {
  return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <circle cx="40" cy="40" r="33" fill="#071E33" stroke="#0284C7" stroke-width="2.5"/>
    <circle cx="40" cy="40" r="28" fill="none" stroke="#00E5FF" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.7"/>
    <!-- 3 Classic Pro-Ultimate Stars -->
    <polygon points="27,24 28.4,27.2 31.8,27.5 29.2,29.7 30,33 27,31.2 24,33 24.8,29.7 22.2,27.5 25.6,27.2" fill="#00E5FF"/>
    <polygon points="40,19 41.6,22.6 45.5,23 42.5,25.5 43.4,29.3 40,27.3 36.6,29.3 37.5,25.5 34.5,23 38.4,22.6" fill="#FFFFFF"/>
    <polygon points="53,24 54.4,27.2 57.8,27.5 55.2,29.7 56,33 53,31.2 50,33 50.8,29.7 48.2,27.5 51.6,27.2" fill="#00E5FF"/>
    <!-- Sweeping Motion Swooshes -->
    <path d="M12 52 C24 46, 38 37, 63 29 L65 40 C43 45, 28 53, 14 57 Z" fill="#0284C7"/>
    <path d="M16 55 C29 49, 43 42, 64 35" stroke="#00E5FF" stroke-width="3" stroke-linecap="round"/>
    <!-- Gleaming White Ultimate Disc -->
    <g transform="translate(46, 46) rotate(-18)">
      <ellipse cx="0" cy="1.5" rx="17" ry="7.8" fill="#041220" opacity="0.55"/>
      <ellipse cx="0" cy="0" rx="16.5" ry="7.4" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.6"/>
      <ellipse cx="0" cy="0" rx="10.8" ry="4.5" fill="none" stroke="#00E5FF" stroke-width="1.5"/>
    </g>
    <text x="40" y="67" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="8.5" letter-spacing="1.4">BLUE SKY</text>
  </svg>`;
}

export function getBotCrestSvg(botTeam) {
  const top = botTeam.colorTop;
  const bot = botTeam.colorBot;
  const acc = botTeam.accent || top;

  switch (botTeam.id) {
    case 'crimson_huckers':
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path d="M16 16 H64 V42 C64 56 40 68 40 68 C40 68 16 56 16 42 Z" fill="${bot}" stroke="${top}" stroke-width="2.6"/>
        <path d="M21 21 H59 V41 C59 52 40 62 40 62 C40 62 21 52 21 41 Z" fill="#1A080C"/>
        <path d="M20 50 Q36 33 59 24" stroke="${top}" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M24 55 Q40 40 58 31" stroke="#FBBF24" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="52" cy="27" rx="10.5" ry="4.8" transform="rotate(-22 52 27)" fill="#FFFFFF" stroke="${top}" stroke-width="1.5"/>
        <text x="40" y="56" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="8.2" letter-spacing="1">HUCKERS</text>
      </svg>`;

    case 'tangerine_tornados':
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="40" r="32" fill="#231006" stroke="${top}" stroke-width="2.8"/>
        <path d="M20 31 C30 19, 53 20, 60 33" stroke="${top}" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M60 49 C50 61, 27 60, 20 47" stroke="${bot}" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M25 40 C32 30, 48 30, 55 40 C48 50, 32 50, 25 40 Z" fill="${top}" fill-opacity="0.22"/>
        <ellipse cx="40" cy="40" rx="14.5" ry="6.6" transform="rotate(-12 40 40)" fill="#FFFFFF" stroke="${bot}" stroke-width="1.6"/>
        <ellipse cx="40" cy="40" rx="8.5" ry="3.5" transform="rotate(-12 40 40)" fill="none" stroke="${top}" stroke-width="1.4"/>
      </svg>`;

    case 'golden_hammers':
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path d="M17 15 H63 L66 43 C66 57 40 68 40 68 C40 68 14 57 14 43 Z" fill="#241405" stroke="${top}" stroke-width="2.6"/>
        <!-- Classic Pro Vertical Shield Stripes -->
        <rect x="23" y="32" width="5" height="25" rx="1" fill="${top}"/>
        <rect x="33" y="32" width="5" height="29" rx="1" fill="${top}"/>
        <rect x="42" y="32" width="5" height="29" rx="1" fill="${top}"/>
        <rect x="52" y="32" width="5" height="25" rx="1" fill="${top}"/>
        <rect x="18" y="19" width="44" height="11" rx="2" fill="${bot}"/>
        <text x="40" y="27.2" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="8.4" letter-spacing="1">HAMMERS</text>
      </svg>`;

    case 'violet_vortex':
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <polygon points="40,9 67,24.5 67,55.5 40,71 13,55.5 13,24.5" fill="#18092B" stroke="${top}" stroke-width="2.8"/>
        <polygon points="40,17 59,28 59,52 40,63 21,52 21,28" fill="none" stroke="${acc}" stroke-width="1.5" stroke-dasharray="4 3"/>
        <polygon points="40,22 56,50 24,50" fill="${bot}" fill-opacity="0.55" stroke="#FFFFFF" stroke-width="1.5"/>
        <circle cx="40" cy="40" r="6.5" fill="#FFFFFF" stroke="${top}" stroke-width="2"/>
        <circle cx="40" cy="22" r="3" fill="${acc}"/>
        <circle cx="56" cy="50" r="3" fill="${acc}"/>
        <circle cx="24" cy="50" r="3" fill="${acc}"/>
      </svg>`;

    case 'flamingo_fever':
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="40" r="32" fill="#240818" stroke="${top}" stroke-width="2.8"/>
        <line x1="16" y1="33" x2="64" y2="25" stroke="${top}" stroke-width="3.2" stroke-linecap="round"/>
        <line x1="14" y1="41" x2="66" y2="33" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="18" y1="49" x2="62" y2="41" stroke="${bot}" stroke-width="3.2" stroke-linecap="round"/>
        <ellipse cx="42" cy="38" rx="15" ry="6.8" transform="rotate(-14 42 38)" fill="#FFFFFF" stroke="${top}" stroke-width="1.8"/>
        <text x="40" y="61" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="8.2" letter-spacing="1.2">FEVER</text>
      </svg>`;

    case 'tuxedo_pandas':
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path d="M17 15 H63 L66 43 C66 57 40 68 40 68 C40 68 14 57 14 43 Z" fill="#0F172A" stroke="#475569" stroke-width="2.6"/>
        <rect x="22" y="31" width="5.5" height="25" fill="#FFFFFF"/>
        <rect x="32" y="31" width="5.5" height="29" fill="#FFFFFF"/>
        <rect x="42.5" y="31" width="5.5" height="29" fill="#FFFFFF"/>
        <rect x="52.5" y="31" width="5.5" height="25" fill="#FFFFFF"/>
        <rect x="18" y="18" width="44" height="11" rx="2" fill="#1E293B"/>
        <text x="40" y="26.2" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="8.8" letter-spacing="1.4">PANDAS</text>
      </svg>`;

    default:
      // layout_llamas
      return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="40" r="32" fill="#231208" stroke="${top}" stroke-width="2.8"/>
        <path d="M16 54 L31 32 L42 46 L51 34 L64 54 Z" fill="${bot}" stroke="${top}" stroke-width="1.8" stroke-linejoin="round"/>
        <ellipse cx="46" cy="24" rx="11.5" ry="4.8" transform="rotate(-12 46 24)" fill="#FFFFFF" stroke="${top}" stroke-width="1.5"/>
        <path d="M22 28 L35 25" stroke="#FDE68A" stroke-width="2.2" stroke-linecap="round"/>
        <text x="40" y="64" text-anchor="middle" fill="#FFFFFF" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="8.2" letter-spacing="1.3">LLAMAS</text>
      </svg>`;
  }
}

function buildTeamBackdropMotif(botTeam) {
  const c = botTeam.colorTop;
  const a = botTeam.accent || c;
  switch (botTeam.id) {
    case 'violet_vortex':
      return `
        <g opacity="0.26" stroke="${a}" fill="none">
          <polygon points="335,28 378,52 378,100 335,124 292,100 292,52" stroke-width="2"/>
          <polygon points="335,44 364,60 364,92 335,108 306,92 306,60" stroke-width="1.4" stroke-dasharray="5 4"/>
          <polygon points="335,36 370,96 300,96" stroke-width="1.3"/>
        </g>`;
    case 'tangerine_tornados':
      return `
        <g opacity="0.28" stroke="${a}" fill="none" stroke-linecap="round">
          <circle cx="336" cy="82" r="56" stroke-width="2.2" stroke-dasharray="18 10"/>
          <circle cx="336" cy="82" r="38" stroke-width="2.8" stroke-dasharray="14 8"/>
          <circle cx="336" cy="82" r="21" stroke-width="2"/>
        </g>`;
    case 'golden_hammers':
      return `
        <g opacity="0.26" fill="${a}">
          <polygon points="270,0 295,0 245,230 220,230"/>
          <polygon points="315,0 340,0 290,230 265,230"/>
          <polygon points="360,0 385,0 335,230 310,230"/>
        </g>`;
    case 'flamingo_fever':
      return `
        <g opacity="0.3" stroke="${a}" stroke-linecap="round">
          <line x1="250" y1="32" x2="430" y2="8" stroke-width="5"/>
          <line x1="265" y1="54" x2="435" y2="30" stroke-width="3" stroke="#38BDF8"/>
          <line x1="255" y1="76" x2="430" y2="52" stroke-width="4"/>
        </g>`;
    case 'tuxedo_pandas':
      return `
        <g opacity="0.24" stroke="#E2E8F0" fill="none">
          <rect x="295" y="30" width="76" height="76" transform="rotate(45 333 68)" stroke-width="2"/>
          <rect x="307" y="42" width="52" height="52" transform="rotate(45 333 68)" stroke-width="1.4"/>
        </g>`;
    case 'layout_llamas':
      return `
        <g opacity="0.25" fill="none" stroke="${a}" stroke-width="3" stroke-linejoin="round">
          <polyline points="245,175 305,72 348,132 385,82 435,175"/>
          <polyline points="265,185 315,102 355,150 392,108 435,185" stroke-width="1.6"/>
        </g>`;
    default:
      // crimson_huckers
      return `
        <g opacity="0.28" fill="${a}">
          <polygon points="340,78 440,10 440,36"/>
          <polygon points="340,78 440,58 440,84"/>
          <polygon points="340,78 440,108 440,134"/>
          <polygon points="340,78 390,0 418,0"/>
        </g>`;
  }
}

function buildWeatherOverlayArt(matchWeather) {
  if (!matchWeather || matchWeather.strength === 'calm') {
    // Golden stadium sunbeams + lens rings
    return `
      <g opacity="0.42">
        <circle cx="218" cy="48" r="44" fill="url(#posterSunGlow)"/>
        <circle cx="218" cy="48" r="64" fill="none" stroke="#FDE68A" stroke-width="1" stroke-dasharray="4 6" opacity="0.55"/>
      </g>`;
  }

  if (matchWeather.strength === 'breezy') {
    return `
      <g opacity="0.46" fill="none" stroke="#BAE6FD" stroke-linecap="round">
        <path d="M18 46 Q115 24, 215 48 T415 38" stroke-width="2.2" stroke-dasharray="18 8"/>
        <path d="M-10 112 Q105 88, 225 114 T435 98" stroke-width="1.7" stroke-dasharray="12 8"/>
        <path d="M35 155 Q150 138, 285 158 T430 144" stroke-width="1.5" opacity="0.7"/>
      </g>`;
  }

  // Stiff Wind: High-energy gale ribbons & chevrons
  return `
    <g opacity="0.58" fill="none" stroke="#FDE68A" stroke-linecap="round">
      <path d="M-10 36 L145 22 M175 20 L345 6" stroke-width="2.6"/>
      <path d="M15 74 L205 56 M240 53 L430 35" stroke-width="2.2" stroke="#E0F2FE"/>
      <path d="M-5 134 L180 116 M215 112 L425 92" stroke-width="2.4"/>
      <polyline points="342,2 350,6 343,12" stroke-width="2.2"/>
      <polyline points="426,31 434,35 427,41" stroke-width="2.2" stroke="#E0F2FE"/>
    </g>`;
}

/**
 * Builds the full-bleed Top Action Hero SVG featuring:
 *  - Left Electric-Blue Player Silhouette (airborne layout/extension)
 *  - Right Bot-Team-Colored Athlete Silhouette (leaping sky contest)
 *  - Center Gleaming 3D White Ultimate Disc + Kinetic Shockwave Arcs
 *  - Team-specific abstract sports geometry & daily weather atmosphere!
 */
export function buildPosterHeroSvg(botTeam, matchWeather) {
  const bTop = botTeam.colorTop;
  const bBot = botTeam.colorBot;
  const bAcc = botTeam.accent || bTop;

  return `<svg class="poster-hero-svg" viewBox="0 0 440 245" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="posterSkyBg" x1="0" y1="0" x2="440" y2="245" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#062238"/>
        <stop offset="48%" stop-color="#0B192C"/>
        <stop offset="100%" stop-color="#141126"/>
      </linearGradient>
      <radialGradient id="youSideGlow" cx="0.18" cy="0.48" r="0.58">
        <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.46"/>
        <stop offset="100%" stop-color="#00E5FF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="botSideGlow" cx="0.84" cy="0.44" r="0.58">
        <stop offset="0%" stop-color="${bTop}" stop-opacity="0.52"/>
        <stop offset="100%" stop-color="${bTop}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="posterSunGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.85"/>
        <stop offset="55%" stop-color="#F59E0B" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="youSilGrad" x1="45" y1="75" x2="195" y2="185" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#00E5FF"/>
        <stop offset="55%" stop-color="#0284C7"/>
        <stop offset="100%" stop-color="#062844"/>
      </linearGradient>
      <linearGradient id="botSilGrad" x1="255" y1="55" x2="365" y2="210" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${bTop}"/>
        <stop offset="62%" stop-color="${bBot}"/>
        <stop offset="100%" stop-color="#0F1020"/>
      </linearGradient>
      <linearGradient id="turfHorizon" x1="0" y1="192" x2="0" y2="245" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1D824C"/>
        <stop offset="100%" stop-color="#0C3B24"/>
      </linearGradient>
      <pattern id="heroDots" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.15" fill="#FFFFFF" fill-opacity="0.12"/>
      </pattern>
    </defs>

    <!-- Stadium Sky & Dual Team-Color Clash -->
    <rect width="440" height="245" fill="url(#posterSkyBg)"/>
    <rect width="440" height="245" fill="url(#youSideGlow)"/>
    <rect width="440" height="245" fill="url(#botSideGlow)"/>
    <rect width="160" height="140" fill="url(#heroDots)"/>

    <!-- Dynamic Diagonal Clash Slash -->
    <polygon points="185,0 245,0 165,245 105,245" fill="#FFFFFF" fill-opacity="0.04"/>
    <line x1="232" y1="0" x2="152" y2="245" stroke="#00E5FF" stroke-width="1.5" stroke-opacity="0.32"/>
    <line x1="242" y1="0" x2="162" y2="245" stroke="${bAcc}" stroke-width="1.5" stroke-opacity="0.38"/>

    <!-- Team-Specific Abstract Sports Motif -->
    ${buildTeamBackdropMotif(botTeam)}

    <!-- Weather-Reactive Sky Layer -->
    ${buildWeatherOverlayArt(matchWeather)}

    <!-- Stadium Turf Horizon & Yard Lines -->
    <rect x="0" y="194" width="440" height="51" fill="url(#turfHorizon)"/>
    <line x1="0" y1="194" x2="440" y2="194" stroke="#FFFFFF" stroke-opacity="0.65" stroke-width="2"/>
    <line x1="70" y1="194" x2="22" y2="245" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.6"/>
    <line x1="220" y1="194" x2="220" y2="245" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1.6" stroke-dasharray="4 4"/>
    <line x1="370" y1="194" x2="418" y2="245" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.6"/>
    <!-- Track/Endzone Red-Orange Accent Stripe -->
    <rect x="0" y="189" width="440" height="5" fill="${bTop}" fill-opacity="0.45"/>

    <!-- Kinetic Disc Flight Swooshes -->
    <path d="M22 156 C86 118, 142 88, 206 82" stroke="#00E5FF" stroke-width="4" stroke-linecap="round" opacity="0.78"/>
    <path d="M38 168 C98 134, 150 102, 204 90" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>

    <!-- LEFT ATHLETE SILHOUETTE: "YOU" (Electric Blue Airborne Layout Extension!) -->
    <g>
      <!-- Turf shadow -->
      <ellipse cx="112" cy="208" rx="52" ry="7" fill="#03131D" opacity="0.55"/>
      <!-- Head -->
      <circle cx="151" cy="106" r="11.5" fill="url(#youSilGrad)" stroke="#7DF9FF" stroke-width="1.4"/>
      <!-- Cap / Headband Visor Silhouette -->
      <path d="M144 99 Q155 95 166 101" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Airborne Torso & Outstretched Layout Arm Reaching for Disc + Swept Trail Arm & Split Legs -->
      <path d="
        M141 114
        C156 109, 174 99, 193 90
        C197 88, 200 92, 196 96
        C179 107, 162 117, 146 124
        L124 146
        L154 166
        C158 169, 155 176, 149 173
        L113 154
        L82 174
        L52 186
        C46 188, 44 181, 49 178
        L76 163
        L103 140
        L82 128
        L58 133
        C53 134, 52 128, 57 126
        L85 118
        L118 122
        Z"
        fill="url(#youSilGrad)"
        stroke="#7DF9FF"
        stroke-width="1.4"
        stroke-linejoin="round"
      />
    </g>

    <!-- RIGHT ATHLETE SILHOUETTE: TODAY'S BOT CLUB (Leaping Sky Contest in Team Colors!) -->
    <g>
      <!-- Turf shadow -->
      <ellipse cx="306" cy="210" rx="42" ry="7" fill="#03131D" opacity="0.55"/>
      <!-- Head -->
      <circle cx="294" cy="94" r="11.5" fill="url(#botSilGrad)" stroke="#FFFFFF" stroke-width="1.3"/>
      <!-- Sky-Reaching Arm, Athletic Torso, Driven Knee & Extended Trail Leg -->
      <path d="
        M284 103
        C268 95, 252 88, 237 83
        C232 81, 235 75, 240 77
        C258 82, 275 90, 292 99
        L318 109
        L348 119
        C353 121, 351 128, 345 126
        L315 119
        L306 147
        L335 186
        C339 191, 332 196, 327 191
        L295 155
        L274 171
        L264 198
        C262 203, 254 201, 256 195
        L265 163
        L286 142
        L284 114
        Z"
        fill="url(#botSilGrad)"
        stroke="${bAcc}"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </g>

    <!-- CENTER FOCAL POINT: GLEAMING 3D WHITE ULTIMATE DISC & ENERGY HALO -->
    <g transform="translate(216, 79) rotate(-13)">
      <circle cx="0" cy="0" r="26" fill="none" stroke="#FFFFFF" stroke-width="1.1" stroke-dasharray="4 4" opacity="0.5"/>
      <ellipse cx="0" cy="2.2" rx="22" ry="9.2" fill="rgba(2, 12, 24, 0.55)"/>
      <ellipse cx="0" cy="1.4" rx="21" ry="8.5" fill="#CBD5E1" stroke="#94A3B8" stroke-width="0.9"/>
      <ellipse cx="0" cy="-0.3" rx="21" ry="8.3" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.2"/>
      <ellipse cx="0" cy="-0.4" rx="14.5" ry="5.4" fill="none" stroke="#0284C7" stroke-width="1.6"/>
      <ellipse cx="0" cy="-0.4" rx="8.0" ry="2.8" fill="none" stroke="${bTop}" stroke-width="1.2"/>
      <path d="M-13 -4.2 A16 6.2 0 0 1 13 -3.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
    </g>
  </svg>`;
}
