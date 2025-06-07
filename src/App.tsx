import React, { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Dashboard } from "./components/dashboard";
import { LoginPage } from "./components/login-page";
import { SEO, seoConfigs } from "./components/seo";

// Footer Pages
import { ApiDocumentation } from "./components/footer-pages/api-documentation";
import { MobileApps } from "./components/footer-pages/mobile-apps";
import { AboutUs } from "./components/footer-pages/about-us";
import { Careers } from "./components/footer-pages/careers";
import { HelpCenter } from "./components/footer-pages/help-center";
import { PrivacyPolicy } from "./components/footer-pages/privacy-policy";
import { Contact } from "./components/footer-pages/contact";
import { TermsOfService } from "./components/footer-pages/terms-of-service";
import { Integrations } from "./components/footer-pages/integrations";
import { CaseStudies } from "./components/footer-pages/case-studies";

import { QuotationTemplates } from "./components/quotation-templates";
import { ApprovalWorkflow } from "./components/approval-workflow";
import { CustomerSegments } from "./components/customer-segments";
import { PerformanceAnalytics } from "./components/performance-analytics";
import { ProductCatalog } from "./components/product-catalog/product-catalog";
import { SettingsDashboard } from "./components/settings/settings-dashboard";
import { CustomerPortal } from "./components/customer-portal";
import { FinancialReports } from "./components/financial-reports";
import { UserManagement } from "./components/user-management";
import { SystemIntegrations } from "./components/system-integrations";
import { CreateQuotation } from "./components/create-quotation";
import { ClientsPage } from "./components/clients-page";
import { ProductsPage } from "./components/products-page";
import { Features } from "./components/footer-pages/features";
import { Pricing } from "./components/footer-pages/pricing";
import { ComingSoon } from "./components/coming-soon";
import { InventoryManagement } from "./components/inventory-management";
import { WorkflowRules } from "./components/workflow-rules";
import { SalesForecasting } from "./components/sales-forecasting";
import { GeneralSettings } from "./components/general-settings";
import { ApprovalHistory } from "./components/approval-history";
import { WorkflowSettings } from "./components/workflow-settings";
import { SecuritySettings } from "./components/security-settings";
import { QuotationsList } from "./components/quotations-list";
import { AddClient } from "./components/add-client";
import { AddProduct } from "./components/add-product";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("quotemanager_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("quotemanager_user");
    setActiveSection("login");
  };

  // Check for existing session on app load
  React.useEffect(() => {
    const savedUser = localStorage.getItem("quotemanager_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("quotemanager_user");
      }
    } else {
      setActiveSection("login");
    }
  }, []);

  const getSEOConfig = () => {
    switch (activeSection) {
      case "login":
        return seoConfigs.login;
      case "dashboard":
        return seoConfigs.dashboard;
      case "quotations-list":
      case "quotations-create":
      case "quotations-templates":
      case "quotations-approval":
        return seoConfigs.quotations;
      case "customers-list":
      case "customers-segments":
      case "customers-portal":
        return seoConfigs.customers;
      case "products-catalog":
      case "products-pricing":
      case "products-inventory":
        return seoConfigs.products;
      case "analytics-performance":
      case "analytics-financial":
      case "analytics-forecasting":
        return seoConfigs.analytics;
      case "settings":
      case "settings-list":
      case "settings-general":
      case "settings-users":
      case "settings-security":
        return seoConfigs.settings;
      case "features":
        return seoConfigs.features;
      case "pricing":
        return seoConfigs.pricing;

      // Footer Pages SEO
      case "api-documentation":
        return {
          title: "API Documentation - QuoteManager",
          description:
            "Complete API documentation for QuoteManager. Integrate quotation management into your applications with our RESTful API.",
          keywords:
            "API documentation, REST API, quotation API, integration, developers",
          url: "/api-documentation",
        };
      case "mobile-apps":
        return {
          title: "Mobile Apps - QuoteManager",
          description:
            "Download QuoteManager mobile apps for iOS and Android. Create quotations, manage customers, and grow your business on the go.",
          keywords:
            "mobile app, iOS app, Android app, quotation app, business mobile",
          url: "/mobile-apps",
        };
      case "about-us":
        return {
          title: "About Us - QuoteManager",
          description:
            "Learn about QuoteManager's mission to revolutionize quotation management. Meet our team and discover our journey.",
          keywords: "about QuoteManager, company story, team, mission, values",
          url: "/about-us",
        };
      case "careers":
        return {
          title: "Careers - QuoteManager",
          description:
            "Join the QuoteManager team! Explore exciting career opportunities in engineering, marketing, sales, and more.",
          keywords:
            "careers, jobs, QuoteManager jobs, software engineer jobs, remote work",
          url: "/careers",
        };
      case "help-center":
        return {
          title: "Help Center - QuoteManager",
          description:
            "Find answers to your questions about QuoteManager. Browse our comprehensive help articles and tutorials.",
          keywords:
            "help center, support, tutorials, QuoteManager help, documentation",
          url: "/help-center",
        };
      case "privacy-policy":
        return {
          title: "Privacy Policy - QuoteManager",
          description:
            "Learn how QuoteManager collects, uses, and protects your personal information. Our comprehensive privacy policy.",
          keywords:
            "privacy policy, data protection, GDPR, personal information, data security",
          url: "/privacy-policy",
        };

      default:
        return seoConfigs.home;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "login":
        return (
          <LoginPage onLogin={handleLogin} onNavigate={setActiveSection} />
        );
      case "dashboard":
        return <Dashboard onNavigate={setActiveSection} />;

      // Quotations
      case "quotations-list":
        return <QuotationsList onNavigate={setActiveSection} />;
      case "quotations-create":
        return <CreateQuotation onNavigate={setActiveSection} />;
      case "quotations-templates":
        return <QuotationTemplates onNavigate={setActiveSection} />;
      case "quotations-approval":
        return <ApprovalWorkflow onNavigate={setActiveSection} />;

      // Customers
      case "customers-list":
        return <ClientsPage onNavigate={setActiveSection} />;
      case "add-client":
        return <AddClient onNavigate={setActiveSection} />;
      case "customers-segments":
        return <CustomerSegments onNavigate={setActiveSection} />;
      case "customers-portal":
        return <CustomerPortal onNavigate={setActiveSection} />;

      // Products
      case "products-catalog":
        return <ProductsPage onNavigate={setActiveSection} />;
      case "add-product":
        return <AddProduct onNavigate={setActiveSection} />;
      case "products-pricing":
        return <ProductCatalog onNavigate={setActiveSection} />;
      case "products-inventory":
        return <InventoryManagement onNavigate={setActiveSection} />;

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
        return <WorkflowRules onNavigate={setActiveSection} />;
      case "workflow-history":
        return <ApprovalHistory onNavigate={setActiveSection} />;
      case "workflow-settings":
        return <WorkflowSettings onNavigate={setActiveSection} />;

      // Analytics
      case "analytics-performance":
        return <PerformanceAnalytics onNavigate={setActiveSection} />;
      case "analytics-financial":
        return <FinancialReports onNavigate={setActiveSection} />;
      case "analytics-forecasting":
        return <SalesForecasting onNavigate={setActiveSection} />;

      // Integrations
      case "integrations":
        return <SystemIntegrations onNavigate={setActiveSection} />;

      // Footer Pages
      case "features":
        return <Features onNavigate={setActiveSection} />;
      case "pricing":
        return <Pricing onNavigate={setActiveSection} />;
      case "api-documentation":
      case "mobile-apps":
      case "about-us":
      case "careers":
      case "press":
      case "partners":
      case "contact":
      case "help-center":
      case "user-guide":
      case "webinars":
      case "case-studies":
      case "blog":
      case "privacy-policy":
      case "terms-of-service":
      case "cookie-policy":
      case "gdpr-compliance":
      case "security":
        return (
          <ComingSoon
            title={activeSection
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            description={`The ${activeSection
              .split("-")
              .join(
                " "
              )} page is currently under development. We're working hard to bring you this feature soon.`}
            category="Information"
            priority="medium"
            expectedDate="Q2 2024"
            features={[
              "Comprehensive information",
              "User-friendly interface",
              "Mobile responsive design",
              "Regular updates",
            ]}
          />
        );

      // Settings
      case "settings-general":
        return <GeneralSettings onNavigate={setActiveSection} />;
      case "settings-users":
        return <UserManagement onNavigate={setActiveSection} />;
      case "settings-security":
        return <SecuritySettings onNavigate={setActiveSection} />;
      case "settings":
      case "settings-list":
        return <SettingsDashboard onNavigate={setActiveSection} />;

      // Footer Pages - Product
      case "api-documentation":
        return <ApiDocumentation onNavigate={setActiveSection} />;
      case "mobile-apps":
        return <MobileApps onNavigate={setActiveSection} />;
      case "integrations":
        return <Integrations onNavigate={setActiveSection} />;

      // Footer Pages - Company
      case "about-us":
        return <AboutUs onNavigate={setActiveSection} />;
      case "careers":
        return <Careers onNavigate={setActiveSection} />;
      case "press":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">Press Releases</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );
      case "partners":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );
      case "contact":
        return <Contact onNavigate={setActiveSection} />;

      // Footer Pages - Resources
      case "help-center":
        return <HelpCenter onNavigate={setActiveSection} />;
      case "user-guide":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">User Guide</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );
      case "webinars":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">Webinars</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );
      case "case-studies":
        return <CaseStudies onNavigate={setActiveSection} />;
      case "blog":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );

      // Footer Pages - Legal
      case "privacy-policy":
        return <PrivacyPolicy onNavigate={setActiveSection} />;
      case "terms-of-service":
        return <TermsOfService onNavigate={setActiveSection} />;
      case "cookie-policy":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );
      case "gdpr-compliance":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">
              GDPR Compliance
            </h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );
      case "security":
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900">Security</h1>
            <p className="text-gray-600 mt-4">Coming Soon</p>
          </div>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <HelmetProvider>
      <SEO {...getSEOConfig()} />
      <div
        className="bg-gray-50"
        style={{ minHeight: "150vh", overflowY: "scroll" }}
      >
        {activeSection !== "login" && (
          <Navbar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {activeSection === "login" ? (
          renderContent()
        ) : (
          <>
            <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              <div
                className="mb-8 sm:mb-12 lg:mb-16"
                style={{ minHeight: "100vh" }}
              >
                {renderContent()}
              </div>
            </main>
            <Footer onNavigate={setActiveSection} />
          </>
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;
