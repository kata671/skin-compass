import { useEffect, useMemo, useState } from "react";
import { conditionLabels, guessConditionFromFilename } from "../utils/classifier";
import type { ConditionKey } from "../data/products";

export default function ImageAnalyzer({ onDetected }:{ onDetected:(cond:ConditionKey|null)=>void }){
  const [file, setFile] = useState<File | null>(null);
  const [manual, setManual] = useState<ConditionKey | "auto" | "none">("auto");
  const [autoDetected, setAutoDetected] = useState<ConditionKey | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setImgUrl(null); setAutoDetected(null); onDetected(null); return; }
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    const g = guessConditionFromFilename(file.name);
    setAutoDetected(g);
    onDetected(g);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const activeCondition: ConditionKey | null = useMemo(() => {
    if (manual === "none") return null;
    if (manual === "auto") return autoDetected;
    return manual;
  }, [manual, autoDetected]);

  useEffect(() => { onDetected(activeCondition); }, [activeCondition]);

  return (
    <div className="card">
      <h3>Analiza zdjęcia (bezpiecznie)</h3>
      <label className="uploader" htmlFor="file">
        <strong>Przeciągnij i upuść</strong> albo <span className="badge">Wybierz plik</span>
        <input id="file" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
        {imgUrl && <div className="preview"><img src={imgUrl} alt="podgląd" /></div>}
      </label>

      <div className="card" style={{marginTop:12}}>
        <div className="badge">Wynik</div>
        <p style={{marginTop:8}}>
          {activeCondition ? <b>{conditionLabels[activeCondition]}</b> : "Brak wybranej kategorii"}
        </p>
        <small className="muted">To nie jest diagnoza medyczna. To kategorie pielęgnacyjne.</small>
      </div>
    </div>
  );
}
