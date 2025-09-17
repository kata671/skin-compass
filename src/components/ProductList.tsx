import { productsByCondition, type Product, type ConditionKey } from "../data/products";
import { conditionLabels } from "../utils/classifier";

export default function ProductList({ condition }:{ condition:ConditionKey|null }){
  if(!condition){
    return (<div className="card"><h3>Najlepiej oceniane produkty</h3><p className="muted">Wybierz kategorię, aby zobaczyć rekomendacje.</p></div>);
  }
  const items: Product[] = productsByCondition[condition] ?? [];
  return (
    <div className="card">
      <h3>Top rekomendacje — {conditionLabels[condition]}</h3>
      <div className="grid" style={{marginTop:12}}>
        {items.map(p => (
          <div className="card" key={p.id}>
            <div style={{display:"flex",gap:12}}>
              <img src={p.image} alt={p.name} style={{width:72,height:72,borderRadius:12,border:"1px solid var(--border)"}}/>
              <div>
                <b>{p.name}</b>
                <div className="muted">{p.brand} • <span className="badge">{p.type}</span></div>
                <div style={{marginTop:6}}>⭐ {p.rating.toFixed(1)} • {p.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
