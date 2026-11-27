/**
 * UMWELT: Animal Optics — 4-Pass WebGL2 GLSL ES 3.00 Shader Suite
 * Pass 0+1: Procedural Zero-Wait 3-Biome Landscapes + 2.5D Depth Relief Parallax + Living Micro-Animation
 * Pass 2:   24 Species Biological Perception Shaders + Synchronized Split-Screen Curtain
 * Pass 3:   Temporal History Copy for Ping-Pong Rod Motion Differencing
 */

export const FULLSCREEN_VS = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 pos = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0);
  vUv = pos * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

export const COPY_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uSourceTex;
out vec4 fragColor;
void main() {
  fragColor = texture(uSourceTex, vUv);
}
`;

export const LIVING_SCENE_FS = `#version 300 es
precision highp float;
in vec2 vUv;

uniform sampler2D uPlateRGB;
uniform sampler2D uPlateBio;
uniform float uTime;
uniform float uPlateMix;
uniform int uBiomeId;       // 0 = meadow, 1 = reef, 2 = cloudforest
uniform int uSpeciesId;     // 0..23 active species shader ID
uniform int uLightIndex;    // 0 = default, 1 = alt1, 2 = alt2
uniform vec2 uParallax;     // [-1, 1] look tilt
uniform vec2 uCamOffset;    // navigable locomotion offset
uniform float uCamZoom;     // 1.0 default, >1.0 during locomotion/stoop
uniform float uGaitBob;     // subtle gait oscillation
uniform float uReducedMotion;
uniform vec2 uResolution;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise2(p);
    p = m * p * 2.03 + vec2(13.7, 7.1);
    a *= 0.5;
  }
  return v;
}

float voronoiCaustic(vec2 uv, float t) {
  vec2 g = floor(uv);
  vec2 f = fract(uv);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      float h = hash21(g + o);
      vec2 r = o + 0.5 + 0.42 * sin(t * 0.9 + 6.2831 * vec2(h, fract(h * 17.3))) - f;
      md = min(md, dot(r, r));
    }
  }
  return pow(clamp(1.0 - sqrt(md), 0.0, 1.0), 3.2);
}

// Pass 0: Zero-Wait Procedural 3-Biome Ecosystem Backdrop
vec3 renderProceduralBiome(vec2 uv, float t) {
  float y = uv.y; // 0 = bottom, 1 = top in WebGL UV

  if (uBiomeId == 0) {
    // --- Rocky Mountain Alpine Meadow ---
    vec3 skyTop = vec3(0.09, 0.28, 0.62);
    vec3 skyHor = vec3(0.55, 0.74, 0.90);
    vec3 col = mix(skyHor, skyTop, smoothstep(0.42, 0.98, y));

    // Drifting clouds
    float cl = fbm(vec2(uv.x * 3.5 + t * 0.015, y * 5.0));
    col = mix(col, vec3(0.95, 0.97, 1.0), smoothstep(0.56, 0.82, cl) * smoothstep(0.45, 0.85, y) * 0.55);

    // Snow-capped granite peaks
    float ridge = 0.50 + 0.17 * fbm(vec2(uv.x * 4.2 + 1.3, 1.0)) + 0.05 * sin(uv.x * 9.0);
    if (y < ridge) {
      float snow = smoothstep(ridge - 0.07, ridge - 0.01, y + 0.04 * fbm(uv * 16.0));
      vec3 rock = mix(vec3(0.20, 0.25, 0.34), vec3(0.88, 0.92, 0.97), snow);
      col = mix(rock, skyHor, smoothstep(0.38, 0.62, y) * 0.32);
    }

    // Spruce timberline ridge
    float treeline = 0.42 + 0.05 * fbm(vec2(uv.x * 18.0, 2.0));
    if (y < treeline) {
      float pineTex = fbm(uv * vec2(34.0, 18.0));
      col = mix(vec3(0.06, 0.16, 0.10), vec3(0.14, 0.29, 0.16), pineTex);
    }

    // Sunlit wildflower alpine meadow slope
    float meadowLine = 0.36 + 0.03 * sin(uv.x * 5.0 + 0.7);
    if (y < meadowLine) {
      float gTex = fbm(vec2(uv.x * 12.0 + sin(t * 1.1 + uv.x * 5.0) * 0.04, y * 24.0));
      vec3 grass = mix(vec3(0.14, 0.34, 0.11), vec3(0.32, 0.53, 0.17), gTex);

      // Snowmelt stream winding on right
      float creekCenter = 0.66 + 0.09 * sin(y * 12.0 + 0.8);
      float creekW = 0.035 + 0.09 * (1.0 - y / meadowLine);
      float creekMask = 1.0 - smoothstep(creekW * 0.6, creekW, abs(uv.x - creekCenter));
      vec3 waterCol = mix(vec3(0.10, 0.32, 0.48), vec3(0.55, 0.78, 0.92), 0.35 + 0.25 * sin(uv.x * 45.0 + t * 3.0));
      col = mix(grass, waterCol, creekMask * 0.88);

      // Golden Rudbeckia & Scarlet Poppies
      float flNoise = noise2(floor(uv * vec2(44.0, 30.0)));
      vec2 flCell = fract(uv * vec2(44.0, 30.0)) - 0.5;
      float flDot = smoothstep(0.30, 0.12, length(flCell));
      if (flNoise > 0.79 && creekMask < 0.2) {
        col = mix(col, vec3(0.96, 0.80, 0.10), flDot * 0.9);
      } else if (flNoise < 0.15 && creekMask < 0.2) {
        col = mix(col, vec3(0.86, 0.12, 0.10), flDot * 0.9);
      }
    }
    return col;
  }

  if (uBiomeId == 1) {
    // --- Indo-Pacific Coral Reef Lagoon ---
    vec3 deepWater = vec3(0.02, 0.16, 0.32);
    vec3 surfWater = vec3(0.07, 0.52, 0.68);
    vec3 col = mix(deepWater, surfWater, smoothstep(0.0, 1.0, y));

    // Refracted surface rays & Voronoi caustics
    float rays = pow(max(0.0, sin(uv.x * 14.0 + y * 5.0 - t * 0.6) * 0.5 + 0.5), 4.0) * smoothstep(0.2, 0.95, y);
    col += vec3(0.16, 0.45, 0.52) * rays * 0.45;
    float caust = voronoiCaustic(uv * vec2(7.0, 5.0) + vec2(t * 0.12, -t * 0.08), t);
    col += vec3(0.22, 0.68, 0.78) * caust * 0.32;

    // Coral reef silhouettes & rippled white coral sand floor
    float sandLine = 0.38 + 0.04 * sin(uv.x * 7.0);
    if (y < sandLine) {
      float ripple = 0.5 + 0.5 * sin(uv.x * 38.0 + sin(y * 18.0) * 2.0);
      vec3 sand = mix(vec3(0.28, 0.54, 0.60), vec3(0.56, 0.78, 0.82), ripple * 0.45 + 0.4);
      sand += vec3(0.28, 0.55, 0.60) * caust * 0.65;
      col = mix(col, sand, smoothstep(sandLine, sandLine - 0.06, y));
    }
    float coralH = 0.28 + 0.22 * fbm(vec2(uv.x * 8.0 + 3.1, 1.5)) * smoothstep(0.85, 0.15, uv.x);
    if (y < coralH && uv.x < 0.58) {
      float cTex = fbm(uv * 24.0);
      vec3 coral = mix(vec3(0.09, 0.26, 0.30), vec3(0.24, 0.54, 0.44), cTex);
      col = mix(col, coral, 0.88);
    }
    return col;
  }

  // --- Neotropical Cloud Forest at Dusk ---
  vec3 nightTop = vec3(0.02, 0.04, 0.11);
  vec3 nightMist = vec3(0.08, 0.16, 0.22);
  vec3 col = mix(nightMist, nightTop, smoothstep(0.25, 0.98, y));

  // Layered canopy ridges + volumetric drifting mist
  float canopyFar = 0.52 + 0.12 * fbm(vec2(uv.x * 6.0, 0.4));
  if (y < canopyFar) {
    col = mix(col, vec3(0.03, 0.10, 0.08), 0.85);
  }
  float mist1 = fbm(vec2(uv.x * 3.0 + t * 0.035, y * 5.0));
  col = mix(col, vec3(0.18, 0.29, 0.34), smoothstep(0.48, 0.84, mist1) * 0.36);

  // Foreground mossy trunks & crimson bromeliad hints
  float trunkL = smoothstep(0.24, 0.14, uv.x + 0.04 * sin(y * 6.0));
  float trunkR = smoothstep(0.78, 0.88, uv.x + 0.03 * cos(y * 5.0));
  vec3 bark = mix(vec3(0.03, 0.08, 0.05), vec3(0.09, 0.22, 0.12), fbm(uv * 22.0));
  col = mix(col, bark, max(trunkL, trunkR) * 0.9);

  // Faint bioluminescent Mycena fungi spores
  float spore = smoothstep(0.955, 0.995, noise2(uv * 32.0 + vec2(0.0, -t * 0.15)));
  col += vec3(0.10, 0.88, 0.58) * spore * (0.4 + 0.6 * sin(t * 2.2 + uv.x * 15.0));
  return col;
}

vec3 applyLightingGrade(vec3 col, vec2 uv) {
  if (uLightIndex == 0) return col;
  if (uBiomeId == 0) {
    if (uLightIndex == 1) {
      // Golden Hour
      col *= vec3(1.16, 0.97, 0.74);
      col += vec3(0.10, 0.045, 0.0) * smoothstep(0.1, 0.9, uv.y);
    } else {
      // Misty Dawn
      col = mix(col * vec3(0.86, 0.93, 1.12), vec3(0.62, 0.70, 0.82), smoothstep(0.2, 0.85, uv.y) * 0.26);
    }
  } else if (uBiomeId == 1) {
    if (uLightIndex == 1) {
      // Turbid Plankton Bloom
      col = mix(col * vec3(0.84, 1.06, 0.88), vec3(0.11, 0.34, 0.30), 0.22);
    } else {
      // Twilight Blue-Hour Fluorescence
      col *= vec3(0.55, 0.72, 1.18);
      col = pow(max(col, vec3(0.0)), vec3(1.08));
    }
  } else {
    if (uLightIndex == 1) {
      // Bioluminescent Rain
      col *= vec3(0.82, 1.04, 1.02);
    } else {
      // Deep Starlight Canopy
      col *= vec3(0.64, 0.70, 0.94);
    }
  }
  return clamp(col, 0.0, 1.0);
}

void main() {
  float motionScale = mix(1.0, 0.22, uReducedMotion);
  float t = uTime * motionScale;

  // Apply 4.5% edge overscan so 2.5D relief parallax NEVER hits CLAMP_TO_EDGE smear strips
  float overscan = 1.045;
  vec2 centered = (vUv - 0.5) / (max(1.0, uCamZoom) * overscan) + 0.5 + uCamOffset;
  centered.y += uGaitBob * 0.008 * motionScale;

  // Sample bio map at base UV (Note: textures uploaded with UNPACK_FLIP_Y_WEBGL = true, so vUv.y=1 is top)
  vec2 safeUv = clamp(centered, 0.004, 0.996);
  vec4 bio0 = texture(uPlateBio, safeUv);
  float d0 = mix(0.5, bio0.r, uPlateMix);

  // 2-step 2.5D relief parallax offset
  vec2 pShift = uParallax * (d0 - 0.35) * vec2(0.022, -0.015) * motionScale;
  vec2 uvPar1 = clamp(safeUv - pShift, 0.004, 0.996);
  vec4 bio1 = texture(uPlateBio, uvPar1);
  float d1 = mix(0.5, bio1.r, uPlateMix);
  vec2 uvPar = clamp(safeUv - uParallax * (d1 - 0.35) * vec2(0.024, -0.016) * motionScale, 0.004, 0.996);

  // Biome-specific living micro-animation (Human baselines & solid reef/forest geometry stay rock-steady, zero wavy warp)
  vec4 bio = texture(uPlateBio, uvPar);
  float windMask = bio.b * uPlateMix;
  bool isHumanPov = (uSpeciesId == 0 || uSpeciesId == 5 || uSpeciesId == 10);

  vec2 animUv = uvPar;
  if (!isHumanPov) {
    if (uBiomeId == 0 && uSpeciesId == 4) {
      // Gentle grass breeze for Whitetail Deer rod motion-differencing
      animUv.x += sin(t * 1.9 + uvPar.x * 7.0 + uvPar.y * 3.0) * 0.0014 * windMask * motionScale;
    } else if (uBiomeId == 0 && uSpeciesId != 16) {
      // Ultra-subtle alpine breeze on terrestrial animal foliage (excluding submerged Trout Snell's Window)
      animUv.x += sin(t * 1.5 + uvPar.x * 5.0) * 0.0007 * windMask * motionScale;
    } else if (uBiomeId == 2 && uSpeciesId != 23) {
      // Whisper-soft hanging frond drift in cloud forest (excluding downward Ogre-Faced Spider floor focus)
      animUv.x += sin(t * 1.1 + uvPar.y * 5.0) * 0.0006 * windMask * motionScale;
    }
    // Reef (uBiomeId == 1): zero UV waviness so coral, sand, and marine life remain razor-sharp
  }
  animUv = clamp(animUv, 0.002, 0.998);

  vec3 procCol = renderProceduralBiome(uvPar, t);
  vec3 plateCol = texture(uPlateRGB, animUv).rgb;
  vec3 sceneCol = mix(procCol, plateCol, uPlateMix);

  // Subtle physically grounded atmospheric overlays (never wavy, never obscuring Human baselines)
  if (uBiomeId == 1) {
    // Soft underwater caustic shimmer on illuminated lower reef/sand surfaces (subtle & crisp, zero wavy distortion)
    if (!isHumanPov && uLightIndex == 0) {
      float caust = voronoiCaustic(uvPar * vec2(7.5, 4.8) + vec2(t * 0.11, t * 0.06), t * 0.9);
      float surfaceMask = smoothstep(0.75, 0.30, uvPar.y) * (0.25 + 0.75 * bio.r);
      sceneCol += vec3(0.08, 0.24, 0.28) * caust * surfaceMask * 0.14 * motionScale;
    }
  } else if (uBiomeId == 2) {
    // Soft cloud forest mist drift & optional bioluminescent rain
    if (!isHumanPov) {
      float mist = fbm(vec2(uvPar.x * 3.2 + t * 0.04, uvPar.y * 3.8));
      sceneCol = mix(sceneCol, vec3(0.14, 0.22, 0.28), smoothstep(0.62, 0.92, mist) * 0.12 * (1.0 - bio.r * 0.6));
    }
    if (uLightIndex == 1) {
      float rain = smoothstep(0.965, 0.995, noise2(vec2(uvPar.x * 95.0 + uvPar.y * 12.0, uvPar.y * 12.0 + t * 8.0)));
      sceneCol += vec3(0.45, 0.75, 0.85) * rain * 0.22 * motionScale;
      float mycena = smoothstep(0.968, 0.995, noise2(uvPar * 28.0 + vec2(0.0, -t * 0.12)));
      sceneCol += vec3(0.12, 0.95, 0.58) * mycena * 0.32 * motionScale;
    }
  }

  sceneCol = applyLightingGrade(sceneCol, uvPar);
  fragColor = vec4(sceneCol, 1.0);
}
`;

export const UMWELT_PERCEPTION_FS = `#version 300 es
precision highp float;
in vec2 vUv;

uniform sampler2D uLivingTex;
uniform sampler2D uPrevTex;
uniform sampler2D uBioTex;

uniform int uBiomeId;
uniform int uSpeciesId;      // 0..23
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uCursor;        // normalized [0..1], y=0 bottom .. y=1 top (WebGL coords)
uniform float uPolAngle;     // radians [0..PI] for Cuttlefish
uniform float uApertureMm;   // pinhole pupil diameter [0.4..2.8 mm] for Chambered Nautilus
uniform float uSonarAge;     // seconds since last bat sonar ping (large = inactive)
uniform vec2 uSonarOrigin;   // normalized WebGL UV of sonar emission
uniform float uSplitEnabled; // 0 or 1
uniform float uSplitX;       // [0..1]
uniform float uTransition;   // [0..1] swoop iris pulse
uniform float uReducedMotion;

// Grounded semantic targets in WebGL UV (x, y_gl, rx, ry)
uniform vec4 uTargetPrimary;
uniform vec4 uTargetSecondary;
uniform vec4 uEnvFeature;

out vec4 fragColor;

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float pNoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float capillaryNet(vec2 p) {
  float n1 = abs(pNoise2(p * 14.0) * 2.0 - 1.0);
  float n2 = abs(pNoise2(p * 29.0 + vec2(4.7, 9.2)) * 2.0 - 1.0);
  float ridge1 = pow(clamp(1.0 - n1, 0.0, 1.0), 6.0);
  float ridge2 = pow(clamp(1.0 - n2, 0.0, 1.0), 7.0);
  return clamp(ridge1 * 0.85 + ridge2 * 0.65, 0.0, 1.0);
}

// Ironbow thermal palette for Rattlesnake / Vampire Bat IR
vec3 ironbow(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c0 = vec3(0.05, 0.03, 0.24); // 6C icy indigo
  vec3 c1 = vec3(0.26, 0.06, 0.52); // 16C violet
  vec3 c2 = vec3(0.78, 0.22, 0.14); // 26C warm granite
  vec3 c3 = vec3(0.98, 0.68, 0.12); // 32C amber
  vec3 c4 = vec3(1.00, 0.96, 0.92); // 38.2C blazing endothermic vole
  if (t < 0.25) return mix(c0, c1, t / 0.25);
  if (t < 0.55) return mix(c1, c2, (t - 0.25) / 0.30);
  if (t < 0.80) return mix(c2, c3, (t - 0.55) / 0.25);
  return mix(c3, c4, (t - 0.80) / 0.20);
}

float ellipseMask(vec2 uv, vec4 el, float scale) {
  vec2 d = (uv - el.xy) / max(vec2(0.02), el.zw * scale);
  return clamp(1.0 - dot(d, d), 0.0, 1.0);
}

// Hexagonal distance for Honeybee ommatidia near cursor
float hexEdge(vec2 p) {
  p = abs(p);
  float c = dot(p, normalize(vec2(1.0, 1.73205)));
  return max(c, p.x);
}

vec3 computeHumanBaseline(vec2 uv, vec3 baseCol, float t) {
  if (uBiomeId == 0) {
    return baseCol;
  } else if (uBiomeId == 1) {
    // Beer-Lambert underwater red attenuation (>600nm absorbed at 4m)
    vec3 atten = baseCol * vec3(0.62, 0.92, 1.08);
    float y = luma(atten);
    return mix(vec3(y * 0.42, y * 0.78, y * 0.94), atten, 0.72);
  } else {
    // Human Twilight / Mesopic Dusk Vision (498nm Purkinje shift — clean & crisp, zero static snow)
    // At dusk, long-wavelength reds fade first while blue-green rods preserve cool twilight depth
    float rodY = clamp(baseCol.r * 0.14 + baseCol.g * 0.56 + baseCol.b * 0.30, 0.0, 1.0);
    vec3 mutedDusk = vec3(baseCol.r * 0.56, baseCol.g * 0.90, baseCol.b * 1.08);
    vec3 purkinjeTone = vec3(rodY * 0.62, rodY * 0.80, rodY * 1.02);
    vec3 twilight = mix(purkinjeTone, mutedDusk, 0.50);
    // Deep blue-hour dusk atmosphere with rich readable shadow detail
    twilight = pow(max(twilight, vec3(0.0)), vec3(1.04)) * vec3(0.78, 0.88, 1.04);
    twilight += vec3(0.015, 0.028, 0.065) * (1.0 - rodY);
    return clamp(twilight, 0.0, 1.0);
  }
}

vec3 computeSpeciesVision(vec2 uv, float aspect) {
  vec3 base = texture(uLivingTex, uv).rgb;
  vec4 bio = texture(uBioTex, uv);
  float t = uTime;

  // --- [0] HUMAN MEADOW / [5] HUMAN DIVER / [10] HUMAN NIGHT HIKER ---
  if (uSpeciesId == 0 || uSpeciesId == 5 || uSpeciesId == 10) {
    return computeHumanBaseline(uv, base, t);
  }

  // --- [1] AMERICAN KESTREL: UV 370nm + 2.2x Dual-Fovea Telephoto Loupe ---
  if (uSpeciesId == 1) {
    vec2 diff = (uv - uCursor) * vec2(aspect, 1.0);
    float dist = length(diff);
    float loupeRadius = 0.21;
    float inLoupe = smoothstep(loupeRadius, loupeRadius - 0.015, dist);

    // Magnify 2.2x inside central fovea loupe
    vec2 sampleUv = mix(uv, clamp(uCursor + (uv - uCursor) / 2.2, 0.002, 0.998), inLoupe);
    vec3 col = texture(uLivingTex, sampleUv).rgb;
    vec4 sBio = texture(uBioTex, sampleUv);

    // Oil-droplet crisp micro-contrast + slight tetrachromatic brilliance
    vec3 blur = 0.25 * (
      texture(uLivingTex, sampleUv + vec2(0.0025, 0.0)).rgb +
      texture(uLivingTex, sampleUv - vec2(0.0025, 0.0)).rgb +
      texture(uLivingTex, sampleUv + vec2(0.0, 0.0025)).rgb +
      texture(uLivingTex, sampleUv - vec2(0.0, 0.0025)).rgb
    );
    col = clamp(col + (col - blur) * (0.45 + 0.65 * inLoupe), 0.0, 1.0);

    // Winding grass-occluded UV vole urine scent runway connecting uTargetSecondary (runway fork) -> uTargetPrimary (vole)
    vec2 pA = (uTargetSecondary.z > 0.001) ? uTargetSecondary.xy : vec2(uTargetPrimary.x - 0.22, uTargetPrimary.y + 0.18);
    vec2 pB = uTargetPrimary.xy;
    vec2 ab = pB - pA;
    float abLen2 = max(0.0001, dot(ab, ab));
    float segT = clamp(dot(sampleUv - pA, ab) / abLen2, 0.0, 1.0);
    vec2 perp = normalize(vec2(-ab.y, ab.x));
    vec2 curvePt = mix(pA, pB, segT) + perp * sin(segT * 6.2831) * 0.022;
    float distTrail = length((sampleUv - curvePt) * vec2(aspect, 1.0));
    float endFade = smoothstep(0.0, 0.08, segT) * smoothstep(1.05, 0.92, segT);
    float uvTrail = exp(-pow(distTrail / 0.020, 2.0)) * endFade * (0.68 + 0.32 * sin(segT * 28.0 - t * 2.0));

    // Secondary upstream fork feeding into pA from upper-left meadow track
    vec2 p0 = vec2(max(0.12, pA.x - 0.24), min(0.84, pA.y + 0.16));
    vec2 d01 = pA - p0;
    float s0 = clamp(dot(sampleUv - p0, d01) / max(0.0001, dot(d01, d01)), 0.0, 1.0);
    float distFork = length((sampleUv - mix(p0, pA, s0)) * vec2(aspect, 1.0));
    float uvFork = exp(-pow(distFork / 0.016, 2.0)) * smoothstep(0.0, 0.15, s0) * 0.62;

    float grassOccl = smoothstep(0.16, 0.68, sBio.b + 0.38);
    float voleGlow = ellipseMask(sampleUv, uTargetPrimary, 1.15);

    vec3 uvViolet = vec3(0.72, 0.24, 1.0);
    col = mix(col, col * vec3(0.92, 0.96, 1.10), 0.28);
    col += uvViolet * ((uvTrail + uvFork) * grassOccl * (0.58 + 0.52 * inLoupe) + voleGlow * (0.38 + 0.50 * inLoupe));
    // Subtle secondary UV fluorescence on bright wildflowers
    col += vec3(0.45, 0.15, 0.85) * sBio.g * 0.14;

    // Subtle optical fovea rim
    float rim = smoothstep(loupeRadius + 0.004, loupeRadius, dist) - smoothstep(loupeRadius, loupeRadius - 0.005, dist);
    col = mix(col, vec3(0.76, 0.48, 1.0), rim * 0.65);
    return clamp(col, 0.0, 1.0);
  }

  // --- [2] WESTERN HONEYBEE: UV/B/G Red-Blind + UV Bullseyes + Sky Rayleigh Polarization ---
  if (uSpeciesId == 2) {
    // Red-blind cone matrix (344/436/544 nm): L-cone absent!
    // Scarlet red poppies have high R, low G & B -> crush cleanly to velvety charcoal black
    float redExcess = max(0.0, base.r - max(base.g, base.b) * 1.15);
    // Strict yellow petal classifier: BOTH R & G high AND R/G >= 0.85 so green grass stays natural bee green-teal!
    float rgRatio = base.r / max(0.02, base.g);
    float trueYellowPetal = smoothstep(0.45, 0.72, base.r)
                          * smoothstep(0.36, 0.65, base.g)
                          * smoothstep(0.42, 0.16, base.b)
                          * smoothstep(0.84, 1.05, rgRatio);
    // Natural blue-violet lupine/aster blossoms also carry mild UV reflectance
    float violetPetal = smoothstep(0.28, 0.56, base.b) * smoothstep(0.18, 0.45, base.r) * smoothstep(0.95, 0.72, base.g / max(0.02, base.b));

    // Accurate honeybee color mapping:
    // Green foliage -> calm muted olive-teal (stimulating Green receptor only)
    // Sky -> crisp azure-blue | Yellow Rudbeckia -> electric UV "bee's purple" & cyan bullseyes
    float gResp = base.g * 0.82;
    float bResp = base.b * 0.96 + base.g * 0.14;
    float uvResp = clamp(trueYellowPetal * 0.95 + violetPetal * 0.50, 0.0, 1.0);

    vec3 col = vec3(
      gResp * 0.14 + uvResp * 0.82,
      gResp * 0.78 + bResp * 0.16 + uvResp * 0.14,
      bResp * 0.98 + gResp * 0.24 + uvResp * 0.86
    );

    // Crush scarlet red poppies into dark velvet charcoal!
    float poppyCrush = smoothstep(0.10, 0.38, redExcess);
    col = mix(col, vec3(0.032, 0.036, 0.052), poppyCrush * 0.94);

    // Ignite UV bullseye concentric landing rings on primary Rudbeckia blossom!
    float dTarget = length((uv - uTargetPrimary.xy) / max(vec2(0.03), uTargetPrimary.zw));
    float bullCore = smoothstep(0.55, 0.10, dTarget);
    float bullRing = smoothstep(1.05, 0.55, dTarget) * smoothstep(0.28, 0.58, dTarget);
    col += vec3(0.72, 0.18, 1.0) * bullCore * 0.72;
    col += vec3(0.18, 0.96, 0.92) * bullRing * (0.42 + 0.16 * sin(t * 2.4 - dTarget * 10.0));

    // Sky Rayleigh polarization compass arcs in upper sky
    float skyMask = smoothstep(0.52, 0.80, uv.y) * smoothstep(0.18, 0.55, bio.a + max(0.0, base.b - base.r));
    vec2 sunPos = vec2(0.76, 0.94);
    float sunDist = length((uv - sunPos) * vec2(aspect, 1.0));
    float rayleigh = 0.5 + 0.5 * sin(sunDist * 46.0 - t * 1.2);
    col += vec3(0.45, 0.78, 1.0) * pow(rayleigh, 3.0) * skyMask * 0.40;

    // Subtle near-cursor hexagonal ommatidia facet overlay
    float cDist = length((uv - uCursor) * vec2(aspect, 1.0));
    float hexZone = smoothstep(0.20, 0.04, cDist);
    vec2 hexUv = uv * vec2(aspect, 1.0) * 58.0;
    vec2 r = vec2(1.0, 1.73205);
    vec2 h = r * 0.5;
    vec2 a = mod(hexUv, r) - h;
    vec2 b = mod(hexUv - h, r) - h;
    vec2 gv = (dot(a, a) < dot(b, b)) ? a : b;
    float edge = smoothstep(0.44, 0.50, hexEdge(gv));
    col = mix(col, col * 0.72 + vec3(0.25, 0.15, 0.40), edge * hexZone * 0.45);
    return clamp(col, 0.0, 1.0);
  }

  // --- [3] PRAIRIE RATTLESNAKE: Low-Acuity B/G + Loreal Pit 8-12um Thermal IR Fusion ---
  if (uSpeciesId == 3) {
    // Low-acuity visual base (slight blur, muted B/G dichromat)
    vec3 blur = (
      texture(uLivingTex, uv + vec2(0.004, 0.002)).rgb +
      texture(uLivingTex, uv - vec2(0.004, 0.002)).rgb +
      texture(uLivingTex, uv + vec2(-0.003, 0.004)).rgb +
      texture(uLivingTex, uv + vec2(0.003, -0.004)).rgb + base
    ) * 0.2;
    vec3 visualBase = vec3(blur.g * 0.28, blur.g * 0.58, blur.b * 0.74) * 0.55;

    // Compute temperature field T in [0..1]:
    // Cold 6C snowmelt stream (explicit grounded stream ellipse + sky/blue coolness) -> deep indigo
    float creekMask = (uEnvFeature.z > 0.001) ? ellipseMask(uv, uEnvFeature, 1.65) : 0.0;
    float coldWater = clamp(bio.a * 0.75 + max(0.0, base.b - base.r) * 1.3 + creekMask * 0.92, 0.0, 1.0);
    // Warm 28C sun-baked granite rocks -> amber
    float rockMask = (uTargetSecondary.z > 0.001) ? ellipseMask(uv, uTargetSecondary, 1.4) : 0.0;
    float graniteWarm = clamp((luma(base) * 0.75 + (1.0 - bio.b) * 0.40 + rockMask * 0.35) * (1.0 - coldWater) * (0.35 + 0.65 * bio.r), 0.0, 0.68);
    // Blazing 38.2C endothermic meadow vole at uTargetPrimary!
    float voleHeat = ellipseMask(uv, uTargetPrimary, 1.2);
    float volePulse = 0.93 + 0.07 * sin(t * 4.8);
    float temp = clamp(0.24 + graniteWarm * 0.44 - coldWater * 0.38 + voleHeat * 0.84 * volePulse, 0.0, 1.0);

    vec3 irCol = ironbow(temp);
    float thermalWeight = clamp(0.66 + voleHeat * 0.32 + coldWater * 0.20, 0.0, 0.96);
    vec3 col = mix(visualBase, irCol, thermalWeight);
    // Subtle radiant thermal halo above warm vole
    float plume = ellipseMask(uv - vec2(0.0, 0.022 + 0.006 * sin(t * 3.6)), uTargetPrimary, 1.45);
    col += vec3(1.0, 0.38, 0.76) * plume * 0.22;
    return clamp(col, 0.0, 1.0);
  }

  // --- [4] WHITETAIL DEER: Dichromat + Horizontal Visual Streak + Rod Motion Shimmer ---
  if (uSpeciesId == 4) {
    // Horizon streak centered dynamically on the spruce horizon line
    float streakY = (uEnvFeature.z > 0.001) ? uEnvFeature.y : 0.50;
    float vDist = abs(uv.y - streakY);
    float blurAmt = smoothstep(0.11, 0.38, vDist) * 0.0075;
    vec3 col = (
      texture(uLivingTex, uv).rgb * 0.4 +
      texture(uLivingTex, clamp(uv + vec2(0.0, blurAmt), 0.002, 0.998)).rgb * 0.3 +
      texture(uLivingTex, clamp(uv - vec2(0.0, blurAmt), 0.002, 0.998)).rgb * 0.3
    );

    // S (455nm) + M (537nm) Red-Green Dichromacy: red wildflowers flatten into olive-gold grass
    float blueC = col.b * 0.94 + col.g * 0.08;
    float oliveC = col.r * 0.46 + col.g * 0.54;
    vec3 dichrom = vec3(oliveC * 0.88, oliveC * 0.96, blueC * 1.05);

    // Temporal frame differencing damped so mouse parallax doesn't wash the screen in cyan
    vec3 prev = texture(uPrevTex, uv).rgb;
    float deltaI = smoothstep(0.025, 0.14, abs(luma(base) - luma(prev))) * 0.55;

    // Stalking bobcat micro-ear-twitch motion shimmer along timberline
    float bobcatMask = ellipseMask(uv, uTargetPrimary, 1.15);
    float twitch = pow(max(0.0, sin(t * 3.6) * sin(t * 1.5 + 0.4)), 3.0);
    float bobcatShimmer = bobcatMask * (0.34 + 0.82 * twitch) * smoothstep(0.12, 0.55, luma(base) + 0.25);

    float streakBoost = 1.0 - smoothstep(0.08, 0.26, vDist);
    vec3 motionGlow = vec3(0.55, 0.94, 1.0) * clamp(deltaI * (0.35 + 0.65 * streakBoost) + bobcatShimmer, 0.0, 1.05);

    vec3 outCol = dichrom + motionGlow * 0.72;
    outCol *= 1.0 - smoothstep(0.28, 0.54, vDist) * 0.22;
    return clamp(outCol, 0.0, 1.0);
  }

  // --- [6] PEACOCK MANTIS SHRIMP: 12-Channel Tilted Midband Scanline + Circular Polarization ---
  if (uSpeciesId == 6) {
    float angle = -0.26;
    vec2 rel = (uv - uCursor) * vec2(aspect, 1.0);
    float bandPerp = abs(-rel.x * sin(angle) + rel.y * cos(angle));
    float inBand = smoothstep(0.115, 0.065, bandPerp);
    float bandEdge = smoothstep(0.122, 0.112, bandPerp) - smoothstep(0.112, 0.102, bandPerp);

    // 12 narrowband hyperspectral quantization inside the tilted midband
    vec3 peripheral = mix(vec3(luma(base) * 0.85), base, 0.58) * vec3(0.84, 0.96, 1.02);
    vec3 hyper = floor(base * 6.0 + 0.5) / 6.0;
    hyper = clamp(mix(base, hyper, 0.42) * 1.15, 0.0, 1.0);
    hyper = clamp(mix(vec3(luma(hyper)), hyper, 1.72), 0.0, 1.0);
    hyper += vec3(0.28, 0.08, 0.42) * bio.g * 0.28;

    vec3 col = mix(peripheral, hyper, inBand);

    // Circularly Polarized (CPL) armored crab shell & iridescent clam mantle conform to real shell luminance
    float shellTex = smoothstep(0.14, 0.62, luma(base));
    float cplTarget = ellipseMask(uv, uTargetPrimary, 1.15) * shellTex;
    float cplWave = 0.5 + 0.5 * sin(length((uv - uTargetPrimary.xy) * vec2(aspect, 1.0)) * 55.0 - t * 3.2);
    vec3 cplNeon = mix(vec3(1.0, 0.20, 0.56), vec3(1.0, 0.84, 0.18), cplWave);
    col += cplNeon * cplTarget * (0.28 + 0.82 * inBand);

    if (uTargetSecondary.z > 0.001) {
      float clamMask = ellipseMask(uv, uTargetSecondary, 1.2) * shellTex;
      col += vec3(0.20, 0.95, 1.0) * clamMask * (0.22 + 0.55 * inBand);
    }

    col = mix(col, vec3(1.0, 0.42, 0.82), bandEdge * 0.62);
    return clamp(col, 0.0, 1.0);
  }

  // --- [7] BROADCLUB CUTTLEFISH: 492nm Monochromat + W-Pupil + Malus's Law Linear Polarization ---
  if (uSpeciesId == 7) {
    // Single visual opsin peaking at 492nm (crisp blue-green monochrome)
    float iMono = clamp(base.r * 0.10 + base.g * 0.62 + base.b * 0.28, 0.0, 1.0);

    // Subtle W-pupil chromatic edge sheen
    float wShift = 0.0018;
    float edgeR = luma(texture(uLivingTex, clamp(uv + vec2(wShift, 0.0), 0.002, 0.998)).rgb);
    float edgeB = luma(texture(uLivingTex, clamp(uv - vec2(wShift, 0.0), 0.002, 0.998)).rgb);
    float wHalo = (edgeR - edgeB) * 1.1;

    // Fine structural detail of translucent shrimp & silverside scales (preserves real photo sharpness!)
    vec2 pxC = vec2(1.0) / max(vec2(320.0), uResolution * 0.6);
    float cL = luma(texture(uLivingTex, uv - vec2(pxC.x, 0.0)).rgb);
    float cR = luma(texture(uLivingTex, uv + vec2(pxC.x, 0.0)).rgb);
    float cD = luma(texture(uLivingTex, uv - vec2(0.0, pxC.y)).rgb);
    float cU = luma(texture(uLivingTex, uv + vec2(0.0, pxC.y)).rgb);
    float microEdge = clamp(length(vec2(cR - cL, cU - cD)) * 6.5, 0.0, 1.0);

    float shrimpMask = ellipseMask(uv, uTargetPrimary, 1.25);
    float fishMask = (uTargetSecondary.z > 0.001) ? ellipseMask(uv, uTargetSecondary, 1.2) : 0.0;

    float psiShrimp = 0.733; // ~42 deg linear polarization angle of glass shrimp
    float psiFish = 1.92;    // ~110 deg specular silverside scales
    float psiWater = 0.0;

    float polShrimp = cos(2.0 * (psiShrimp - uPolAngle));
    float polFish = cos(2.0 * (psiFish - uPolAngle));
    float polWater = cos(2.0 * (psiWater - uPolAngle)) * 0.20 * bio.a;

    float iPol = iMono * (1.0 + polWater);
    float shrimpPop = clamp(0.5 + 0.5 * polShrimp, 0.0, 1.0);
    float fishPop = clamp(0.5 + 0.5 * polFish, 0.0, 1.0);

    // Crisp monochrome baseline; when analyzer aligns with shrimp's e-vector, shrimp body & edges erupt in high-contrast electric cyan-white!
    vec3 monoCol = vec3(iPol * 0.86, iPol * 0.94, iPol * 0.97);
    float shrimpBody = clamp(microEdge * 0.95 + smoothstep(0.32, 0.78, iMono) * 0.65, 0.0, 1.0);
    // Slight darkening of water right behind shrimp when aligned boosts true polarization figure-ground separation
    monoCol *= 1.0 - shrimpMask * (1.0 - shrimpBody) * pow(shrimpPop, 1.6) * 0.38;
    monoCol += vec3(0.55, 0.98, 1.0) * shrimpMask * shrimpBody * pow(shrimpPop, 1.5) * 0.95;
    monoCol += vec3(0.42, 0.92, 0.98) * fishMask * smoothstep(0.45, 0.85, iMono) * pow(fishPop, 2.0) * 0.52;
    monoCol += vec3(0.06, 0.14, 0.18) * wHalo;
    return clamp(monoCol, 0.0, 1.0);
  }

  // --- [8] SCALLOPED HAMMERHEAD: Green-Blue Rod Vision + Ampullae of Lorenzini E-Dipole ---
  if (uSpeciesId == 8) {
    float gb = base.g * 0.64 + base.b * 0.36;
    vec3 col = vec3(gb * 0.26, gb * 0.72, gb * 0.84) * 0.88;

    // Bioelectric dipole math: E(r) = (3(mu.r_hat)r_hat - mu) / (r^2 + eps^2)^1.5
    vec2 r0 = uTargetPrimary.xy;
    vec2 rVec = (uv - r0) * vec2(aspect, 1.0);
    float r2 = dot(rVec, rVec);
    float rLen = sqrt(r2 + 0.0018);
    vec2 rHat = rVec / rLen;

    // 1.2 Hz stingray respiratory gill heartbeat
    float gillPulse = 0.62 + 0.38 * sin(t * 2.0 * 3.1415926 * 1.2);
    vec2 mu = vec2(0.85, 0.52) * gillPulse;
    vec2 Evec = (3.0 * dot(mu, rHat) * rHat - mu) / pow(r2 + 0.012, 1.35);
    float Emag = length(Evec);

    float headDist = length((uCursor - r0) * vec2(aspect, 1.0));
    float senseGain = 0.42 + 0.85 * smoothstep(0.55, 0.08, headDist);

    float ang = atan(rVec.y, rVec.x);
    float fieldLine = pow(abs(sin(ang * 2.0 + 0.55)), 1.5) * exp(-rLen * 5.2);
    float rings = 0.5 + 0.5 * sin(rLen * 58.0 - t * 2.0 * 3.1415926 * 1.2);
    float core = exp(-r2 / 0.0055) * gillPulse;

    vec3 dipoleCol = mix(vec3(0.32, 0.28, 1.0), vec3(0.18, 0.96, 0.98), clamp(Emag * 0.025 + core, 0.0, 1.0));
    float intensity = clamp((fieldLine * (0.45 + 0.55 * rings) + core * 1.15) * senseGain, 0.0, 1.25);
    col += dipoleCol * intensity * 0.90;

    // Only draw secondary dipole if a secondary prey is actually present in the plate!
    if (uTargetSecondary.z > 0.001) {
      vec2 r1 = (uv - uTargetSecondary.xy) * vec2(aspect, 1.0);
      float secGlow = exp(-dot(r1, r1) / 0.004) * (0.45 + 0.35 * sin(t * 5.5));
      col += vec3(0.38, 0.65, 1.0) * secGlow * 0.32;
    }
    return clamp(col, 0.0, 1.0);
  }

  // --- [9] HAWKSBILL SEA TURTLE: Carotenoid Oil-Droplet Biofluorescence Filter ---
  if (uSpeciesId == 9) {
    // Suppress ambient <500nm blue scatter into deep dark cobalt
    vec3 darkCobalt = vec3(base.r * 0.16, base.g * 0.22, base.b * 0.40) * 0.52;

    // Organic pigment-driven 515nm green & 585nm red-orange biofluorescence (preserves real coral & frogfish texture!)
    float greenFluor = clamp((base.g - base.b * 0.78) * 2.7, 0.0, 1.0);
    float redFluor = clamp((base.r - base.b * 0.65) * 2.9, 0.0, 1.0);
    float detail = smoothstep(0.12, 0.65, luma(base));

    float frogMask = ellipseMask(uv, uTargetPrimary, 1.22) * detail;
    float spongeMask = (uTargetSecondary.z > 0.001) ? ellipseMask(uv, uTargetSecondary, 1.35) * detail : 0.0;
    float pulse = 0.90 + 0.10 * sin(t * 2.2);

    vec3 neonGreen = vec3(0.10, 1.0, 0.50);
    vec3 neonRed = vec3(1.0, 0.26, 0.14);

    vec3 col = darkCobalt
      + neonGreen * (pow(greenFluor, 1.25) * 0.88 + spongeMask * 0.45 * pulse)
      + neonRed * (pow(redFluor, 1.15) * 0.95 + frogMask * 0.52 * pulse);
    return clamp(col, 0.0, 1.0);
  }

  // --- [11] LEAF-TAILED GECKO: 350x Nocturnal Full-Color Cone Retina + Pinhole Slit Bokeh ---
  if (uSpeciesId == 11) {
    vec3 boosted = pow(max(base, vec3(0.001)), vec3(0.76)) * 1.30;
    float y = luma(boosted);
    vec3 vivid = mix(vec3(y), boosted, 1.50);
    // Vertical multifocal slit-pupil vertical bokeh sheen on bright specular highlights
    vec3 upS = texture(uLivingTex, clamp(uv + vec2(0.0, 0.006), 0.002, 0.998)).rgb;
    vec3 dnS = texture(uLivingTex, clamp(uv - vec2(0.0, 0.006), 0.002, 0.998)).rgb;
    vec3 slitGlow = max(vec3(0.0), (upS + dnS) * 0.5 - 0.58) * 0.50;

    // Wing-scale-modulated nocturnal iridescence on moth (keeps wing markings tack sharp!)
    float mothMask = ellipseMask(uv, uTargetPrimary, 1.15) * smoothstep(0.15, 0.65, luma(base));
    vec3 mothShimmer = mix(vec3(0.12, 0.95, 0.58), vec3(0.96, 0.86, 0.30), 0.5 + 0.5 * sin(t * 2.0 + uv.x * 20.0));
    vec3 col = vivid + slitGlow + mothShimmer * mothMask * 0.34;
    return clamp(col, 0.0, 1.0);
  }

  // --- [12] PORTIA JUMPING SPIDER: Tiered Retina Chromatic Defocus Rangefinder ---
  if (uSpeciesId == 12) {
    float focusDepth = texture(uBioTex, uCursor).r;
    float depthErr = abs(bio.r - focusDepth);
    // Tier 1 focuses green cleanly; Tier 2 measures chromatic defocus offset!
    float defocusSpread = clamp(depthErr * 0.022, 0.0, 0.012);

    float gSharp = texture(uLivingTex, uv).g;
    float rDefocus = texture(uLivingTex, clamp(uv + vec2(defocusSpread, defocusSpread * 0.5), 0.002, 0.998)).r;
    float bDefocus = texture(uLivingTex, clamp(uv - vec2(defocusSpread, -defocusSpread * 0.5), 0.002, 0.998)).b;

    vec3 col = vec3(rDefocus * 0.92, gSharp * 1.12, bDefocus * 1.05);

    float cDist = length((uv - uCursor) * vec2(aspect, 1.0));
    float ringZone = smoothstep(0.24, 0.05, cDist);
    float lockScore = clamp(1.0 - depthErr * 4.5, 0.0, 1.0);
    vec3 rangeTint = mix(vec3(0.95, 0.25, 0.88), vec3(0.22, 1.0, 0.56), lockScore);
    col = mix(col, col * 0.88 + rangeTint * 0.24, ringZone * 0.30);

    // Subtle crisp focus lock highlight conforming to katydid silhouette when aimed near prey
    float preyMask = ellipseMask(uv, uTargetPrimary, 1.15) * smoothstep(0.14, 0.60, luma(base));
    float cursorOnPrey = ellipseMask(uCursor, uTargetPrimary, 2.2);
    col += vec3(0.22, 1.0, 0.56) * preyMask * (0.12 + 0.38 * cursorOnPrey);

    float vig = smoothstep(0.74, 0.32, length((uv - 0.5) * vec2(aspect * 0.72, 1.05)));
    col *= (0.50 + 0.50 * vig);
    return clamp(col, 0.0, 1.0);
  }

  // --- [13] SWAINSON'S THRUSH: Twilight Vision + Cryptochrome-4 Quantum Magnetoreception Dome ---
  if (uSpeciesId == 13) {
    // Rich dusk contrast: deepen bright twilight clouds slightly so quantum radical-pair bands read unmistakably
    float skyWeight = smoothstep(0.36, 0.62, uv.y) * (0.45 + 0.55 * bio.a);
    vec3 col = mix(base * 1.05, base * vec3(0.42, 0.48, 0.72), skyWeight * 0.64);

    // Viewing ray v(u) and geomagnetic vector B aligned identically to uTargetPrimary (62 deg inclination dip node)
    vec3 viewRay = normalize(vec3((uv.x - 0.5) * aspect * 1.35, (uv.y - 0.35) * 1.25, 1.0));
    vec2 magCenter = uTargetPrimary.xy;
    vec3 Bvec = normalize(vec3((magCenter.x - 0.5) * aspect * 1.35, (magCenter.y - 0.35) * 1.25, 1.0));

    float vDotB = clamp(dot(viewRay, Bvec), -1.0, 1.0);
    float angFromB = acos(vDotB); // 0 at dip node

    // Cryptochrome-4 radical-pair modulation creates a dark-violet shadowed annulus + glowing golden inclination node!
    float darkShadowRing = exp(-pow((angFromB - 0.34) / 0.14, 2.0));
    float violetRing = exp(-pow((angFromB - 0.24) / 0.085, 2.0));
    float goldenRim = exp(-pow((angFromB - 0.13) / 0.032, 2.0));
    float dipCore = exp(-pow(angFromB / 0.068, 2.0));
    float meridians = pow(0.5 + 0.5 * sin(angFromB * 34.0 - t * 1.1), 5.0) * smoothstep(0.75, 0.18, angFromB);

    float quantumShimmer = 0.88 + 0.12 * sin(t * 2.2 + angFromB * 14.0);

    // First apply Cry4 dark spin-singlet modulation so it pops even over bright twilight clouds
    col = mix(col, vec3(0.08, 0.05, 0.24), darkShadowRing * skyWeight * 0.68);
    // Layer ethereal violet triplet ring & luminous golden 62-degree inclination dip node
    col = mix(col, vec3(0.54, 0.26, 0.98), violetRing * skyWeight * 0.62 * quantumShimmer);
    col = mix(col, vec3(1.0, 0.78, 0.24), clamp((goldenRim * 0.80 + dipCore * 0.92 + meridians * 0.28) * skyWeight * quantumShimmer, 0.0, 0.95));
    return clamp(col, 0.0, 1.0);
  }

  // --- [14] COMMON VAMPIRE BAT: 60-90 kHz 3D Ultrasonic Sonar Wavefront + TRPV1 Capillary Heat ---
  if (uSpeciesId == 14) {
    // Near-total dim rod darkness baseline
    float rodDim = luma(base) * 0.14;
    vec3 col = vec3(rodDim * 0.45, rodDim * 0.55, rodDim * 0.72);

    // Compute depth gradient ||grad d|| for acoustic edge reflection
    vec2 px = vec2(1.0) / max(vec2(320.0), uResolution * 0.5);
    float dL = texture(uBioTex, uv - vec2(px.x * 2.0, 0.0)).r;
    float dR = texture(uBioTex, uv + vec2(px.x * 2.0, 0.0)).r;
    float dD = texture(uBioTex, uv - vec2(0.0, px.y * 2.0)).r;
    float dU = texture(uBioTex, uv + vec2(0.0, px.y * 2.0)).r;
    float gradD = length(vec2(dR - dL, dU - dD)) * 7.5;

    // Luminance fine structural edges (tree bark, vines, tapir contour)
    float lL = luma(texture(uLivingTex, uv - vec2(px.x * 1.5, 0.0)).rgb);
    float lR = luma(texture(uLivingTex, uv + vec2(px.x * 1.5, 0.0)).rgb);
    float lD = luma(texture(uLivingTex, uv - vec2(0.0, px.y * 1.5)).rgb);
    float lU = luma(texture(uLivingTex, uv + vec2(0.0, px.y * 1.5)).rgb);
    float structEdge = clamp(length(vec2(lR - lL, lU - lD)) * 4.2 + gradD, 0.0, 1.5);

    // Expanding 3D pseudo-distance ultrasonic sonar wavefront: D(u) blends radial + inverse depth
    float radial = length((uv - uSonarOrigin) * vec2(aspect, 1.0));
    float pseudoD = radial * 0.65 + (1.0 - bio.r) * 0.45;
    float waveFront = uSonarAge * 0.68;
    float waveEnv = exp(-pow((pseudoD - waveFront) / 0.095, 2.0));
    // Soft lingering acoustic memory trail behind the wavefront
    float trailMem = smoothstep(waveFront + 0.02, waveFront - 0.25, pseudoD) * exp(-uSonarAge * 0.72);
    float sonarActive = step(uSonarAge, 4.5);

    vec3 sonarCyan = mix(vec3(0.06, 0.62, 0.96), vec3(0.45, 1.0, 0.98), waveEnv);
    col += sonarCyan * structEdge * (waveEnv * 1.35 + trailMem * 0.45) * sonarActive;
    col += vec3(0.04, 0.22, 0.34) * waveEnv * 0.35 * sonarActive;

    // Close-range TRPV1 nasal-pit organic thermal signature on resting tapir's warm superficial blood vessels
    float tapirMask = ellipseMask(uv, uTargetPrimary, 1.15);
    float tapirCore = ellipseMask(uv, uTargetPrimary, 0.72);
    float cursorNear = 0.52 + 0.48 * smoothstep(0.44, 0.06, length((uCursor - uTargetPrimary.xy) * vec2(aspect, 1.0)));
    // Organic branching micro-capillary ridge network (replaces synthetic zig-zags!)
    float veins = capillaryNet((uv - uTargetPrimary.xy) * vec2(aspect, 1.0) * 1.6);
    float heartbeat = 0.86 + 0.14 * sin(t * 4.4);
    float bodyWarmth = tapirMask * 0.42 + tapirCore * 0.35 + veins * tapirMask * 0.55;
    vec3 thermalTint = mix(vec3(0.58, 0.05, 0.14), vec3(1.0, 0.46, 0.22), clamp(tapirCore * 0.55 + veins * 0.85, 0.0, 1.0));
    thermalTint = mix(thermalTint, vec3(1.0, 0.86, 0.68), veins * tapirCore * 0.75);
    col += thermalTint * bodyWarmth * cursorNear * heartbeat * (0.62 + 0.38 * clamp(trailMem + waveEnv, 0.0, 1.0));

    return clamp(col, 0.0, 1.0);
  }

  // --- [15] GREEN DARNER DRAGONFLY: Horizon-Split Compound Eye + 200 Hz STMD Intercept ---
  if (uSpeciesId == 15) {
    float horizonY = (uEnvFeature.z > 0.001) ? uEnvFeature.y : 0.50;
    float dorsalMask = smoothstep(horizonY - 0.032, horizonY + 0.032, uv.y);

    // Dorsal hemisphere: UV (355nm) + Blue (440nm) ONLY — bright sky glows intense cyan-violet so dark flies stand out starkly!
    float dorsalBlue = clamp(base.b * 0.78 + base.g * 0.22, 0.0, 1.0);
    float darkSilhouette = smoothstep(0.52, 0.18, luma(base));
    vec3 dorsalCol = vec3(
      pow(dorsalBlue, 1.25) * 0.40,
      pow(dorsalBlue, 1.05) * 0.68,
      pow(dorsalBlue, 0.85) * 1.15
    );
    dorsalCol = mix(dorsalCol, vec3(0.02, 0.03, 0.09), darkSilhouette * 0.85);

    // Ventral hemisphere: 11+ opsin rich hyper-vivid multicolor alpine meadow foliage
    float vLum = luma(base);
    vec3 ventralCol = clamp(mix(vec3(vLum), base, 1.42) * vec3(1.04, 1.06, 0.96), 0.0, 1.0);

    vec3 col = mix(ventralCol, dorsalCol, dorsalMask);

    // Subtle biological horizon optical seam indicator
    float seam = exp(-pow((uv.y - horizonY) / 0.0045, 2.0));
    col = mix(col, vec3(0.45, 0.88, 1.0), seam * 0.36);

    // 200 Hz STMD Predictive Intercept: subtle slow-motion wingbeat trails & glowing cyan lead-trajectory arc on airborne horsefly
    vec2 pFly = uTargetPrimary.xy;
    float flyProx = ellipseMask(uv, uTargetPrimary, 1.45);
    vec2 pxD = vec2(1.0) / max(vec2(320.0), uResolution * 0.6);
    float eX = luma(texture(uLivingTex, uv + vec2(pxD.x, 0.0)).rgb) - luma(texture(uLivingTex, uv - vec2(pxD.x, 0.0)).rgb);
    float eY = luma(texture(uLivingTex, uv + vec2(0.0, pxD.y)).rgb) - luma(texture(uLivingTex, uv - vec2(0.0, pxD.y)).rgb);
    float flyEdge = clamp(length(vec2(eX, eY)) * 6.5, 0.0, 1.0);

    // Crisp cyan STMD target lock silhouette edge & subtle pulsing predictive intercept flight path
    col += vec3(0.18, 0.96, 1.0) * flyEdge * flyProx * 0.95;

    // 3 faint 200 Hz ghosted motion-echo rings trailing down-right -> up-left flight vector
    for (int k = 1; k <= 3; k++) {
      float fk = float(k);
      vec2 echoPos = pFly + vec2(0.028 * fk, -0.012 * fk + 0.004 * sin(t * 9.0 - fk));
      float echoD = length((uv - echoPos) * vec2(aspect, 1.0));
      float echoRing = exp(-pow(echoD / (0.032 - 0.005 * fk), 2.0));
      col += vec3(0.55, 0.35, 1.0) * echoRing * (0.30 / fk) * dorsalMask;
    }

    // Predictive lead intercept trajectory arc extending ahead of the horsefly
    vec2 leadEnd = pFly + vec2(-0.16, 0.055);
    vec2 seg = leadEnd - pFly;
    float segT = clamp(dot(uv - pFly, seg) / max(0.0001, dot(seg, seg)), 0.0, 1.0);
    vec2 curvePt = mix(pFly, leadEnd, segT) + vec2(0.0, sin(segT * 3.14159) * 0.018);
    float dArc = length((uv - curvePt) * vec2(aspect, 1.0));
    float dash = smoothstep(0.1, 0.6, sin(segT * 26.0 - t * 8.0));
    float arcLine = exp(-pow(dArc / 0.0042, 2.0)) * smoothstep(0.08, 0.22, segT) * (1.0 - segT * 0.65) * (0.45 + 0.55 * dash);
    col += vec3(0.22, 0.98, 1.0) * arcLine * 0.85;

    // Subtle dorsal fovea ommatidia micro-facets near cursor when scanning sky
    float cDist = length((uv - uCursor) * vec2(aspect, 1.0));
    float hexZone = smoothstep(0.18, 0.03, cDist) * dorsalMask;
    vec2 hexUv = uv * vec2(aspect, 1.0) * 74.0;
    vec2 hr = vec2(1.0, 1.73205);
    vec2 hh = hr * 0.5;
    vec2 ha = mod(hexUv, hr) - hh;
    vec2 hb = mod(hexUv - hh, hr) - hh;
    vec2 hgv = (dot(ha, ha) < dot(hb, hb)) ? ha : hb;
    float hEdge = smoothstep(0.45, 0.50, hexEdge(hgv));
    col = mix(col, col * 0.82 + vec3(0.18, 0.34, 0.52), hEdge * hexZone * 0.34);

    return clamp(col, 0.0, 1.0);
  }

  // --- [16] CUTTHROAT TROUT: 97.2 deg Snell's Window Aerial Portal + TIR Silver Surface Mirror ---
  if (uSpeciesId == 16) {
    // Center Snell's Window on the natural overhead aerial portal so floating mayfly sits clearly inside
    vec2 winCenter = vec2(0.50, 0.64) + (uCursor - 0.5) * vec2(0.04, 0.03);
    vec2 rel = (uv - winCenter) * vec2(aspect, 1.0);
    float r = length(rel);
    float rCrit = 0.58; // 48.6 deg half-angle critical boundary (97.2 deg full cone)

    // Subtle optical fisheye barrel compression inside Snell's Window
    float inWin = smoothstep(rCrit + 0.035, rCrit - 0.045, r);
    vec2 radialDir = rel / max(0.0001, r);

    // Physically authentic chromatic dispersion rainbow fringe right along the 48.6 deg critical angle rim!
    float rimBand = exp(-pow((r - rCrit) / 0.048, 2.0));
    float dispAmt = rimBand * 0.011;
    vec2 rOff = radialDir * vec2(dispAmt / aspect, dispAmt);
    float cR = texture(uLivingTex, clamp(uv + rOff, 0.002, 0.998)).r;
    float cG = texture(uLivingTex, uv).g;
    float cB = texture(uLivingTex, clamp(uv - rOff, 0.002, 0.998)).b;
    vec3 windowCol = vec3(cR, cG, cB);

    // Trout tetrachromatic UV + crisp aerial sky contrast inside window
    windowCol = clamp(mix(vec3(luma(windowCol)), windowCol, 1.18) * vec3(0.96, 1.03, 1.08), 0.0, 1.0);
    // Subtle prismatic spectrum glint right on the critical angle edge
    vec3 prismGlow = mix(vec3(0.20, 0.88, 1.0), vec3(1.0, 0.52, 0.18), smoothstep(rCrit - 0.04, rCrit + 0.04, r));
    windowCol += prismGlow * rimBand * 0.24;

    // Outside critical angle: Total Internal Reflection (TIR) silver-slate water mirror reflecting stream bottom!
    vec2 mirUv = clamp(vec2(uv.x, 1.0 - uv.y * 0.72), 0.004, 0.996);
    vec3 reflectedBottom = texture(uLivingTex, mirUv).rgb;
    float rippleSpec = pow(0.5 + 0.5 * sin(uv.x * 26.0 + uv.y * 14.0 + t * 1.4), 3.0);
    float mirLum = luma(mix(base, reflectedBottom, 0.45));
    vec3 tirMirror = mix(vec3(0.06, 0.17, 0.22), vec3(0.46, 0.64, 0.70), mirLum * 0.88 + rippleSpec * 0.14);
    // Preserve actual submerged river cobbles at bottom of frame
    float cobbleZone = smoothstep(0.28, 0.08, uv.y);
    vec3 outerCol = mix(tirMirror, base * vec3(0.84, 0.96, 0.98), cobbleZone * 0.82);

    vec3 col = mix(outerCol, windowCol, inWin);

    // Sparkling surface-tension meniscus dimple rings around the floating mayfly at uTargetPrimary
    float flyD = length((uv - uTargetPrimary.xy) * vec2(aspect, 1.0));
    float dimpleRing1 = exp(-pow((flyD - 0.042) / 0.009, 2.0));
    float dimpleRing2 = exp(-pow((flyD - 0.072 - 0.006 * sin(t * 2.5)) / 0.011, 2.0));
    float dimpleCore = exp(-pow(flyD / 0.030, 2.0));
    col += vec3(0.62, 1.0, 0.96) * (dimpleRing1 * 0.55 + dimpleRing2 * 0.30) + vec3(0.75, 0.48, 1.0) * dimpleCore * 0.24;
    return clamp(col, 0.0, 1.0);
  }

  // --- [17] RUFOUS HUMMINGBIRD: Non-Spectral UV+Red Tetrachromacy + Optokinetic Hover Clarity ---
  if (uSpeciesId == 17) {
    // Optokinetic hover stabilization micro-sharpness
    vec2 pxH = vec2(1.0) / max(vec2(320.0), uResolution * 0.6);
    vec3 hBlur = 0.25 * (
      texture(uLivingTex, uv + vec2(pxH.x, 0.0)).rgb +
      texture(uLivingTex, uv - vec2(pxH.x, 0.0)).rgb +
      texture(uLivingTex, uv + vec2(0.0, pxH.y)).rgb +
      texture(uLivingTex, uv - vec2(0.0, pxH.y)).rgb
    );
    vec3 sharp = clamp(base + (base - hBlur) * 0.72, 0.0, 1.0);

    // Preserve vivid scarlet red (L-cone 560nm) AND add subtle tetrachromatic UV-green brilliance on fresh sunlit flora
    float yLum = luma(sharp);
    vec3 col = clamp(mix(vec3(yLum), sharp, 1.24), 0.0, 1.0);

    // Identify scarlet blossom petals (R strongly dominant over G & B)
    float redPetal = smoothstep(0.28, 0.56, sharp.r) * smoothstep(0.06, 0.26, sharp.r - max(sharp.g, sharp.b));

    // Fresh nectar-rich blossom (uTargetPrimary) reflects BOTH UV (370nm) + Scarlet Red (560nm) -> Non-Spectral UV+Red shimmer!
    float nectarZone = ellipseMask(uv, uTargetPrimary, 1.50);
    float petalVeins = clamp(length(sharp - hBlur) * 9.0, 0.0, 1.0);
    float iridWave = 0.5 + 0.5 * sin((uv.x * 22.0 + uv.y * 18.0) - t * 2.4);
    // Impossible non-spectral hyper-hue: electric ultraviolet-magenta fused with blazing crimson-gold sheen
    vec3 nonSpectralUvRed = mix(vec3(0.95, 0.14, 0.98), vec3(1.0, 0.36, 0.62), iridWave);
    nonSpectralUvRed = mix(nonSpectralUvRed, vec3(0.68, 0.35, 1.0), 0.38 * (1.0 - iridWave));

    float freshMask = clamp(nectarZone * (0.28 + 0.92 * redPetal), 0.0, 1.0);
    col = mix(col, nonSpectralUvRed * (0.68 + 0.52 * sharp.r), freshMask * 0.64);
    col += vec3(0.88, 0.45, 1.0) * freshMask * (0.24 + 0.48 * petalVeins);

    // Older drained blooms (uTargetSecondary) stay noticeably matte flat red (UV-depleted -> skip!)
    if (uTargetSecondary.z > 0.001) {
      float drainedMask = ellipseMask(uv, uTargetSecondary, 1.30) * redPetal;
      col = mix(col, vec3(sharp.r * 0.62, sharp.g * 0.50, sharp.b * 0.48), drainedMask * 0.42);
    }

    // Subtle UV-green glint on dew-glistening stems near cursor
    float cNear = smoothstep(0.22, 0.02, length((uv - uCursor) * vec2(aspect, 1.0)));
    float greenLeaf = smoothstep(0.10, 0.28, sharp.g - sharp.r);
    col += vec3(0.28, 0.95, 0.84) * greenLeaf * cNear * 0.10;
    return clamp(col, 0.0, 1.0);
  }

  // --- [18] CHAMBERED NAUTILUS: Lensless Seawater Pinhole Eye (Live Aperture uApertureMm 0.4..2.8 mm) ---
  if (uSpeciesId == 18) {
    float ap = clamp(uApertureMm, 0.4, 2.8);
    // Normalized aperture fraction tAp in [0..1]
    float tAp = (ap - 0.4) / 2.4;

    // Circle of confusion grows linearly with pinhole diameter (0.4mm = razor-sharp, 2.8mm = wide soft blur)
    float blurRad = max(0.0, (ap - 0.52) / 2.28) * 0.0175;

    // 16-tap Vogel spiral pinhole disk PSF with interleaved gradient noise rotation (zero stipple/lattice!)
    vec3 acc = texture(uLivingTex, uv).rgb;
    if (blurRad > 0.0004) {
      vec2 aspScale = vec2(1.0 / aspect, 1.0);
      float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      float baseAng = ign * 6.2831853;
      for (int i = 0; i < 16; i++) {
        float fi = float(i);
        float r = sqrt((fi + 0.5) / 16.0);
        float ang = fi * 2.3999632 + baseAng;
        vec2 ofs = vec2(cos(ang), sin(ang)) * aspScale * (blurRad * r);
        acc += texture(uLivingTex, clamp(uv + ofs, 0.002, 0.998)).rgb;
      }
      acc /= 17.0;
    }

    // Single deep-sea opsin peaking at 467 nm (monochromatic abyssal blue-silver)
    float opsin = clamp(acc.r * 0.08 + acc.g * 0.38 + acc.b * 0.54, 0.0, 1.0);

    // Photon flux scales with pinhole area (~ap^2): 0.4mm is photon-starved dim; 2.8mm is bright & washed out
    float lightGain = 0.22 + 2.05 * pow(tAp, 1.32);
    float exposed = clamp(pow(max(opsin, 0.001), 0.90) * lightGain, 0.0, 1.0);

    // Subtle photon shot noise when pinhole is stopped down tiny (<0.8mm)
    float dimNoiseAmt = smoothstep(0.95, 0.40, ap) * 0.085 * mix(1.0, 0.3, uReducedMotion);
    float shotNoise = (hash21(floor(uv * uResolution * 0.6) + floor(t * 20.0)) - 0.5) * dimNoiseAmt;

    // Crisp monochrome abyssal tint (silver-cyan highlights over deep marine slate)
    vec3 col = vec3(exposed * 0.62, exposed * 0.84, exposed * 1.02) + shotNoise;

    // In the optical sweet spot (~0.95..1.75 mm), crisp structural highlights on the banded shrimp pop cleanly!
    float sweetSpot = exp(-pow((ap - 1.32) / 0.46, 2.0));
    float shrimpMask = ellipseMask(uv, uTargetPrimary, 1.25);
    float shrimpBright = smoothstep(0.32, 0.78, luma(base));
    col += vec3(0.50, 0.88, 1.0) * shrimpMask * shrimpBright * sweetSpot * 0.28;

    // Natural open pinhole camera circular vignette
    float pVig = smoothstep(0.92, 0.34, length((uv - 0.5) * vec2(aspect * 0.64, 1.05)));
    col *= (0.46 + 0.54 * pVig);
    return clamp(col, 0.0, 1.0);
  }

  // --- [19] BANDED ARCHERFISH: Sub-Surface Air-Water Refraction + Neural n=1.333 Compensator ---
  if (uSpeciesId == 19) {
    // Water surface sits near environmentFeature.y (~0.37 GL y = 0.63 top y)
    float surfY = (uEnvFeature.z > 0.001) ? uEnvFeature.y : 0.38;
    float aboveWater = smoothstep(surfY - 0.03, surfY + 0.04, uv.y);

    // Cursor neural refraction compensator circle (un-bends Snell's Law inside!)
    float compR = 0.21;
    float cDist = length((uv - uCursor) * vec2(aspect, 1.0));
    float inComp = smoothstep(compR + 0.012, compR - 0.014, cDist);

    // Apparent Snell refraction bending outside compensator above water surface
    vec2 bendVec = (uv - vec2(0.5, surfY)) * vec2(0.042, 0.055) * aboveWater * (1.0 - inComp);
    vec2 bentUv = clamp(uv - bendVec, 0.003, 0.997);

    // Subtle chromatic dispersion on uncompensated air-water interface
    float ca = 0.0038 * aboveWater * (1.0 - inComp);
    float rBent = texture(uLivingTex, clamp(bentUv + vec2(ca, 0.0), 0.002, 0.998)).r;
    float gBent = texture(uLivingTex, bentUv).g;
    float bBent = texture(uLivingTex, clamp(bentUv - vec2(ca, 0.0), 0.002, 0.998)).b;
    vec3 bentCol = vec3(rBent, gBent, bBent) * mix(vec3(0.86, 0.98, 1.04), vec3(0.90, 0.95, 1.04), aboveWater);

    // Inside compensator: true un-bent crisp ballistic coordinates with high contrast!
    vec2 pxA = vec2(1.0) / max(vec2(320.0), uResolution * 0.6);
    vec3 blurA = 0.25 * (
      texture(uLivingTex, uv + vec2(pxA.x, 0.0)).rgb +
      texture(uLivingTex, uv - vec2(pxA.x, 0.0)).rgb +
      texture(uLivingTex, uv + vec2(0.0, pxA.y)).rgb +
      texture(uLivingTex, uv - vec2(0.0, pxA.y)).rgb
    );
    vec3 trueCol = clamp(base + (base - blurA) * 0.70, 0.0, 1.0);
    trueCol = clamp(mix(vec3(luma(trueCol)), trueCol, 1.18), 0.0, 1.0);

    vec3 col = mix(bentCol, trueCol, inComp);

    // Subtle ballistic aim shimmer on overhanging emerald beetle when compensator overlaps it
    float beetleMask = ellipseMask(uv, uTargetPrimary, 1.20) * smoothstep(0.12, 0.65, luma(base) + 0.15);
    col += vec3(0.22, 1.0, 0.78) * beetleMask * (0.14 + 0.42 * inComp);

    // Crisp optical compensator lens rim
    float compRim = smoothstep(compR + 0.004, compR, cDist) - smoothstep(compR, compR - 0.005, cDist);
    col = mix(col, vec3(0.24, 0.88, 1.0), compRim * 0.72);
    return clamp(col, 0.0, 1.0);
  }

  // --- [20] REEF SCALLOP: ~200 Concave Guanine-Crystal Mirrors + Dual-Retina OFF-Looming Flash ---
  if (uSpeciesId == 20) {
    // Subtly tiled concave guanine-crystal mirror array (~13x7 overlapping curved crystal facets)
    vec2 gridScale = vec2(13.0, 7.5);
    vec2 cellUv = fract(uv * gridScale) - 0.5;
    vec2 cellId = floor(uv * gridScale);
    float cellR = length(cellUv * vec2(1.0, 1.05));

    // Gentle concave mirror spherical focus curve within each facet (keeps seabed scene cleanly readable!)
    vec2 mirrorSample = clamp(uv + cellUv * 0.0085 * smoothstep(0.15, 0.52, cellR), 0.002, 0.998);
    vec3 mBase = texture(uLivingTex, mirrorSample).rgb;

    // Proximal spatial ON-retina (485/505 nm cool silver-turquoise reflection)
    float mLum = clamp(mBase.r * 0.12 + mBase.g * 0.56 + mBase.b * 0.32, 0.0, 1.0);
    vec3 spatialCol = mix(vec3(mLum * 0.58, mLum * 0.88, mLum * 0.98), mBase * vec3(0.68, 0.98, 1.06), 0.42);

    // Delicate silver-cyan concave crystal mirror rim glint
    float facetRim = smoothstep(0.41, 0.50, cellR);
    float crystalGlint = 0.06 + 0.08 * sin(cellId.x * 2.1 + cellId.y * 3.7 + t * 1.4);
    vec3 col = mix(spatialCol, spatialCol * 0.78 + vec3(0.32, 0.62, 0.72) * (0.4 + crystalGlint), facetRim * 0.52);

    // Distal OFF-Motion Predator Alarm Retina: flashes stark silver-white on dark looming predator silhouette!
    vec2 pxS = vec2(1.0) / max(vec2(320.0), uResolution * 0.55);
    float lL = luma(texture(uLivingTex, uv - vec2(pxS.x, 0.0)).rgb);
    float lR = luma(texture(uLivingTex, uv + vec2(pxS.x, 0.0)).rgb);
    float lD = luma(texture(uLivingTex, uv - vec2(0.0, pxS.y)).rgb);
    float lU = luma(texture(uLivingTex, uv + vec2(0.0, pxS.y)).rgb);
    float silEdge = clamp(length(vec2(lR - lL, lU - lD)) * 6.0, 0.0, 1.0);

    float predMask = ellipseMask(uv, uTargetPrimary, 1.30);
    float darkBody = smoothstep(0.52, 0.16, luma(base));
    float loomPulse = 0.55 + 0.45 * sin(t * 5.2);
    float loomDist = length((uv - uTargetPrimary.xy) * vec2(aspect, 1.0));
    float loomWave = exp(-pow(fract(loomDist * 4.5 - t * 0.85) - 0.5, 2.0) / 0.03) * exp(-loomDist * 6.5);
    float cursorGain = 0.55 + 0.45 * smoothstep(0.42, 0.08, length((uCursor - uTargetPrimary.xy) * vec2(aspect, 1.0)));

    col += vec3(0.92, 0.98, 1.0) * ((silEdge * predMask * 0.92 + darkBody * predMask * 0.34) * loomPulse + loomWave * 0.52) * cursorGain;
    return clamp(col, 0.0, 1.0);
  }

  // --- [21] SPECTACLED OWL: Tubular Binocular Night Vision + Silent Passive Binaural ITD/ILD Map ---
  if (uSpeciesId == 21) {
    // High-sensitivity clean owl rod vision (vastly brighter & cleaner than human scotopic snow!)
    vec3 boosted = pow(max(base, vec3(0.001)), vec3(0.74)) * 1.24;
    float yOwl = luma(boosted);
    vec3 col = mix(vec3(yOwl * 0.78, yOwl * 0.88, yOwl * 0.96), boosted, 0.46);

    // Passive Binaural ITD + ILD 3D Sound Space Map radiating silently from rustling mouse under wet ferns!
    vec2 mPos = uTargetPrimary.xy;
    vec2 mRel = (uv - mPos) * vec2(aspect, 1.0);
    float mDist = length(mRel);

    // Sharpening: as owl turns gaze (uCursor) toward the rustling fern patch, acoustic uncertainty tightens razor-sharp!
    float aimDist = length((uCursor - mPos) * vec2(aspect, 1.0));
    float focusLock = smoothstep(0.55, 0.06, aimDist);
    float spread = mix(0.18, 0.075, focusLock);

    // Organic rustling acoustic probability cloud + concentric passive sound contour rings piercing opaque ferns
    float rustlePulse = 0.65 + 0.35 * sin(t * 3.4) * sin(t * 1.9 + 0.6);
    float soundCloud = exp(-pow(mDist / spread, 2.0));
    float soundRing1 = exp(-pow((mDist - spread * 0.55) / 0.012, 2.0));
    float soundRing2 = exp(-pow((mDist - spread * 1.05 - 0.012 * sin(t * 2.6)) / 0.016, 2.0));
    // Micro-azimuth/elevation cross-wave interference representing asymmetric left/right ear ITD+ILD phase
    float itdPhase = 0.5 + 0.5 * cos(mRel.x * 42.0 - mRel.y * 28.0 + t * 2.2);

    vec3 amberWave = mix(vec3(0.18, 0.84, 0.96), vec3(1.0, 0.74, 0.24), clamp(soundCloud * 0.8 + focusLock * 0.4, 0.0, 1.0));
    col += amberWave * (soundCloud * (0.34 + 0.36 * focusLock) + soundRing1 * 0.52 + soundRing2 * 0.26 * itdPhase) * rustlePulse;

    // Gentle warm highlight on the hidden mouse snout when locked tight
    float mouseCore = ellipseMask(uv, uTargetPrimary, 0.85);
    col += vec3(1.0, 0.88, 0.52) * mouseCore * focusLock * 0.38;

    // Subtle dark tubular binocular peripheral frame (owl fixed-tube eye socket)
    float tubeVig = smoothstep(0.86, 0.38, length((uv - 0.5) * vec2(aspect * 0.62, 1.0)));
    col *= (0.42 + 0.58 * tubeVig);
    return clamp(col, 0.0, 1.0);
  }

  // --- [22] RED-EYED TREEFROG: Dual-Rod Starlight Color (435nm Blue + 502nm Green) + Bug-Detector ---
  if (uSpeciesId == 22) {
    // Dual-rod amphibian starlight color vision: ZERO red channel; vivid separation between 435nm blue mist & 502nm emerald leaves!
    float blueRod = pow(clamp(base.b * 0.92 + base.g * 0.14, 0.0, 1.0), 0.78) * 1.18;
    float greenRod = pow(clamp(base.g * 0.96 + base.b * 0.08, 0.0, 1.0), 0.76) * 1.24;
    // Slight suppression of static large background foliage (amphibian ganglion filtering)
    vec3 col = vec3(
      greenRod * 0.10,
      greenRod * 0.86 + blueRod * 0.14,
      blueRod * 0.96 + greenRod * 0.20
    ) * 0.86;

    // Retinal "Bug-Detector" Ganglion Cells (Lettvin et al. 1959): fire intensely on small dark moving convex insect prey!
    vec2 pxF = vec2(1.0) / max(vec2(320.0), uResolution * 0.6);
    float bL = luma(texture(uLivingTex, uv - vec2(pxF.x, 0.0)).rgb);
    float bR = luma(texture(uLivingTex, uv + vec2(pxF.x, 0.0)).rgb);
    float bD = luma(texture(uLivingTex, uv - vec2(0.0, pxF.y)).rgb);
    float bU = luma(texture(uLivingTex, uv + vec2(0.0, pxF.y)).rgb);
    float bugEdge = clamp(length(vec2(bR - bL, bU - bD)) * 7.2, 0.0, 1.0);

    float bugMask = ellipseMask(uv, uTargetPrimary, 1.35);
    float bugDark = smoothstep(0.45, 0.12, luma(base));
    float wingFlutter = 0.62 + 0.38 * sin(t * 14.0);
    float bugDist = length((uv - uTargetPrimary.xy) * vec2(aspect, 1.0));
    float flutterRing = exp(-pow((bugDist - 0.055 - 0.008 * sin(t * 11.0)) / 0.010, 2.0));

    // Electric chartreuse-lime & white neural spike around fluttering crane-fly
    col += vec3(0.66, 1.0, 0.24) * (bugEdge * bugMask * 1.05 + bugDark * bugMask * 0.26 + flutterRing * 0.58) * wingFlutter;
    col += vec3(0.95, 1.0, 0.82) * bugEdge * bugMask * 0.45;
    return clamp(col, 0.0, 1.0);
  }

  // --- [23] OGRE-FACED SPIDER: f/0.58 Ultra-Wide Aperture (2,000x Light Gain) + Razor-Thin Bokeh ---
  if (uSpeciesId == 23) {
    // Razor-thin f/0.58 focal plane tracks cursor depth + focal distance!
    float focusDepth = texture(uBioTex, uCursor).r;
    float depthErr = abs(bio.r - focusDepth);
    float focalDist = length((uv - uCursor) * vec2(aspect, 1.0));
    // Combine real depth difference + narrow focal plane envelope so sweeping cursor pulls lush creamy bokeh across the floor!
    float coc = clamp(depthErr * 3.0 + smoothstep(0.11, 0.40, focalDist) * 0.85, 0.0, 1.0);
    float bokehRad = coc * 0.0155;

    // 16-tap Vogel spiral f/0.58 circular bokeh disc with interleaved gradient noise rotation (silky optical bokeh!)
    vec3 bokehCol = base;
    if (bokehRad > 0.0005) {
      vec2 aspS = vec2(1.0 / aspect, 1.0);
      float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      float baseAng = ign * 6.2831853;
      vec3 sum = base;
      float wSum = 1.0;
      for (int i = 0; i < 16; i++) {
        float fi = float(i);
        float r = sqrt((fi + 0.5) / 16.0);
        float ang = fi * 2.3999632 + baseAng;
        vec2 ofs = vec2(cos(ang), sin(ang)) * aspS * (bokehRad * r);
        vec3 s = texture(uLivingTex, clamp(uv + ofs, 0.002, 0.998)).rgb;
        // Bright highlights bloom into creamy f/0.58 bokeh disks
        float w = 1.0 + smoothstep(0.42, 0.85, luma(s)) * 1.35;
        sum += s * w;
        wSum += w;
      }
      bokehCol = sum / wSum;
    }

    // 2,000x light gain: 516nm single-opsin high-gain monochrome lunar silver-amber night vision scope!
    float gainLum = pow(clamp(bokehCol.r * 0.24 + bokehCol.g * 0.64 + bokehCol.b * 0.12, 0.001, 1.0), 0.58) * 1.38;
    // Local unsharp clarity right inside the razor-thin focal plane
    float inFocus = 1.0 - smoothstep(0.04, 0.28, coc);
    float sharpDetail = (luma(base) - luma(bokehCol)) * 0.55;
    float finalLum = clamp(gainLum + sharpDetail * inFocus, 0.0, 1.0);

    vec3 col = vec3(finalLum * 1.02, finalLum * 0.92, finalLum * 0.72);

    // Subtle crisp nocturnal chitin sheen when focal plane snaps tight onto the walking cricket
    float cricketMask = ellipseMask(uv, uTargetPrimary, 1.15);
    float cricketEdge = clamp(abs(luma(base) - luma(texture(uLivingTex, uv + vec2(0.002, 0.002)).rgb)) * 8.0, 0.0, 1.0);
    col += vec3(1.0, 0.84, 0.42) * cricketMask * (0.14 + cricketEdge * 0.55) * inFocus;

    // Gentle giant posterior-median lens peripheral falloff
    float lensVig = smoothstep(0.95, 0.36, length((uv - 0.5) * vec2(aspect * 0.65, 1.0)));
    col *= (0.55 + 0.45 * lensVig);
    return clamp(col, 0.0, 1.0);
  }

  return base;
}

void main() {
  float aspect = uResolution.x / max(1.0, uResolution.y);
  vec3 livingBase = texture(uLivingTex, vUv).rgb;

  vec3 finalCol;
  if (uSplitEnabled > 0.5 && vUv.x < uSplitX) {
    finalCol = computeHumanBaseline(vUv, livingBase, uTime);
  } else {
    finalCol = computeSpeciesVision(vUv, aspect);
  }

  // Synchronized split-screen curtain divider hairline
  if (uSplitEnabled > 0.5) {
    float lineDist = abs(vUv.x - uSplitX) * uResolution.x;
    float line = smoothstep(2.2, 0.4, lineDist);
    finalCol = mix(finalCol, vec3(0.85, 0.96, 1.0), line * 0.9);
  }

  // Smooth cinematic camera swoop iris pulse during vantage switches
  if (uTransition > 0.001) {
    float r = length((vUv - 0.5) * vec2(aspect, 1.0));
    float vig = smoothstep(0.95 - uTransition * 0.55, 0.15, r);
    finalCol *= mix(1.0, 0.25 + 0.75 * vig, uTransition);
  }

  fragColor = vec4(finalCol, 1.0);
}
`;
