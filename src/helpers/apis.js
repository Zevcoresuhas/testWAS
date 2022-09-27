import routes from "../electron-backend/routes";

// For close Window
export const handleClose = async (request) => {
  try {
    const response = await routes.extra.closeWindow();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleMinimize = async (request) => {
  try {
    const response = await routes.extra.minimize();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleHide = async (request) => {
  try {
    const response = await routes.extra.hide();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleMaximize = async (request) => {
  try {
    const response = await routes.extra.maximize();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleUnmaximize = async (request) => {
  try {
    const response = await routes.extra.unmaximize();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleReload = async (request) => {
  try {
    const response = await routes.extra.reload();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add product data list
export const handleMailOtp = async (request) => {
  try {
    const response = await routes.extra.otpMail(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetPassbook = async (request) => {
  try {
    const response = await routes.extra.getPassbookData(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleAddPassbook = async (request) => {
  try {
    const response = await routes.extra.addPassbook(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add product data list
export const handleUserCount = async (request) => {
  try {
    const response = await routes.auth.userCount(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle register
export const handleRegister = async (request) => {
  try {
    const response = await routes.auth.register(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle login form request
export const handleLogin = async (request) => {
  try {
    // URL for login
    const response = await routes.auth.login(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleOneUser = async (request) => {
  try {
    const response = await routes.user.getOneUser();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For minimize Window
export const handleEditUser = async (request) => {
  try {
    const response = await routes.user.editUser(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleBackupDataBase = async (request) => {
  try {
    const response = await routes.extra.backupDataBase(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleUpdate = async (request) => {
  try {
    const response = await routes.extra.update(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get tax data list
export const handleGetTax = async (request) => {
  try {
    const response = await routes.tax.getTax();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add tax data list
export const handleAddTax = async (request) => {
  try {
    // const response = await routes.tax.addTax(request);
    const response = await routes.tax.addTax(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit tax data list
export const handleEditTax = async (request) => {
  try {
    const response = await routes.tax.editTax(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit tax data list
export const handleDeleteTax = async (request) => {
  try {
    const response = await routes.tax.deleteTax(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit tax data list
export const handleBulkTax = async (request) => {
  try {
    const response = await routes.tax.bulkTax(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get sale_type data list
export const handleGetSaleType = async (request) => {
  try {
    const response = await routes.sale_type.getSaleType();

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add sale_type data list
export const handleAddSaleType = async (request) => {
  try {
    // const response = await routes.sale_type.addSaleType(request);
    const response = await routes.sale_type.addSaleType(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit sale_type data list
export const handleEditSaleType = async (request) => {
  try {
    const response = await routes.sale_type.editSaleType(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit sale_type data list
export const handleDeleteSaleType = async (request) => {
  try {
    const response = await routes.sale_type.deleteSaleType(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit sale_type data list
export const handleBulkSaleType = async (request) => {
  try {
    const response = await routes.sale_type.bulkSaleType(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get brand data list
export const handleGetAccount = async (request) => {
  try {
    const response = await routes.account.getAccount();

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get brand data list
export const handleAddAccount = async (request) => {
  try {
    const response = await routes.account.addAccount(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get brand data list
export const handleGetBrand = async (request) => {
  try {
    const response = await routes.brand.getBrand();

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add brand data list
export const handleAddBrand = async (request) => {
  try {
    // const response = await routes.brand.addBrand(request);
    const response = await routes.brand.addBrand(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit brand data list
export const handleEditBrand = async (request) => {
  try {
    const response = await routes.brand.editBrand(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit brand data list
export const handleDeleteBrand = async (request) => {
  try {
    const response = await routes.brand.deleteBrand(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit brand data list
export const handleBulkBrand = async (request) => {
  try {
    const response = await routes.brand.bulkBrand(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get group data list
export const handleGetGroup = async (request) => {
  try {
    const response = await routes.group.getGroup();

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add group data list
export const handleAddGroup = async (request) => {
  try {
    const response = await routes.group.addGroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit group data list
export const handleEditGroup = async (request) => {
  try {
    const response = await routes.group.editGroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit group data list
export const handleDeleteGroup = async (request) => {
  try {
    const response = await routes.group.deleteGroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit group data list
export const handleBulkGroup = async (request) => {
  try {
    const response = await routes.group.bulkGroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get subgroup data list
export const handleGetSubGroup = async (request) => {
  try {
    const response = await routes.subgroup.getSubgroup();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add subgroup data list
export const handleAddSubGroup = async (request) => {
  try {
    const response = await routes.subgroup.addSubgroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit subgroup data list
export const handleEditSubGroup = async (request) => {
  try {
    const response = await routes.subgroup.editSubgroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit subgroup data list
export const handleDeleteSubGroup = async (request) => {
  try {
    const response = await routes.subgroup.deleteSubgroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit group data list
export const handleBulkSubGroup = async (request) => {
  try {
    const response = await routes.subgroup.bulkSubgroup(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get product data list
export const handleGetProduct = async (request) => {
  try {
    const response = await routes.product.getProduct(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add product data list
export const handleAddProduct = async (request) => {
  try {
    const response = await routes.product.addProduct(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit product data list
export const handleEditProduct = async (request) => {
  try {
    const response = await routes.product.editProduct(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit product data list
export const handleDeleteProduct = async (request) => {
  try {
    const response = await routes.product.deleteProduct(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit product data list
export const handleBulkProduct = async (request) => {
  try {
    const response = await routes.product.bulkProduct(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get vendor data list
export const handleGetVendor = async (request) => {
  try {
    const response = await routes.vendor.getVendor(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add vendor data list
export const handleAddVendor = async (request) => {
  try {
    const response = await routes.vendor.addVendor(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit vendor data list
export const handleEditVendor = async (request) => {
  try {
    const response = await routes.vendor.editVendor(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit vendor data list
export const handleDeleteVendor = async (request) => {
  try {
    const response = await routes.vendor.deleteVendor(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Vendor data list
export const handleBulkVendor = async (request) => {
  try {
    const response = await routes.vendor.bulkVendor(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get customer data list
export const handleGetCustomer = async (request) => {
  try {
    const response = await routes.customer.getCustomer(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add customer data list
export const handleAddCustomer = async (request) => {
  try {
    const response = await routes.customer.addCustomer(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit customer data list
export const handleEditCustomer = async (request) => {
  try {
    const response = await routes.customer.editCustomer(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit customer data list
export const handleDeleteCustomer = async (request) => {
  try {
    const response = await routes.customer.deleteCustomer(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Customer data list
export const handleBulkCustomer = async (request) => {
  try {
    const response = await routes.customer.bulkCustomer(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Customer data list
export const handleGetPO = async (request) => {
  try {
    const response = await routes.po.getPO();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Customer data list
export const handleAddPO = async (request) => {
  try {
    const response = await routes.po.addPO(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Customer data list
export const handleEditPO = async (request) => {
  try {
    const response = await routes.po.editPOList(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Customer data list
export const handleDeletePO = async (request) => {
  try {
    const response = await routes.po.deletePO(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit Customer data list
export const handleDeletePOList = async (request) => {
  try {
    const response = await routes.po.deletePOList(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle stock add
export const handleAddStock = async (request) => {
  try {
    const response = await routes.stock.addStock(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle stock add
export const handleGetStock = async (request) => {
  try {
    const response = await routes.stock.getStock();

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle stock add
export const handleGetProductStock = async (request) => {
  try {
    const response = await routes.stock.productStock(request);
    console.log(response, "hi");
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle stock add
export const handleDeleteStock = async (request) => {
  try {
    const response = await routes.stock.deleteStock(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleAddInvoice = async (request) => {
  try {
    const response = await routes.invoice.addInvoice(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleAddInvoice2 = async (request) => {
  try {
    const response = await routes.invoice.addInvoice2(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleSaveInvoice = async (request) => {
  try {
    const response = await routes.invoice.saveInvoice(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetInvoice = async (request) => {
  try {
    const response = await routes.invoice.getInvoice();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetOneSaveInvoice = async (request) => {
  try {
    const response = await routes.invoice.saveOneInvoice(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetSaveInvoice = async (request) => {
  try {
    const response = await routes.invoice.saveGetInvoice(request);

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleDeleteSaveInvoice = async (request) => {
  try {
    const response = await routes.invoice.saveDeleteInvoice(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetOneInvoice = async (request) => {
  try {
    const response = await routes.invoice.getOneInvoice(request);

    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleAddEstimate = async (request) => {
  try {
    const response = await routes.estimate.addEstimate(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetEstimate = async (request) => {
  try {
    const response = await routes.estimate.getEstimate();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetOneEstimate = async (request) => {
  try {
    const response = await routes.estimate.getOneEstimate(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle product history
export const handleGetProductHistory = async (request) => {
  try {
    const response = await routes.report.getProductHistory(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle product history data date wise
export const handleGetProductHistoryDate = async (request) => {
  try {
    const response = await routes.report.getProductHistoryDate(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle customer history data
export const handleGetCustomerHistory = async (request) => {
  try {
    const response = await routes.report.getCustomerHistory(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle customer history data
export const handleGetCustomerHistory2 = async (request) => {
  try {
    const response = await routes.report.getCustomerHistory2(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle customer history data
export const handleGetCustomerHistoryDate = async (request) => {
  try {
    const response = await routes.report.getCustomerHistoryDate(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetKPI = async (request) => {
  try {
    const response = await routes.report.getKPI(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDashboard = async (request) => {
  try {
    const response = await routes.report.getDashboard(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetCustomerReport = async (request) => {
  try {
    const response = await routes.report.getCustomerReport(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle invoice add
export const handleGetStockDepletion = async (request) => {
  try {
    const response = await routes.report.getStockDepletion(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get cash
export const handleGetCash = async (request) => {
  try {
    const response = await routes.cash_leadger.getCash();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add cash
export const handleAddCash = async (request) => {
  try {
    const response = await routes.cash_leadger.addCash(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit cash
export const handleEditCash = async (request) => {
  try {
    const response = await routes.cash_leadger.editCash(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleDeleteCash = async (request) => {
  try {
    const response = await routes.cash_leadger.deleteCash(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleSearch = async (request) => {
  try {
    const response = await routes.cash_leadger.searchCash(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleSearchBank = async (request) => {
  try {
    const response = await routes.bank_ledger.searchBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get cash
export const handleGetBankLedger = async (request) => {
  try {
    const response = await routes.bank_ledger.getBank();
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add cash
export const handleAddBankLedger = async (request) => {
  try {
    const response = await routes.bank_ledger.addBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit cash
export const handleEditBankLedger = async (request) => {
  try {
    const response = await routes.bank_ledger.editBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleDeleteBankLedger = async (request) => {
  try {
    const response = await routes.bank_ledger.deleteBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleAddReminder = async (request) => {
  try {
    const response = await routes.reminder.addReminder(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleGetReminder = async (request) => {
  try {
    const response = await routes.reminder.getReminder(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleTodayReminder = async (request) => {
  try {
    const response = await routes.reminder.todayReminder(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete cash
export const handleDeleteReminder = async (request) => {
  try {
    const response = await routes.reminder.deleteReminder(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get bank
export const handleGetBank = async (request) => {
  try {
    const response = await routes.bank.getBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add bank
export const handleAddBank = async (request) => {
  try {
    const response = await routes.bank.addBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit bank
export const handleEditBank = async (request) => {
  try {
    const response = await routes.bank.editBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete bank
export const handleDeleteBank = async (request) => {
  try {
    const response = await routes.bank.deleteBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle Bulk bank
export const handleBulkBank = async (request) => {
  try {
    const response = await routes.bank.bulkBank(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get address
export const handleGetAddress = async (request) => {
  try {
    const response = await routes.address.getAddress(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add address
export const handleAddAddress = async (request) => {
  try {
    const response = await routes.address.addAddress(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle edit address
export const handleEditAddress = async (request) => {
  try {
    const response = await routes.address.editAddress(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle delete address
export const handleDeleteAddress = async (request) => {
  try {
    const response = await routes.address.deleteAddress(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle get address
export const handleBulkAddress = async (request) => {
  try {
    const response = await routes.address.bulkAddress(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add payments list
export const handleAddPayment = async (request) => {
  try {
    const response = await routes.payment.addPayment(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add Journal list
export const handleAddJournal = async (request) => {
  try {
    const response = await routes.payment.addJournal(request);
    return response;
  } catch (error) {
    return error.response;
  }
};

// For handle add Journal list
export const handelGetPayments = async (request) => {
  try {
    const response = await routes.payment.getPayments(request);
    return response;
  } catch (error) {
    return error.response;
  }
};
