import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/SectionCard";
import { FieldGroup } from "@/components/FieldGroup";
import { Building2, FileText, Users, ListChecks, Calculator, Type, Landmark, PenTool, Plus, Trash2, Wand2, CalendarDays, RotateCcw, Copy } from "lucide-react";
import type { InvoiceData, WorkItem } from "@/types/invoice";
import { defaultSellerDetails, defaultBankDetails, defaultFooter } from "@/types/invoice";
import { calculateTaxes } from "@/utils/taxCalculator";
import { numberToWords } from "@/utils/numberToWords";

interface InvoiceFormProps {
  invoice: InvoiceData;
  onChange: (invoice: InvoiceData) => void;
}

export function InvoiceForm({ invoice, onChange }: InvoiceFormProps) {
  const update = useCallback(
    (fields: Partial<InvoiceData>) => {
      onChange({ ...invoice, ...fields });
    },
    [invoice, onChange]
  );

  const updateWorkItem = (index: number, fields: Partial<WorkItem>) => {
    const items = [...invoice.workItems];
    items[index] = { ...items[index], ...fields };
    update({ workItems: items });
  };

  const addRow = () => {
    update({
      workItems: [
        ...invoice.workItems,
        { slNo: invoice.workItems.length + 1, description: "", hsnCode: "", amount: 0 },
      ],
    });
  };

  const deleteRow = (index: number) => {
    if (invoice.workItems.length <= 1) return;
    const items = invoice.workItems.filter((_, i) => i !== index).map((item, i) => ({ ...item, slNo: i + 1 }));
    update({ workItems: items });
  };

  const autoCalc = () => {
    const taxes = calculateTaxes(invoice);
    const total = taxes.totalAmount || 0;
    update({
      ...taxes,
      amountInWords: numberToWords(total),
    });
  };

  const today = () => update({ invoiceDate: new Date().toISOString().split("T")[0] });

  return (
    <div className="space-y-2">
      {/* Section 1: Seller */}
      <SectionCard
        title="Seller Details"
        icon={<Building2 className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn" onClick={() => update(defaultSellerDetails)}>
            Use Default
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FieldGroup label="Seller Name">
            <Input className="compact-input" value={invoice.sellerName} onChange={(e) => update({ sellerName: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Proprietor Name">
            <Input className="compact-input" value={invoice.proprietorName} onChange={(e) => update({ proprietorName: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Contractor Class">
            <Input className="compact-input" value={invoice.contractorClass} onChange={(e) => update({ contractorClass: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="GST Number">
            <Input className="compact-input font-mono" value={invoice.sellerGst} onChange={(e) => update({ sellerGst: e.target.value.toUpperCase() })} />
          </FieldGroup>
        </div>
        <FieldGroup label="Address">
          <Input className="compact-input" value={invoice.sellerAddress} onChange={(e) => update({ sellerAddress: e.target.value })} />
        </FieldGroup>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <FieldGroup label="City">
            <Input className="compact-input" value={invoice.sellerCity} onChange={(e) => update({ sellerCity: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="State">
            <Input className="compact-input" value={invoice.sellerState} onChange={(e) => update({ sellerState: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="PIN">
            <Input className="compact-input" value={invoice.sellerPin} onChange={(e) => update({ sellerPin: e.target.value })} />
          </FieldGroup>
        </div>
      </SectionCard>

      {/* Section 2: Invoice Details */}
      <SectionCard
        title="Invoice Details"
        icon={<FileText className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn" onClick={today}>
            <CalendarDays className="h-3 w-3" /> Today
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FieldGroup label="Invoice Number">
            <Input className="compact-input font-mono" value={invoice.invoiceNumber} onChange={(e) => update({ invoiceNumber: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Invoice Date">
            <Input className="compact-input" type="date" value={invoice.invoiceDate} onChange={(e) => update({ invoiceDate: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="PO Number">
            <Input className="compact-input font-mono" value={invoice.poNumber} onChange={(e) => update({ poNumber: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="PO Date">
            <Input className="compact-input" type="date" value={invoice.poDate} onChange={(e) => update({ poDate: e.target.value })} />
          </FieldGroup>
        </div>
      </SectionCard>

      {/* Section 3: Buyer */}
      <SectionCard title="Buyer Details" icon={<Users className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn text-destructive" onClick={() => update({ buyerName: "", buyerAddress: "", buyerGst: "" })}>
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        }
      >
        <FieldGroup label="Buyer Name">
          <Input className="compact-input" value={invoice.buyerName} onChange={(e) => update({ buyerName: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Buyer Address">
          <Textarea className="text-sm min-h-[48px] px-2 py-1" value={invoice.buyerAddress} onChange={(e) => update({ buyerAddress: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Buyer GST">
          <Input className="compact-input font-mono" value={invoice.buyerGst} onChange={(e) => update({ buyerGst: e.target.value.toUpperCase() })} />
        </FieldGroup>
      </SectionCard>

      {/* Section 4: Work Items */}
      <SectionCard
        title="Work Description"
        icon={<ListChecks className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn" onClick={addRow}>
            <Plus className="h-3 w-3" /> Add Row
          </button>
        }
      >
        {invoice.workItems.map((item, i) => (
          <div key={i} className="flex gap-2 items-start p-2 rounded bg-muted/30 border border-border">
            <span className="text-xs font-mono text-muted-foreground mt-2 w-5 text-center">{item.slNo}</span>
            <div className="flex-1 space-y-1">
              <Textarea
                className="text-sm min-h-[36px] px-2 py-1"
                placeholder="Description of work..."
                spellCheck={true}
                value={item.description}
                onChange={(e) => updateWorkItem(i, { description: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  className="compact-input font-mono"
                  placeholder="HSN Code"
                  value={item.hsnCode}
                  onChange={(e) => updateWorkItem(i, { hsnCode: e.target.value })}
                />
                <Input
                  className="compact-input font-mono"
                  placeholder="Amount"
                  type="number"
                  value={item.amount || ""}
                  onChange={(e) => updateWorkItem(i, { amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <button className="mini-btn mt-2" onClick={() => deleteRow(i)}>
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </SectionCard>

      {/* Section 5: Tax */}
      <SectionCard
        title="Tax Calculation"
        icon={<Calculator className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn-primary" onClick={autoCalc}>
            <Wand2 className="h-3 w-3" /> Auto Calculate
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <FieldGroup label="CGST %">
            <Input className="compact-input" type="number" value={invoice.cgstRate} onChange={(e) => update({ cgstRate: parseFloat(e.target.value) || 0 })} />
          </FieldGroup>
          <FieldGroup label="SGST %">
            <Input className="compact-input" type="number" value={invoice.sgstRate} onChange={(e) => update({ sgstRate: parseFloat(e.target.value) || 0 })} />
          </FieldGroup>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono bg-muted/30 p-2 rounded">
          <div>
            <span className="compact-label">Subtotal</span>
            <div className="font-semibold">₹ {invoice.subtotal.toLocaleString("en-IN")}</div>
          </div>
          <div>
            <span className="compact-label">CGST</span>
            <div>₹ {invoice.cgstAmount.toLocaleString("en-IN")}</div>
          </div>
          <div>
            <span className="compact-label">SGST</span>
            <div>₹ {invoice.sgstAmount.toLocaleString("en-IN")}</div>
          </div>
          <div>
            <span className="compact-label">Total</span>
            <div className="font-bold text-primary">₹ {invoice.totalAmount.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </SectionCard>

      {/* Section 6: Amount in Words */}
      <SectionCard title="Amount in Words" icon={<Type className="h-3.5 w-3.5 text-primary" />}>
        <FieldGroup label="Amount in Words">
          <Input className="compact-input" value={invoice.amountInWords} onChange={(e) => update({ amountInWords: e.target.value })} />
        </FieldGroup>
      </SectionCard>

      {/* Section 7: Bank */}
      <SectionCard
        title="Bank Details"
        icon={<Landmark className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn" onClick={() => update(defaultBankDetails)}>
            Use Default
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <FieldGroup label="Bank Name">
            <Input className="compact-input" value={invoice.bankName} onChange={(e) => update({ bankName: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Account Name">
            <Input className="compact-input" value={invoice.accountName} onChange={(e) => update({ accountName: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="Account Number">
            <Input className="compact-input font-mono" value={invoice.accountNumber} onChange={(e) => update({ accountNumber: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="IFSC Code">
            <Input className="compact-input font-mono" value={invoice.ifscCode} onChange={(e) => update({ ifscCode: e.target.value.toUpperCase() })} />
          </FieldGroup>
        </div>
        <FieldGroup label="Branch">
          <Input className="compact-input" value={invoice.branch} onChange={(e) => update({ branch: e.target.value })} />
        </FieldGroup>
      </SectionCard>

      {/* Section 8: Footer */}
      <SectionCard
        title="Footer & Signature"
        icon={<PenTool className="h-3.5 w-3.5 text-primary" />}
        actions={
          <button className="mini-btn" onClick={() => update(defaultFooter)}>
            Use Default
          </button>
        }
      >
        <FieldGroup label="Footer Company Name">
          <Input className="compact-input" value={invoice.footerCompanyName} onChange={(e) => update({ footerCompanyName: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Signature Text">
          <Input className="compact-input" value={invoice.signatureText} onChange={(e) => update({ signatureText: e.target.value })} />
        </FieldGroup>
      </SectionCard>
    </div>
  );
}
