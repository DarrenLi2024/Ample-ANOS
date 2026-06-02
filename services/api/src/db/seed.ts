/**
 * 种子数据 — P0 验收测试基准数据
 * 基于 docs/27-验收标准与测试方案 V1.0.md 第10章
 * 运行: npx tsx src/db/seed.ts
 */
import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
const sqlite = new Database(DB_PATH);

const now = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

// ============================================================================
// 10 个客户
// ============================================================================
const customers = [
  { id: 'C-001', name: '华为技术有限公司', country: 'CN', level: 'S', credit: 'AAA', limit: 5000000 },
  { id: 'C-002', name: '中兴通讯股份有限公司', country: 'CN', level: 'A', credit: 'AA', limit: 3000000 },
  { id: 'C-003', name: '比亚迪股份有限公司', country: 'CN', level: 'A', credit: 'AA', limit: 4000000 },
  { id: 'C-004', name: '杭州海康威视数字技术股份有限公司', country: 'CN', level: 'B', credit: 'A', limit: 1000000 },
  { id: 'C-005', name: '深圳市大疆创新科技有限公司', country: 'CN', level: 'A', credit: 'AA', limit: 2000000 },
  { id: 'C-006', name: 'Flex Ltd.', country: 'SG', level: 'A', credit: 'AA', limit: 3000000 },
  { id: 'C-007', name: 'Jabil Inc.', country: 'US', level: 'A', credit: 'A', limit: 2500000 },
  { id: 'C-008', name: '深圳市汇顶科技股份有限公司', country: 'CN', level: 'B', credit: 'B', limit: 500000 },
  { id: 'C-009', name: '宁德时代新能源科技股份有限公司', country: 'CN', level: 'S', credit: 'AAA', limit: 8000000 },
  { id: 'C-010', name: '小米通讯技术有限公司', country: 'CN', level: 'A', credit: 'AA', limit: 3000000 },
];

// ============================================================================
// 10 个供应商
// ============================================================================
const suppliers = [
  { id: 'S-001', name: 'Arrow Electronics', country: 'US', type: 'AuthorizedDistributor' },
  { id: 'S-002', name: 'Avnet', country: 'US', type: 'AuthorizedDistributor' },
  { id: 'S-003', name: 'Mouser Electronics', country: 'US', type: 'AuthorizedDistributor' },
  { id: 'S-004', name: 'Digi-Key Electronics', country: 'US', type: 'AuthorizedDistributor' },
  { id: 'S-005', name: '深圳市华强电子世界', country: 'CN', type: 'IndependentDistributor' },
  { id: 'S-006', name: '深圳市赛格电子市场', country: 'CN', type: 'IndependentDistributor' },
  { id: 'S-007', name: 'WT Microelectronics', country: 'TW', type: 'AuthorizedDistributor' },
  { id: 'S-008', name: 'Future Electronics', country: 'CA', type: 'AuthorizedDistributor' },
  { id: 'S-009', name: '深圳市唯样科技', country: 'CN', type: 'IndependentDistributor' },
  { id: 'S-010', name: 'Rochester Electronics', country: 'US', type: 'AuthorizedDistributor' },
];

// ============================================================================
// 50 个产品
// ============================================================================
const products = [
  { mpn: 'STM32F407VET6', brand: 'STMicroelectronics', cat: 'MCU' },
  { mpn: 'STM32H743ZIT6', brand: 'STMicroelectronics', cat: 'MCU' },
  { mpn: 'STM32F103C8T6', brand: 'STMicroelectronics', cat: 'MCU' },
  { mpn: 'STM32G031K8T6', brand: 'STMicroelectronics', cat: 'MCU' },
  { mpn: 'STM32L476RGT6', brand: 'STMicroelectronics', cat: 'MCU' },
  { mpn: 'ATmega328P-AU', brand: 'Microchip', cat: 'MCU' },
  { mpn: 'PIC18F45K22-I/PT', brand: 'Microchip', cat: 'MCU' },
  { mpn: 'MSP430F5529IPN', brand: 'TI', cat: 'MCU' },
  { mpn: 'TMS320F28335PGFA', brand: 'TI', cat: 'DSP' },
  { mpn: 'AM3358BZCZ100', brand: 'TI', cat: 'MPU' },
  { mpn: 'EP4CE22F17C8N', brand: 'Intel', cat: 'FPGA' },
  { mpn: 'XC7Z020-1CLG400I', brand: 'AMD', cat: 'SoC' },
  { mpn: 'MT41K256M16TW-107:P', brand: 'Micron', cat: 'DRAM' },
  { mpn: 'IS42S16400J-7TLI', brand: 'ISSI', cat: 'DRAM' },
  { mpn: 'W25Q128JVSIM', brand: 'Winbond', cat: 'Flash' },
  { mpn: 'MT29F4G08ABADAWP', brand: 'Micron', cat: 'NAND' },
  { mpn: 'MAX3232EIPWR', brand: 'TI', cat: 'Interface' },
  { mpn: 'SN65HVD230DR', brand: 'TI', cat: 'CAN' },
  { mpn: 'LAN8720A-CP-TR', brand: 'Microchip', cat: 'Ethernet' },
  { mpn: 'ESP32-WROOM-32E', brand: 'Espressif', cat: 'WiFi/BT' },
  { mpn: 'LMR14030SDDAR', brand: 'TI', cat: 'Power' },
  { mpn: 'TPS54331DR', brand: 'TI', cat: 'Power' },
  { mpn: 'MP1584EN-LF-Z', brand: 'MPS', cat: 'Power' },
  { mpn: 'LTC4367CDD#PBF', brand: 'Analog Devices', cat: 'Power' },
  { mpn: 'AD7606BSTZ', brand: 'Analog Devices', cat: 'ADC' },
  { mpn: 'ADS1256IDBT', brand: 'TI', cat: 'ADC' },
  { mpn: 'DAC8760IPWPR', brand: 'TI', cat: 'DAC' },
  { mpn: 'OPA333AIDBVR', brand: 'TI', cat: 'Amplifier' },
  { mpn: 'LM2904DR', brand: 'TI', cat: 'Amplifier' },
  { mpn: 'TLV1117-33CDCYR', brand: 'TI', cat: 'LDO' },
  { mpn: 'GD32F103C8T6', brand: 'GigaDevice', cat: 'MCU' },
  { mpn: 'AT32F403AVGT7', brand: 'Artery', cat: 'MCU' },
  { mpn: 'HK32F103C8T6', brand: 'HK Microelectronics', cat: 'MCU' },
  { mpn: 'CS32F103C8T6', brand: 'ChipON', cat: 'MCU' },
  { mpn: 'MM32F103C8T6', brand: 'MindMotion', cat: 'MCU' },
  { mpn: 'N32G452VEL7', brand: 'Nations Technologies', cat: 'MCU' },
  { mpn: 'STC8H8K64U', brand: 'STC', cat: 'MCU' },
  { mpn: 'FM25CL64B-GTR', brand: 'Cypress', cat: 'FRAM' },
  { mpn: '24LC256-I/SN', brand: 'Microchip', cat: 'EEPROM' },
  { mpn: 'DS18B20', brand: 'Maxim', cat: 'Sensor' },
  { mpn: 'SHT30-DIS-B', brand: 'Sensirion', cat: 'Sensor' },
  { mpn: 'MPU-6050', brand: 'TDK InvenSense', cat: 'Sensor' },
  { mpn: 'BMP280', brand: 'Bosch', cat: 'Sensor' },
  { mpn: 'AMS1117-3.3', brand: 'AMS', cat: 'LDO' },
  { mpn: 'CP2102-GMR', brand: 'Silicon Labs', cat: 'USB Bridge' },
  { mpn: 'CH340G', brand: 'WCH', cat: 'USB Bridge' },
  { mpn: 'RTL8211F-CG', brand: 'Realtek', cat: 'Ethernet PHY' },
  { mpn: 'DP83848IVVX/NOPB', brand: 'TI', cat: 'Ethernet PHY' },
  { mpn: 'ISO1050DUBR', brand: 'TI', cat: 'Isolation' },
  { mpn: 'ADUM1250ARZ', brand: 'Analog Devices', cat: 'Isolation' },
];

// ============================================================================
// 插入数据
// ============================================================================
const insert = sqlite.prepare('INSERT OR IGNORE INTO customers (id, customer_id, customer_code, customer_name, country, customer_level, credit_level, credit_limit, source, source_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const insertSupplier = sqlite.prepare('INSERT OR IGNORE INTO suppliers (id, supplier_id, supplier_code, supplier_name, country, supplier_type, source, source_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertProduct = sqlite.prepare('INSERT OR IGNORE INTO products (id, product_id, brand, mpn, category, source, source_type) VALUES (?, ?, ?, ?, ?, ?, ?)');

const txn = sqlite.transaction(() => {
  customers.forEach((c, i) => {
    insert.run(uuid(), c.id, `CUST-${String(i + 1).padStart(5, '0')}`, c.name, c.country, c.level, c.credit, c.limit, 'ERP', 'ERP');
  });

  suppliers.forEach((s, i) => {
    insertSupplier.run(uuid(), s.id, `SUPP-${String(i + 1).padStart(5, '0')}`, s.name, s.country, s.type, 'ERP', 'ERP');
  });

  products.forEach((p, i) => {
    insertProduct.run(uuid(), `PRD-${String(i + 1).padStart(5, '0')}`, p.brand, p.mpn, p.cat, 'Manual', 'Manual');
  });
});

txn();

console.log(`✅ Seed data inserted:
  - ${customers.length} customers
  - ${suppliers.length} suppliers
  - ${products.length} products`);

sqlite.close();
