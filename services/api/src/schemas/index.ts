import { z } from 'zod';

// ============================================================================
// Customer
// ============================================================================
export const createCustomerSchema = z.object({
  customerName: z.string().min(1, '客户名称不能为空').max(200),
  customerCode: z.string().max(50).optional(),
  customerId: z.string().max(50).optional(),
  country: z.string().default('CN'),
  city: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  customerType: z.enum(['EndUser', 'Distributor', 'OEM', 'ODM', 'Broker', 'Other']).default('EndUser'),
  industry: z.string().optional(),
  customerLevel: z.enum(['S', 'A', 'B', 'C', 'D']).default('C'),
  creditLevel: z.enum(['AAA', 'AA', 'A', 'B', 'C', 'D', 'N/A']).default('N/A'),
  creditLimit: z.number().min(0).optional(),
  paymentTerm: z.string().default('T/T'),
  paymentMethod: z.enum(['T/T', 'L/C', 'Net30', 'Net60', 'Cash', 'Other']).default('T/T'),
  currency: z.string().default('USD'),
  source: z.string().optional(),
  sourceType: z.string().optional(),
  sourceOwner: z.string().optional(),
  accountOwner: z.string().optional(),
  accountOwnerId: z.string().optional(),
  leadSource: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// ============================================================================
// Supplier
// ============================================================================
export const createSupplierSchema = z.object({
  supplierName: z.string().min(1, '供应商名称不能为空').max(200),
  supplierCode: z.string().max(50).optional(),
  supplierId: z.string().max(50).optional(),
  country: z.string().default('CN'),
  website: z.string().optional(),
  supplierType: z.enum(['Manufacturer', 'AuthorizedDistributor', 'IndependentDistributor', 'Broker', 'Other']).default('IndependentDistributor'),
  authorizationStatus: z.enum(['Authorized', 'Unauthorized', 'Unknown']).default('Unknown'),
  paymentMethod: z.enum(['T/T', 'L/C', 'Net30', 'Net60', 'Cash', 'Other']).default('T/T'),
  paymentTerm: z.string().optional(),
  source: z.string().optional(),
  sourceType: z.string().optional(),
});

// ============================================================================
// Product
// ============================================================================
export const createProductSchema = z.object({
  brand: z.string().min(1, '品牌不能为空'),
  mpn: z.string().min(1, '型号不能为空'),
  productId: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  packageType: z.enum(['QFN', 'BGA', 'LQFP', 'TSSOP', 'SOP', 'SOT', 'QFP', 'Other']).default('Other'),
  lifecycle: z.enum(['Active', 'NRND', 'EOL', 'Obsolete', 'Unknown']).default('Active'),
  isDomestic: z.boolean().default(false),
  source: z.string().optional(),
  sourceType: z.string().optional(),
});

// ============================================================================
// Inquiry
// ============================================================================
export const createInquirySchema = z.object({
  customerId: z.string().min(1, '客户ID不能为空'),
  mpn: z.string().min(1, '型号不能为空'),
  brand: z.string().optional(),
  quantity: z.number().int().min(1, '数量至少为1').default(1),
  targetPrice: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  requiredDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  rawContent: z.string().optional(),
  source: z.string().optional(),
  sourceType: z.string().optional(),
  salesOwnerId: z.string().optional(),
  inquiryId: z.string().optional(),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(['New', 'Parsing', 'Structured', 'Matched', 'Quoting', 'Quoted', 'Negotiating', 'Won', 'Lost', 'Closed']),
});

// ============================================================================
// Supply Resource
// ============================================================================
export const createSupplyResourceSchema = z.object({
  supplierId: z.string().min(1, '供应商ID不能为空'),
  brand: z.string().min(1, '品牌不能为空'),
  mpn: z.string().min(1, '型号不能为空'),
  stockQty: z.number().int().min(0).default(0),
  price: z.number().min(0).default(0),
  leadTimeDays: z.number().int().optional(),
  dateCode: z.string().optional(),
  moq: z.number().int().optional(),
  currency: z.string().default('USD'),
  source: z.string().optional(),
  sourceType: z.string().optional(),
  resourceId: z.string().optional(),
});

// ============================================================================
// Opportunity
// ============================================================================
export const createOpportunitySchema = z.object({
  inquiryId: z.string().min(1, '询价ID不能为空'),
  supplyResourceId: z.string().min(1, '供应资源ID不能为空'),
  customerId: z.string().min(1, '客户ID不能为空'),
  supplierId: z.string().min(1, '供应商ID不能为空'),
  matchScore: z.number().min(0).max(100).default(0),
  suggestedPrice: z.number().optional(),
  source: z.string().optional(),
  sourceType: z.string().optional(),
  opportunityId: z.string().optional(),
});

// ============================================================================
// Offer
// ============================================================================
export const createOfferSchema = z.object({
  inquiryId: z.string().min(1, '询价ID不能为空'),
  customerId: z.string().min(1, '客户ID不能为空'),
  supplierId: z.string().optional(),
  supplyResourceId: z.string().optional(),
  opportunityId: z.string().optional(),
  brand: z.string().min(1, '品牌不能为空'),
  mpn: z.string().min(1, '型号不能为空'),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().min(0, '单价不能为负'),
  currency: z.string().default('USD'),
  costPrice: z.number().min(0).optional(),
  margin: z.number().optional(),
  marginPercent: z.number().optional(),
  offerId: z.string().optional(),
});

// ============================================================================
// AR Item
// ============================================================================
export const createARSchema = z.object({
  customerId: z.string().min(1, '客户ID不能为空'),
  soId: z.string().optional(),
  invoiceNo: z.string().optional(),
  invoiceDate: z.string().optional(),
  dueDate: z.string().min(1, '到期日不能为空'),
  arAmount: z.number().min(0).default(0),
  paidAmount: z.number().min(0).default(0),
  source: z.string().optional(),
  sourceType: z.string().optional(),
  arId: z.string().optional(),
});

// ============================================================================
// Agent
// ============================================================================
export const createAgentSchema = z.object({
  agentName: z.string().min(1, 'Agent名称不能为空'),
  agentType: z.enum(['Sales', 'Procurement', 'Credit', 'Knowledge', 'Risk', 'CEO']),
  department: z.string().min(1),
  ownerId: z.string().min(1),
  level: z.enum(['L1_Rule', 'L2_Knowledge', 'L3_Reasoning', 'L4_Collaborative', 'L5_Autonomous']).default('L2_Knowledge'),
  status: z.enum(['Online', 'Busy', 'WaitingApproval', 'Error', 'Offline']).default('Offline'),
  capabilities: z.array(z.string()).default([]),
  restrictions: z.array(z.string()).default([]),
  agentId: z.string().optional(),
});

export const updateAgentStatusSchema = z.object({
  status: z.enum(['Online', 'Busy', 'WaitingApproval', 'Error', 'Offline']),
});
