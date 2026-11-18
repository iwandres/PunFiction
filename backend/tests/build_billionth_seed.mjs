/**
 * Builds and validates `the-8-billionth/data/traits-core.json` (320+ curated traits across all 10 domains)
 * and `the-8-billionth/data/traits-parametric.json` (195 countries, 110+ languages, 85 sports,
 * 55 instruments, blood types, stature brackets, polyglot tiers, birth months & decades).
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'the-8-billionth', 'data');

const Taxonomy = require(path.join(ROOT, 'the-8-billionth', 'js', 'engine', 'taxonomy.js'));

function trait(
  canonicalSlug,
  label,
  shortBadge,
  emoji,
  category,
  prevalence,
  clusterTags,
  snarkNote,
  extra = {}
) {
  return {
    id: canonicalSlug,
    canonicalSlug,
    label,
    shortBadge,
    emoji,
    category,
    prevalence,
    clusterTags,
    snarkNote,
    aliases: extra.aliases || [],
    subsumes: extra.subsumes || [],
    ...(extra.exclusiveGroup ? { exclusiveGroup: extra.exclusiveGroup } : {}),
    ...(extra.icebreaker ? { icebreaker: true } : {}),
    ...(extra.isVerifiedExtremeRarity ? { isVerifiedExtremeRarity: true } : {})
  };
}

// ============================================================================
// LAYER 1: 325+ CURATED TRAITS ACROSS ALL 10 BALANCED DOMAINS
// ============================================================================
const CORE_TRAITS = [
  // --- 1. SPORTS & MOVEMENT (34) ---
  trait('plays_team_sport', 'I play a team sport regularly', 'Plays a team sport', '🏅', 'sports_movement', 0.25, ['athletic', 'team_sport'], 'Roughly 2.1 billion people still run around chasing a ball or puck on weekends.', { aliases: ['team sports', 'rec league'] }),
  trait('exercises_weekly', 'I work out or exercise every week', 'Exercises weekly', '💪', 'sports_movement', 0.31, ['athletic'], '2.6 billion people claim a weekly workout. Sweat alone will not clear this stadium.', { aliases: ['gym', 'workout', 'fitness'] }),
  trait('sport_volleyball', 'I play volleyball', 'Plays volleyball', '🏐', 'sports_movement', 0.12, ['athletic', 'team_sport', 'court_sport'], 'Nearly a billion recreational and club players worldwide know how to bump, set, and spike.', { aliases: ['beach volleyball', 'indoor volleyball', 'vball'], subsumes: ['plays_team_sport'], icebreaker: true }),
  trait('runs_regularly', 'I run for fitness regularly', 'Regular runner', '👟', 'sports_movement', 0.075, ['athletic', 'endurance_sport'], '620 million runners are currently debating shoe foam density right alongside you.', { aliases: ['jogging', '5k runner', 'jogger'], subsumes: ['exercises_weekly'] }),
  trait('marathon_finisher', 'I have finished a full marathon (26.2 mi)', 'Marathon finisher', '🎽', 'sports_movement', 0.0017, ['athletic', 'endurance_sport'], 'Only ~14 million living humans have survived Mile 20 and kept moving to 26.2.', { aliases: ['ran a marathon', '42.2km', 'marathoner'], subsumes: ['runs_regularly', 'exercises_weekly'] }),
  trait('half_marathon_finisher', 'I have finished a half-marathon', 'Half-marathoner', '🏃', 'sports_movement', 0.0065, ['athletic', 'endurance_sport'], '54 million humans have collected the banana and foil blanket at 13.1 miles.', { aliases: ['13.1 miles', '21k'], subsumes: ['runs_regularly'] }),
  trait('ultramarathon_finisher', 'I have completed an ultramarathon (50K+)', 'Ultramarathoner', '⛰️', 'sports_movement', 0.00022, ['athletic', 'endurance_sport', 'outdoor_mountain'], '1.8 million humans think 26.2 miles is merely a polite warm-up.', { aliases: ['ultra runner', '50k', '100 miler'], subsumes: ['marathon_finisher', 'half_marathon_finisher', 'runs_regularly'] }),
  trait('triathlon_finisher', 'I have completed a triathlon', 'Triathlete', '🏊', 'sports_movement', 0.0009, ['athletic', 'endurance_sport', 'water_sport'], '7.5 million people looked at one endurance sport and decided to pay entry fees for three at once.', { aliases: ['ironman', 'sprint triathlon'], subsumes: ['exercises_weekly'] }),
  trait('scuba_certified', 'I am open-water scuba certified', 'Scuba certified', '🤿', 'sports_movement', 0.0035, ['water_sport', 'outdoor_mountain'], 'About 29 million certified divers know never to hold their breath on ascent.', { aliases: ['padi', 'naui', 'scuba diver', 'diving'] }),
  trait('freediver', 'I freedive below 15 meters on one breath', 'Deep freediver', '🐬', 'sports_movement', 0.00035, ['water_sport', 'athletic'], '2.9 million humans voluntarily trigger the mammalian dive reflex for fun.', { aliases: ['apnea diving', 'freediving'] }),
  trait('sport_ultimate_frisbee', 'I play ultimate frisbee', 'Ultimate frisbee', '🥏', 'sports_movement', 0.0012, ['athletic', 'team_sport'], '10 million spirited humans are ready to debate a contested stall count in the rain.', { aliases: ['flatball', 'frisbee league', 'ultimate'], subsumes: ['plays_team_sport'] }),
  trait('disc_golfer', 'I play disc golf with my own discs', 'Disc golfer', '🥏', 'sports_movement', 0.00085, ['athletic', 'outdoor_mountain'], '7 million people carry a backpack full of beveled plastic into the woods.', { aliases: ['frolf', 'disc golf'] }),
  trait('indoor_boulderer', 'I boulder or rock climb regularly', 'Rock climber', '🧗', 'sports_movement', 0.0024, ['athletic', 'outdoor_mountain'], '20 million humans evaluate doorframes by their crimp potential.', { aliases: ['climbing gym', 'bouldering', 'lead climbing'], subsumes: ['exercises_weekly'] }),
  trait('skier_snowboarder', 'I ski or snowboard', 'Skis or snowboards', '🎿', 'sports_movement', 0.018, ['winter_sport', 'outdoor_mountain', 'athletic'], '150 million humans willingly slide down frozen mountains on expensive planks.', { aliases: ['skiing', 'snowboarding', 'alpine ski'] }),
  trait('backcountry_skier', 'I backcountry ski or splitboard in avalanche terrain', 'Backcountry skier', '🏔️', 'sports_movement', 0.00045, ['winter_sport', 'outdoor_mountain', 'endurance_sport'], '3.7 million humans carry a beacon, shovel, and probe just to earn their turns.', { aliases: ['ski touring', 'splitboarding', 'skinning'], subsumes: ['skier_snowboarder'] }),
  trait('ice_skater_backwards', 'I can ice skate backwards cleanly', 'Skates backwards', '⛸️', 'sports_movement', 0.014, ['winter_sport', 'athletic'], '116 million people can cross over in reverse without hugging the rink boards.', { aliases: ['figure skating', 'hockey skating'] }),
  trait('surfer', 'I surf ocean waves regularly', 'Ocean surfer', '🏄', 'sports_movement', 0.0042, ['water_sport', 'athletic'], '35 million humans check swell period forecasts before checking their email.', { aliases: ['surfing', 'longboard surfer', 'shortboard'] }),
  trait('pickleball_player', 'I play pickleball', 'Plays pickleball', '🏓', 'sports_movement', 0.0048, ['court_sport', 'athletic'], '40 million humans now speak fluent kitchen-violation rules.', { aliases: ['dink', 'pickleball'] }),
  trait('tennis_player', 'I play tennis', 'Plays tennis', '🎾', 'sports_movement', 0.013, ['court_sport', 'athletic'], '108 million players worldwide are chasing topspin down the baseline.', { aliases: ['court tennis'] }),
  trait('table_tennis_spin', 'I play spin-heavy table tennis', 'Table tennis player', '🏓', 'sports_movement', 0.038, ['court_sport', 'athletic'], '315 million humans take basement and club ping-pong deeply seriously.', { aliases: ['ping pong'] }),
  trait('badminton_player', 'I play badminton regularly', 'Plays badminton', '🏸', 'sports_movement', 0.042, ['court_sport', 'athletic'], '350 million players know a shuttlecock is the fastest projectile in racket sports.', { aliases: ['shuttlecock'] }),
  trait('road_cyclist', 'I ride clipless pedals on a road or gravel bike', 'Clipless cyclist', '🚴', 'sports_movement', 0.0045, ['cycling_wheeled', 'endurance_sport', 'athletic'], '37 million cyclists have tipped over at 0 mph at least once learning to unclip.', { aliases: ['gravel bike', 'road bike', 'lycra'], subsumes: ['exercises_weekly'] }),
  trait('mountain_biker', 'I ride singletrack mountain bike trails', 'Mountain biker', '🚵', 'sports_movement', 0.0052, ['cycling_wheeled', 'outdoor_mountain', 'athletic'], '43 million riders spend weekends dodging tree roots and rocks.', { aliases: ['mtb', 'trail riding'] }),
  trait('unicyclist', 'I can ride a unicycle', 'Rides a unicycle', '🎪', 'sports_movement', 0.00055, ['cycling_wheeled', 'athletic'], '4.5 million people decided two wheels felt overly redundant.', { aliases: ['unicycle'] }),
  trait('skateboarder_kickflip', 'I can land a kickflip on a skateboard', 'Lands a kickflip', '🛹', 'sports_movement', 0.0028, ['cycling_wheeled', 'athletic'], '23 million humans carry permanent shin lore from learning to flick the nose.', { aliases: ['skater', 'skateboarding', 'ollie'] }),
  trait('martial_arts_black_belt', 'I hold a black belt in a martial art', 'Martial arts black belt', '🥋', 'sports_movement', 0.0022, ['athletic'], '18 million living humans stuck around past every colored belt.', { aliases: ['karate', 'taekwondo', 'bjj', 'judo'] }),
  trait('bjj_practitioner', 'I train Brazilian Jiu-Jitsu', 'Trains BJJ', '🥋', 'sports_movement', 0.00075, ['athletic'], '6.2 million humans voluntarily fold laundry while someone is still wearing it.', { aliases: ['jiu jitsu', 'grappling'], subsumes: ['exercises_weekly'] }),
  trait('yoga_headstand', 'I can hold an unassisted headstand or handstand', 'Holds a handstand', '🤸', 'sports_movement', 0.009, ['athletic'], '75 million humans can invert themselves in the middle of a living room without crashing.', { aliases: ['handstand', 'inversion', 'sirsasana'] }),
  trait('swims_butterfly', 'I can swim 50m of legal butterfly stroke', 'Swims butterfly', '🏊', 'sports_movement', 0.006, ['water_sport', 'athletic'], '50 million swimmers can finish two lengths of fly without requiring rescue.', { aliases: ['competitive swimmer', 'lap swimmer'] }),
  trait('rower_crew', 'I have rowed sweep or sculls on open water', 'On-water rower', '🚣', 'sports_movement', 0.00042, ['water_sport', 'endurance_sport', 'team_sport'], '3.5 million humans wake up at dawn to go backwards as fast as possible.', { aliases: ['crew', 'sculling', 'rowing'] }),
  trait('fencer', 'I have competed in foil, épée, or sabre fencing', 'Competitive fencer', '🤺', 'sports_movement', 0.00018, ['athletic'], '1.5 million humans settle disputes on a 14-meter strip wired for electricity.', { aliases: ['fencing', 'epee', 'sabre'] }),
  trait('archery_shooter', 'I shoot recurve or compound archery', 'Shoots archery', '🏹', 'sports_movement', 0.0026, ['outdoor_mountain', 'athletic'], '21.5 million archers still obsess over anchor points and fletching.', { aliases: ['bow and arrow', 'recurve bow'] }),
  trait('curling_player', 'I have played curling on a real pebble-ice sheet', 'Played curling', '🥌', 'sports_movement', 0.00025, ['winter_sport', 'team_sport'], '2.1 million humans have yelled "HARD!" while furiously sweeping ice.', { aliases: ['curler', 'bonspiel'] }),
  trait('backpacker_multiday', 'I go on multi-day wilderness backpacking trips', 'Wilderness backpacker', '🎒', 'sports_movement', 0.0068, ['outdoor_mountain', 'endurance_sport'], '56 million humans weigh their toothbrushes in grams before heading off-grid.', { aliases: ['thru hiker', 'backpacking', 'ultralight'] }),

  // --- 2. GENETICS & PHYSIOLOGY (33) ---
  trait('left_handed', 'I am left-handed', 'Left-handed', '✍️', 'genetics_physiology', 0.106, ['handedness', 'genetic_quirk'], 'You and 880 million fellow southpaws have smudged ink across notebooks since grade school.', { aliases: ['southpaw', 'lefty'], icebreaker: true }),
  trait('ambidextrous', 'I am genuinely ambidextrous', 'Ambidextrous', '👐', 'genetics_physiology', 0.01, ['handedness', 'genetic_quirk'], '83 million humans treat left- and right-handed scissors with equal indifference.', { aliases: ['both hands', 'cross dominant'] }),
  trait('photic_sun_sneezer', 'Bright sunlight makes me sneeze (ACHOO syndrome)', 'Sun sneezer', '🌞', 'genetics_physiology', 0.22, ['genetic_quirk', 'sensory_trait'], '1.8 billion photic sneezers step out of dark movie theaters and immediately salute the sun.', { aliases: ['photic sneeze', 'achoo', 'sunlight sneeze'], icebreaker: true }),
  trait('cilantro_soapy', 'Cilantro tastes like dish soap to me', 'Cilantro = soap', '🌿', 'genetics_physiology', 0.12, ['genetic_quirk', 'sensory_trait'], 'Thank your OR6A2 olfactory receptor gene — shared with roughly a billion taco skeptics.', { aliases: ['coriander soap', 'hates cilantro'], icebreaker: true }),
  trait('green_eyes', 'I have naturally green eyes', 'Green eyes', '👁️', 'genetics_physiology', 0.02, ['genetic_quirk'], '166 million humans carry the world’s rarest major iris pigment.', { aliases: ['emerald eyes'], exclusiveGroup: 'eye_color' }),
  trait('blue_eyes', 'I have naturally blue eyes', 'Blue eyes', '👁️', 'genetics_physiology', 0.085, ['genetic_quirk'], '705 million humans trace that Rayleigh-scattering iris mutation back ~10,000 years.', { aliases: ['blue iris'], exclusiveGroup: 'eye_color' }),
  trait('hazel_amber_eyes', 'I have hazel or amber eyes', 'Hazel / amber eyes', '👁️', 'genetics_physiology', 0.05, ['genetic_quirk'], '415 million people have eyes that change color depending on the lighting and their sweater.', { aliases: ['hazel eyes', 'amber eyes'], exclusiveGroup: 'eye_color' }),
  trait('heterochromia', 'I have heterochromia (two different-colored eyes)', 'Heterochromia', '👀', 'genetics_physiology', 0.0008, ['genetic_quirk'], '6.6 million humans rolled two different iris presets on character creation.', { aliases: ['sectoral heterochromia', 'different colored eyes'], exclusiveGroup: 'eye_color' }),
  trait('natural_red_hair', 'I have natural red or auburn hair', 'Natural redhead', '🦊', 'genetics_physiology', 0.015, ['genetic_quirk'], '125 million MC1R carriers worldwide — extra sunscreen and extra anesthesia required.', { aliases: ['ginger', 'redhead', 'mc1r'] }),
  trait('identical_twin', 'I am an identical twin', 'Identical twin', '👯', 'genetics_physiology', 0.0035, ['genetic_quirk', 'family_structure'], '29 million humans walk around knowing an actual genetic clone is already out there.', { aliases: ['monozygotic twin'], subsumes: ['is_a_twin'] }),
  trait('is_a_twin', 'I am a twin (fraternal or identical)', 'Is a twin', '👯', 'genetics_physiology', 0.012, ['genetic_quirk', 'family_structure'], '100 million twins have shared birthday cakes since day zero.', { aliases: ['fraternal twin', 'dizygotic'] }),
  trait('triplet_or_higher', 'I am a triplet or higher-order multiple', 'Triplet+', '👶', 'genetics_physiology', 0.00015, ['genetic_quirk', 'family_structure'], '1.25 million humans arrived on Earth as a pre-packaged trio or quartet.', { aliases: ['triplet', 'quadruplet'], subsumes: ['is_a_twin'] }),
  trait('colorblind', 'I have red-green or blue-yellow color blindness', 'Colorblind', '🎨', 'genetics_physiology', 0.045, ['genetic_quirk', 'sensory_trait'], '373 million humans stare suspiciously at Ishihara dot circles.', { aliases: ['deuteranopia', 'protanopia', 'color deficient'] }),
  trait('perfect_pitch', 'I have absolute (perfect) musical pitch', 'Perfect pitch', '🎵', 'genetics_physiology', 0.0004, ['sensory_trait', 'musical', 'genetic_quirk'], '3.3 million humans hear the microwave beep and immediately note it is a slightly flat B-natural.', { aliases: ['absolute pitch'] }),
  trait('synesthesia', 'I experience synesthesia (blended senses)', 'Synesthete', '🌈', 'genetics_physiology', 0.022, ['sensory_trait', 'genetic_quirk'], '182 million humans are quietly convinced that Thursday is purple and the number 7 is sharp.', { aliases: ['grapheme color', 'sees music'] }),
  trait('aphantasia', 'I have aphantasia (no voluntary visual mind’s eye)', 'Has aphantasia', '🧠', 'genetics_physiology', 0.028, ['sensory_trait', 'genetic_quirk'], '232 million people realized "picture a beach" wasn’t just a metaphor for everyone else.', { aliases: ['blind minds eye', 'cannot visualize'] }),
  trait('can_wiggle_ears', 'I can wiggle my ears independently without touching them', 'Wiggles ears', '👂', 'genetics_physiology', 0.14, ['genetic_quirk'], '1.16 billion humans retained functional auricularis muscles from distant mammalian ancestors.', { aliases: ['ear wiggler'] }),
  trait('gleeking_on_command', 'I can gleek on command', 'Gleeks on command', '💦', 'genetics_physiology', 0.012, ['genetic_quirk'], '100 million people discovered this unsettling sublingual salivary party trick in middle school.', { aliases: ['gleek'] }),
  trait('hitchhikers_thumb', 'I have a 50°+ hypermobile hitchhiker’s thumb', 'Hitchhiker’s thumb', '👍', 'genetics_physiology', 0.24, ['genetic_quirk'], 'Nearly 2 billion thumbs bend backward at a slightly alarming geometric angle.', { aliases: ['bendy thumb', 'distal hyperextensibility'] }),
  trait('missing_wisdom_teeth', 'I was born missing at least one wisdom tooth', 'Born without wisdom teeth', '🦷', 'genetics_physiology', 0.22, ['genetic_quirk'], '1.8 billion humans skipped at least part of oral surgery thanks to evolutionary jaw shrinkage.', { aliases: ['agenesis wisdom teeth', 'no wisdom teeth'] }),
  trait('extra_tooth_rib', 'I was born with a supernumerary tooth or cervical rib', 'Extra tooth or rib', '🦴', 'genetics_physiology', 0.015, ['genetic_quirk', 'medical_history'], '124 million humans brought spare parts straight from embryology.', { aliases: ['hyperdontia', 'extra rib'] }),
  trait('single_palmar_crease', 'I have a single transverse palmar crease on one palm', 'Single palmar crease', '🖐️', 'genetics_physiology', 0.015, ['genetic_quirk'], '124 million humans have one clean horizontal line straight across the palm.', { aliases: ['simian crease'] }),
  trait('preauricular_pit', 'I have a tiny congenital pinhole beside my outer ear', 'Preauricular ear pit', '👂', 'genetics_physiology', 0.009, ['genetic_quirk'], '75 million humans carry that harmless gill-arch souvenir right above the tragus.', { aliases: ['ear pit', 'ear sinus'] }),
  trait('asparagus_anosmia_detector', 'I can immediately smell the asparagus metabolite', 'Smells asparagus trait', '🌱', 'genetics_physiology', 0.40, ['genetic_quirk', 'sensory_trait'], '3.3 billion noses catch methanethiol instantly; the rest blissfully think nothing happened.', { aliases: ['asparagus smell'] }),
  trait('caffeine_fast_sleeper', 'I can drink espresso at 9 PM and fall right asleep', 'Immune to late espresso', '☕', 'genetics_physiology', 0.08, ['genetic_quirk', 'caffeine_habit', 'sleep_habit'], '660 million ultra-rapid CYP1A2 metabolizers treat nightcaps and cortados interchangeably.', { aliases: ['caffeine immunity', 'adhd coffee sleep'] }),
  trait('asian_flush_aldh2', 'Half a drink turns my face bright red (ALDH2 trait)', 'Alcohol flush trait', '🍷', 'genetics_physiology', 0.08, ['genetic_quirk'], '664 million humans carry the ALDH2 variant that turns one sip of beer into an instant blush.', { aliases: ['alcohol flush', 'asian glow'] }),
  trait('supertaster', 'I am a bitter-compound supertaster (PROP / PTC)', 'Bitter supertaster', '👅', 'genetics_physiology', 0.25, ['genetic_quirk', 'sensory_trait'], '2.1 billion dense-papillae tongues detect trace bitterness from a mile away.', { aliases: ['ptc taster', 'tas2r38'] }),
  trait('short_sleeper_natural', 'I wake up fully rested on 5.5 hours of sleep with no alarm', 'Natural short sleeper', '⏰', 'genetics_physiology', 0.012, ['sleep_habit', 'genetic_quirk'], '100 million people are quietly envied by the exhausted 98.8% majority.', { aliases: ['dec2 gene', 'sleeps 5 hours'] }),
  trait('vivid_lucid_dreamer', 'I lucid dream regularly and can steer the plot', 'Frequent lucid dreamer', '🌙', 'genetics_physiology', 0.035, ['sleep_habit', 'sensory_trait'], '290 million sleepers realize they are dreaming and immediately decide to fly.', { aliases: ['lucid dreaming'] }),
  trait('goosebumps_on_command', 'I can give myself goosebumps voluntarily (frisson control)', 'Voluntary goosebumps', '⚡', 'genetics_physiology', 0.0015, ['genetic_quirk', 'sensory_trait'], 'Only ~12.5 million humans consciously command their own autonomic piloerection.', { aliases: ['voluntary piloerection'] }),
  trait('blood_universal_donor', 'I am an O-negative universal blood donor', 'O-Negative donor', '🩸', 'genetics_physiology', 0.014, ['genetic_quirk'], '116 million humans get polite phone calls from blood banks on cooldown.', { aliases: ['o negative', 'universal donor'], exclusiveGroup: 'blood_type' }),
  trait('webbed_toes', 'I have partial webbing between two toes (syndactyly)', 'Webbed toes', '🦶', 'genetics_physiology', 0.0005, ['genetic_quirk'], '4.1 million humans arrived slightly over-engineered for freestyle kick sets.', { aliases: ['syndactyly', 'twin toes'] }),
  trait('double_crown_hair', 'I have a double hair whorl (double crown)', 'Double hair crown', '🌀', 'genetics_physiology', 0.05, ['genetic_quirk'], '415 million people have frustrated barbers with opposing cowlicks since childhood.', { aliases: ['double cowlick', 'two hair whorls'] }),

  // --- 3. SKILLS & PRACTICAL CRAFT (34) ---
  trait('drives_manual', 'I can smoothly hill-start a manual stick-shift car', 'Drives manual / stick', '🕹️', 'skills_craft', 0.18, ['automotive_mech'], '1.5 billion drivers worldwide still work three pedals without rolling into the bumper behind them.', { aliases: ['stick shift', 'manual transmission', 'clutch'], icebreaker: true }),
  trait('writes_software', 'I write software or code', 'Writes code', '💻', 'skills_craft', 0.006, ['coding_tech'], 'Roughly 50 million humans argue professionally or recreationally with missing semicolons.', { aliases: ['programmer', 'software engineer', 'developer', 'coder'] }),
  trait('indie_game_dev', 'I have shipped an indie video game', 'Indie game developer', '🎮', 'skills_craft', 0.00012, ['coding_tech', 'visual_arts'], 'About 1 million brave souls actually finished a game instead of starting 14 new prototypes.', { aliases: ['gamedev', 'game developer', 'godot', 'unity dev'], subsumes: ['writes_software'] }),
  trait('uses_vim_keybindings', 'I use Vim or Neovim keybindings voluntarily', 'Uses Vim / Neovim', '⌨️', 'skills_craft', 0.0007, ['coding_tech'], '5.8 million humans learned how to exit `:wq` and made it part of their personality.', { aliases: ['neovim', 'vimrc', 'modal editing'], subsumes: ['writes_software'] }),
  trait('linux_daily_driver', 'I run desktop Linux as my primary daily OS', 'Desktop Linux user', '🐧', 'skills_craft', 0.0018, ['coding_tech'], '15 million people are one kernel update away from fixing Bluetooth audio forever.', { aliases: ['arch linux', 'ubuntu desktop', 'nixos'] }),
  trait('solves_rubiks_cube', 'I can solve a 3×3 Rubik’s Cube from memory', 'Solves Rubik’s Cube', '🧊', 'skills_craft', 0.058, ['daily_puzzle_games', 'indoor_hobby'], '480 million cubers have algorithms burned into muscle memory.', { aliases: ['rubiks cube', 'cfop'] }),
  trait('speedcuber_sub30', 'I can solve a 3×3 Rubik’s Cube in under 30 seconds', 'Sub-30s speedcuber', '⏱️', 'skills_craft', 0.0012, ['daily_puzzle_games', 'indoor_hobby'], '10 million pairs of thumbs blur through F2L, OLL, and PLL before bystanders blink.', { aliases: ['speedcubing', 'sub 30 cube'], subsumes: ['solves_rubiks_cube'] }),
  trait('juggles_three_balls', 'I can juggle three balls cleanly for 30+ catches', 'Can juggle 3 balls', '🤹', 'skills_craft', 0.042, ['athletic', 'indoor_hobby'], '350 million humans can rescue falling citrus fruit in the produce aisle.', { aliases: ['juggling', 'cascade juggle'] }),
  trait('juggles_four_plus', 'I can juggle 4+ balls or 3 juggling clubs', 'Juggles 4+ or clubs', '🤹', 'skills_craft', 0.0015, ['athletic', 'indoor_hobby'], '12.5 million dedicated jugglers moved well past rainy-afternoon basics.', { aliases: ['juggling clubs', 'four ball juggle'], subsumes: ['juggles_three_balls'] }),
  trait('wrenches_own_bike', 'I tune derailleurs and bleed brakes on my own bicycle', 'Wrenches own bike', '🔧', 'skills_craft', 0.025, ['cycling_wheeled', 'automotive_mech', 'craft_maker'], '207 million home mechanics keep Park Tool hex keys within arm’s reach.', { aliases: ['bike mechanic', 'fixes bicycles'] }),
  trait('changes_own_car_oil', 'I change my own car’s oil and brake pads', 'DIY car maintenance', '🛞', 'skills_craft', 0.032, ['automotive_mech', 'craft_maker'], '265 million driveway mechanics own jack stands and a suspiciously stained sweatshirt.', { aliases: ['brake job', 'oil change diy', 'wrenching'] }),
  trait('solders_electronics', 'I solder electronics or custom PCBs', 'Solders electronics', '🔌', 'skills_craft', 0.0055, ['craft_maker', 'coding_tech'], '45 million makers know the smell of rosin flux in the morning.', { aliases: ['soldering iron', 'pcb design', 'arduino'] }),
  trait('builds_custom_keyboards', 'I lube switches or build custom mechanical keyboards', 'Custom mech keyboards', '⌨️', 'skills_craft', 0.00045, ['craft_maker', 'coding_tech', 'collectors'], '3.7 million humans have strong opinions on gasket mounts and thock vs. clack.', { aliases: ['mechanical keyboard', 'cherry mx', 'keycaps'] }),
  trait('woodworker_joinery', 'I cut mortise-and-tenon or dovetail joints in wood', 'Fine woodworker', '🪚', 'skills_craft', 0.0038, ['craft_maker'], '31.5 million woodworkers own more bar clamps than strictly reasonable.', { aliases: ['woodworking', 'hand planes', 'cabinetry', 'dovetails'] }),
  trait('welds_metal', 'I know how to MIG, TIG, or stick weld metal', 'Welds metal', '👨‍🏭', 'skills_craft', 0.0065, ['craft_maker', 'automotive_mech'], '54 million humans can fuse steel behind an auto-darkening hood.', { aliases: ['welding', 'tig welder', 'mig welder'] }),
  trait('knits_or_crochets', 'I knit or crochet wearable garments', 'Knits or crochets', '🧶', 'skills_craft', 0.048, ['craft_maker', 'indoor_hobby'], '400 million makers maintain a yarn stash classified as "strategic reserves."', { aliases: ['knitting', 'crocheting', 'yarn'] }),
  trait('sews_own_clothes', 'I sew tailored clothing on a sewing machine', 'Sews own clothing', '🧵', 'skills_craft', 0.028, ['craft_maker', 'visual_arts'], '232 million humans guard their fabric scissors from paper-cutting civilians.', { aliases: ['garment sewing', 'seamstress', 'tailoring'] }),
  trait('throws_pottery_wheel', 'I center clay and throw pottery on a wheel', 'Wheel-thrown pottery', '🏺', 'skills_craft', 0.0022, ['craft_maker', 'visual_arts'], '18 million ceramicists have clay permanently lodged under at least one thumbnail.', { aliases: ['ceramics', 'potter', 'kiln'] }),
  trait('reads_sheet_music', 'I can sight-read standard musical notation', 'Sight-reads music', '🎼', 'skills_craft', 0.036, ['musical'], '300 million musicians read treble or bass clef like a second alphabet.', { aliases: ['sheet music', 'sight reading'] }),
  trait('whistles_loud_fingers', 'I can cab-whistle piercingly loud with my fingers', 'Two-finger whistle', '😗', 'skills_craft', 0.045, ['sensory_trait'], '373 million humans can cut straight across stadium crowd noise on command.', { aliases: ['wolf whistle', 'finger whistle'] }),
  trait('touch_types_100wpm', 'I touch-type faster than 100 words per minute', 'Types 100+ WPM', '⚡', 'skills_craft', 0.0045, ['coding_tech'], '37 million speed typists turn quiet cafe tables into tiny percussion concerts.', { aliases: ['monkeytype', 'fast typist', '100 wpm'] }),
  trait('calligraphy_fountain_pen', 'I practice calligraphy or tune fountain pen nibs', 'Fountain pen / calligraphy', '🖋️', 'skills_craft', 0.0032, ['visual_arts', 'vintage_gear', 'collectors'], '26.5 million ink enthusiasts have strong feelings about 80gsm paper bleed-through.', { aliases: ['fountain pens', 'hand lettering'] }),
  trait('Amateur_ham_radio', 'I hold a licensed amateur (ham) radio callsign', 'Licensed ham radio op', '📻', 'skills_craft', 0.00038, ['vintage_gear', 'coding_tech'], 'About 3.1 million licensed operators can bounce HF signals off the ionosphere.', { aliases: ['ham radio', 'callsign', 'arrl'] }),
  trait('private_pilot_license', 'I hold a private or commercial pilot license', 'Licensed pilot', '🛩️', 'skills_craft', 0.00022, ['automotive_mech', 'world_traveler'], '1.8 million humans are legally trusted to land an airplane in a crosswind.', { aliases: ['ppl', 'pilot', 'flies airplanes'] }),
  trait('sails_sailboat', 'I can skipper and tack a keelboat or dinghy', 'Skippers a sailboat', '⛵', 'skills_craft', 0.0032, ['water_sport', 'outdoor_mountain'], '26.5 million sailors instinctively check flags on buildings to read apparent wind.', { aliases: ['sailing', 'sailor'] }),
  trait('backs_up_trailer', 'I can back up a hitched trailer on the first try', 'Backs up a trailer', '🛻', 'skills_craft', 0.035, ['automotive_mech'], '290 million drivers steer opposite at the bottom of the wheel without jackknifing.', { aliases: ['boat ramp', 'trailer hitch'] }),
  trait('picks_pin_locks', 'I practice recreational locksport (pin-tumbler picking)', 'Locksport picker', '🔐', 'skills_craft', 0.0006, ['indoor_hobby', 'craft_maker'], '5 million hobbyists hear "click out of two, three is binding" in their sleep.', { aliases: ['lockpicking', 'locksport'] }),
  trait('reads_morse_code', 'I can copy or tap International Morse Code from memory', 'Knows Morse code', '📡', 'skills_craft', 0.0009, ['vintage_gear', 'polyglot'], '7.5 million humans still speak fluent dit-dah.', { aliases: ['cw morse', 'morse code'] }),
  trait('sharpens_knives_whetstone', 'I sharpen kitchen knives freehand on waterstones', 'Whetstone sharpener', '🔪', 'skills_craft', 0.011, ['culinary_diy', 'craft_maker'], '91 million home cooks quietly wince watching someone slice tomatoes on a glass cutting board.', { aliases: ['whetstone', 'knife sharpening'] }),
  trait('splits_firewood_axe', 'I split firewood cleanly with a maul or axe', 'Splits firewood', '🪓', 'skills_craft', 0.045, ['outdoor_mountain', 'home_energy_diy'], '373 million humans stack cords of seasoned hardwood like geometric art.', { aliases: ['chops wood', 'wood stove'] }),
  trait('develops_film_darkroom', 'I shoot and develop analog 35mm or medium-format film', 'Develops analog film', '🎞️', 'skills_craft', 0.00055, ['visual_arts', 'vintage_gear'], '4.5 million photographers voluntarily spend weekends in pitch-black rooms smelling fixer.', { aliases: ['film photography', 'darkroom', 'c41', 'black and white film'] }),
  trait('3d_prints_cad', 'I model parts in CAD and 3D-print functional fixes', 'CAD + 3D printing', '🖨️', 'skills_craft', 0.0016, ['craft_maker', 'coding_tech'], '13 million makers spend 4 hours designing a bracket to replace a $0.50 plastic clip.', { aliases: ['3d printer', 'fusion 360', 'openscad', 'bambu'] }),
  trait('cpr_first_aid_certified', 'I hold an active CPR / wilderness first-aid certification', 'CPR / First-Aid cert', '🩺', 'skills_craft', 0.038, ['medical_history'], '315 million humans have compressed a plastic mannequin chest to the beat of "Stayin’ Alive."', { aliases: ['wfr', 'wfa', 'bls certified'] }),
  trait('folds_origami_memory', 'I fold complex multi-step origami without instructions', 'Memory origami folder', '🦢', 'skills_craft', 0.0085, ['craft_maker', 'visual_arts'], '70 million humans turn stray restaurant receipts into miniature paper cranes.', { aliases: ['origami'] }),

  // --- 4. NICHE HOBBIES & OBSESSIONS (34) ---
  trait('grows_carnivorous_plants', 'I grow carnivorous plants (pitcher plants, sundews, flytraps)', 'Carnivorous plant grower', '🪴', 'niche_hobbies', 0.00018, ['horticulture', 'indoor_hobby'], '1.5 million humans buy distilled water exclusively to pamper bug-eating bog plants.', { aliases: ['nepenthes', 'sarracenia', 'venus flytrap', 'sundew'], subsumes: ['keeps_houseplants'] }),
  trait('keeps_houseplants', 'I care for 10+ living houseplants', '10+ houseplants', '🌿', 'niche_hobbies', 0.042, ['horticulture', 'indoor_hobby'], '350 million indoor jungle keepers negotiate window-sill real estate like Manhattan brokers.', { aliases: ['plant parent', 'monstera', 'houseplants'] }),
  trait('grows_bonsai', 'I wire, prune, and overwinter bonsai trees', 'Bonsai keeper', '🌳', 'niche_hobbies', 0.0008, ['horticulture', 'visual_arts'], '6.6 million patient humans work on art projects measured in decades.', { aliases: ['bonsai'] }),
  trait('saves_heirloom_seeds', 'I save heirloom vegetable seeds year-to-year', 'Heirloom seed saver', '🍅', 'niche_hobbies', 0.0045, ['horticulture', 'culinary_diy'], '37 million gardeners label tiny paper envelopes like botanical librarians.', { aliases: ['vegetable garden', 'seed saving'] }),
  trait('sourdough_starter_keeper', 'I keep an active sourdough starter alive in my kitchen', 'Sourdough keeper', '🍞', 'niche_hobbies', 0.008, ['culinary_diy', 'indoor_hobby'], '66 million bakers have named a jar of bubbling wild yeast and scheduled weekends around it.', { aliases: ['sourdough', 'levain', 'bread baking'] }),
  trait('home_fermenter_pickler', 'I ferment or pickle homemade condiments (kimchi, kraut, relish, hot sauce)', 'Home pickler / fermenter', '🥒', 'niche_hobbies', 0.022, ['culinary_diy'], '182 million kitchens worldwide keep Mason jars quietly burping on the counter.', { aliases: ['fermentation', 'pickling', 'kimchi', 'kombucha', 'sauerkraut'] }),
  trait('makes_artisan_hot_sauce', 'I make my own small-batch chili relish or hot sauce', 'Makes custom hot sauce', '🌶️', 'niche_hobbies', 0.0015, ['culinary_diy', 'spicy_palate'], '12.5 million pepper alchemists wear nitrile gloves while blending homegrown chilies.', { aliases: ['jalapeno relish', 'homemade hot sauce', 'chili relish'], subsumes: ['home_fermenter_pickler'] }),
  trait('homebrewer_beer_cider', 'I brew my own beer, cider, or mead at home', 'Homebrewer', '🍺', 'niche_hobbies', 0.0018, ['culinary_diy', 'craft_maker'], '15 million garage brewers spend 80% of brew day sanitizing buckets.', { aliases: ['homebrewing', 'mead maker', 'all grain'] }),
  trait('roasts_own_coffee', 'I roast raw green coffee beans at home', 'Home coffee roaster', '🫘', 'niche_hobbies', 0.00028, ['culinary_diy', 'caffeine_habit'], '2.3 million humans listen closely for "first crack" while filling the porch with chaff.', { aliases: ['green coffee', 'coffee roasting'] }),
  trait('birdwatcher_life_list', 'I keep a birding life list (eBird or notebook)', 'Life-list birder', '🔭', 'niche_hobbies', 0.0038, ['outdoor_mountain', 'collectors'], '31.5 million birders stop mid-sentence whenever an unfamiliar warbler chips overhead.', { aliases: ['birdwatching', 'birder', 'ebird'], subsumes: ['casual_birdwatcher'] }),
  trait('casual_birdwatcher', 'I own binoculars specifically for watching birds/wildlife', 'Birdwatcher', '🦉', 'niche_hobbies', 0.014, ['outdoor_mountain'], '116 million people hit a certain Tuesday afternoon and suddenly care deeply about woodpeckers.', { aliases: ['birding', 'binoculars'] }),
  trait('beekeeper', 'I keep honeybee hives', 'Beekeeper', '🐝', 'niche_hobbies', 0.00085, ['horticulture', 'outdoor_mountain'], '7 million apiarists casually inspect 40,000 stinging roommates on sunny afternoons.', { aliases: ['apiarist', 'beekeeping', 'honeybees'] }),
  trait('forages_wild_mushrooms', 'I forage and spore-print wild edible mushrooms', 'Wild mushroom forager', '🍄', 'niche_hobbies', 0.0035, ['outdoor_mountain', 'culinary_diy'], '29 million mycophiles guard their chanterelle GPS coordinates more closely than their bank PIN.', { aliases: ['mycology', 'chanterelles', 'morels', 'foraging'] }),
  trait('backyard_astronomer', 'I own a telescope and align it on deep-sky objects', 'Backyard astronomer', '🔭', 'niche_hobbies', 0.0019, ['outdoor_mountain', 'vintage_gear'], '15.8 million stargazers resent streetlights and full moons with equal passion.', { aliases: ['dobsonian', 'astrophotography', 'stargazing'] }),
  trait('collects_vinyl_records', 'I own 50+ vinyl records and a dedicated turntable', 'Vinyl record collector', '💿', 'niche_hobbies', 0.0065, ['collectors', 'live_music_audio', 'vintage_gear'], '54 million listeners enjoy standing up every 22 minutes to flip a 12-inch disc.', { aliases: ['vinyl', 'record player', 'turntable', 'audiophile'] }),
  trait('paints_miniatures', 'I paint tabletop miniatures (Warhammer, D&D, scale models)', 'Miniature painter', '🖌️', 'niche_hobbies', 0.0011, ['visual_arts', 'board_tabletop', 'indoor_hobby'], '9.1 million hobbyists maintain a majestic "pile of unpainted gray plastic" for retirement.', { aliases: ['warhammer', 'citadel paint', 'gunpla', 'scale models'] }),
  trait('dungeon_master', 'I have run a multi-session tabletop RPG campaign as GM / DM', 'Tabletop Game Master', '🎲', 'niche_hobbies', 0.0016, ['board_tabletop', 'indoor_hobby'], '13.3 million Game Masters have survived the ultimate boss fight: scheduling five adults.', { aliases: ['dungeon master', 'dnd', 'dungeons and dragons', 'ttrpg'] }),
  trait('modern_board_game_shelf', 'I own 25+ modern strategy board games', '25+ strategy board games', '♟️', 'niche_hobbies', 0.0024, ['board_tabletop', 'collectors', 'indoor_hobby'], '20 million Kallax shelves are bowing slightly under punchboard and wooden resource cubes.', { aliases: ['catan', 'wingspan', 'boardgamegeek', 'eurogames'] }),
  trait('rated_chess_player', 'I play rated rapid/blitz chess above 1200 Elo', '1200+ Elo chess player', '♞', 'niche_hobbies', 0.0042, ['board_tabletop', 'daily_puzzle_games'], '35 million players spot knight forks right before blundering their queen one move later.', { aliases: ['chess.com', 'lichess', 'fide chess'] }),
  trait('geocacher', 'I hunt hidden geocaches in the wild', 'Active geocacher', '🧭', 'niche_hobbies', 0.00075, ['outdoor_mountain', 'collectors'], '6.2 million people look mildly suspicious poking under park benches for magnetic nano-tubes.', { aliases: ['geocaching'] }),
  trait('aquascaper_planted_tank', 'I maintain a live planted freshwater or reef aquarium', 'Aquascaper / reef tank', '🐠', 'niche_hobbies', 0.0021, ['horticulture', 'pet_owner', 'indoor_hobby'], '17.4 million aquarists test water nitrates more regularly than their own cholesterol.', { aliases: ['aquarium', 'aquascaping', 'reef tank', 'fishkeeper'] }),
  trait('restores_vintage_watches', 'I collect or service mechanical wristwatches', 'Mechanical watch nerd', '⌚', 'niche_hobbies', 0.0019, ['vintage_gear', 'collectors', 'automotive_mech'], '15.8 million enthusiasts pay extra for tiny springs that lose four seconds a day.', { aliases: ['horology', 'automatic watch'] }),
  trait('lego_adult_moc', 'I design custom LEGO builds (AFOL) as an adult', 'Adult LEGO builder', '🧱', 'niche_hobbies', 0.0028, ['craft_maker', 'collectors', 'indoor_hobby'], '23 million adults sort ABS bricks by part number into tiny plastic drawers.', { aliases: ['afol', 'lego moc'] }),
  trait('composts_worms', 'I run a backyard compost pile or indoor worm bin', 'Composter / vermiculture', '🪱', 'niche_hobbies', 0.016, ['horticulture', 'home_energy_diy'], '133 million humans get genuinely excited about carbon-to-nitrogen ratios.', { aliases: ['vermicompost', 'composting'] }),
  trait('collects_rocks_minerals', 'I rockhound or keep a labeled mineral specimen shelf', 'Rockhound / mineral shelf', '🪨', 'niche_hobbies', 0.0034, ['collectors', 'outdoor_mountain'], '28 million pockets come home from every beach and canyon noticeably heavier.', { aliases: ['geology', 'agates', 'fossils', 'crystals'] }),
  trait('metal_detectorist', 'I sweep beaches or fields with a metal detector', 'Metal detectorist', '🪙', 'niche_hobbies', 0.00048, ['collectors', 'outdoor_mountain'], '4 million optimists dig 99 pull-tabs in patient pursuit of one 19th-century coin.', { aliases: ['metal detecting'] }),
  trait('fly_ties_own_flies', 'I tie my own feathers-and-thread flies for fly fishing', 'Ties own fishing flies', '🪝', 'niche_hobbies', 0.00052, ['water_sport', 'outdoor_mountain', 'craft_maker'], '4.3 million anglers try to outsmart trout with tiny hand-wrapped insect disguises.', { aliases: ['fly tying', 'fly fishing'] }),
  trait('keeps_weather_station', 'I run a personal backyard weather station or rain gauge', 'Backyard weather station', '🌡️', 'niche_hobbies', 0.0014, ['home_energy_diy', 'outdoor_mountain'], '11.6 million hyper-local meteorologists verify whether that storm was *actually* 0.84 inches.', { aliases: ['rain gauge', 'ambient weather', 'barometer'] }),
  trait('speed_puzzler_jigsaw', 'I complete 1,000-piece jigsaw puzzles regularly', '1,000-piece jigsaw solver', '🧩', 'niche_hobbies', 0.019, ['indoor_hobby', 'daily_puzzle_games'], '158 million dining tables are temporarily off-limits until the sky pieces cooperate.', { aliases: ['jigsaw puzzle'] }),
  trait('homelab_self_hoster', 'I run a home server / NAS (Plex, Home Assistant, Pi-hole)', 'Runs a homelab / NAS', '🖥️', 'niche_hobbies', 0.00065, ['coding_tech', 'home_energy_diy'], '5.4 million humans serve as unpaid 24/7 IT sysadmins for their own living rooms.', { aliases: ['selfhosted', 'home assistant', 'raspberry pi', 'synology'] }),
  trait('soap_candle_maker', 'I make cold-process soap or hand-poured beeswax candles', 'Makes soap or candles', '🕯️', 'niche_hobbies', 0.0022, ['craft_maker', 'indoor_hobby'], '18 million makers weigh lye on digital gram scales without blinking.', { aliases: ['soapmaking', 'candlemaking'] }),
  trait('magic_card_sleight', 'I perform sleight-of-hand card tricks cleanly', 'Card sleight-of-hand', '🃏', 'niche_hobbies', 0.0018, ['indoor_hobby'], '15 million humans practice double lifts in front of bathroom mirrors.', { aliases: ['cardistry', 'close up magic'] }),
  trait('genealogy_archivist', 'I have traced my family tree back 5+ generations', '5-gen genealogist', '📜', 'niche_hobbies', 0.0055, ['collectors', 'family_structure'], '45.6 million family historians spend evenings deciphering 1890s cursive census ledgers.', { aliases: ['genealogy', 'ancestry'] }),
  trait('kite_stunt_flyer', 'I fly dual-line stunt kites or power kites', 'Dual-line stunt kiter', '🪁', 'niche_hobbies', 0.0006, ['outdoor_mountain', 'athletic'], '5 million humans look forward to 18-knot coastal gusts.', { aliases: ['stunt kite', 'sport kite'] }),

  // --- 5. DAILY QUIRKS & HABITS (32) ---
  trait('concert_hifi_earplugs', 'I wear high-fidelity earplugs to concerts and loud bars', 'Wears concert earplugs', '🎧', 'daily_quirks', 0.009, ['live_music_audio', 'sensory_trait'], '75 million music lovers plan on still hearing cymbals past age 45.', { aliases: ['loop earplugs', 'earasers', 'etymotic'] }),
  trait('inbox_zero', 'I maintain strict Inbox Zero (<5 unread emails)', 'Maintains Inbox Zero', '📬', 'daily_quirks', 0.018, ['coding_tech'], '150 million ruthlessly organized humans recoil visibly at a "43,812 unread" badge.', { aliases: ['zero unread emails'], icebreaker: true }),
  trait('wakes_before_6am', 'I naturally or habitually wake up before 6:00 AM', 'Wakes before 6 AM', '🌅', 'daily_quirks', 0.06, ['sleep_habit'], '500 million early risers have already lived an entire subplot before brunch.', { aliases: ['5am club', 'early bird', 'morning person'], icebreaker: true }),
  trait('night_owl_2am', 'I regularly stay awake past 2:00 AM by choice', 'Up past 2 AM', '🦉', 'daily_quirks', 0.055, ['sleep_habit'], '456 million night owls do their sharpest thinking while the neighborhood sleeps.', { aliases: ['insomniac', 'late night'] }),
  trait('subtitles_always_on', 'I watch TV and movies with subtitles on even in my native language', 'Subtitles always on', '📺', 'daily_quirks', 0.16, ['sensory_trait'], '1.33 billion viewers refuse to trust modern movie sound mixing.', { aliases: ['closed captions'] }),
  trait('podcasts_at_1_5x', 'I listen to podcasts or audiobooks at 1.5×–2× speed', '1.5×+ audio listener', '⏩', 'daily_quirks', 0.019, ['book_reader'], '158 million humans now find normal 1.0× human speech suspiciously slow.', { aliases: ['2x speed', 'audiobook speed'] }),
  trait('phone_permanently_silent', 'My phone ringer has been on silent/vibrate for years', 'Phone permanently silent', '🔕', 'daily_quirks', 0.19, ['sensory_trait'], '1.58 billion humans treat an audible ringtone in public like a fire alarm.', { aliases: ['do not disturb', 'ringer off'] }),
  trait('cold_showers_daily', 'I take cold showers year-round on purpose', 'Cold-shower regular', '🚿', 'daily_quirks', 0.0085, ['athletic', 'sleep_habit'], '70 million humans start the morning with voluntary Arctic shock therapy.', { aliases: ['cold plunge', 'ice bath'] }),
  trait('sleeps_with_fan_winter', 'I run a box or ceiling fan for sleep even in dead winter', 'Winter sleep-fan loyalist', '🪭', 'daily_quirks', 0.065, ['sleep_habit', 'sensory_trait'], '540 million sleepers require white noise and moving air regardless of frost warnings.', { aliases: ['white noise fan'] }),
  trait('backs_into_parking', 'I almost always reverse-park into parking spaces', 'Always reverse-parks', '🚗', 'daily_quirks', 0.045, ['automotive_mech'], '373 million drivers invest 12 seconds on arrival for a tactical exit later.', { aliases: ['backs into parking'] }),
  trait('carries_pocket_notebook', 'I carry a physical pocket notebook and pen everywhere', 'Carries pocket notebook', '📓', 'daily_quirks', 0.012, ['book_reader', 'vintage_gear'], '100 million analog thinkers keep Field Notes or Moleskines in their back pocket.', { aliases: ['field notes', 'pocket memo'] }),
  trait('24_hour_clock_phone', 'My phone and computer clocks are set to 24-hour (military) time', 'Uses 24-hour clock', '🕒', 'daily_quirks', 0.14, ['world_traveler'], '1.16 billion people never accidentally set an alarm for 7:00 PM instead of 7:00 AM.', { aliases: ['military time'] }),
  trait('dark_mode_everything', 'I force Dark Mode on every single app and website', 'Strict Dark Mode user', '🌑', 'daily_quirks', 0.15, ['coding_tech', 'sensory_trait'], '1.24 billion retinas hiss softly whenever an unstyled white web page flashes open.', { aliases: ['night mode'] }),
  trait('never_uses_snooze', 'I never press the snooze button — feet hit the floor on alarm one', 'Zero-snooze riser', '⏰', 'daily_quirks', 0.095, ['sleep_habit'], '788 million decisive humans treat the first alarm as legally binding.', { aliases: ['no snooze'] }),
  trait('hangs_laundry_line', 'I air-dry almost all my clothes on a line or drying rack', 'Line-dries laundry', '👕', 'daily_quirks', 0.34, ['home_energy_diy'], 'Globally, 2.8 billion humans let the sun and breeze do what tumble dryers charge extra for.', { aliases: ['clothesline', 'air dry'] }),
  trait('makes_bed_daily', 'I make my bed neatly every single morning', 'Makes bed daily', '🛏️', 'daily_quirks', 0.28, ['sleep_habit'], '2.3 billion humans require crisp hospital corners before facing society.', { aliases: ['neat bed'] }),
  trait('unplugs_appliances', 'I unplug toasters and chargers when not actively using them', 'Unplugs idle appliances', '🔌', 'daily_quirks', 0.048, ['home_energy_diy'], '400 million vampire-wattage hunters patrol the kitchen outlets before bed.', { aliases: ['phantom power'] }),
  trait('reads_nutrition_ingredients', 'I read the full ingredient list on almost everything I buy', 'Reads every label', '🔍', 'daily_quirks', 0.075, ['dietary_restriction', 'culinary_diy'], '622 million grocery shoppers flip jars around before putting anything in the basket.', { aliases: ['ingredient checker'] }),
  trait('walks_10k_steps', 'I average 10,000+ steps per day year-round', '10,000+ daily steps', '🚶', 'daily_quirks', 0.085, ['athletic'], '705 million humans will pace their hallway at 11:52 PM just to close a digital ring.', { aliases: ['10k steps'] }),
  trait('reusable_chopsticks_expert', 'I eat snacks or salads with chopsticks to keep my fingers clean', 'Snack-chopstick tactician', '🥢', 'daily_quirks', 0.022, ['culinary_diy'], '182 million visionaries eat cheesy puffs with zero orange dust on their keyboard.', { aliases: ['cheetos chopsticks'] }),
  trait('avoids_hazy_ipas', 'I actively avoid hazy IPAs and order lagers, pilsners, or dark beers', 'Anti-Hazy-IPA orderer', '🍻', 'daily_quirks', 0.045, ['culinary_diy'], '373 million beer drinkers just want a crisp pilsner that doesn’t taste like lawn clippings.', { aliases: ['pilsner purist', 'hates ipa'] }),
  trait('arrives_airport_3hrs', 'I arrive at the airport 2.5 to 3+ hours early and feel zero shame', '3-hour-early flyer', '🛫', 'daily_quirks', 0.042, ['world_traveler'], '348 million calm travelers enjoy sitting peacefully at Gate B14 for 110 uninterrupted minutes.', { aliases: ['early to airport'] }),
  trait('power_naps_18min', 'I take timed 15–20 minute power naps and wake up sharp', '20-min power napper', '😴', 'daily_quirks', 0.052, ['sleep_habit'], '430 million humans reboot mid-afternoon without waking up confused in another decade.', { aliases: ['coffee nap', 'power nap'] }),
  trait('keeps_spreadsheet_life', 'I track personal habits, gear, or trips in custom spreadsheets', 'Personal life spreadsheet', '📊', 'daily_quirks', 0.014, ['coding_tech', 'collectors'], '116 million humans express love and vacation planning through conditional formatting.', { aliases: ['excel nerd', 'google sheets tracker'] }),
  trait('remembers_license_plates', 'I involuntarily memorize friends’ and neighbors’ license plates', 'Memorizes license plates', '🔢', 'daily_quirks', 0.011, ['sensory_trait'], '91 million pattern-spotted brains store random 7-character strings rent-free.', { aliases: ['number memory'] }),
  trait('writes_all_caps', 'I handwrite exclusively in neat block ALL-CAPS', 'Block ALL-CAPS handwriting', '📝', 'daily_quirks', 0.016, ['visual_arts'], '133 million architects, engineers, and dads write every grocery list like a blueprint.', { aliases: ['architect handwriting'] }),
  trait('eats_crust_first', 'I sometimes eat pizza crust-first or sandwich edges all the way around', 'Perimeter-first eater', '🍕', 'daily_quirks', 0.018, ['spicy_palate'], '150 million strategic eaters save the exact center bite for the grand finale.', { aliases: ['center bite last'] }),
  trait('zero_social_media', 'I have zero active personal accounts on Instagram, TikTok, or X', 'Off major social feeds', '📵', 'daily_quirks', 0.38, ['indoor_hobby'], 'Globally 3.15 billion humans are offline — though among web-game players, you are rare company.', { aliases: ['no instagram', 'no tiktok', 'offline'] }),
  trait('counts_stairs', 'I silently count steps whenever I walk up a staircase', 'Counts staircase steps', '🪜', 'daily_quirks', 0.024, ['sensory_trait'], '200 million humans know without looking that their home staircase has exactly 14 risers.', { aliases: ['counts steps'] }),
  trait('sets_thermostat_cold', 'I keep my bedroom under 65°F / 18°C for sleeping', 'Sub-65°F / 18°C sleeper', '❄️', 'daily_quirks', 0.055, ['sleep_habit'], '456 million humans hibernate beneath heavy duvets in a crisp walk-in refrigerator.', { aliases: ['cold bedroom'] }),
  trait('bookmarks_hundreds_tabs', 'I currently have 50+ browser tabs open across devices', '50+ open browser tabs', '🗂️', 'daily_quirks', 0.032, ['coding_tech'], '265 million optimistic researchers swear they are going to read that 2024 article this weekend.', { aliases: ['tab hoarder', '100 tabs'] }),
  trait('backs_up_321', 'I maintain a 3-2-1 backup rule (local + offsite + cloud)', '3-2-1 data backup', '💾', 'daily_quirks', 0.0014, ['coding_tech'], '11.6 million battle-hardened humans learned the hard way or refused to ever find out.', { aliases: ['offsite backup'] }),

  // --- 6. FOOD & PALATE (32) ---
  trait('drinks_coffee_daily', 'I drink coffee regularly', 'Drinks coffee', '☕', 'food_palate', 0.27, ['caffeine_habit'], 'You and 2.24 billion other mildly caffeinated humans are still crammed into the same room.', { aliases: ['coffee drinker', 'espresso'], icebreaker: true }),
  trait('drinks_black_coffee', 'I drink my coffee strictly black (zero milk, zero sugar)', 'Drinks coffee black', '☕', 'food_palate', 0.068, ['caffeine_habit'], '564 million purists want pure roasted bean water with nothing softening the blow.', { aliases: ['black coffee', 'americano', 'pour over'], subsumes: ['drinks_coffee_daily'] }),
  trait('weighs_coffee_grams', 'I weigh coffee beans to 0.1g on a scale every morning', 'Weighs coffee to 0.1g', '⚖️', 'food_palate', 0.0019, ['caffeine_habit', 'culinary_diy'], '15.8 million specialty-coffee chemists run a 1:16 pour-over lab before speaking to anyone.', { aliases: ['v60', 'chemex', 'single dose espresso'], subsumes: ['drinks_coffee_daily'] }),
  trait('zero_caffeine', 'I consume zero caffeine (no coffee, tea, soda, or energy drinks)', '100% caffeine-free', '💧', 'food_palate', 0.14, ['caffeine_habit', 'dietary_restriction'], '1.16 billion humans run strictly on unassisted endogenous ATP.', { aliases: ['no coffee', 'caffeine free'] }),
  trait('loose_leaf_tea', 'I steep loose-leaf tea at specific water temperatures', 'Temp-controlled loose tea', '🍵', 'food_palate', 0.032, ['caffeine_habit', 'culinary_diy'], '265 million tea steepers know 80°C sencha and 100°C oolong are entirely different planets.', { aliases: ['oolong', 'gongfu tea', 'matcha whisk'] }),
  trait('vegetarian', 'I follow a vegetarian diet', 'Vegetarian', '🥗', 'food_palate', 0.11, ['dietary_restriction'], '913 million vegetarians worldwide (heavily anchored in South Asia) skip meat every day.', { aliases: ['meat free', 'veggie'] }),
  trait('vegan', 'I eat a strictly 100% plant-based (vegan) diet', 'Vegan', '🌱', 'food_palate', 0.015, ['dietary_restriction'], '124 million vegans scan whey-powder traps in chip bags at warp speed.', { aliases: ['plant based'], subsumes: ['vegetarian'] }),
  trait('pescatarian', 'I am pescatarian (seafood + plants, no land meat)', 'Pescatarian', '🐟', 'food_palate', 0.028, ['dietary_restriction'], '232 million people drew the evolutionary line right at the shoreline.', { aliases: ['eats fish no meat'] }),
  trait('celiac_gluten_free', 'I eat strictly gluten-free (celiac or medical intolerance)', 'Strictly gluten-free', '🌾', 'food_palate', 0.014, ['dietary_restriction', 'medical_history'], '116 million humans treat shared restaurant fryer oil as a tactical hazard.', { aliases: ['celiac disease', 'gluten intolerance'] }),
  trait('peanut_tree_nut_allergy', 'I have a peanut or tree-nut allergy', 'Nut allergy', '🥜', 'food_palate', 0.012, ['dietary_restriction', 'medical_history'], '100 million humans ask bakery staff very pointed follow-up questions about pesto.', { aliases: ['peanut allergy', 'epipen', 'anaphylaxis'] }),
  trait('shellfish_allergy', 'I am allergic to shellfish', 'Shellfish allergy', '🦐', 'food_palate', 0.016, ['dietary_restriction', 'medical_history'], '133 million humans admire shrimp boils exclusively from across the patio.', { aliases: ['shrimp allergy'] }),
  trait('lactose_intolerant_strict', 'I strictly avoid dairy due to lactose intolerance', 'Avoids dairy / lactose', '🥛', 'food_palate', 0.18, ['dietary_restriction', 'genetic_quirk'], 'While ~65% of adults down-regulate lactase, ~1.5 billion actually respect the warning.', { aliases: ['dairy free'] }),
  trait('eats_spicy_daily', 'I eat spicy chili heat almost every single day', 'Daily spicy eater', '🌶️', 'food_palate', 0.24, ['spicy_palate'], 'Nearly 2 billion humans from Sichuan to Oaxaca to Bangkok consider mild salsa a war crime.', { aliases: ['loves spicy food', 'chili oil', 'hot peppers'], icebreaker: true }),
  trait('habanero_reaper_tolerance', 'I happily eat habanero / ghost-pepper heat straight up', 'Extreme Scoville eater', '🔥', 'food_palate', 0.016, ['spicy_palate'], '133 million capsaicin extremists chase endorphin rushes past 200,000 Scoville units.', { aliases: ['scotch bonnet', 'carolina reaper', 'thai bird chili'], subsumes: ['eats_spicy_daily'] }),
  trait('loves_black_licorice', 'I genuinely love salted or black licorice (salmiakki)', 'Loves black licorice', '🍬', 'food_palate', 0.045, ['sensory_trait'], '373 million people — mostly Nordics, Dutch, and old souls — defend ammonium chloride candy.', { aliases: ['salmiakki', 'anise'] }),
  trait('loves_anchovies_tinned_fish', 'I happily eat anchovies or sardines straight from the tin', 'Tinned-fish enthusiast', '🐟', 'food_palate', 0.062, ['culinary_diy'], '515 million savory-umami fans keep Portuguese sardine tins for emergency gourmet lunches.', { aliases: ['sardines', 'conservas', 'anchovies'] }),
  trait('loves_durian', 'I genuinely enjoy eating fresh durian fruit', 'Loves durian', '🍈', 'food_palate', 0.032, ['sensory_trait', 'world_traveler'], '265 million Southeast Asian fruit connoisseurs smile past the "Banned on Metro" signs.', { aliases: ['king of fruits'] }),
  trait('loves_natto_marmite', 'I enjoy strongly fermented funk (nattō, Marmite, Vegemite, or blue cheese)', 'Loves funky ferments', '🧀', 'food_palate', 0.075, ['sensory_trait', 'culinary_diy'], '622 million bold palates run toward glutamates where timid eaters flee.', { aliases: ['vegemite', 'marmite', 'natto', 'roquefort'] }),
  trait('bakes_from_scratch', 'I bake pies, pastries, or laminated dough from scratch', 'Scratch pastry baker', '🥧', 'food_palate', 0.024, ['culinary_diy', 'craft_maker'], '200 million kitchens own a bench scraper and cold-butter patience.', { aliases: ['croissants', 'pie crust', 'home baker'] }),
  trait('makes_fresh_pasta', 'I roll fresh pasta or hand-pleat dumplings from scratch', 'Hand-makes pasta/dumplings', '🥟', 'food_palate', 0.038, ['culinary_diy'], '315 million home cooks turn flour and water into Sunday therapy.', { aliases: ['gyoza', 'ravioli', 'pasta roller'] }),
  trait('owns_cast_iron_seasoned', 'I maintain a fiercely protected seasoned cast-iron or carbon-steel pan', 'Cast-iron / wok keeper', '🍳', 'food_palate', 0.048, ['culinary_diy'], '400 million home cooks guard polymerized oil patina like a family heirloom.', { aliases: ['carbon steel wok', 'cast iron skillet'] }),
  trait('eats_kiwi_with_skin', 'I eat whole kiwifruit with the fuzzy skin still on', 'Eats kiwi with the skin', '🥝', 'food_palate', 0.0085, ['sensory_trait'], '70 million chaotic-good fiber enthusiasts terrify coworkers in the breakroom.', { aliases: ['kiwi skin'] }),
  trait('pineapple_on_pizza_fan', 'I actively order pineapple on pizza when given the choice', 'Orders pineapple pizza', '🍍', 'food_palate', 0.14, ['spicy_palate'], '1.16 billion sweet-and-salty defenders stand unbothered by Italian diplomatic protests.', { aliases: ['hawaiian pizza'] }),
  trait('90_percent_dark_choc', 'I prefer 85%–95% ultra-dark chocolate over milk chocolate', '85%+ dark chocolate', '🍫', 'food_palate', 0.029, ['sensory_trait'], '240 million cacao purists treat sugar primarily as a structural impurity.', { aliases: ['bitter chocolate', '90% cacao'] }),
  trait('cooks_dry_beans_pressure', 'I soak and pressure-cook dry heirloom beans instead of canned', 'Cooks dry beans', '🫘', 'food_palate', 0.095, ['culinary_diy'], '788 million kitchens worldwide hiss softly with legumes and bay leaves.', { aliases: ['rancho gordo', 'instant pot beans'] }),
  trait('uses_kitchen_thermometer', 'I temp meat and baked goods with an instant-read digital thermometer', 'Instant-read thermometer', '🌡️', 'food_palate', 0.022, ['culinary_diy'], '182 million cooks trust Thermapens and math over poking chicken and hoping.', { aliases: ['thermapen'] }),
  trait('makes_homemade_ice_cream', 'I churn homemade custard or gelato at home', 'Churns homemade ice cream', '🍨', 'food_palate', 0.0042, ['culinary_diy'], '35 million dessert engineers keep an ice-cream bowl permanently frozen in the back of the freezer.', { aliases: ['ninja creami', 'gelato maker'] }),
  trait('drinks_sparkling_water_cases', 'I go through sparkling water / seltzer daily', 'Daily sparkling water', '🫧', 'food_palate', 0.045, ['sensory_trait'], '373 million carbonation addicts enjoy water that bites back with static electricity.', { aliases: ['sodastream', 'lacroix', 'topo chico'] }),
  trait('smokes_bbq_low_slow', 'I tend 8+ hour wood/charcoal smoked brisket or ribs', 'Low-and-slow pitmaster', '🍖', 'food_palate', 0.0048, ['culinary_diy', 'outdoor_mountain'], '40 million backyard pitmasters wake up at 4 AM to stare lovingly at oak smoke.', { aliases: ['offset smoker', 'smoked brisket'] }),
  trait('never_had_coffee', 'I have never drunk a full cup of coffee in my entire life', 'Never had a cup of coffee', '🚫', 'food_palate', 0.18, ['caffeine_habit'], 'Including tea nations and kids, 1.5 billion humans have zero idea what all the fuss is about.', { aliases: ['hates coffee'] }),
  trait('orders_same_meal', 'I order the exact same trusted meal 90% of the time at favorite spots', 'Signature-order loyalist', '📋', 'food_palate', 0.16, ['indoor_hobby'], '1.33 billion creatures of habit refuse to gamble when a proven 10/10 already exists.', { aliases: ['same order'] }),
  trait('forages_urban_fruit', 'I map neighborhood fig, plum, citrus, or blackberry spots for harvest', 'Neighborhood fruit mapper', '🍋', 'food_palate', 0.0065, ['horticulture', 'culinary_diy'], '54 million observant walkers know exactly which alley overhang ripens in late August.', { aliases: ['urban foraging', 'wild blackberries'] }),

  // --- 7. HOUSEHOLD & COMPANIONS (28) ---
  trait('owns_dog', 'I live with a dog', 'Has a dog', '🐕', 'household_companions', 0.33, ['pet_owner'], '2.74 billion humans share their floor space and dropped cheese cubes with canines.', { aliases: ['dog owner', 'puppy'], icebreaker: true }),
  trait('owns_golden_retriever', 'I own a Golden Retriever', 'Owns a Golden Retriever', '🦮', 'household_companions', 0.006, ['pet_owner'], '50 million humans own a lint roller in every room and a dog who loves burglars.', { aliases: ['golden retriever'], subsumes: ['owns_dog'] }),
  trait('owns_sighthound_herder', 'I own a working herding dog or sighthound (Border Collie, Aussie, Greyhound)', 'Herding / sighthound owner', '🐕‍🦺', 'household_companions', 0.0045, ['pet_owner', 'athletic'], '37 million dog owners are outsmarted or outrun daily in their own living rooms.', { aliases: ['border collie', 'australian shepherd', 'whippet', 'greyhound'], subsumes: ['owns_dog'] }),
  trait('owns_cat', 'I live with a cat', 'Has a cat', '🐈', 'household_companions', 0.23, ['pet_owner'], '1.9 billion humans pay rent on an apartment legally governed by an 11-pound feline.', { aliases: ['cat owner', 'kitten'] }),
  trait('owns_three_plus_cats', 'I live with 3 or more cats', '3+ cats at home', '🐈‍⬛', 'household_companions', 0.018, ['pet_owner'], '150 million households have crossed the threshold where the cats hold voting majority.', { aliases: ['multi cat'], subsumes: ['owns_cat'] }),
  trait('keeps_backyard_chickens', 'I raise backyard chickens or ducks for eggs', 'Keeps backyard chickens', '🐓', 'household_companions', 0.032, ['pet_owner', 'horticulture', 'home_energy_diy'], '265 million households worldwide collect warm breakfast straight from a nesting box.', { aliases: ['chicken coop', 'ducks'] }),
  trait('owns_reptile_amphibian', 'I keep a pet reptile, tortoise, or amphibian', 'Keeps reptile / amphibian', '🦎', 'household_companions', 0.0042, ['pet_owner'], '35 million humans keep live crickets or UV heat lamps on the shopping list.', { aliases: ['gecko', 'bearded dragon', 'ball python', 'tortoise'] }),
  trait('owns_parrot_bird', 'I live with a parrot, cockatiel, or parakeet', 'Keeps a pet bird', '🦜', 'household_companions', 0.014, ['pet_owner'], '116 million households share space with a tiny dinosaur that mimics the microwave.', { aliases: ['budgie', 'conure', 'cockatiel', 'parrot'] }),
  trait('rides_owns_horse', 'I own or lease a horse', 'Horse owner / rider', '🐎', 'household_companions', 0.0028, ['pet_owner', 'outdoor_mountain'], '23 million equestrians smell faintly of hay, saddle soap, and veterinary invoices.', { aliases: ['equestrian', 'horseback riding'] }),
  trait('home_solar_panels', 'My home runs on rooftop solar panels', 'Home solar panels', '☀️', 'household_companions', 0.028, ['home_energy_diy'], '232 million residents check sunny afternoons against their inverter output graph.', { aliases: ['photovoltaic', 'rooftop solar'] }),
  trait('drives_full_ev', 'I drive a fully battery-electric car (BEV)', 'Drives a full EV', '🔋', 'household_companions', 0.0085, ['home_energy_diy', 'automotive_mech'], '70 million drivers judge highway rest stops strictly by kilowatt charging curves.', { aliases: ['electric vehicle', 'bev'] }),
  trait('car_free_adult', 'I live car-free by choice (transit, bike, and foot)', 'Car-free lifestyle', '🚲', 'household_companions', 0.14, ['cycling_wheeled'], '1.16 billion adults skip car insurance, parking tickets, and check-engine lights entirely.', { aliases: ['no car', 'public transit'] }),
  trait('only_child', 'I grew up as an only child (zero siblings)', 'Only child', '☝️', 'household_companions', 0.13, ['family_structure'], '1.08 billion humans never had to negotiate shotgun seat rights growing up.', { aliases: ['no siblings'], exclusiveGroup: 'siblings_tier' }),
  trait('three_plus_siblings', 'I have 3 or more brothers/sisters (family of 4+ kids)', '3+ siblings', '👨‍👩‍👧‍👦', 'household_companions', 0.22, ['family_structure'], '1.83 billion humans learned fast dinner-table reflexes in a 4+ kid household.', { aliases: ['big family', 'four kids'], exclusiveGroup: 'siblings_tier' }),
  trait('six_plus_siblings', 'I have 6 or more siblings', '6+ siblings', '🚌', 'household_companions', 0.042, ['family_structure'], '348 million humans grew up in a household with its own internal postal code.', { aliases: ['huge family'], subsumes: ['three_plus_siblings'], exclusiveGroup: 'siblings_tier' }),
  trait('youngest_child', 'I am the youngest sibling in my family', 'Youngest sibling', '🐣', 'household_companions', 0.27, ['family_structure'], '2.24 billion youngest siblings got away with rules that were strictly enforced five years earlier.', { aliases: ['baby of the family'], exclusiveGroup: 'birth_order' }),
  trait('oldest_child', 'I am the oldest sibling in my family', 'Oldest sibling', '🫡', 'household_companions', 0.29, ['family_structure'], '2.4 billion eldest siblings served as the unpaid beta-test generation for their parents.', { aliases: ['firstborn', 'eldest'], exclusiveGroup: 'birth_order' }),
  trait('middle_child', 'I am a classic middle child', 'Middle child', '🥪', 'household_companions', 0.21, ['family_structure'], '1.74 billion diplomatic middle children mastered stealth negotiation early.', { aliases: ['middle sibling'], exclusiveGroup: 'birth_order' }),
  trait('lives_alone', 'I currently live completely solo (one-person household)', 'Lives solo', '🔑', 'household_companions', 0.068, ['indoor_hobby'], '564 million solo dwellers find every single mug right where they left it.', { aliases: ['single household', 'no roommates'] }),
  trait('multi_generational_home', 'I live in a 3+ generation household under one roof', '3-gen household', '🏡', 'household_companions', 0.19, ['family_structure'], '1.58 billion humans live with grandparents, parents, and kids sharing one kitchen.', { aliases: ['multigenerational'] }),
  trait('rainwater_harvester', 'I collect rainwater in barrels or cisterns for home/garden use', 'Rainwater harvester', '🌧️', 'household_companions', 0.018, ['home_energy_diy', 'horticulture'], '150 million households cheer quietly every time the gutter downspouts start roaring.', { aliases: ['rain barrel', 'cistern'] }),
  trait('heats_with_wood', 'I heat my home primarily or regularly with a wood-burning stove', 'Wood-stove heated home', '🔥', 'household_companions', 0.048, ['home_energy_diy', 'outdoor_mountain'], '400 million homes smell faintly of birch or oak smoke from November to March.', { aliases: ['woodstove', 'hearth'] }),
  trait('owns_bidet', 'I installed or use a bidet at home', 'Bidet household', '🚿', 'household_companions', 0.19, ['home_energy_diy'], '1.58 billion civilized humans view dry-paper-only travel like camping in the Bronze Age.', { aliases: ['washlet', 'toto'] }),
  trait('zero_tv_living_room', 'I do not have a television in my living room', 'No TV in living room', '🪴', 'household_companions', 0.085, ['book_reader', 'indoor_hobby'], '705 million living rooms point the couches toward each other instead of a 65-inch rectangle.', { aliases: ['no television'] }),
  trait('shoes_off_strict', 'My home is a strict 100% shoes-off-at-the-door zone', 'Strict shoes-off home', '🧦', 'household_companions', 0.56, ['family_structure'], 'Across Asia, Northern Europe, and beyond, 4.6 billion humans leave street sidewalks outside.', { aliases: ['no shoes inside'] }),
  trait('sauna_at_home', 'I have access to a home or backyard sauna', 'Home / backyard sauna', '🧖', 'household_companions', 0.0045, ['home_energy_diy', 'athletic'], '37 million humans (half of them spiritually or literally Finnish) ladle water onto hot stones.', { aliases: ['barrel sauna', 'finnish sauna'] }),
  trait('fostered_rescue_animals', 'I have fostered rescue animals until adoption', 'Animal foster home', '🐾', 'household_companions', 0.0048, ['pet_owner'], '40 million generous humans risk the classic "foster fail" for animals in transition.', { aliases: ['dog foster', 'cat foster'] }),
  trait('lived_on_boat_van', 'I have lived full-time in a campervan, RV, or sailboat for 3+ months', 'Vanlife / liveaboard alum', '🚐', 'household_companions', 0.0014, ['world_traveler', 'outdoor_mountain'], '11.6 million humans know exact water-tank capacity down to the half-liter.', { aliases: ['liveaboard', 'vanlife', 'skoolie'] }),

  // --- 8. TRAVEL & GEOGRAPHY (30) ---
  trait('lives_above_5000ft', 'I live above 5,000 ft (1,500 m) elevation', 'Lives >5,000 ft / 1,500m', '🏔️', 'travel_geography', 0.011, ['high_altitude', 'outdoor_mountain'], 'About 91 million high-altitude humans boil pasta slower and bake cakes on hard mode.', { aliases: ['mile high', 'denver', 'bogota', 'high elevation'] }),
  trait('lives_above_8000ft', 'I live above 8,000 ft (2,400 m) elevation', 'Lives >8,000 ft / 2,400m', '🏔️', 'travel_geography', 0.0024, ['high_altitude', 'outdoor_mountain'], '20 million extra-red-blood-cell residents laugh politely when flatlanders get winded on stairs.', { aliases: ['la paz', 'quito', 'leadville', 'high altitude'], subsumes: ['lives_above_5000ft'] }),
  trait('southern_hemisphere_native', 'I was born in the Southern Hemisphere', 'Southern Hemisphere native', '🌏', 'travel_geography', 0.125, ['world_traveler'], 'Just 1 in 8 humans (~1.04 billion) grew up with December summer and Orion upside-down.', { aliases: ['south of equator'] }),
  trait('lived_on_island', 'I live (or grew up) on an ocean island', 'Island native / resident', '🏝️', 'travel_geography', 0.092, ['world_traveler', 'water_sport'], '763 million islanders know ferry timetables and typhoon shutters intimately.', { aliases: ['island life'] }),
  trait('visited_10_countries', 'I have visited 10 or more countries', 'Visited 10+ countries', '🛂', 'travel_geography', 0.035, ['world_traveler'], 'Only ~290 million living humans have stamped their way into double-digit countries.', { aliases: ['10 countries', 'well traveled'], subsumes: ['holds_passport'] }),
  trait('visited_30_countries', 'I have visited 30 or more countries', 'Visited 30+ countries', '🌍', 'travel_geography', 0.0045, ['world_traveler'], '37 million global nomads know airport transit corridors better than their local mall.', { aliases: ['30 countries', 'globetrotter'], subsumes: ['visited_10_countries', 'holds_passport'] }),
  trait('visited_50_countries', 'I have visited 50 or more countries', 'Visited 50+ countries', '🌐', 'travel_geography', 0.0008, ['world_traveler'], '6.6 million humans have set foot in more than a quarter of Earth’s nations.', { aliases: ['50 countries'], subsumes: ['visited_30_countries', 'visited_10_countries', 'holds_passport'] }),
  trait('holds_passport', 'I hold a valid international passport', 'Holds a passport', '🛂', 'travel_geography', 0.19, ['world_traveler'], 'Globally, more than 80% of humanity does not hold an active passport.', { aliases: ['passport holder'] }),
  trait('dual_citizenship', 'I hold dual (or multiple) citizenship', 'Dual citizen', '🪪', 'travel_geography', 0.012, ['world_traveler', 'polyglot'], '100 million humans get to pick the shorter customs line at two borders.', { aliases: ['two passports', 'multiple citizenship'], subsumes: ['holds_passport'] }),
  trait('lived_in_3_countries', 'I have lived for 6+ months in 3 or more countries', 'Lived in 3+ countries', '📦', 'travel_geography', 0.0038, ['world_traveler', 'polyglot'], '31.5 million expats and third-culture kids measure distances in flight hours.', { aliases: ['expat', 'third culture kid'], subsumes: ['holds_passport'] }),
  trait('crossed_arctic_circle', 'I have crossed the Arctic Circle (66°33′ N)', 'Crossed Arctic Circle', '🐻‍❄️', 'travel_geography', 0.0022, ['world_traveler', 'winter_sport'], '18 million humans have stood where the summer sun refuses to set.', { aliases: ['midnight sun', 'tromso', 'svalbard', 'lapland'] }),
  trait('visited_antarctica', 'I have set foot on Antarctica', 'Visited Antarctica', '🐧', 'travel_geography', 0.00012, ['world_traveler', 'winter_sport'], 'Barely ~1 million living humans have survived the Drake Passage to reach the 7th continent.', { aliases: ['7th continent', 'drake passage'], subsumes: ['holds_passport'] }),
  trait('visited_all_6_inhabited_continents', 'I have set foot on all 6 inhabited continents', 'All 6 inhabited continents', '🗺️', 'travel_geography', 0.0009, ['world_traveler'], '7.5 million humans have collected stamps across Asia, Africa, Europe, both Americas, and Oceania.', { aliases: ['six continents'], subsumes: ['visited_10_countries', 'holds_passport'] }),
  trait('seen_total_solar_eclipse', 'I have stood inside the path of totality during a total solar eclipse', 'Seen eclipse totality', '🌑', 'travel_geography', 0.028, ['world_traveler'], '232 million humans know 99% partial and 100% totality are completely different universes.', { aliases: ['total eclipse', 'corona'] }),
  trait('seen_aurora_borealis', 'I have seen the Aurora Borealis or Australis with the naked eye', 'Seen Northern/Southern Lights', '🌌', 'travel_geography', 0.024, ['world_traveler', 'outdoor_mountain'], '200 million humans have stood craning their necks upward in freezing darkness.', { aliases: ['northern lights', 'aurora australis'] }),
  trait('swam_two_oceans', 'I have swum in at least 3 different oceans', 'Swam in 3+ oceans', '🌊', 'travel_geography', 0.0075, ['water_sport', 'world_traveler'], '62 million humans have tasted salt across Pacific, Atlantic, and Indian (or Arctic) waters.', { aliases: ['three oceans'] }),
  trait('solo_international_trip', 'I have traveled internationally completely solo', 'Traveled abroad solo', '🎒', 'travel_geography', 0.022, ['world_traveler'], '182 million solo travelers learned the bliss of changing museum plans on zero notice.', { aliases: ['solo travel'], subsumes: ['holds_passport'] }),
  trait('overnight_sleeper_train', 'I have slept overnight on a long-distance sleeper train', 'Rode overnight sleeper train', '🚆', 'travel_geography', 0.048, ['world_traveler'], '400 million travelers have been rocked to sleep by steel wheels clicking over rail joints.', { aliases: ['couchette', 'amtrak roomette', 'night train'] }),
  trait('lives_within_2km_ocean', 'I live within 2 km (1.2 miles) of a saltwater coastline', 'Lives <2km from ocean', '🌊', 'travel_geography', 0.065, ['water_sport'], '540 million coastal humans smell low tide before seeing the water.', { aliases: ['beach town', 'coastal'] }),
  trait('grew_up_rural_farm', 'I grew up on a working farm or ranch', 'Grew up on a farm', '🚜', 'travel_geography', 0.095, ['horticulture', 'outdoor_mountain'], '788 million humans knew how to fix fences before they had a driver’s license.', { aliases: ['farm kid', 'ranch'] }),
  trait('lived_megacity_10m', 'I live in a megacity metro of 10+ million people', 'Lives in a 10M+ megacity', '🏙️', 'travel_geography', 0.072, ['world_traveler'], '600 million urbanites treat subway transfers like reflex muscle memory.', { aliases: ['tokyo', 'delhi', 'nyc', 'london', 'seoul', 'sao paulo'] }),
  trait('hiked_above_14000ft', 'I have summited or hiked above 14,000 ft (4,267 m)', 'Summited >14,000 ft / 4,267m', '⛰️', 'travel_geography', 0.0032, ['outdoor_mountain', 'high_altitude', 'endurance_sport'], '26.5 million lungs have negotiated 40% thinner oxygen above the treeline.', { aliases: ['14er', 'fourteener', 'kilimanjaro', 'inca trail'] }),
  trait('walked_across_border', 'I have walked across an international land border on foot', 'Walked across a border', '🚶', 'travel_geography', 0.042, ['world_traveler'], '348 million humans have stepped over a painted line from one country straight into another.', { aliases: ['land border'] }),
  trait('Slept_in_desert_stars', 'I have slept outdoors under open desert stars (no tent roof)', 'Cowboy-camped in a desert', '🏜️', 'travel_geography', 0.0042, ['outdoor_mountain', 'world_traveler'], '35 million humans know just how cold dry sand gets at 4:00 AM.', { aliases: ['cowboy camping', 'bivouac desert'] }),
  trait('visited_national_parks_10', 'I have visited 10+ National Parks', '10+ National Parks', '🌲', 'travel_geography', 0.011, ['outdoor_mountain', 'world_traveler'], '91 million park collectors stop at every wooden entrance sign for documentary proof.', { aliases: ['national parks passport'] }),
  trait('crossed_equator_surface', 'I have crossed the Equator by ship, train, or road (not airplane)', 'Surface-crossed Equator', '🧭', 'travel_geography', 0.0045, ['world_traveler'], '37 million travelers watched GPS latitude hit 00°00′00″ at ground level.', { aliases: ['shellback', 'equator line'] }),
  trait('lived_same_town_life', 'I currently live within 25 miles of the hospital/home where I was born', 'Lives <25mi from birthplace', '📍', 'travel_geography', 0.36, ['family_structure'], 'Nearly 3 billion humans put down deep local roots right where their story started.', { aliases: ['hometown native'] }),
  trait('experienced_7_earthquake', 'I have felt a Magnitude 6.5+ earthquake in person', 'Felt M6.5+ earthquake', '🫨', 'travel_geography', 0.032, ['medical_history'], '265 million Pacific Rim and fault-line residents freeze and mentally grade the P-wave.', { aliases: ['major earthquake'] }),
  trait('experienced_eye_hurricane', 'I have stood in the calm eye of a hurricane / typhoon', 'Stood in a hurricane eye', '🌀', 'travel_geography', 0.0048, ['medical_history'], '40 million coastal veterans remember eerie blue sky framed by a stadium wall of storm.', { aliases: ['typhoon eye', 'cyclone'] }),
  trait('visited_unesco_15', 'I have visited 15+ UNESCO World Heritage Sites', '15+ UNESCO sites', '🏛️', 'travel_geography', 0.0065, ['world_traveler', 'book_reader'], '54 million history nerds read every bronze plaque from top to bottom.', { aliases: ['world heritage'] }),

  // --- 9. MEDIA, GAMES & CULTURE (33) ---
  trait('daily_word_puzzle', 'I play a daily word or logic puzzle (Wordle, Connections, Crossword, Word Vine)', 'Daily word puzzler', '🟩', 'media_games', 0.032, ['daily_puzzle_games'], '265 million coffee routines do not legally begin until the daily streak survives.', { aliases: ['wordle', 'connections', 'word vine', 'spelling bee'], icebreaker: true }),
  trait('saturday_nyt_crossword', 'I solve Friday/Saturday cryptic or themeless crosswords without hints', 'Themeless/cryptic solver', '✏️', 'media_games', 0.0018, ['daily_puzzle_games'], '15 million cruciverbalists solve in pen and keep esoteric four-letter river names ready.', { aliases: ['cryptic crossword', 'nyt saturday'], subsumes: ['daily_word_puzzle'] }),
  trait('physical_book_purist', 'I strongly prefer physical paper books over e-readers', 'Physical book purist', '📚', 'media_games', 0.24, ['book_reader', 'vintage_gear'], '2 billion readers still judge progress by thumb thickness rather than footer percentages.', { aliases: ['paperbacks', 'hardcovers'] }),
  trait('reads_30_books_year', 'I finish 30 or more books per year', 'Reads 30+ books/year', '📖', 'media_games', 0.0065, ['book_reader'], '54 million voracious readers carry an emergency backup book in case the first one ends early.', { aliases: ['bookworm', '52 books'] }),
  trait('holds_library_card_active', 'I check out books or media with a public library card monthly', 'Monthly library regular', '🏛️', 'media_games', 0.028, ['book_reader'], '232 million civic heroes keep local librarians delightfully busy.', { aliases: ['libby', 'public library'] }),
  trait('attended_20_concerts', 'I have attended 20+ live concerts or gigs', '20+ live concerts', '🎸', 'media_games', 0.028, ['live_music_audio'], '232 million live-music regulars rank calendar years by tour setlists.', { aliases: ['concertgoer', 'live music'] }),
  trait('attended_100_concerts', 'I have attended 100+ live concerts or club shows', '100+ live concerts', '🎤', 'media_games', 0.0022, ['live_music_audio'], '18 million lifelong showgoers know which side of the soundboard has the cleanest mix.', { aliases: ['music festival vet'], subsumes: ['attended_20_concerts'] }),
  trait('sang_in_choir_band', 'I perform (or performed) in a choir, orchestra, or gigging band', 'Band / choir / orchestra', '🎺', 'media_games', 0.038, ['musical', 'live_music_audio'], '315 million humans know the terror of counting 32 bars of rest accurately.', { aliases: ['marching band', 'choral singer', 'gigging musician'] }),
  trait('writes_records_songs', 'I write and record original music', 'Writes original music', '🎚️', 'media_games', 0.0032, ['musical', 'visual_arts'], '26.5 million songwriters have 400 voice memos named "New Idea 47 (good bridge).m4a".', { aliases: ['music producer', 'ableton', 'logic pro', 'songwriter'] }),
  trait('watches_movies_alone_theater', 'I happily go to the movie theater completely solo', 'Solo moviegoer', '🍿', 'media_games', 0.026, ['indoor_hobby'], '215 million enlightened cinephiles refuse to share an armrest or negotiate popcorn.', { aliases: ['solo cinema', 'letterboxd'] }),
  trait('logs_films_letterboxd', 'I log and rate every movie I watch on Letterboxd or a film diary', 'Logs every movie watched', '🎬', 'media_games', 0.0024, ['collectors', 'visual_arts'], '20 million cinephiles agonize for ten minutes over 3.5 vs. 4.0 stars.', { aliases: ['letterboxd', 'cinephile'] }),
  trait('completed_soulsborne', 'I have beaten Elden Ring, Dark Souls, Bloodborne, or Sekiro solo', 'Beat a FromSoftware game', '⚔️', 'media_games', 0.0042, ['indoor_hobby'], '35 million tarnished players learned a boss’s 9-hit combo out of pure spite.', { aliases: ['elden ring', 'dark souls', 'sekiro'] }),
  trait('1000_hours_one_game', 'I have logged 1,000+ hours into a single video game', '1,000+ hrs in one game', '🕹️', 'media_games', 0.014, ['indoor_hobby'], '116 million gamers basically own a digital vacation home in Civilization, Factorio, or Skyrim.', { aliases: ['factorio', 'civ', 'minecraft', 'dota', 'steam hours'] }),
  trait('speedrunner_pb', 'I have timed speedrun personal bests in a video game', 'Video game speedrunner', '⏱️', 'media_games', 0.00038, ['indoor_hobby', 'coding_tech'], '3.1 million runners watch frame rules and clip straight through walls on purpose.', { aliases: ['livesplit', 'any%'] }),
  trait('still_owns_retro_console', 'I keep a working CRT or pre-2005 retro game console hooked up', 'Retro console / CRT owner', '👾', 'media_games', 0.0035, ['vintage_gear', 'collectors'], '29 million living rooms still blow on cartridges despite knowing you technically shouldn’t.', { aliases: ['snes', 'n64', 'gamecube', 'ps2', 'crt'] }),
  trait('trivia_pub_quiz_regular', 'I play competitive pub trivia or quiz bowl regularly', 'Pub trivia regular', '🧠', 'media_games', 0.0068, ['daily_puzzle_games'], '56 million walking encyclopedias store 1990s state capitals and Oscar winners for Tuesday night.', { aliases: ['jeopardy', 'quiz bowl', 'bar trivia'] }),
  trait('memorized_long_poem', 'I can recite a 20+ line poem, Shakespeare monologue, or song epic verbatim', 'Recites 20+ line poem', '🎭', 'media_games', 0.018, ['book_reader'], '150 million brains still hold every syllable from sophomore English or theater camp.', { aliases: ['theater kid', 'poetry'] }),
  trait('speaks_constructed_lang', 'I have studied a constructed language (Esperanto, Toki Pona, Klingon, Sindarin)', 'Studied a conlang', '🗣️', 'media_games', 0.00032, ['polyglot', 'book_reader'], '2.6 million linguistics nerds looked at 7,000 natural languages and asked for bonus lore.', { aliases: ['esperanto', 'toki pona', 'conlang', 'high valyrian'] }),
  trait('draws_sketchbook_weekly', 'I keep an active sketchbook or paint watercolors weekly', 'Keeps active sketchbook', '🎨', 'media_games', 0.016, ['visual_arts'], '133 million visual thinkers carry graphite smudges on the side of their palm.', { aliases: ['plein air', 'illustrator', 'watercolor'] }),
  trait('plays_geoguessr', 'I can identify countries in GeoGuessr from bollards, poles, and road lines', 'GeoGuessr meta player', '📍', 'media_games', 0.0011, ['daily_puzzle_games', 'world_traveler'], '9.1 million players whisper "Ghanaian black tape" within 0.4 seconds of Street View loading.', { aliases: ['geoguessr', 'plonk it'] }),
  trait('reads_wikipedia_rabbit_holes', 'I fall down 2 AM Wikipedia rabbit holes at least weekly', '2 AM Wikipedia diver', '🌐', 'media_games', 0.048, ['book_reader', 'sleep_habit'], '400 million curious minds click "List of unusual deaths" and surface ninety minutes later.', { aliases: ['wikipedia nerd'] }),
  trait('sudoku_killer_variant', 'I solve Killer, Miracle, or Cracking-the-Cryptic variant Sudokus', 'Variant Sudoku solver', '🔢', 'media_games', 0.0016, ['daily_puzzle_games'], '13.3 million logic solvers get emotional over German Whispers and knight’s-move constraints.', { aliases: ['killer sudoku', 'cracking the cryptic'] }),
  trait('listens_full_albums', 'I listen to albums front-to-back in track order rather than shuffle', 'Front-to-back album listener', '💿', 'media_games', 0.034, ['live_music_audio'], '282 million album purists treat track sequencing as sacred architecture.', { aliases: ['no shuffle'] }),
  trait('watches_f1_or_cycling_live', 'I wake up at odd hours to watch live Formula 1 or Grand Tour cycling', 'Live F1 / Tour de France fan', '🏁', 'media_games', 0.011, ['automotive_mech', 'cycling_wheeled'], '91 million fans have strong feelings about undercut pit strategies at 6:00 AM.', { aliases: ['formula 1', 'tour de france'] }),
  trait('writes_fiction_journal', 'I write fiction or keep a handwritten journal multiple times a week', 'Fiction / journal writer', '✍️', 'media_games', 0.022, ['book_reader'], '182 million writers fill notebooks nobody else is allowed to open.', { aliases: ['journaling', 'nanowrimo', 'novelist'] }),
  trait('collects_postcards_stamps', 'I mail physical postcards or collect postage stamps', 'Mails physical postcards', '📮', 'media_games', 0.0075, ['collectors', 'world_traveler'], '62 million romantics keep the global postal service smiling.', { aliases: ['postcrossing', 'philately'] }),
  trait('plays_mahjong_bridge', 'I play Riichi/Chinese Mahjong or duplicate Bridge', 'Plays Mahjong or Bridge', '🀄', 'media_games', 0.028, ['board_tabletop', 'daily_puzzle_games'], '232 million tile and trick-taking tacticians calculate probabilities faster than spreadsheets.', { aliases: ['mahjong', 'contract bridge', 'riichi'] }),
  trait('attends_live_theater_opera', 'I attend live stage plays, musicals, or opera multiple times a year', 'Live theater / opera patron', '🎭', 'media_games', 0.014, ['live_music_audio', 'visual_arts'], '116 million audience members save Playbills in a shoebox.', { aliases: ['broadway', 'west end', 'symphony'] }),
  trait('follows_sumo_or_cricket_tests', 'I follow 5-day Test cricket or 15-day Grand Sumo basho tournaments', '5-day Test / Sumo follower', '🏟️', 'media_games', 0.025, ['team_sport'], '207 million connoisseurs appreciate sports that unfold at geological majesty.', { aliases: ['test cricket', 'sumo basho'] }),
  trait('builds_crosswords_puzzles', 'I construct crosswords, trivia rounds, or word puzzles for others', 'Constructs puzzles', '🧩', 'media_games', 0.00035, ['daily_puzzle_games', 'craft_maker'], '2.9 million constructors stare at grid symmetry so everyone else gets a morning brain-tickle.', { aliases: ['crossword constructor', 'puzzle designer'] }),
  trait('memorized_pi_30', 'I can recite 30+ digits of Pi from memory', 'Knows 30+ digits of Pi', '🥧', 'media_games', 0.0022, ['daily_puzzle_games'], '18 million nerds peaked during a middle-school March 14 contest and never deleted the file.', { aliases: ['pi digits'] }),
  trait('collects_physical_maps', 'I collect paper topographic maps or vintage atlases', 'Collects topo maps / atlases', '🗺️', 'media_games', 0.0028, ['collectors', 'outdoor_mountain', 'vintage_gear'], '23 million cartography fans trace contour lines like fine literature.', { aliases: ['usgs topo', 'cartography'] }),
  trait('zero_unread_podcasts', 'I finish whole podcast back-catalogs from Episode 1 in chronological order', 'Chronological podcast binger', '🎙️', 'media_games', 0.0095, ['collectors'], '79 million completionists start in 2016 just to understand one running inside joke.', { aliases: ['podcast completionist'] }),

  // --- 10. LIFE RANDOMNESS & MILESTONES (35) ---
  trait('never_broken_bone', 'I have never broken a bone in my life', 'Never broken a bone', '🦴', 'life_randomness', 0.69, ['medical_history'], '5.7 billion intact skeletons nod cautiously and immediately knock on wood.', { aliases: ['unbroken bones'], icebreaker: true }),
  trait('broken_3_plus_bones', 'I have broken 3 or more bones over my lifetime', 'Broken 3+ bones', '🩼', 'life_randomness', 0.032, ['medical_history', 'athletic'], '265 million adventurous skeletons are on a first-name basis with local radiology techs.', { aliases: ['casts', 'fractures'] }),
  trait('appendectomy', 'I have had my appendix removed (appendectomy)', 'No appendix', '🏥', 'life_randomness', 0.07, ['medical_history'], '581 million humans parted ways with that mysterious angry little cul-de-sac.', { aliases: ['appendix surgery'] }),
  trait('tonsils_removed', 'I had my tonsils removed', 'No tonsils', '🍨', 'life_randomness', 0.065, ['medical_history'], '540 million humans traded pharyngeal lymphoid tissue for a week of unlimited ice cream.', { aliases: ['tonsillectomy'] }),
  trait('gallbladder_removed', 'I have had my gallbladder removed', 'No gallbladder', '🏥', 'life_randomness', 0.024, ['medical_history'], '200 million humans run direct-pipeline bile logistics now.', { aliases: ['cholecystectomy'] }),
  trait('titanium_hardware', 'I have titanium plates, screws, or pins permanently inside my body', 'Has internal titanium', '🔩', 'life_randomness', 0.016, ['medical_history'], '133 million low-key cyborgs predict incoming rainstorms in their collarbone or ankle.', { aliases: ['surgical plate', 'orthopedic screws'] }),
  trait('lasik_eye_surgery', 'I have had LASIK, PRK, or ICL corrective eye surgery', 'Had LASIK / PRK', '👁️', 'life_randomness', 0.0095, ['medical_history'], '79 million former glasses-hunters can now read the shower shampoo bottle unaided.', { aliases: ['laser eye surgery'] }),
  trait('never_had_cavity', 'I have reached adulthood without ever having a dental cavity', 'Zero cavities ever', '🪥', 'life_randomness', 0.085, ['medical_history', 'genetic_quirk'], '705 million blessed enamel lottery winners make dentists suspiciously quiet.', { aliases: ['cavity free'] }),
  trait('struck_by_lightning', 'I have survived a direct or side-flash lightning strike', 'Lightning survivor', '⚡', 'life_randomness', 0.000003, ['medical_history'], 'Only ~25,000 living humans walked away after losing an argument with 300 million volts.', { aliases: ['hit by lightning'], isVerifiedExtremeRarity: true }),
  trait('leap_day_birthday', 'I was born on Leap Day (February 29)', 'Born on Feb 29', '🐸', 'life_randomness', 0.00068, ['family_structure'], '5.6 million leaplings legally turn 9 while everyone else their age hits 36.', { aliases: ['leapling', 'february 29'] }),
  trait('born_on_holiday', 'I was born on New Year’s Day, Halloween, or Dec 25', 'Major-holiday birthday', '🎂', 'life_randomness', 0.0082, ['family_structure'], '68 million humans spent childhood fighting against "combined birthday-and-holiday" gift math.', { aliases: ['christmas birthday', 'new years birthday', 'halloween birthday'] }),
  trait('saved_a_life', 'I have performed Heimlich, CPR, or water rescue that saved someone', 'Saved a human life', '🛟', 'life_randomness', 0.0035, ['medical_history'], '29 million quiet heroes happened to be standing in the exact right place at the exact right second.', { aliases: ['heimlich', 'lifeguard rescue'] }),
  trait('donated_blood_5plus', 'I have donated blood or platelets 5+ times', '5+ time blood donor', '🩸', 'life_randomness', 0.014, ['medical_history'], '116 million regulars show up voluntarily for juice boxes, cookies, and saving strangers.', { aliases: ['platelet donor', 'blood bank'] }),
  trait('bone_marrow_kidney_donor', 'I have donated bone marrow / stem cells or a living kidney', 'Stem-cell / organ donor', '❤️‍🩹', 'life_randomness', 0.00014, ['medical_history'], 'About 1.16 million extraordinary humans literally gave spare biology to keep someone else here.', { aliases: ['be the match', 'living donor'] }),
  trait('won_radio_raffle_contest', 'I have won a call-in radio contest, sweepstakes, or major raffle', 'Won radio / sweepstakes', '🎟️', 'life_randomness', 0.0085, ['collectors'], '70 million lucky callers dialed right as Caller #9 hit the switchboard.', { aliases: ['caller 9'] }),
  trait('hole_in_one_or_300_bowl', 'I have hit a golf hole-in-one OR bowled a sanctioned 275+ game', 'Hole-in-one / 275+ bowl', '⛳', 'life_randomness', 0.0009, ['athletic'], '7.5 million humans own one glorious scorecard they will casually mention until age 95.', { aliases: ['hole in one', '300 bowling'] }),
  trait('appeared_on_tv_game_show', 'I have competed on a televised quiz or game show', 'TV game-show contestant', '📺', 'life_randomness', 0.00004, ['daily_puzzle_games'], 'Roughly 330,000 living humans have smiled under studio lights while phrasing answers as a question.', { aliases: ['jeopardy contestant', 'wheel of fortune'], isVerifiedExtremeRarity: true }),
  trait('named_on_patent', 'I am a named inventor on an issued patent', 'Named patent inventor', '💡', 'life_randomness', 0.00045, ['coding_tech', 'craft_maker'], '3.7 million humans have schematic drawings filed permanently in a government patent office.', { aliases: ['uspto', 'patent holder'] }),
  trait('published_peer_reviewed', 'I have co-authored a peer-reviewed scientific or academic journal paper', 'Published peer-reviewed paper', '🔬', 'life_randomness', 0.0022, ['book_reader', 'coding_tech'], '18 million researchers have survived Reviewer #2’s passive-aggressive comments.', { aliases: ['academic paper', 'phd publication'] }),
  trait('bitten_by_venomous_creature', 'I have survived a venomous snakebite, stingray barb, or scorpion sting', 'Survived venomous bite/sting', '🦂', 'life_randomness', 0.0095, ['medical_history', 'outdoor_mountain'], '79 million humans learned firsthand why evolution gave tiny creatures warning colors.', { aliases: ['snakebite', 'stingray', 'scorpion'] }),
  trait('caught_foul_ball_drumstick', 'I caught a foul ball, hockey puck, or stage drumstick/setlist in a crowd', 'Caught ball / stage setlist', '⚾', 'life_randomness', 0.0042, ['live_music_audio', 'team_sport'], '35 million fast-reflex spectators walked home clutching stadium contraband.', { aliases: ['guitar pick', 'foul ball', 'setlist'] }),
  trait('jury_duty_verdict', 'I have served as a sworn juror all the way to a courtroom verdict', 'Served on a trial jury', '⚖️', 'life_randomness', 0.0048, ['book_reader'], '40 million citizens made it all the way past voir dire into the deliberation room.', { aliases: ['juror'] }),
  trait('changed_career_3_times', 'I have worked full-time in 3 completely unrelated industries', '3 unrelated careers', '🔀', 'life_randomness', 0.045, ['world_traveler'], '373 million nonlinear resumes make LinkedIn’s recommendation algorithm sweat.', { aliases: ['career pivot'] }),
  trait('never_gotten_speeding_ticket', 'I have driven for 10+ years without ever getting a speeding or moving ticket', '10+ yrs zero traffic tickets', '🪪', 'life_randomness', 0.062, ['automotive_mech'], '515 million smooth operators either obey every sign or possess elite sixth-sense radar.', { aliases: ['clean driving record'] }),
  trait('stranded_overnight_airport', 'I have slept on an airport terminal floor overnight due to cancellations', 'Slept on an airport floor', '🧳', 'life_randomness', 0.028, ['world_traveler'], '232 million weary travelers have used a backpack as a pillow under fluorescent Hudson News signs.', { aliases: ['flight canceled'] }),
  trait('delivered_outside_hospital', 'I was born at home, in a car, or en route rather than in a hospital room', 'Born outside a hospital', '🏡', 'life_randomness', 0.18, ['family_structure'], 'Globally ~1.5 billion living humans arrived on their own schedule far from an obstetrics ward.', { aliases: ['home birth'] }),
  trait('kept_same_best_friend_20yrs', 'I am still close with a best friend I met 20+ years ago', '20+ year best friendship', '🤝', 'life_randomness', 0.11, ['family_structure'], '913 million humans keep a vault of mutual childhood stories that must never be unsealed.', { aliases: ['childhood friend'] }),
  trait('owns_garment_15_years', 'I still regularly wear a jacket, shirt, or pair of boots I bought 15+ years ago', 'Wears 15+ yr old garment', '🧥', 'life_randomness', 0.085, ['vintage_gear'], '705 million buy-it-for-life realists refuse to retire peak stitching.', { aliases: ['bifl', 'vintage jacket'] }),
  trait('found_four_leaf_clover_3', 'I spot four-leaf clovers effortlessly whenever I glance at a lawn', 'Serial 4-leaf clover spotter', '🍀', 'life_randomness', 0.009, ['sensory_trait', 'horticulture'], '75 million visual-anomaly detectors spot broken symmetry in grass patches at walking speed.', { aliases: ['four leaf clover'] }),
  trait('witnessed_volcano_eruption', 'I have watched an active volcano erupt glowing lava in person', 'Saw active lava eruption', '🌋', 'life_randomness', 0.0038, ['world_traveler', 'outdoor_mountain'], '31.5 million humans have watched brand-new planetary crust cool in real time.', { aliases: ['kilauea', 'etna', 'iceland volcano', 'fuego'] }),
  trait('locked_keys_rescued', 'I have locked myself out on a roof, balcony, or hallway in pajamas', 'Locked out in pajamas', '🚪', 'life_randomness', 0.034, ['sleep_habit'], '282 million humbled humans have heard a deadbolt click behind them at the worst possible moment.', { aliases: ['locked out'] }),
  trait('has_no_middle_name', 'I legally have no middle name', 'No middle name', '🪪', 'life_randomness', 0.24, ['family_structure'], 'Nearly 2 billion humans leave that form box gloriously blank.', { aliases: ['two names only'], exclusiveGroup: 'middle_name_count' }),
  trait('two_plus_middle_names', 'I legally have 2 or more middle names', '2+ middle names', '🪪', 'life_randomness', 0.038, ['family_structure'], '315 million people run out of character boxes on airline boarding passes.', { aliases: ['multiple middle names'], exclusiveGroup: 'middle_name_count' }),
  trait('shared_name_parent', 'I am a II, III, IV, or Jr. named directly after a parent/grandparent', 'Jr. / II / III namesake', '🏛️', 'life_randomness', 0.019, ['family_structure'], '158 million legacy namesakes open the wrong envelope at family holidays.', { aliases: ['junior', 'the third'] }),
  trait('remembers_childhood_landline', 'I still instantly remember my childhood home’s 7- or 10-digit landline number', 'Knows childhood landline', '☎️', 'life_randomness', 0.19, ['vintage_gear'], '1.58 billion pre-smartphone brains etched one rotary/touch-tone melody into permanent ROM.', { aliases: ['landline number'] })
];

// ============================================================================
// LAYER 2: PARAMETRIC GENERATORS (Countries, Languages, Polyglot, Blood, Sports,
// Instruments, Height, Birth Month & Birth Decade)
// ============================================================================

// All 195 sovereign UN member + observer states (+ major territories = 197 entries)
// Prevalences calibrated out of 8,300,000,000 global population (clamped >= 1e-6)
const COUNTRIES = [
  ['IN', 'India', '🇮🇳', 0.177], ['CN', 'China', '🇨🇳', 0.170], ['US', 'the United States', '🇺🇸', 0.0415],
  ['ID', 'Indonesia', '🇮🇩', 0.034], ['PK', 'Pakistan', '🇵🇰', 0.0298], ['NG', 'Nigeria', '🇳🇬', 0.028],
  ['BR', 'Brazil', '🇧🇷', 0.0262], ['BD', 'Bangladesh', '🇧🇩', 0.021], ['RU', 'Russia', '🇷🇺', 0.0174],
  ['ET', 'Ethiopia', '🇪🇹', 0.0158], ['MX', 'Mexico', '🇲🇽', 0.0157], ['JP', 'Japan', '🇯🇵', 0.0148],
  ['EG', 'Egypt', '🇪🇬', 0.0139], ['PH', 'the Philippines', '🇵🇭', 0.0142], ['CD', 'DR Congo', '🇨🇩', 0.013],
  ['VN', 'Vietnam', '🇻🇳', 0.0121], ['IR', 'Iran', '🇮🇷', 0.0109], ['TR', 'Turkey', '🇹🇷', 0.0104],
  ['DE', 'Germany', '🇩🇪', 0.0102], ['TH', 'Thailand', '🇹🇭', 0.0086], ['GB', 'the United Kingdom', '🇬🇧', 0.0083],
  ['TZ', 'Tanzania', '🇹🇿', 0.0083], ['FR', 'France', '🇫🇷', 0.0080], ['ZA', 'South Africa', '🇿🇦', 0.0074],
  ['IT', 'Italy', '🇮🇹', 0.0071], ['KE', 'Kenya', '🇰🇪', 0.0068], ['MM', 'Myanmar', '🇲🇲', 0.0066],
  ['CO', 'Colombia', '🇨🇴', 0.0063], ['KR', 'South Korea', '🇰🇷', 0.0062], ['SD', 'Sudan', '🇸🇩', 0.0060],
  ['UG', 'Uganda', '🇺🇬', 0.0060], ['ES', 'Spain', '🇪🇸', 0.0058], ['DZ', 'Algeria', '🇩🇿', 0.0056],
  ['IQ', 'Iraq', '🇮🇶', 0.0055], ['AR', 'Argentina', '🇦🇷', 0.0055], ['AF', 'Afghanistan', '🇦🇫', 0.0052],
  ['YE', 'Yemen', '🇾🇪', 0.0049], ['CA', 'Canada', '🇨🇦', 0.0049], ['PL', 'Poland', '🇵🇱', 0.0046],
  ['MA', 'Morocco', '🇲🇦', 0.0046], ['AO', 'Angola', '🇦🇴', 0.0046], ['UA', 'Ukraine', '🇺🇦', 0.0045],
  ['UZ', 'Uzbekistan', '🇺🇿', 0.0044], ['MY', 'Malaysia', '🇲🇾', 0.0042], ['MZ', 'Mozambique', '🇲🇿', 0.0042],
  ['GH', 'Ghana', '🇬🇭', 0.0042], ['PE', 'Peru', '🇵🇪', 0.0042], ['SA', 'Saudi Arabia', '🇸🇦', 0.0041],
  ['MG', 'Madagascar', '🇲🇬', 0.0038], ['CI', 'Côte d’Ivoire', '🇨🇮', 0.0038], ['NP', 'Nepal', '🇳🇵', 0.0037],
  ['CM', 'Cameroon', '🇨🇲', 0.0036], ['VE', 'Venezuela', '🇻🇪', 0.0035], ['AU', 'Australia', '🇦🇺', 0.0033],
  ['NE', 'Niger', '🇳🇪', 0.0033], ['KP', 'North Korea', '🇰🇵', 0.0032], ['TW', 'Taiwan', '🇹🇼', 0.0028],
  ['ML', 'Mali', '🇲🇱', 0.0029], ['BF', 'Burkina Faso', '🇧🇫', 0.0029], ['SY', 'Syria', '🇸🇾', 0.0029],
  ['LK', 'Sri Lanka', '🇱🇰', 0.0027], ['MW', 'Malawi', '🇲🇼', 0.0026], ['ZM', 'Zambia', '🇿🇲', 0.0026],
  ['KZ', 'Kazakhstan', '🇰🇿', 0.0024], ['CL', 'Chile', '🇨🇱', 0.0024], ['RO', 'Romania', '🇷🇴', 0.0023],
  ['TD', 'Chad', '🇹🇩', 0.0023], ['SO', 'Somalia', '🇸🇴', 0.0023], ['SN', 'Senegal', '🇸🇳', 0.0022],
  ['NL', 'the Netherlands', '🇳🇱', 0.0022], ['GT', 'Guatemala', '🇬🇹', 0.0022], ['EC', 'Ecuador', '🇪🇨', 0.0022],
  ['KH', 'Cambodia', '🇰🇭', 0.0021], ['ZW', 'Zimbabwe', '🇿🇼', 0.0020], ['GN', 'Guinea', '🇬🇳', 0.0018],
  ['RW', 'Rwanda', '🇷🇼', 0.0017], ['BJ', 'Benin', '🇧🇯', 0.0017], ['BI', 'Burundi', '🇧🇮', 0.0017],
  ['BO', 'Bolivia', '🇧🇴', 0.0015], ['TN', 'Tunisia', '🇹🇳', 0.0015], ['BE', 'Belgium', '🇧🇪', 0.0014],
  ['HT', 'Haiti', '🇭🇹', 0.0014], ['JO', 'Jordan', '🇯🇴', 0.0014], ['DO', 'the Dominican Republic', '🇩🇴', 0.0014],
  ['CU', 'Cuba', '🇨🇺', 0.0013], ['SS', 'South Sudan', '🇸🇸', 0.0014], ['SE', 'Sweden', '🇸🇪', 0.0013],
  ['HN', 'Honduras', '🇭🇳', 0.0013], ['CZ', 'Czechia', '🇨🇿', 0.0013], ['AZ', 'Azerbaijan', '🇦🇿', 0.0013],
  ['GR', 'Greece', '🇬🇷', 0.00125], ['PG', 'Papua New Guinea', '🇵🇬', 0.00125], ['PT', 'Portugal', '🇵🇹', 0.00125],
  ['TJ', 'Tajikistan', '🇹🇯', 0.00125], ['HU', 'Hungary', '🇭🇺', 0.00116], ['AE', 'the UAE', '🇦🇪', 0.0012],
  ['BY', 'Belarus', '🇧🇾', 0.0011], ['IL', 'Israel', '🇮🇱', 0.00115], ['TG', 'Togo', '🇹🇬', 0.0011],
  ['AT', 'Austria', '🇦🇹', 0.0011], ['CH', 'Switzerland', '🇨🇭', 0.00108], ['SL', 'Sierra Leone', '🇸🇱', 0.00106],
  ['LA', 'Laos', '🇱🇦', 0.00093], ['HK', 'Hong Kong', '🇭🇰', 0.00090], ['NI', 'Nicaragua', '🇳🇮', 0.00086],
  ['RS', 'Serbia', '🇷🇸', 0.00082], ['LY', 'Libya', '🇱🇾', 0.00085], ['PY', 'Paraguay', '🇵🇾', 0.00084],
  ['KG', 'Kyrgyzstan', '🇰🇬', 0.00086], ['BG', 'Bulgaria', '🇧🇬', 0.00078], ['TM', 'Turkmenistan', '🇹🇲', 0.00079],
  ['SV', 'El Salvador', '🇸🇻', 0.00077], ['CG', 'Republic of the Congo', '🇨🇬', 0.00075], ['SG', 'Singapore', '🇸🇬', 0.00073],
  ['DK', 'Denmark', '🇩🇰', 0.00072], ['SK', 'Slovakia', '🇸🇰', 0.00066], ['CF', 'Central African Republic', '🇨🇫', 0.00069],
  ['FI', 'Finland', '🇫🇮', 0.00068], ['NO', 'Norway', '🇳🇴', 0.00067], ['LR', 'Liberia', '🇱🇷', 0.00067],
  ['PS', 'Palestine', '🇵🇸', 0.00066], ['LB', 'Lebanon', '🇱🇧', 0.00066], ['NZ', 'New Zealand', '🇳🇿', 0.00064],
  ['CR', 'Costa Rica', '🇨🇷', 0.00063], ['IE', 'Ireland', '🇮🇪', 0.00063], ['MR', 'Mauritania', '🇲🇷', 0.00061],
  ['OM', 'Oman', '🇴🇲', 0.00062], ['PA', 'Panama', '🇵🇦', 0.00055], ['KW', 'Kuwait', '🇰🇼', 0.00054],
  ['HR', 'Croatia', '🇭🇷', 0.00047], ['ER', 'Eritrea', '🇪🇷', 0.00045], ['GE', 'Georgia', '🇬🇪', 0.00045],
  ['MN', 'Mongolia', '🇲🇳', 0.00042], ['UY', 'Uruguay', '🇺🇾', 0.00041], ['BA', 'Bosnia and Herzegovina', '🇧🇦', 0.00038],
  ['PR', 'Puerto Rico', '🇵🇷', 0.00039], ['AM', 'Armenia', '🇦🇲', 0.00035], ['JM', 'Jamaica', '🇯🇲', 0.00034],
  ['QA', 'Qatar', '🇶🇦', 0.00034], ['AL', 'Albania', '🇦🇱', 0.00034], ['LT', 'Lithuania', '🇱🇹', 0.00034],
  ['NA', 'Namibia', '🇳🇦', 0.00033], ['GM', 'The Gambia', '🇬🇲', 0.00033], ['BW', 'Botswana', '🇧🇼', 0.00033],
  ['GA', 'Gabon', '🇬🇦', 0.00030], ['LS', 'Lesotho', '🇱🇸', 0.00028], ['MK', 'North Macedonia', '🇲🇰', 0.00025],
  ['SI', 'Slovenia', '🇸🇮', 0.00026], ['LV', 'Latvia', '🇱🇻', 0.00022], ['GW', 'Guinea-Bissau', '🇬🇼', 0.00026],
  ['GQ', 'Equatorial Guinea', '🇬🇶', 0.00021], ['BH', 'Bahrain', '🇧🇭', 0.00019], ['TT', 'Trinidad and Tobago', '🇹🇹', 0.00018],
  ['EE', 'Estonia', '🇪🇪', 0.00016], ['TL', 'Timor-Leste', '🇹🇱', 0.00017], ['MU', 'Mauritius', '🇲🇺', 0.00016],
  ['CY', 'Cyprus', '🇨🇾', 0.00015], ['SZ', 'Eswatini', '🇸🇿', 0.00015], ['DJ', 'Djibouti', '🇩🇯', 0.00014],
  ['FJ', 'Fiji', '🇫🇯', 0.00011], ['KM', 'Comoros', '🇰🇲', 0.00010], ['GY', 'Guyana', '🇬🇾', 0.00010],
  ['BT', 'Bhutan', '🇧🇹', 0.000095], ['SB', 'Solomon Islands', '🇸🇧', 0.000090], ['LU', 'Luxembourg', '🇱🇺', 0.000081],
  ['ME', 'Montenegro', '🇲🇪', 0.000075], ['SR', 'Suriname', '🇸🇷', 0.000076], ['CV', 'Cabo Verde', '🇨🇻', 0.000072],
  ['MT', 'Malta', '🇲🇹', 0.000066], ['MV', 'Maldives', '🇲🇻', 0.000064], ['BN', 'Brunei', '🇧🇳', 0.000055],
  ['BS', 'The Bahamas', '🇧🇸', 0.000050], ['BZ', 'Belize', '🇧🇿', 0.000050], ['IS', 'Iceland', '🇮🇸', 0.000047],
  ['VU', 'Vanuatu', '🇻🇺', 0.000041], ['BB', 'Barbados', '🇧🇧', 0.000034], ['ST', 'São Tomé and Príncipe', '🇸🇹', 0.000028],
  ['WS', 'Samoa', '🇼🇸', 0.000027], ['LC', 'Saint Lucia', '🇱🇨', 0.000022], ['KI', 'Kiribati', '🇰🇮', 0.000016],
  ['GD', 'Grenada', '🇬🇩', 0.000015], ['FM', 'Micronesia', '🇫🇲', 0.000014], ['VC', 'Saint Vincent & the Grenadines', '🇻🇨', 0.000013],
  ['TO', 'Tonga', '🇹🇴', 0.000013], ['SC', 'Seychelles', '🇸🇨', 0.000013], ['AG', 'Antigua and Barbuda', '🇦🇬', 0.000011],
  ['AD', 'Andorra', '🇦🇩', 0.000010], ['DM', 'Dominica', '🇩🇲', 0.000009], ['MH', 'Marshall Islands', '🇲🇭', 0.000006],
  ['KN', 'Saint Kitts and Nevis', '🇰🇳', 0.000006], ['MC', 'Monaco', '🇲🇨', 0.000005], ['LI', 'Liechtenstein', '🇱🇮', 0.000005],
  ['SM', 'San Marino', '🇸🇲', 0.000004], ['PW', 'Palau', '🇵🇼', 0.000002], ['TV', 'Tuvalu', '🇹🇻', 0.0000014],
  ['NR', 'Nauru', '🇳🇷', 0.0000015], ['VA', 'Vatican City', '🇻🇦', 0.00000015]
];

// 115 World Languages (Total fluent L1+L2 speakers / 8.3B)
const LANGUAGES = [
  ['en', 'English', 0.181], ['zh', 'Mandarin Chinese', 0.138], ['hi', 'Hindi', 0.075],
  ['es', 'Spanish', 0.068], ['fr', 'French', 0.038], ['ar', 'Arabic', 0.038],
  ['bn', 'Bengali', 0.034], ['pt', 'Portuguese', 0.032], ['ru', 'Russian', 0.031],
  ['ur', 'Urdu', 0.029], ['id', 'Indonesian', 0.025], ['de', 'German', 0.016],
  ['ja', 'Japanese', 0.015], ['sw', 'Swahili', 0.014], ['mr', 'Marathi', 0.012],
  ['te', 'Telugu', 0.0115], ['tr', 'Turkish', 0.011], ['ta', 'Tamil', 0.0105],
  ['yue', 'Cantonese', 0.0105], ['vi', 'Vietnamese', 0.0104], ['ko', 'Korean', 0.010],
  ['fa', 'Persian (Farsi)', 0.0095], ['ha', 'Hausa', 0.0095], ['it', 'Italian', 0.0082],
  ['pa', 'Punjabi', 0.014], ['jv', 'Javanese', 0.0082], ['gu', 'Gujarati', 0.0075],
  ['th', 'Thai', 0.0074], ['pl', 'Polish', 0.0055], ['yo', 'Yoruba', 0.0055],
  ['uk', 'Ukrainian', 0.0048], ['ml', 'Malayalam', 0.0046], ['kn', 'Kannada', 0.0053],
  ['or', 'Odia', 0.0045], ['my', 'Burmese', 0.0042], ['am', 'Amharic', 0.0042],
  ['su', 'Sundanese', 0.0040], ['uz', 'Uzbek', 0.0040], ['tl', 'Tagalog (Filipino)', 0.0098],
  ['nl', 'Dutch', 0.0031], ['ro', 'Romanian', 0.0030], ['ig', 'Igbo', 0.0038],
  ['ps', 'Pashto', 0.0036], ['om', 'Oromo', 0.0035], ['az', 'Azerbaijani', 0.0030],
  ['ku', 'Kurdish', 0.0028], ['ne', 'Nepali', 0.0028], ['si', 'Sinhala', 0.0023],
  ['km', 'Khmer', 0.0022], ['so', 'Somali', 0.0024], ['el', 'Greek', 0.0016],
  ['hu', 'Hungarian', 0.0016], ['cs', 'Czech', 0.0014], ['sv', 'Swedish', 0.0016],
  ['zu', 'Zulu', 0.0016], ['xh', 'Xhosa', 0.0012], ['af', 'Afrikaans', 0.0011],
  ['he', 'Hebrew', 0.00115], ['da', 'Danish', 0.00075], ['fi', 'Finnish', 0.00070],
  ['no', 'Norwegian', 0.00068], ['sk', 'Slovak', 0.00066], ['bg', 'Bulgarian', 0.00085],
  ['sr', 'Serbian', 0.0011], ['hr', 'Croatian', 0.00070], ['ca', 'Catalan', 0.0011],
  ['kk', 'Kazakh', 0.0017], ['tg', 'Tajik', 0.0011], ['ka', 'Georgian', 0.00048],
  ['hy', 'Armenian', 0.00065], ['sq', 'Albanian', 0.00075], ['lt', 'Lithuanian', 0.00036],
  ['sl', 'Slovenian', 0.00028], ['lv', 'Latvian', 0.00022], ['et', 'Estonian', 0.00014],
  ['mn', 'Mongolian', 0.00065], ['lo', 'Lao', 0.00060], ['bo', 'Tibetan', 0.00075],
  ['ug', 'Uyghur', 0.0013], ['rw', 'Kinyarwanda', 0.0016], ['sn', 'Shona', 0.0014],
  ['ny', 'Chichewa', 0.0016], ['mg', 'Malagasy', 0.0028], ['ht', 'Haitian Creole', 0.0014],
  ['qu', 'Quechua', 0.00095], ['gn', 'Guaraní', 0.00078], ['ay', 'Aymara', 0.00030],
  ['nah', 'Nahuatl', 0.00020], ['cy', 'Welsh', 0.00010], ['ga', 'Irish (Gaeilge)', 0.00022],
  ['gd', 'Scottish Gaelic', 0.000012], ['eu', 'Basque (Euskara)', 0.000095], ['gl', 'Galician', 0.00030],
  ['is', 'Icelandic', 0.000045], ['mt', 'Maltese', 0.000065], ['lb', 'Luxembourgish', 0.000050],
  ['yi', 'Yiddish', 0.00018], ['la', 'Latin (reading fluency)', 0.00015], ['grc', 'Ancient Greek (reading)', 0.00005],
  ['eo', 'Esperanto', 0.00012], ['asl', 'American Sign Language (ASL)', 0.00012],
  ['bsl', 'British Sign Language (BSL)', 0.000025], ['jsl', 'Japanese Sign Language', 0.000035],
  ['mi', 'Māori (Te Reo)', 0.000025], ['haw', 'Hawaiian (‘Ōlelo Hawai‘i)', 0.000004],
  ['nv', 'Navajo (Diné bizaad)', 0.000020], ['iu', 'Inuktitut', 0.000005], ['sm', 'Samoan', 0.000060],
  ['fj', 'Fijian', 0.000055], ['be', 'Belarusian', 0.00055], ['mk', 'Macedonian', 0.00024],
  ['ky', 'Kyrgyz', 0.00062], ['tk', 'Turkmen', 0.00075], ['ti', 'Tigrinya', 0.00095],
  ['wo', 'Wolof', 0.00095]
];

// 80 Sports (Active regular participants / 8.3B)
const SPORTS = [
  ['soccer', 'Soccer / Football', '⚽', 0.035, ['athletic', 'team_sport']],
  ['basketball', 'Basketball', '🏀', 0.032, ['athletic', 'team_sport', 'court_sport']],
  ['cricket', 'Cricket', '🏏', 0.026, ['athletic', 'team_sport']],
  ['swimming', 'Lap Swimming', '🏊', 0.038, ['athletic', 'water_sport', 'endurance_sport']],
  ['baseball_softball', 'Baseball or Softball', '⚾', 0.0095, ['athletic', 'team_sport']],
  ['golf', 'Golf', '⛳', 0.0080, ['athletic', 'outdoor_mountain']],
  ['field_hockey', 'Field Hockey', '🏑', 0.0035, ['athletic', 'team_sport']],
  ['ice_hockey', 'Ice Hockey', '🏒', 0.0022, ['athletic', 'team_sport', 'winter_sport']],
  ['rugby', 'Rugby (Union or League)', '🏉', 0.0018, ['athletic', 'team_sport']],
  ['american_football', 'American / Flag Football', '🏈', 0.0024, ['athletic', 'team_sport']],
  ['squash', 'Squash', '🎾', 0.0024, ['athletic', 'court_sport']],
  ['racquetball', 'Racquetball', '🎾', 0.0009, ['athletic', 'court_sport']],
  ['padel', 'Padel', '🎾', 0.0032, ['athletic', 'court_sport']],
  ['handball', 'Team Handball', '🤾', 0.0030, ['athletic', 'team_sport', 'court_sport']],
  ['water_polo', 'Water Polo', '🤽', 0.00022, ['athletic', 'water_sport', 'team_sport']],
  ['lacrosse', 'Lacrosse', '🥍', 0.00032, ['athletic', 'team_sport']],
  ['boxing', 'Boxing', '🥊', 0.0038, ['athletic']],
  ['muay_thai_kickboxing', 'Muay Thai / Kickboxing', '🥊', 0.0028, ['athletic']],
  ['wrestling', 'Freestyle / Folkstyle Wrestling', '🤼', 0.0019, ['athletic']],
  ['judo', 'Judo', '🥋', 0.0024, ['athletic']],
  ['powerlifting', 'Competitive / Barbell Powerlifting', '🏋️', 0.0035, ['athletic']],
  ['olympic_weightlifting', 'Olympic Weightlifting (Snatch & C&J)', '🏋️', 0.00095, ['athletic']],
  ['crossfit', 'CrossFit', '🏋️', 0.0012, ['athletic', 'endurance_sport']],
  ['gymnastics', 'Artistic Gymnastics', '🤸', 0.0018, ['athletic']],
  ['calisthenics', 'Street Workout / Calisthenics', '🤸', 0.0065, ['athletic']],
  ['pilates_reformer', 'Reformer Pilates', '🧘', 0.0038, ['athletic']],
  ['kayaking_whitewater', 'Whitewater or Sea Kayaking', '🛶', 0.0025, ['water_sport', 'outdoor_mountain']],
  ['standup_paddle', 'Stand-Up Paddleboarding (SUP)', '🏄', 0.0032, ['water_sport']],
  ['kitesurfing', 'Kitesurfing / Wingfoiling', '🪁', 0.00028, ['water_sport', 'athletic']],
  ['windsurfing', 'Windsurfing', '🏄', 0.00032, ['water_sport']],
  ['wakeboarding_waterski', 'Wakeboarding or Waterskiing', '🚤', 0.0015, ['water_sport']],
  ['open_water_swim', 'Open-Water Ocean / Lake Swimming', '🌊', 0.0028, ['water_sport', 'endurance_sport']],
  ['nordic_xc_ski', 'Cross-Country (Nordic) Skiing', '🎿', 0.0038, ['winter_sport', 'endurance_sport']],
  ['biathlon', 'Biathlon', '🎿', 0.00006, ['winter_sport', 'endurance_sport']],
  ['speed_skating', 'Long- or Short-Track Speed Skating', '⛸️', 0.00018, ['winter_sport', 'endurance_sport']],
  ['snowshoeing', 'Winter Snowshoeing', '❄️', 0.0022, ['winter_sport', 'outdoor_mountain']],
  ['roller_derby', 'Flat-Track Roller Derby', '🛼', 0.00004, ['cycling_wheeled', 'team_sport']],
  ['inline_skating', 'Inline / Rollerblading', '🛼', 0.0055, ['cycling_wheeled', 'athletic']],
  ['bmx', 'BMX Freestyle or Racing', '🚲', 0.00085, ['cycling_wheeled', 'athletic']],
  ['cyclocross', 'Cyclocross', '🚴', 0.00016, ['cycling_wheeled', 'endurance_sport']],
  ['track_velodrome', 'Velodrome Track Cycling', '🚴', 0.00008, ['cycling_wheeled', 'endurance_sport']],
  ['orienteering', 'Map-and-Compass Orienteering', '🧭', 0.00035, ['outdoor_mountain', 'endurance_sport']],
  ['trail_running', 'Mountain / Trail Running', '⛰️', 0.0042, ['outdoor_mountain', 'endurance_sport']],
  ['alpinism_mountaineering', 'Roped Glacier / Alpine Mountaineering', '⛏️', 0.00032, ['outdoor_mountain', 'winter_sport']],
  ['canyoneering', 'Slot Canyoneering / Caving', '🧗', 0.00019, ['outdoor_mountain']],
  ['paragliding', 'Paragliding or Hang Gliding', '🪂', 0.00009, ['outdoor_mountain']],
  ['skydiving', 'Licensed Solo Skydiving', '🪂', 0.00008, ['outdoor_mountain']],
  ['australian_rules', 'Australian Rules Football', '🏉', 0.00024, ['team_sport', 'athletic']],
  ['gaelic_hurling', 'Hurling or Gaelic Football', '🏑', 0.00012, ['team_sport', 'athletic']],
  ['netball', 'Netball', '🏀', 0.0024, ['team_sport', 'court_sport']],
  ['sepak_takraw', 'Sepak Takraw', '🏐', 0.00085, ['team_sport', 'court_sport']],
  ['kabaddi', 'Kabaddi', '🤼', 0.0022, ['team_sport', 'athletic']],
  ['korfball', 'Korfball', '🏀', 0.00004, ['team_sport', 'court_sport']],
  ['spikeball_roundnet', 'Spikeball / Roundnet', '🏐', 0.00095, ['athletic']],
  ['bowling_league', 'League Ten-Pin / Candlepin Bowling', '🎳', 0.0042, ['indoor_hobby']],
  ['billiards_pool', 'Competitive Pool / Snooker', '🎱', 0.0085, ['indoor_hobby']],
  ['darts_league', 'Steel-Tip League Darts', '🎯', 0.0035, ['indoor_hobby']],
  ['ballroom_swing_salsa', 'Partner Social Dance (Salsa, Swing, Ballroom)', '💃', 0.0095, ['athletic', 'musical']],
  ['ballet_modern', 'Classical Ballet or Contemporary Dance', '🩰', 0.0032, ['athletic', 'musical']],
  ['dragon_boat', 'Dragon Boat Racing', '🐉', 0.00045, ['water_sport', 'team_sport']]
];

// 52 Musical Instruments
const INSTRUMENTS = [
  ['acoustic_guitar', 'Acoustic Guitar', '🎸', 0.042],
  ['electric_guitar', 'Electric Guitar', '🎸', 0.018],
  ['bass_guitar', 'Bass Guitar', '🎸', 0.0065],
  ['piano', 'Piano / Keyboard', '🎹', 0.031],
  ['ukulele', 'Ukulele', '🪕', 0.0085],
  ['drum_kit', 'Drum Kit', '🥁', 0.0090],
  ['violin_fiddle', 'Violin / Fiddle', '🎻', 0.0055],
  ['viola', 'Viola', '🎻', 0.00065],
  ['cello', 'Cello', '🎻', 0.00090],
  ['upright_double_bass', 'Upright Double Bass', '🎻', 0.00032],
  ['flute', 'Concert Flute', '🪈', 0.0048],
  ['clarinet', 'Clarinet', '🎷', 0.0032],
  ['saxophone', 'Saxophone', '🎷', 0.0022],
  ['trumpet', 'Trumpet', '🎺', 0.0030],
  ['trombone', 'Trombone', '🎺', 0.0014],
  ['french_horn', 'French Horn', '📯', 0.00045],
  ['tuba_sousaphone', 'Tuba / Sousaphone', '🎺', 0.00032],
  ['oboe', 'Oboe', '🎶', 0.00022],
  ['bassoon', 'Bassoon', '🎶', 0.00014],
  ['banjo', '5-String or Tenor Banjo', '🪕', 0.00045],
  ['mandolin', 'Mandolin', '🪕', 0.00055],
  ['pedal_steel', 'Pedal Steel Guitar', '🎸', 0.00003],
  ['classical_harp', 'Concert or Lever Harp', '🎶', 0.00009],
  ['accordion', 'Accordion / Concertina', '🪗', 0.00085],
  ['harmonica', 'Blues / Chromatic Harmonica', '🎶', 0.0042],
  ['bagpipes', 'Highland or Uilleann Bagpipes', '🎶', 0.00006],
  ['pipe_organ', 'Church / Pipe Organ', '🎹', 0.00018],
  ['modular_synth', 'Hardware / Modular Synthesizer', '🎛️', 0.00015],
  ['theremin', 'Theremin', '🛸', 0.000006],
  ['sitar', 'Sitar', '🪕', 0.00028],
  ['tabla', 'Tabla', '🥁', 0.0012],
  ['erhu_guzheng', 'Guzheng or Erhu', '🎶', 0.0016],
  ['oud', 'Oud', '🪕', 0.00055],
  ['koto_shamisen', 'Koto or Shamisen', '🪕', 0.00022],
  ['handpan_steelpan', 'Steelpan or Handpan', '🥁', 0.00014],
  ['marimba_vibraphone', 'Marimba / Vibraphone', '🎶', 0.00024],
  ['djembe_congas', 'Djembe / Congas', '🥁', 0.0028],
  ['tin_whistle_recorder', 'Irish Tin Whistle', '🪈', 0.00085],
  ['kalimba', 'Kalimba (Thumb Piano)', '🎶', 0.0012],
  ['didgeridoo', 'Didgeridoo', '🎶', 0.00011]
];

const SOUTHERN_HEMISPHERE_CODES = new Set([
  'BR', 'ID', 'ZA', 'TZ', 'AR', 'PE', 'AO', 'MZ', 'MG', 'AU', 'MW', 'ZM', 'CL', 'ZW',
  'RW', 'BI', 'BO', 'PG', 'PY', 'NZ', 'UY', 'NA', 'BW', 'LS', 'TL', 'MU', 'SZ', 'FJ',
  'KM', 'SB', 'VU', 'WS', 'TO'
]);

const ISLAND_NATION_CODES = new Set([
  'ID', 'JP', 'PH', 'GB', 'MG', 'TW', 'LK', 'CU', 'HT', 'DO', 'PG', 'HK', 'SG', 'NZ',
  'IE', 'PR', 'JM', 'TT', 'MU', 'CY', 'FJ', 'KM', 'SB', 'CV', 'MT', 'MV', 'BS', 'IS',
  'VU', 'BB', 'ST', 'WS', 'LC', 'KI', 'GD', 'FM', 'VC', 'TO', 'SC', 'AG', 'DM', 'MH',
  'KN', 'PW', 'TV', 'NR'
]);

const HIGH_ALTITUDE_RATES = {
  LS: 0.95, BO: 0.62, BT: 0.65, RW: 0.55, ET: 0.48, AM: 0.45, EC: 0.42, KG: 0.42,
  AF: 0.38, TJ: 0.36, NP: 0.35, PE: 0.32, ZA: 0.30, MX: 0.28, KE: 0.28, CO: 0.26,
  GT: 0.35, YE: 0.34, IR: 0.22, CH: 0.08
};

// Conditional P(Language | Country) for primary & major widely-spoken languages
const COUNTRY_LANG_RATES = {
  IN: { hi: 0.44, en: 0.15, bn: 0.08, mr: 0.07, te: 0.07, ta: 0.06, gu: 0.045, ur: 0.042, kn: 0.038, or: 0.032, ml: 0.029, pa: 0.028 },
  CN: { zh: 0.81, yue: 0.055, ug: 0.009, bo: 0.005, mn: 0.004, en: 0.03 },
  US: { en: 0.92, es: 0.135, zh: 0.011, tl: 0.006, vi: 0.005, fr: 0.006, asl: 0.002 },
  ID: { id: 0.94, jv: 0.30, su: 0.14, en: 0.06 },
  PK: { ur: 0.75, pa: 0.39, ps: 0.16, en: 0.12 },
  NG: { en: 0.55, ha: 0.32, yo: 0.21, ig: 0.18 },
  BR: { pt: 0.98, en: 0.05 },
  BD: { bn: 0.98, en: 0.10 },
  RU: { ru: 0.97, en: 0.06 },
  ET: { am: 0.32, om: 0.34, so: 0.06, ti: 0.06 },
  MX: { es: 0.94, en: 0.12, nah: 0.013 },
  JP: { ja: 0.985, en: 0.08, jsl: 0.002 },
  EG: { ar: 0.98, en: 0.12 },
  PH: { tl: 0.85, en: 0.64 },
  CD: { fr: 0.51, sw: 0.28 },
  VN: { vi: 0.96, en: 0.08 },
  IR: { fa: 0.88, az: 0.16, ku: 0.09 },
  TR: { tr: 0.90, ku: 0.14, en: 0.12 },
  DE: { de: 0.95, en: 0.56, tr: 0.025 },
  TH: { th: 0.92, en: 0.10 },
  GB: { en: 0.98, cy: 0.013, gd: 0.001, bsl: 0.0025 },
  TZ: { sw: 0.90, en: 0.15 },
  FR: { fr: 0.97, en: 0.39, ar: 0.05 },
  ZA: { en: 0.31, zu: 0.25, xh: 0.16, af: 0.13 },
  IT: { it: 0.97, en: 0.34 },
  KE: { sw: 0.85, en: 0.52 },
  MM: { my: 0.78 },
  CO: { es: 0.98, en: 0.08 },
  KR: { ko: 0.985, en: 0.18 },
  SD: { ar: 0.82 },
  UG: { en: 0.45, sw: 0.35 },
  ES: { es: 0.98, ca: 0.18, gl: 0.05, eu: 0.018, en: 0.28 },
  DZ: { ar: 0.85, fr: 0.33 },
  IQ: { ar: 0.80, ku: 0.18 },
  AR: { es: 0.98, en: 0.15 },
  AF: { fa: 0.77, ps: 0.48, uz: 0.10 },
  YE: { ar: 0.98 },
  CA: { en: 0.86, fr: 0.22, zh: 0.035, pa: 0.02 },
  PL: { pl: 0.97, en: 0.37 },
  MA: { ar: 0.88, fr: 0.35 },
  AO: { pt: 0.72 },
  UA: { uk: 0.85, ru: 0.60, en: 0.18 },
  UZ: { uz: 0.85, ru: 0.25, tg: 0.05 },
  MY: { id: 0.80, en: 0.58, zh: 0.22, yue: 0.08, ta: 0.06 },
  MZ: { pt: 0.55 },
  GH: { en: 0.65 },
  PE: { es: 0.84, qu: 0.14, ay: 0.018 },
  SA: { ar: 0.92, en: 0.35 },
  MG: { mg: 0.98, fr: 0.24 },
  CI: { fr: 0.68 },
  NP: { ne: 0.78, hi: 0.25, en: 0.15 },
  CM: { fr: 0.62, en: 0.35 },
  VE: { es: 0.98 },
  AU: { en: 0.96, zh: 0.03 },
  NE: { fr: 0.18, ha: 0.55 },
  KP: { ko: 0.99 },
  TW: { zh: 0.96, en: 0.20 },
  SY: { ar: 0.92, ku: 0.08 },
  LK: { si: 0.75, ta: 0.24, en: 0.23 },
  MW: { ny: 0.68, en: 0.26 },
  KZ: { kk: 0.80, ru: 0.84 },
  CL: { es: 0.98, en: 0.12 },
  RO: { ro: 0.94, hu: 0.06, en: 0.31 },
  SO: { so: 0.95, ar: 0.15 },
  SN: { wo: 0.80, fr: 0.36 },
  NL: { nl: 0.96, en: 0.90, de: 0.55 },
  GT: { es: 0.82 },
  EC: { es: 0.94, qu: 0.05 },
  KH: { km: 0.96 },
  ZW: { sn: 0.72, en: 0.65 },
  RW: { rw: 0.98, en: 0.18, fr: 0.12, sw: 0.15 },
  BO: { es: 0.84, qu: 0.18, ay: 0.11 },
  TN: { ar: 0.96, fr: 0.52 },
  BE: { nl: 0.59, fr: 0.42, de: 0.12, en: 0.60 },
  HT: { ht: 0.98, fr: 0.42 },
  JO: { ar: 0.96, en: 0.35 },
  DO: { es: 0.97 },
  CU: { es: 0.99 },
  SE: { sv: 0.95, en: 0.86 },
  HN: { es: 0.97 },
  CZ: { cs: 0.96, sk: 0.18, en: 0.32 },
  AZ: { az: 0.92, ru: 0.30 },
  GR: { el: 0.97, en: 0.51 },
  PT: { pt: 0.97, en: 0.38 },
  TJ: { tg: 0.85, ru: 0.28 },
  HU: { hu: 0.98, en: 0.25 },
  AE: { ar: 0.45, en: 0.78, hi: 0.30, ur: 0.22, tl: 0.08 },
  BY: { ru: 0.88, be: 0.48 },
  IL: { he: 0.88, ar: 0.21, en: 0.72, ru: 0.14 },
  AT: { de: 0.96, en: 0.62 },
  CH: { de: 0.65, fr: 0.24, it: 0.09, en: 0.55 },
  LA: { lo: 0.75 },
  HK: { yue: 0.90, en: 0.54, zh: 0.48 },
  NI: { es: 0.96 },
  RS: { sr: 0.95, en: 0.38 },
  LY: { ar: 0.95 },
  PY: { es: 0.90, gn: 0.78 },
  KG: { ky: 0.78, ru: 0.45 },
  BG: { bg: 0.92, en: 0.28 },
  TM: { tk: 0.86, ru: 0.22 },
  SV: { es: 0.98 },
  SG: { en: 0.88, zh: 0.55, id: 0.12, ta: 0.05 },
  DK: { da: 0.96, en: 0.86, de: 0.45 },
  SK: { sk: 0.92, cs: 0.35, hu: 0.08, en: 0.28 },
  FI: { fi: 0.91, sv: 0.06, en: 0.74 },
  NO: { no: 0.96, en: 0.88 },
  LB: { ar: 0.95, fr: 0.45, en: 0.45 },
  NZ: { en: 0.96, mi: 0.04 },
  CR: { es: 0.97, en: 0.18 },
  IE: { en: 0.98, ga: 0.12 },
  OM: { ar: 0.82, en: 0.40 },
  PA: { es: 0.94, en: 0.18 },
  KW: { ar: 0.78, en: 0.55 },
  HR: { hr: 0.96, en: 0.49 },
  ER: { ti: 0.60, ar: 0.35 },
  GE: { ka: 0.88, ru: 0.35 },
  MN: { mn: 0.96 },
  UY: { es: 0.98 },
  BA: { sr: 0.94, hr: 0.94 },
  PR: { es: 0.95, en: 0.32 },
  AM: { hy: 0.97, ru: 0.50 },
  JM: { en: 0.97 },
  QA: { ar: 0.45, en: 0.75, hi: 0.22 },
  AL: { sq: 0.97, it: 0.28 },
  LT: { lt: 0.92, ru: 0.50, en: 0.38 },
  MK: { mk: 0.72, sq: 0.25 },
  SI: { sl: 0.94, en: 0.59 },
  LV: { lv: 0.86, ru: 0.55, en: 0.46 },
  EE: { et: 0.84, ru: 0.45, en: 0.50 },
  CY: { el: 0.78, tr: 0.18, en: 0.73 },
  FJ: { en: 0.75, fj: 0.55, hi: 0.35 },
  LU: { lb: 0.75, fr: 0.92, de: 0.82, en: 0.70 },
  MT: { mt: 0.90, en: 0.88, it: 0.55 },
  IS: { is: 0.96, en: 0.88, da: 0.45 },
  WS: { sm: 0.92, en: 0.60 }
};

function buildCountryConditionals(code) {
  const cond = {};
  const langMap = COUNTRY_LANG_RATES[code];
  if (langMap) {
    for (const [lCode, rate] of Object.entries(langMap)) {
      cond['speaks_' + lCode] = rate;
    }
  }
  if (ISLAND_NATION_CODES.has(code)) {
    cond['lived_on_island'] = 1.0;
  }
  if (SOUTHERN_HEMISPHERE_CODES.has(code)) {
    cond['southern_hemisphere_native'] = 0.90;
  }
  if (HIGH_ALTITUDE_RATES[code]) {
    cond['lives_above_5000ft'] = HIGH_ALTITUDE_RATES[code];
  }
  if (code === 'IN') {
    cond['vegetarian'] = 0.32;
  }
  return Object.keys(cond).length > 0 ? cond : undefined;
}

const PARAMETRIC_GENERATORS = [
  {
    id: 'home_country',
    title: 'I live in [Country]',
    promptPrefix: 'I live in',
    emoji: '🌍',
    category: 'travel_geography',
    exclusiveGroup: 'home_country',
    clusterTags: ['world_traveler'],
    searchTriggers: ['live in', 'from', 'country', 'citizen of', 'resident of'],
    options: COUNTRIES.map(([code, name, flag, prev]) => {
      const cond = buildCountryConditionals(code);
      return {
        key: code.toLowerCase(),
        canonicalSlug: 'lives_in_' + code.toLowerCase(),
        label: 'I live in ' + name,
        shortBadge: 'Lives in ' + name.replace(/^the\s+/i, ''),
        emoji: flag,
        prevalence: Math.max(1e-7, prev),
        ...(cond ? { cond } : {}),
        snarkNote:
          prev >= 0.03
            ? 'You share a national census box with hundreds of millions of neighbors.'
            : prev >= 0.002
              ? 'Solid geographic cut — down to one nation’s slice of the planet.'
              : 'Small-nation statistical leverage unlocked.'
      };
    })
  },
  {
    id: 'speaks_language',
    title: 'I speak [Language]',
    promptPrefix: 'I speak',
    emoji: '🗣️',
    category: 'skills_craft',
    clusterTags: ['polyglot'],
    searchTriggers: ['speak', 'fluent in', 'language'],
    options: LANGUAGES.map(([code, name, prev]) => ({
      key: code,
      canonicalSlug: 'speaks_' + code,
      label: 'I speak ' + name,
      shortBadge: 'Speaks ' + name,
      emoji: '🗣️',
      prevalence: prev,
      snarkNote:
        prev >= 0.05
          ? 'One of Earth’s mega-languages — hundreds of millions can eavesdrop on you.'
          : prev >= 0.002
            ? 'Nice linguistic filter across global borders.'
            : 'Rare tongue — huge entropy boost.'
    }))
  },
  {
    id: 'polyglot_count',
    title: 'I speak [2 / 3 / 4 / 5+] languages conversationally',
    promptPrefix: 'I speak',
    emoji: '🌐',
    category: 'skills_craft',
    exclusiveGroup: 'polyglot_count',
    clusterTags: ['polyglot'],
    searchTriggers: ['bilingual', 'trilingual', 'polyglot', 'languages'],
    options: [
      {
        key: '2plus',
        canonicalSlug: 'speaks_2plus_languages',
        label: 'I speak 2+ languages conversationally',
        shortBadge: 'Bilingual (2+ langs)',
        emoji: '🌐',
        prevalence: 0.43,
        snarkNote: 'Globally, bilingualism is basically a coin flip (~3.6 billion humans).'
      },
      {
        key: '3plus',
        canonicalSlug: 'speaks_3plus_languages',
        label: 'I speak 3+ languages conversationally',
        shortBadge: 'Trilingual (3+ langs)',
        emoji: '🌐',
        prevalence: 0.13,
        subsumes: ['speaks_2plus_languages'],
        snarkNote: 'About 1 in 8 humans can switch syntax three ways without crashing.'
      },
      {
        key: '4plus',
        canonicalSlug: 'speaks_4plus_languages',
        label: 'I speak 4+ languages conversationally',
        shortBadge: 'Speaks 4+ languages',
        emoji: '🌐',
        prevalence: 0.03,
        subsumes: ['speaks_3plus_languages', 'speaks_2plus_languages'],
        snarkNote: '250 million brains juggle four vocabulary tables simultaneously.'
      },
      {
        key: '5plus',
        canonicalSlug: 'speaks_5plus_languages',
        label: 'I speak 5 or more languages conversationally',
        shortBadge: 'Polyglot (5+ langs)',
        emoji: '🌐',
        prevalence: 0.008,
        subsumes: ['speaks_4plus_languages', 'speaks_3plus_languages', 'speaks_2plus_languages'],
        snarkNote: '66 million certified polyglots sometimes forget which language they dreamed in.'
      }
    ]
  },
  {
    id: 'blood_type',
    title: 'My blood type is [Blood Type]',
    promptPrefix: 'My blood type is',
    emoji: '🩸',
    category: 'genetics_physiology',
    exclusiveGroup: 'blood_type',
    clusterTags: ['genetic_quirk'],
    searchTriggers: ['blood type', 'o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'],
    options: [
      { key: 'o_pos', canonicalSlug: 'blood_o_pos', label: 'My blood type is O+', shortBadge: 'Blood type O+', emoji: '🩸', prevalence: 0.38, snarkNote: 'Earth’s default factory preset — shared with 3.15 billion humans.' },
      { key: 'a_pos', canonicalSlug: 'blood_a_pos', label: 'My blood type is A+', shortBadge: 'Blood type A+', emoji: '🩸', prevalence: 0.28, snarkNote: '2.3 billion humans carry the A-positive antigen.' },
      { key: 'b_pos', canonicalSlug: 'blood_b_pos', label: 'My blood type is B+', shortBadge: 'Blood type B+', emoji: '🩸', prevalence: 0.21, snarkNote: '1.74 billion humans — especially common across South and Central Asia.' },
      { key: 'ab_pos', canonicalSlug: 'blood_ab_pos', label: 'My blood type is AB+', shortBadge: 'Blood type AB+', emoji: '🩸', prevalence: 0.05, snarkNote: 'Universal red-cell recipient — 415 million people gladly accept donations from everyone.' },
      { key: 'o_neg', canonicalSlug: 'blood_o_neg', label: 'My blood type is O−', shortBadge: 'Blood type O−', emoji: '🩸', prevalence: 0.025, snarkNote: 'Universal red-cell donor — ~207 million humans worldwide.' },
      { key: 'a_neg', canonicalSlug: 'blood_a_neg', label: 'My blood type is A−', shortBadge: 'Blood type A−', emoji: '🩸', prevalence: 0.025, snarkNote: 'Just 2.5% of the planet shares A-negative.' },
      { key: 'b_neg', canonicalSlug: 'blood_b_neg', label: 'My blood type is B−', shortBadge: 'Blood type B−', emoji: '🩸', prevalence: 0.014, snarkNote: '116 million humans carry B-negative.' },
      { key: 'ab_neg', canonicalSlug: 'blood_ab_neg', label: 'My blood type is AB−', shortBadge: 'Blood type AB−', emoji: '🩸', prevalence: 0.006, snarkNote: 'The rarest standard ABO/Rh blood type on Earth (~50 million people).' }
    ]
  },
  {
    id: 'plays_sport_param',
    title: 'I play [Sport]',
    promptPrefix: 'I practice',
    emoji: '🏅',
    category: 'sports_movement',
    clusterTags: ['athletic'],
    searchTriggers: ['sport', 'play', 'practice', 'compete'],
    options: SPORTS.map(([slug, name, emoji, prev, tags]) => ({
      key: slug,
      canonicalSlug: 'sport_param_' + slug,
      label: 'I play or practice ' + name,
      shortBadge: name,
      emoji,
      prevalence: prev,
      clusterTags: tags,
      snarkNote: 'Narrows the athletic pool to the ~' + Math.round(prev * 8300000000).toLocaleString('en-US') + ' regular ' + name + ' participants globally.'
    }))
  },
  {
    id: 'plays_instrument',
    title: 'I play [Musical Instrument]',
    promptPrefix: 'I play the',
    emoji: '🎸',
    category: 'skills_craft',
    clusterTags: ['musical'],
    searchTriggers: ['instrument', 'play the', 'musician'],
    options: INSTRUMENTS.map(([slug, name, emoji, prev]) => ({
      key: slug,
      canonicalSlug: 'instrument_' + slug,
      label: 'I play the ' + name,
      shortBadge: 'Plays ' + name,
      emoji,
      prevalence: prev,
      snarkNote:
        prev >= 0.02
          ? 'Campfires and living rooms around the globe are well-stocked with ' + name + ' players.'
          : 'Distinctive instrument — narrows down to ~' + Math.round(prev * 8300000000).toLocaleString('en-US') + ' players globally.'
    }))
  },
  {
    id: 'height_bracket',
    title: 'My height is [Height]',
    promptPrefix: 'My height is',
    emoji: '📏',
    category: 'genetics_physiology',
    exclusiveGroup: 'height_bracket',
    clusterTags: ['genetic_quirk'],
    searchTriggers: ['height', 'tall', 'short', 'cm', 'feet'],
    options: [
      { key: 'under_152', canonicalSlug: 'height_under_152cm', label: 'I am an adult under 5\'0" (152 cm)', shortBadge: 'Height <5\'0" (152cm)', emoji: '📏', prevalence: 0.065, snarkNote: 'Every airplane economy seat feels marginally closer to business class.' },
      { key: '152_160', canonicalSlug: 'height_152_160cm', label: 'My height is 5\'0"–5\'3" (152–160 cm)', shortBadge: '5\'0"–5\'3" (152–160cm)', emoji: '📏', prevalence: 0.19, snarkNote: 'Right in the global human heartland — 1.58 billion adults see eye-to-eye with you.' },
      { key: '161_168', canonicalSlug: 'height_161_168cm', label: 'My height is 5\'3.5"–5\'6" (161–168 cm)', shortBadge: '5\'4"–5\'6" (161–168cm)', emoji: '📏', prevalence: 0.24, snarkNote: 'Nearly a quarter of humanity shares your exact mirror height.' },
      { key: '169_176', canonicalSlug: 'height_169_176cm', label: 'My height is 5\'6.5"–5\'9" (169–176 cm)', shortBadge: '5\'7"–5\'9" (169–176cm)', emoji: '📏', prevalence: 0.22, snarkNote: 'Global median territory — clothing racks were literally calibrated for you.' },
      { key: '177_184', canonicalSlug: 'height_177_184cm', label: 'My height is 5\'9.5"–6\'0.5" (177–184 cm)', shortBadge: '5\'10"–6\'0" (177–184cm)', emoji: '📏', prevalence: 0.13, snarkNote: 'Tall enough to grab top-shelf jars, short enough to clear cellar doorways.' },
      { key: '185_192', canonicalSlug: 'height_185_192cm', label: 'My height is 6\'1"–6\'3.5" (185–192 cm)', shortBadge: '6\'1"–6\'3" (185–192cm)', emoji: '📏', prevalence: 0.032, snarkNote: '265 million humans — people behind you at concerts quietly sigh.' },
      { key: '193_198', canonicalSlug: 'height_193_198cm', label: 'My height is 6\'4"–6\'6" (193–198 cm)', shortBadge: '6\'4"–6\'6" (193–198cm)', emoji: '📏', prevalence: 0.0045, snarkNote: '37 million humans get asked daily whether they played basketball.' },
      { key: 'over_198', canonicalSlug: 'height_over_198cm', label: 'My height is over 6\'6" (199+ cm)', shortBadge: 'Over 6\'6" (199+ cm)', emoji: '📏', prevalence: 0.0006, snarkNote: 'Barely 5 million humans on Earth share your stratosphere and exit-row necessity.' }
    ]
  },
  {
    id: 'birth_month',
    title: 'I was born in [Month]',
    promptPrefix: 'I was born in',
    emoji: '📅',
    category: 'life_randomness',
    exclusiveGroup: 'birth_month',
    clusterTags: ['family_structure'],
    searchTriggers: ['born in', 'birthday month', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    options: [
      ['jan', 'January', 0.082], ['feb', 'February', 0.076], ['mar', 'March', 0.083],
      ['apr', 'April', 0.081], ['may', 'May', 0.083], ['jun', 'June', 0.082],
      ['jul', 'July', 0.086], ['aug', 'August', 0.088], ['sep', 'September', 0.091],
      ['oct', 'October', 0.086], ['nov', 'November', 0.081], ['dec', 'December', 0.081]
    ].map(([k, m, prev]) => ({
      key: k,
      canonicalSlug: 'born_month_' + k,
      label: 'I was born in ' + m,
      shortBadge: m + ' birthday',
      emoji: '📅',
      prevalence: prev,
      snarkNote:
        k === 'sep'
          ? 'September is Earth’s busiest birth month (~755 million people). Do the nine-month math.'
          : 'Clean ~1-in-12 slice of the global calendar (~' + Math.round(prev * 8300) + 'M humans).'
    }))
  },
  {
    id: 'birth_decade',
    title: 'I was born in the [Decade]',
    promptPrefix: 'I was born in the',
    emoji: '⏳',
    category: 'life_randomness',
    exclusiveGroup: 'birth_decade',
    clusterTags: ['family_structure'],
    searchTriggers: ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', 'decade', 'age'],
    options: [
      ['1930s', '1930s (or earlier)', 0.008, 'Part of the top 0.8% longest-running humans currently on Earth.'],
      ['1940s', '1940s', 0.028, '232 million humans remember a world before commercial satellites.'],
      ['1950s', '1950s', 0.068, '564 million humans arrived during the mid-century boom.'],
      ['1960s', '1960s', 0.098, '813 million humans share the Apollo-era birth cohort.'],
      ['1970s', '1970s', 0.122, '1.01 billion humans remember cassette tapes and No. 2 pencil rewinding.'],
      ['1980s', '1980s', 0.148, '1.23 billion humans straddled analog childhood and dial-up adolescence.'],
      ['1990s', '1990s', 0.162, '1.34 billion 90s babies make up one of Earth’s largest adult cohorts.'],
      ['2000s', '2000s', 0.166, '1.38 billion humans never lived in a century starting with 19.'],
      ['2010s', '2010s', 0.165, '1.37 billion humans grew up thinking every glass screen should swipe.']
    ].map(([k, label, prev, snark]) => ({
      key: k,
      canonicalSlug: 'born_decade_' + k,
      label: 'I was born in the ' + label,
      shortBadge: 'Born in ' + k,
      emoji: '⏳',
      prevalence: prev,
      snarkNote: snark
    }))
  }
];

// ============================================================================
// VALIDATE ALL CURATED & PARAMETRIC ITEMS STRICTLY AGAINST CLOSED TAXONOMY
// ============================================================================
const validCategories = new Set(Taxonomy.CATEGORIES.map((c) => c.id));
const seenSlugs = new Set();

for (const t of CORE_TRAITS) {
  if (seenSlugs.has(t.canonicalSlug)) {
    throw new Error('Duplicate core canonicalSlug: ' + t.canonicalSlug);
  }
  seenSlugs.add(t.canonicalSlug);

  if (!validCategories.has(t.category)) {
    throw new Error('Invalid category on ' + t.canonicalSlug + ': ' + t.category);
  }
  if (!Array.isArray(t.clusterTags) || t.clusterTags.length < 1 || t.clusterTags.length > 3) {
    throw new Error('clusterTags must have 1..3 tags on ' + t.canonicalSlug);
  }
  for (const tag of t.clusterTags) {
    if (!Taxonomy.isValidClusterTag(tag)) {
      throw new Error('Invalid clusterTag "' + tag + '" on ' + t.canonicalSlug);
    }
  }
  if (!(t.prevalence > 0 && t.prevalence < 1)) {
    throw new Error('Invalid prevalence on ' + t.canonicalSlug + ': ' + t.prevalence);
  }
  if (!t.isVerifiedExtremeRarity && t.prevalence < 1e-7) {
    throw new Error('Prevalence below 1e-7 without extreme rarity flag on ' + t.canonicalSlug);
  }
}

let totalParametricOptions = 0;
for (const gen of PARAMETRIC_GENERATORS) {
  if (!validCategories.has(gen.category)) {
    throw new Error('Invalid generator category: ' + gen.id);
  }
  for (const tag of gen.clusterTags) {
    if (!Taxonomy.isValidClusterTag(tag)) {
      throw new Error('Invalid generator clusterTag "' + tag + '" on ' + gen.id);
    }
  }
  for (const opt of gen.options) {
    totalParametricOptions += 1;
    if (seenSlugs.has(opt.canonicalSlug)) {
      throw new Error('Duplicate parametric canonicalSlug: ' + opt.canonicalSlug);
    }
    seenSlugs.add(opt.canonicalSlug);
    const optTags = opt.clusterTags || gen.clusterTags;
    for (const tag of optTags) {
      if (!Taxonomy.isValidClusterTag(tag)) {
        throw new Error('Invalid option clusterTag "' + tag + '" on ' + opt.canonicalSlug);
      }
    }
  }
}

fs.mkdirSync(DATA_DIR, { recursive: true });

const coreJson = JSON.stringify({ version: '2.0', traits: CORE_TRAITS });
const paramJson = JSON.stringify({ version: '2.0', generators: PARAMETRIC_GENERATORS });

fs.writeFileSync(path.join(DATA_DIR, 'traits-core.json'), coreJson, 'utf8');
fs.writeFileSync(path.join(DATA_DIR, 'traits-parametric.json'), paramJson, 'utf8');

const coreGz = zlib.gzipSync(coreJson).length;
const paramGz = zlib.gzipSync(paramJson).length;

console.log(
  `[Seed Builder] Generated ${CORE_TRAITS.length} curated traits (${(coreGz / 1024).toFixed(1)} KB gzipped) ` +
    `and ${PARAMETRIC_GENERATORS.length} parametric generators with ${totalParametricOptions} base options ` +
    `(${(paramGz / 1024).toFixed(1)} KB gzipped). Total seed payload: ${((coreGz + paramGz) / 1024).toFixed(1)} KB gzipped.`
);
