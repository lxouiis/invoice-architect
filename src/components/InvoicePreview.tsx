import type { InvoiceData } from "@/types/invoice";
import { formatAmount } from "@/utils/validators";

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="invoice-preview text-[10px] leading-tight">
      {/* Title */}
      <div className="preview-cell text-center font-bold text-sm py-2">TAX INVOICE</div>

      {/* Seller + Invoice info */}
      <div className="grid grid-cols-[1fr_auto_auto]">
        <div className="preview-cell text-[9px] font-bold whitespace-pre-line leading-snug">
          {invoice.sellerName && <div>{invoice.sellerName}</div>}
          {invoice.proprietorName && <div>Prop {invoice.proprietorName}</div>}
          {invoice.contractorClass && <div>{invoice.contractorClass},</div>}
          {invoice.sellerAddress && <div>{invoice.sellerAddress},</div>}
          {invoice.sellerCity && <div>{invoice.sellerCity} - {invoice.sellerPin}.</div>}
          {invoice.sellerGst && <div>GST No. {invoice.sellerGst}</div>}
        </div>
        <div className="preview-cell font-bold text-center px-3">
          Invoice No. {invoice.invoiceNumber}
        </div>
        <div className="preview-cell px-3">
          Dated: {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN") : ""}
        </div>
      </div>

      {/* PO */}
      <div className="preview-cell font-bold">
        Po.No: {invoice.poNumber} Dated {invoice.poDate ? new Date(invoice.poDate).toLocaleDateString("en-IN") : ""}
      </div>

      {/* Buyer */}
      <div className="preview-cell font-bold whitespace-pre-line">
        {invoice.buyerName}{"\n"}{invoice.buyerAddress}{"\n"}GST NO {invoice.buyerGst}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[30px_1fr_60px_80px]">
        <div className="preview-cell font-bold text-center">SL NO</div>
        <div className="preview-cell font-bold text-center">DESCRIPTION OF WORK</div>
        <div className="preview-cell font-bold text-center">HSN Code</div>
        <div className="preview-cell font-bold text-center">Amount</div>
      </div>

      {/* Items */}
      {invoice.workItems.map((item, i) => (
        <div key={i} className="grid grid-cols-[30px_1fr_60px_80px]">
          <div className="preview-cell text-center">{item.slNo}</div>
          <div className="preview-cell whitespace-pre-line">{item.description}</div>
          <div className="preview-cell text-center">{item.hsnCode}</div>
          <div className="preview-cell text-right">{item.amount ? `₹ ${item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : ""}</div>
        </div>
      ))}

      {/* Taxes */}
      <div className="grid grid-cols-[1fr_80px]">
        <div className="preview-cell text-right text-[9px] underline">CGST@{invoice.cgstRate}%</div>
        <div className="preview-cell text-right">₹ {invoice.cgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
      </div>
      <div className="grid grid-cols-[1fr_80px]">
        <div className="preview-cell text-right text-[9px] underline">SGST@{invoice.sgstRate}%</div>
        <div className="preview-cell text-right">₹ {invoice.sgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
      </div>
      <div className="grid grid-cols-[1fr_80px]">
        <div className="preview-cell text-right font-bold">Total</div>
        <div className="preview-cell text-right font-bold">₹ {invoice.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
      </div>

      {/* Amount in words */}
      <div className="preview-cell font-bold">
        Amount Chargeable (in words) Rs {invoice.amountInWords}
      </div>

      {/* Company GST */}
      <div className="preview-cell">Company's GST No : {invoice.sellerGst}</div>
      <div className="preview-cell">State: {invoice.sellerState}</div>

      {/* Signature */}
      <div className="grid grid-cols-2">
        <div className="preview-cell min-h-[40px]">Customer's Seal and Signature</div>
        <div className="preview-cell text-center min-h-[40px] flex flex-col justify-end items-center pb-1">
          <div>{invoice.signatureText}</div>
          <div className="font-bold">{invoice.footerCompanyName}</div>
        </div>
      </div>

      {/* Bank */}
      <div className="preview-cell font-bold">BANK DETAILS :</div>
      <div className="preview-cell">{invoice.bankName}</div>
      <div className="preview-cell">{invoice.accountName}</div>
      <div className="preview-cell">AC No : {invoice.accountNumber}</div>
      <div className="preview-cell">IFSC Code : {invoice.ifscCode}</div>
      <div className="preview-cell">{invoice.branch}</div>
    </div>
  );
}
