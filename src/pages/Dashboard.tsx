import React, { useState, useCallback } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { SavedInvoices } from "@/components/SavedInvoices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FilePlus, Copy, Eye, Download, RotateCcw, Trash2, FileSpreadsheet,
} from "lucide-react";
import type { InvoiceData } from "@/types/invoice";
import { createEmptyInvoice, defaultSellerDetails, defaultBankDetails, defaultFooter } from "@/types/invoice";
import { generateWorkbook } from "@/utils/excelBuilder";
import { calculateTaxes } from "@/utils/taxCalculator";
import { numberToWords } from "@/utils/numberToWords";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [invoices, setInvoices] = useState<InvoiceData[]>([
    { ...createEmptyInvoice(), ...defaultSellerDetails, ...defaultBankDetails, ...defaultFooter },
  ]);
  const [activeTab, setActiveTab] = useState("0");

  const activeIndex = parseInt(activeTab);
  const activeInvoice = invoices[activeIndex] || invoices[0];

  const updateInvoice = useCallback(
    (data: InvoiceData) => {
      setInvoices((prev) => prev.map((inv, i) => (i === activeIndex ? data : inv)));
    },
    [activeIndex]
  );

  const addInvoice = () => {
    const newInv = {
      ...createEmptyInvoice(),
      ...defaultSellerDetails,
      ...defaultBankDetails,
      ...defaultFooter,
    };
    setInvoices((prev) => [...prev, newInv]);
    setActiveTab(String(invoices.length));
  };

  const duplicateInvoice = () => {
    const dup = { ...activeInvoice, invoiceNumber: "" };
    setInvoices((prev) => [...prev, dup]);
    setActiveTab(String(invoices.length));
  };

  const deleteInvoice = () => {
    if (invoices.length <= 1) return;
    setInvoices((prev) => prev.filter((_, i) => i !== activeIndex));
    setActiveTab("0");
  };

  const resetInvoice = () => {
    updateInvoice({
      ...createEmptyInvoice(),
      ...defaultSellerDetails,
      ...defaultBankDetails,
      ...defaultFooter,
    });
  };

  const handleGenerate = async () => {
    // Auto-calc all invoices before generating
    const processed = invoices.map((inv) => {
      const taxes = calculateTaxes(inv);
      const total = taxes.totalAmount || 0;
      return { ...inv, ...taxes, amountInWords: inv.amountInWords || numberToWords(total) };
    });
    await generateWorkbook(processed);
  };

  const PreviewPanel = (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <h3 className="text-xs font-semibold text-muted-foreground">Live Preview</h3>
      </div>
      <ScrollArea className="flex-1 p-3">
        <InvoicePreview invoice={activeInvoice} />
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Invoice Generator</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="mini-btn" onClick={addInvoice}>
            <FilePlus className="h-3 w-3" /> New
          </button>
          <button className="mini-btn" onClick={duplicateInvoice}>
            <Copy className="h-3 w-3" /> Duplicate
          </button>
          <button className="mini-btn" onClick={resetInvoice}>
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          {invoices.length > 1 && (
            <button className="mini-btn text-destructive" onClick={deleteInvoice}>
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          )}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="mini-btn">
                  <Eye className="h-3 w-3" /> Preview
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] p-0">
                {PreviewPanel}
              </SheetContent>
            </Sheet>
          )}
          <button className="mini-btn-primary" onClick={handleGenerate}>
            <Download className="h-3 w-3" /> Generate XLSX
          </button>
        </div>
      </header>

      {/* Invoice tabs */}
      {invoices.length > 1 && (
        <div className="border-b border-border bg-muted/20 px-3">
          <div className="flex gap-1 py-1 overflow-x-auto">
            {invoices.map((inv, i) => (
              <button
                key={i}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  activeTab === String(i)
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setActiveTab(String(i))}
              >
                Invoice {inv.invoiceNumber || i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className={`${isMobile ? "w-full" : "w-1/2"} overflow-hidden flex flex-col`}>
          <ScrollArea className="flex-1 p-3">
            <InvoiceForm invoice={activeInvoice} onChange={updateInvoice} />
          </ScrollArea>
        </div>

        {/* Right: Preview (desktop) */}
        {!isMobile && (
          <div className="w-1/2 border-l border-border overflow-hidden flex flex-col">
            {PreviewPanel}
          </div>
        )}
      </div>
    </div>
  );
}
