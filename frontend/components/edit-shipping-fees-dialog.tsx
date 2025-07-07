import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { shippingFeeService } from "@/lib/api-service";

export function EditShippingFeesDialog({ open, onOpenChange, canEdit }: { open: boolean; onOpenChange: (open: boolean) => void; canEdit: boolean }) {
  const { toast } = useToast();
  // Update state type to allow string or number for fee fields
  const [fees, setFees] = useState<{ [key: string]: { baseFee: number | string; additionalFee: number | string } }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      shippingFeeService.getAllShippingFees()
        .then((data: Record<string, { baseFee: number; additionalFee: number }>) => setFees(data))
        .catch(() => toast({ title: "Error", description: "Failed to load shipping fees.", variant: "destructive" }))
        .finally(() => setLoading(false));
    }
  }, [open, toast]);

  const handleChange = (category: string, field: "baseFee" | "additionalFee", value: string) => {
    // Allow blank input, remove leading zeros, and prevent negative
    let normalized = value.replace(/^0+(?!$)/, "");
    if (normalized === "") {
      setFees((prev) => ({
        ...prev,
        [category]: { ...prev[category], [field]: "" }
      }));
      return;
    }
    const num = Number(normalized);
    if (num < 0) return;
    setFees((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: normalized }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    // Convert blank fields to 0 before saving
    const feesToSave = Object.fromEntries(
      Object.entries(fees).map(([cat, obj]) => [
        cat,
        {
          baseFee: obj.baseFee === "" ? 0 : Number(obj.baseFee),
          additionalFee: obj.additionalFee === "" ? 0 : Number(obj.additionalFee)
        }
      ])
    );
    try {
      await shippingFeeService.updateShippingFees(feesToSave);
      toast({ title: "Success", description: "Shipping fees updated." });
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Helper to check if any fee field is empty or zero
  const isAnyFeeEmptyOrZero = Object.values(fees).some(
    (obj) =>
      obj.baseFee === "" || obj.additionalFee === "" ||
      Number(obj.baseFee) === 0 || Number(obj.additionalFee) === 0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Shipping Fees</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 pl-32 pb-1 text-xs text-gray-500">
              <span className="w-24">Base Fee</span>
              <span className="w-28">Additional Fee</span>
            </div>
            {Object.entries(fees).map(([category, feeObj]) => (
              <div key={category} className="flex items-center gap-2">
                <span className="w-32 font-medium">{category}</span>
                <Input
                  type="number"
                  min={0}
                  value={feeObj.baseFee}
                  onChange={(e) => handleChange(category, "baseFee", e.target.value)}
                  disabled={!canEdit}
                  placeholder="Base Fee"
                />
                <Input
                  type="number"
                  min={0}
                  value={feeObj.additionalFee}
                  onChange={(e) => handleChange(category, "additionalFee", e.target.value)}
                  disabled={!canEdit}
                  placeholder="Additional Fee"
                />
              </div>
            ))}
            {error && (
              <div className="text-red-600 text-sm mb-2">{error}</div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canEdit || saving || loading || isAnyFeeEmptyOrZero} className="bg-brand-primary hover:bg-brand-primary/90">
            {saving ? <span className="animate-spin mr-2">⏳</span> : null}Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
