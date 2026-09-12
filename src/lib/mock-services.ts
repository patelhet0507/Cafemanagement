// ============================================================
// Mock Services — Simulates WhatsApp, Razorpay, and Printer
// ============================================================

export function mockSendWhatsApp(phone: string, message: string) {
  console.log(`📱 [MOCK WhatsApp] To: ${phone}\n${message}`);
}

export function mockCreatePayment(amount: number, method: string) {
  console.log(`💳 [MOCK Payment] ₹${amount} via ${method}`);
  return { success: true, transaction_id: `txn_${Date.now()}` };
}

export function mockPrintKOT(orderId: string, items: string[]) {
  console.log(`🖨️ [MOCK KOT] Order #${orderId}\n${items.join("\n")}`);
}

export function getOrderConfirmationMessage(tableNumber: number, total: number): string {
  return `Hi! 👋\n\nYour order for Table ${tableNumber} has been received.\nTotal: ₹${total}\n\nPlease pay at the counter before leaving.\nThank you! ☕`;
}
