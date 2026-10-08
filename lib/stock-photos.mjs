/** Licensed stock photography (Unsplash License: free commercial use, no attribution required;
 * credited here and in docs/IMAGE_CREDITS.md as good practice). Files live in public/media/stock
 * as <key>-640.webp, <key>-1280.webp and, where noted, <key>-1672.webp. */
export const stockPhotos = {
 photography:{w:2000,h:1430,alt:'A photographer shooting with a telephoto lens at an outdoor event',credit:'Joshua Hanson',id:'1567531708788-4c44105d00ff'},
 film:{w:2000,h:1334,alt:'A filmmaker kneeling to frame a shot with a cinema camera',credit:'CineDirektor FILMS',id:'1597511821783-df92a3ccea36'},
 design:{w:2000,h:2500,alt:'A designer sketching on a drawing tablet in a bright studio',credit:'TourBox',id:'1744686909434-fd158fca1c35'},
 writing:{w:2000,h:1330,alt:'A writer working on a laptop by a window',credit:'Daniel Thomas',id:'1604933762021-54a5858c9832'},
 sound:{w:2000,h:1333,alt:'A studio condenser microphone in a dark recording booth',credit:'Jonathan Velasquez',id:'1478737270239-2f02b77fc618'},
 animation:{w:2000,h:1333,alt:'A motion artist building a 3D scene across two monitors',credit:'Ion Sipilov',id:'1547194936-28214bd75193'},
 'creator-painter':{w:2000,h:1333,large:true,alt:'An artist seated beside his painting on an easel',credit:'One Zone Studio',id:'1541519230324-f6779f9f4a48'},
 tailor:{w:2000,h:1333,large:true,alt:'A tailor at his sewing machine checking an order on his phone',credit:'Ali Mkumbwa',id:'1687422809069-0fa3546b8471'},
 'lake-malawi':{w:2000,h:1500,large:true,alt:'Sunset over Lake Malawi with fishing boats on the water',credit:'Gift Bwanali',id:'1663506501703-94e951c561ea'},
 'creative-team':{w:2000,h:1333,large:true,alt:'A creative team talking through a brief together in a studio',credit:'Iwaria',id:'1655720357872-ce227e4164ba'},
 'portrait-artist':{w:2000,h:3557,alt:'An artist drawing a detailed charcoal portrait',credit:'Dapo Abideen',id:'1611414779790-abb3e1ec462e'},
 strategy:{w:2000,h:1333,alt:'Two colleagues reviewing work together on a laptop',credit:'Unsplash contributor',id:'1531482615713-2afd69097998'},
 'production-crew':{w:2000,h:1333,alt:'A small film crew setting up a camera on a tripod',credit:'Dwayne Joe',id:'1761853142468-c6ff2267a517'},
 social:{w:2000,h:1335,alt:'A woman filming herself on her phone against a bright yellow backdrop',credit:'Ahmed Nasiru',id:'1680878790148-18c83f270499'},
 'brand-swatches':{w:2000,h:2500,alt:'Colour swatches and brand design work spread across a desk',credit:'Balázs Kétyi',id:'1561070791-2526d30994b5'},
 'market-day':{w:2000,h:2499,large:true,alt:'A busy open-air market with stalls of fresh tomatoes and produce',credit:'Tunde Buremo',id:'1734255026082-82fdc81991f0'},
 shopkeeper:{w:2000,h:1333,large:true,alt:'A smiling shopkeeper behind the counter of her well-stocked shop',credit:'Ali Mkumbwa',id:'1687422808311-a776f467a468'},
 'vendor-phone':{w:2000,h:1429,large:true,alt:'A market vendor in a yellow headscarf smiling as she uses her phone at her stall',credit:'Ali Mkumbwa',id:'1687422809654-579d81c29d32'},
 'market-vendor':{w:2000,h:1335,large:true,alt:'A cheerful market trader giving a thumbs up beside his stall',credit:'Ali Mkumbwa',id:'1687422808565-929533931584'},
 'fashion-print':{w:2000,h:3000,large:true,alt:'A fashion designer screen-printing a pattern onto fabric in his studio',credit:'Dwayne Joe',id:'1785829413475-3e6fb2c67210'},
 'selfie-studio':{w:2000,h:1335,large:true,alt:'A woman in a patterned dress filming herself on her phone against a pink backdrop',credit:'Ahmed Nasiru',id:'1680879275304-bbe20f7e28fb'},
 'portrait-blue':{w:2000,h:2500,large:true,alt:'A portrait of a woman in a vivid blue headwrap and beads',credit:'Eze Joseph',id:'1784904935281-120eff6452fc'},
 'interview-shoot':{w:2000,h:1125,large:true,alt:'A filmmaker recording an interview with a camera on a tripod',credit:'Rene Ranisch',id:'1633340780424-08f526dbe30a'},
 'strategy-session':{w:2000,h:3000,large:true,alt:'A team gathered around a whiteboard table mapping out ideas',credit:'sammy swae',id:'1778824717987-7a135889e928'},
 'market-aerial':{w:2000,h:3000,large:true,alt:'An aerial view of a crowded market with colourful produce',credit:'Ingeborg Korme',id:'1734866660928-f7cd6e1b90f9'},
 'studio-mic':{w:2000,h:1333,large:true,alt:'A studio microphone and headphones in front of a recording setup',credit:'Will Francis',id:'1589903308904-1010c2294adc'},
 'creator-phone':{w:2000,h:1333,large:true,alt:'A content creator in sunglasses taking a selfie with her phone',credit:'Valdhy Mbemba',id:'1666041758640-a91570754260'},
};

export function stockSrc(key,width=1280){return `/media/stock/${key}-${width}.webp`;}
export function stockSrcSet(key){const p=stockPhotos[key];return [640,1280,...(p?.large?[1672]:[])].map(w=>`${stockSrc(key,w)} ${w}w`).join(', ');}
