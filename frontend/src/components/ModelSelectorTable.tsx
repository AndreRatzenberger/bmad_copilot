import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ApiModel {
  name: string;
  type: string;
  default: boolean;
}

interface Envelope<T>{ ok: boolean; data: T; }

export function ModelSelectorTable(){
  const { data, isLoading, error } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await axios.get<Envelope<{models: ApiModel[]}>>('/admin/models/', { headers: { 'X-Admin-Key': 'changeme-admin' }});
      return res.data.data.models;
    }
  });

  if(isLoading) return <div className="text-xs">Loading models...</div>;
  if(error) return <div className="text-xs text-red-400">Error loading models</div>;
  return (
    <table className="text-xs w-full border-collapse">
      <thead>
        <tr className="text-left border-b border-neutral-700"><th>Name</th><th>Type</th><th>Default</th></tr>
      </thead>
      <tbody>
        {data?.map(m => (
          <tr key={m.name} className="border-b border-neutral-800">
            <td>{m.name}</td>
            <td>{m.type}</td>
            <td>{m.default? 'Yes':'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
