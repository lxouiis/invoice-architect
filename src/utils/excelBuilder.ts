import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { InvoiceData } from "@/types/invoice";
import { formatAmount } from "@/utils/validators";
import { supabase } from "@/integrations/supabase/client";

const FONT_NAME = "Times New Roman";
const THIN_BORDER: Partial<ExcelJS.Border> = { style: "thin" };
const ALL_BORDERS: Partial<ExcelJS.Borders> = {
  top: THIN_BORDER,
  bottom: THIN_BORDER,
  left: THIN_BORDER,
  right: THIN_BORDER,
};

function setCell(
  sheet: ExcelJS.Worksheet,
  row: number,
  col: number,
  value: string | number,
  opts?: {
    bold?: boolean;
    size?: number;
    align?: "left" | "center" | "right";
    valign?: "top" | "middle" | "bottom";
    wrap?: boolean;
    borders?: Partial<ExcelJS.Borders>;
    underline?: boolean;
  }
) {
  const cell = sheet.getCell(row, col);
  cell.value = value;
  cell.font = {
    name: FONT_NAME,
    size: opts?.size || 11,
    bold: opts?.bold || false,
    underline: opts?.underline || false,
  };
  cell.alignment = {
    horizontal: opts?.align || "left",
    vertical: opts?.valign || "middle",
    wrapText: opts?.wrap ?? true,
  };
  if (opts?.borders) {
    cell.border = opts.borders;
  }
}

function applyBordersToRange(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top: r === startRow ? THIN_BORDER : cell.border?.top || THIN_BORDER,
        bottom: r === endRow ? THIN_BORDER : cell.border?.bottom || THIN_BORDER,
        left: c === startCol ? THIN_BORDER : cell.border?.left || THIN_BORDER,
        right: c === endCol ? THIN_BORDER : cell.border?.right || THIN_BORDER,
      };
    }
  }
}

function buildInvoiceSheet(workbook: ExcelJS.Workbook, invoice: InvoiceData, sheetName: string) {
  const sheet = workbook.addWorksheet(sheetName);

  // Column widths (8 columns: A-H)
  sheet.columns = [
    { width: 4 },   // A - SL
    { width: 14 },  // B
    { width: 16 },  // C
    { width: 14 },  // D
    { width: 12 },  // E
    { width: 12 },  // F - HSN
    { width: 10 },  // G
    { width: 16 },  // H - Amount
  ];

  let row = 1;

  // Row 1-2: TAX INVOICE title
  sheet.mergeCells(row, 1, row + 1, 8);
  setCell(sheet, row, 1, "TAX INVOICE", { bold: true, size: 14, align: "center" });
  applyBordersToRange(sheet, row, 1, row + 1, 8);
  sheet.getRow(row).height = 20;
  sheet.getRow(row + 1).height = 10;
  row = 3;

  // Rows 3-8: Seller details (left), Invoice No (middle), Date (right)
  sheet.mergeCells(row, 1, row + 5, 4);
  const sellerText = [
    invoice.sellerName,
    `Prop ${invoice.proprietorName}`,
    invoice.contractorClass,
    invoice.sellerAddress,
    `${invoice.sellerCity} - ${invoice.sellerPin}.`,
    `GST No. ${invoice.sellerGst}`,
  ].filter(Boolean).join("\n");
  setCell(sheet, row, 1, sellerText, { bold: true, size: 10, wrap: true, valign: "top" });
  applyBordersToRange(sheet, row, 1, row + 5, 4);

  // Invoice No: E3:F5
  sheet.mergeCells(row, 5, row + 2, 6);
  setCell(sheet, row, 5, `Invoice No. ${invoice.invoiceNumber}`, { bold: true, size: 11, align: "center" });
  applyBordersToRange(sheet, row, 5, row + 2, 6);

  // Date: G3:H5
  sheet.mergeCells(row, 7, row + 2, 8);
  const dateFormatted = invoice.invoiceDate
    ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";
  setCell(sheet, row, 7, `Dated : ${dateFormatted}`, { size: 11, align: "left" });
  applyBordersToRange(sheet, row, 7, row + 2, 8);

  // E6:H8 - empty bordered area
  sheet.mergeCells(row + 3, 5, row + 5, 8);
  applyBordersToRange(sheet, row + 3, 5, row + 5, 8);

  for (let r = row; r <= row + 5; r++) {
    sheet.getRow(r).height = 16;
  }
  row = 9;

  // Row 9-10: PO details
  sheet.mergeCells(row, 1, row + 1, 8);
  setCell(sheet, row, 1, `Po.No: ${invoice.poNumber} Dated ${invoice.poDate ? new Date(invoice.poDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}`, {
    bold: true, size: 10, wrap: true, valign: "top",
  });
  applyBordersToRange(sheet, row, 1, row + 1, 8);
  sheet.getRow(row).height = 16;
  sheet.getRow(row + 1).height = 16;
  row = 11;

  // Row 11-12: Buyer details
  sheet.mergeCells(row, 1, row + 1, 8);
  const buyerText = [
    invoice.buyerName,
    invoice.buyerAddress,
    `GST NO ${invoice.buyerGst}`,
  ].filter(Boolean).join("\n");
  setCell(sheet, row, 1, buyerText, { bold: true, size: 10, wrap: true, valign: "top" });
  applyBordersToRange(sheet, row, 1, row + 1, 8);
  sheet.getRow(row).height = 18;
  sheet.getRow(row + 1).height = 18;
  row = 13;

  // Row 13: Table header
  setCell(sheet, row, 1, "SL\nNO", { bold: true, size: 10, align: "center", wrap: true, borders: ALL_BORDERS });
  sheet.mergeCells(row, 2, row, 5);
  setCell(sheet, row, 2, "DESCRIPTION OF WORK", { bold: true, size: 10, align: "center", borders: ALL_BORDERS });
  applyBordersToRange(sheet, row, 2, row, 5);
  setCell(sheet, row, 6, "HSN Code", { bold: true, size: 10, align: "center", borders: ALL_BORDERS });
  sheet.mergeCells(row, 7, row, 8);
  setCell(sheet, row, 7, "Amount", { bold: true, size: 10, align: "center", borders: ALL_BORDERS });
  applyBordersToRange(sheet, row, 7, row, 8);

  sheet.getRow(row).height = 24;
  row = 14;

  // Work items (rows 14-19, reserve 6 rows for items)
  const itemRows = 6;
  for (let i = 0; i < itemRows; i++) {
    const item = invoice.workItems[i];
    const r = row + i;
    sheet.getRow(r).height = 22;

    setCell(sheet, r, 1, item ? item.slNo : "", { size: 10, align: "center", borders: ALL_BORDERS });
    sheet.mergeCells(r, 2, r, 5);
    setCell(sheet, r, 2, item ? item.description : "", { size: 10, wrap: true, borders: ALL_BORDERS });
    applyBordersToRange(sheet, r, 2, r, 5);
    setCell(sheet, r, 6, item ? item.hsnCode : "", { size: 10, align: "center", borders: ALL_BORDERS });
    sheet.mergeCells(r, 7, r, 8);
    setCell(sheet, r, 7, item && item.amount ? `₹ ${item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "", {
      size: 10, align: "right", borders: ALL_BORDERS,
    });
    applyBordersToRange(sheet, r, 7, r, 8);
  }
  row = 14 + itemRows; // row 20

  // CGST row
  sheet.mergeCells(row, 1, row, 6);
  setCell(sheet, row, 1, "", { borders: ALL_BORDERS });
  applyBordersToRange(sheet, row, 1, row, 6);
  sheet.mergeCells(row, 7, row, 8);
  setCell(sheet, row, 6, `CGST@${invoice.cgstRate}%`, { size: 10, align: "right", underline: true, borders: ALL_BORDERS });
  setCell(sheet, row, 7, `₹ ${invoice.cgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, {
    size: 10, align: "right", borders: ALL_BORDERS,
  });
  applyBordersToRange(sheet, row, 7, row, 8);
  sheet.getRow(row).height = 18;
  row++;

  // SGST row
  sheet.mergeCells(row, 1, row, 6);
  setCell(sheet, row, 1, "", { borders: ALL_BORDERS });
  applyBordersToRange(sheet, row, 1, row, 6);
  setCell(sheet, row, 6, `SGST@${invoice.sgstRate}%`, { size: 10, align: "right", underline: true, borders: ALL_BORDERS });
  sheet.mergeCells(row, 7, row, 8);
  setCell(sheet, row, 7, `₹ ${invoice.sgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, {
    size: 10, align: "right", borders: ALL_BORDERS,
  });
  applyBordersToRange(sheet, row, 7, row, 8);
  sheet.getRow(row).height = 18;
  row++;

  // Total row
  sheet.mergeCells(row, 1, row, 6);
  setCell(sheet, row, 1, "", { borders: ALL_BORDERS });
  applyBordersToRange(sheet, row, 1, row, 6);
  setCell(sheet, row, 6, "Total", { bold: true, size: 10, align: "right", borders: ALL_BORDERS });
  sheet.mergeCells(row, 7, row, 8);
  setCell(sheet, row, 7, `₹ ${invoice.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, {
    bold: true, size: 10, align: "right", borders: ALL_BORDERS,
  });
  applyBordersToRange(sheet, row, 7, row, 8);
  sheet.getRow(row).height = 18;
  row++;

  // Amount in words
  sheet.mergeCells(row, 1, row + 1, 8);
  setCell(sheet, row, 1, `Amount Chargeable (in words) Rs ${invoice.amountInWords}`, {
    bold: true, size: 10, wrap: true, valign: "top",
  });
  applyBordersToRange(sheet, row, 1, row + 1, 8);
  sheet.getRow(row).height = 16;
  sheet.getRow(row + 1).height = 16;
  row += 2;

  // Company GST + State
  sheet.mergeCells(row, 1, row, 8);
  setCell(sheet, row, 1, `Company's GST No : ${invoice.sellerGst}`, { bold: true, size: 10 });
  applyBordersToRange(sheet, row, 1, row, 8);
  sheet.getRow(row).height = 16;
  row++;

  sheet.mergeCells(row, 1, row, 8);
  setCell(sheet, row, 1, `State: ${invoice.sellerState}`, { bold: true, size: 10 });
  applyBordersToRange(sheet, row, 1, row, 8);
  sheet.getRow(row).height = 16;
  row++;

  // Customer seal + Signature
  sheet.mergeCells(row, 1, row + 2, 4);
  setCell(sheet, row, 1, "Customer's Seal and\nSignature", { size: 10, wrap: true, valign: "top" });
  applyBordersToRange(sheet, row, 1, row + 2, 4);

  sheet.mergeCells(row, 5, row + 2, 8);
  setCell(sheet, row, 5, `${invoice.signatureText}\n${invoice.footerCompanyName}`, {
    size: 10, wrap: true, valign: "bottom", align: "center",
  });
  applyBordersToRange(sheet, row, 5, row + 2, 8);
  for (let r = row; r <= row + 2; r++) sheet.getRow(r).height = 20;
  row += 3;

  // Bank details
  const bankRows = [
    "BANK DETAILS :",
    invoice.bankName,
    invoice.accountName,
    `AC No : ${invoice.accountNumber}`,
    `IFSC Code : ${invoice.ifscCode}`,
    invoice.branch,
  ];
  for (const text of bankRows) {
    sheet.mergeCells(row, 1, row, 8);
    setCell(sheet, row, 1, text, { bold: text === "BANK DETAILS :", size: 10 });
    applyBordersToRange(sheet, row, 1, row, 8);
    sheet.getRow(row).height = 16;
    row++;
  }
}

export async function generateWorkbook(invoices: InvoiceData[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  const invoiceNumbers: string[] = [];
  for (const invoice of invoices) {
    const name = `Invoice ${invoice.invoiceNumber || "Draft"}`;
    invoiceNumbers.push(invoice.invoiceNumber || "Draft");
    buildInvoiceSheet(workbook, invoice, name);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const invoiceLabel = invoiceNumbers.length === 1
    ? `invoice_${invoiceNumbers[0] || "Draft"}`
    : `invoice_${invoiceNumbers.join("_to_")}`;
  const fileName = `${invoiceLabel}.xlsx`;

  // Download locally
  saveAs(blob, fileName);

  // Upload to cloud storage
  try {
    const filePath = `${date}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(filePath, blob, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    // Save metadata to database
    await supabase.from("generated_invoices").insert({
      file_name: fileName,
      file_path: filePath,
      file_size: blob.size,
      invoice_numbers: invoiceNumbers,
    });
  } catch (err) {
    console.error("Cloud save error:", err);
  }
}
