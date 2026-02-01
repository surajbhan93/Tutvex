// import { FastifyInstance } from "fastify";
// import { sendOtp, verifyOtp } from "../controllers/otp.controller";

// async function otpRoutes(fastify: FastifyInstance) {
//   fastify.post("/otp/send", sendOtp);
//   fastify.post("/otp/verify", verifyOtp);
// }

// export default otpRoutes;
// // 

import { OtpController } from "../controllers/otp.controller";

export async function otpRoutes(app: any) {
  const controller = new OtpController();

  app.post("/otp/send", controller.sendOtp.bind(controller));
  app.post("/otp/verify", controller.verifyOtp.bind(controller));
}
