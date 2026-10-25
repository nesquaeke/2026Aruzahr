"""Original procedural ambience beds; no sampled recordings or external assets."""
import math,random,wave,struct,pathlib
out=pathlib.Path(__file__).resolve().parent.parent/'public'/'audio';out.mkdir(exist_ok=True)
rate=22050
for kind in ['wind','rain','sea','fire','forest','crowd','cave','caravan','battle','calm','knock','dice']:
 duration=1.5 if kind in ['knock','dice'] else 12
 rng=random.Random(kind);samples=[];low=0;slow=0
 for i in range(int(rate*duration)):
  t=i/rate;n=rng.uniform(-1,1);low=.98*low+.02*n;slow=.999*slow+.001*n;v=0
  if kind=='wind':v=low*2*(.55+.3*math.sin(2*math.pi*t/duration))
  if kind=='rain':v=n*.12+low*.8
  if kind=='sea':v=low*2*(.45+.4*math.sin(math.pi*t/6)**2)
  if kind=='fire':v=low*.5+(n*.45 if rng.random()<.002 else 0)
  if kind=='forest':v=low*.5+.025*math.sin(2*math.pi*(1350+150*math.sin(t*12))*t)*max(0,math.sin(t*2))**12
  if kind=='crowd':v=low*.6+math.sin(2*math.pi*(180+12*math.sin(t*4))*t)*.025*(1+math.sin(t*5))
  if kind=='cave':v=slow*3+math.sin(2*math.pi*55*t)*.025
  if kind=='caravan':v=low*.7+math.sin(2*math.pi*115*t)*.06*math.exp(-25*(t%0.65))
  if kind=='battle':v=low*.8+n*.1*math.exp(-12*(t%.85))
  if kind=='calm':
   for f in [110,165,220,275,330]:v+=math.sin(2*math.pi*f*t)*.018*(.7+.3*math.sin(2*math.pi*t/12+f))
  if kind in ['knock','dice']:
   for hit in ([.1,.4,.7] if kind=='knock' else [.05,.16,.3,.47,.68,.95]):
    d=t-hit
    if 0<=d<.15:v+=(math.sin(2*math.pi*145*d)*.3+n*.13)*math.exp(-d*40)
  fade=min(1,t/.08,(duration-t)/.08);samples.append(struct.pack('<h',int(max(-.95,min(.95,v))*fade*32767)))
 with wave.open(str(out/f'builtin-{kind}.wav'),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(samples))
print('12 procedural audio files built.')
