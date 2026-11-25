// User-supplied Crown of Nations score. No network requests until audio is unlocked.
const root='assets/audio/music/';
const path=id=>root+id+'.mp3';
export const SOUNDTRACK=Object.freeze({
 menu:['main_theme','main_theme_alt'],
 europe:['campaign_europe','main_theme_alt','main_theme'],
 india:['campaign_india','main_theme_alt','main_theme'],
 eastAsia:['campaign_east_asia','main_theme_alt','main_theme'],
 general:['main_theme_alt','main_theme'],
 war:['warfare_1','warfare_2'],
 intrigue:['intrigue_1','intrigue_2'],
 succession:['succession_1','succession_2']
});
const indian=new Set('delhi vijayanagara bahmani gujarat malwa bengal mewar jaipur kashmir sindh orissa nepal'.split(' '));
const east=new Set('ming joseon ashikaga ayutthaya dai-viet majapahit malacca lanxang sunda tibet oirats'.split(' '));
const european=new Set('england france scotland brittany castile aragon portugal burgundy imperial poland muscovy novgorod kalmar genoa venice cyprus hungary lithuania'.split(' '));
export function campaignMusicKey(mode,realm){
 if(mode==='menu')return 'menu';if(mode==='war')return 'war';if(mode==='crisis')return 'intrigue';if(mode==='succession')return 'succession';
 if(indian.has(realm))return 'india';if(east.has(realm))return 'eastAsia';if(european.has(realm))return 'europe';return 'general';
}
export function soundtrackPaths(key){return (SOUNDTRACK[key]||SOUNDTRACK.general).map(path);}
export class SoundtrackPlayer{
 constructor(factory,{volume=.35,onUnavailable=()=>{},onPlaying=()=>{}}={}){
  this.factory=factory;this.volume=volume;this.onUnavailable=onUnavailable;this.onPlaying=onPlaying;this.key=null;this.urls=[];this.index=0;this.failed=0;this.active=false;this.media=null;this.generation=0;this.exhausted=false;this.playPending=false;
 }
 select(key,urls){
  if(this.key===key)return false;
  this.clear();this.key=key;this.urls=[...urls];this.index=0;this.failed=0;this.exhausted=false;return true;
 }
 clear(){this.generation++;this.playPending=false;if(this.media){try{this.media.pause();this.media.removeAttribute?.('src');this.media.load?.();}catch{}this.media=null;}}
 pause(){this.active=false;try{this.media?.pause();}catch{}}
 close(){this.pause();this.clear();this.key=null;this.urls=[];}
 resume(){
  this.active=true;if(this.exhausted)return false;if(!this.urls.length){this.exhausted=true;this.onUnavailable();return false;}
  if(this.media&&(!this.media.paused||this.playPending))return true;
  if(!this.media){
   try{
    this.media=this.factory(this.urls[this.index]);if(!this.media)throw Error('Audio unavailable');
    this.media.loop=false;this.media.preload='none';this.media.volume=this.volume;
    const media=this.media,gen=++this.generation;
    media.addEventListener?.('ended',()=>{if(this.generation!==gen)return;this.failed=0;this.advance(false);});
    media.addEventListener?.('error',()=>{if(this.generation!==gen)return;this.advance(true);});
   }catch{this.advance(true);return !this.exhausted;}
  }
  const gen=this.generation,media=this.media;
  try{
   this.playPending=true;
   const p=media.play();
   if(p?.then)p.then(()=>{if(this.generation!==gen)return;this.playPending=false;if(this.active)this.onPlaying();else media.pause();},e=>{if(this.generation!==gen)return;this.playPending=false;if(e?.name!=='NotAllowedError')this.advance(true);});
   else{this.playPending=false;if(this.active)this.onPlaying();}
  }catch{this.playPending=false;this.advance(true);}
  return !this.exhausted;
 }
 advance(failed){
  if(failed)this.failed++;this.clear();
  if(this.failed>=this.urls.length){this.exhausted=true;if(this.active)this.onUnavailable();return;}
  this.index=(this.index+1)%this.urls.length;if(this.active)this.resume();
 }
}
