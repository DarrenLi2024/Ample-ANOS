'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function LocalizationPage() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/products', { headers: { 'X-User-Role': 'SystemAdmin' } })
      .then(r => r.json()).then(d => setProducts((d.data||d||[]).filter((p:any) => p.is_domestic > 0).slice(0,5))).catch(()=>{});
  }, []);
  return (
    <WorkspaceLayout title="国产替代推荐">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5"><h2 className="text-base font-semibold mb-4">国产替代方案</h2>
          <div className="space-y-3">
            {products.map((p:any,i:number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div><div className="font-semibold text-sm">{p.mpn}</div><div className="text-xs text-gray-400">{p.brand} · {p.category}</div></div>
                <span className="tag tag-green">替代可选</span>
              </div>
            ))}
            {products.length === 0 && <p className="text-sm text-gray-400">加载国产物料数据中...</p>}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
