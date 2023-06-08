import { injectable } from "inversify";
import { ISFTPService } from "../interfaces/ISFTPService";
import { InternalServerError } from "../errors/InternalServerError";
import { SFTPCreateConnectionService } from "../types/SFTPService";
import { join } from "path";
const Client = require("ssh2-sftp-client");
const sftp = new Client();
import { Database } from "db-sdk/dist";
import { Documents } from "db-sdk/dist/Documents";
import { DocumentAuditTrail } from "db-sdk/dist/DocumentAuditTrail";
import { DocumentTypes } from "db-sdk/dist/DocumentTypes";
import { FileStatusEnum } from "db-sdk/dist/Enum";
import { Operations } from "db-sdk/dist/Operations";
import { Projects } from "db-sdk/dist/Projects";
import FormData from "form-data";
import axios from "axios";

@injectable()
export class SFTPService implements ISFTPService {
  constructor() {
    console.log(`Creating: ${this.constructor.name}`);
  }

  async createSFTPConnection(
    connectionData: SFTPCreateConnectionService
  ): Promise<any> {
    try {
      await sftp.connect(connectionData);
      return sftp;
    } catch (error) {
      throw new InternalServerError(
        "An error occurred while interacting with the SFTP Server." + error
      );
    }
  }

  async downloadFiles(
    path: string,
    selectedFileType: string
  ): Promise<string[]> {
    // let count = 0;
    // const database = new Database();
    // let connection;
    // if (typeof connection === "undefined") {
    //   // Connect to the MySQL database from layer
    //   connection = await database.createDBconnection();
    // }

    try {
      // const OperationsRepo: any = await database.getEntity(Operations);
      // let OperationId = await OperationsRepo.findOne({
      //   where: {
      //     operationName: "Belgium",
      //   },
      // });

      // const ProjectsRepo: any = await database.getEntity(Projects);
      // let ProjectId = await ProjectsRepo.findOne({
      //   where: {
      //     name: "GE",
      //   },
      // });

      // const DocumentTypeRepo: any = await database.getEntity(DocumentTypes);
      // let FileTypeId = await DocumentTypeRepo.findOne({
      //   where: {
      //     documentType: "QAR",
      //   },
      // });

      const processFile: any = [];
      // read the all folders
      const folders = await sftp.list(path);
      // console.log(folders, "this is folder from sftp service");
      for (let i = 0; i < folders.length; i++) {
        // console.log(i[folders], "this is for loop");
        const folder = folders[i];
        const folderName = folder.name;
        // read all files from folder
        const allfiles = await sftp.list(`${path}/${folderName}`);
        // console.log(allfiles, "lsit of allfiles from SFTP service ");
        for (let j = 0; j < allfiles.length; j++) {
          // console.log(allfiles[i], "this is all file list from for loop");
          const file = allfiles[j];
          const fileName = file.name;
          const tailNumber = folderName.split(" ")[0];
          const fileExtension = fileName.split(".")[1];

          // check the file type
          if (
            selectedFileType.includes("*") ||
            selectedFileType.includes(fileExtension)
          ) {
            console.log(
              new Date().toLocaleString(),
              "File Read Start",
              fileName
            );

            // read file
            const readSream = await sftp.createReadStream(
              `${path}/${folderName}/${fileName}`
            );
            console.log(new Date().toLocaleString(), "File Read End", fileName);
            // TODO: Database code
            const formData = new FormData();
            formData.append("id", 1);
            formData.append("folderName", folderName);
            formData.append("tailNumber", tailNumber);
            formData.append("country", path);
            formData.append("file", readSream);

            console.log(
              new Date().toLocaleString(),
              "File receiver API trigger",
              fileName
            );

            // file receiver api
            const apiCall = await axios.post(process.env.apiURL!, formData, {
              headers: { "content-type": "multipart/form-data" },
            });
            processFile.push(`${folderName}/${fileName}`);
            console.log(new Date().toLocaleString(), "API call End", fileName);
            if (apiCall.status === 200) {
              // delete the file from SFTP
              // const deleteFile = await sftp.delete(`${folderName}/${fileName}`);
              console.log(
                new Date().toLocaleString(),
                `File deleted from SFTP: ${folderName}/${fileName}`
              );
            }
          }
        }
      }

      // for (let i = 0; i < files.length; i++) {
      //   const file = files[i];
      //   const fileExtension = file.name.split(".")[1];
      //   let filePath;
      //   if (path !== "/") {
      //     filePath = join(path, file.name);
      //   } else {
      //     filePath = file.name;
      //   }
      //   const stat = await sftp.stat(filePath);
      //   if (stat.isDirectory) {
      //     await this.downloadFiles(
      //       filePath,
      //       filesArray,
      //       selectedFileType,
      //       allPromise
      //     );
      //   } else {
      //     if (
      //       selectedFileType.includes("*") ||
      //       selectedFileType.includes(fileExtension)
      //     ) {
      //       // count = count + 1;
      //       // console.log(count);

      //       // await sftp.get(
      //       //   `${filePath}`,
      //       //   `${__dirname}/sftp-files/${file.name}`
      //       // );
      //       const tailNumber = path.replace(/\\/g, "");
      //       filesArray.push({ tailNumber, filePath, fileName: file.name });
      //       // console.log({ tailNumber, filePath, fileName: file.name });

      //       console.log(
      //         new Date().toLocaleString(),
      //         "File Read Started",
      //         file.name
      //       );
      //       const readSream = await sftp.createReadStream(`${filePath}`);
      //       console.log(
      //         new Date().toLocaleString(),
      //         "File Read End",
      //         file.name
      //       );

      //       const formData = new FormData();
      //       formData.append("id", 1);
      //       formData.append("tailNumber", tailNumber);
      //       formData.append("file", readSream);

      //       console.log(
      //         new Date().toLocaleString(),
      //         "File receiver API trigger",
      //         file.name
      //       );
      //       const apiCall = await axios.post(process.env.apiURL!, formData, {
      //         headers: { "content-type": "multipart/form-data" },
      //       });
      //       console.log(new Date().toLocaleString(), "API call End", file.name);

      //       // const downloadMultipleFiles = (filePath: any, fileName: any) => {
      //       //   return new Promise(async (resolve, reject) => {
      //       //     try {
      //       //       console.log(new Date().toLocaleString(), "File Read Started");
      //       //       const readSream = await sftp.createReadStream(`${filePath}`);
      //       //       console.log(new Date().toLocaleString(), "File Read End");

      //       //       // filesArray.push(readSream);

      //       //       // const DocumentsRepo = await database.getEntity(Documents);
      //       //       // const newDocument = new Documents();
      //       //       // newDocument.operationId = OperationId.id;
      //       //       // newDocument.projectId = ProjectId.id;
      //       //       // newDocument.documentTypeId = FileTypeId.id;
      //       //       // newDocument.tailNo = tailNumber; //
      //       //       // newDocument.flightNo = "100ASL"; // where can i get it
      //       //       // newDocument.documentName = file.name; //filename
      //       //       // newDocument.sourcePath = `${tailNumber}/${file.name}`;
      //       //       // newDocument.stagingAreaPath = `${__dirname}/sftp-files/${file.name}`; //bucket location
      //       //       // newDocument.processStartTime = new Date();
      //       //       // newDocument.processEndTime = new Date();
      //       //       // newDocument.status = FileStatusEnum.PICKUP_BY_SFTP;
      //       //       // const DocumentScave = await database.saveEntity(
      //       //       //   DocumentsRepo,
      //       //       //   newDocument
      //       //       // );
      //       //       // const DocumentAuditTrailRepo = await database.getEntity(
      //       //       //   DocumentAuditTrail
      //       //       // );

      //       //       // const newDocumentAuditTrail = await new DocumentAuditTrail();
      //       //       // newDocumentAuditTrail.documentId = DocumentScave.id;
      //       //       // newDocumentAuditTrail.description =
      //       //       //   "File picked up from SFTP";
      //       //       // newDocumentAuditTrail.time = new Date();
      //       //       // newDocumentAuditTrail.createdAt = new Date();
      //       //       // newDocumentAuditTrail.status = FileStatusEnum.PICKUP_BY_SFTP;
      //       //       // const fileProcessDetails = await database.saveEntity(
      //       //       //   DocumentAuditTrailRepo,
      //       //       //   newDocumentAuditTrail
      //       //       // );

      //       //       // console.log(new Date().toLocaleString(), "File Read End");
      //       //       // // console.log("id", DocumentScave.id);
      //       //       const formData = new FormData();
      //       //       formData.append("id", 1);
      //       //       formData.append("tailNumber", tailNumber);
      //       //       formData.append("file", readSream);

      //       //       console.log(
      //       //         new Date().toLocaleString(),
      //       //         "File receiver API trigger"
      //       //       );
      //       //       const apiCall = await axios.post(
      //       //         process.env.apiURL!,
      //       //         formData,
      //       //         {
      //       //           headers: { "content-type": "multipart/form-data" },
      //       //         }
      //       //       );
      //       //       console.log(new Date().toLocaleString(), "API call End");
      //       //       // // console.log("API Response", apiCall.data);
      //       //       if (apiCall.status === 200) {
      //       //         // const deleteFile = await sftp.delete(
      //       //         //   `${tailNumber}/${file.name}`
      //       //         // );
      //       //         console.log(
      //       //           `File deleted from SFTP: ${tailNumber}/${file.name}`
      //       //         );
      //       //         resolve(
      //       //           `File deleted from SFTP: ${tailNumber}/${file.name}`
      //       //         );
      //       //       }

      //       //       resolve(`File deleted from SFTP: ${tailNumber}/${file.name}`);
      //       //     } catch (error) {
      //       //       reject(`Error in promise: ${fileName}, error: ${error}`);
      //       //     }
      //       //   });
      //       // };
      //       // allPromise.push(downloadMultipleFiles(filePath, file.name));
      //     }
      //   }
      // }

      return processFile;
    } catch (error) {
      throw new InternalServerError(
        "An error occurred while interacting with the downloadFiles service." +
          error
      );
    }
    // finally {
    //   await sftp.end();
    //   console.log("Disconnect SFTP");
    // }
  }

  async deleteFiles(path: string): Promise<any> {
    try {
      const deleteFile = await sftp.delete(path);
      console.log(path, "File deleted", deleteFile);

      return deleteFile;
    } catch (error) {
      throw new InternalServerError(
        "An error occurred while interacting with the deleteFiles service." +
          error
      );
    }
  }
}
