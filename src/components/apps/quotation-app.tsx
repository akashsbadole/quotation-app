import React from "react";
import {
  Tabs,
  Tab,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDataContext } from "../../context/data-context";
import { QuotationType, QuotationItemType } from "../../types/window";

export const QuotationApp: React.FC = () => {
  const {
    quotations,
    clients,
    products,
    deleteQuotation,
    addQuotation,
    updateQuotation,
  } = useDataContext();
  const [selected, setSelected] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [currentQuotation, setCurrentQuotation] =
    React.useState<QuotationType | null>(null);
  const [quotationToDelete, setQuotationToDelete] = React.useState<
    string | null
  >(null);

  // Form state for new/edit quotation
  const [formData, setFormData] = React.useState<{
    clientId: string;
    date: string;
    expiryDate: string;
    items: QuotationItemType[];
    notes: string;
    terms: string;
    status: "draft" | "pending" | "sent" | "approved" | "rejected";
  }>({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [],
    notes: "",
    terms: "Payment due within 30 days of acceptance",
    status: "draft",
  });

  const filteredQuotations = quotations.filter(
    (quotation) =>
      (selected === "all" || quotation.status === selected) &&
      (searchQuery === "" ||
        quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quotation.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "draft":
        return "default";
      case "sent":
        return "primary";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewQuotation = (quotation: QuotationType) => {
    setCurrentQuotation(quotation);
    onViewOpen();
  };

  const handleEditQuotation = (quotation: QuotationType) => {
    setCurrentQuotation(quotation);
    setFormData({
      clientId: quotation.clientId,
      date: quotation.date,
      expiryDate: quotation.expiryDate,
      items: [...quotation.items],
      notes: quotation.notes,
      terms: quotation.terms,
      status: quotation.status,
    });
    onOpen();
  };

  const handleNewQuotation = () => {
    setCurrentQuotation(null);
    setFormData({
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [],
      notes: "",
      terms: "Payment due within 30 days of acceptance",
      status: "draft",
    });
    onOpen();
  };

  const handleDeleteClick = (id: string) => {
    setQuotationToDelete(id);
    onDeleteOpen();
  };

  const handleConfirmDelete = () => {
    if (quotationToDelete) {
      deleteQuotation(quotationToDelete);
      setQuotationToDelete(null);
      onDeleteClose();
    }
  };

  const handleAddItem = () => {
    const newItem: QuotationItemType = {
      id: `item-${Date.now()}`,
      productId: "",
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      discount: 0,
      total: 0,
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  const handleItemChange = (
    itemId: string,
    field: keyof QuotationItemType,
    value: any
  ) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        // If product ID changed, update product details
        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          if (product) {
            updatedItem.name = product.name;
            updatedItem.description = product.description;
            updatedItem.unitPrice = product.price;
            updatedItem.tax = product.tax;
          }
        }

        // Recalculate total
        if (["quantity", "unitPrice", "tax", "discount"].includes(field)) {
          const quantity = Number(updatedItem.quantity);
          const unitPrice = Number(updatedItem.unitPrice);
          const discount = Number(updatedItem.discount) / 100;

          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * discount;
          updatedItem.total = subtotal - discountAmount;
        }

        return updatedItem;
      }
      return item;
    });

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = formData.items.reduce((sum, item) => {
      const itemTax = (item.tax / 100) * item.unitPrice * item.quantity;
      return sum + itemTax;
    }, 0);
    const discount = formData.items.reduce((sum, item) => {
      const discountRate = item.discount / 100;
      const discountAmount = item.unitPrice * item.quantity * discountRate;
      return sum + discountAmount;
    }, 0);
    const total = subtotal + tax;

    return { subtotal, tax, discount, total };
  };

  const handleSaveQuotation = () => {
    const selectedClient = clients.find((c) => c.id === formData.clientId);
    if (!selectedClient) return;

    const { subtotal, tax, discount, total } = calculateTotals();

    if (currentQuotation) {
      // Update existing quotation
      updateQuotation(currentQuotation.id, {
        clientId: formData.clientId,
        clientName: selectedClient.name,
        date: formData.date,
        expiryDate: formData.expiryDate,
        items: formData.items,
        subtotal,
        tax,
        discount,
        total,
        notes: formData.notes,
        terms: formData.terms,
        status: formData.status,
      });
    } else {
      // Create new quotation
      addQuotation({
        clientId: formData.clientId,
        clientName: selectedClient.name,
        date: formData.date,
        expiryDate: formData.expiryDate,
        items: formData.items,
        subtotal,
        tax,
        discount,
        total,
        notes: formData.notes,
        terms: formData.terms,
        status: formData.status,
      });
    }

    onClose();
  };

  const handleDuplicateQuotation = (quotation: QuotationType) => {
    const newQuotation = {
      ...quotation,
      status: "draft" as const,
      date: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    delete (newQuotation as any).id;
    delete (newQuotation as any).createdAt;
    delete (newQuotation as any).updatedAt;

    addQuotation(newQuotation);
  };

  const handleStatusChange = (
    quotationId: string,
    newStatus: "draft" | "pending" | "sent" | "approved" | "rejected"
  ) => {
    updateQuotation(quotationId, { status: newStatus });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Quotations</h1>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          onPress={handleNewQuotation}
        >
          New Quotation
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search quotations..."
            startContent={
              <Icon icon="lucide:search" className="text-default-400" />
            }
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                endContent={
                  <Icon icon="lucide:chevron-down" className="text-small" />
                }
              >
                Filter
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Filter options">
              <DropdownItem key="newest">Newest First</DropdownItem>
              <DropdownItem key="oldest">Oldest First</DropdownItem>
              <DropdownItem key="highest">Highest Amount</DropdownItem>
              <DropdownItem key="lowest">Lowest Amount</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                endContent={
                  <Icon icon="lucide:chevron-down" className="text-small" />
                }
              >
                Export
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Export options">
              <DropdownItem key="pdf">Export as PDF</DropdownItem>
              <DropdownItem key="excel">Export as Excel</DropdownItem>
              <DropdownItem key="csv">Export as CSV</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <Tabs
        aria-label="Quotation status tabs"
        selectedKey={selected}
        onSelectionChange={setSelected as any}
        className="mb-4"
      >
        <Tab key="all" title="All" />
        <Tab key="draft" title="Drafts" />
        <Tab key="pending" title="Pending" />
        <Tab key="sent" title="Sent" />
        <Tab key="approved" title="Approved" />
        <Tab key="rejected" title="Rejected" />
      </Tabs>

      <Card className="flex-1">
        <Table
          aria-label="Quotations table"
          removeWrapper
          selectionMode="single"
        >
          <TableHeader>
            <TableColumn>QUOTATION #</TableColumn>
            <TableColumn>CLIENT</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>ITEMS</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No quotations found">
            {filteredQuotations.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell>{quotation.id}</TableCell>
                <TableCell>{quotation.clientName}</TableCell>
                <TableCell>
                  {new Date(quotation.date).toLocaleDateString()}
                </TableCell>
                <TableCell>${quotation.total.toFixed(2)}</TableCell>
                <TableCell>{quotation.items.length}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Badge
                        color={getStatusColor(quotation.status)}
                        className="cursor-pointer"
                      >
                        {getStatusText(quotation.status)}
                      </Badge>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Change status"
                      onAction={(key) =>
                        handleStatusChange(quotation.id, key as any)
                      }
                    >
                      <DropdownItem key="draft">Draft</DropdownItem>
                      <DropdownItem key="pending">Pending</DropdownItem>
                      <DropdownItem key="sent">Sent</DropdownItem>
                      <DropdownItem key="approved">Approved</DropdownItem>
                      <DropdownItem key="rejected">Rejected</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleViewQuotation(quotation)}
                    >
                      <Icon icon="lucide:eye" className="text-default-500" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEditQuotation(quotation)}
                    >
                      <Icon icon="lucide:edit" className="text-default-500" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleDuplicateQuotation(quotation)}
                    >
                      <Icon icon="lucide:copy" className="text-default-500" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleDeleteClick(quotation.id)}
                    >
                      <Icon icon="lucide:trash" className="text-default-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Quotation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
        backdrop="blur"
        placement="center"
        classNames={{
          wrapper: "z-[2001]",
          backdrop: "z-[2000]",
        }}
      >
        <ModalContent>
          <ModalHeader>
            {currentQuotation
              ? `Edit Quotation ${currentQuotation.id}`
              : "Create New Quotation"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Select
                  label="Client"
                  placeholder="Select a client"
                  selectedKeys={formData.clientId ? [formData.clientId] : []}
                  onChange={(e) =>
                    setFormData({ ...formData, clientId: e.target.value })
                  }
                >
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Status"
                  placeholder="Select status"
                  selectedKeys={[formData.status]}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                >
                  <SelectItem key="draft" value="draft">
                    Draft
                  </SelectItem>
                  <SelectItem key="pending" value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem key="sent" value="sent">
                    Sent
                  </SelectItem>
                  <SelectItem key="approved" value="approved">
                    Approved
                  </SelectItem>
                  <SelectItem key="rejected" value="rejected">
                    Rejected
                  </SelectItem>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Input
                  type="date"
                  label="Quotation Date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Input
                  type="date"
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Items</h3>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="lucide:plus" />}
                  onPress={handleAddItem}
                >
                  Add Item
                </Button>
              </div>

              <Card>
                <Table removeWrapper>
                  <TableHeader>
                    <TableColumn>PRODUCT</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>QTY</TableColumn>
                    <TableColumn>PRICE</TableColumn>
                    <TableColumn>TAX %</TableColumn>
                    <TableColumn>DISCOUNT %</TableColumn>
                    <TableColumn>TOTAL</TableColumn>
                    <TableColumn></TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="No items added">
                    {formData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select
                            placeholder="Select product"
                            selectedKeys={
                              item.productId ? [item.productId] : []
                            }
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "productId",
                                e.target.value
                              )
                            }
                            size="sm"
                          >
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={item.quantity.toString()}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Price"
                            value={item.unitPrice.toString()}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "unitPrice",
                                Number(e.target.value)
                              )
                            }
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Tax %"
                            value={item.tax.toString()}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "tax",
                                Number(e.target.value)
                              )
                            }
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Discount %"
                            value={item.discount.toString()}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "discount",
                                Number(e.target.value)
                              )
                            }
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>${item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleRemoveItem(item.id)}
                          >
                            <Icon icon="lucide:trash-2" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax:</span>
                  <span>${calculateTotals().tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Discount:</span>
                  <span>${calculateTotals().discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>${calculateTotals().total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Textarea
                  label="Notes"
                  placeholder="Enter any notes for this quotation"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <div>
                <Textarea
                  label="Terms & Conditions"
                  placeholder="Enter terms and conditions"
                  value={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.value })
                  }
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveQuotation}>
              Save Quotation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Quotation Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={onViewClose}
        size="3xl"
        scrollBehavior="inside"
        backdrop="blur"
        placement="center"
        classNames={{
          wrapper: "z-[2001]",
          backdrop: "z-[2000]",
        }}
      >
        <ModalContent>
          {(currentQuotation) => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <div>Quotation {currentQuotation.id}</div>
                <Badge color={getStatusColor(currentQuotation.status)}>
                  {getStatusText(currentQuotation.status)}
                </Badge>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-default-500">
                      From
                    </h3>
                    <p className="font-medium">Your Company Name</p>
                    <p>123 Business Street</p>
                    <p>Business City, ST 12345</p>
                    <p>contact@yourcompany.com</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-default-500">To</h3>
                    <p className="font-medium">{currentQuotation.clientName}</p>
                    <p>
                      {
                        clients.find((c) => c.id === currentQuotation.clientId)
                          ?.address
                      }
                    </p>
                    <p>
                      {
                        clients.find((c) => c.id === currentQuotation.clientId)
                          ?.city
                      }
                      ,{" "}
                      {
                        clients.find((c) => c.id === currentQuotation.clientId)
                          ?.state
                      }{" "}
                      {
                        clients.find((c) => c.id === currentQuotation.clientId)
                          ?.zipCode
                      }
                    </p>
                    <p>
                      {
                        clients.find((c) => c.id === currentQuotation.clientId)
                          ?.email
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-default-500">
                      Quotation Date
                    </h3>
                    <p>
                      {new Date(currentQuotation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-default-500">
                      Expiry Date
                    </h3>
                    <p>
                      {new Date(
                        currentQuotation.expiryDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Card className="mb-6">
                  <Table removeWrapper>
                    <TableHeader>
                      <TableColumn>ITEM</TableColumn>
                      <TableColumn>DESCRIPTION</TableColumn>
                      <TableColumn>QTY</TableColumn>
                      <TableColumn>PRICE</TableColumn>
                      <TableColumn>TOTAL</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {currentQuotation.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                <div className="flex justify-end mb-6">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>${currentQuotation.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Tax:</span>
                      <span>${currentQuotation.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Discount:</span>
                      <span>${currentQuotation.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total:</span>
                      <span>${currentQuotation.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {currentQuotation.notes && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-default-500 mb-1">
                      Notes
                    </h3>
                    <p>{currentQuotation.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-default-500 mb-1">
                    Terms & Conditions
                  </h3>
                  <p>{currentQuotation.terms}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onViewClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onViewClose();
                    handleEditQuotation(currentQuotation);
                  }}
                >
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        size="sm"
        backdrop="blur"
        placement="center"
        classNames={{
          wrapper: "z-[2001]",
          backdrop: "z-[2000]",
        }}
      >
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this quotation? This action cannot
            be undone.
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
