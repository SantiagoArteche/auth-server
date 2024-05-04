import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {
  constructor(private readonly fileService: FileUploadService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).send(error.message);

    return res.status(500).send(`Internal server error`);
  }

  uploadFile = async (req: Request, res: Response) => {
    const { type } = req.params;
    console.log({ type });

    const file = req.body.files[0];

    this.fileService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) => res.send(uploaded))
      .catch((error) => this.handleError(error, res));
  };

  uploadMultipleFiles = (req: Request, res: Response) => {
    const { type } = req.params;
    const file = req.body.files as UploadedFile[];

    this.fileService
      .uploadMultiple(file, `uploads/${type}`)
      .then((uploaded) => res.send(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
