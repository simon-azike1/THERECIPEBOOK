import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE;

export const sendWhatsAppMessage = async (to, message) => {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log('WhatsApp not configured. Skipping notification.');
    return false;
  }

  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('WhatsApp message sent:', response.data);
    return true;
  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error.message);
    return false;
  }
};

export const notifyAdminNewUser = async (userName, userEmail) => {
  if (!ADMIN_PHONE) {
    console.log('Admin phone not configured. Skipping notification.');
    return false;
  }

  const frontendUrl = process.env.LIVE_FRONTEND_URL || process.env.FRONTEND_URL || 'https://therecipebook.vercel.app';
  const dashboardLink = `${frontendUrl}/admin/dashboard`;
  
  const message = `🔔 *New User Registration*\n\nName: ${userName}\nEmail: ${userEmail}\n\n👇 Approve here:\n${dashboardLink}`;
  
  return sendWhatsAppMessage(ADMIN_PHONE, message);
};

export const notifyUserApproved = async (phone, userName) => {
  const message = `✅ *Account Approved!*\n\nHi ${userName},\n\nYour TheRecipeBook account has been approved. You can now login and start planning your meals!\n\nHappy cooking! 🍳`;
  
  return sendWhatsAppMessage(phone, message);
};
