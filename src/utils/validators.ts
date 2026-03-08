export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export function validateGST(gst: string): boolean {
  return GST_REGEX.test(gst.trim().toUpperCase());
}

export function validateIFSC(ifsc: string): boolean {
  return IFSC_REGEX.test(ifsc.trim().toUpperCase());
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "02-digit" as never, year: "numeric" })
    .replace(/\//g, "/");
}
