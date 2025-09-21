import { useState } from 'react';
import { ModelSelectorTable } from './components/ModelSelectorTable';
import { ClusterMapPlaceholder } from './components/ClusterMapPlaceholder';
import { TheoryExplorer } from './components/TheoryExplorer';

type Page = 'search' | 'clusters' | 'admin-models' | 'theory';

export default function App() {
  const [page, setPage] = useState<Page>('search');
  return (
    <div className="p-4 space-y-4">
      <nav className="flex gap-4 flex-wrap items-center">
        <button className={btn(page==='search')} onClick={()=>setPage('search')}>Search</button>
        <button className={btn(page==='theory')} onClick={()=>setPage('theory')}>Theory</button>
        <button className={btn(page==='clusters')} onClick={()=>setPage('clusters')}>Clusters</button>
        <button className={btn(page==='admin-models')} onClick={()=>setPage('admin-models')}>Admin: Models</button>
      </nav>
      {page === 'search' && <div className="text-sm opacity-70">Search UI TBD</div>}
      {page === 'theory' && <TheoryExplorer />}
      {page === 'clusters' && <ClusterMapPlaceholder />}
      {page === 'admin-models' && <ModelSelectorTable />}
    </div>
  );
}

function btn(active: boolean){
  return `px-3 py-1 rounded text-sm border ${active? 'bg-neutral-800 border-neutral-600':'border-neutral-700 hover:bg-neutral-800'}`;
}

