// import { FastifyRequest, FastifyReply } from "fastify";
// import { sendOtpService, verifyOtpService } from "../services/otp.service";

// export const sendOtp = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { phone } = request.body as { phone: string };
//     await sendOtpService(phone);
//     return reply.send({ success: true, message: "OTP sent successfully" });
//   } catch (err: any) {
//     return reply.status(500).send({ success: false, error: err.message });
//   }
// };

// export const verifyOtp = async (request: FastifyRequest, reply: FastifyReply) => {
//   const { phone, otp } = request.body as { phone: string; otp: number };
//   const result = verifyOtpService(phone, otp);
//   if (result.success) return reply.send(result);
//   return reply.status(400).send(result);
// };




import { FastifyRequest, FastifyReply } from "fastify";
import { OtpService } from "../services/otp.service";
import { AuthService } from "../services/auth.service";

const otpService = new OtpService();
const authService = new AuthService();

export class OtpController {

  async sendOtp(req: FastifyRequest, reply: FastifyReply) {
    const { phone } = req.body as any;

    if (!phone) {
      return reply.status(400).send({ success: false, message: "Phone required" });
    }

    await otpService.sendOtp(phone);

    return reply.send({
      success: true,
      message: "OTP sent successfully"
    });
  }

async verifyOtp(req: FastifyRequest, reply: FastifyReply) {
  let { phone, otp } = req.body as any;

  // 1️⃣ Basic validation
  if (!phone || !otp) {
    return reply.status(400).send({
      success: false,
      message: "Phone and OTP required"
    });
  }

  // 2️⃣ Normalize inputs
  phone = phone.toString().trim();
  otp = String(otp).trim();

  // 3️⃣ Verify OTP
  const isValid = await otpService.verifyOtp(phone, otp);

  if (!isValid) {
    return reply.status(400).send({
      success: false,
      message: "Invalid or expired OTP"
    });
  }

  // 4️⃣ Mark tutor phone as verified
  const user = await authService.markTutorPhoneVerified(phone);

  if (!user) {
    return reply.status(404).send({
      success: false,
      message: "Tutor not found for this phone"
    });
  }

  // 5️⃣ Final response
  return reply.send({
    success: true,
    message: "Phone verified successfully. Waiting for admin approval."
  });
}


}
