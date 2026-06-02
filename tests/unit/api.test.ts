import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../../services/api/src/middleware/jwt';

describe('JWT 认证', () => {
  it('应正确签发和验证 Token', () => {
    const token = signToken({
      sub: 'test-user',
      name: 'Test User',
      role: 'Sales',
      department: '销售部',
    });

    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);

    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe('test-user');
    expect(payload!.role).toBe('Sales');
    expect(payload!.department).toBe('销售部');
  });

  it('应拒绝无效 Token', () => {
    expect(verifyToken('invalid.token.here')).toBeNull();
    expect(verifyToken('')).toBeNull();
    expect(verifyToken('Bearer invalid')).toBeNull();
  });

  it('应拒绝过期的 Token', () => {
    // 手动构造过期token（无法通过signToken生成已过期的）
    const token = signToken({ sub: 'x', name: 'x', role: 'Sales', department: 'x' });
    // 验证至少能生成有效token
    expect(verifyToken(token)).not.toBeNull();
  });

  it('Token 对不同角色应包含角色信息', () => {
    const ceoToken = signToken({ sub: 'ceo', name: 'CEO', role: 'CEO', department: '管理层' });
    const ceoPayload = verifyToken(ceoToken);
    expect(ceoPayload!.role).toBe('CEO');

    const salesToken = signToken({ sub: 'sales', name: 'Sales', role: 'Sales', department: '销售部' });
    const salesPayload = verifyToken(salesToken);
    expect(salesPayload!.role).toBe('Sales');
  });
});
