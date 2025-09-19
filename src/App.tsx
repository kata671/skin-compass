import React, { useEffect, useMemo, useRef, useState } from "react";

/** ---------- DANE DEMO ---------- */
type Product = { name:string; brand:string; rating:number; price:string; time:"rano"|"wieczór"; type:"żel"|"krem"|"tonik"|"serum"; tier:"budget"|"mid"|"pro"; tags:string[] };
type Key = "tradzik" | "wagry" | "sucha" | "przebarwienia";
const LABELS: Record<Key,string> = { tradzik:"Trądzik", wagry:"Wągry / zaskórniki", sucha:"Sucha skóra", przebarwienia:"Przebarwienia" };
const PRODUCTS: Record<Key, Product[]> = {
  tradzik: [
    { name:"Acne Control Gel 2%", brand:"BX Labs", rating:4.7, price:"od 39 zł", time:"wieczór", type:"żel", tier:"budget", tags:["BHA","żel","noc"] },
    { name:"Kwas azelainowy 10%", brand:"Dr. AZE", rating:4.6, price:"od 49 zł", time:"rano", type:"serum", tier:"mid", tags:["azelainowy","przebarwienia"] }
  ],
  wagry: [
    { name:"Tonik BHA 2%", brand:"ClearWave", rating:4.6, price:"od 35 zł", time:"wieczór", type:"tonik", tier:"budget", tags:["pory","strefa-T"] }
  ],
  sucha: [
    { name:"Krem z ceramidami", brand:"BarrierLab", rating:4.8, price:"od 39 zł", time:"rano", type:"krem", tier:"mid", tags:["bariera"] }
  ],
  przebarwienia: [
    { name:"Serum z wit. C 15%", brand:"C-Glow", rating:4.5, price:"od 59 zł", time:"rano", type:"serum", tier:"mid", tags:["antyoksydant","rozświetlenie"] }
  ]
};

const ING = ["BHA 2%","Retinoid","Niacynamid","Ceramidy","Kwas azelainowy","Wit. C","Kwas hialuronowy","Cynk","Bakuchiol","Peptydy"];
const MATCH: Record<Key,string[]> = {
  tradzik:["BHA 2%","Kwas azelainowy","Retinoid","Cynk","Niacynamid"],
  wagry:["BHA 2%","Niacynamid","Retinoid"],
  sucha:["Ceramidy","Kwas hialuronowy","Peptydy","Bakuchiol"],
  przebarwienia:["Wit. C","Kwas azelainowy","Retinoid","Niacynamid"]
};

function Section({id, title, children}:{id:string; title:string; children:React.ReactNode}) {
  return (
    <section id={id} className="section card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  // --- ANALIZA + REKOMENDACJE ---
  const [file, setFile] = useState<File|null>(null);
  const [cond, setCond] = useState<Key|undefined>(undefined);
  const imgUrl = useMemo(()=> file ? URL.createObjectURL(file) : "", [file]);
  useEffect(()=>()=>{ if(imgUrl) URL.revokeObjectURL(imgUrl); },[imgUrl]);

  function guessByName(n:string):Key|undefined{
    const s=n.toLowerCase();
    if(/acne|tradzik|pimple|pryszcz/.test(s)) return "tradzik";
    if(/blackhead|wagry|comedone|pory/.test(s)) return "wagry";
    if(/dry|sucha|xerosis|flaky/.test(s)) return "sucha";
    if(/spot|dark|melasma|przebarw/.test(s)) return "przebarwienia";
    return undefined;
  }

  // --- FILTRY REKOMENDACJI ---
  const [fTime,setFTime]=useState<""|"rano"|"wieczór">("");
  const [fType,setFType]=useState<""|"żel"|"krem"|"tonik"|"serum">("");
  const [fTier,setFTier]=useState<""|"budget"|"mid"|"pro">("");

  const products = useMemo(()=>{
    if(!cond) return [];
    return (PRODUCTS[cond]||[])
      .filter(p=>!fTime || p.time===fTime)
      .filter(p=>!fType || p.type===fType)
      .filter(p=>!fTier || p.tier===fTier);
  },[cond,fTime,fType,fTier]);

  // --- GRA ---
  const [picked,setPicked]=useState<string[]>([]);
  const goal = cond ?? "tradzik";
  function togglePick(x:string){
    setPicked(prev=>{
      const has=prev.includes(x);
      if(has) return prev.filter(i=>i!==x);
      if(prev.length>=3) return prev; // max 3
      return [...prev,x];
    });
  }
  const score = useMemo(()=>{
    const target = new Set(MATCH[goal]);
    return picked.reduce((s,x)=> s + (target.has(x)?50:-25), 0);
  },[picked,goal]);

  // --- QUIZ ---
  const QUIZ = [
    {q:"Najlepsze na zaskórniki?",a:["BHA 2%","Ceramidy","Kwas hialuronowy"],good:0,why:"BHA rozpuszcza sebum w porach."},
    {q:"Co wspiera barierę?",a:["Azelainowy","Ceramidy","Wit. C"],good:1,why:"Ceramidy odbudowują barierę."},
    {q:"Na przebarwienia?",a:["Wit. C","Cynk","Kwas hialuronowy"],good:0,why:"Wit. C i azelainowy rozjaśniają."}
  ];
  const [qi,setQi]=useState(0);
  const [good,setGood]=useState(0);
  const [total,setTotal]=useState(0);
  const [locked,setLocked]=useState(false);

  // --- PROGRES ---
  type Row={d?:string;n?:string;u?:string};
  const PKEY="skin-progress";
  const [rows,setRows]=useState<Row[]>(()=>{
    try{ return JSON.parse(localStorage.getItem(PKEY)||"[]")}catch{return[]}
  });
  useEffect(()=>{ localStorage.setItem(PKEY, JSON.stringify(rows)); },[rows]);

  // --- PLANER ---
  type PlanRow={am?:string;pm?:string};
  const RKEY="skin-plan";
  const [plan,setPlan]=useState<Record<number,PlanRow>>(()=>{
    try{ return JSON.parse(localStorage.getItem(RKEY)||"{}")}catch{return{}}
  });
  useEffect(()=>{ localStorage.setItem(RKEY, JSON.stringify(plan)); },[plan]);

  // --- BLOG ---
  const BLOG = [
    {t:"BHA 2% — kiedy i jak?", s:"Zacznij 2–3x/tydz., unikaj łączenia z retinoidem na start.", k:["BHA","peeling"]},
    {t:"Bariera hydrolipidowa", s:"Ceramidy + cholesterole + kw. tłuszczowe — szukaj INCI: ceramide NP/NS.", k:["ceramidy","bariera"]},
    {t:"Azelainowy 10–15%", s:"Delikatny na przebarwienia i niedoskonałości. Działa wolniej, ale stabilnie.", k:["azelainowy","przebarwienia"]}
  ];

  return (
    <div>
      <header className="topbar">
        <div className="brand"><span className="dot"/> <b>Skin Compass</b></div>
        <nav className="nav">
          <a href="#an">Analiza</a>
          <a href="#recs">Rekomendacje</a>
          <a href="#game">Gra</a>
          <a href="#quiz">Quiz</a>
          <a href="#prog">Progres</a>
          <a href="#plan">Planer</a>
          <a href="#blog">Blog</a>
          <a href="#legal">Prywatność</a>
        </nav>
      </header>

      <main className="container">
        {/* HERO */}
        <section className="hero">
          <h1>Wrzuć zdjęcie. Otrzymaj rekomendacje.</h1>
          <p className="muted">Wszystko lokalnie w przeglądarce. Edukacyjnie — bez porad medycznych.</p>
          <div className="hero-cards">
            <div className="card"><h3>Analiza</h3><p className="muted">Rozpoznanie kategorii + lista produktów.</p></div>
            <div className="card"><h3>Gra i quiz</h3><p className="muted">Ucz się dobierać składniki.</p></div>
            <div className="card"><h3>Plan i progres</h3><p className="muted">Planer + kapsuła before/after (localStorage).</p></div>
          </div>
        </section>

        {/* Analiza + Rekomendacje */}
        <div className="grid-2" id="an">
          <Section id="analyzer" title="Analiza zdjęcia (prywatnie)">
            <label className="uploader">
              <input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]||null; setFile(f); setCond(f?guessByName(f.name):undefined);}}/>
              <div>Przeciągnij i upuść / kliknij, aby wybrać</div>
            </label>
            {imgUrl && <div className="preview"><img src={imgUrl} alt="preview"/></div>}

            <div className="card soft">
              <div className="badge">Kategoria</div>
              <div className="mt6">{cond?LABELS[cond]:"—"}</div>
              <small className="muted">Edukacyjnie — to nie jest porada medyczna.</small>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={()=>setCond("tradzik")}>Trądzik</button>
              <button className="btn" onClick={()=>setCond("wagry")}>Wągry</button>
              <button className="btn" onClick={()=>setCond("sucha")}>Sucha skóra</button>
              <button className="btn" onClick={()=>setCond("przebarwienia")}>Przebarwienia</button>
              <button className="btn" onClick={()=>{setCond(undefined); setFile(null);}}>Wyczyść</button>
            </div>
          </Section>

          <Section id="recs" title="Najlepsze rekomendacje">
            {!cond && <p className="muted">Wybierz kategorię lub wrzuć zdjęcie.</p>}
            {cond && <>
              <div className="filters">
                <select value={fTime} onChange={e=>setFTime(e.target.value as any)}>
                  <option value="">Pora: dowolna</option><option value="rano">rano</option><option value="wieczór">wieczór</option>
                </select>
                <select value={fType} onChange={e=>setFType(e.target.value as any)}>
                  <option value="">Typ: dowolny</option><option value="żel">żel</option><option value="krem">krem</option><option value="tonik">tonik</option><option value="serum">serum</option>
                </select>
                <select value={fTier} onChange={e=>setFTier(e.target.value as any)}>
                  <option value="">Cena: dowolna</option><option value="budget">budżetowe</option><option value="mid">średnia półka</option><option value="pro">wyższa półka</option>
                </select>
              </div>
              <div className="list">
                {products.map((p,i)=>(
                  <div key={i} className="product">
                    <div className="dot"></div>
                    <div>
                      <div><b>{p.name}</b></div>
                      <div className="muted">{p.brand} • ⭐ {p.rating.toFixed(1)} • {p.price} • {p.time} • {p.type}</div>
                      <div className="tags">{p.tags.map(t=><span key={t} className="badge">{t}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </Section>
        </div>

        {/* GRA */}
        <Section id="game" title='Gra — „Dobierz składniki”'>
          <p className="muted">Cel: <b>{LABELS[goal as Key]}</b>. Wybierz maks. 3 składniki — im lepsze dopasowanie, tym więcej punktów.</p>
          <div className="game-grid">
            <div>
              <div className="badge">Składniki</div>
              <div className="chips">
                {ING.map(x=>{
                  const active = picked.includes(x);
                  return <button key={x} className={"chip"+(active?" active":"")} onClick={()=>togglePick(x)}>{x}</button>
                })}
              </div>
            </div>
            <div>
              <div className="badge">Twój wybór (max 3)</div>
              <div className="chips">{picked.map(x=><button key={x} className="chip active" onClick={()=>togglePick(x)}>{x}</button>)}</div>
              <div className="score mt12">Wynik: <b>{score}</b> {score>=100?"— Świetnie! 🎉":"— OK, spróbuj lepiej dopasować."}</div>
            </div>
          </div>
        </Section>

        {/* QUIZ */}
        <Section id="quiz" title="Quiz — pielęgnacja i składniki">
          <div className="quiz">
            <div className="q">{QUIZ[qi%QUIZ.length].q}</div>
            <div className="quiz-answers">
              {QUIZ[qi%QUIZ.length].a.map((txt,i)=>{
                return <button key={i} className="btn" disabled={locked}
                  onClick={()=>{
                    setTotal(t=>t+1);
                    if(i===QUIZ[qi%QUIZ.length].good) setGood(g=>g+1);
                    setLocked(true);
                  }}>{txt}</button>
              })}
            </div>
            {locked && <div className="muted small mt6">{QUIZ[qi%QUIZ.length].why}</div>}
            <div className="btn-row">
              <button className="btn" onClick={()=>{ setQi(q=>q+1); setLocked(false); }}>Następne</button>
              <span className="badge">Wynik: {good}/{total}</span>
            </div>
          </div>
        </Section>

        {/* PROGRES */}
        <Section id="prog" title="Progres — kapsuła before/after">
          <form className="progress-form" onSubmit={e=>{
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const d = (form.querySelector("#pDate") as HTMLInputElement).value;
            const n = (form.querySelector("#pNote") as HTMLInputElement).value;
            const f = (form.querySelector("#pImg") as HTMLInputElement).files?.[0];
            if(!d && !n && !f) return;
            if(f){
              const u = URL.createObjectURL(f);
              setRows(r=>[{d,n,u},...r]);
            } else setRows(r=>[{d,n},...r]);
            form.reset();
          }}>
            <input id="pDate" type="date" />
            <input id="pNote" placeholder="Notatka (np. tydzień 1 — BHA śr/pt)" />
            <input id="pImg" type="file" accept="image/*" />
            <button className="btn">Dodaj</button>
          </form>
          <div className="table">
            <div className="tr head"><div>Data</div><div>Notatka</div><div>Zdjęcie</div><div></div></div>
            <div>
              {rows.map((r,i)=>(
                <div className="tr" key={i}>
                  <div>{r.d||""}</div>
                  <div>{r.n||""}</div>
                  <div>{r.u? <img className="thumb" src={r.u}/> : ""}</div>
                  <div><button className="btn small" onClick={()=>setRows(x=>x.filter((_,k)=>k!==i))}>Usuń</button></div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* PLANER */}
        <Section id="plan" title="Planer rutyny">
          {["Pon","Wt","Śr","Czw","Pt","Sob","Nd"].map((d,idx)=>(
            <div className="planner-row" key={idx}>
              <div className="day">{d}</div>
              <div><input value={plan[idx]?.am||""} placeholder="np. SPF, tonik"
                onChange={e=>setPlan(p=>({...p,[idx]:{...(p[idx]||{}), am:e.target.value}}))}/></div>
              <div><input value={plan[idx]?.pm||""} placeholder="np. retinoid, krem"
                onChange={e=>setPlan(p=>({...p,[idx]:{...(p[idx]||{}), pm:e.target.value}}))}/></div>
            </div>
          ))}
          <div className="mt12"><button className="btn" onClick={()=>setPlan({})}>Resetuj planer</button></div>
        </Section>

        {/* BLOG */}
        <Section id="blog" title="Edukacja i wpisy">
          <div className="blog-grid">
            {BLOG.map((p,i)=>(
              <article key={i} className="card soft">
                <h3>{p.t}</h3>
                <p className="muted">{p.s}</p>
                <div className="tags">{p.k.map(x=><span key={x} className="badge">{x}</span>)}</div>
              </article>
            ))}
          </div>
        </Section>

        {/* LEGAL */}
        <Section id="legal" title="Informacje prawne">
          <details open><summary>Oświadczenie</summary>
            <p className="muted small mt6">Aplikacja ma charakter edukacyjny. Nie jest poradą ani usługą medyczną.</p>
          </details>
          <details><summary>Prywatność</summary>
            <ul className="muted small mt6">
              <li>Zdjęcia są przetwarzane wyłącznie lokalnie.</li>
              <li>Planer/progres w localStorage.</li>
            </ul>
          </details>
        </Section>
      </main>
    </div>
  );
}
