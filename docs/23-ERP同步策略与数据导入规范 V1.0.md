# 23-ERP同步策略与数据导入规范 V1.0

**项目名称：** Ample AI Native OS（ANOS）  
**文档定位：** ERP同步策略 / 数据导入规范 / Data Connector设计输入  
**上游文档：** [21-ERP字段映射方案V1.0.md](21-ERP字段映射方案V1.0.md)、[84-ERP API集成规范 V1.0.md](84-ERP%20API集成规范%20V1.0.md)  
**版本：** V1.0  
**状态：** P0开发前基线

---

# 第1章 策略原则

第一阶段不做复杂全量实时同步。

建议路径：

```text
一次性导入
↓
定期增量同步
↓
异常重试
↓
人工校验
↓
逐步API化
```

ERP是历史事实来源，ANOS是未来统一业务模型。

# 第2章 P0同步对象

P0对象：

- Customer
- Supplier
- Product
- Inquiry
- Offer
- SO
- AR

P1对象：

- PO
- Inventory
- Receiving
- Shipment
- AP

# 第3章 同步模式

| 模式 | 适用场景 |
| --- | --- |
| 手工导入 | 初始建表、接口不可用 |
| 批量导入 | ERP导出Excel/CSV |
| 定时Pull | ERP API可读 |
| 事件推送 | 后续ERP支持Webhook时 |

P0默认采用批量导入 + 定时Pull。

# 第4章 数据流向

```text
ERP原始数据
↓
ERP Raw Zone
↓
字段映射
↓
ANOS标准模型
↓
飞书多维表格
↓
Portal / Agent / Workflow
```

不得直接把ERP字段原样暴露给Portal和Agent。

# 第5章 同步频率

建议频率：

| 对象 | 频率 |
| --- | --- |
| Customer / Supplier / Product | 每日 |
| Inquiry / Offer | 每30分钟 |
| SO / AR | 每30分钟 |
| Inventory | 每30分钟或按需 |
| AP / PO | 每日或每4小时 |

最终频率取决于ERP API能力和业务要求。

# 第6章 主键与去重

每条同步记录必须保留：

- ERPObject
- ERPRecordID
- ANOSObject
- ANOSRecordID
- SourceSystem
- LastSyncedAt

去重规则：

- 优先使用ERP主键。
- 无ERP主键时使用业务唯一键。
- Customer、Supplier需人工确认重复合并规则。
- Product以Brand + MPN为主要匹配键。

# 第7章 冲突处理

冲突类型：

| 类型 | 处理方式 |
| --- | --- |
| ERP更新，ANOS未改 | 自动更新 |
| ERP更新，ANOS也改 | 进入冲突队列 |
| ANOS新增，ERP无记录 | 标记为ANOS-Origin |
| ERP删除 | 不物理删除，标记为Inactive |

原则：不自动覆盖人工增强字段。

# 第8章 日志与重试

同步日志字段：

- SyncJobID
- SourceSystem
- ObjectName
- StartTime
- EndTime
- Status
- TotalRecords
- SuccessRecords
- FailedRecords
- ErrorMessage

失败重试：

- 网络失败：自动重试3次。
- 字段映射失败：进入人工处理。
- 权限失败：通知系统管理员。

# 第9章 数据校验

每次导入后必须校验：

- 必填字段完整性。
- 主键唯一性。
- 数据类型正确性。
- 枚举值合法性。
- 来源字段完整性。
- 关联对象是否存在。

校验失败不得进入正式业务视图。

# 第10章 初始导入步骤

1. ERP导出P0对象。
2. 保存原始文件到归档目录。
3. 建立ERP Raw Zone。
4. 执行字段映射。
5. 生成ANOS标准数据。
6. 导入飞书多维表格。
7. 生成导入日志。
8. 抽样人工校验。

# 第11章 待确认事项

- ERP API认证方式。
- ERP字段更新时间字段是否可靠。
- 是否支持分页查询。
- 是否支持按修改时间过滤。
- 是否存在删除标记。
- 客户、供应商、产品的真实唯一键。

