export class Upload {
  $key: string;
  file: File;
  name: string;
  url: string;
  type: string;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}
export class uploadFileModel {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  type: string;
  createdAt: Date = new Date();
}
