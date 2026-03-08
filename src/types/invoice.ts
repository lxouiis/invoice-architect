export interface WorkItem {
  slNo: number;
  description: string;
  hsnCode: string;
  amount: number;
}

export interface InvoiceData {
  // Seller
  sellerName: string;
  proprietorName: string;
  contractorClass: string;
  sellerAddress: string;
  sellerCity: string;
  sellerState: string;
  sellerPin: string;
  sellerGst: string;

  // Invoice
  invoiceNumber: string;
  invoiceDate: string;
  poNumber: string;
  poDate: string;

  // Buyer
  buyerName: string;
  buyerAddress: string;
  buyerGst: string;

  // Work items
  workItems: WorkItem[];

  // Tax
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  subtotal: number;
  totalAmount: number;

  // Amount in words
  amountInWords: string;

  // Bank
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;

  // Footer
  footerCompanyName: string;
  signatureText: string;
}

export const defaultSellerDetails: Partial<InvoiceData> = {
  sellerName: "M/s. Avinash Constructions",
  proprietorName: "Venugopal Darur",
  contractorClass: "Class -1 PWD Contractor",
  sellerAddress: "No 99, Sunitha Smruthi, Opposite to Play Ground, Shanthinagar",
  sellerCity: "Belagavi",
  sellerState: "Karnataka",
  sellerPin: "590 006",
  sellerGst: "29ABDPV7430P1ZU",
};

export const defaultBankDetails: Partial<InvoiceData> = {
  bankName: "Union Bank of India",
  accountName: "Avinash Constructions",
  accountNumber: "565101000003081",
  ifscCode: "UBIN0900605",
  branch: "Tilakawadi Branch Belagavi",
};

export const defaultFooter: Partial<InvoiceData> = {
  footerCompanyName: "M/s. Avinash Constructions, Prop Venugopal Darur",
  signatureText: "Proprietor",
};

export const createEmptyInvoice = (): InvoiceData => ({
  sellerName: "",
  proprietorName: "",
  contractorClass: "",
  sellerAddress: "",
  sellerCity: "",
  sellerState: "",
  sellerPin: "",
  sellerGst: "",
  invoiceNumber: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  poNumber: "",
  poDate: "",
  buyerName: "",
  buyerAddress: "",
  buyerGst: "",
  workItems: [{ slNo: 1, description: "", hsnCode: "", amount: 0 }],
  cgstRate: 9,
  sgstRate: 9,
  cgstAmount: 0,
  sgstAmount: 0,
  subtotal: 0,
  totalAmount: 0,
  amountInWords: "",
  bankName: "",
  accountName: "",
  accountNumber: "",
  ifscCode: "",
  branch: "",
  footerCompanyName: "",
  signatureText: "",
});
