import { useState } from 'react';

export function TheoryExplorer(){
  const [theory, setTheory] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(){
    if(theory.trim().length < 5) return;
    setLoading(true);
    // Placeholder simulated classification result
    setTimeout(()=>{
      setResult({ supports: [], contradicts: [], related_suggestions: ['Example related theory A','Example related theory B'] });
      setLoading(false);
    }, 500);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={theory} onChange={e=>setTheory(e.target.value)} placeholder="Enter a theory or question..." className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm" />
        <button onClick={submit} className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40" disabled={loading || theory.trim().length<5}>{loading? 'Analyzing...':'Submit'}</button>
      </div>
      {result && (
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-semibold mb-1 text-green-400">Supporting (0)</h3>
            <div className="opacity-60 italic">No evidence (placeholder)</div>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-red-400">Contradicting (0)</h3>
            <div className="opacity-60 italic">No evidence (placeholder)</div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-1">Related Suggestions</h4>
            <div className="flex flex-wrap gap-2">{result.related_suggestions.map((s:string)=>(<span key={s} className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700">{s}</span>))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
