import { PaymentMethod } from '../types';

interface PaymentData {
  amount: number;
  method: 'card' | 'cash' | 'wallet';
  rideId: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}

class PaymentServiceClass {
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'card_1',
      type: 'card',
      name: 'Visa **** 1234',
      last4: '1234',
      isDefault: true,
    },
    {
      id: 'wallet_1',
      type: 'wallet',
      name: 'GreenWallet',
      isDefault: false,
    },
  ];

  private walletBalance = 15000; // ₦15,000

  async processPayment(data: PaymentData): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      switch (data.method) {
        case 'card':
          return this.processCardPayment(data);
        case 'wallet':
          return this.processWalletPayment(data);
        case 'cash':
          return this.processCashPayment(data);
        default:
          return {
            success: false,
            message: 'Invalid payment method',
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Payment processing failed',
      };
    }
  }

  private async processCardPayment(data: PaymentData): Promise<PaymentResult> {
    // Simulate card processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        message: 'Payment successful',
      };
    } else {
      return {
        success: false,
        message: 'Card payment declined. Please try another card.',
      };
    }
  }

  private async processWalletPayment(data: PaymentData): Promise<PaymentResult> {
    if (this.walletBalance >= data.amount) {
      this.walletBalance -= data.amount;
      return {
        success: true,
        transactionId: `wallet_${Date.now()}`,
        message: 'Payment successful from GreenWallet',
      };
    } else {
      return {
        success: false,
        message: 'Insufficient wallet balance',
      };
    }
  }

  private async processCashPayment(data: PaymentData): Promise<PaymentResult> {
    // Cash payments are always "successful" at booking time
    return {
      success: true,
      transactionId: `cash_${Date.now()}`,
      message: 'Cash payment confirmed. Pay driver upon arrival.',
    };
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.paymentMethods];
  }

  async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMethod: PaymentMethod = {
      ...method,
      id: `${method.type}_${Date.now()}`,
    };
    
    this.paymentMethods.push(newMethod);
    return newMethod;
  }

  async removePaymentMethod(id: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.paymentMethods.findIndex(method => method.id === id);
    if (index !== -1) {
      this.paymentMethods.splice(index, 1);
      return true;
    }
    return false;
  }

  async setDefaultPaymentMethod(id: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove default from all methods
    this.paymentMethods.forEach(method => {
      method.isDefault = false;
    });
    
    // Set new default
    const method = this.paymentMethods.find(method => method.id === id);
    if (method) {
      method.isDefault = true;
      return true;
    }
    return false;
  }

  getWalletBalance(): number {
    return this.walletBalance;
  }

  async topUpWallet(amount: number): Promise<PaymentResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 95% success rate for top-ups
    const success = Math.random() > 0.05;
    
    if (success) {
      this.walletBalance += amount;
      return {
        success: true,
        transactionId: `topup_${Date.now()}`,
        message: `Wallet topped up with ₦${amount.toLocaleString()}`,
      };
    } else {
      return {
        success: false,
        message: 'Top-up failed. Please try again.',
      };
    }
  }
}

export const PaymentService = new PaymentServiceClass();