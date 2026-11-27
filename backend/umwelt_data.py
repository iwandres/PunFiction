"""
UMWELT: Animal Optics — Canonical Biological Registry, Prompts, Mysteries & Micro-Missions
Shared single source of truth for the PunFiction Render API (unified_server.py).
"""

BIOMES = [
    {
        "id": "meadow",
        "name": "Rocky Mountain Alpine Meadow",
        "shortName": "Alpine Meadow",
        "subtitle": "High-Altitude Terrestrial · 2,840 m ASL",
        "theme": "Ultraviolet signaling, endothermic infrared radiation, and dichromatic horizon surveillance.",
        "lightingPresets": [
            {"id": "Alpine Noon", "label": "Alpine Noon", "isDefault": True, "tempK": 5800},
            {"id": "Golden Hour", "label": "Golden Hour", "isDefault": False, "tempK": 3600},
            {"id": "Misty Dawn", "label": "Misty Dawn", "isDefault": False, "tempK": 7200},
        ],
        "scale": {
            "mode": "elevation",
            "unit": "m",
            "min": 0.0,
            "max": 15.0,
            "minLabel": "0.0 m Ground Litter",
            "maxLabel": "15.0 m Pine Canopy",
        },
        "species": [
            {
                "slot": 1,
                "slug": "human_meadow",
                "shaderId": 0,
                "name": "Human Observer",
                "scientificName": "Homo sapiens",
                "icon": "👁️",
                "elevationM": 1.75,
                "vantageLabel": "1.75 m Meadow Overlook · 55° Rectilinear",
                "fovDeg": 55,
                "sensoryTag": "S·M·L Trichromat",
                "accentColor": "#94a3b8",
                "summary": "Baseline primate trichromacy: scarlet poppies blaze vividly against green sedge, while UV scent trails, floral bullseyes, and hidden voles stay invisible.",
                "photoreceptors": [
                    {"label": "S-Cone (Blue)", "peakNm": 420, "color": "#3b82f6", "width": 36},
                    {"label": "M-Cone (Green)", "peakNm": 534, "color": "#22c55e", "width": 44},
                    {"label": "L-Cone (Red)", "peakNm": 564, "color": "#ef4444", "width": 46},
                ],
                "nonVisualBand": None,
                "mechanic": None,
                "imagePrompt": (
                    "National Geographic award-winning 16:9 photorealistic wide wildlife photograph from eye level (1.75m) overlooking "
                    "a lush Rocky Mountain alpine meadow in Colorado. Foreground bursting with scarlet-red alpine poppies and golden-yellow "
                    "Rudbeckia wildflowers, a clear snowmelt creek winding past sun-warmed granite boulders in midground, dense spruce timberline "
                    "and tall weathered pine snag in the distance under jagged snow-dusted peaks. Crisp natural daylight, tack-sharp botanical detail, "
                    "natural dynamic range, zero text, zero watermarks, zero UI."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Wildflower Meadow Patch", "x": 0.36, "y": 0.72, "rx": 0.16, "ry": 0.14},
                    "secondaryTarget": {"present": True, "label": "Spruce Timberline", "x": 0.76, "y": 0.44, "rx": 0.18, "ry": 0.14},
                    "environmentFeature": {"present": True, "label": "Snowmelt Creek", "x": 0.56, "y": 0.66, "rx": 0.22, "ry": 0.12},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.16, "rx": 0.50, "ry": 0.18},
                },
            },
            {
                "slot": 2,
                "slug": "kestrel",
                "shaderId": 1,
                "name": "American Kestrel",
                "scientificName": "Falco sparverius",
                "icon": "🦅",
                "elevationM": 13.5,
                "vantageLabel": "13.5 m Pine Snag Perch · 42° Steep Downward Telephoto",
                "fovDeg": 42,
                "sensoryTag": "UV + 2.2× Dual-Fovea",
                "accentColor": "#a855f7",
                "summary": "Tetrachromatic raptor vision with 370 nm UV cones and a deep central fovea magnifying 2.2× to trace fluorescent vole urine runways through dense grass.",
                "photoreceptors": [
                    {"label": "UV-Cone", "peakNm": 370, "color": "#a855f7", "width": 26},
                    {"label": "S-Cone", "peakNm": 450, "color": "#3b82f6", "width": 32},
                    {"label": "M-Cone", "peakNm": 510, "color": "#22c55e", "width": 34},
                    {"label": "L-Cone", "peakNm": 565, "color": "#f97316", "width": 36},
                ],
                "nonVisualBand": {"label": "2.2× Central Fovea Telephoto", "range": "2.6× human acuity"},
                "mechanic": {"id": "loupe_zoom", "hint": "Aim cursor / touch reticle to sweep 2.2× UV telephoto loupe across grass trails"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 steep downward bird's-eye telephoto photograph looking down from a 13.5-meter "
                    "high weathered pine snag over a sunlit Rocky Mountain alpine meadow floor. A weathered pine branch tip anchors the extreme "
                    "bottom-left edge, looking steeply down at interlocking green meadow grass tussocks, narrow winding rodent runways worn "
                    "through grass blades, a tiny brown camouflaged meadow vole partially tucked beside a grass clump near right-of-center, "
                    "scattered yellow wildflowers and a glistening creek bend. Ultra-crisp optical telephoto clarity, natural lighting, no text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Camouflaged Meadow Vole", "x": 0.62, "y": 0.56, "rx": 0.08, "ry": 0.08},
                    "secondaryTarget": {"present": True, "label": "UV Scent Runway Fork", "x": 0.44, "y": 0.66, "rx": 0.14, "ry": 0.11},
                    "environmentFeature": {"present": True, "label": "Snowmelt Creek Bend", "x": 0.25, "y": 0.34, "rx": 0.20, "ry": 0.14},
                    "skyOrWaterRegion": {"present": False, "x": 0.50, "y": 0.06, "rx": 0.45, "ry": 0.08},
                },
            },
            {
                "slot": 3,
                "slug": "honeybee",
                "shaderId": 2,
                "name": "Western Honeybee",
                "scientificName": "Apis mellifera",
                "icon": "🐝",
                "elevationM": 0.48,
                "vantageLabel": "0.48 m Blossom Cluster · 85° Upward Probe Macro",
                "fovDeg": 85,
                "sensoryTag": "UV Bullseye · Red-Blind",
                "accentColor": "#facc15",
                "summary": "Trichromatic shifted toward ultraviolet (344/436/544 nm) with zero red sensitivity: scarlet poppies vanish to charcoal black while yellow blossoms ignite with UV nectar targets.",
                "photoreceptors": [
                    {"label": "UV-Receptor", "peakNm": 344, "color": "#c084fc", "width": 28},
                    {"label": "Blue-Receptor", "peakNm": 436, "color": "#38bdf8", "width": 34},
                    {"label": "Green-Receptor", "peakNm": 544, "color": "#84cc16", "width": 40},
                ],
                "nonVisualBand": {"label": "Dorsal Rim Sky Polarization", "range": "Rayleigh e-vector compass"},
                "mechanic": {"id": "uv_inspect", "hint": "Hover blossoms to inspect ommatidia facets & UV nectar guides; look up for Rayleigh sky rings"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 ultra-wide macro insect-level photograph from 0.48m inside a dense alpine wildflower "
                    "cluster looking slightly upward toward a crisp deep blue Rocky Mountain sky. Large vivid yellow Rudbeckia black-eyed Susan "
                    "blossoms fill the center-left and center-right foreground with detailed radial petals and dark pollen centers, contrasted right "
                    "next to bold crimson-scarlet red alpine poppies. Crisp sunlit dew, lush stems, deep azure sky in top third, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Rudbeckia UV Nectar Bullseye", "x": 0.42, "y": 0.56, "rx": 0.13, "ry": 0.15},
                    "secondaryTarget": {"present": True, "label": "Scarlet Alpine Poppy", "x": 0.72, "y": 0.62, "rx": 0.12, "ry": 0.14},
                    "environmentFeature": {"present": True, "label": "Pollen Anther Cluster", "x": 0.24, "y": 0.68, "rx": 0.10, "ry": 0.12},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.18, "rx": 0.50, "ry": 0.22},
                },
            },
            {
                "slot": 4,
                "slug": "rattlesnake",
                "shaderId": 3,
                "name": "Prairie Rattlesnake",
                "scientificName": "Crotalus viridis",
                "icon": "🐍",
                "elevationM": 0.10,
                "vantageLabel": "0.10 m Boulder Crevice · 75° Ground-Level Macro",
                "fovDeg": 75,
                "sensoryTag": "Thermal IR 8–12 μm",
                "accentColor": "#f43f5e",
                "summary": "Loreal pit organs fuse an 8–12 μm thermal infrared map over low-acuity B/G vision: icy 6°C creeks freeze deep indigo while a camouflaged 38.2°C vole blazes magenta-white.",
                "photoreceptors": [
                    {"label": "S-Cone (UV/Blue)", "peakNm": 430, "color": "#38bdf8", "width": 36},
                    {"label": "M-Cone (Green)", "peakNm": 545, "color": "#4ade80", "width": 44},
                ],
                "nonVisualBand": {"label": "Loreal Pit Organ Thermal IR", "range": "8–12 μm (ΔT 0.003°C)"},
                "mechanic": {"id": "thermal_scan", "hint": "Scan along the boulder crevice & grass base to lock onto the 38.2°C endothermic vole"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 ground-level 10cm-high wildlife ambush photograph from inside a sun-baked granite "
                    "boulder crevice beside a Rocky Mountain creek. Towering foreground blades of meadow grass frame the view; sun-warmed rough "
                    "granite rocks on left and foreground, cold sparkling mountain snowmelt stream flowing on the far right, and a well-camouflaged "
                    "brown meadow vole foraging in brown grass litter 1.4 meters ahead slightly right of center. Realistic natural wildlife lens, no text."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "38.2°C Foraging Meadow Vole", "x": 0.58, "y": 0.58, "rx": 0.09, "ry": 0.10},
                    "secondaryTarget": {"present": True, "label": "28°C Sun-Baked Granite", "x": 0.22, "y": 0.68, "rx": 0.18, "ry": 0.18},
                    "environmentFeature": {"present": True, "label": "6°C Snowmelt Creek", "x": 0.82, "y": 0.54, "rx": 0.16, "ry": 0.18},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.12, "rx": 0.50, "ry": 0.14},
                },
            },
            {
                "slot": 5,
                "slug": "deer",
                "shaderId": 4,
                "name": "Whitetail Deer",
                "scientificName": "Odocoileus virginianus",
                "icon": "🦌",
                "elevationM": 1.25,
                "vantageLabel": "1.25 m Spruce Timberline · 98° Ultra-Wide Panoramic",
                "fovDeg": 98,
                "sensoryTag": "Horizon Streak + Motion",
                "accentColor": "#38bdf8",
                "summary": "Red-green dichromat with a razor-sharp horizontal visual streak along the treeline and hyper-dense rod motion amplification that makes a stalking bobcat shimmer.",
                "photoreceptors": [
                    {"label": "S-Cone (Blue)", "peakNm": 455, "color": "#3b82f6", "width": 38},
                    {"label": "M-Cone (Green-Yellow)", "peakNm": 537, "color": "#eab308", "width": 46},
                ],
                "nonVisualBand": {"label": "Horizontal Visual Streak + Rod ΔI", "range": "310° panoramic motion shimmer"},
                "mechanic": {"id": "motion_streak", "hint": "Keep the treeline inside your horizontal streak to catch the stalking bobcat's motion shimmer"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 ultra-wide 98-degree panoramic wildlife photograph from 1.25m deer eye height "
                    "at the shaded edge of an Engelmann spruce timberline looking across an open alpine meadow. Tall grasses and red-orange "
                    "wildflowers sweep across the lower foreground; along the mid-horizon treeline on the right third, a camouflaged tawny bobcat "
                    "crouches partially hidden behind fallen timber and brush staring toward the meadow. Crisp mountain depth, natural light, no text."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Stalking Bobcat at Timberline", "x": 0.72, "y": 0.50, "rx": 0.09, "ry": 0.09},
                    "secondaryTarget": {"present": True, "label": "Meadow Poppy Patch", "x": 0.28, "y": 0.76, "rx": 0.16, "ry": 0.12},
                    "environmentFeature": {"present": True, "label": "Spruce Horizon Line", "x": 0.50, "y": 0.48, "rx": 0.48, "ry": 0.10},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.18, "rx": 0.50, "ry": 0.20},
                },
            },
        ],
    },
    {
        "id": "reef",
        "name": "Indo-Pacific Coral Reef Lagoon",
        "shortName": "Coral Reef Lagoon",
        "subtitle": "Photic Marine Ecosystem · -0.1 m to -6.0 m",
        "theme": "Underwater red-wavelength absorption, linear & circular polarization, biofluorescence, and bioelectric fields.",
        "lightingPresets": [
            {"id": "Tropical Zenith Caustics", "label": "Tropical Zenith Caustics", "isDefault": True, "tempK": 7400},
            {"id": "Turbid Plankton Bloom", "label": "Turbid Plankton Bloom", "isDefault": False, "tempK": 6100},
            {"id": "Twilight Blue-Hour Fluorescence", "label": "Twilight Blue-Hour Fluorescence", "isDefault": False, "tempK": 9600},
        ],
        "scale": {
            "mode": "depth",
            "unit": "m",
            "min": -6.0,
            "max": -0.1,
            "minLabel": "-6.0 m Sandy Drop-Off",
            "maxLabel": "-0.1 m Lagoon Surface",
        },
        "species": [
            {
                "slot": 1,
                "slug": "human_reef",
                "shaderId": 5,
                "name": "Human Scuba Diver",
                "scientificName": "Homo sapiens",
                "icon": "🤿",
                "elevationM": -4.0,
                "vantageLabel": "-4.0 m Reef Mid-Water · 65° Dome Port",
                "fovDeg": 65,
                "sensoryTag": "Beer-Lambert Cyan Wash",
                "accentColor": "#38bdf8",
                "summary": "At 4 meters depth seawater absorbs wavelengths >600 nm, washing coral in cyan-blue while transparent glass shrimp and sand-buried stingrays vanish completely.",
                "photoreceptors": [
                    {"label": "S-Cone (Blue)", "peakNm": 420, "color": "#3b82f6", "width": 36},
                    {"label": "M-Cone (Green)", "peakNm": 534, "color": "#22c55e", "width": 44},
                    {"label": "L-Cone (Attenuated)", "peakNm": 564, "color": "#ef4444", "width": 46},
                ],
                "nonVisualBand": {"label": "Hydrostatic & Beer-Lambert Loss", "range": "1.40 atm · 78% red lost"},
                "mechanic": None,
                "imagePrompt": (
                    "National Geographic underwater photorealistic 16:9 wide dome-port photograph at 4 meters depth in a clear Indo-Pacific "
                    "coral reef lagoon. Sunlight ripples and shimmering caustics dance from the surface onto vibrant Acropora staghorn corals, "
                    "sponges, and a clean white rippled coral sand drop-off below. Natural underwater cyan-blue ambient light attenuation "
                    "(without artificial strobe flash), faint distant reef fish, photorealistic marine documentary look, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Acropora Coral Head", "x": 0.34, "y": 0.56, "rx": 0.16, "ry": 0.16},
                    "secondaryTarget": {"present": True, "label": "Sandy Drop-Off Floor", "x": 0.68, "y": 0.78, "rx": 0.22, "ry": 0.14},
                    "environmentFeature": {"present": True, "label": "Surface Sun Caustics", "x": 0.50, "y": 0.18, "rx": 0.44, "ry": 0.16},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.22, "rx": 0.50, "ry": 0.26},
                },
            },
            {
                "slot": 2,
                "slug": "mantis_shrimp",
                "shaderId": 6,
                "name": "Peacock Mantis Shrimp",
                "scientificName": "Odontodactylus scyllarus",
                "icon": "🦐",
                "elevationM": -3.8,
                "vantageLabel": "-3.8 m Rubble Burrow (0.08 m off seabed) · 80° Macro",
                "fovDeg": 80,
                "sensoryTag": "12-Band + Circular Pol.",
                "accentColor": "#ec4899",
                "summary": "12 narrowband spectral channels (300–720 nm) plus circular polarization receptors mounted in a sweeping equatorial midband strip decode armored crustacean shell signals.",
                "photoreceptors": [
                    {"label": "UV 1–4", "peakNm": 335, "color": "#a855f7", "width": 22},
                    {"label": "Violet/Blue 5–7", "peakNm": 445, "color": "#3b82f6", "width": 24},
                    {"label": "Green/Yellow 8–10", "peakNm": 555, "color": "#22c55e", "width": 24},
                    {"label": "Red/Far-Red 11–12", "peakNm": 665, "color": "#f43f5e", "width": 26},
                ],
                "nonVisualBand": {"label": "Circular Polarization (CPL) Midband", "range": "Left & Right-handed CPL"},
                "mechanic": {"id": "midband_sweep", "hint": "Sweep cursor to aim the tilted trinocular 12-band + CPL scanline across the coral rubble"},
                "imagePrompt": (
                    "Strictly first-person POV underwater National Geographic photorealistic 16:9 low-angle reef-floor macro photograph "
                    "looking outward from 8 cm above a coral rubble seabed peering out of a dark burrow lip. Textural dead coral rubble, "
                    "encrusting pink coralline algae, and an armored camouflaged mottled reef crab (Xanthidae) tucked inside a sunlit coral "
                    "crevice right-of-center beside an iridescent bivalve shell, with sunlit turquoise reef water above. NO mantis shrimp "
                    "anywhere in the frame—pure first-person vantage looking out at crab prey. Ultra-crisp macro photography, no text."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Armored Reef Crab (CPL Shell)", "x": 0.62, "y": 0.56, "rx": 0.11, "ry": 0.11},
                    "secondaryTarget": {"present": True, "label": "Iridescent Giant Clam Mantle", "x": 0.30, "y": 0.68, "rx": 0.10, "ry": 0.09},
                    "environmentFeature": {"present": True, "label": "Coral Rubble Terrace", "x": 0.48, "y": 0.78, "rx": 0.36, "ry": 0.16},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.18, "rx": 0.50, "ry": 0.22},
                },
            },
            {
                "slot": 3,
                "slug": "cuttlefish",
                "shaderId": 7,
                "name": "Broadclub Cuttlefish",
                "scientificName": "Sepia latimanus",
                "icon": "🦑",
                "elevationM": -1.2,
                "vantageLabel": "-1.2 m Acropora Overhang · 90° Wide W-Pupil",
                "fovDeg": 90,
                "sensoryTag": "Monochromat + e-Vector Pol.",
                "accentColor": "#22d3ee",
                "summary": "Colorblind single-opsin monochromat (492 nm) with a W-shaped pupil and linear polarization sensitivity that shatters the camouflage of transparent glass shrimp.",
                "photoreceptors": [
                    {"label": "Single Visual Opsin", "peakNm": 492, "color": "#22d3ee", "width": 44},
                ],
                "nonVisualBand": {"label": "Linear Polarization Analyzer (Malus)", "range": "θ ∈ [0°, 180°] e-vector"},
                "mechanic": {"id": "polarization_align", "hint": "Scroll wheel / Q & E / drag slider to rotate polarization angle θ and unmask glass shrimp"},
                "imagePrompt": (
                    "National Geographic underwater photorealistic 16:9 wide photograph at 1.2 meters depth hovering just beneath an Acropora "
                    "staghorn coral overhang in a bright tropical Indo-Pacific lagoon. Intricate branching coral arms reach across the midground, "
                    "and perched delicately on a sunlit coral branch left-of-center is a nearly invisible translucent glass anemone shrimp "
                    "(Periclimenes), with shimmering silverside baitfish glinting in the sunlit turquoise blue water behind. Natural documentary photo, no text."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Transparent Glass Shrimp", "x": 0.40, "y": 0.55, "rx": 0.10, "ry": 0.10},
                    "secondaryTarget": {"present": True, "label": "Silverside Baitfish School", "x": 0.72, "y": 0.36, "rx": 0.14, "ry": 0.11},
                    "environmentFeature": {"present": True, "label": "Acropora Staghorn Coral", "x": 0.36, "y": 0.64, "rx": 0.26, "ry": 0.20},
                    "skyOrWaterRegion": {"present": True, "x": 0.66, "y": 0.22, "rx": 0.42, "ry": 0.26},
                },
            },
            {
                "slot": 4,
                "slug": "hammerhead",
                "shaderId": 8,
                "name": "Scalloped Hammerhead",
                "scientificName": "Sphyrna lewini",
                "icon": "🦈",
                "elevationM": -3.5,
                "vantageLabel": "-3.5 m Sandy Reef Drop-Off · 105° Wide Cephalofoil",
                "fovDeg": 105,
                "sensoryTag": "Electroreception (nV/cm)",
                "accentColor": "#818cf8",
                "summary": "Wide-set binocular eyes paired with thousands of Ampullae of Lorenzini across the cephalofoil detect 5 nV/cm bioelectric dipoles pulsing from prey buried beneath sand.",
                "photoreceptors": [
                    {"label": "Rod-Rich Scotopic", "peakNm": 500, "color": "#2dd4bf", "width": 44},
                    {"label": "Green-Blue Cone", "peakNm": 525, "color": "#38bdf8", "width": 40},
                ],
                "nonVisualBand": {"label": "Ampullae of Lorenzini (E-Dipole)", "range": "5 nV/cm · 1.2 Hz gill pulse"},
                "mechanic": {"id": "dipole_hover", "hint": "Sweep cephalofoil cursor over open sandflats to trace E-dipole streamlines to the buried stingray"},
                "imagePrompt": (
                    "National Geographic underwater photorealistic 16:9 ultra-wide 105-degree downward-angled marine photograph from 3.5 meters "
                    "depth cruising just above a sunlit white rippled coral sand seabed next to a coral reef drop-off wall on the far left. "
                    "Expansive pale rippled sand fills the center and right foreground with almost nothing visible except the faint subtle "
                    "outline of two tiny raised eyes and a shallow sand dimple of a completely buried blue-spotted stingray near center-right. "
                    "Refracted caustic light ripples on sand, blue open water ahead, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Buried Stingray (1.2 Hz Dipole)", "x": 0.60, "y": 0.64, "rx": 0.11, "ry": 0.10},
                    "secondaryTarget": {"present": True, "label": "Secondary Buried Flounder", "x": 0.34, "y": 0.72, "rx": 0.09, "ry": 0.08},
                    "environmentFeature": {"present": True, "label": "Rippled Coral Sandflat", "x": 0.54, "y": 0.70, "rx": 0.38, "ry": 0.22},
                    "skyOrWaterRegion": {"present": True, "x": 0.56, "y": 0.20, "rx": 0.48, "ry": 0.24},
                },
            },
            {
                "slot": 5,
                "slug": "sea_turtle",
                "shaderId": 9,
                "name": "Hawksbill Sea Turtle",
                "scientificName": "Eretmochelys imbricata",
                "icon": "🐢",
                "elevationM": -2.2,
                "vantageLabel": "-2.2 m Vertical Coral Wall · 72° Reef Glide",
                "fovDeg": 72,
                "sensoryTag": "Biofluorescence Oil Filter",
                "accentColor": "#10b981",
                "summary": "Tetrachromatic cones capped by orange-red carotenoid oil droplets cut ambient blue scatter (<500 nm), igniting biofluorescent green (515 nm) and red (585 nm) reef life.",
                "photoreceptors": [
                    {"label": "UV/Violet Cone", "peakNm": 385, "color": "#a855f7", "width": 26},
                    {"label": "S-Cone (Oil Filter)", "peakNm": 458, "color": "#38bdf8", "width": 28},
                    {"label": "M-Cone (515 nm Peak)", "peakNm": 518, "color": "#10b981", "width": 30},
                    {"label": "L-Cone (Carotenoid)", "peakNm": 595, "color": "#f97316", "width": 32},
                ],
                "nonVisualBand": {"label": "Carotenoid Long-Pass Oil Droplets", "range": "515 nm green / 585 nm red glow"},
                "mechanic": {"id": "fluorescence_scan", "hint": "Inspect the darkened cobalt reef wall to spot biofluorescent sponges & the camouflaged frogfish"},
                "imagePrompt": (
                    "National Geographic underwater photorealistic 16:9 photograph gliding along a dramatic vertical tropical Indo-Pacific coral "
                    "reef wall at 2.2 meters depth. Deep cobalt reef drop-off on the right, rich encrusted vertical coral wall on the left and "
                    "center covered with barrel sponges, sea anemones, green brain corals, and a heavily camouflaged warty cryptic frogfish "
                    "blending seamlessly into a textured reddish-orange sponge near center-left. Natural ambient twilight-blue underwater light, no text."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Biofluorescent Cryptic Frogfish", "x": 0.42, "y": 0.54, "rx": 0.10, "ry": 0.11},
                    "secondaryTarget": {"present": True, "label": "515 nm Fluorescent Sponge Colony", "x": 0.24, "y": 0.66, "rx": 0.13, "ry": 0.14},
                    "environmentFeature": {"present": True, "label": "Vertical Coral Reef Wall", "x": 0.34, "y": 0.56, "rx": 0.34, "ry": 0.36},
                    "skyOrWaterRegion": {"present": True, "x": 0.80, "y": 0.42, "rx": 0.22, "ry": 0.42},
                },
            },
        ],
    },
    {
        "id": "cloudforest",
        "name": "Neotropical Cloud Forest at Dusk",
        "shortName": "Cloud Forest (Night)",
        "subtitle": "Crepuscular & Nocturnal Canopy · Costa Rica",
        "theme": "Photon-starved scotopic trade-offs, multifocal nocturnal color vision, chromatic defocus ranging, quantum magnetoreception, and active sonar-thermal fusion.",
        "lightingPresets": [
            {"id": "Moonlit Mist", "label": "Moonlit Mist", "isDefault": True, "tempK": 6800},
            {"id": "Bioluminescent Rain", "label": "Bioluminescent Rain", "isDefault": False, "tempK": 5600},
            {"id": "Deep Starlight Canopy", "label": "Deep Starlight Canopy", "isDefault": False, "tempK": 8200},
        ],
        "scale": {
            "mode": "elevation",
            "unit": "m",
            "min": 0.0,
            "max": 20.0,
            "minLabel": "0.0 m Buttress Roots",
            "maxLabel": "20.0 m Emergent Crown",
        },
        "species": [
            {
                "slot": 1,
                "slug": "human_forest",
                "shaderId": 10,
                "name": "Human Night Hiker",
                "scientificName": "Homo sapiens",
                "icon": "🔦",
                "elevationM": 1.70,
                "vantageLabel": "1.70 m Mossy Epiphyte Trail · 55° Scotopic",
                "fovDeg": 55,
                "sensoryTag": "Scotopic Rod Snow",
                "accentColor": "#64748b",
                "summary": "Photon-starved human rods (498 nm Purkinje shift) collapse the nocturnal cloud forest into grainy blue-grey silhouettes, erasing crimson bromeliads and emerald treefrogs.",
                "photoreceptors": [
                    {"label": "Scotopic Rods (Active)", "peakNm": 498, "color": "#60a5fa", "width": 46},
                ],
                "nonVisualBand": {"label": "Photon Shot-Noise Floor", "range": "Colorblind < 0.01 cd/m²"},
                "mechanic": None,
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 twilight wildlife photograph from 1.7m eye height along a misty Neotropical "
                    "Monteverde cloud forest trail at dusk. Massive buttress tree trunks draped in lush emerald moss, crimson-red epiphytic "
                    "bromeliads, wet ferns, and a tiny emerald glass treefrog perched on a dark leaf in the foreground, veiled in drifting silver "
                    "moonlit mist. Rich subtle natural color detail preserved in low light (for biological shader processing), zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Crimson Epiphyte Bromeliad", "x": 0.36, "y": 0.56, "rx": 0.13, "ry": 0.13},
                    "secondaryTarget": {"present": True, "label": "Emerald Leaf Treefrog", "x": 0.64, "y": 0.62, "rx": 0.09, "ry": 0.09},
                    "environmentFeature": {"present": True, "label": "Mossy Cloud Forest Trail", "x": 0.50, "y": 0.72, "rx": 0.34, "ry": 0.20},
                    "skyOrWaterRegion": {"present": True, "x": 0.52, "y": 0.18, "rx": 0.42, "ry": 0.18},
                },
            },
            {
                "slot": 2,
                "slug": "gecko",
                "shaderId": 11,
                "name": "Leaf-Tailed Gecko",
                "scientificName": "Uroplatus sikorae",
                "icon": "🦎",
                "elevationM": 1.85,
                "vantageLabel": "1.85 m Vertical Mossy Trunk · 82° Close Bark View",
                "fovDeg": 82,
                "sensoryTag": "350× Nocturnal Color",
                "accentColor": "#34d399",
                "summary": "Pure-cone nocturnal retina with 350× human cone light sensitivity and multifocal pinhole slit pupils restores vivid emerald, ruby, and iridescent color in near-total darkness.",
                "photoreceptors": [
                    {"label": "UV-Cone (350×)", "peakNm": 364, "color": "#a855f7", "width": 28},
                    {"label": "Blue-Cone (350×)", "peakNm": 467, "color": "#38bdf8", "width": 34},
                    {"label": "Green-Cone (350×)", "peakNm": 521, "color": "#34d399", "width": 38},
                ],
                "nonVisualBand": {"label": "Multifocal Pinhole Slit Pupil", "range": "350× cone photon gain"},
                "mechanic": {"id": "night_color_inspect", "hint": "Inspect the dark mossy bark through 350× nocturnal color clarity to spot the emerald luna moth"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 close-up twilight macro photograph from 1.85m clinging on a vertical damp mossy "
                    "rainforest tree trunk in a Costa Rican cloud forest. Vivid emerald-green moss, ruby-red epiphytic bromeliad petals, tiny "
                    "glowing Mycena forest mushrooms, and a stunning iridescent emerald-and-gold nocturnal moth resting flat against lichen-covered "
                    "bark right-of-center. Soft moody moonlit forest depth behind, crisp botanical & insect detail, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Iridescent Nocturnal Moth", "x": 0.62, "y": 0.50, "rx": 0.10, "ry": 0.11},
                    "secondaryTarget": {"present": True, "label": "Ruby Bromeliad Rosette", "x": 0.28, "y": 0.62, "rx": 0.13, "ry": 0.13},
                    "environmentFeature": {"present": True, "label": "Lichen & Moss Bark", "x": 0.48, "y": 0.56, "rx": 0.36, "ry": 0.34},
                    "skyOrWaterRegion": {"present": True, "x": 0.84, "y": 0.20, "rx": 0.18, "ry": 0.22},
                },
            },
            {
                "slot": 3,
                "slug": "jumping_spider",
                "shaderId": 12,
                "name": "Portia Jumping Spider",
                "scientificName": "Portia fimbriata",
                "icon": "🕷️",
                "elevationM": 0.35,
                "vantageLabel": "0.35 m Bromeliad Leaf Edge · 68° Anterior Macro",
                "fovDeg": 68,
                "sensoryTag": "Chromatic Defocus + 360°",
                "accentColor": "#d946ef",
                "summary": "Tiered retinas focus green light on Layer 1 while measuring optical blur on Layer 2 to compute exact jump distance, backed by a 360° peripheral secondary-eye motion ring.",
                "photoreceptors": [
                    {"label": "UV-Tier 4", "peakNm": 360, "color": "#a855f7", "width": 26},
                    {"label": "Green-Focus Tier 1", "peakNm": 530, "color": "#22c55e", "width": 34},
                    {"label": "Green-Defocus Tier 2", "peakNm": 532, "color": "#e879f9", "width": 36},
                ],
                "nonVisualBand": {"label": "Image-Defocus Depth + 360° Radar", "range": "±2 mm ballistic rangefinding"},
                "mechanic": {"id": "defocus_lock", "hint": "Aim the green-magenta defocus rangefinder over the rainforest leaf katydid on the bromeliad frond to lock jump range"},
                "imagePrompt": (
                    "Strictly first-person POV National Geographic photorealistic 16:9 extreme macro photograph from 0.35m peering directly "
                    "along the glistening curving edge of a tropical rainforest bromeliad leaf at dusk. Dewdrops bead along the serrated green "
                    "leaf blade leading toward a small camouflaged emerald-and-tan rainforest katydid cricket perched delicately on an adjacent "
                    "frond tip just center-left in twilight mist. NO spiders anywhere in the frame—pure first-person predator POV looking at "
                    "insect prey. Rich shallow depth of field, atmospheric misty cloud forest bokeh behind, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Rainforest Leaf Katydid Prey", "x": 0.44, "y": 0.50, "rx": 0.10, "ry": 0.10},
                    "secondaryTarget": {"present": True, "label": "Dew-Laden Bromeliad Tip", "x": 0.68, "y": 0.60, "rx": 0.12, "ry": 0.12},
                    "environmentFeature": {"present": True, "label": "Bromeliad Frond Edge", "x": 0.42, "y": 0.72, "rx": 0.36, "ry": 0.18},
                    "skyOrWaterRegion": {"present": True, "x": 0.52, "y": 0.16, "rx": 0.46, "ry": 0.18},
                },
            },
            {
                "slot": 4,
                "slug": "thrush",
                "shaderId": 13,
                "name": "Swainson's Thrush",
                "scientificName": "Catharus ustulatus",
                "icon": "🐦",
                "elevationM": 18.0,
                "vantageLabel": "18.0 m Emergent Canopy Crown · 88° Horizon-Sky View",
                "fovDeg": 88,
                "sensoryTag": "Quantum Magnetoreception",
                "accentColor": "#f59e0b",
                "summary": "Cryptochrome-4 radical-pair proteins in retinal cones sense Earth's 62° geomagnetic inclination dip angle, painting a violet-gold spin-triplet compass arc across the overcast night sky.",
                "photoreceptors": [
                    {"label": "UV/Violet (Cry4 Host)", "peakNm": 405, "color": "#8b5cf6", "width": 30},
                    {"label": "Blue-Cone", "peakNm": 460, "color": "#38bdf8", "width": 34},
                    {"label": "Green-Cone", "peakNm": 515, "color": "#22c55e", "width": 36},
                    {"label": "Red-Cone", "peakNm": 570, "color": "#f59e0b", "width": 38},
                ],
                "nonVisualBand": {"label": "Cryptochrome-4 Radical-Pair", "range": "γ = 62° geomagnetic dip"},
                "mechanic": {"id": "magnetic_compass", "hint": "Trace the glowing violet-gold geomagnetic inclination band across the foggy canopy sky"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 wide aerial canopy photograph from 18 meters high perched in the emergent crown "
                    "of a giant cloud forest tree at twilight dusk looking out over an endless sea of misty dark emerald treetops toward a "
                    "deep indigo twilight sky with wispy drifting clouds and faint first stars above distant volcanic ridges. Wide open upper "
                    "sky occupying the top 55% of frame, dramatic atmospheric depth, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Geomagnetic Inclination Node (62°)", "x": 0.52, "y": 0.28, "rx": 0.14, "ry": 0.12},
                    "secondaryTarget": {"present": True, "label": "Emergent Canopy Ridge", "x": 0.30, "y": 0.68, "rx": 0.22, "ry": 0.14},
                    "environmentFeature": {"present": True, "label": "Cloud-Veiled Valley Mist", "x": 0.66, "y": 0.62, "rx": 0.28, "ry": 0.14},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.26, "rx": 0.50, "ry": 0.30},
                },
            },
            {
                "slot": 5,
                "slug": "vampire_bat",
                "shaderId": 14,
                "name": "Common Vampire Bat",
                "scientificName": "Desmodus rotundus",
                "icon": "🦇",
                "elevationM": 2.6,
                "vantageLabel": "2.6 m Ceiba Buttress Hollow · 85° Gliding Sonar",
                "fovDeg": 85,
                "sensoryTag": "60–90 kHz Sonar + TRPV1",
                "accentColor": "#06b6d4",
                "summary": "Active 60–90 kHz ultrasonic echolocation reconstructs 3D branch geometry out of pitch darkness, while TRPV1 nasal-pit heat sensors detect warm superficial blood vessels.",
                "photoreceptors": [
                    {"label": "Dim Scotopic Rods", "peakNm": 496, "color": "#475569", "width": 44},
                ],
                "nonVisualBand": {"label": "Ultrasonic Sonar + TRPV1 Thermal", "range": "60–90 kHz · 30°C capillary pit"},
                "mechanic": {"id": "sonar_ping", "hint": "Click or press E / Sonar button to emit an expanding 3D acoustic edge wave & reveal warm capillaries"},
                "imagePrompt": (
                    "National Geographic photorealistic 16:9 nocturnal wildlife photograph from 2.6 meters gliding down into a shadowy Neotropical "
                    "rainforest clearing framed by towering gnarled Ceiba tree buttress roots and hanging lianas in dim blue moonlight. "
                    "Nestled quietly in dark mossy undergrowth near lower-center-right rests a dark brown Baird's tapir with subtle clear "
                    "silhouette along its neck and shoulder. High-contrast structural forest geometry with clear depth layers, zero text, no watermark."
                ),
                "defaultSemantics": {
                    "primaryTarget": {"present": True, "label": "Resting Tapir TRPV1 Warm Capillaries", "x": 0.60, "y": 0.64, "rx": 0.12, "ry": 0.11},
                    "secondaryTarget": {"present": True, "label": "Ceiba Buttress Hollow", "x": 0.24, "y": 0.44, "rx": 0.16, "ry": 0.24},
                    "environmentFeature": {"present": True, "label": "Hanging Liana Vines", "x": 0.48, "y": 0.34, "rx": 0.26, "ry": 0.20},
                    "skyOrWaterRegion": {"present": True, "x": 0.50, "y": 0.12, "rx": 0.44, "ry": 0.12},
                },
            },
        ],
    },
]

MYSTERIES = [
    # --- BIOME 1: MEADOW ---
    {
        "mysteryId": "meadow_kestrel_uv_vole",
        "biomeId": "meadow",
        "requiredSpeciesSlug": "kestrel",
        "title": "Ultraviolet Highway",
        "cluePrompt": "From 13.5 m up, human eyes see only unbroken grass. Switch to the American Kestrel and sweep your 2.2× dual-fovea loupe along the glowing UV urine runway to click the hidden meadow vole.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "loupe_zoom",
        "scientificReveal": "Vole urine reflects 320–400 nm ultraviolet light intensely. Kestrels combine a UV-sensitive cone (λmax ≈ 370 nm) with a deep convexiclivate fovea giving 2.6× human visual acuity, turning invisible scent trails into neon hunting maps (Viitala et al., Nature 1995).",
        "points": 150,
    },
    {
        "mysteryId": "meadow_honeybee_uv_bullseye",
        "biomeId": "meadow",
        "requiredSpeciesSlug": "honeybee",
        "title": "The Invisible Nectar Runway",
        "cluePrompt": "To a human, scarlet poppies dominate the meadow. Step inside the blossom canopy as the red-blind Western Honeybee and click the hidden 'bee's purple' UV bullseye nectar guide.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "uv_inspect",
        "scientificReveal": "Honeybees lack red L-cones (peaks at 344, 436, 544 nm), so scarlet poppies collapse into dark charcoal. Meanwhile, Rudbeckia petals load UV-absorbing flavonol pigments at their center, creating a glowing 'bee's purple' landing bullseye invisible to humans.",
        "points": 150,
    },
    {
        "mysteryId": "meadow_rattlesnake_thermal_vole",
        "biomeId": "meadow",
        "requiredSpeciesSlug": "rattlesnake",
        "title": "Heat in the Tall Grass",
        "cluePrompt": "Down at 10 cm in the boulder crevice, grass hides everything in shadow. Engage the Prairie Rattlesnake's loreal pit thermal fusion and click the 38.2°C endothermic prey blazing beside the 6°C indigo stream.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "thermal_scan",
        "scientificReveal": "Pit vipers express heat-gated TRPA1 ion channels in thin loreal pit membranes, detecting 8–12 μm infrared radiation down to 0.003°C. The optic tectum fuses this thermal map directly onto visual neurons for pinpoint ambush strikes.",
        "points": 175,
    },
    {
        "mysteryId": "meadow_deer_bobcat_shimmer",
        "biomeId": "meadow",
        "requiredSpeciesSlug": "deer",
        "title": "Ghost on the Horizon",
        "cluePrompt": "The spruce timberline looks calm to a human overlook. Switch to the Whitetail Deer's panoramic horizontal visual streak and click the stalking predator exposed by rod-amplified motion shimmer.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "motion_streak",
        "scientificReveal": "Instead of a round central fovea, grazing ungulates concentrate retinal ganglion cells along a horizontal visual streak matched to the horizon, combined with high rod density and fast temporal flicker fusion to spot the faintest ear twitch of a stalking bobcat.",
        "points": 175,
    },
    # --- BIOME 2: REEF ---
    {
        "mysteryId": "reef_mantis_cpl_signal",
        "biomeId": "reef",
        "requiredSpeciesSlug": "mantis_shrimp",
        "title": "Circular Polarization Armor",
        "cluePrompt": "Coral rubble hides armored prey in drab shadows. Sweep the Peacock Mantis Shrimp's tilted 12-channel midband strip to unmask and click the reef crab blazing in hyperspectral & CPL contrast.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "midband_sweep",
        "scientificReveal": "Stomatopods pack 12 narrowband spectral photoreceptors (300–720 nm) plus biological quarter-wave retarders distinguishing left- and right-handed circularly polarized light—breaking crustacean shell camouflage across sunlit coral rubble (Chiou et al., Current Biology 2008).",
        "points": 200,
    },
    {
        "mysteryId": "reef_cuttlefish_glass_shrimp",
        "biomeId": "reef",
        "requiredSpeciesSlug": "cuttlefish",
        "title": "The Invisible Crustacean",
        "cluePrompt": "To a scuba diver, the staghorn coral branch looks empty. Switch to the Broadclub Cuttlefish, rotate your polarization analyzer (scroll / Q & E / dial) until Malus's Law shatters its camouflage, then click the glass shrimp!",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "polarization_align",
        "scientificReveal": "Despite having only a single monochromatic visual opsin (492 nm), cephalopods arrange microvilli orthogonally to detect linear e-vector polarization. Transparent shrimp tissues birefringently rotate light, breaking their cloaking against depolarized coral.",
        "points": 200,
    },
    {
        "mysteryId": "reef_hammerhead_buried_ray",
        "biomeId": "reef",
        "requiredSpeciesSlug": "hammerhead",
        "title": "Heartbeat Beneath the Sand",
        "cluePrompt": "The white coral sandflat appears completely barren. Sweep the Scalloped Hammerhead's cephalofoil cursor across the sand to reveal the 1.2 Hz bioelectric dipole field and click the buried stingray.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "dipole_hover",
        "scientificReveal": "Gel-filled Ampullae of Lorenzini spanning the hammerhead's wide cephalofoil detect electric field gradients as faint as 5 nV/cm—sensitive enough to map the 1.2 Hz respiratory muscle dipole of a stingray completely buried beneath opaque sand.",
        "points": 200,
    },
    {
        "mysteryId": "reef_turtle_biofluorescent_frogfish",
        "biomeId": "reef",
        "requiredSpeciesSlug": "sea_turtle",
        "title": "Neon on the Reef Wall",
        "cluePrompt": "Ambient blue light turns the coral wall into monochrome silhouettes. Switch to the Hawksbill Sea Turtle's carotenoid oil-droplet biofluorescence filter and click the glowing camouflaged cryptic frogfish.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "fluorescence_scan",
        "scientificReveal": "Hawksbill sea turtles were the first biofluorescent reptiles ever documented (Gruber & Sparks, 2015). Their carotenoid-pigmented retinal oil droplets act as long-pass filters cutting blue scatter so biofluorescent 515 nm green and 585 nm red sponges and cryptic predators pop vividly.",
        "points": 175,
    },
    # --- BIOME 3: CLOUD FOREST ---
    {
        "mysteryId": "forest_gecko_night_moth",
        "biomeId": "cloudforest",
        "requiredSpeciesSlug": "gecko",
        "title": "Color in the Pitch Black",
        "cluePrompt": "To a human night hiker, the mossy bark is grainy grey noise. Switch to the Leaf-Tailed Gecko's 350× sensitive nocturnal cone retina to restore living color and click the hidden emerald moth.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "night_color_inspect",
        "scientificReveal": "Nocturnal helmet & leaf-tailed geckos evolved giant pure-cone photoreceptors 350× more sensitive to dim light than human cones, paired with multifocal optical zones that keep UV, blue, and green sharp simultaneously in dim moonlight (Roth & Kelber, 2004).",
        "points": 175,
    },
    {
        "mysteryId": "forest_spider_defocus_prey",
        "biomeId": "cloudforest",
        "requiredSpeciesSlug": "jumping_spider",
        "title": "Chromatic Depth Lock",
        "cluePrompt": "From the bromeliad leaf tip, aim the Portia Jumping Spider's green-magenta chromatic defocus rangefinder to calibrate exact jump distance and click the camouflaged rainforest katydid.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "defocus_lock",
        "scientificReveal": "Jumping spider principal eyes stack four photoreceptor tiers along the optical axis. Green light focuses sharply on Tier 1 while forming a distance-dependent blur circle on Tier 2, allowing monocular ballistic depth calculation without stereo disparity (Nagata et al., Science 2012).",
        "points": 200,
    },
    {
        "mysteryId": "forest_thrush_quantum_compass",
        "biomeId": "cloudforest",
        "requiredSpeciesSlug": "thrush",
        "title": "The Quantum Sky Compass",
        "cluePrompt": "Cloud cover conceals the night stars above the emergent canopy. Switch to Swainson's Thrush and click the glowing violet-gold Cryptochrome-4 geomagnetic inclination node guiding migration.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "magnetic_compass",
        "scientificReveal": "Migratory songbirds express Cryptochrome-4 (Cry4) flavoproteins in double-cone retinas. Blue photons trigger spin-correlated radical pairs whose singlet-triplet yield depends on Earth's 62° magnetic inclination dip angle—literally letting the bird see the geomagnetic field.",
        "points": 200,
    },
    {
        "mysteryId": "forest_bat_sonar_tapir",
        "biomeId": "cloudforest",
        "requiredSpeciesSlug": "vampire_bat",
        "title": "Echoes & Warm Capillaries",
        "cluePrompt": "The Ceiba buttress hollow is almost pitch black. Switch to the Common Vampire Bat, pulse ultrasonic sonar (Click / Key E) to illuminate the forest floor, and click the resting tapir's warm TRPV1 thermal target.",
        "targetSemanticKey": "primaryTarget",
        "requiredMechanic": "sonar_ping",
        "scientificReveal": "Vampire bats combine 60–90 kHz frequency-modulated ultrasonic echolocation for obstacle navigation with a uniquely tuned nasal-pit splice variant of TRPV1 (activated at 30°C instead of 43°C) that pinpoints blood-rich capillaries beneath fur (Gracheva et al., Nature 2011).",
        "points": 225,
    },
]

MISSIONS = [
    # --- BIOME 1: MEADOW ---
    {
        "missionId": "mission_kestrel_stoop",
        "biomeId": "meadow",
        "speciesSlug": "kestrel",
        "title": "Thermal Updraft Stoop",
        "gait": "glide_stoop",
        "actionLabel": "STOOP",
        "goalCount": 3,
        "timeLimitSec": 45,
        "brief": "Ride alpine thermals (WASD / Stick). Follow glowing violet UV urine runways with your 2.2× fovea reticle, align over scurrying voles, and STOOP (Space / Action) to catch 3 voles!",
        "mechanicTip": "Higher overlap inside the 2.2× fovea reticle locks your stoop onto camouflaged voles.",
    },
    {
        "missionId": "mission_honeybee_wasp",
        "biomeId": "meadow",
        "speciesSlug": "honeybee",
        "title": "Wasp Evasion & UV Nectar Run",
        "gait": "hover_dash",
        "actionLabel": "DASH",
        "goalCount": 5,
        "timeLimitSec": 50,
        "brief": "Harvest 5 glowing UV Rudbeckia bullseye blooms (WASD / Stick) while evading a hunting paper wasp! Hide inside charcoal-black scarlet poppies to drop wasp aggro (both species are red-blind).",
        "mechanicTip": "Scarlet poppies render velvety black—duck into them whenever the wasp closes in!",
    },
    {
        "missionId": "mission_rattlesnake_ambush",
        "biomeId": "meadow",
        "speciesSlug": "rattlesnake",
        "title": "Ectothermic Thermal Ambush",
        "gait": "slither_strike",
        "actionLabel": "STRIKE",
        "goalCount": 3,
        "timeLimitSec": 50,
        "brief": "Slither sinusoidally (WASD / Stick) toward blazing 38.2°C magenta-white voles and STRIKE (Space / Action) at close range. Warm up on 28°C amber rocks; avoid the 6°C indigo creek!",
        "mechanicTip": "Crossing icy 6°C snowmelt drains ectothermic strike heat—bask near warm granite.",
    },
    {
        "missionId": "mission_deer_vigilance",
        "biomeId": "meadow",
        "speciesSlug": "deer",
        "title": "Timberline Motion Vigilance",
        "gait": "patrol_flag",
        "actionLabel": "ALARM",
        "goalCount": 3,
        "timeLimitSec": 45,
        "brief": "Patrol along your sharp horizontal visual streak (WASD / Stick). Spot 3 cyan-white motion shimmer spikes from stalking bobcats before they pounce, aim at them, and stomp ALARM (Space / Action)!",
        "mechanicTip": "Keep threats inside the crisp horizontal horizon band where rod motion amplification peaks.",
    },
    # --- BIOME 2: REEF ---
    {
        "missionId": "mission_mantis_duel",
        "biomeId": "reef",
        "speciesSlug": "mantis_shrimp",
        "title": "CPL Burrow Defense",
        "gait": "dart_punch",
        "actionLabel": "STRIKE",
        "goalCount": 4,
        "timeLimitSec": 45,
        "brief": "Dart across coral rubble (WASD / Stick), sweep your tilted trinocular 12-band scanline to distinguish armored crab prey from circularly polarized rival flashes, and STRIKE (Space / Action)!",
        "mechanicTip": "Only prey illuminated by your midband scanline reveal their true spectral shell color.",
    },
    {
        "missionId": "mission_cuttlefish_shrimp",
        "biomeId": "reef",
        "speciesSlug": "cuttlefish",
        "title": "Polarized Glass Hunt",
        "gait": "jet_snatch",
        "actionLabel": "SNATCH",
        "goalCount": 4,
        "timeLimitSec": 55,
        "brief": "Glide silently (WASD / Stick) and rotate your linear polarization analyzer (Wheel / Q & E / Dial) to expose 4 transparent glass shrimp via Malus's Law, then SNATCH (Space / Action)!",
        "mechanicTip": "Match your analyzer angle θ to each glass shrimp's e-vector ψ until it flashes electric white.",
    },
    {
        "missionId": "mission_hammerhead_rays",
        "biomeId": "reef",
        "speciesSlug": "hammerhead",
        "title": "Sandflat Bioelectric Sweep",
        "gait": "cruise_pin",
        "actionLabel": "PIN",
        "goalCount": 3,
        "timeLimitSec": 50,
        "brief": "Cruise in wide cephalofoil S-sweeps over bare sand (WASD / Stick). Follow 1.2 Hz cyan-violet E-dipole streamlines to uncover 3 buried stingrays and PIN (Space / Action)!",
        "mechanicTip": "Dipole streamlines tighten sharply when your cephalofoil glides within 2 meters of a buried ray.",
    },
    {
        "missionId": "mission_turtle_sponges",
        "biomeId": "reef",
        "speciesSlug": "sea_turtle",
        "title": "Biofluorescent Sponge Glide",
        "gait": "glide_graze",
        "actionLabel": "GRAZE",
        "goalCount": 5,
        "timeLimitSec": 45,
        "brief": "Glide along the dark cobalt wall (WASD / Stick) using your carotenoid oil filter to GRAZE 5 glowing emerald (515 nm) biofluorescent sponges while avoiding neon-crimson venomous scorpionfish!",
        "mechanicTip": "Green 515 nm fluorescence signals edible sponges; pulsing crimson 585 nm warns of toxic spines.",
    },
    # --- BIOME 3: CLOUD FOREST ---
    {
        "missionId": "mission_gecko_moths",
        "biomeId": "cloudforest",
        "speciesSlug": "gecko",
        "title": "Nocturnal Jewel Ambush",
        "gait": "scamper_snap",
        "actionLabel": "SNAP",
        "goalCount": 4,
        "timeLimitSec": 45,
        "brief": "Scamper across damp mossy bark (WASD / Stick) in 350× nocturnal color clarity. SNAP (Space / Action) 4 iridescent emerald moths while avoiding ruby-spotted toxic beetles!",
        "mechanicTip": "Unlike humans, you see true nocturnal pigment—hunt emerald wings, dodge ruby shells.",
    },
    {
        "missionId": "mission_spider_leap",
        "biomeId": "cloudforest",
        "speciesSlug": "jumping_spider",
        "title": "Defocus Silk Ambush",
        "gait": "stalk_leap",
        "actionLabel": "LEAP",
        "goalCount": 3,
        "timeLimitSec": 50,
        "brief": "Stalk along bromeliad fronds (WASD / Stick). Watch your top 360° secondary-eye motion radar to sidestep stalking assassin bugs, calibrate chromatic defocus lock over 3 prey spiders, and LEAP!",
        "mechanicTip": "Wait until the green-magenta defocus rings converge cleanly (>80% lock) before leaping.",
    },
    {
        "missionId": "mission_thrush_migration",
        "biomeId": "cloudforest",
        "speciesSlug": "thrush",
        "title": "Quantum Corridor Flight",
        "gait": "soar_pulse",
        "actionLabel": "SURGE",
        "goalCount": 6,
        "timeLimitSec": 50,
        "brief": "Soar through blinding cloud mist (WASD / Stick). Stay locked inside the glowing violet-gold Cryptochrome-4 magnetic inclination corridor to pass 6 migratory waypoints while dodging dark owl silhouettes!",
        "mechanicTip": "When mist thickens, trust the violet-gold quantum spin band to hold your migratory heading.",
    },
    {
        "missionId": "mission_bat_canyon",
        "biomeId": "cloudforest",
        "speciesSlug": "vampire_bat",
        "title": "Echolocation Canyon Glide",
        "gait": "swoop_sonar",
        "actionLabel": "SONAR",
        "goalCount": 3,
        "timeLimitSec": 55,
        "brief": "Glide through pitch-dark Ceiba roots (WASD / Stick). Pulse 60–90 kHz SONAR (Space / E / Action) to illuminate looming branches in cyan echo rings and hone in on 3 warm TRPV1 thermal beacons!",
        "mechanicTip": "Sonar echoes fade after 2.5 seconds—ping rhythmically to avoid dark liana collisions.",
    },
]


def get_biome_by_id(biome_id):
    for b in BIOMES:
        if b["id"] == biome_id:
            return b
    return None


def get_species_config(biome_id, species_slug):
    biome = get_biome_by_id(biome_id)
    if not biome:
        return None, None
    for sp in biome["species"]:
        if sp["slug"] == species_slug:
            return biome, sp
    return biome, None


def get_mystery_by_id(mystery_id):
    for m in MYSTERIES:
        if m["mysteryId"] == mystery_id:
            return m
    return None


def get_mission_by_id(mission_id):
    for m in MISSIONS:
        if m["missionId"] == mission_id:
            return m
    return None


def get_full_catalog():
    return {
        "biomes": BIOMES,
        "mysteries": MYSTERIES,
        "missions": MISSIONS,
        "version": 1,
    }
