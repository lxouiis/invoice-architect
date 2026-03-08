import React, { useState, useCallback } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { SavedInvoices } from "@/components/SavedInvoices";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FilePlus, Copy, Eye, Download, RotateCcw, Trash2, FileSpreadsheet, Menu, Cloud, FileEdit,
} from "lucide-react";
import type { InvoiceData } from "@/types/invoice";
import { createEmptyInvoice, defaultSellerDetails, defaultBankDetails, defaultFooter } from "@/types/invoice";
import { generateWorkbook } from "@/utils/excelBuilder";
import { calculateTaxes } from "@/utils/taxCalculator";
import { numberToWords } from "@/utils/numberToWords";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [invoices, setInvoices] = useState<InvoiceData[]>([
    { ...createEmptyInvoice(), ...defaultSellerDetails, ...defaultBankDetails, ...defaultFooter },
  ]);
  const [activeTab, setActiveTab] = useState("0");
  const [mobileView, setMobileView] = useState<"form" | "preview" | "cloud">("form");

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
    const processed = invoices.map((inv) => {
      const taxes = calculateTaxes(inv);
      const total = taxes.totalAmount || 0;
      return { ...inv, ...taxes, amountInWords: inv.amountInWords || numberToWords(total) };
    });
    await generateWorkbook(processed);
    toast.success("Invoice generated & saved to cloud!");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Invoice Generator</span>
        </div>

        {/* Desktop actions */}
        {!isMobile && (
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
            <button className="mini-btn-primary" onClick={handleGenerate}>
              <Download className="h-3 w-3" /> Generate XLSX
            </button>
          </div>
        )}

        {/* Mobile: generate + hamburger */}
        {isMobile && (
          <div className="flex items-center gap-1">
            <button className="mini-btn-primary" onClick={handleGenerate}>
              <Download className="h-3 w-3" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="mini-btn">
                  <Menu className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={addInvoice}>
                  <FilePlus className="h-4 w-4 mr-2" /> New Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={duplicateInvoice}>
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetInvoice}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Reset
                </DropdownMenuItem>
                {invoices.length > 1 && (
                  <DropdownMenuItem onClick={deleteInvoice} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>

      {/* Invoice tabs (multi-invoice) */}
      {invoices.length > 1 && (
        <div className="border-b border-border bg-muted/20 px-3">
          <div className="flex gap-1 py-1 overflow-x-auto">
            {invoices.map((inv, i) => (
              <button
                key={i}
                className={`px-2 py-0.5 text-xs rounded transition-colors whitespace-nowrap ${
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

      {/* Mobile tab bar */}
      {isMobile && (
        <div className="flex border-b border-border bg-muted/20">
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              mobileView === "form" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
            onClick={() => setMobileView("form")}
          >
            <FileEdit className="h-3.5 w-3.5" /> Form
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              mobileView === "preview" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
            onClick={() => setMobileView("preview")}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              mobileView === "cloud" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
            onClick={() => setMobileView("cloud")}
          >
            <Cloud className="h-3.5 w-3.5" /> Cloud
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {isMobile ? (
          <div className="w-full overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-3">
              {mobileView === "form" && (
                <InvoiceForm invoice={activeInvoice} onChange={updateInvoice} />
              )}
              {mobileView === "preview" && (
                <InvoicePreview invoice={activeInvoice} />
              )}
              {mobileView === "cloud" && (
                <SavedInvoices />
              )}
            </ScrollArea>
          </div>
        ) : (
          <>
            <div className="w-1/2 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-3">
                <InvoiceForm invoice={activeInvoice} onChange={updateInvoice} />
              </ScrollArea>
            </div>
            <div className="w-1/2 border-l border-border overflow-hidden flex flex-col">
              <div className="px-3 py-2 border-b border-border bg-muted/30">
                <h3 className="text-xs font-semibold text-muted-foreground">Live Preview</h3>
              </div>
              <ScrollArea className="flex-1 p-3">
                <InvoicePreview invoice={activeInvoice} />
                <div className="mt-4 border-t border-border pt-3">
                  <SavedInvoices />
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
}