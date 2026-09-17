// // import twilio from "twilio";

// // const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);
// // const otpStore: Record<string, number> = {};

// // export const sendOtpService = async (phone: string) => {
// //   const otp = Math.floor(100000 + Math.random() * 900000);
// //   otpStore[phone] = otp;

// //   await client.messages.create({
// //     body: `Your TutorEdge OTP is ${otp}`,
// //     from: process.env.TWILIO_PHONE!,
// //     to: `+91${phone}`,
// //   });

// //   return otp;
// // };

// // export const verifyOtpService = (phone: string, otp: number) => {
// //   if (!otpStore[phone]) return { success: false, message: "OTP expired" };
// //   if (otpStore[phone] === otp) {
// //     delete otpStore[phone];
// //     return { success: true, message: "OTP verified" };
// //   }
// //   return { success: false, message: "Invalid OTP" };
// // };



// import axios from "axios";

// export class OtpService {
//   private otpStore = new Map<string, string>();

//   private normalizePhone(phone: string) {
//     return phone.replace(/\D/g, "").slice(-10);
//   }

//   private generateOtp() {
//     return String(Math.floor(100000 + Math.random() * 900000));
//   }

//   async sendOtp(phone: string) {
//     const normalizedPhone = this.normalizePhone(phone);
//     const otp = this.generateOtp();

//     // save OTP
//     this.otpStore.set(normalizedPhone, otp);

//     // 📤 Send via WhatsApp Cloud API
//     await axios.post(
//       `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to: `91${normalizedPhone}`,
//         type: "template",
//         template: {
//           name: process.env.WHATSAPP_TEMPLATE_NAME,
//           language: { code: "en_US" },
//           components: [
//             {
//               type: "body",
//               parameters: [
//                 {
//                   type: "text",
//                   text: otp
//                 }
//               ]
//             }
//           ]
//         }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log(`✅ WhatsApp OTP sent to ${normalizedPhone}`);
//   }

//   async verifyOtp(phone: string, otp: string) {
//     const normalizedPhone = this.normalizePhone(phone);
//     const savedOtp = this.otpStore.get(normalizedPhone);

//     if (!savedOtp) return false;

//     const isValid = savedOtp === otp;

//     if (isValid) {
//       this.otpStore.delete(normalizedPhone); // one-time use
//     }

//     return isValid;
//   }
// }

// ⚠️ TEMP STATIC OTP LOGIC — REMOVE AFTER OTP PROVIDER IS FIXED
// ❌ WhatsApp / Facebook API DISABLED
type OtpRecord = {
  otp: string;
  expiresAt: number;
};

export class OtpService {

  // 🔐 Static OTP Pool (frontend & backend SAME)
  private STATIC_OTPS = [
  "483927",
  "760154",
  "295840",
  "918362",
  "640759",
  "372916",
  "854203",
  "109678",
  "567492",
  "831045"
];


  // 📦 Store: phone -> otp record
  private otpStore = new Map<string, OtpRecord>();

  private normalizePhone(phone: string) {
    return phone.replace(/\D/g, "").slice(-10);
  }

  private getRandomOtp() {
    return this.STATIC_OTPS[
      Math.floor(Math.random() * this.STATIC_OTPS.length)
    ];
  }

  // 📤 SEND OTP (frontend will display it)
  async sendOtp(phone: string) {
    const normalizedPhone = this.normalizePhone(phone);
    const otp = this.getRandomOtp();

    // ⏳ 5 min expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.otpStore.set(normalizedPhone, { otp, expiresAt });

    // only for logs (remove later)
    console.log(`🧪 STATIC OTP for ${normalizedPhone}: ${otp}`);

    return {
      otp, // frontend can show this
      expiresIn: 300
    };
  }

  // ✅ VERIFY OTP
  async verifyOtp(phone: string, otp: string) {
    const normalizedPhone = this.normalizePhone(phone);
    const record = this.otpStore.get(normalizedPhone);

    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(normalizedPhone);
      return false;
    }

    const isValid = record.otp === otp;

    if (isValid) {
      this.otpStore.delete(normalizedPhone); // one-time use
    }

    return isValid;
  }
}
