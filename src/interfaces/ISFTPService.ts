import { SFTPCreateConnectionService } from "../types/SFTPService";

export interface ISFTPService {
  createSFTPConnection(
    connectionData: SFTPCreateConnectionService
  ): Promise<any>;

  downloadFiles(path: string, selectedFileType: string): Promise<string[]>;

  deleteFiles(path: string): Promise<any>;
}
