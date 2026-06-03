# 84-ERP API集成规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** ERP API集成规范 / Connector技术设计  
**上游文档：** [23-ERP同步策略与数据导入规范 V1.0.md](23-ERP同步策略与数据导入规范%20V1.0.md)  
**版本：** V1.0  
**状态：** P0集成基线

---

# 第1章 集成目标

ERP API用于把ERP历史事实同步到ANOS，不用于替代ANOS数据模型。

目标：

- 读取P0业务对象。
- 保留ERP原始ID。
- 映射为ANOS标准对象。
- 支持增量同步。
- 保留同步日志和错误队列。

# 第2章 认证方式

待确认：

- API Key
- OAuth
- Session Token
- IP白名单
- VPN或内网访问

任何密钥不得提交到GitHub。

# 第3章 P0接口清单

| 对象 | 接口用途 |
| --- | --- |
| Customer | 客户资料读取 |
| Supplier | 供应商资料读取 |
| Product | 产品资料读取 |
| Inquiry | 销售询价读取 |
| Offer | 采购报价读取 |
| SO | 销售订单读取 |
| AR | 收款/应收读取 |

# 第4章 请求规范

所有拉取接口应支持：

- 分页
- 按更新时间过滤
- 按ID查询
- 返回总数
- 返回更新时间

示例参数：

```text
page
pageSize
updatedAfter
objectId
```

# 第5章 响应规范

ERP响应需进入Raw Zone，保留原始字段。

标准包装：

```json
{
  "sourceSystem": "ERP",
  "objectName": "Customer",
  "erpRecordId": "...",
  "raw": {},
  "retrievedAt": "2026-06-01T10:00:00+08:00"
}
```

# 第6章 字段映射

映射流程：

```text
ERP Raw Field
↓
ANOS Standard Field
↓
Feishu Field / SQL Column
```

字段规则以 [21-ERP字段映射方案V1.0.md](21-ERP字段映射方案V1.0.md) 为准。

# 第7章 增量同步

优先使用：

```text
updated_at / modified_time
```

如果ERP无可靠更新时间：

- 使用全量拉取 + Hash比对。
- 降低同步频率。
- 对关键对象人工抽检。

# 第8章 删除处理

ERP删除不得直接删除ANOS数据。

处理方式：

```text
status = Inactive
source_deleted_at = ...
```

# 第9章 错误处理

错误类型：

- AUTH_FAILED
- RATE_LIMIT
- FIELD_MISSING
- DATA_TYPE_ERROR
- MAPPING_FAILED
- NETWORK_ERROR

错误必须进入Sync Error Queue。

# 第10章 安全要求

- API密钥使用环境变量或密钥管理。
- 只申请只读权限，除非人类确认写入需求。
- 限制调用IP。
- 记录每次调用日志。
- 不在日志中输出敏感Token。

# 第11章 待确认事项

- ERP API文档地址。
- ERP认证方式。
- P0对象接口是否已存在。
- 是否支持按更新时间查询。
- 是否有测试环境。
- 是否可提供脱敏样例数据。

