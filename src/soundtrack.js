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
 constructor(factory,{volume=.65,onUnavailable=()=>{},onPlaying=()=>{},onState=()=>{},reuseMedia=false}={}){
  this.factory=factory;this.volume=volume;this.onState=onState;this.reuseMedia=reuseMedia;this.state='idle';this.lastError=null;this.unbind=null;this.onUnavailable=onUnavailable;this.onPlaying=onPlaying;this.key=null;this.urls=[];this.index=0;this.failed=0;this.active=false;this.media=null;this.generation=0;this.exhausted=false;this.playPending=false;
 }
 select(key,urls){
  if(this.key===key)return false;
  this.clear(!this.reuseMedia);this.key=key;this.urls=[...urls];this.index=0;this.failed=0;this.exhausted=false;this.lastError=null;return true;
 }
 setState(state,error=null){this.state=state;this.lastError=error;this.onState(state,error);}
 clear(dispose=true){
  this.generation++;this.playPending=false;this.unbind?.();this.unbind=null;this.loadedUrl=null;
  if(this.media){try{this.media.pause();if(dispose){this.media.removeAttribute?.('src');this.media.load?.();}}catch{}if(dispose)this.media=null;}
 }
 pause(){this.active=false;this.playPending=false;try{this.media?.pause();}catch{}this.setState('paused');}
 close(){this.pause();this.clear();this.key=null;this.urls=[];}
 retry(){if(this.exhausted){this.clear(!this.reuseMedia);this.exhausted=false;this.failed=0;this.index=0;}return this.resume();}
 resume(){
  this.active=true;if(this.exhausted)return false;
  if(!this.urls.length){this.exhausted=true;this.setState('unavailable');this.onUnavailable();return false;}
  const url=this.urls[this.index];
  if(this.media&&this.loadedUrl===url&&(!this.media.paused||this.playPending)&&this.state!=='blocked')return true;
  if(!this.media||this.loadedUrl!==url){
   try{
    if(!this.media)this.media=this.factory(url);
    else this.media.src=url;
    if(!this.media)throw Error('Audio unavailable');
    this.loadedUrl=url;this.media.loop=false;this.media.muted=false;this.media.volume=this.volume;this.media.preload='auto';
    const media=this.media,gen=++this.generation;
    const ended=()=>{if(this.generation!==gen)return;this.failed=0;this.advance(false);};
    const error=()=>{if(this.generation!==gen)return;this.advance(true);};
    media.addEventListener?.('ended',ended);media.addEventListener?.('error',error);
    this.unbind=()=>{media.removeEventListener?.('ended',ended);media.removeEventListener?.('error',error);};
   }catch(e){this.lastError=e?.message;this.advance(true);return !this.exhausted;}
  }
  const gen=this.generation,media=this.media,attempt=(this.attempt||0)+1;this.attempt=attempt;
  const current=()=>this.generation===gen&&this.attempt===attempt;
  const reject=e=>{if(!current())return;this.playPending=false;if(!this.active)return;
   if(e?.name==='NotAllowedError'||e?.name==='AbortError'){this.setState('blocked',e.name);return;}
   this.lastError=e?.message;this.advance(true);
  };
  try{
   this.playPending=true;this.setState('loading');
   const result=media.play();
   const success=()=>{if(!current())return;this.playPending=false;if(this.active){this.setState('playing');this.onPlaying();}else media.pause();};
   if(result?.then)result.then(success,reject);else success();
  }catch(e){reject(e);}
  return !this.exhausted;
 }
 advance(failed){
  if(failed)this.failed++;this.clear(!this.reuseMedia);
  if(this.failed>=this.urls.length){this.exhausted=true;this.setState('unavailable','No playable track');if(this.active)this.onUnavailable();return;}
  this.index=(this.index+1)%this.urls.length;if(this.active)this.resume();
 }
}
