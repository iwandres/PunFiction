/**
 * UMWELT: Animal Optics — 4-Pass WebGL2 GLSL ES 3.00 Shader Suite
 * Pass 0+1: Procedural Zero-Wait 3-Biome Landscapes + 2.5D Depth Relief Parallax + Living Micro-Animation
 * Pass 2:   15 Species Biological Perception Shaders + Synchronized Split-Screen Curtain
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
uniform int uSpeciesId;     // 0..14 active species shader ID
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

  // Apply locomotion zoom/offset around screen center (clamped softly within frame)
  vec2 centered = (vUv - 0.5) / max(1.0, uCamZoom) + 0.5 + uCamOffset;
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

  // Biome-specific living micro-animation UV sway
  vec4 bio = texture(uPlateBio, uvPar);
  float windMask = bio.b * uPlateMix;
  float medMask = bio.a * uPlateMix;

  vec2 animUv = uvPar;
  if (uBiomeId == 0) {
    // Keep Human Observer in Alpine Meadow crisp and distortion-free (no wavy warp)
    if (uSpeciesId != 0) {
      float gust = sin(t * 1.8 + uvPar.x * 7.0 + uvPar.y * 3.0) * 0.0014;
      animUv.x += gust * windMask * motionScale;
    }
  } else if (uBiomeId == 1) {
    // Underwater surge sway
    animUv.x += sin(t * 1.4 + uvPar.y * 10.0) * 0.0035 * windMask * motionScale;
    animUv.y += cos(t * 1.2 + uvPar.x * 9.0) * 0.0022 * windMask * motionScale;
  } else {
    // Subtle cloud forest canopy breeze
    animUv.x += sin(t * 1.3 + uvPar.y * 8.0 + uvPar.x * 5.0) * 0.0025 * windMask * motionScale;
  }
  animUv = clamp(animUv, 0.002, 0.998);

  vec3 procCol = renderProceduralBiome(uvPar, t);
  vec3 plateCol = texture(uPlateRGB, animUv).rgb;
  vec3 sceneCol = mix(procCol, plateCol, uPlateMix);

  // Living atmospheric overlays (pollen / underwater Voronoi caustics / mist & rain)
  if (uBiomeId == 0) {
    if (uSpeciesId != 0) {
      // Subtle sunlit pollen motes for non-human meadow vantage points
      vec2 mUv = uvPar * vec2(18.0, 11.0) + vec2(-t * 0.25, sin(t * 0.6 + uvPar.x * 6.0) * 0.3);
      float pollen = smoothstep(0.972, 0.996, noise2(mUv));
      sceneCol += vec3(1.0, 0.95, 0.72) * pollen * 0.18 * motionScale;
    }
  } else if (uBiomeId == 1) {
    // Animated Voronoi solar caustics projected across depth
    float caust = voronoiCaustic(uvPar * vec2(8.5, 5.5) + vec2(t * 0.16, t * 0.09), t * 1.15);
    float depthAtten = 0.35 + 0.65 * bio.r;
    sceneCol += vec3(0.14, 0.42, 0.48) * caust * depthAtten * 0.28 * motionScale;
    // Rising marine snow
    float snow = smoothstep(0.972, 0.996, noise2(uvPar * 36.0 + vec2(sin(t * 0.4) * 0.5, -t * 0.35)));
    sceneCol += vec3(0.65, 0.90, 0.95) * snow * 0.22 * motionScale;
  } else {
    // Drifting cloud forest mist + rain streaks + bioluminescent spores
    float mist = fbm(vec2(uvPar.x * 3.8 + t * 0.06, uvPar.y * 4.5));
    sceneCol = mix(sceneCol, vec3(0.16, 0.26, 0.32), smoothstep(0.55, 0.90, mist) * 0.18 * (1.0 - bio.r * 0.5));
    if (uLightIndex == 1) {
      float rain = smoothstep(0.96, 0.995, noise2(vec2(uvPar.x * 95.0 + uvPar.y * 12.0, uvPar.y * 12.0 + t * 8.0)));
      sceneCol += vec3(0.45, 0.75, 0.85) * rain * 0.25 * motionScale;
      float mycena = smoothstep(0.965, 0.995, noise2(uvPar * 28.0 + vec2(0.0, -t * 0.12)));
      sceneCol += vec3(0.12, 0.95, 0.58) * mycena * 0.38 * motionScale;
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
uniform int uSpeciesId;      // 0..14
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uCursor;        // normalized [0..1], y=0 bottom .. y=1 top (WebGL coords)
uniform float uPolAngle;     // radians [0..PI] for Cuttlefish
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
    // Human Scotopic Night Hiker (498nm Purkinje shift + rod photon shot noise)
    float y = luma(baseCol);
    // Purkinje shift suppresses reds strongly, favors blue-green rods
    float rodY = clamp(baseCol.r * 0.08 + baseCol.g * 0.56 + baseCol.b * 0.36, 0.0, 1.0);
    vec3 scotopic = vec3(rodY * 0.44, rodY * 0.54, rodY * 0.68) * 0.68;
    float grainT = floor(t * 24.0);
    float snow = (hash21(floor(uv * uResolution * 0.55) + grainT) - 0.5) * 0.14 * mix(1.0, 0.35, uReducedMotion);
    return clamp(scotopic + snow, 0.0, 1.0);
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

    // Winding grass-occluded UV vole urine scent runway leading right into uTargetPrimary!
    vec2 target = uTargetPrimary.xy;
    float along = clamp((sampleUv.y - 0.14) / max(0.15, target.y - 0.14), 0.0, 1.0);
    float trailX = mix(target.x - 0.24, target.x, smoothstep(0.0, 1.0, along))
                 + sin(sampleUv.y * 19.0 + 0.9) * 0.055 * (1.0 - along * 0.7);
    float distTrail = abs(sampleUv.x - trailX);
    float trailRange = smoothstep(0.08, 0.18, sampleUv.y) * smoothstep(target.y + 0.05, target.y - 0.01, sampleUv.y);
    float uvTrail = exp(-pow(distTrail / 0.016, 2.0)) * trailRange * (0.55 + 0.45 * sin(sampleUv.y * 85.0 - t * 2.2));
    // Grass blade occlusion shimmer
    float grassOccl = smoothstep(0.22, 0.75, sBio.b + 0.35);
    float voleGlow = ellipseMask(sampleUv, uTargetPrimary, 1.15);

    vec3 uvViolet = vec3(0.72, 0.22, 1.0);
    col = mix(col, col * vec3(0.92, 0.96, 1.10), 0.32);
    col += uvViolet * (uvTrail * grassOccl * (0.65 + 0.55 * inLoupe) + voleGlow * (0.45 + 0.55 * inLoupe));
    // Subtle secondary UV fluorescence on wildflowers
    col += vec3(0.45, 0.15, 0.85) * sBio.g * 0.18;

    // Subtle optical fovea rim
    float rim = smoothstep(loupeRadius + 0.004, loupeRadius, dist) - smoothstep(loupeRadius, loupeRadius - 0.005, dist);
    col = mix(col, vec3(0.76, 0.48, 1.0), rim * 0.65);
    return clamp(col, 0.0, 1.0);
  }

  // --- [2] WESTERN HONEYBEE: UV/B/G Red-Blind + UV Bullseyes + Sky Rayleigh Polarization ---
  if (uSpeciesId == 2) {
    // Red-blind cone matrix: L-cone absent! Scarlet poppies crush to velvety charcoal black
    float redExcess = max(0.0, base.r - max(base.g, base.b) * 1.18);
    float yellowFloral = clamp((base.r + base.g - 1.45 * base.b) * 1.25, 0.0, 1.0);

    // Map G->yellow-green, B->cyan-blue, UV(bio.g + yellow floral)->electric "bee's purple" magenta-violet
    float gResp = base.g * 0.88 + base.r * 0.06;
    float bResp = base.b * 0.95 + base.g * 0.15;
    float uvResp = clamp(bio.g * 0.85 + yellowFloral * 0.55, 0.0, 1.0);

    vec3 col = vec3(
      uvResp * 0.78 + gResp * 0.12,
      gResp * 0.94 + bResp * 0.18,
      bResp * 1.05 + uvResp * 0.92
    );

    // Crush scarlet red poppies into dark velvet charcoal!
    float poppyCrush = smoothstep(0.10, 0.42, redExcess);
    col = mix(col, vec3(0.04, 0.045, 0.065), poppyCrush * 0.90);

    // Ignite UV bullseye concentric landing rings on primary Rudbeckia blossom!
    float bullM = ellipseMask(uv, uTargetPrimary, 1.35);
    float dTarget = length((uv - uTargetPrimary.xy) / max(vec2(0.03), uTargetPrimary.zw));
    float bullCore = smoothstep(0.55, 0.10, dTarget);
    float bullRing = smoothstep(0.95, 0.52, dTarget) * smoothstep(0.28, 0.55, dTarget);
    col += vec3(0.72, 0.18, 1.0) * bullCore * 0.72;
    col += vec3(0.18, 0.96, 0.92) * bullRing * (0.42 + 0.18 * sin(t * 2.5 - dTarget * 10.0));
    col += vec3(0.65, 0.15, 0.95) * bio.g * 0.25 * (1.0 - poppyCrush);

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
    // Cold 6C snowmelt stream (bio.a + blue) -> 0.05..0.15 indigo
    float coldWater = clamp(bio.a * 0.85 + max(0.0, base.b - base.r) * 1.4, 0.0, 1.0);
    // Warm 28C sun-baked granite rocks (bright, low-sat, low-green foreground) -> 0.55..0.70 amber
    float graniteWarm = clamp((luma(base) * 0.85 + (1.0 - bio.b) * 0.45) * (1.0 - coldWater) * (0.35 + 0.65 * bio.r), 0.0, 0.72);
    // Blazing 38.2C endothermic meadow vole at uTargetPrimary!
    float voleHeat = ellipseMask(uv, uTargetPrimary, 1.25);
    float volePulse = 0.92 + 0.08 * sin(t * 5.2);
    float temp = clamp(0.24 + graniteWarm * 0.46 - coldWater * 0.34 + voleHeat * 0.82 * volePulse, 0.0, 1.0);

    vec3 irCol = ironbow(temp);
    // Optic tectum bimodal fusion (stronger thermal bloom around cursor & endothermic heat)
    float thermalWeight = clamp(0.66 + voleHeat * 0.32 + coldWater * 0.16, 0.0, 0.96);
    vec3 col = mix(visualBase, irCol, thermalWeight);
    // Radiant heat plume shimmer rising slightly above warm prey
    float plume = ellipseMask(uv - vec2(0.0, 0.025 + 0.008 * sin(t * 4.0)), uTargetPrimary, 1.55);
    col += vec3(1.0, 0.35, 0.78) * plume * 0.25;
    return clamp(col, 0.0, 1.0);
  }

  // --- [4] WHITETAIL DEER: Dichromat + Horizontal Visual Streak + Rod Motion Shimmer ---
  if (uSpeciesId == 4) {
    // Horizon streak centered around y = 0.50 (treeline)
    float vDist = abs(uv.y - 0.50);
    float blurAmt = smoothstep(0.11, 0.38, vDist) * 0.008;
    vec3 col = (
      texture(uLivingTex, uv).rgb * 0.4 +
      texture(uLivingTex, clamp(uv + vec2(0.0, blurAmt), 0.002, 0.998)).rgb * 0.3 +
      texture(uLivingTex, clamp(uv - vec2(0.0, blurAmt), 0.002, 0.998)).rgb * 0.3
    );

    // S (455nm) + M (537nm) Red-Green Dichromacy: red collapses into muted olive-gold
    float blueC = col.b * 0.94 + col.g * 0.08;
    float oliveC = col.r * 0.48 + col.g * 0.52;
    vec3 dichrom = vec3(oliveC * 0.88, oliveC * 0.96, blueC * 1.06);

    // Temporal frame differencing from ping-pong previous frame
    vec3 prev = texture(uPrevTex, uv).rgb;
    float deltaI = abs(luma(base) - luma(prev)) * 18.0;

    // Stalking bobcat micro-ear-twitch motion shimmer along timberline
    float bobcatMask = ellipseMask(uv, uTargetPrimary, 1.15);
    float twitch = pow(max(0.0, sin(t * 3.8) * sin(t * 1.7 + 0.4)), 4.0);
    float bobcatShimmer = bobcatMask * (0.35 + 0.85 * twitch);

    float streakBoost = 1.0 - smoothstep(0.08, 0.26, vDist);
    vec3 motionGlow = vec3(0.55, 0.94, 1.0) * clamp(deltaI * (0.45 + 0.9 * streakBoost) + bobcatShimmer, 0.0, 1.15);

    vec3 outCol = dichrom + motionGlow * 0.78;
    // Subtle dark peripheral vignette top/bottom emphasizing horizontal visual streak
    outCol *= 1.0 - smoothstep(0.28, 0.52, vDist) * 0.24;
    return clamp(outCol, 0.0, 1.0);
  }

  // --- [6] PEACOCK MANTIS SHRIMP: 12-Channel Tilted Midband Scanline + Circular Polarization ---
  if (uSpeciesId == 6) {
    // Slightly muted peripheral compound-eye field outside tilted equatorial midband
    float angle = -0.26; // tilted equatorial midband strip
    vec2 rel = (uv - uCursor) * vec2(aspect, 1.0);
    float bandPerp = abs(-rel.x * sin(angle) + rel.y * cos(angle));
    float inBand = smoothstep(0.115, 0.065, bandPerp);
    float bandEdge = smoothstep(0.122, 0.112, bandPerp) - smoothstep(0.112, 0.102, bandPerp);

    // 12 narrowband hyperspectral quantization inside the midband
    vec3 peripheral = mix(vec3(luma(base) * 0.85), base, 0.58) * vec3(0.84, 0.96, 1.02);
    vec3 hyper = floor(base * 6.0 + 0.5) / 6.0;
    hyper = clamp(mix(base, hyper, 0.45) * 1.18, 0.0, 1.0);
    // Hue-separated hyper-vivid channel punch
    float maxC = max(hyper.r, max(hyper.g, hyper.b));
    float minC = min(hyper.r, min(hyper.g, hyper.b));
    hyper = clamp(mix(vec3(luma(hyper)), hyper, 1.75), 0.0, 1.0);
    hyper += vec3(0.32, 0.08, 0.48) * bio.g * 0.35;

    vec3 col = mix(peripheral, hyper, inBand);

    // Circularly Polarized (CPL) rival mantis shrimp maxilliped display blazes neon gold-crimson!
    float cplTarget = ellipseMask(uv, uTargetPrimary, 1.2);
    float cplSpiral = 0.5 + 0.5 * sin(atan(uv.y - uTargetPrimary.y, uv.x - uTargetPrimary.x) * 3.0 - t * 4.5 + length(uv - uTargetPrimary.xy) * 65.0);
    vec3 cplNeon = mix(vec3(1.0, 0.16, 0.52), vec3(1.0, 0.84, 0.14), cplSpiral);
    col += cplNeon * cplTarget * (0.40 + 0.85 * inBand);

    // Midband scanline border shimmer
    col = mix(col, vec3(1.0, 0.42, 0.82), bandEdge * 0.65);
    return clamp(col, 0.0, 1.0);
  }

  // --- [7] BROADCLUB CUTTLEFISH: 492nm Monochromat + W-Pupil + Malus's Law Linear Polarization ---
  if (uSpeciesId == 7) {
    // Single visual opsin peaking at 492nm (blue-green monochrome)
    float iMono = clamp(base.r * 0.10 + base.g * 0.62 + base.b * 0.28, 0.0, 1.0);

    // Subtle W-pupil off-axis chromatic dispersion edge hint (how cephalopods infer hue from focus blur!)
    float wShift = 0.0022;
    float edgeR = luma(texture(uLivingTex, clamp(uv + vec2(wShift, 0.0), 0.002, 0.998)).rgb);
    float edgeB = luma(texture(uLivingTex, clamp(uv - vec2(wShift, 0.0), 0.002, 0.998)).rgb);
    float wHalo = (edgeR - edgeB) * 1.4;

    // Malus's Law polarization contrast: I_pol = I_mono * (1 + P * cos(2*(psi - theta)))
    float shrimpMask = ellipseMask(uv, uTargetPrimary, 1.15);
    float fishMask = ellipseMask(uv, uTargetSecondary, 1.25);

    float psiShrimp = 0.733; // ~42 deg polarization angle of transparent glass shrimp
    float psiFish = 1.92;    // ~110 deg specular silverside scales
    float psiWater = 0.0;    // horizontal background water skylight polarization

    float polShrimp = cos(2.0 * (psiShrimp - uPolAngle));
    float polFish = cos(2.0 * (psiFish - uPolAngle));
    float polWater = cos(2.0 * (psiWater - uPolAngle)) * 0.22 * bio.a;

    float iPol = iMono * (1.0 + polWater);
    // Transparent glass shrimp erupts in electric polarization contrast when analyzer aligns!
    float shrimpPop = clamp(0.5 + 0.5 * polShrimp, 0.0, 1.0);
    float fishPop = clamp(0.5 + 0.5 * polFish, 0.0, 1.0);

    // High-contrast monochrome cephalopod luminance + iridescent e-vector electric highlights
    vec3 monoCol = vec3(iPol * 0.88, iPol * 0.95, iPol * 0.98);
    // Subtle polarization angle interference texture on birefringent shrimp carapace
    float stripe = 0.5 + 0.5 * sin((uv.x * cos(uPolAngle) + uv.y * sin(uPolAngle)) * 120.0);
    vec3 shrimpElectric = mix(vec3(0.08, 0.14, 0.18), vec3(0.65, 0.98, 1.0), shrimpPop);
    monoCol = mix(monoCol, shrimpElectric * (0.75 + 0.35 * stripe), shrimpMask * (0.28 + 0.72 * pow(shrimpPop, 1.6)));
    monoCol += vec3(0.45, 0.92, 0.98) * fishMask * pow(fishPop, 2.0) * 0.55;
    monoCol += vec3(0.08, 0.18, 0.22) * wHalo;
    return clamp(monoCol, 0.0, 1.0);
  }

  // --- [8] SCALLOPED HAMMERHEAD: Green-Blue Rod Vision + Ampullae of Lorenzini E-Dipole ---
  if (uSpeciesId == 8) {
    // Rod-rich cool green-blue wide vision
    float gb = base.g * 0.64 + base.b * 0.36;
    vec3 col = vec3(gb * 0.26, gb * 0.72, gb * 0.84) * 0.88;

    // Bioelectric dipole math: E(r) = (3(mu.r_hat)r_hat - mu) / (r^2 + eps^2)^1.5
    vec2 r0 = uTargetPrimary.xy;
    vec2 rVec = (uv - r0) * vec2(aspect, 1.0);
    float r2 = dot(rVec, rVec);
    float rLen = sqrt(r2 + 0.0018);
    vec2 rHat = rVec / rLen;

    // 1.2 Hz stingray respiratory gill heartbeat!
    float gillPulse = 0.62 + 0.38 * sin(t * 2.0 * 3.1415926 * 1.2);
    vec2 mu = vec2(0.85, 0.52) * gillPulse;
    vec2 Evec = (3.0 * dot(mu, rHat) * rHat - mu) / pow(r2 + 0.012, 1.35);
    float Emag = length(Evec);

    // Cephalofoil sensor detection proximity boost around cursor
    float headDist = length((uCursor - r0) * vec2(aspect, 1.0));
    float senseGain = 0.42 + 0.85 * smoothstep(0.55, 0.08, headDist);

    // Dipole field streamlines (potential + angular lobes)
    float ang = atan(rVec.y, rVec.x);
    float fieldLine = pow(abs(sin(ang * 2.0 + 0.55)), 1.5) * exp(-rLen * 5.2);
    float rings = 0.5 + 0.5 * sin(rLen * 58.0 - t * 2.0 * 3.1415926 * 1.2);
    float core = exp(-r2 / 0.0055) * gillPulse;

    // Secondary weaker dipole
    vec2 r1 = (uv - uTargetSecondary.xy) * vec2(aspect, 1.0);
    float secGlow = exp(-dot(r1, r1) / 0.004) * (0.45 + 0.35 * sin(t * 5.5));

    vec3 dipoleCol = mix(vec3(0.32, 0.28, 1.0), vec3(0.18, 0.96, 0.98), clamp(Emag * 0.025 + core, 0.0, 1.0));
    float intensity = clamp((fieldLine * (0.45 + 0.55 * rings) + core * 1.15) * senseGain, 0.0, 1.25);
    col += dipoleCol * intensity * 0.92;
    col += vec3(0.38, 0.65, 1.0) * secGlow * 0.32;
    return clamp(col, 0.0, 1.0);
  }

  // --- [9] HAWKSBILL SEA TURTLE: Carotenoid Oil-Droplet Biofluorescence Filter ---
  if (uSpeciesId == 9) {
    // Suppress ambient <500nm blue scatter into deep dark cobalt
    vec3 darkCobalt = vec3(base.r * 0.18, base.g * 0.24, base.b * 0.42) * 0.55;

    // Extract 515nm biofluorescent green & 585nm biofluorescent red/orange channels
    float greenFluor = clamp((base.g - base.b * 0.72) * 2.6 + bio.g * 0.45, 0.0, 1.0);
    float redFluor = clamp((base.r - base.b * 0.68) * 2.8, 0.0, 1.0);

    // Cryptic frogfish & fluorescent sponge colony blaze vividly!
    float frogMask = ellipseMask(uv, uTargetPrimary, 1.25);
    float spongeMask = ellipseMask(uv, uTargetSecondary, 1.35);
    float pulse = 0.88 + 0.12 * sin(t * 2.4);

    vec3 neonGreen = vec3(0.10, 1.0, 0.52);
    vec3 neonRed = vec3(1.0, 0.24, 0.18);

    vec3 col = darkCobalt
      + neonGreen * (pow(greenFluor, 1.2) * 0.88 + spongeMask * 0.55 * pulse)
      + neonRed * (pow(redFluor, 1.15) * 0.95 + frogMask * 0.78 * pulse);
    // Subtle glowing mottled biofluorescent spots on cryptic frogfish
    float mottle = 0.5 + 0.5 * sin(uv.x * 75.0) * cos(uv.y * 75.0);
    col += mix(neonGreen, neonRed, mottle) * frogMask * 0.32;
    return clamp(col, 0.0, 1.0);
  }

  // --- [11] LEAF-TAILED GECKO: 350x Nocturnal Full-Color Cone Retina + Pinhole Slit Bokeh ---
  if (uSpeciesId == 11) {
    // Massive nocturnal cone gain restoring vivid emerald, ruby, and moth iridescence
    vec3 boosted = pow(max(base, vec3(0.001)), vec3(0.76)) * 1.32;
    float y = luma(boosted);
    vec3 vivid = mix(vec3(y), boosted, 1.52);
    // Vertical multifocal slit-pupil subtle vertical bokeh sheen on bright speculars
    vec3 upS = texture(uLivingTex, clamp(uv + vec2(0.0, 0.006), 0.002, 0.998)).rgb;
    vec3 dnS = texture(uLivingTex, clamp(uv - vec2(0.0, 0.006), 0.002, 0.998)).rgb;
    vec3 slitGlow = max(vec3(0.0), (upS + dnS) * 0.5 - 0.58) * 0.55;

    // Iridescent nocturnal emerald-gold moth pops sharply against dark bark
    float mothMask = ellipseMask(uv, uTargetPrimary, 1.2);
    vec3 mothShimmer = mix(vec3(0.14, 1.0, 0.62), vec3(0.96, 0.88, 0.34), 0.5 + 0.5 * sin(t * 2.2 + uv.x * 24.0));
    vec3 col = vivid + slitGlow + mothShimmer * mothMask * 0.42;
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

    // Highlight depth lock around cursor & prey spider
    float cDist = length((uv - uCursor) * vec2(aspect, 1.0));
    float ringZone = smoothstep(0.24, 0.05, cDist);
    float lockScore = clamp(1.0 - depthErr * 4.5, 0.0, 1.0);
    vec3 rangeTint = mix(vec3(0.95, 0.25, 0.88), vec3(0.22, 1.0, 0.56), lockScore);
    col = mix(col, col * 0.85 + rangeTint * 0.28, ringZone * 0.35);

    // Subtle crisp prey silhouette highlight when focused near target
    float preyMask = ellipseMask(uv, uTargetPrimary, 1.2);
    float cursorOnPrey = ellipseMask(uCursor, uTargetPrimary, 2.2);
    col += vec3(0.24, 1.0, 0.58) * preyMask * (0.18 + 0.45 * cursorOnPrey);

    // Narrow anterior principal-eye boomerang vignette
    float vig = smoothstep(0.72, 0.32, length((uv - 0.5) * vec2(aspect * 0.72, 1.05)));
    col *= (0.48 + 0.52 * vig);
    return clamp(col, 0.0, 1.0);
  }

  // --- [13] SWAINSON'S THRUSH: Twilight Vision + Cryptochrome-4 Quantum Magnetoreception Dome ---
  if (uSpeciesId == 13) {
    // Crisp avian twilight clarity
    vec3 col = pow(max(base, vec3(0.001)), vec3(0.84)) * 1.14;

    // Viewing ray v(u) and geomagnetic field vector B (inclination dip gamma = 62 deg)
    vec3 viewRay = normalize(vec3((uv.x - 0.5) * aspect * 1.35, (uv.y - 0.35) * 1.25, 1.0));
    float gamma = radians(62.0);
    // Align geomagnetic dip node over uTargetPrimary in sky
    vec2 magCenter = uTargetPrimary.xy;
    vec3 Bvec = normalize(vec3((magCenter.x - 0.5) * aspect * 1.2, sin(gamma) * 0.52 + (magCenter.y - 0.65), cos(gamma)));

    float vDotB = dot(viewRay, Bvec);
    // Spin-correlated radical-pair yield modulation: Phi_mag = 1 + kappa * (3(v.B)^2 - 1)^2
    float quadTerm = 3.0 * vDotB * vDotB - 1.0;
    float spinBand = exp(-pow(quadTerm * 1.85, 2.0));
    float dipNode = exp(-pow(1.0 - abs(vDotB), 2.0) * 65.0);

    float skyWeight = smoothstep(0.25, 0.62, uv.y) * (0.45 + 0.55 * bio.a);
    float quantumShimmer = 0.85 + 0.15 * sin(t * 2.2 + uv.x * 12.0 - uv.y * 8.0);

    vec3 magViolet = vec3(0.56, 0.30, 1.0);
    vec3 magGold = vec3(1.0, 0.78, 0.24);
    vec3 domeGlow = (magViolet * spinBand * 0.55 + magGold * dipNode * 0.95) * skyWeight * quantumShimmer;

    // Subtle concentric inclination meridian arcs
    float meridians = pow(0.5 + 0.5 * sin(acos(clamp(vDotB, -1.0, 1.0)) * 24.0 - t * 0.9), 5.0);
    domeGlow += magGold * meridians * skyWeight * 0.22;

    col += domeGlow;
    return clamp(col, 0.0, 1.0);
  }

  // --- [14] COMMON VAMPIRE BAT: 60-90 kHz 3D Ultrasonic Sonar Wavefront + TRPV1 Capillary Heat ---
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

  // Close-range TRPV1 nasal-pit thermal signature on resting tapir's warm blood vessels
  float tapirMask = ellipseMask(uv, uTargetPrimary, 1.25);
  float cursorNear = 0.48 + 0.52 * smoothstep(0.42, 0.06, length((uCursor - uTargetPrimary.xy) * vec2(aspect, 1.0)));
  float veinPattern = pow(0.5 + 0.5 * sin(uv.x * 95.0 + sin(uv.y * 60.0) * 2.5), 3.0);
  float heartbeat = 0.82 + 0.18 * sin(t * 4.2);
  vec3 capillaryIR = mix(vec3(0.88, 0.08, 0.18), vec3(1.0, 0.74, 0.42), veinPattern);
  col += capillaryIR * tapirMask * cursorNear * heartbeat * (0.55 + 0.45 * clamp(trailMem + waveEnv, 0.0, 1.0));

  return clamp(col, 0.0, 1.0);
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
