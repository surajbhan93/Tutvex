// import twilio from "twilio";

// const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);
// const otpStore: Record<string, number> = {};

// export const sendOtpService = async (phone: string) => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[phone] = otp;

//   await client.messages.create({
//     body: `Your TutorEdge OTP is ${otp}`,
//     from: process.env.TWILIO_PHONE!,
//     to: `+91${phone}`,
//   });

//   return otp;
// };

// export const verifyOtpService = (phone: string, otp: number) => {
//   if (!otpStore[phone]) return { success: false, message: "OTP expired" };
//   if (otpStore[phone] === otp) {
//     delete otpStore[phone];
//     return { success: true, message: "OTP verified" };
//   }
//   return { success: false, message: "Invalid OTP" };
// };



export class OtpService {
  private otpStore = new Map<string, string>();

  private normalizePhone(phone: string) {
    return phone.replace(/\D/g, "").slice(-10);
  }

  async sendOtp(phone: string) {
    const normalizedPhone = this.normalizePhone(phone);

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    this.otpStore.set(normalizedPhone, otp);

    console.log(`OTP for ${normalizedPhone}: ${otp}`); // SMS gateway later
  }

  async verifyOtp(phone: string, otp: string) {
    const normalizedPhone = this.normalizePhone(phone);

    const savedOtp = this.otpStore.get(normalizedPhone);

    console.log("Saved OTP:", savedOtp, "Incoming OTP:", otp);

    if (!savedOtp) return false;

    const isValid = savedOtp === String(otp);

    if (isValid) {
      this.otpStore.delete(normalizedPhone); // 🔥 one-time use
    }

    return isValid;
  }
}

