'use client';
import { useState } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { KpiCard } from '@/components/KpiCard';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { ResourceIntelligenceCard } from '@/components/ResourceIntelligenceCard';
import { MarketIntelligenceCard } from '@/components/MarketIntelligenceCard';
import { getPortalConfig, type PortalConfig } from '@/lib/role-based-portal';
import { FileSearch, Package, Lightbulb, FileText, Star, TrendingUp, Clock, Shield } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  FileSearch: <FileSearch size={26} />, Package: <Package size={26} />,
  Lightbulb: <Lightbulb size={26} />, FileText: <FileText size={26} />,
};

interface SupplyItem {
  id: string; supplier: string; brand: string; mpn: string; stock: number;
  price: string; leadTime: string; dateCode: string; score: number; status: string; source: string; updatedAt: string;
  contact?: string; email?: string; phone?: string; note?: string;
}
interface InquiryItem {
  id: string; salesName: string; salesNameEn: string; customerCode: string;
  brand: string; mpn: string; qty: number; targetPrice: string; priority: string; matched: number; updatedAt: string; action: string;
}

const supplyResources: SupplyItem[] = [
  { id: 'SR-001', supplier: 'Arrow Electronics', brand: 'ST', mpn: 'STM32F407VET6', stock: 8000, price: '$4.10', leadTime: '2周', dateCode: '22+', score: 92, status: '已验证', source: '邮件报价单', updatedAt: '10分钟前', contact: 'John Smith', email: 'john@arrow.com', note: '原厂授权代理，支持小批量采购' },
  { id: 'SR-002', supplier: 'Mouser', brand: 'ST', mpn: 'STM32F407VET6', stock: 5000, price: '$4.20', leadTime: '1周', dateCode: '23+', score: 88, status: '已验证', source: 'API同步', updatedAt: '30分钟前', contact: 'Jane Doe', email: 'jane@mouser.com', note: '在线库存实时更新，支持信用卡支付' },
  { id: 'SR-003', supplier: 'Avnet', brand: 'TI', mpn: 'TMS320F28335PGFA', stock: 3000, price: '$8.50', leadTime: '2周', dateCode: '22+', score: 85, status: '已匹配', source: 'Sales提交', updatedAt: '1小时前', contact: 'Mike Chen', email: 'mike@avnet.com', note: '已与 Sales Lisa 的询价匹配' },
  { id: 'SR-004', supplier: 'Digi-Key', brand: 'Espressif', mpn: 'ESP32-WROOM-32E', stock: 15000, price: '$1.70', leadTime: '1周', dateCode: '24+', score: 90, status: '已验证', source: '网站爬取', updatedAt: '2小时前', contact: 'Support', email: 'support@digikey.com', note: '大批量现货，价格有竞争力' },
  { id: 'SR-005', supplier: '华强电子世界', brand: 'Winbond', mpn: 'W25Q128JVSIM', stock: 20000, price: '$0.55', leadTime: '3天', dateCode: '23+', score: 82, status: '待验证', source: '微信截图', updatedAt: '3小时前', contact: '李老板', email: '', note: '华强北柜台，需现场验货' },
  { id: 'SR-006', supplier: 'Rochester', brand: 'Intel', mpn: 'EP4CE22F17C8N', stock: 1200, price: '$33.00', leadTime: '3周', dateCode: '21+', score: 75, status: '已验证', source: '邮件报价单', updatedAt: '1天前' },
  { id: 'SR-007', supplier: 'Future Electronics', brand: 'Micron', mpn: 'MT41K256M16TW-107:P', stock: 5000, price: '$3.00', leadTime: '1周', dateCode: '23+', score: 88, status: '已验证', source: 'API同步', updatedAt: '2天前' },
  { id: 'SR-008', supplier: '唯样科技', brand: 'GigaDevice', mpn: 'GD32F103C8T6', stock: 15000, price: '$0.70', leadTime: '1周', dateCode: '24+', score: 78, status: '待验证', source: '微信群聊', updatedAt: '3天前' },
];

const matchableInquiries: InquiryItem[] = [
  { id: 'INQ-001', salesName: 'Sales Pilot', salesNameEn: 'Zhang Wei', customerCode: 'C-10293', brand: 'ST', mpn: 'STM32F407VET6', qty: 5000, targetPrice: '$4.50', priority: '高', matched: 3, updatedAt: '10分钟前', action: '匹配' },
  { id: 'INQ-002', salesName: 'Sales Lisa', salesNameEn: 'Li Na', customerCode: 'C-20471', brand: 'TI', mpn: 'TMS320F28335PGFA', qty: 2000, targetPrice: '$9.00', priority: '紧急', matched: 1, updatedAt: '30分钟前', action: '匹配' },
  { id: 'INQ-003', salesName: 'Sales Tom', salesNameEn: 'Wang Tao', customerCode: 'C-30852', brand: 'Intel', mpn: 'EP4CE22F17C8N', qty: 1000, targetPrice: '$35.00', priority: '中', matched: 0, updatedAt: '1小时前', action: '匹配' },
  { id: 'INQ-004', salesName: 'Sales Mike', salesNameEn: 'Chen Ming', customerCode: 'C-15609', brand: 'ST', mpn: 'STM32H743ZIT6', qty: 800, targetPrice: '$12.00', priority: '中', matched: 0, updatedAt: '1小时前', action: '匹配' },
  { id: 'INQ-005', salesName: 'Sales Nina', salesNameEn: 'Liu Yang', customerCode: 'C-42108', brand: 'Winbond', mpn: 'W25Q128JVSIM', qty: 10000, targetPrice: '$0.60', priority: '高', matched: 2, updatedAt: '2小时前', action: '匹配' },
  { id: 'INQ-006', salesName: 'Sales Jack', salesNameEn: 'Zhao Lei', customerCode: 'C-08734', brand: 'Micron', mpn: 'MT41K256M16TW-107:P', qty: 3000, targetPrice: '$3.20', priority: '低', matched: 1, updatedAt: '3小时前', action: '匹配' },
  { id: 'INQ-007', salesName: 'Sales Lisa', salesNameEn: 'Li Na', customerCode: 'C-20471', brand: 'TI', mpn: 'MAX3232EIPWR', qty: 5000, targetPrice: '$0.35', priority: '中', matched: 0, updatedAt: '5小时前', action: '匹配' },
  { id: 'INQ-008', salesName: 'Sales Pilot', salesNameEn: 'Zhang Wei', customerCode: 'C-10293', brand: 'GigaDevice', mpn: 'GD32F103C8T6', qty: 10000, targetPrice: '$0.80', priority: '低', matched: 1, updatedAt: '1天前', action: '匹配' },
];

export default function HomePage() {
  const [role] = useState<'Procurement' | 'Sales' | 'CEO'>('Procurement');
  const config: PortalConfig = getPortalConfig(role);
  const [selectedSupply, setSelectedSupply] = useState<SupplyItem | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const pColor = (p: string) => p === '紧急' ? 'tag-red' : p === '高' ? 'tag-yellow' : p === '中' ? 'tag-blue' : 'tag-gray';
  const sColor = (s: string) => s === '已验证' ? 'tag-green' : s === '已匹配' ? 'tag-purple' : 'tag-yellow';

  return (
    <WorkspaceLayout
      title="AI 智能工作台"
      agentStatuses={config.agentStatuses}
      rightPanel={
        <div className="p-4 space-y-5">
          {selectedInquiry ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">需求详情</h3>
                <button onClick={() => { setSelectedInquiry(null); setSelectedSupply(null); }} className="text-xs text-gray-400 hover:text-gray-600">✕ 关闭</button>
              </div>
              <div className="proto-card-accent p-4 text-sm space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedInquiry.salesName}</h4>
                  <p className="text-xs text-gray-400">{selectedInquiry.salesNameEn} · 客户 {selectedInquiry.customerCode}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-400">品牌</span><div className="font-medium">{selectedInquiry.brand}</div></div>
                  <div><span className="text-gray-400">型号</span><div className="font-mono font-medium">{selectedInquiry.mpn}</div></div>
                  <div><span className="text-gray-400">数量</span><div className="font-medium">{selectedInquiry.qty.toLocaleString()}</div></div>
                  <div><span className="text-gray-400">目标价</span><div className="font-medium">{selectedInquiry.targetPrice}</div></div>
                  <div><span className="text-gray-400">优先级</span><div><span className={`tag ${selectedInquiry.priority === '紧急' ? 'tag-red' : selectedInquiry.priority === '高' ? 'tag-yellow' : 'tag-blue'}`}>{selectedInquiry.priority}</span></div></div>
                  <div><span className="text-gray-400">已匹配</span><div><span className="tag tag-green">{selectedInquiry.matched} 个资源</span></div></div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">更新时间: {selectedInquiry.updatedAt}</p>
                </div>
                <button className="btn-primary w-full !py-2 !text-sm">匹配供应资源</button>
              </div>
            </>
          ) : selectedSupply ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Offer 详情</h3>
                <button onClick={() => setSelectedSupply(null)} className="text-xs text-gray-400 hover:text-gray-600">✕ 关闭</button>
              </div>
              <ResourceIntelligenceCard
                supplierName={selectedSupply.supplier}
                authorizationStatus={selectedSupply.score >= 85 ? '授权代理' : '独立分销'}
                resourceScore={selectedSupply.score}
                priceScore={selectedSupply.price ? 88 : 0}
                deliveryScore={selectedSupply.leadTime.includes('周') ? 75 : 90}
                qualityScore={selectedSupply.score >= 85 ? 90 : 70}
                riskScore={100 - selectedSupply.score}
              />
              <SourceCard
                source={`${selectedSupply.supplier} ${selectedSupply.source}`}
                sourceType={selectedSupply.source.includes('邮件') ? 'Email' : selectedSupply.source.includes('API') ? 'API' : 'WeChat'}
                sourceOwner={selectedSupply.contact || '供应商'}
                eventTime={selectedSupply.updatedAt}
                capturedAt={selectedSupply.updatedAt}
                verifiedBy="Procurement Agent"
                confidenceScore={selectedSupply.score}
                status={selectedSupply.status === '已验证' ? 'verified' : 'unverified'}
              />
              {selectedSupply.contact && (
                <div className="proto-card p-4 text-sm space-y-1.5">
                  <h4 className="font-semibold text-gray-800 mb-2">联系信息</h4>
                  <div className="flex justify-between text-xs"><span className="text-gray-400">联系人</span><span>{selectedSupply.contact}</span></div>
                  {selectedSupply.email && <div className="flex justify-between text-xs"><span className="text-gray-400">邮箱</span><span className="text-brand-600">{selectedSupply.email}</span></div>}
                  {selectedSupply.note && <div className="flex justify-between text-xs"><span className="text-gray-400">备注</span><span>{selectedSupply.note}</span></div>}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="proto-card-accent overflow-hidden">
                <AgentSuggestionCard
                  agentName="Procurement Agent"
                  agentType="Procurement"
                  conclusion="点击供应资源池中的任意 Offer 查看详情。"
                  evidence={['选择一条供应资源以查看评分卡和来源追溯']}
                  sourceId="SRC-PROC-001"
                  generatedAt={new Date().toLocaleString()}
                  confidenceScore={90}
                  suggestedActions={[]}
                  requiresApproval={false}
                />
              </div>
              <MarketIntelligenceCard />
            </>
          )}
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {config.kpis.map((kpi, i) => (
            <KpiCard key={i} label={kpi.label} value={kpi.value} change={kpi.change} trend={kpi.trend} icon={iconMap[kpi.icon]} colorClass={['bg-blue-50 text-blue-600','bg-purple-50 text-purple-600','bg-green-50 text-green-600','bg-amber-50 text-amber-600'][i]} />
          ))}
        </div>

        {/* 供应资源池 — 点击穿透 */}
        <div className="proto-card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">供应资源池</h3>
            <div className="flex items-center gap-1.5">
              <button className="px-2.5 py-1 text-xs rounded-md bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors font-medium">上传资源</button>
              <button className="px-2.5 py-1 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors font-medium">解析报价</button>
              <button className="px-2.5 py-1 text-xs rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors font-medium">批量验证</button>
              <a href="/offers" className="px-2.5 py-1 text-xs rounded-md text-gray-400 hover:text-brand-600 hover:bg-gray-50 transition-colors font-medium">查看更多 →</a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="proto-table text-xs">
              <thead><tr>
                <th>供应商</th><th>品牌</th><th>型号</th><th>库存</th><th>价格</th>
                <th>交期</th><th>DateCode</th><th>评分</th><th>状态</th><th>更新时间</th><th>来源</th>
              </tr></thead>
              <tbody>
                {supplyResources.slice(0, 5).map((sr) => (
                  <tr key={sr.id} className={`cursor-pointer transition-colors ${selectedSupply?.id === sr.id ? 'bg-brand-50' : 'hover:bg-gray-50'}`}
                    onClick={() => { setSelectedSupply(sr); setSelectedInquiry(null); }}>
                    <td className="font-medium whitespace-nowrap">{sr.supplier}</td>
                    <td className="text-gray-500">{sr.brand}</td><td className="font-mono">{sr.mpn}</td>
                    <td>{sr.stock.toLocaleString()}</td><td className="font-medium">{sr.price}</td>
                    <td>{sr.leadTime}</td><td className="text-gray-500">{sr.dateCode}</td>
                    <td><span className="text-brand-600 font-medium">{sr.score}%</span></td>
                    <td><span className={`tag ${sColor(sr.status)}`}>{sr.status}</span></td>
                    <td className="text-gray-400 text-xs whitespace-nowrap">{sr.updatedAt}</td>
                    <td className="text-gray-400 text-xs">{sr.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 可匹配需求 */}
        <div className="proto-card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">可匹配需求</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">{matchableInquiries.length} 条询价</span>
              <a href="/inquiries" className="px-2.5 py-1 text-xs rounded-md text-gray-400 hover:text-brand-600 hover:bg-gray-50 transition-colors font-medium">查看更多 →</a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="proto-table text-xs">
              <thead><tr>
                <th>Sales</th><th>客户编码</th><th>品牌</th><th>型号</th><th>数量</th>
                <th>目标价</th><th>优先级</th><th>匹配资源</th><th>更新时间</th><th>操作</th>
              </tr></thead>
              <tbody>
                {matchableInquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id} className={`cursor-pointer transition-colors ${selectedInquiry?.id === inq.id ? 'bg-brand-50' : 'hover:bg-gray-50'}`}
                    onClick={() => { setSelectedInquiry(inq); setSelectedSupply(null); }}>
                    <td className="font-medium whitespace-nowrap">{inq.salesName}<br/><span className="text-xs text-gray-400">{inq.salesNameEn}</span></td>
                    <td className="font-mono text-xs text-gray-500">{inq.customerCode}</td>
                    <td className="text-gray-500">{inq.brand}</td><td className="font-mono">{inq.mpn}</td>
                    <td>{inq.qty.toLocaleString()}</td><td className="font-medium">{inq.targetPrice}</td>
                    <td><span className={`tag ${pColor(inq.priority)}`}>{inq.priority}</span></td>
                    <td>{inq.matched > 0 ? <span className="tag tag-green">{inq.matched} 个</span> : <span className="tag tag-yellow">待匹配</span>}</td>
                    <td className="text-gray-400 text-xs whitespace-nowrap">{inq.updatedAt}</td>
                    <td><button className="btn-primary !py-1 !px-3 !text-xs">{inq.action}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
