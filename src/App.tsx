import { useEffect, useRef, useState, type FormEvent } from 'react';
import Admin from './Admin';
import { addCRM, loadCRM, makeId, type EventRecord } from './crm';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918881522092';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://exoviaevents.com';
const GA_ID = import.meta.env.VITE_GA_ID || '';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';
const INSTAGRAM_URL = 'https://www.instagram.com/exoviaevents/';
const CALL_NUMBER = import.meta.env.VITE_CALL_NUMBER || '+918881522092';
const UPI_ID = import.meta.env.VITE_UPI_ID || 'legendssunny0522@ptaxis';
const UPI_NAME = import.meta.env.VITE_UPI_NAME || 'Exovia Events';

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

const UP_EVENT_LOCATIONS = ['Lucknow, Uttar Pradesh','Kanpur, Uttar Pradesh','Noida, Uttar Pradesh','Varanasi, Uttar Pradesh'];

function eventIcon(type:string){
  const t=type.toLowerCase();
  if(t.includes('wedding') || t.includes('engagement')) return '✦';
  if(t.includes('corporate')) return '◇';
  if(t.includes('food') || t.includes('flea')) return '✺';
  if(t.includes('exhibition') || t.includes('pop')) return '▱';
  if(t.includes('festival')) return '✹';
  return '◈';
}

function LiveEvents(){
  const [live,setLive]=useState<EventRecord[]>(()=>loadCRM().events.filter(e=>e.status==='live'));
  useEffect(()=>{
    const sync=()=>setLive(loadCRM().events.filter(e=>e.status==='live'));
    addEventListener('exovia-crm-change',sync);
    addEventListener('storage',sync);
    return()=>{removeEventListener('exovia-crm-change',sync);removeEventListener('storage',sync)};
  },[]);
  return <section id="live-events" className="liveEvents">
    <div className="sectionHead"><div><div className="sectionKicker">03 / LIVE EVENTS</div><h2>See what’s<br/><em>happening.</em></h2></div><p>Published by Exovia Operations Center.</p></div>
    {live.length ? <div className="liveEventGrid">{live.map((e,i)=><article className="liveEventCard" key={e.id}><div className="liveEventTop"><span className="liveBadge">LIVE</span><span className="liveEventNo">0{i+1}</span></div><div className="eventIcon">{eventIcon(e.type)}</div><div className="eventTag">{e.type||'EXOVIA EVENT'}</div><h3>{e.name}</h3><p>{e.notes||'An Exovia event experience with curated vendors, hospitality and on-ground operations.'}</p><div className="liveEventMeta"><span>📍 {e.city||'Location to be announced'}</span><span>📅 {e.date||'Date to be announced'}</span>{e.venue&&<span>⌂ {e.venue}</span>}</div></article>)}</div> : <div className="liveEmpty"><span>NO LIVE EVENTS YET</span><h3>Our next experience will appear here.</h3><p>When an event is marked <b>LIVE</b> in the Exovia Operations Center, it automatically appears on this website.</p></div>}
  </section>;
}

function ShaderHero(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    let active = true;
    let cleanup: (()=>void)|undefined;
    const start = async()=>{
      const THREE = await import('three');
      if(!active) return;
      const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:true, powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.25));
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
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
          float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
          void main(){
            vec2 uv=gl_FragCoord.xy/uResolution.xy; uv.x*=uResolution.x/uResolution.y;
            vec2 m=uMouse; m.x*=uResolution.x/uResolution.y;
            vec2 p=uv-vec2(.5*uResolution.x/uResolution.y,.5);
            float t=uTime*.12; float n=noise(p*2.8+t)+noise(p*6.0-t)*.35; float r=length(p);
            float wave=sin(8.0*r-2.8*t+n*2.0); float glow=smoothstep(.8,.05,r);
            float orb=exp(-7.0*length(p-(m-vec2(.5,.5)))*length(p-(m-vec2(.5,.5))));
            vec3 c1=vec3(.20,.04,.32),c2=vec3(.02,.32,.55),c3=vec3(.72,.16,.48);
            vec3 col=mix(c1,c2,smoothstep(-.7,.7,wave+n*.5)); col=mix(col,c3,orb*.42);
            col*=.35+.65*glow; col+=vec3(.08)*pow(glow,3.0); gl_FragColor=vec4(col*.9,.88);
          }`
      });
      scene.add(new THREE.Mesh(geometry,material));
      const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);material.uniforms.uResolution.value.set(innerWidth,innerHeight)};
      const move=(e:MouseEvent)=>material.uniforms.uMouse.value.set(e.clientX/innerWidth,e.clientY/innerHeight);
      let frame=0;
      let visible=document.visibilityState==='visible';
      const onVisibility=()=>{visible=document.visibilityState==='visible';if(visible&&!frame)frame=requestAnimationFrame(animate)};
      const animate=(ms:number)=>{frame=0;if(!active||!visible)return;material.uniforms.uTime.value=ms/1000;renderer.render(scene,camera);frame=requestAnimationFrame(animate)};
      addEventListener('resize',resize);addEventListener('mousemove',move,{passive:true});document.addEventListener('visibilitychange',onVisibility);resize();
      frame=requestAnimationFrame(animate);
      cleanup=()=>{active=false;cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('mousemove',move);document.removeEventListener('visibilitychange',onVisibility);renderer.dispose();geometry.dispose();material.dispose()};
    };
    const idle='requestIdleCallback' in window ? (window as any).requestIdleCallback(start,{timeout:900}) : window.setTimeout(start,250);
    return()=>{active=false;if('cancelIdleCallback' in window)(window as any).cancelIdleCallback(idle);else clearTimeout(idle);cleanup?.()};
  },[]);
  return <canvas ref={ref} className="shader" aria-hidden="true"/>;
}


function packageAmount(packageName:string){
  const match=packageName.replaceAll(',','').match(/₹\s*([0-9]+)/);
  return match ? Number(match[1]) : 0;
}

function buildUpiUrl(amount:number, app:'generic'|'gpay'|'phonepe'|'paytm'='generic'){
  const params=new URLSearchParams({pa:UPI_ID,pn:UPI_NAME,cu:'INR'});
  if(amount>0) params.set('am',amount.toFixed(2));
  const query=params.toString();
  if(app==='gpay') return `tez://upi/pay?${query}`;
  if(app==='phonepe') return `phonepe://pay?${query}`;
  if(app==='paytm') return `paytmmp://pay?${query}`;
  return `upi://pay?${query}`;
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

function SiteApp(){
  const [menu,setMenu]=useState(false);
  const [sent,setSent]=useState(false);
  const [activeSeo,setActiveSeo]=useState<string|null>(null);
  const [activeBlog,setActiveBlog]=useState<number|null>(null);
  const [bookingOpen,setBookingOpen]=useState(false);
  const [bookingSent,setBookingSent]=useState(false);
  const [bookingMode,setBookingMode]=useState<'vendor'|'customer'>('vendor');
  const [selectedPackage,setSelectedPackage]=useState('');
  const [paymentHint,setPaymentHint]=useState('');
  const [vendorStep,setVendorStep]=useState<1|2>(1);

  useEffect(()=>{
    const key='exovia-booking-popup-seen-v3';
    if(sessionStorage.getItem(key)==='1') return;
    const timer=window.setTimeout(()=>{ sessionStorage.setItem(key,'1'); openBooking('customer'); },2200);
    return()=>clearTimeout(timer);
  },[]);

  useEffect(()=>{
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape') setBookingOpen(false);
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[]);

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

  const openBooking=(mode:'vendor'|'customer'='vendor')=>{
    setBookingMode(mode);
    setBookingSent(false);
    setSelectedPackage('');
    setPaymentHint('');
    setVendorStep(1);
    setBookingOpen(true);
    track('booking_popup_open',{mode});
  };

  const submitBooking=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const name=String(data.get('bookingName')||'').trim();
    const phone=String(data.get('bookingPhone')||'').trim();
    const business=String(data.get('business')||'').trim();
    const category=String(data.get('category')||'').trim();
    const city=String(data.get('city')||'').trim();
    const event=String(data.get('bookingEvent')||'').trim();
    const packageName=String(data.get('package')||'').trim();
    const location=String(data.get('location')||'').trim();
    const notes=String(data.get('bookingNotes')||'').trim();
    const screenshot=(data.get('paymentScreenshot') as File|null);
    const isCustomer=bookingMode==='customer';
    if(isCustomer){
      addCRM('customers',{id:makeId('cus'),createdAt:new Date().toISOString(),status:'new',name,phone,interest:business,category,city,event,location,registration:packageName,notes});
    }else{
      addCRM('vendors',{id:makeId('ven'),createdAt:new Date().toISOString(),status:'new',name,phone,business,category,city,event,location,packageName,notes,paymentFile:screenshot?.name||''});
      const amount=packageAmount(packageName);
      if(amount>0) addCRM('payments',{id:makeId('pay'),createdAt:new Date().toISOString(),party:business||name,type:'vendor',amount,status:'pending',reference:event||'Stall booking',notes:screenshot?.name?`Screenshot selected: ${screenshot.name}`:'Payment screenshot not selected'});
    }
    track('booking_form_submit',{mode:bookingMode,event,category,has_payment_screenshot:Boolean(screenshot?.name)});
    setBookingSent(true);
  };

  const submit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form=e.currentTarget;
    const data=new FormData(form);
    const name=String(data.get('name')||'').trim();
    const phone=String(data.get('phone')||'').trim();
    const type=String(data.get('type')||'').trim();
    const message=String(data.get('message')||'').trim();
    addCRM('leads',{id:makeId('lead'),createdAt:new Date().toISOString(),source:'website_contact_form',status:'new',name,phone,eventType:type,city:'',message});
    track('generate_lead',{source:'website_contact_form',event_type:type,has_message:Boolean(message)});
    setSent(true);
    form.reset();
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
        <a href="#stall-booking" onClick={()=>setMenu(false)}>Book a Stall</a>
        <a href="#contact" onClick={()=>setMenu(false)}>Contact</a>
      </nav>
      <button className="navBooking" onClick={()=>openBooking('customer')}>Register <span>↗</span></button>
      <button className="navCta" onClick={()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})}>Plan an Event <span>↗</span></button>
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

      <section className="stallBanner" id="stall-booking">
        <div className="stallBannerGlow"></div>
        <div className="stallBannerCopy">
          <div className="sectionKicker">EXOVIA EVENTS / MARKETPLACE</div>
          <h2>Bring your brand.<br/><em>We run the experience.</em></h2>
          <p>Book a stall, register as a visitor, or enquire about an upcoming Exovia marketplace. Every submission is captured in the Exovia Operations Center for follow-up, event planning and payment tracking.</p>
          <div className="bannerActions">
            <button className="primary" onClick={()=>openBooking('vendor')}>Book a Stall <span>↗</span></button>
            <button className="bannerGhost" onClick={()=>openBooking('customer')}>Register as Visitor <span>↗</span></button>
          </div>
        </div>
        <div className="stallBannerInfo">
          <span>EVENT BOOKINGS, ORGANISED.</span>
          <strong>One form. One organised event record.</strong>
          <small>Vendor applications and visitor registrations are saved to the Exovia event workflow. WhatsApp stays optional.</small>
          <div className="bookingTrust"><b>✓ CRM RECORD</b><b>✓ EVENT LINK</b><b>✓ FOLLOW-UP READY</b></div>
        </div>
      </section>

      <LiveEvents />

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

    {bookingOpen && <div className="bookingOverlay" role="dialog" aria-modal="true" aria-label="Exovia booking form" onMouseDown={(e)=>{if(e.target===e.currentTarget)setBookingOpen(false)}}>
      <div className="bookingModal">
        <button className="bookingClose" onClick={()=>setBookingOpen(false)} aria-label="Close">×</button>
        <div className="bookingHeader">
          <div className="sectionKicker">EXOVIA / QUICK ENTRY</div>
          <h2>{bookingMode==='vendor'?'Reserve your Exovia stall.':'Register for an Exovia event.'}</h2>
          <p>Keep your details organised from the first enquiry. We use this information for event coordination and confirmation.</p>
        </div>
        <div className="bookingSwitch">
          <button className={bookingMode==='vendor'?'active':''} onClick={()=>setBookingMode('vendor')}>🏪 Vendor / Stall</button>
          <button className={bookingMode==='customer'?'active':''} onClick={()=>setBookingMode('customer')}>🎟️ Customer / Visitor</button>
        </div>
        {bookingMode==='vendor' && <div className="bookingSteps" aria-label="Vendor booking steps"><span className="active">Step 1 · Details</span><span className={vendorStep===2?'active':''}>Step 2 · Payment / Confirmation</span></div>}
        {bookingMode==='vendor' && vendorStep===2 && <div className="paymentCard">
          <div className="paymentQrWrap"><img src="/payment-method-exovia.jpg" alt="Exovia Events UPI payment QR" width="240" height="379" loading="lazy" decoding="async" /></div>
          <div className="paymentCopy"><span className="paymentKicker">STEP 2 · PAYMENT / CONFIRMATION</span><h3>Pay your stall booking securely.</h3><p>Choose your UPI app with the selected stall amount pre-filled. If the app does not open, scan the QR or copy the UPI ID.</p><div className="upiIdRow"><strong>UPI ID · {UPI_ID}</strong><button type="button" className="copyUpi" onClick={async()=>{try{await navigator.clipboard.writeText(UPI_ID);setPaymentHint('UPI ID copied ✓')}catch{setPaymentHint(UPI_ID)}}}>Copy UPI</button></div><div className="paymentActions"><a className="upiButton gpay" href={buildUpiUrl(packageAmount(selectedPackage),'gpay')} onClick={()=>setPaymentHint('Opening Google Pay…')}>G Pay <span>↗</span></a><a className="upiButton paytm" href={buildUpiUrl(packageAmount(selectedPackage),'paytm')} onClick={()=>setPaymentHint('Opening Paytm…')}>Paytm <span>↗</span></a><a className="upiButton phonepe" href={buildUpiUrl(packageAmount(selectedPackage),'phonepe')} onClick={()=>setPaymentHint('Opening PhonePe…')}>PhonePe <span>↗</span></a><a className="upiButton generic" href={buildUpiUrl(packageAmount(selectedPackage),'generic')} onClick={()=>setPaymentHint('Opening UPI app chooser…')}>Other UPI <span>↗</span></a></div>{paymentHint && <div className="paymentHint">{paymentHint}</div>}<small>After payment, attach the screenshot below. Payment is verified by the Exovia team before the booking is confirmed.</small></div>
        </div>}
        <form className="bookingForm" onSubmit={(e)=>{if(bookingMode==='vendor' && vendorStep===1){e.preventDefault(); if(!selectedPackage){setPaymentHint('Please select a stall package to continue.');return;} setPaymentHint(''); setVendorStep(2); return;} submitBooking(e);}}>
          <div className="bookingGrid">
            <label>Full name<input required name="bookingName" placeholder="Your name"/></label>
            <label>Mobile / WhatsApp<input required name="bookingPhone" placeholder="+91" inputMode="tel"/></label>
            <label>{bookingMode==='vendor'?'Business / Shop name':'What are you interested in?'}<input name="business" placeholder={bookingMode==='vendor'?'Business name':'e.g. Shopping, food, events'}/></label>
            <label>Category<select name="category" defaultValue=""><option value="">Select category</option><option>Fashion & Clothing</option><option>Jewellery & Accessories</option><option>Food & Beverages</option><option>Beauty & Wellness</option><option>Home Decor & Lifestyle</option><option>Kids & Toys</option><option>Gifts & Handicrafts</option><option>Services</option><option>Other</option></select></label>
            <label>City<input name="city" placeholder="City"/></label>
            <label>Event<select required name="bookingEvent" defaultValue=""><option value="">Select event</option><option>Apartment Lifestyle Exhibition & Sale</option><option>Food & Flea Market</option><option>Exhibition / Pop-up</option><option>Upcoming Exovia Event</option></select></label>
            <label className="full">{bookingMode==='vendor'?'Business location / area':'Your area / locality'}<input name="location" placeholder="Locality, area, city"/></label>
            <label>{bookingMode==='vendor'?'Stall package':'Registration type'}<select required={bookingMode==='vendor'} name="package" value={selectedPackage} onChange={e=>setSelectedPackage(e.target.value)}><option value="">Select</option>{bookingMode==='vendor'?<><option>Single Day Stall — ₹2,500</option><option>4 Sunday Package — ₹10,000</option><option>Offer Package — ₹5,000</option></>:<><option>General Visitor</option><option>Family / Group</option><option>Special Registration</option></>}</select></label>
            {bookingMode==='vendor' && vendorStep===2 && <label>Payment screenshot<input required type="file" name="paymentScreenshot" accept="image/*,.pdf"/></label>}
            <label className="full">Additional notes<textarea name="bookingNotes" placeholder="Products, stall needs, preferred area, questions…"></textarea></label>
          </div>
          <div className="bookingFooter">
            <div><b>🔒 Saved to Exovia Operations Center</b><small>{bookingMode==='vendor' ? (vendorStep===1 ? 'Step 1 captures your stall and event details. Payment is collected only in Step 2.' : 'Step 2 records the payment reference and screenshot for Exovia verification. WhatsApp is optional.') : 'Visitor registration is captured directly in the CRM. No payment details are requested unless the selected event requires it.'}</small></div>
            <div className="bookingButtons">{bookingMode==='vendor' && vendorStep===2 && <button className="bookingSecondary" type="button" onClick={()=>{setVendorStep(1);setPaymentHint('')}}>← Back</button>}<button className="submit" type="submit">{bookingSent?'Saved ✓':bookingMode==='vendor'&&vendorStep===1?'Continue to payment →':'Confirm registration'} <span>↗</span></button></div>
          </div>
        </form>
      </div>
    </div>}

    <footer>
      <div className="footerTop"><a className="logo" href="#top"><span>EXOVIA</span><small>EVENTS</small></a><p>We create the moment.</p><div className="social"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href={import.meta.env.VITE_FACEBOOK_URL || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">FB</a><a href={import.meta.env.VITE_YOUTUBE_URL || '#'} target="_blank" rel="noreferrer" aria-label="YouTube">YT</a><a href={import.meta.env.VITE_LINKEDIN_URL || '#'} target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a></div></div>
      <div className="footerBottom"><span>© {new Date().getFullYear()} Exovia Events. All rights reserved.</span><span>EVENTS · EXPERIENCES · INDIA</span><a className="staffLogin" href="/admin">STAFF LOGIN ↗</a></div>
    </footer>
    <div className="floatStack" aria-label="Exovia quick actions">
      <a className="floatCall" href={`tel:${CALL_NUMBER}`} aria-label="Call Exovia Events"><span>☎</span><b>Call Now</b></a>
      <button className="floatChat" onClick={()=>openWhatsApp('Hi Exovia Events! I need help with an event.')} aria-label="Chat with Exovia"><span>💬</span><b>Chat</b></button>
    </div>
  </div>
}

export default function App(){
  return location.pathname.startsWith('/admin') ? <Admin/> : <SiteApp/>;
}
