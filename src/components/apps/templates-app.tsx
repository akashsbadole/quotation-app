import React from "react";
import { 
  Button, 
  Input, 
  Card,
  CardBody,
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
import { TemplateType } from "../../types/window";

export const TemplatesApp: React.FC = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useDataContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const [currentTemplate, setCurrentTemplate] = React.useState<TemplateType | null>(null);
  const [templateToDelete, setTemplateToDelete] = React.useState<string | null>(null);
  
  // Form state for new/edit template
  const [formData, setFormData] = React.useState<Omit<TemplateType, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    category: "business",
    content: "<div>Template content goes here</div>",
    thumbnail: `https://img.heroui.chat/image/ai?w=400&h=300&u=${Math.floor(Math.random() * 100)}`
  });
  
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "business", name: "Business" },
    { id: "creative", name: "Creative" },
    { id: "technical", name: "Technical" },
    { id: "industry", name: "Industry" },
    { id: "healthcare", name: "Healthcare" }
  ];
  
  const filteredTemplates = templates.filter(template => 
    (categoryFilter === "all" || template.category === categoryFilter) &&
    (searchQuery === "" || 
     template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleViewTemplate = (template: TemplateType) => {
    setCurrentTemplate(template);
    onViewOpen();
  };
  
  const handleEditTemplate = (template: TemplateType) => {
    setCurrentTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      content: template.content,
      thumbnail: template.thumbnail
    });
    onOpen();
  };
  
  const handleNewTemplate = () => {
    setCurrentTemplate(null);
    setFormData({
      name: "",
      description: "",
      category: "business",
      content: "<div>Template content goes here</div>",
      thumbnail: `https://img.heroui.chat/image/ai?w=400&h=300&u=${Math.floor(Math.random() * 100)}`
    });
    onOpen();
  };
  
  const handleDeleteClick = (id: string) => {
    setTemplateToDelete(id);
    onDeleteOpen();
  };
  
  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
      setTemplateToDelete(null);
      onDeleteClose();
    }
  };
  
  const handleSaveTemplate = () => {
    if (currentTemplate) {
      // Update existing template
      updateTemplate(currentTemplate.id, formData);
    } else {
      // Create new template
      addTemplate(formData);
    }
    
    onClose();
  };
  
  const handleGenerateNewThumbnail = () => {
    setFormData({
      ...formData,
      thumbnail: `https://img.heroui.chat/image/ai?w=400&h=300&u=${Math.floor(Math.random() * 1000)}`
    });
  };
  
  const handleUseTemplate = (template: TemplateType) => {
    // In a real app, this would create a new quotation using this template
    alert(`Creating new quotation using ${template.name} template`);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Quotation Templates</h1>
        <Button color="primary" startContent={<Icon icon="lucide:plus" />} onPress={handleNewTemplate}>
          Create Template
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search templates..."
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Select 
            label="Category" 
            selectedKeys={[categoryFilter]}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-48"
          >
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} isPressable className="overflow-hidden">
            <CardBody className="p-0">
              <Image
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">{template.name}</h3>
                <p className="text-default-500 text-sm">{template.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-default-100 text-default-800 px-2 py-1 rounded-full">
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="light" 
                      isIconOnly
                      onPress={() => handleViewTemplate(template)}
                    >
                      <Icon icon="lucide:eye" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="light" 
                      isIconOnly
                      onPress={() => handleEditTemplate(template)}
                    >
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="light" 
                      isIconOnly
                      onPress={() => handleDeleteClick(template.id)}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                    <Button size="sm" color="primary" onPress={() => handleUseTemplate(template)}>
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Create/Edit Template Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {currentTemplate ? `Edit Template: ${currentTemplate.name}` : "Create New Template"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <Image 
                    src={formData.thumbnail} 
                    alt="Template thumbnail"
                    className="w-full aspect-video rounded-lg object-cover mb-2"
                  />
                  <Button 
                    size="sm" 
                    variant="flat" 
                    startContent={<Icon icon="lucide:refresh-cw" />}
                    onPress={handleGenerateNewThumbnail}
                  >
                    Generate New Thumbnail
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Template Name"
                    placeholder="Enter template name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Enter template description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  
                  <Select 
                    label="Category" 
                    selectedKeys={[formData.category]}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <SelectItem key="business" value="business">Business</SelectItem>
                    <SelectItem key="creative" value="creative">Creative</SelectItem>
                    <SelectItem key="technical" value="technical">Technical</SelectItem>
                    <SelectItem key="industry" value="industry">Industry</SelectItem>
                    <SelectItem key="healthcare" value="healthcare">Healthcare</SelectItem>
                  </Select>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Template Content</label>
                    <Card className="p-4 bg-default-50">
                      <p className="text-default-500 text-sm">
                        In a real application, this would be a rich text editor or template designer.
                      </p>
                      <div className="mt-2 p-4 border border-dashed border-default-300 rounded-md">
                        <p>Template Preview</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveTemplate}>
              {currentTemplate ? "Update Template" : "Create Template"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* View Template Modal */}
      <Modal 
        isOpen={isViewOpen} 
        onClose={onViewClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(currentTemplate) => (
            <>
              <ModalHeader>
                {currentTemplate.name}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Image 
                      src={currentTemplate.thumbnail} 
                      alt={currentTemplate.name}
                      className="w-full rounded-lg object-cover"
                    />
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium">{currentTemplate.name}</h3>
                      <p className="text-default-500">{currentTemplate.description}</p>
                      
                      <div className="mt-4 flex items-center">
                        <span className="text-xs bg-default-100 text-default-800 px-2 py-1 rounded-full">
                          {currentTemplate.category.charAt(0).toUpperCase() + currentTemplate.category.slice(1)}
                        </span>
                        <span className="ml-4 text-xs text-default-500">
                          Created: {new Date(currentTemplate.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4">Template Preview</h3>
                      
                      <div className="border-t border-default-200 pt-4">
                        <div className="flex justify-between mb-6">
                          <div>
                            <h4 className="font-medium">Your Company Name</h4>
                            <p className="text-sm text-default-500">123 Business Street</p>
                            <p className="text-sm text-default-500">Business City, ST 12345</p>
                          </div>
                          <div className="text-right">
                            <h4 className="font-medium">QUOTATION</h4>
                            <p className="text-sm text-default-500">#Q-2023-001</p>
                            <p className="text-sm text-default-500">Date: {new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-medium mb-1">Client:</h4>
                          <p className="text-sm">Client Name</p>
                          <p className="text-sm text-default-500">Client Address</p>
                          <p className="text-sm text-default-500">client@email.com</p>
                        </div>
                        
                        <table className="w-full mb-6">
                          <thead>
                            <tr className="border-b border-default-200">
                              <th className="text-left py-2">Item</th>
                              <th className="text-left py-2">Description</th>
                              <th className="text-right py-2">Qty</th>
                              <th className="text-right py-2">Price</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-default-100">
                              <td className="py-2">Item 1</td>
                              <td className="py-2">Description of item 1</td>
                              <td className="text-right py-2">2</td>
                              <td className="text-right py-2">$100.00</td>
                              <td className="text-right py-2">$200.00</td>
                            </tr>
                            <tr className="border-b border-default-100">
                              <td className="py-2">Item 2</td>
                              <td className="py-2">Description of item 2</td>
                              <td className="text-right py-2">1</td>
                              <td className="text-right py-2">$150.00</td>
                              <td className="text-right py-2">$150.00</td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3}></td>
                              <td className="text-right py-2 font-medium">Subtotal:</td>
                              <td className="text-right py-2">$350.00</td>
                            </tr>
                            <tr>
                              <td colSpan={3}></td>
                              <td className="text-right py-2 font-medium">Tax:</td>
                              <td className="text-right py-2">$35.00</td>
                            </tr>
                            <tr>
                              <td colSpan={3}></td>
                              <td className="text-right py-2 font-medium">Total:</td>
                              <td className="text-right py-2 font-medium">$385.00</td>
                            </tr>
                          </tfoot>
                        </table>
                        
                        <div>
                          <h4 className="font-medium mb-1">Terms & Conditions:</h4>
                          <p className="text-sm text-default-500">Payment due within 30 days of acceptance.</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onViewClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => handleUseTemplate(currentTemplate)}>
                  Use Template
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
            Are you sure you want to delete this template? This action cannot be undone.
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
