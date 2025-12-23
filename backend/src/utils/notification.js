/**
 * Notification Utility
 * In a real-world app, this would integrate with Email (SendGrid/Nodemailer),
 * SMS (Twilio), or Push Notification services.
 */

const sendEmail = async (to, subject, body) => {
  console.log(`[EMAIL NOTIFICATION] To: ${to}, Subject: ${subject}`);
  // Implementation for real email service
};

const sendSMS = async (to, message) => {
  console.log(`[SMS NOTIFICATION] To: ${to}, Message: ${message}`);
  // Implementation for Twilio etc.
};

const notify = async (alert) => {
  const { description, severity, recipients } = alert;
  
  console.log(`[ALERT TRIGGERED] Severity: ${severity}, Description: ${description}`);
  
  if (recipients && recipients.length > 0) {
    for (const recipient of recipients) {
      // Logic to determine if email or SMS based on recipient format
      if (recipient.includes('@')) {
        await sendEmail(recipient, `Water Quality Alert: ${severity}`, description);
      } else {
        await sendSMS(recipient, `Alert: ${description}`);
      }
    }
  }
};

module.exports = {
  notify
};
