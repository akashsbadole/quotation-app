import React, { useState } from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Dashboard } from "./components/dashboard";
import { QuotationsPage } from "./components/quotations-page";
import { QuotationCreate } from "./components/quotation-create";
import { ClientsPage } from "./components/clients-page";
import { ProductsPage } from "./components/products-page";
import { ComingSoon } from "./components/coming-soon";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveSection} />;

      // Quotations
      case "quotations-list":
        return <QuotationsPage onNavigate={setActiveSection} />;
      case "quotations-create":
        return <QuotationCreate />;
      case "quotations-templates":
        return (
          <ComingSoon
            title="Quotation Templates"
            description="Create and manage professional quotation templates with customizable layouts, automated calculations, and industry-specific designs."
            category="Templates"
            priority="high"
            expectedDate="Q2 2024"
            features={[
              "Drag & drop template builder",
              "Industry-specific templates",
              "Custom branding options",
              "Automated field population",
              "Multi-language support",
              "Template versioning",
              "Approval workflows for templates",
              "Template analytics and usage tracking",
            ]}
          />
        );
      case "quotations-approval":
        return (
          <ComingSoon
            title="Approval Workflow"
            description="Streamline your quotation approval process with automated workflows, multi-level approvals, and real-time notifications."
            category="Workflow"
            priority="high"
            expectedDate="Q1 2024"
            features={[
              "Multi-level approval chains",
              "Role-based approval rules",
              "Automated routing based on amount",
              "Email and SMS notifications",
              "Approval history tracking",
              "Escalation procedures",
              "Bulk approval capabilities",
              "Integration with HR systems",
            ]}
          />
        );

      // Customers
      case "customers-list":
        return <ClientsPage onNavigate={setActiveSection} />;
      case "customers-segments":
        return (
          <ComingSoon
            title="Customer Segments"
            description="Organize and target your customers with intelligent segmentation based on behavior, purchase history, and custom criteria."
            category="CRM"
            priority="medium"
            expectedDate="Q3 2024"
            features={[
              "Behavioral segmentation",
              "Purchase history analysis",
              "Custom segment criteria",
              "Automated segment updates",
              "Segment performance tracking",
              "Targeted marketing campaigns",
              "Export and integration capabilities",
              "Visual segment analytics",
            ]}
          />
        );
      case "customers-portal":
        return (
          <ComingSoon
            title="Customer Portal"
            description="Empower your customers with a self-service portal to view quotations, track orders, and manage their account information."
            category="Portal"
            priority="high"
            expectedDate="Q2 2024"
            features={[
              "Self-service quotation viewing",
              "Order tracking and history",
              "Account management",
              "Document downloads",
              "Communication center",
              "Payment status tracking",
              "Support ticket system",
              "Mobile-responsive design",
            ]}
          />
        );

      // Products
      case "products-catalog":
        return <ProductsPage onNavigate={setActiveSection} />;
      case "products-pricing":
        return (
          <ComingSoon
            title="Pricing Matrix"
            description="Advanced pricing management with dynamic pricing rules, volume discounts, customer-specific pricing, and automated price updates."
            category="Pricing"
            priority="high"
            expectedDate="Q2 2024"
            features={[
              "Dynamic pricing rules",
              "Volume discount tiers",
              "Customer-specific pricing",
              "Competitor price tracking",
              "Automated price updates",
              "Margin protection rules",
              "Currency conversion",
              "Price approval workflows",
            ]}
          />
        );
      case "products-inventory":
        return (
          <ComingSoon
            title="Inventory Management"
            description="Real-time inventory tracking with automated stock alerts, supplier management, and integration with quotation availability checks."
            category="Inventory"
            priority="medium"
            expectedDate="Q3 2024"
            features={[
              "Real-time stock tracking",
              "Automated reorder points",
              "Supplier management",
              "Stock movement history",
              "Barcode scanning",
              "Multi-location support",
              "Integration with quotations",
              "Inventory valuation reports",
            ]}
          />
        );

      // Workflow
      case "workflow-approvals":
        return (
          <ComingSoon
            title="Pending Approvals"
            description="Centralized approval queue with real-time notifications, batch processing, and detailed approval tracking for efficient workflow management."
            category="Workflow"
            priority="high"
            expectedDate="Q1 2024"
            features={[
              "Centralized approval queue",
              "Real-time notifications",
              "Batch approval processing",
              "Approval delegation",
              "Mobile approval support",
              "Approval comments and notes",
              "Escalation management",
              "SLA tracking and alerts",
            ]}
          />
        );
      case "workflow-rules":
        return (
          <ComingSoon
            title="Workflow Rules"
            description="Configure custom approval workflows with conditional logic, automated routing, and flexible rule-based processing for your business needs."
            category="Workflow"
            priority="medium"
            expectedDate="Q2 2024"
            features={[
              "Visual workflow designer",
              "Conditional logic rules",
              "Automated routing",
              "Role-based assignments",
              "Time-based triggers",
              "Custom approval criteria",
              "Workflow templates",
              "Testing and simulation tools",
            ]}
          />
        );
      case "workflow-history":
        return (
          <ComingSoon
            title="Approval History"
            description="Comprehensive audit trail of all approval activities with detailed logs, performance metrics, and compliance reporting capabilities."
            category="Workflow"
            priority="low"
            expectedDate="Q3 2024"
            features={[
              "Complete audit trail",
              "Approval performance metrics",
              "Compliance reporting",
              "Historical trend analysis",
              "Export capabilities",
              "Advanced search filters",
              "User activity tracking",
              "Regulatory compliance tools",
            ]}
          />
        );

      // Analytics
      case "analytics-performance":
        return (
          <ComingSoon
            title="Performance Analytics"
            description="Get deep insights into your quotation performance with advanced analytics, conversion tracking, and team productivity metrics."
            category="Analytics"
            priority="medium"
            expectedDate="Q3 2024"
            features={[
              "Conversion rate analysis",
              "Team performance dashboards",
              "Response time tracking",
              "Win/loss analysis",
              "Customer behavior insights",
              "Product performance metrics",
              "Seasonal trend analysis",
              "Custom KPI tracking",
            ]}
          />
        );
      case "analytics-financial":
        return (
          <ComingSoon
            title="Financial Reports"
            description="Comprehensive financial reporting with revenue analysis, profit margins, and automated financial insights for better business decisions."
            category="Analytics"
            priority="high"
            expectedDate="Q2 2024"
            features={[
              "Revenue trend analysis",
              "Profit margin tracking",
              "Cost analysis reports",
              "Budget vs actual comparisons",
              "Cash flow projections",
              "Tax reporting integration",
              "Multi-currency reporting",
              "Automated financial alerts",
            ]}
          />
        );
      case "analytics-forecasting":
        return (
          <ComingSoon
            title="Sales Forecasting"
            description="AI-powered sales forecasting with predictive analytics to help you plan ahead and make data-driven business decisions."
            category="AI"
            priority="medium"
            expectedDate="Q4 2024"
            features={[
              "AI-powered predictions",
              "Seasonal pattern recognition",
              "Pipeline probability scoring",
              "Market trend analysis",
              "Scenario planning tools",
              "Confidence intervals",
              "Historical data analysis",
              "Integration with CRM data",
            ]}
          />
        );

      // Integrations
      case "integrations":
        return (
          <ComingSoon
            title="System Integrations"
            description="Seamlessly connect your quotation system with popular CRM, ERP, accounting, and business tools for a unified workflow."
            category="Integration"
            priority="high"
            expectedDate="Q1 2024"
            features={[
              "Salesforce CRM integration",
              "HubSpot connectivity",
              "QuickBooks accounting sync",
              "Xero financial integration",
              "SAP ERP connection",
              "Microsoft Dynamics 365",
              "Zapier automation",
              "Custom API endpoints",
              "Real-time data synchronization",
              "Webhook support",
              "Single sign-on (SSO)",
              "Data mapping tools",
            ]}
          />
        );

      // Settings
      case "settings-general":
        return (
          <ComingSoon
            title="General Settings"
            description="Configure general system settings including company information, branding, localization, and basic preferences."
            category="Settings"
            priority="medium"
            expectedDate="Q2 2024"
            features={[
              "Company information setup",
              "Logo and branding customization",
              "Currency and tax configuration",
              "Date and time formats",
              "Language and localization",
              "Email template customization",
              "Notification preferences",
              "Default quotation settings",
            ]}
          />
        );
      case "settings-users":
        return (
          <ComingSoon
            title="User Management"
            description="Manage user accounts, roles, permissions, and access controls for your quotation management system."
            category="Settings"
            priority="high"
            expectedDate="Q1 2024"
            features={[
              "User account management",
              "Role-based access control",
              "Permission management",
              "Team organization",
              "User activity monitoring",
              "Password policies",
              "Two-factor authentication",
              "Single sign-on (SSO)",
            ]}
          />
        );
      case "settings-security":
        return (
          <ComingSoon
            title="Security Settings"
            description="Configure security policies, access controls, audit logs, and compliance settings to protect your business data."
            category="Security"
            priority="high"
            expectedDate="Q1 2024"
            features={[
              "Security policies configuration",
              "Access control settings",
              "Audit log management",
              "Data encryption settings",
              "Backup and recovery",
              "Compliance reporting",
              "API security settings",
              "Session management",
            ]}
          />
        );
      case "settings":
      case "settings-list":
        return (
          <ComingSoon
            title="System Settings"
            description="Comprehensive system configuration hub with access to all settings categories and system administration tools."
            category="Settings"
            priority="medium"
            expectedDate="Q2 2024"
            features={[
              "Settings overview dashboard",
              "Quick access to all settings",
              "System health monitoring",
              "Configuration backup",
              "Settings search and navigation",
              "Recent changes tracking",
              "Settings templates",
              "Bulk configuration tools",
            ]}
          />
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="bg-gray-50"
      style={{ minHeight: "150vh", overflowY: "scroll" }}
    >
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-8 sm:mb-12 lg:mb-16" style={{ minHeight: "100vh" }}>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
