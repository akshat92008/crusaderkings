// Renderer selection is isolated from DOM and WebGL for deterministic failure tests.
export function chooseBattleRenderer(canvas,{probe,three,native,software,replace,warn=()=>{}}){
 let gl=false;try{gl=!!probe(canvas);}catch(e){warn(e);}
 if(gl){try{return {canvas,renderer:three(canvas),mode:'three'};}catch(e){warn(e);}
  try{return {canvas,renderer:native(canvas),mode:'native'};}catch(e){warn(e);}
  canvas=replace(canvas);
 }
 try{return {canvas,renderer:software(canvas),mode:'software'};}catch(e){warn(e);throw Error('No compatible battlefield renderer is available.');}
}
export function freshBattleCanvas(old){const next=old.cloneNode(false);old.replaceWith(next);return next;}
export function disposeNativeRenderer(renderer){const gl=renderer.gl;if(!gl||renderer.disposed)return;renderer.disposed=true;for(const m of Object.values(renderer.meshes||{})){gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.vb);gl.deleteBuffer(m.ib);}if(renderer.buffer)gl.deleteBuffer(renderer.buffer);if(renderer.program)gl.deleteProgram(renderer.program);}
