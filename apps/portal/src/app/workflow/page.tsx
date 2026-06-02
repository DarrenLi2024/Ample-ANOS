'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function WorkflowPage() {
  return (
    <WorkspaceLayout title="Workflow 运营中心">
      <div className="p-6 space-y-6">
        <div className="proto-card overflow-hidden"><table className="proto-table"><thead><tr><th>Workflow</th><th>状态</th><th>运行次数</th><th>失败</th><th>最后运行</th></tr></thead><tbody>
          <tr><td className="font-medium">WF-001 Inquiry Intake</td><td><span className="tag tag-green">运行中</span></td><td>1,247</td><td>3</td><td className="text-gray-400">2分钟前</td></tr>
          <tr><td className="font-medium">WF-002 Supply Intake</td><td><span className="tag tag-green">运行中</span></td><td>892</td><td>5</td><td className="text-gray-400">5分钟前</td></tr>
          <tr><td className="font-medium">WF-003 Opportunity Match</td><td><span className="tag tag-yellow">待重试</span></td><td>456</td><td>12</td><td className="text-gray-400">30分钟前</td></tr>
          <tr><td className="font-medium">WF-004 AR Risk</td><td><span className="tag tag-green">运行中</span></td><td>2,103</td><td>0</td><td className="text-gray-400">刚刚</td></tr>
        </tbody></table></div>
      </div>
    </WorkspaceLayout>
  );
}
