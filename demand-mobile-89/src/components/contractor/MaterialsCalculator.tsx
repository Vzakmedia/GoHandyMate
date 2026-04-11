
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calculator, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContractorSync } from "@/hooks/useContractorSync";

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  category: string;
}

export const MaterialsCalculator = () => {
  const { toast } = useToast();
  const { saveMaterialsEstimate, loading } = useContractorSync();
  
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [projectName, setProjectName] = useState("");
  const [newMaterial, setNewMaterial] = useState<Partial<MaterialItem>>({
    name: "",
    quantity: 0,
    unit: "sq ft",
    unitPrice: 0,
    supplier: "",
    category: ""
  });

  const categories = [
    "Lumber", "Hardware", "Electrical", "Plumbing", "Flooring",
    "Paint & Finishes", "Insulation", "Roofing", "Windows & Doors", "Other"
  ];

  const units = ["sq ft", "linear ft", "cubic ft", "pieces", "gallons", "pounds", "yards", "each"];

  const addMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity || newMaterial.quantity <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in material name and valid quantity",
        variant: "destructive",
      });
      return;
    }

    const material: MaterialItem = {
      id: Date.now().toString(),
      name: newMaterial.name!,
      quantity: newMaterial.quantity!,
      unit: newMaterial.unit!,
      unitPrice: newMaterial.unitPrice || 0,
      supplier: newMaterial.supplier || "",
      category: newMaterial.category || "Other"
    };

    setMaterials([...materials, material]);
    setNewMaterial({
      name: "",
      quantity: 0,
      unit: "sq ft",
      unitPrice: 0,
      supplier: "",
      category: ""
    });

    toast({
      title: "Material Added",
      description: `${material.name} has been added to the list`,
    });
  };

  const removeMaterial = (id: string) => {
    const materialToRemove = materials.find(m => m.id === id);
    setMaterials(materials.filter(m => m.id !== id));
    
    if (materialToRemove) {
      toast({
        title: "Material Removed",
        description: `${materialToRemove.name} has been removed`,
      });
    }
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const getTotalCost = () => {
    return materials.reduce((total, material) => 
      total + (material.quantity * material.unitPrice), 0
    );
  };

  const getCategoryTotals = () => {
    const totals: { [key: string]: number } = {};
    materials.forEach(material => {
      const cost = material.quantity * material.unitPrice;
      totals[material.category] = (totals[material.category] || 0) + cost;
    });
    return totals;
  };

  const saveEstimate = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Missing Project Name",
        description: "Please enter a project name before saving",
        variant: "destructive",
      });
      return;
    }

    if (materials.length === 0) {
      toast({
        title: "No Materials",
        description: "Please add at least one material before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      const estimateData = {
        projectName,
        materials,
        totalCost: getTotalCost(),
        categoryTotals: getCategoryTotals(),
        createdAt: new Date().toISOString()
      };

      const result = await saveMaterialsEstimate(estimateData);
      
      if (result?.success) {
        toast({
          title: "Estimate Saved",
          description: "Materials estimate has been saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
    }
  };

  const exportToCSV = () => {
    if (materials.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please add materials before exporting",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Quantity", "Unit", "Unit Price", "Total", "Category", "Supplier"];
    const rows = materials.map(m => [
      m.name,
      m.quantity,
      m.unit,
      m.unitPrice.toFixed(2),
      (m.quantity * m.unitPrice).toFixed(2),
      m.category,
      m.supplier
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `materials-estimate-${projectName || 'untitled'}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Materials estimate has been exported to CSV",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>Materials Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="mt-1 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Add New Material */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="materialName">Material Name</Label>
              <Input
                id="materialName"
                value={newMaterial.name || ""}
                onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                placeholder="2x4 Lumber"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                value={newMaterial.quantity || ""}
                onChange={(e) => setNewMaterial({...newMaterial, quantity: parseFloat(e.target.value) || 0})}
                placeholder="100"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={newMaterial.unit}
                onValueChange={(value) => setNewMaterial({...newMaterial, unit: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price ($)</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={newMaterial.unitPrice || ""}
                onChange={(e) => setNewMaterial({...newMaterial, unitPrice: parseFloat(e.target.value) || 0})}
                placeholder="2.50"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newMaterial.category}
                onValueChange={(value) => setNewMaterial({...newMaterial, category: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addMaterial} className="w-full mt-1">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Materials List */}
          {materials.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Materials List</h3>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-600 border-b pb-2 px-2">
                    <div>Material</div>
                    <div>Qty</div>
                    <div>Unit</div>
                    <div>Unit Price</div>
                    <div>Total</div>
                    <div>Category</div>
                    <div>Supplier</div>
                    <div>Actions</div>
                  </div>
                  
                  {materials.map((material) => (
                    <div key={material.id} className="grid grid-cols-8 gap-4 items-center py-3 border-b px-2 hover:bg-gray-50">
                      <Input
                        value={material.name}
                        onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                        className="text-sm h-8"
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="text-sm h-8"
                      />
                      <span className="text-sm">{material.unit}</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={material.unitPrice}
                        onChange={(e) => updateMaterial(material.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="text-sm h-8"
                      />
                      <span className="text-sm font-medium text-green-600">
                        ${(material.quantity * material.unitPrice).toFixed(2)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {material.category}
                      </Badge>
                      <Input
                        value={material.supplier}
                        onChange={(e) => updateMaterial(material.id, 'supplier', e.target.value)}
                        placeholder="Supplier"
                        className="text-sm h-8"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(material.id)}
                        className="text-red-500 hover:text-red-700 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {materials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(getCategoryTotals()).map(([category, total]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-sm">{category}:</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>Total Materials Cost:</span>
                      <Badge className="text-lg px-3 py-1 bg-green-600">
                        ${getTotalCost().toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={saveEstimate} 
                        disabled={loading}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Estimate
                      </Button>
                      <Button 
                        onClick={exportToCSV} 
                        variant="outline" 
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {materials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No materials added yet. Start by adding your first material above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
