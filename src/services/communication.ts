import { QuotationType, ClientType } from '../types/window';

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  attachments?: string[];
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export class CommunicationService {
  // Generate quotation email content
  static generateQuotationEmail(quotation: QuotationType, client: ClientType): EmailData {
    const subject = `Quotation #${quotation.id} - ${client.name}`;
    
    const body = `
Dear ${client.contact},

Please find below the quotation details:

QUOTATION DETAILS:
==================
Quotation ID: ${quotation.id}
Date: ${new Date(quotation.date).toLocaleDateString()}
Expiry Date: ${new Date(quotation.expiryDate).toLocaleDateString()}
Status: ${quotation.status.toUpperCase()}

CLIENT INFORMATION:
==================
Name: ${client.name}
Contact: ${client.contact}
Email: ${client.email}
Phone: ${client.phone}
Address: ${client.address}, ${client.city}, ${client.state} ${client.zipCode}

ITEMS:
======
${quotation.items.map((item, index) => `
${index + 1}. ${item.name}
   Description: ${item.description}
   Quantity: ${item.quantity} ${item.unitPrice > 0 ? `x $${item.unitPrice.toFixed(2)}` : ''}
   Total: $${item.total.toFixed(2)}
`).join('')}

SUMMARY:
========
Subtotal: $${quotation.subtotal.toFixed(2)}
Tax: $${quotation.tax.toFixed(2)}
Discount: $${quotation.discount.toFixed(2)}
TOTAL: $${quotation.total.toFixed(2)}

${quotation.notes ? `\nNOTES:\n${quotation.notes}\n` : ''}

TERMS & CONDITIONS:
==================
${quotation.terms || 'Standard terms and conditions apply.'}

Thank you for your business!

Best regards,
Your Company Name
`;

    return {
      to: client.email,
      subject,
      body: body.trim()
    };
  }

  // Generate WhatsApp message
  static generateWhatsAppMessage(quotation: QuotationType, client: ClientType): WhatsAppData {
    const message = `
🧾 *QUOTATION #${quotation.id}*

Hello ${client.contact}! 👋

Here's your quotation summary:

📅 *Date:* ${new Date(quotation.date).toLocaleDateString()}
⏰ *Valid Until:* ${new Date(quotation.expiryDate).toLocaleDateString()}

📋 *Items:*
${quotation.items.map((item, index) => `${index + 1}. ${item.name} - $${item.total.toFixed(2)}`).join('\n')}

💰 *Total Amount:* $${quotation.total.toFixed(2)}

${quotation.notes ? `📝 *Notes:* ${quotation.notes}\n` : ''}

For detailed quotation, please check your email or contact us.

Thank you! 🙏
    `.trim();

    // Clean phone number (remove non-digits except +)
    const cleanPhone = client.phone.replace(/[^\d+]/g, '');
    
    return {
      phone: cleanPhone,
      message
    };
  }

  // Send email (opens default email client)
  static sendEmail(emailData: EmailData): void {
    const { to, subject, body } = emailData;
    
    // Create mailto URL
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.open(mailtoUrl, '_blank');
  }

  // Send WhatsApp message (opens WhatsApp Web)
  static sendWhatsApp(whatsappData: WhatsAppData): void {
    const { phone, message } = whatsappData;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp Web
    window.open(whatsappUrl, '_blank');
  }

  // Send quotation via email
  static sendQuotationByEmail(quotation: QuotationType, client: ClientType): void {
    const emailData = this.generateQuotationEmail(quotation, client);
    this.sendEmail(emailData);
  }

  // Send quotation via WhatsApp
  static sendQuotationByWhatsApp(quotation: QuotationType, client: ClientType): void {
    const whatsappData = this.generateWhatsAppMessage(quotation, client);
    this.sendWhatsApp(whatsappData);
  }

  // Send quotation via both email and WhatsApp
  static sendQuotationBoth(quotation: QuotationType, client: ClientType): void {
    this.sendQuotationByEmail(quotation, client);
    // Small delay to prevent popup blocking
    setTimeout(() => {
      this.sendQuotationByWhatsApp(quotation, client);
    }, 1000);
  }

  // Generate PDF content (basic HTML for printing)
  static generateQuotationPDF(quotation: QuotationType, client: ClientType): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Quotation #${quotation.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-info { margin-bottom: 20px; }
        .client-info { margin-bottom: 20px; }
        .quotation-details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-row { font-weight: bold; }
        .summary { text-align: right; margin-top: 20px; }
        .terms { margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>QUOTATION</h1>
        <h2>#${quotation.id}</h2>
    </div>
    
    <div class="company-info">
        <h3>From:</h3>
        <p><strong>Your Company Name</strong><br>
        123 Business Street<br>
        Business City, ST 12345<br>
        contact@yourcompany.com</p>
    </div>
    
    <div class="client-info">
        <h3>To:</h3>
        <p><strong>${client.name}</strong><br>
        ${client.contact}<br>
        ${client.address}<br>
        ${client.city}, ${client.state} ${client.zipCode}<br>
        ${client.email}</p>
    </div>
    
    <div class="quotation-details">
        <p><strong>Date:</strong> ${new Date(quotation.date).toLocaleDateString()}</p>
        <p><strong>Valid Until:</strong> ${new Date(quotation.expiryDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${quotation.status.toUpperCase()}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${quotation.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unitPrice.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="summary">
        <p>Subtotal: $${quotation.subtotal.toFixed(2)}</p>
        <p>Tax: $${quotation.tax.toFixed(2)}</p>
        <p>Discount: $${quotation.discount.toFixed(2)}</p>
        <p class="total-row">Total: $${quotation.total.toFixed(2)}</p>
    </div>
    
    ${quotation.notes ? `<div class="notes"><h3>Notes:</h3><p>${quotation.notes}</p></div>` : ''}
    
    <div class="terms">
        <h3>Terms & Conditions:</h3>
        <p>${quotation.terms || 'Standard terms and conditions apply.'}</p>
    </div>
</body>
</html>
    `;
  }

  // Print quotation
  static printQuotation(quotation: QuotationType, client: ClientType): void {
    const htmlContent = this.generateQuotationPDF(quotation, client);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }
}
