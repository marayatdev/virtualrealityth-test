// import { Request, Response } from "express";
// import { logger } from "@/utils/logger";
// import path from "path";
// import fs from "fs";

// export class PdfController {
//   public getPdf = async (req: Request, res: Response) => {
//     try {
//       const pdfPath = path.join(process.cwd(), "data", "Resume_.pdf");

//       console.log("PDF Path:", pdfPath);

//       if (!fs.existsSync(pdfPath)) {
//         res.status(404).json({ message: "PDF not found" });
//         return;
//       }

//       const stream = fs.createReadStream(pdfPath);

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "inline; filename=sample.pdf");

//       stream.pipe(res);
//       logger.info("PDF sent successfully");
//     } catch (err) {
//       logger.error("Get PDF failed:", err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };
// }
