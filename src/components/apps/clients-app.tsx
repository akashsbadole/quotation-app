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
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Textarea
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDataContext } from "../../context/data-context";
import { ClientType } from "../../types/window";

export const ClientsApp: React.FC = () => {
  const { clients, quotations, addClient, updateClient, deleteClient } = useDataContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const [currentClient, setCurrentClient] = React.useState<ClientType | null>(null);
  const [clientToDelete, setClientToDelete] = React.useState<string | null>(null);
  
  // Form state for new/edit client
  const [formData, setFormData] = React.useState<Omit<ClientType, "id" | "createdAt" | "updatedAt">>({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    notes: ""
  });
  
  const filteredClients = clients.filter(client => 
    searchQuery === "" || 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewClient = (client: ClientType) => {
    setCurrentClient(client);
    onViewOpen();
  };
  
  const handleEditClient = (client: ClientType) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      country: client.country,
      notes: client.notes
    });
    onOpen();
  };
  
  const handleNewClient = () => {
    setCurrentClient(null);
    setFormData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      notes: ""
    });
    onOpen();
  };
  
  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    onDeleteOpen();
  };
  
  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setClientToDelete(null);
      onDeleteClose();
    }
  };
  
  const handleSaveClient = () => {
    if (currentClient) {
      // Update existing client
      updateClient(currentClient.id, formData);
    } else {
      // Create new client
      addClient(formData);
    }
    
    onClose();
  };
  
  const getClientQuotations = (clientId: string) => {
    return quotations.filter(q => q.clientId === clientId);
  };
  
  const getRandomAvatarUrl = (clientId: string) => {
    // Extract a number from the client ID to use as a seed
    const seed = clientId.charCodeAt(0) + (clientId.charCodeAt(1) || 0);
    return `https://img.heroui.chat/image/avatar?w=200&h=200&u=${seed}`;
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Button color="primary" startContent={<Icon icon="lucide:plus" />} onPress={handleNewClient}>
          Add Client
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search clients..."
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
      </div>
      
      <Card className="flex-1">
        <Table 
          aria-label="Clients table"
          removeWrapper
          selectionMode="single"
        >
          <TableHeader>
            <TableColumn>CLIENT</TableColumn>
            <TableColumn>CONTACT</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>PHONE</TableColumn>
            <TableColumn>QUOTATIONS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No clients found">
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={getRandomAvatarUrl(client.id)} size="sm" />
                    <span>{client.name}</span>
                  </div>
                </TableCell>
                <TableCell>{client.contact}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{getClientQuotations(client.id).length}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleViewClient(client)}>
                      <Icon icon="lucide:eye" className="text-default-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleEditClient(client)}>
                      <Icon icon="lucide:edit" className="text-default-500" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" onPress={() => handleDeleteClick(client.id)}>
                      <Icon icon="lucide:trash" className="text-default-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Create/Edit Client Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {currentClient ? `Edit Client: ${currentClient.name}` : "Add New Client"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Company Name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Input
                  label="Contact Person"
                  placeholder="Enter contact name"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Input
                  label="Phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Input
                label="Address"
                placeholder="Enter street address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div>
                <Input
                  label="State/Province"
                  placeholder="Enter state/province"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
              </div>
              <div>
                <Input
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Input
                label="Country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>
            
            <div>
              <Textarea
                label="Notes"
                placeholder="Enter any additional notes about this client"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveClient}>
              {currentClient ? "Update Client" : "Add Client"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* View Client Modal */}
      <Modal 
        isOpen={isViewOpen} 
        onClose={onViewClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(currentClient) => (
            <>
              <ModalHeader className="flex items-center gap-4">
                <Avatar src={getRandomAvatarUrl(currentClient.id)} size="lg" />
                <div>
                  <h2 className="text-xl">{currentClient.name}</h2>
                  <p className="text-default-500">{currentClient.contact}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Tabs aria-label="Client details">
                  <Tab key="details" title="Details">
                    <Card className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-default-500">Contact Information</h3>
                          <p className="mt-2">
                            <Icon icon="lucide:mail" className="inline-block mr-2 text-default-400" />
                            {currentClient.email}
                          </p>
                          <p className="mt-1">
                            <Icon icon="lucide:phone" className="inline-block mr-2 text-default-400" />
                            {currentClient.phone}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-default-500">Address</h3>
                          <p className="mt-2">{currentClient.address}</p>
                          <p>{currentClient.city}, {currentClient.state} {currentClient.zipCode}</p>
                          <p>{currentClient.country}</p>
                        </div>
                      </div>
                      
                      {currentClient.notes && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-default-500">Notes</h3>
                          <p className="mt-2">{currentClient.notes}</p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-default-500">Client Since</h3>
                        <p className="mt-2">{new Date(currentClient.createdAt).toLocaleDateString()}</p>
                      </div>
                    </Card>
                  </Tab>
                  
                  <Tab key="quotations" title="Quotations">
                    <Card>
                      <Table removeWrapper aria-label="Client quotations">
                        <TableHeader>
                          <TableColumn>QUOTATION #</TableColumn>
                          <TableColumn>DATE</TableColumn>
                          <TableColumn>AMOUNT</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No quotations for this client">
                          {getClientQuotations(currentClient.id).map((quotation) => (
                            <TableRow key={quotation.id}>
                              <TableCell>{quotation.id}</TableCell>
                              <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                              <TableCell>${quotation.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="capitalize">{quotation.status}</div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onViewClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => {
                  onViewClose();
                  handleEditClient(currentClient);
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
            Are you sure you want to delete this client? This action cannot be undone.
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
