import { describe, it, expect, beforeEach } from 'vitest';
import { MockSupplierService } from '../services/MockSupplierService';

describe('MockSupplierService Business Rules', () => {
  beforeEach(() => {
    MockSupplierService._resetForTests();
  });

  it('validates required fields and rejects duplicate VAT IDs', async () => {
    // 1. Missing fields
    await expect(MockSupplierService.create({ companyName: 'Test' }, 'Anna'))
      .rejects.toThrow('Missing required fields');

    // 2. Successful creation
    const supplier1 = await MockSupplierService.create({
      companyName: 'Acme',
      vatId: 'VAT123',
      country: 'USA',
      contactEmail: 'test@test.com'
    }, 'Anna');
    
    expect(supplier1.status).toBe('DRAFT');

    // 3. Duplicate VAT ID (case-insensitive with spaces)
    await expect(MockSupplierService.create({
      companyName: 'Acme Duplicate',
      vatId: '  vat123  ',
      country: 'USA',
      contactEmail: 'test2@test.com'
    }, 'Anna')).rejects.toThrow('VAT_ID_ALREADY_EXISTS');
  });

  it('enforces the four-eyes principle for approval', async () => {
    const supplier = await MockSupplierService.create({
      companyName: 'Acme',
      vatId: 'VAT123',
      country: 'USA',
      contactEmail: 'test@test.com'
    }, 'Anna');

    await MockSupplierService.submit(supplier.id, 'Anna');

    // Anna tries to approve her own
    await expect(MockSupplierService.approve(supplier.id, 'Anna'))
      .rejects.toThrow('SELF_APPROVAL_NOT_ALLOWED');

    // Max tries to approve Anna's
    const approved = await MockSupplierService.approve(supplier.id, 'Max');
    expect(approved.status).toBe('APPROVED');
    expect(approved.approvedBy).toBe('Max');
  });

  it('prevents rejection without a reason', async () => {
    const supplier = await MockSupplierService.create({
      companyName: 'Acme',
      vatId: 'VAT123',
      country: 'USA',
      contactEmail: 'test@test.com'
    }, 'Anna');

    await MockSupplierService.submit(supplier.id, 'Anna');

    // Reject with empty reason
    await expect(MockSupplierService.reject(supplier.id, 'Max', '   '))
      .rejects.toThrow('REJECTION_REASON_REQUIRED');

    // Reject with valid reason
    const rejected = await MockSupplierService.reject(supplier.id, 'Max', 'Incomplete data');
    expect(rejected.status).toBe('REJECTED');
    expect(rejected.rejectionReason).toBe('Incomplete data');
  });
});
