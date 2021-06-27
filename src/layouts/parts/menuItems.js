import uiElementsData from '@/views/uiElements/uiElements.json';

const uiElementsWrapper = {};
uiElementsData.forEach(ui => {
  if (!uiElementsWrapper[ui.type + 'Heading']) uiElementsWrapper[ui.type + 'Heading'] = [];
  if (!uiElementsWrapper[ui.type]) uiElementsWrapper[ui.type] = [];
  uiElementsWrapper[ui.type + 'Heading'].push(ui.name)
  uiElementsWrapper[ui.type].push({
    text: ui.title,
    name: ui.name,
    icon: "fiber_manual_record"
  });
});

const menuItems = [
  { 
    heading: "Main", 
    names: [
      "dashboard", 
      "usersTable", 
      "usersTable2", 
      "rolesTable", 
      "siteConfigurations", 
      "accountLogs"
    ] 
  },
  { icon: "dashboard", text: "Dashboard", name: "dashboard" },
  { icon: "group", text: "User Management", name: "usersTable" },
  { icon: "group", text: "User Management2", name: "usersTable2" },
  { icon: "lock", text: "Roles and Permissions", name: "rolesTable" },
  { icon: "settings", text: "Site Configurations", name: "siteConfigurations" },
  { icon: "update", text: "Account Logs", name: "accountLogs" },
  { 
    heading: "Sample Pages", 
    names: [
      "feedsTable", 
      "assetsTable",
      "warehousesTable"
    ] 
  },
  { icon: "pages", text: "Feeds", name: "feedsTable" },
  { icon: "cloud_upload", text: "File Uploads", name: "assetsTable" },
  { icon: "pages", text: "Warehouses Table", name: "warehousesTable" },
  { 
    heading: "Documentation", 
    names: [
      "docsQuickStart",
      "docsFormFields", 
      "docsDataTable", 
      "docsAvatarGenerator", 
      "docsPhotoCropper", 
      "docsMultiUpload", 
      "docsLocationPicker",
      ...uiElementsWrapper.formElementsHeading,
      ...uiElementsWrapper.uiElementsHeading
    ]
  },
  { icon: "book", text: "Quick Start", name: "docsQuickStart" },
  {
    icon: "chrome_reader_mode",
    iconArrow: "keyboard_arrow_down",
    text: "Helper Components",
    name: "documentations",
    model: false,
    children: [
      {
        text: "Form Fields",
        icon: "fiber_manual_record",
        name: "docsFormFields"
      },
      {
        text: "Location Picker",
        icon: "fiber_manual_record",
        name: "docsLocationPicker"
      },
      {
        text: "Datatable",
        icon: "fiber_manual_record",
        name: "docsDataTable"
      },
      {
        text: "Avatar Generator",
        icon: "fiber_manual_record",
        name: "docsAvatarGenerator"
      },
      {
        text: "Photo Cropper",
        icon: "fiber_manual_record",
        name: "docsPhotoCropper"
      },
      {
        text: "Multi Upload",
        icon: "fiber_manual_record",
        name: "docsMultiUpload"
      }
    ]
  },
  {
    icon: "content_paste",
    iconArrow: "keyboard_arrow_down",
    text: "Form Elements",
    name: "formElements",
    model: false,
    children: [...uiElementsWrapper.formElements]
  },
  {
    icon: "widgets",
    iconArrow: "keyboard_arrow_down",
    text: "UI Elements",
    name: "uiElements",
    model: false,
    children: [...uiElementsWrapper.uiElements]
  }
]

export default menuItems;