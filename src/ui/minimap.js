import {drawGeoPath} from '../atlas-art.js';

export function bindMinimap(canvas, map) {
 const context = canvas.getContext('2d');
 if (!context) return;
 const {width, height} = canvas;
 const project = (lon, lat) => [(lon + 180) * width / 360, (85 - lat) * height / 145];
 const base = document.createElement('canvas');
 base.width = width;
 base.height = height;
 const background = base.getContext('2d');
 let cachedWorld, lastViewport;
 map.onViewport = (world, viewport, center) => {
  if (canvas.closest('[hidden]') || canvas.offsetWidth === 0) return;
  const changedWorld = cachedWorld !== world;
  if (changedWorld) {
   cachedWorld = world;
   background.fillStyle = '#15292d';
   background.fillRect(0, 0, width, height);
   background.fillStyle = '#afa480';
   background.beginPath();
   for (const province of world.provinces) drawGeoPath(background, province.geometry, project);
   background.fill();
  }
  const [left, bottom, right, top] = viewport;
  const [x, y] = project(left, top);
  const [endX, endY] = project(right, bottom);
  const signature = [x, y, endX, endY].map(Math.round).join(',');
  if (!changedWorld && signature === lastViewport) return;
  lastViewport = signature;
  context.drawImage(base, 0, 0);
  context.strokeStyle = '#f9d282';
  context.lineWidth = 2;
  context.strokeRect(x, y, endX - x, endY - y);
  const [cx, cy] = project(...center);
  context.fillStyle = '#f9d282';
  context.fillRect(cx - 2, cy - 2, 4, 4);
 };
 canvas.parentElement.addEventListener('click', event => {
  if (!event.detail) {
   map.focus(0, 20, 1);
   return;
  }
  const rect = canvas.getBoundingClientRect();
  const lon = (event.clientX - rect.left) * 360 / rect.width - 180;
  const lat = 85 - (event.clientY - rect.top) * 145 / rect.height;
  map.focus(lon, lat, Math.max(2, map.zoom));
 });
}
