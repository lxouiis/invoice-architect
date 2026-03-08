import type { InvoiceData } from "@/types/invoice";

export function calculateTaxes(invoice: InvoiceData): Partial<InvoiceData> {
  const subtotal = invoice.workItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const cgstAmount = Math.round((subtotal * invoice.cgstRate) / 100);
  const sgstAmount = Math.round((subtotal * invoice.sgstRate) / 100);
  const totalAmount = subtotal + cgstAmount + sgstAmount;

  return { subtotal, cgstAmount, sgstAmount, totalAmount };
}
