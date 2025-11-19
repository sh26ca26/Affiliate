import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMerchants() {
    return {
      data: [
        { id: 1, name: 'Merchant 1', email: 'merchant1@example.com', status: 'active' },
        { id: 2, name: 'Merchant 2', email: 'merchant2@example.com', status: 'active' },
      ],
    };
  }

  getAffiliates() {
    return {
      data: [
        { id: 1, name: 'Affiliate 1', email: 'affiliate1@example.com', earnings: 1500 },
        { id: 2, name: 'Affiliate 2', email: 'affiliate2@example.com', earnings: 2300 },
      ],
    };
  }

  login(email: string, _password: string) {
    return {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      user: { id: 1, email, name: 'User' },
    };
  }

  register(email: string, _password: string, name: string) {
    return {
      message: 'User registered successfully',
      user: { id: 1, email, name },
    };
  }

  getLinks() {
    return {
      data: [
        { id: 1, title: 'Link 1', url: 'https://example.com/link1', clicks: 150, conversions: 12 },
        { id: 2, title: 'Link 2', url: 'https://example.com/link2', clicks: 200, conversions: 18 },
      ],
    };
  }

  getConversions() {
    return {
      data: [
        { id: 1, orderId: 'ORD-001', amount: 100, status: 'approved', date: '2024-11-10' },
        { id: 2, orderId: 'ORD-002', amount: 150, status: 'pending', date: '2024-11-09' },
      ],
    };
  }

  getCommissions() {
    return {
      data: [
        { id: 1, affiliateId: 1, amount: 150, status: 'pending' },
        { id: 2, affiliateId: 2, amount: 200, status: 'paid' },
      ],
    };
  }

  getPayouts() {
    return {
      data: [
        { id: 1, affiliateId: 1, amount: 500, status: 'completed', date: '2024-11-05' },
        { id: 2, affiliateId: 2, amount: 750, status: 'pending', date: '2024-11-10' },
      ],
    };
  }
}
