/**
 * ANOS Database Schema — Drizzle ORM
 * 基于 docs/83-ANOS数据库设计SQL版 V1.0.md
 * P0 阶段使用 SQLite
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================================
// 通用字段宏
// ============================================================================

const sourceFields = {
  source: text('source').notNull().default('Manual'),
  source_type: text('source_type').notNull().default('Manual'),
  source_id: text('source_id'),
  source_url: text('source_url'),
  source_owner: text('source_owner'),
};

const aiFields = {
  ai_generated: integer('ai_generated', { mode: 'boolean' }).notNull().default(false),
  ai_modified: integer('ai_modified', { mode: 'boolean' }).notNull().default(false),
  ai_confidence: integer('ai_confidence').notNull().default(100),
  ai_insight: text('ai_insight'),
  ai_tags: text('ai_tags'),
  human_verified: integer('human_verified', { mode: 'boolean' }).notNull().default(false),
  verified_by: text('verified_by'),
};

const timestampFields = {
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
  event_time: text('event_time').notNull().default(sql`(datetime('now'))`),
  last_activity_at: text('last_activity_at'),
};

const dataHealthFields = {
  data_health_score: integer('data_health_score').notNull().default(100),
  data_health_level: text('data_health_level').notNull().default('Healthy'),
};

// ============================================================================
// L0 主数据层
// ============================================================================

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  customer_id: text('customer_id').notNull().unique(),
  customer_code: text('customer_code').notNull().unique(),
  customer_name: text('customer_name').notNull(),
  customer_short_name: text('customer_short_name'),
  country: text('country').notNull().default('CN'),
  city: text('city'),
  address: text('address'),
  website: text('website'),
  customer_type: text('customer_type').notNull().default('EndUser'),
  industry: text('industry'),
  customer_level: text('customer_level').notNull().default('C'),
  credit_level: text('credit_level').notNull().default('N/A'),
  credit_limit: real('credit_limit'),
  payment_term: text('payment_term').notNull().default('T/T'),
  payment_method: text('payment_method').notNull().default('T/T'),
  currency: text('currency').notNull().default('USD'),
  account_owner: text('account_owner'),
  account_owner_id: text('account_owner_id'),
  lead_source: text('lead_source'),
  first_order_date: text('first_order_date'),
  last_order_date: text('last_order_date'),
  last_contact_at: text('last_contact_at'),
  customer_score: integer('customer_score'),
  win_rate: integer('win_rate'),
  risk_level: text('risk_level').notNull().default('L1_Low'),
  tags: text('tags'),
  growth_potential: text('growth_potential'),
  rfg_count: integer('rfg_count').notNull().default(0),
  order_count: integer('order_count').notNull().default(0),
  total_order_amount: real('total_order_amount').notNull().default(0),
  ar_outstanding: real('ar_outstanding').notNull().default(0),
  status: text('status').notNull().default('Active'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
  ...dataHealthFields,
});

export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  supplier_id: text('supplier_id').notNull().unique(),
  supplier_code: text('supplier_code').notNull().unique(),
  supplier_name: text('supplier_name').notNull(),
  supplier_english_name: text('supplier_english_name'),
  country: text('country').notNull().default('CN'),
  website: text('website'),
  supplier_type: text('supplier_type').notNull().default('IndependentDistributor'),
  authorization_status: text('authorization_status').notNull().default('Unknown'),
  payment_method: text('payment_method').notNull().default('T/T'),
  payment_term: text('payment_term'),
  preferred_brands: text('preferred_brands'),
  preferred_product_lines: text('preferred_product_lines'),
  supplier_score: integer('supplier_score'),
  price_score: integer('price_score'),
  quality_score: integer('quality_score'),
  risk_score: integer('risk_score'),
  delivery_reliability: integer('delivery_reliability'),
  supply_resource_count: integer('supply_resource_count').notNull().default(0),
  successful_orders: integer('successful_orders').notNull().default(0),
  dispute_count: integer('dispute_count').notNull().default(0),
  status: text('status').notNull().default('Active'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
  ...dataHealthFields,
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  product_id: text('product_id').notNull().unique(),
  brand: text('brand').notNull(),
  brand_id: text('brand_id'),
  mpn: text('mpn').notNull(),
  description: text('description'),
  category: text('category'),
  sub_category: text('sub_category'),
  package_type: text('package_type').notNull().default('Other'),
  lifecycle: text('lifecycle').notNull().default('Active'),
  rohs: integer('rohs', { mode: 'boolean' }).notNull().default(true),
  is_domestic: integer('is_domestic', { mode: 'boolean' }).notNull().default(false),
  heat_index: integer('heat_index'),
  shortage_index: integer('shortage_index'),
  localization_index: integer('localization_index'),
  lifecycle_risk: text('lifecycle_risk'),
  status: text('status').notNull().default('Active'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
  ...dataHealthFields,
});

// ============================================================================
// L1 交易数据层
// ============================================================================

export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  inquiry_id: text('inquiry_id').notNull().unique(),
  customer_id: text('customer_id').notNull(),
  contact_id: text('contact_id'),
  sales_owner_id: text('sales_owner_id'),
  brand: text('brand'),
  mpn: text('mpn').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  target_price: real('target_price'),
  currency: text('currency').default('USD'),
  required_date: text('required_date'),
  lead_time_days: integer('lead_time_days'),
  status: text('status').notNull().default('New'),
  priority: text('priority').notNull().default('Medium'),
  win_probability: integer('win_probability'),
  customer_intent: text('customer_intent'),
  ai_suggestion: text('ai_suggestion'),
  related_opportunity_id: text('related_opportunity_id'),
  raw_content: text('raw_content'),
  raw_attachment_url: text('raw_attachment_url'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
  ...dataHealthFields,
});

export const supplyResources = sqliteTable('supply_resources', {
  id: text('id').primaryKey(),
  resource_id: text('resource_id').notNull().unique(),
  supplier_id: text('supplier_id').notNull(),
  procurement_owner_id: text('procurement_owner_id'),
  brand: text('brand').notNull(),
  mpn: text('mpn').notNull(),
  description: text('description'),
  date_code: text('date_code'),
  package_type: text('package_type'),
  rohs: integer('rohs', { mode: 'boolean' }),
  stock_qty: integer('stock_qty').notNull().default(0),
  price: real('price').notNull().default(0),
  currency: text('currency').default('USD'),
  lead_time_days: integer('lead_time_days'),
  moq: integer('moq'),
  spq: integer('spq'),
  resource_score: integer('resource_score'),
  match_score: integer('match_score'),
  risk_score: integer('risk_score'),
  matched_inquiry_ids: text('matched_inquiry_ids'),
  matched_opportunity_id: text('matched_opportunity_id'),
  status: text('status').notNull().default('New'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
  ...dataHealthFields,
});

export const opportunities = sqliteTable('opportunities', {
  id: text('id').primaryKey(),
  opportunity_id: text('opportunity_id').notNull().unique(),
  inquiry_id: text('inquiry_id').notNull(),
  supply_resource_id: text('supply_resource_id').notNull(),
  customer_id: text('customer_id').notNull(),
  supplier_id: text('supplier_id').notNull(),
  match_score: integer('match_score').notNull().default(0),
  match_score_details: text('match_score_details'),
  estimated_margin: real('estimated_margin'),
  suggested_price: real('suggested_price'),
  suggested_lead_time_days: integer('suggested_lead_time_days'),
  status: text('status').notNull().default('New'),
  sales_owner_id: text('sales_owner_id'),
  procurement_owner_id: text('procurement_owner_id'),
  ai_recommendation: text('ai_recommendation'),
  risk_flags: text('risk_flags'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
});

export const offers = sqliteTable('offers', {
  id: text('id').primaryKey(),
  offer_id: text('offer_id').notNull().unique(),
  inquiry_id: text('inquiry_id').notNull(),
  customer_id: text('customer_id').notNull(),
  supplier_id: text('supplier_id'),
  supply_resource_id: text('supply_resource_id'),
  opportunity_id: text('opportunity_id'),
  brand: text('brand').notNull(),
  mpn: text('mpn').notNull(),
  quantity: integer('quantity').notNull(),
  unit_price: real('unit_price').notNull(),
  total_amount: real('total_amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  lead_time_days: integer('lead_time_days'),
  cost_price: real('cost_price'),
  margin: real('margin'),
  margin_percent: real('margin_percent'),
  status: text('status').notNull().default('Draft'),
  sales_owner_id: text('sales_owner_id'),
  valid_until: text('valid_until'),
  ai_suggested_price: real('ai_suggested_price'),
  ai_price_rationale: text('ai_price_rationale'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
});

// ============================================================================
// L2 财务数据层
// ============================================================================

export const arItems = sqliteTable('ar_items', {
  id: text('id').primaryKey(),
  ar_id: text('ar_id').notNull().unique(),
  customer_id: text('customer_id').notNull(),
  so_id: text('so_id'),
  invoice_no: text('invoice_no'),
  invoice_date: text('invoice_date'),
  due_date: text('due_date').notNull(),
  ar_amount: real('ar_amount').notNull().default(0),
  paid_amount: real('paid_amount').notNull().default(0),
  outstanding_amount: real('outstanding_amount').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  overdue_days: integer('overdue_days').notNull().default(0),
  risk_level: text('risk_level').notNull().default('L1_Low'),
  collection_forecast: real('collection_forecast'),
  status: text('status').notNull().default('Open'),
  collection_owner_id: text('collection_owner_id'),
  ai_collection_suggestion: text('ai_collection_suggestion'),
  ai_stop_shipment_recommendation: integer('ai_stop_shipment_recommendation', { mode: 'boolean' }),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  ...sourceFields,
  ...aiFields,
  ...timestampFields,
  ...dataHealthFields,
});

// ============================================================================
// Agent 与审计
// ============================================================================

export const agents = sqliteTable('agents', {
  id: text('id').primaryKey(),
  agent_id: text('agent_id').notNull().unique(),
  agent_name: text('agent_name').notNull(),
  agent_type: text('agent_type').notNull(),
  department: text('department').notNull(),
  owner_id: text('owner_id').notNull(),
  level: text('level').notNull().default('L2_Knowledge'),
  status: text('status').notNull().default('Offline'),
  prompt_version: text('prompt_version'),
  model_version: text('model_version'),
  capabilities: text('capabilities'),
  restrictions: text('restrictions'),
  current_task_count: integer('current_task_count').default(0),
  completed_task_count: integer('completed_task_count').default(0),
  last_active_at: text('last_active_at'),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  audit_id: text('audit_id').notNull().unique(),
  object_type: text('object_type').notNull(),
  object_id: text('object_id').notNull(),
  action: text('action').notNull(),
  actor: text('actor').notNull(),
  actor_role: text('actor_role').notNull(),
  field: text('field'),
  old_value: text('old_value'),
  new_value: text('new_value'),
  source: text('source'),
  evidence_id: text('evidence_id'),
  timestamp: text('timestamp').notNull().default(sql`(datetime('now'))`),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
});
