import { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/packages");
      setPackages(response.data.data);
    } catch (error) {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingPackage) {
        await api.put(`/packages/${editingPackage._id}`, data);
        toast.success("Package updated");
      } else {
        await api.post("/packages", data);
        toast.success("Package created");
      }
      reset();
      setShowForm(false);
      setEditingPackage(null);
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save package");
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    reset(pkg);
    setShowForm(true);
  };

  const handleDelete = async (packageId) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.delete(`/packages/${packageId}`);
      toast.success("Package deleted");
      fetchPackages();
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Package Management</h1>
          <p className="text-muted-foreground">Create and manage validator packages</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPackage(null);
              reset();
            }}>
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Create New Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage ? "Update package details" : "Add a new validator package"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USDT)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { required: "Price is required", min: 0 })}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    {...register("status")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="active"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commissionLv1">Commission Level 1 (%)</Label>
                  <Input
                    id="commissionLv1"
                    type="number"
                    step="0.01"
                    {...register("commissionLv1", {
                      required: "Commission Lv1 is required",
                      min: 0,
                      max: 100,
                    })}
                  />
                  {errors.commissionLv1 && (
                    <p className="text-sm text-destructive">{errors.commissionLv1.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionLv2">Commission Level 2 (%)</Label>
                  <Input
                    id="commissionLv2"
                    type="number"
                    step="0.01"
                    {...register("commissionLv2", {
                      required: "Commission Lv2 is required",
                      min: 0,
                      max: 100,
                    })}
                  />
                  {errors.commissionLv2 && (
                    <p className="text-sm text-destructive">{errors.commissionLv2.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPackage(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingPackage ? "Update Package" : "Create Package"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg._id}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <div className="text-2xl font-bold text-primary">
                {pkg.price} {pkg.currency}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.description && (
                <CardDescription className="text-base">{pkg.description}</CardDescription>
              )}
              <div className="flex gap-2">
                <Badge variant="secondary">F1: {pkg.commissionLv1}%</Badge>
                <Badge variant="secondary">F2: {pkg.commissionLv2}%</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => {
                  handleEdit(pkg);
                  setShowForm(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(pkg._id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

