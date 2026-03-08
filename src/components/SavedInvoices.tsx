import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Cloud, RefreshCw, FileSpreadsheet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedInvoice {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  invoice_numbers: string[] | null;
  created_at: string;
}

export function SavedInvoices() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("generated_invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setInvoices(data as SavedInvoice[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data } = supabase.storage.from("invoices").getPublicUrl(filePath);
    if (data?.publicUrl) {
      const a = document.createElement("a");
      a.href = data.publicUrl;
      a.download = fileName;
      a.target = "_blank";
      a.click();
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Cloud className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Cloud Invoices</span>
        </div>
        <button className="mini-btn" onClick={fetchInvoices}>
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading && invoices.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-4">Loading...</div>
      ) : invoices.length === 0 ? (
        <div className="text-xs text-muted-foreground text-center py-4">
          No invoices generated yet. Generate your first XLSX to see it here.
        </div>
      ) : (
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-1">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-2 rounded border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileSpreadsheet className="h-4 w-4 text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{inv.file_name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatDate(inv.created_at)} · {formatSize(inv.file_size)}
                      {inv.invoice_numbers?.length ? ` · #${inv.invoice_numbers.join(", #")}` : ""}
                    </div>
                  </div>
                </div>
                <button
                  className="mini-btn shrink-0"
                  onClick={() => handleDownload(inv.file_path, inv.file_name)}
                >
                  <Download className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
