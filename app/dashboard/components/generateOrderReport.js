import { utils, writeFile } from 'xlsx';

const generateOrderReport = (data, totalSales, totalOrders) => {
    const headers = ['Order ID', 'User ID', 'Status', 'Total', 'Status Pembayaran', 'Created At', 'Updated At'];
    
    const summaryData = [['Total Sales', 'Total Orders'], [totalSales, totalOrders]];

    const worksheet = utils.json_to_sheet(data);

    utils.sheet_add_aoa(worksheet, { origin: 'A3' });

    // utils.sheet_add_aoa(worksheet, summaryData, { origin: 'A1' });

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    writeFile(workbook, 'sales_report.xlsx');
};

export default generateOrderReport;