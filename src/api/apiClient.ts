import type { Supplier } from '../types';
import { MockSupplierService } from '../services/MockSupplierService';

export const api = {
  getSuppliers: (userId: string): Promise<Supplier[]> => 
    MockSupplierService.getAll(userId),
  
  getSupplierById: (id: string, userId: string): Promise<Supplier> => 
    MockSupplierService.getById(id, userId),
  
  createSupplier: (data: Partial<Supplier>, userId: string): Promise<Supplier> => 
    MockSupplierService.create(data, userId),
    
  submitSupplier: (id: string, userId: string): Promise<Supplier> => 
    MockSupplierService.submit(id, userId),
    
  approveSupplier: (id: string, userId: string): Promise<Supplier> => 
    MockSupplierService.approve(id, userId),
    
  rejectSupplier: (id: string, userId: string, reason: string): Promise<Supplier> => 
    MockSupplierService.reject(id, userId, reason),
};
