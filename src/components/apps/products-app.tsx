import React from "react";
import { 
  Button, 
  Input, 
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Badge,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDataContext } from "../../context/data-context";
import { ProductType } from "../../types/window";

export const ProductsApp: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useDataContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const [currentProduct, setCurrentProduct] = React.useState<ProductType | null>(null);
  const [productToDelete, setProductToDelete] = React.useState<string | null>(null);
  
  // Form state for new/edit product
  const [formData, setFormData] = React.useState<Omit<ProductType, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    type: "product",
    price: 0,
    unit: "piece",
    tax: 0,
    stock: null,
    image: `https://img.heroui.chat/image/ai?w=200&h=200&u=${Math.floor(Math.random() * 100)}`
  });
  
  const filteredProducts = products.filter(product => 
    (filter === "all" || product.type === filter) &&
    (searchQuery === "" || 
     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "product": return "primary";
      case "service": return "secondary";
      case "subscription": return "success";
      default: return "default";
    }
  };
  
  const handleViewProduct = (product: ProductType) => {
    setCurrentProduct(product);
    onViewOpen();
  };
  
  const handleEditProduct = (product: ProductType) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      type: product.type,
      price: product.price,
      unit: product.unit,
      tax: product.tax,
      stock: product.stock,
      image: product.image
    });
    onOpen();
  };
  
  const handleNewProduct = () => {
    setCurrentProduct(null);
    setFormData({
      name: "",
      description: "",
      type: "product",
      price: 0,
      unit: "piece",
      tax: 0,
      stock: null,
      image: `https://img.heroui.chat/image/ai?w=200&h=200&u=${Math.floor(Math.random() * 100)}`
    });
    onOpen();
  };
  
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    onDeleteOpen();
  };
  
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
      onDeleteClose();
    }
  };
  
  const handleSaveProduct = () => {
    if (currentProduct) {
      // Update existing product
      updateProduct(currentProduct.id, formData);
    } else {
      // Create new product
      addProduct(formData);
    }
    
    onClose();
  };
  
  const handleTypeChange = (type: string) => {
    const newFormData = { ...formData, type: type as "product" | "service" | "subscription" };
    
    // If changing to service or subscription, set stock to null
    if (type === "service" || type === "subscription") {
      newFormData.stock = null;
      
      // Update unit for subscription
      if (type === "subscription") {
        newFormData.unit = "month";
      }
    } else {
      // For products, initialize stock if it was null
      if (newFormData.stock === null) {
        newFormData.stock = 0;
      }
    }
    
    setFormData(newFormData);
  };
  
  const handleGenerateNewImage = () => {
    setFormData({
      ...formData,
      image: `https://img.heroui.chat/image/ai?w=200&h=200&u=${Math.floor(Math.random() * 1000)}`
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Products & Services</h1>
        <Button color="primary" startContent={<Icon icon="lucide:plus" />} onPress={handleNewProduct}>
          Add Item
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search products and services..."
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Select 
            label="Type" 
            selectedKeys={[filter]}
            onChange={(e) => setFilter(e.target.value)}
            className="w-40"
          >
            <SelectItem key="all" value="all">All Types</SelectItem>
            <SelectItem key="product" value="product">Products</SelectItem>
            <SelectItem key="service" value="service">Services</SelectItem>
            <SelectItem key="subscription" value="subscription">Subscriptions</SelectItem>
          </Select>
        </div>
      </div>
      
      <Card className="flex-1">
        <Table 
          aria-label="Products and services table"
          removeWrapper
          selectionMode="single"
        >
          <TableHeader>
            <TableColumn>ITEM</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>UNIT</TableColumn>
            <TableColumn>STOCK</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No products or services found">
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <div>{product.name}</div>
                      <div className="text-xs text-default-500">{product.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color={getTypeColor(product.type)}>
                    {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>per {product.unit}</TableCell>
                <TableCell>
                  {product.stock !== null ? product.stock : 
                    <span className="text-default-500">N/A</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleViewProduct(product)}>
                      <Icon icon="lucide:eye" className="text-default-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleEditProduct(product)}>
                      <Icon icon="lucide:edit" className="text-default-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleDeleteClick(product.id)}>
                      <Icon icon="lucide:trash" className="text-default-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Create/Edit Product Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {currentProduct ? `Edit ${currentProduct.name}` : "Add New Item"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <Image 
                    src={formData.image} 
                    alt="Product image"
                    className="w-full aspect-square rounded-lg object-cover mb-2"
                  />
                  <Button 
                    size="sm" 
                    variant="flat" 
                    startContent={<Icon icon="lucide:refresh-cw" />}
                    onPress={handleGenerateNewImage}
                  >
                    Generate New Image
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                      label="Type" 
                      selectedKeys={[formData.type]}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      <SelectItem key="product" value="product">Product</SelectItem>
                      <SelectItem key="service" value="service">Service</SelectItem>
                      <SelectItem key="subscription" value="subscription">Subscription</SelectItem>
                    </Select>
                    
                    <Input
                      type="number"
                      label="Price"
                      placeholder="0.00"
                      startContent="$"
                      min="0"
                      step="0.01"
                      value={formData.price.toString()}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select 
                      label="Unit" 
                      selectedKeys={[formData.unit]}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    >
                      {formData.type === "product" && (
                        <>
                          <SelectItem key="piece" value="piece">Piece</SelectItem>
                          <SelectItem key="box" value="box">Box</SelectItem>
                          <SelectItem key="kg" value="kg">Kilogram</SelectItem>
                          <SelectItem key="lb" value="lb">Pound</SelectItem>
                        </>
                      )}
                      {formData.type === "service" && (
                        <>
                          <SelectItem key="hour" value="hour">Hour</SelectItem>
                          <SelectItem key="day" value="day">Day</SelectItem>
                          <SelectItem key="project" value="project">Project</SelectItem>
                        </>
                      )}
                      {formData.type === "subscription" && (
                        <>
                          <SelectItem key="month" value="month">Month</SelectItem>
                          <SelectItem key="year" value="year">Year</SelectItem>
                          <SelectItem key="user" value="user">User</SelectItem>
                        </>
                      )}
                    </Select>
                    
                    <Input
                      type="number"
                      label="Tax Rate (%)"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={formData.tax.toString()}
                      onChange={(e) => setFormData({...formData, tax: Number(e.target.value)})}
                    />
                  </div>
                  
                  {formData.type === "product" && (
                    <Input
                      type="number"
                      label="Stock"
                      placeholder="0"
                      min="0"
                      value={formData.stock !== null ? formData.stock.toString() : ""}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    />
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveProduct}>
              {currentProduct ? "Update Item" : "Add Item"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* View Product Modal */}
      <Modal 
        isOpen={isViewOpen} 
        onClose={onViewClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(currentProduct) => (
            <>
              <ModalHeader>
                {currentProduct.name}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Image 
                      src={currentProduct.image} 
                      alt={currentProduct.name}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Badge color={getTypeColor(currentProduct.type)} className="mb-4">
                      {currentProduct.type.charAt(0).toUpperCase() + currentProduct.type.slice(1)}
                    </Badge>
                    
                    <h3 className="text-lg font-semibold mb-2">{currentProduct.name}</h3>
                    <p className="text-default-500 mb-4">{currentProduct.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-default-500">Price</h4>
                        <p className="text-xl font-semibold">${currentProduct.price.toFixed(2)} <span className="text-sm font-normal text-default-500">per {currentProduct.unit}</span></p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-default-500">Tax Rate</h4>
                        <p>{currentProduct.tax}%</p>
                      </div>
                      
                      {currentProduct.type === "product" && (
                        <div>
                          <h4 className="text-sm font-medium text-default-500">Stock</h4>
                          <p>{currentProduct.stock !== null ? currentProduct.stock : "N/A"}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium text-default-500">Product ID</h4>
                        <p>{currentProduct.id}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-default-500">Created</h4>
                      <p>{new Date(currentProduct.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-default-500">Last Updated</h4>
                      <p>{new Date(currentProduct.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onViewClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => {
                  onViewClose();
                  handleEditProduct(currentProduct);
                }}>
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this item? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleConfirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
