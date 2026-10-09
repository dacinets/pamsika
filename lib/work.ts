// Commissioned client work. Unlike the concepts in campaigns.ts, these are real, approved projects.
export type ClientWork={slug:string;client:string;title:string;category:string;location:string;year:string;image:string;alt:string;description:string;
 film:{src:string;vertical:string;captions:string;poster:string;duration:string};
 brief:string;challenges:{title:string;text:string}[];approach:{title:string;text:string}[];stills:{image:string;alt:string;caption:string}[];
 values:{value:string;how:string}[];services:string[];deliverables:string[];note:string};
const base='/media/work/belle-afrique';
export const clientWork:ClientWork[]=[
 {slug:'belle-afrique-laser',client:'Belle Afrique Private Wellness',title:'Tuned to you.',category:'Launch film',location:'Lilongwe',year:'2026',image:`${base}/poster`,alt:'A woman with deep brown skin gently touches her smooth shoulder in a warmly lit treatment room',
  description:'A launch film for Belle Afrique’s four-wavelength diode laser, made to explain an advanced treatment simply and win the trust of a discerning audience.',
  film:{src:`${base}/film-16x9.mp4`,vertical:`${base}/film-9x16.mp4`,captions:`${base}/captions.vtt`,poster:`${base}/poster-1672.webp`,duration:'1 min 37 s'},
  brief:'Belle Afrique Private Wellness brought advanced four-wavelength diode laser hair reduction to Lilongwe. They asked for a commercial that would introduce it to upscale professionals and expatriates in Malawi, bring their photographs to life with strong sound design and voice-over, and let their founder, Lee Billy Chisale, speak for the clinic herself.',
  challenges:[
   {title:'Numbers mean nothing to most people',text:'“755, 808, 940 and 1064 nanometres” is the clinic’s real advantage, but to someone without a skin-care background it is just a list of numbers.'},
   {title:'A sceptical, premium audience',text:'Professionals and expatriates have seen plenty of “laser hair removal” offers. They respond to expertise, privacy and honesty, not hype.'},
   {title:'Still photographs only',text:'The starting material was a set of photographs of the clinic and its equipment, with no film footage.'},
   {title:'Claims that must stay honest',text:'Laser treatment reduces hair rather than removing it for good, results vary, and every new client needs a consultation and a patch test first.'},
  ],
  approach:[
   {title:'One clear idea',text:'We built the film around the clinic’s own promise: four wavelengths, one individual treatment plan. The story is about light tuned to the person, not one setting for everyone.'},
   {title:'Science in plain language',text:'An animated cross-section of the skin shows how laser light reaches the pigment in the hair root and weakens it. Each wavelength is given an everyday meaning, from “fine hair near the surface” to “deepest reach, for darker skin tones”.'},
   {title:'Stills brought to life',text:'Slow camera moves, light and depth turn the clinic’s photographs into film. We wrote prompts for AI-generated scenes of the treatment, the consultation and the confidence it gives back, and graded everything to the same warm look so it cuts together.'},
   {title:'The founder, in her own words',text:'Lee Billy Chisale speaks for the clinic in her own voice: “We don’t treat everybody with the same setting. We assess, we test, and we design the treatment around your skin.”'},
   {title:'Sound designed for calm',text:'An original score, a tone for each wavelength and a warm narrator give the film the quiet, unhurried feel of the clinic itself. The music was composed for the film, so there are no licensing limits.'},
   {title:'Honest by design',text:'Every claim comes from Belle Afrique’s own copy. The film says “hair reduction”, notes that results vary, and makes the consultation and patch test part of the story rather than small print.'},
  ],
  stills:[
   {image:`${base}/treatment`,alt:'A gloved therapist glides a white laser handpiece along a client’s leg',caption:'The treatment, shown calmly and precisely.'},
   {image:`${base}/how-it-works`,alt:'Animated skin cross-section with a beam of light reaching a glowing hair root',caption:'How it works, in plain language.'},
   {image:`${base}/wavelengths`,alt:'Four beams at 755, 808, 940 and 1064 nanometres reaching different depths of the skin',caption:'Four wavelengths, each with an everyday meaning.'},
   {image:`${base}/founder`,alt:'Founder Lee Billy Chisale speaking in her treatment room',caption:'Lee Billy Chisale, speaking for her clinic.'},
   {image:`${base}/end-card`,alt:'Belle Afrique end card with booking details',caption:'A clear call to book, with every way to reach the clinic.'},
  ],
  values:[
   {value:'Helping Malawian businesses grow',how:'The film is built to get the clinic understood and to drive consultation bookings, not just to look good.'},
   {value:'Keeping local identity at the centre',how:'Malawian faces, darker skin tones and Belle Afrique’s own rooms in Lilongwe lead the film.'},
   {value:'Using AI with human purpose',how:'AI scenes set the mood, while the facts, the founder and the space are real.'},
   {value:'Sharing international work standards',how:'Cinema-grade pacing, typography and sound, delivered in widescreen and vertical.'},
  ],
  services:['Creative direction','Scriptwriting','Motion design','AI video direction','Voice-over','Original music and sound design','Editing'],
  deliverables:['1 min 37 s launch film (16:9)','Vertical cut for Instagram, TikTok and WhatsApp status (9:16)','Broadcast-quality masters'],
  note:'Laser hair reduction. Individual results vary. A consultation and patch test are required. The film includes AI-generated scenes.'},
];
