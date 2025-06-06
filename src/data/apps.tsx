import React from "react";
import { AppType } from "../types/window";
import { QuotationApp } from "../components/apps/quotation-app";
import { ClientsApp } from "../components/apps/clients-app";
import { ProductsApp } from "../components/apps/products-app";
import { TemplatesApp } from "../components/apps/templates-app";
import { ReportsApp } from "../components/apps/reports-app";
import { SettingsApp } from "../components/apps/settings-app";
import { WallpaperPicker } from "../components/apps/wallpaper-picker";

export const apps: AppType[] = [
  {
    id: "quotations",
    name: "Quotations",
    icon: "lucide:file-text",
    component: QuotationApp,
    description: "Create and manage quotations",
    category: "quotation"
  },
  {
    id: "clients",
    name: "Clients",
    icon: "lucide:users",
    component: ClientsApp,
    description: "Manage client information",
    category: "management"
  },
  {
    id: "products",
    name: "Products",
    icon: "lucide:package",
    component: ProductsApp,
    description: "Manage products and services",
    category: "management"
  },
  {
    id: "templates",
    name: "Templates",
    icon: "lucide:layout-template",
    component: TemplatesApp,
    description: "Create and manage quotation templates",
    category: "quotation"
  },
  {
    id: "reports",
    name: "Reports",
    icon: "lucide:bar-chart-2",
    component: ReportsApp,
    description: "View reports and analytics",
    category: "reporting"
  },
  {
    id: "settings",
    name: "Settings",
    icon: "lucide:settings",
    component: SettingsApp,
    description: "Configure application settings",
    category: "management"
  },
  {
    id: "wallpaper",
    name: "Wallpaper",
    icon: "lucide:image",
    component: WallpaperPicker,
    description: "Change desktop wallpaper",
    category: "management"
  }
];