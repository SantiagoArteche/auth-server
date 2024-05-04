import type { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { CustomError } from "../../domain/errors/custom.error";
import { Uuid } from "../../config/uuid";

export class FileUploadService {
  constructor(private readonly uuid = Uuid) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  public async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    try {
      const fileExtension = file.mimetype.split("/")[1];

      const validateExtension = validExtensions.find(
        (fileExt) => fileExt === fileExtension
      );

      if (!validateExtension)
        throw CustomError.badRequest("Extension not supported or invalid");

      const destination = path.resolve(__dirname, "../../../", folder);
      this.checkFolder(destination);

      const fileName = `/${this.uuid()}.${fileExtension}`;

      file.mv(destination + fileName);

      return { fileName };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async uploadMultiple(
    files: any[],
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    const fileNames = await Promise.all(
      files.map((file) => this.uploadSingle(file, folder, validExtensions))
    );

    return fileNames;
  }
}
