import { useEffect, useRef, useState, type FormEvent } from 'react';
import * as THREE from 'three';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918881522092';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://exoviaevents.com';
const GA_ID = import.meta.env.VITE_GA_ID || '';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';
const INSTAGRAM_URL = 'https://www.instagram.com/exoviaevents/?stkn=NmhzaWF2eDg1NTFn';

type EventItem = { title:string; copy:string; tag:string; icon:string };


const foodQualities = [
  ['01','HYGIENE FIRST','Vendor screening, clean preparation zones and practical food-safety checks built into event planning.'],
  ['02','FRESH & HOT','We prioritize fresh service, sensible holding times and live counters where the format calls for it.'],
  ['03','CURATED MENUS','Indian, Chinese, snacks, beverages, desserts and regional favourites selected around your guests.'],
  ['04','VENDOR CONTROL','Menu coordination, stall positioning, service flow and vendor communication are managed by the Exovia team.']
];

const blogs = [
  ['How to Plan a Society Food & Flea Market','A practical guide to stalls, food, kids zones, crowd flow and vendor coordination.','EVENT GUIDE'],
  ['Wedding Planning Checklist: From Brief to Baraat','The major decisions that turn a wedding idea into a smooth production plan.','WEDDINGS'],
  ['How to Choose Food Vendors for Your Event','What to look for in menu quality, hygiene, service capacity and guest experience.','FOOD & HOSPITALITY'],
  ['Corporate Event Planning: What Actually Matters','A framework for objectives, production, guest journeys, branding and on-ground execution.','CORPORATE']
];

const seoPages = [
  ['Wedding Event Management','wedding-event-management','End-to-end wedding planning and event production with décor, food, entertainment, logistics and on-ground coordination.'],
  ['Corporate Event Management','corporate-event-management','Professional corporate events, launches, conferences, award nights, dealer meets and brand experiences.'],
  ['Food & Flea Market Events','food-flea-market-events','Community events with curated shopping stalls, food vendors, kids entertainment and complete event operations.'],
  ['Exhibition & Pop-up Events','exhibition-pop-up-events','Vendor stalls, brand activations, layouts, visitor flow, production and event-day management.'],
  ['Birthday & Private Party Planning','private-party-event-management','Memorable private celebrations with themes, décor, catering, entertainment and complete coordination.'],
  ['Festival & Large Event Production','festival-large-event-production','Scalable festival and live-event production with audience flow, entertainment, vendors and operations.']
];

function updateMeta(title:string, description:string){
  document.title = `${title} | Exovia Events`;
  const desc = document.querySelector('meta[name="description"]');
  if(desc) desc.setAttribute('content',description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if(canonical) canonical.setAttribute('href',`${SITE_URL}/`);
}

const events: EventItem[] = [
  {title:'Weddings', copy:'From the first concept to the final farewell, every detail is orchestrated.', tag:'CELEBRATIONS', icon:'✦'},
  {title:'Engagements & Receptions', copy:'Elegant, energetic and completely yours—from intimate to spectacular.', tag:'MILESTONES', icon:'◈'},
  {title:'Private Parties', copy:'Birthdays, anniversaries, baby showers, themed nights and everything between.', tag:'PRIVATE', icon:'✺'},
  {title:'Corporate Events', copy:'Launches, conferences, dealer meets, awards and brand experiences.', tag:'BUSINESS', icon:'◇'},
  {title:'Exhibitions & Pop-ups', copy:'Stalls, vendors, food, experiences and footfall-focused community events.', tag:'MARKETPLACE', icon:'▱'},
  {title:'Festivals & Large Events', copy:'Production-led experiences built for scale, crowds and unforgettable moments.', tag:'LIVE', icon:'✹'}
];

function ShaderHero(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2,2);
    const material = new THREE.ShaderMaterial({
      uniforms:{uTime:{value:0},uResolution:{value:new THREE.Vector2()},uMouse:{value:new THREE.Vector2(.5,.5)}},
      vertexShader:`void main(){gl_Position=vec4(position,1.0);}`,
      fragmentShader:`
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        #define PI 3.14159265359
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){
          vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }
        void main(){
          vec2 uv=gl_FragCoord.xy/uResolution.xy;
          uv.x*=uResolution.x/uResolution.y;
          vec2 m=uMouse; m.x*=uResolution.x/uResolution.y;
          vec2 p=uv-vec2(.5*uResolution.x/uResolution.y,.5);
          float t=uTime*.12;
          float n=noise(p*2.8+t)+noise(p*6.0-t)*.35;
          float r=length(p);
          float wave=sin(8.0*r-2.8*t+n*2.0);
          float glow=smoothstep(.8,.05,r);
          float orb=exp(-7.0*length(p-(m-vec2(.5,.5)))*length(p-(m-vec2(.5,.5))));
          vec3 c1=vec3(.20,.04,.32);
          vec3 c2=vec3(.02,.32,.55);
          vec3 c3=vec3(.72,.16,.48);
          vec3 col=mix(c1,c2,smoothstep(-.7,.7,wave+n*.5));
          col=mix(col,c3,orb*.42);
          col*=.35+.65*glow;
          col+=vec3(.08,.08,.12)*pow(glow,3.0);
          gl_FragColor=vec4(col*.9, .88);
        }`
    });
    const mesh = new THREE.Mesh(geometry,material); scene.add(mesh);
    const resize=()=>{renderer.setSize(innerWidth,innerHeight,false); material.uniforms.uResolution.value.set(innerWidth,innerHeight)};
    const move=(e:MouseEvent)=>material.uniforms.uMouse.value.set(e.clientX/innerWidth,e.clientY/innerHeight);
    addEventListener('resize',resize); addEventListener('mousemove',move); resize();
    let frame=0;
    const animate=(ms:number)=>{material.uniforms.uTime.value=ms/1000; renderer.render(scene,camera); frame=requestAnimationFrame(animate)};
    frame=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('mousemove',move);renderer.dispose();geometry.dispose();material.dispose()};
  },[]);
  return <canvas ref={ref} className="shader"/>;
}

function track(event:string, data:Record<string,unknown>={}){
  const w=window as any;
  w.dataLayer=w.dataLayer||[]; w.dataLayer.push({event,...data});
  if(w.fbq) w.fbq('trackCustom',event,data);
}

function openWhatsApp(message='Hi Exovia Events! I would like to discuss an event.'){
  track('lead_whatsapp_click',{message});
  const url=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener,noreferrer');
}

export default function App(){
  const [menu,setMenu]=useState(false);
  const [sent,setSent]=useState(false);
  const [activeSeo,setActiveSeo]=useState<string|null>(null);
  const [activeBlog,setActiveBlog]=useState<number|null>(null);

  useEffect(()=>{
    const syncHash=()=>{
      const hash=decodeURIComponent(location.hash.replace('#',''));
      const page=seoPages.find(x=>x[1]===hash);
      setActiveSeo(page ? page[1] : null);
      if(page) updateMeta(page[0],page[2]);
      else updateMeta('We Create The Moment','Full-service event experiences, weddings, private parties, corporate events, exhibitions, festivals and large-scale productions across India.');
    };
    syncHash();
    addEventListener('hashchange',syncHash);
    if(GA_ID){
      const s=document.createElement('script'); s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(s);
      const inline=document.createElement('script'); inline.innerHTML=`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`; document.head.appendChild(inline);
    }
    if(META_PIXEL_ID){
      const s=document.createElement('script'); s.innerHTML=`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`; document.head.appendChild(s);
    }
    return()=>removeEventListener('hashchange',syncHash);
  },[]);

  const submit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form=e.currentTarget;
    const data=new FormData(form);
    const name=String(data.get('name')||'').trim();
    const phone=String(data.get('phone')||'').trim();
    const type=String(data.get('type')||'').trim();
    const message=String(data.get('message')||'').trim();

    const whatsappMessage=[
      '✨ EXOVIA EVENTS — NEW EVENT ENQUIRY',
      '',
      `Name: ${name}`,
      `Phone / WhatsApp: ${phone}`,
      `Event Type: ${type}`,
      `Details: ${message || 'Not provided'}`,
      '',
      'Please contact me regarding my event.'
    ].join('\\n');

    track('generate_lead',{
      source:'website_contact_form',
      event_type:type,
      has_message:Boolean(message)
    });

    setSent(true);
    openWhatsApp(whatsappMessage);
  };



  const blogBodies = [
    'Start with a simple event map: vendor zones, food counters, kids entertainment, seating, power, washrooms, security and an obvious entry/exit flow. Then define vendor categories so the marketplace feels curated instead of crowded. Exovia coordinates the vendor list, stall layout, operational timeline and event-day support.',
    'Build the wedding around the guest journey. Lock the venue and date first, then establish the visual direction, functions, food plan, entertainment, décor, photography and production requirements. A clear run-of-show and one responsible event team can remove a huge amount of last-minute stress.',
    'Food vendors should be evaluated beyond the menu. Look at hygiene practices, preparation capacity, service speed, ingredient freshness, equipment, staff presentation and their ability to handle peak demand. Exovia can coordinate menu categories, stall positioning, service windows and vendor communication around the event.',
    'A corporate event should start with its objective: launch, sales, internal culture, networking, training or brand awareness. From there, guest registration, stage design, AV, branding, speakers, catering, production schedules and on-ground ownership should all serve the objective—not compete with it.'
  ];

  const activePage = seoPages.find(x=>x[1]===activeSeo);

  return <div className="site">
    <div className="noise"/>
    <header className="nav">
      <a className="logo" href="#top" onClick={()=>setMenu(false)}><span>EXOVIA</span><small>EVENTS</small></a>
      <nav className={menu?'open':''}>
        <a href="#experiences" onClick={()=>setMenu(false)}>Experiences</a>
        <a href="#process" onClick={()=>setMenu(false)}>How we work</a>
        <a href="#contact" onClick={()=>setMenu(false)}>Contact</a>
      </nav>
      <button className="navCta" onClick={()=>openWhatsApp('Hi Exovia Events! I want a quote for my event.')}>Plan an Event <span>↗</span></button>
      <button className="hamb" onClick={()=>setMenu(!menu)} aria-label="Menu">☰</button>
    </header>

    <main id="top">
      <section className="hero">
        <ShaderHero/>
        <div className="heroContent">
          <div className="eyebrow"><i/> INDIA · EVENTS · EXPERIENCES</div>
          <h1 className="heroTitle"><span className="heroWhite">We</span> <span className="heroCreate">create</span><br/><span className="heroThe">the</span> <span className="heroMoment">moment.</span></h1>
          <p>Full-service event experiences, from intimate celebrations to large-scale productions. Conceived beautifully. Executed relentlessly.</p>
          <div className="heroActions">
            <button className="primary" onClick={()=>{track('start_event_click');document.querySelector('#contact')?.scrollIntoView({behavior:'smooth',block:'start'})}}>Start your event <span>↗</span></button>
            <a className="ghost" href="#experiences">Explore Exovia <span>↓</span></a>
          </div>
        </div>
        <div className="scroll">SCROLL TO EXPLORE <span>↓</span></div>
        <div className="heroOrb">EXOVIA<br/><b>EVENTS</b></div>
      </section>

      <section className="statement">
        <div className="sectionKicker">01 / THE IDEA</div>
        <div><h2>Every event has a<br/><span>feeling.</span> We build it.</h2><p>Exovia brings planning, production, people, vendors, design and technology together under one roof—so you can be present for the moment instead of managing it.</p></div>
      </section>

      <section id="experiences" className="experiences">
        <div className="sectionHead"><div><div className="sectionKicker">02 / EXPERIENCES</div><h2>Whatever the<br/><em>occasion.</em></h2></div><p>One team. One vision. Every detail.</p></div>
        <div className="eventGrid">{events.map((e,i)=><article className="eventCard" key={e.title}><span className="num">0{i+1}</span><div className="eventIcon">{e.icon}</div><div className="eventTag">{e.tag}</div><h3>{e.title}</h3><p>{e.copy}</p><span className="arrow">↗</span></article>)}</div>
      </section>


      <section id="food" className="food">
        <div className="foodIntro">
          <div className="sectionKicker">02.5 / FOOD & HOSPITALITY</div>
          <h2>Good events<br/>need <em>great food.</em></h2>
          <p>From Indian favourites and Chinese live counters to snacks, beverages and desserts, Exovia builds food experiences around the audience, venue and event format.</p>
          <button className="textBtn lightBtn" onClick={()=>openWhatsApp('Hi Exovia! I want to discuss food and catering for an event.')}>Discuss food & catering <span>↗</span></button>
        </div>
        <div className="foodGrid">{foodQualities.map(x=><article className="foodCard" key={x[0]}><b>{x[0]}</b><div className="foodGlow"></div><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
      </section>

      <section className="marquee" aria-hidden="true"><div>WEDDINGS · PARTIES · CORPORATE · EXHIBITIONS · FESTIVALS · LIVE EXPERIENCES · </div><div>WEDDINGS · PARTIES · CORPORATE · EXHIBITIONS · FESTIVALS · LIVE EXPERIENCES · </div></section>

      <section id="process" className="process">
        <div className="sectionKicker">03 / THE EXOVIA METHOD</div>
        <h2>From <em>idea</em> to<br/>standing ovation.</h2>
        <div className="steps">
          {[
            ['01','DISCOVER','We understand your occasion, audience, ambition and budget.'],
            ['02','DESIGN','Concept, mood, layout, vendors, entertainment and experience architecture.'],
            ['03','PRODUCE','Our team coordinates people, suppliers, logistics, timelines and technical production.'],
            ['04','EXECUTE','On the day, you enjoy it. We handle the details, pressure and last-minute pivots.']
          ].map(s=><div className="step" key={s[0]}><b>{s[0]}</b><h3>{s[1]}</h3><p>{s[2]}</p></div>)}
        </div>
      </section>

      <section className="network">
        <div className="networkVisual"><div className="rings"><span/><span/><span/><b>EXOVIA</b></div></div>
        <div><div className="sectionKicker">04 / THE NETWORK</div><h2>Local expertise.<br/><em>National ambition.</em></h2><p>We are building a growing network of decorators, caterers, venues, artists, photographers, entertainers, rental partners and event professionals—so Exovia can execute wherever the occasion takes you.</p><button className="textBtn" onClick={()=>openWhatsApp('Hi Exovia! I want to become an event/vendor partner.')}>Become a partner <span>↗</span></button></div>
      </section>


      <section id="journal" className="journal">
        <div className="sectionHead"><div><div className="sectionKicker">04.5 / EXOVIA JOURNAL</div><h2>Ideas worth<br/><em>celebrating.</em></h2></div><p>Guides for better events.</p></div>
        <div className="blogGrid">{blogs.map((b,i)=><article className="blogCard" key={b[0]}><span>0{i+1} · {b[2]}</span><h3>{b[0]}</h3><p>{b[1]}</p><button className="blogRead" onClick={()=>{setActiveBlog(i);track('blog_open',{index:i,title:b[0]})}}>Read guide ↗</button></article>)}</div>
      </section>

      <section id="services" className="seoHub">
        <div className="sectionKicker">05 / EVENT SERVICES</div>
        <h2>Explore Exovia<br/><em>by experience.</em></h2>
        <p className="seoLead">Dedicated service pages for the moments people search for—built to explain what we do and help you start a conversation.</p>
        <div className="seoGrid">{seoPages.map((p)=><a className="seoCard" href={`#${p[1]}`} key={p[1]}><span>EXOVIA / {p[1].replaceAll('-',' ').toUpperCase()}</span><h3>{p[0]}</h3><p>{p[2]}</p><b>Explore ↗</b></a>)}</div>
      </section>

      {activeBlog !== null && <div className="blogModal" role="dialog" aria-modal="true" aria-label={blogs[activeBlog][0]}>
        <div className="blogModalInner">
          <button className="modalClose" onClick={()=>setActiveBlog(null)} aria-label="Close">×</button>
          <div className="sectionKicker">{blogs[activeBlog][2]} / EXOVIA JOURNAL</div>
          <h2>{blogs[activeBlog][0]}</h2>
          <p>{blogBodies[activeBlog]}</p>
          <button className="primary" onClick={()=>{setActiveBlog(null);document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'});}}>Discuss your event <span>↗</span></button>
        </div>
      </div>}

      {activePage && <section className="seoDetail">
        <div className="seoDetailInner">
          <div className="sectionKicker">EXOVIA / SERVICE GUIDE</div>
          <h2>{activePage[0]}<br/><em>built around you.</em></h2>
          <p>{activePage[2]}</p>
          <div className="detailColumns">
            <div><h3>What Exovia handles</h3><p>Concept and planning, vendor coordination, venue logistics, food and hospitality, décor, entertainment, production, guest flow and event-day execution.</p></div>
            <div><h3>Where we operate</h3><p>Exovia is designed as a scalable event brand for projects across India, with local vendor and production networks developed city by city.</p></div>
          </div>
          <button className="primary" onClick={()=>openWhatsApp(`Hi Exovia Events! I am interested in ${activePage[0]}. Please contact me.`)}>Plan this experience <span>↗</span></button>
        </div>
      </section>}

      <section id="contact" className="contact">
        <div className="contactCopy"><div className="sectionKicker">05 / LET'S MAKE IT REAL</div><h2>Have an event<br/><em>in mind?</em></h2><p>Tell us what you're imagining. We'll take it from there.</p><div className="contactActions"><button className="whatsapp" onClick={()=>openWhatsApp('Hi Exovia Events! I want to plan an event. Please contact me.')}>Chat on WhatsApp <span>↗</span></button><a className="instagramBtn" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram <span>↗</span></a></div></div>
        <form className="form" onSubmit={submit}>
          <label>Your name<input required name="name" placeholder="Name"/></label>
          <label>Phone / WhatsApp<input required name="phone" placeholder="+91"/></label>
          <label>Event type<select required name="type" defaultValue=""><option value="" disabled>Select an event</option><option>Wedding</option><option>Engagement / Reception</option><option>Private Party</option><option>Corporate Event</option><option>Exhibition / Pop-up</option><option>Festival / Large Event</option><option>Other</option></select></label>
          <label>Tell us a little<textarea name="message" placeholder="Date, city, guest count, what you have in mind…"/></label>
          <button className="submit" type="submit">{sent?'Request captured ✓':'Send enquiry'} <span>↗</span></button>
          <small className="privacy">By submitting, you agree to be contacted about your event enquiry.</small>
        </form>
      </section>
    </main>

    <footer>
      <div className="footerTop"><a className="logo" href="#top"><span>EXOVIA</span><small>EVENTS</small></a><p>We create the moment.</p><div className="social"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href={import.meta.env.VITE_FACEBOOK_URL || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">FB</a><a href={import.meta.env.VITE_YOUTUBE_URL || '#'} target="_blank" rel="noreferrer" aria-label="YouTube">YT</a><a href={import.meta.env.VITE_LINKEDIN_URL || '#'} target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a></div></div>
      <div className="footerBottom"><span>© {new Date().getFullYear()} Exovia Events. All rights reserved.</span><span>EVENTS · EXPERIENCES · INDIA</span></div>
    </footer>
    <button className="floatWa" onClick={()=>openWhatsApp()} aria-label="Chat on WhatsApp">◔</button>
  </div>
}