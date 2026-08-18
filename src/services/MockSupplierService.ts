import type { Supplier } from '../types';

const STORAGE_KEY = 'supplier_app_data';

const initialMockData: Supplier[] = [
  {
    id: '1',
    companyName: 'Sample Ltd.',
    vatId: 'DE123456789',
    country: 'Germany',
    contactEmail: 'contact@sample.com',
    status: 'DRAFT',
    createdBy: 'Anna',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    companyName: 'Alpha AG',
    vatId: 'DE987654321',
    country: 'Germany',
    contactEmail: 'contact@alpha.com',
    status: 'PENDING_APPROVAL',
    createdBy: 'Anna',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    companyName: 'Beta GmbH',
    vatId: 'DE111222333',
    country: 'Germany',
    contactEmail: 'contact@beta.com',
    status: 'APPROVED',
    createdBy: 'Peter',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    approvedBy: 'Max'
  }
];

// Initialize from localStorage, or use defaults
let suppliers: Supplier[] = [];
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    suppliers = JSON.parse(stored);
  } else {
    suppliers = [...initialMockData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
  }
} catch (e) {
  suppliers = [...initialMockData];
}

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockSupplierService {
  
  static async getAll(userId: string): Promise<Supplier[]> {
    await delay(400); 
    return [...suppliers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getById(id: string, userId: string): Promise<Supplier> {
    await delay(300);
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    return { ...supplier };
  }

  static async create(data: Partial<Supplier>, userId: string): Promise<Supplier> {
    await delay(600);
    
    if (!data.companyName || !data.vatId || !data.country || !data.contactEmail) {
      throw new Error('Missing required fields');
    }

    const trimmedVat = data.vatId.trim().toLowerCase();
    const exists = suppliers.some(s => s.vatId.trim().toLowerCase() === trimmedVat);
    if (exists) {
      throw new Error('VAT_ID_ALREADY_EXISTS: The provided VAT ID is already in use.');
    }

    const newSupplier: Supplier = {
      id: Math.random().toString(36).substr(2, 9),
      companyName: data.companyName,
      vatId: data.vatId.trim(),
      country: data.country,
      contactEmail: data.contactEmail,
      status: 'DRAFT',
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    suppliers.push(newSupplier);
    saveToStorage();
    return { ...newSupplier };
  }

  static async submit(id: string, userId: string): Promise<Supplier> {
    await delay(500);
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    
    if (supplier.status !== 'DRAFT') {
      throw new Error('INVALID_STATUS_TRANSITION: Only DRAFT suppliers can be submitted.');
    }

    supplier.status = 'PENDING_APPROVAL';
    saveToStorage();
    return { ...supplier };
  }

  static async approve(id: string, userId: string): Promise<Supplier> {
    await delay(500);
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');

    if (supplier.status !== 'PENDING_APPROVAL') {
      throw new Error('INVALID_STATUS_TRANSITION: Only PENDING_APPROVAL suppliers can be approved.');
    }

    if (supplier.createdBy === userId) {
      throw new Error('SELF_APPROVAL_NOT_ALLOWED: Creator cannot approve their own supplier.');
    }

    supplier.status = 'APPROVED';
    supplier.approvedBy = userId;
    saveToStorage();
    return { ...supplier };
  }

  static async reject(id: string, userId: string, reason: string): Promise<Supplier> {
    await delay(500);
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');

    if (supplier.status !== 'PENDING_APPROVAL') {
      throw new Error('INVALID_STATUS_TRANSITION: Only PENDING_APPROVAL suppliers can be rejected.');
    }

    if (supplier.createdBy === userId) {
      throw new Error('SELF_APPROVAL_NOT_ALLOWED: Creator cannot reject their own supplier.');
    }

    if (!reason || !reason.trim()) {
      throw new Error('REJECTION_REASON_REQUIRED: A rejection reason is mandatory.');
    }

    supplier.status = 'REJECTED';
    supplier.rejectedBy = userId;
    supplier.rejectionReason = reason;
    saveToStorage();
    return { ...supplier };
  }

  static _resetForTests() {
    suppliers = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}
