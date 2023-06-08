import { inject, injectable } from "inversify";
import { ICronjobService } from "../interfaces/ICronjobService";
import { ISFTPService } from "../interfaces/ISFTPService";
import { TYPES } from "../config/types";
import { SFTPCreateConnectionService } from "../types/SFTPService";
import env from "../config/env";

@injectable()
export class CronjobService implements ICronjobService {
  private _sftpService: ISFTPService;
  constructor(@inject(TYPES.SFTPService) sftpService: ISFTPService) {
    this._sftpService = sftpService;
    console.log(`Creating: ${this.constructor.name}`);
  }

  async cronJob(): Promise<any> {
    try {
      const connectionData: SFTPCreateConnectionService = {
        host: env.SFTP_HOST!,
        port: env.SFTP_PORT!,
        user: env.SFTP_USER!,
        password: env.SFTP_PASSWORD!,
        secure: env.SFTP_SECURE!,
        keepaliveInterval: 900000,
      };
      const connectSftp = await this._sftpService.createSFTPConnection(
        connectionData
      );
      const selectedFileType = env.SELECT_FILE_TYPE || "txt";
      const path = env.SFTP_PATH!;
      const files = await this._sftpService.downloadFiles(
        path,
        selectedFileType
      );

      // const batchSize = 5;
      // const numberOfCycle = Math.ceil(fileArrays.length / batchSize);
      // console.log("numberOfCycle", numberOfCycle);
      // const cycleDuration: any[] = [];

      // for (let i = 0; i < numberOfCycle; i++) {
      //   cycleDuration.push({
      //     start: batchSize * i,
      //     end: batchSize * (i + 1),
      //   });
      // }

      // console.log("cycleDuration", cycleDuration);

      // const downloadMultipleFiles = async (
      //   filePath: any,
      //   fileName: any,
      //   tailNumber: any
      // ) => {
      //   try {
      //     console.log(new Date().toLocaleString(), "File Read Started", fileName);
      //     const readSream = await connectSftp.createReadStream(`${filePath}`);
      //     console.log(new Date().toLocaleString(), "File Read End", fileName);

      //     // filesArray.push(readSream);

      //     // const DocumentsRepo = await database.getEntity(Documents);
      //     // const newDocument = new Documents();
      //     // newDocument.operationId = OperationId.id;
      //     // newDocument.projectId = ProjectId.id;
      //     // newDocument.documentTypeId = FileTypeId.id;
      //     // newDocument.tailNo = tailNumber; //
      //     // newDocument.flightNo = "100ASL"; // where can i get it
      //     // newDocument.documentName = file.name; //filename
      //     // newDocument.sourcePath = `${tailNumber}/${file.name}`;
      //     // newDocument.stagingAreaPath = `${__dirname}/sftp-files/${file.name}`; //bucket location
      //     // newDocument.processStartTime = new Date();
      //     // newDocument.processEndTime = new Date();
      //     // newDocument.status = FileStatusEnum.PICKUP_BY_SFTP;
      //     // const DocumentScave = await database.saveEntity(
      //     //   DocumentsRepo,
      //     //   newDocument
      //     // );
      //     // const DocumentAuditTrailRepo = await database.getEntity(
      //     //   DocumentAuditTrail
      //     // );

      //     // const newDocumentAuditTrail = await new DocumentAuditTrail();
      //     // newDocumentAuditTrail.documentId = DocumentScave.id;
      //     // newDocumentAuditTrail.description =
      //     //   "File picked up from SFTP";
      //     // newDocumentAuditTrail.time = new Date();
      //     // newDocumentAuditTrail.createdAt = new Date();
      //     // newDocumentAuditTrail.status = FileStatusEnum.PICKUP_BY_SFTP;
      //     // const fileProcessDetails = await database.saveEntity(
      //     //   DocumentAuditTrailRepo,
      //     //   newDocumentAuditTrail
      //     // );

      //     // console.log(new Date().toLocaleString(), "File Read End");
      //     // // console.log("id", DocumentScave.id);
      //     const formData = new FormData();
      //     formData.append("id", 1);
      //     formData.append("tailNumber", tailNumber);
      //     formData.append("file", readSream);

      //     console.log(new Date().toLocaleString(), "File receiver API trigger", fileName);
      //     const apiCall = await axios.post(process.env.apiURL!, formData, {
      //       headers: { "content-type": "multipart/form-data" },
      //     });
      //     console.log(new Date().toLocaleString(), "API call End", fileName);
      //     // // console.log("API Response", apiCall.data);
      //     if (apiCall.status === 200) {
      //       // const deleteFile = await sftp.delete(
      //       //   `${tailNumber}/${file.name}`
      //       // );
      //       console.log(`File deleted from SFTP: ${tailNumber}/${fileName}`);
      //       return `File deleted from SFTP: ${tailNumber}/${fileName}`;
      //     }

      //     return `File deleted from SFTP: ${tailNumber}/${fileName}`;
      //   } catch (error) {
      //     return `Error in promise: ${fileName}, error: ${error}`;
      //   }
      // };

      // for (const duration of cycleDuration) {
      //   const fileArray = fileArrays.slice(duration.start, duration.end);

      //   const result = await Promise.all(
      //     fileArray.map((file) =>
      //       downloadMultipleFiles(file.filePath, file.fileName, file.tailNumber)
      //     )
      //   )
      //     .then((result: any) => {
      //       console.log(
      //         new Date().toLocaleString(),
      //         "Promise Resolve",
      //         duration
      //       );
      //     })
      //     .catch((error: any) => {
      //       console.log("error in promise catch", error);
      //     });
      // }

      // await connectSftp.end();

      // Promise.allSettled(allPromise)
      //   .then(async (result: any) => {
      //     console.log(new Date().toLocaleString(), "All Promise Resolve");

      //     // await connectSftp.end();
      //     console.log("Disconnect SFTP");
      //   })
      //   .catch(async (error: any) => {
      //     console.log("error", error);
      //     await connectSftp.end();
      //     console.log("Disconnect SFTP");
      //   });
      return connectSftp;
    } catch (error) {
      console.log("Error in CronJob Service: ", error);
    }
    // finally {
    //   await connectSftp.end();
    //   console.log("Disconnect SFTP");
    // }
  }
}
