import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarNav } from './layout/SidebarNav';
import { Dashboard } from './pages/Dashboard';
import { ModelSelectorTable } from './components/ModelSelectorTable';
import { ClusterMapPlaceholder } from './components/ClusterMapPlaceholder';
import { TheoryExplorer } from './components/TheoryExplorer';
import { EntityDemoList } from './components/EntityCard';

type Page = 'dashboard' | 'search' | 'clusters' | 'admin-models' | 'theory';
const qc = new QueryClient();

export default function App(){
  const [page, setPage] = useState<Page>('dashboard');
  return (
    <QueryClientProvider client={qc}>
      <div className="flex h-screen text-neutral-200 bg-neutral-950">
        <SidebarNav current={page} onNavigate={setPage} />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {page === 'dashboard' && <Dashboard />}
          {page === 'search' && <div className="space-y-4"><h2 className="font-semibold">Search (placeholder)</h2><EntityDemoList /></div>}
          {page === 'theory' && <TheoryExplorer />}
          {page === 'clusters' && <ClusterMapPlaceholder />}
          {page === 'admin-models' && <ModelSelectorTable />}
        </main>
      </div>
    </QueryClientProvider>
  );
}

