import React, { useEffect, useMemo, useState } from "react";

/* ======== Dane demo (do podmiany na backend, gdy bÄ™dziesz gotowa) ======== */
type Key = "tradzik" | "wagry" | "sucha" | "przebarwienia";
type Product = {
  name: string; brand: string; rating: number; price: string;
  time: "rano" | "wieczĂłr"; type: "ĹĽel" | "krem" | "tonik" | "serum";
  tier: "budget" | "mid" | "pro"; tags: string[];
};
const LABELS: Record<Key,string> = {
  tradzik: "TrÄ…dzik",
  wagry: "WÄ…gry / zaskĂłrniki",
  sucha: "Sucha skĂłra",
  przebarwienia: "Przebarwienia"
};
const PRODUCTS: Record<Key, Product[]> = {
  tradzik: [
    { name:"Acne Control Gel 2%", brand:"BX Labs", rating:4.7, price:"od 39 zĹ‚", time:"wieczĂłr", type:"ĹĽel", tier:"budget", tags:["BHA","noc"] },
    { name:"Kwas azelainowy 10%", brand:"Dr. AZE", rating:4.6, price:"od 49 zĹ‚", time:"rano", type:"serum", tier:"mid", tags:["azelainowy","przebarwienia"] }
  ],
  wagry: [
    { name:"Tonik BHA 2%", brand:"ClearWave", rating:4.6, price:"od 35 zĹ‚", time:"wieczĂłr", type:"tonik", tier:"budget", tags:["pory","strefa-T"] }
  ],
  sucha: [
    { name:"Krem z ceramidami", brand:"BarrierLab", rating:4.8, price:"od 39 zĹ‚", time:"rano", type:"krem", tier:"mid", tags:["bariera"] }
  ],
  przebarwienia: [
    { name:"Serum z wit. C 15%", brand:"C-Glow", rating:4.5, price:"od 59 zĹ‚", time:"rano", type:"serum", tier:"mid", tags:["antyoksydant","rozĹ›wietlenie"] }
  ]
};
const ING = ["BHA 2%","Retinoid","Niacynamid","Ceramidy","Kwas azelainowy","Wit. C","Kwas hialuronowy","Cynk","Bakuchiol","Peptydy"];
const MATCH: Record<Key,string[]> = {
  tradzik:["BHA 2%","Kwas azelainowy","Retinoid","Cynk","Niacynamid"],
  wagry:["BHA 2%","Niacynamid","Retinoid"],
  sucha:["Ceramidy","Kwas hialuronowy","Peptydy","Bakuchiol"],
  przebarwienia:["Wit. C","Kwas azelainowy","Retinoid","Niacynamid"]
};

/* ======== Pomocnicze ======== */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="section card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/* ======== App ======== */
export default function App() {
  // Analiza (lokalnie)
  const [file, setFile] = useState<File | null>(null);
  const [cond, setCond] = useState<Key | undefined>(undefined);
  const imgUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => { if (imgUrl) URL.revokeObjectURL(imgUrl); }, [imgUrl]);

  function guessByName(n: string): Key | undefined {
    const s = n.toLowerCase();
    if (/acne|tradzik|pimple|pryszcz/.test(s)) return "tradzik";
    if (/blackhead|wagry|comedone|pory/.test(s)) return "wagry";
    if (/dry|sucha|xerosis|flaky/.test(s)) return "sucha";
    if (/spot|dark|melasma|przebarw/.test(s)) return "przebarwienia";
    return undefined;
  }

  // Filtry
  const [fTime, setFTime] = useState<"" | "rano" | "wieczĂłr">("");
  const [fType, setFType] = useState<"" | "ĹĽel" | "krem" | "tonik" | "serum">("");
  const [fTier, setFTier] = useState<"" | "budget" | "mid" | "pro">("");
  const products = useMemo(() => {
    if (!cond) return [];
    return PRODUCTS[cond]
      .filter(p => !fTime || p.time === fTime)
      .filter(p => !fType || p.type === fType)
      .filter(p => !fTier || p.tier === fTier);
  }, [cond, fTime, fType, fTier]);

  // Gra
  const [picked, setPicked] = useState<string[]>([]);
  const goal = cond ?? "tradzik";
  const score = useMemo(() => picked.reduce((s, x) => s + (MATCH[goal as Key].includes(x) ? 50 : -25), 0), [picked, goal]);
  function togglePick(x: string) {
    setPicked(prev => prev.includes(x) ? prev.filter(i => i!==x) : (prev.length<3 ? [...prev,x] : prev));
  }

  // Quiz
  const QUIZ = [
    { q: "Najlepsze na zaskĂłrniki?", a: ["BHA 2%", "Ceramidy", "Kwas hialuronowy"], good: 0, why: "BHA rozpuszcza sebum w porach." },
    { q: "Co wspiera barierÄ™?", a: ["Azelainowy", "Ceramidy", "Wit. C"], good: 1, why: "Ceramidy odbudowujÄ… barierÄ™." },
    { q: "Na przebarwienia?", a: ["Wit. C", "Cynk", "Kwas hialuronowy"], good: 0, why: "Wit. C i azelainowy rozjaĹ›niajÄ…." }
  ];
  const [qi, setQi] = useState(0), [good, setGood] = useState(0), [total, setTotal] = useState(0), [locked, setLocked] = useState(false);

  // Progres
  type Row = { d?: string; n?: string; u?: string };
  const [rows, setRows] = useState<Row[]>(() => { try { return JSON.parse(localStorage.getItem("skin-progress")||"[]"); } catch { return []; }});
  useEffect(()=>{ localStorage.setItem("skin-progress", JSON.stringify(rows)); },[rows]);

  // Planer
  type PlanRow = { am?: string; pm?: string };
  const [plan, setPlan] = useState<Record<number, PlanRow>>(() => { try { return JSON.parse(localStorage.getItem("skin-plan")||"{}"); } catch { return {}; }});
  useEffect(()=>{ localStorage.setItem("skin-plan", JSON.stringify(plan)); },[plan]);

  // Blog
  const BLOG = [
    { t: "BHA 2% â€” kiedy i jak?", s: "Zacznij 2â€“3Ă—/tydz., unikaj Ĺ‚Ä…czenia z retinoidem na start.", k: ["BHA","peeling"] },
    { t: "Bariera hydrolipidowa", s: "Ceramidy + cholesterole + kw. tĹ‚uszczowe â€” INCI: ceramide NP/NS.", k: ["ceramidy","bariera"] },
    { t: "Azelainowy 10â€“15%", s: "Delikatny na przebarwienia i niedoskonaĹ‚oĹ›ci; stabilny, ale wolniejszy.", k: ["azelainowy","przebarwienia"] },
  ];

  return (
    <div>
      {/* ---- TOP ---- */}
      <header className="topbar">
        <div className="brand"><span className="dot" /> <b>Skin Compass</b></div>
        <nav className="nav">
          <a href="#an">Analiza</a>
          <a href="#recs">Rekomendacje</a>
          <a href="#game">Gra</a>
          <a href="#quiz">Quiz</a>
          <a href="#prog">Progres</a>
          <a href="#plan">Planer</a>
          <a href="#blog">Blog</a>
          <a href="#legal">PrywatnoĹ›Ä‡</a>
        </nav>
      </header>

      <main className="container">
        {/* ---- HERO ---- */}
        <section className="hero">
          <h1>WrzuÄ‡ zdjÄ™cie. Otrzymaj rekomendacje.</h1>
          <p className="muted">Wszystko lokalnie w przeglÄ…darce. Edukacyjnie â€” bez porad medycznych.</p>
          <div className="hero-cards">
            <div className="card"><h3>Analiza</h3><p className="muted">Rozpoznanie kategorii + lista produktĂłw.</p></div>
            <div className="card"><h3>Gra i quiz</h3><p className="muted">Ucz siÄ™ dobieraÄ‡ skĹ‚adniki.</p></div>
            <div className="card"><h3>Plan i progres</h3><p className="muted">Planer + kapsuĹ‚a before/after.</p></div>
          </div>
        </section>

        {/* ---- ANALIZA + RECS ---- */}
        <div className="grid-2" id="an">
          <Section id="analyzer" title="Analiza zdjÄ™cia (prywatnie)">
            <label className="uploader">
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f); setCond(f ? guessByName(f.name) : undefined);
              }}/>
              <div>PrzeciÄ…gnij i upuĹ›Ä‡ / kliknij, aby wybraÄ‡</div>
            </label>
            {imgUrl && <div className="preview"><img src={imgUrl} alt="preview" /></div>}

            <div className="card soft mt10">
              <div className="badge">Kategoria</div>
              <div className="mt6">{cond ? LABELS[cond] : "â€”"}</div>
              <small className="muted">Edukacyjnie â€” to nie jest porada medyczna.</small>
            </div>

            <div className="btn-row mt10">
              <button className="btn" onClick={() => setCond("tradzik")}>TrÄ…dzik</button>
              <button className="btn" onClick={() => setCond("wagry")}>WÄ…gry</button>
              <button className="btn" onClick={() => setCond("sucha")}>Sucha skĂłra</button>
              <button className="btn" onClick={() => setCond("przebarwienia")}>Przebarwienia</button>
              <button className="btn" onClick={() => { setCond(undefined); setFile(null); }}>WyczyĹ›Ä‡</button>
            </div>
          </Section>

          <Section id="recs" title="Najlepsze rekomendacje">
            {!cond && <p className="muted">Wybierz kategoriÄ™ lub wrzuÄ‡ zdjÄ™cie.</p>}
            {cond && <>
              <div className="filters">
                <select value={fTime} onChange={e=>setFTime(e.target.value as any)}>
                  <option value="">Pora: dowolna</option><option value="rano">rano</option><option value="wieczĂłr">wieczĂłr</option>
                </select>
                <select value={fType} onChange={e=>setFType(e.target.value as any)}>
                  <option value="">Typ: dowolny</option><option value="ĹĽel">ĹĽel</option><option value="krem">krem</option><option value="tonik">tonik</option><option value="serum">serum</option>
                </select>
                <select value={fTier} onChange={e=>setFTier(e.target.value as any)}>
                  <option value="">Cena: dowolna</option><option value="budget">budĹĽetowe</option><option value="mid">Ĺ›rednia pĂłĹ‚ka</option><option value="pro">wyĹĽsza pĂłĹ‚ka</option>
                </select>
              </div>

              <div className="list">
                {products.map((p, i)=>(
                  <div key={i} className="product">
                    <div className="dot"></div>
                    <div>
                      <div><b>{p.name}</b></div>
                      <div className="muted">{p.brand} â€˘ â­ {p.rating.toFixed(1)} â€˘ {p.price} â€˘ {p.time} â€˘ {p.type}</div>
                      <div className="tags">{p.tags.map(t=><span key={t} className="badge">{t}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </Section>
        </div>

        {/* ---- GRA ---- */}
        <Section id="game" title='Gra â€” â€žDobierz skĹ‚adnikiâ€ť'>
          <p className="muted">Cel: <b>{LABELS[(goal as Key)]}</b>. Wybierz maks. 3 â€” dobre trafienia = wiÄ™cej punktĂłw.</p>
          <div className="game-grid">
            <div>
              <div className="badge">SkĹ‚adniki</div>
              <div className="chips">
                {ING.map(x=>{
                  const on=picked.includes(x);
                  return <button key={x} className={"chip"+(on?" active":"")} onClick={()=>togglePick(x)}>{x}</button>
                })}
              </div>
            </div>
            <div>
              <div className="badge">TwĂłj wybĂłr (max 3)</div>
              <div className="chips">{picked.map(x=><button key={x} className="chip active" onClick={()=>togglePick(x)}>{x}</button>)}</div>
              <div className="score mt10">Wynik: <b>{score}</b> {score>=100?"â€” Ĺšwietnie! âś¨":"â€” SprĂłbuj lepiej dopasowaÄ‡."}</div>
            </div>
          </div>
        </Section>

        {/* ---- QUIZ ---- */}
        <Section id="quiz" title="Quiz â€” pielÄ™gnacja i skĹ‚adniki">
          <div className="quiz">
            <div className="q">{QUIZ[qi%QUIZ.length].q}</div>
            <div className="quiz-answers">
              {QUIZ[qi%QUIZ.length].a.map((txt,i)=>(
                <button key={i} className="btn" disabled={locked}
                  onClick={()=>{
                    setTotal(t=>t+1);
                    if(i===QUIZ[qi%QUIZ.length].good) setGood(g=>g+1);
                    setLocked(true);
                  }}>{txt}</button>
              ))}
            </div>
            {locked && <div className="muted small mt6">{QUIZ[qi%QUIZ.length].why}</div>}
            <div className="btn-row mt10">
              <button className="btn primary" onClick={()=>{setQi(q=>q+1);setLocked(false)}}>NastÄ™pne</button>
              <span className="badge">Wynik: {good}/{total}</span>
            </div>
          </div>
        </Section>

        {/* ---- PROGRES ---- */}
        <Section id="prog" title="Progres â€” kapsuĹ‚a before/after">
          <form className="progress-form" onSubmit={e=>{
            e.preventDefault();
            const form=e.currentTarget as HTMLFormElement;
            const d=(form.querySelector("#pDate") as HTMLInputElement).value;
            const n=(form.querySelector("#pNote") as HTMLInputElement).value;
            const f=(form.querySelector("#pImg") as HTMLInputElement).files?.[0];
            if(!d && !n && !f) return;
            if(f){ const u=URL.createObjectURL(f); setRows(r=>[{d,n,u},...r]); } else setRows(r=>[{d,n},...r]);
            form.reset();
          }}>
            <input id="pDate" type="date" />
            <input id="pNote" placeholder="Notatka (np. tydzieĹ„ 1 â€” BHA Ĺ›r/pt)" />
            <input id="pImg" type="file" accept="image/*" />
            <button className="btn">Dodaj</button>
          </form>
          <div className="table">
            <div className="tr head"><div>Data</div><div>Notatka</div><div>ZdjÄ™cie</div><div></div></div>
            <div>
              {rows.map((r,i)=>(
                <div className="tr" key={i}>
                  <div>{r.d||""}</div>
                  <div>{r.n||""}</div>
                  <div>{r.u?<img className="thumb" src={r.u}/>: ""}</div>
                  <div><button className="btn small" onClick={()=>setRows(x=>x.filter((_,k)=>k!==i))}>UsuĹ„</button></div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ---- PLANER ---- */}
        <Section id="plan" title="Planer rutyny">
          {["Pon","Wt","Ĺšr","Czw","Pt","Sob","Nd"].map((d,idx)=>(
            <div className="planner-row" key={idx}>
              <div className="day">{d}</div>
              <div><input value={plan[idx]?.am||""} placeholder="np. SPF, tonik"
                onChange={e=>setPlan(p=>({ ...p, [idx]: { ...(p[idx]||{}), am:e.target.value } }))}/></div>
              <div><input value={plan[idx]?.pm||""} placeholder="np. retinoid, krem"
                onChange={e=>setPlan(p=>({ ...p, [idx]: { ...(p[idx]||{}), pm:e.target.value } }))}/></div>
            </div>
          ))}
          <div className="mt14"><button className="btn" onClick={()=>setPlan({})}>Resetuj planer</button></div>
        </Section>

        {/* ---- BLOG ---- */}
        <Section id="blog" title="Edukacja i wpisy">
          <div className="blog-grid">
            {[
              { t:"BHA 2% â€” kiedy i jak?", s:"Zacznij 2â€“3Ă—/tydz., unikaj Ĺ‚Ä…czenia z retinoidem na start.", k:["BHA","peeling"]},
              { t:"Bariera hydrolipidowa", s:"Ceramidy + cholesterole + KT = bariera.", k:["ceramidy","bariera"]},
              { t:"Azelainowy 10â€“15%", s:"Delikatny na przebarwienia i niedoskonaĹ‚oĹ›ci.", k:["azelainowy","przebarwienia"]}
            ].map((p,i)=>(
              <article key={i} className="card soft">
                <h3>{p.t}</h3>
                <p className="muted">{p.s}</p>
                <div className="tags">{p.k.map(x=><span key={x} className="badge">{x}</span>)}</div>
              </article>
            ))}
          </div>
        </Section>

        {/* ---- LEGAL ---- */}
        <Section id="legal" title="Informacje prawne">
          <details open><summary>OĹ›wiadczenie</summary>
            <p className="muted small mt6">Aplikacja ma charakter edukacyjny. Nie jest poradÄ… ani usĹ‚ugÄ… medycznÄ….</p>
          </details>
          <details><summary>PrywatnoĹ›Ä‡</summary>
            <ul className="muted small mt6">
              <li>ZdjÄ™cia sÄ… przetwarzane wyĹ‚Ä…cznie lokalnie â€” nie wysyĹ‚amy plikĂłw.</li>
              <li>Planer i progres zapisywane w localStorage przeglÄ…darki.</li>
            </ul>
          </details>
        </Section>
      </main>
    </div>
  );
}

