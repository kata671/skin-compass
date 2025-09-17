import { useState } from "react";
import "./styles.css";
import ImageAnalyzer from "./components/ImageAnalyzer";
import ProductList from "./components/ProductList";
import type { ConditionKey } from "./data/products";

const HERO = import.meta.env.BASE_URL + 'assets/hero-bg.jpg';

export default function App(){
  const [cond, setCond] = useState<ConditionKey | null>(null);
  return (
    <main className="container">
      <section className="hero">
        <h1>Wrzuć zdjęcie. Otrzymaj rekomendacje.</h1>
        <p>Kompas pielęgnacji — szybko, pięknie i bezpiecznie.</p>
        <img src={HERO} alt="hero" style={{width:"100%",maxWidth:900,borderRadius:16,border:"1px solid #23263A"}}/>
      </section>
      <section className="grid">
        <ImageAnalyzer onDetected={setCond} />
        <ProductList condition={cond} />
        <div className="card"><h3>Info</h3><p className="muted">To narzędzie edukacyjne (nie porada medyczna).</p></div>
      </section>
    </main>
  );
}
