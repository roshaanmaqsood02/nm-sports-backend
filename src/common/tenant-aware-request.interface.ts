import { Request } from 'express';

export interface TenantAwareRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
    tenantId: string;
    tenant?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}