export class UploadedFile {
    
  displayName: string;
  filename: string;
  mimeType: string;
  path: string;
  size: number;
  thumbUrl: string;
  url: string;
  type: string;

  constructor(options: {
      displayName: string,
      filename: string,
      mimeType: string,
      path: string,
      size: number,
      thumbUrl: string,
      url: string,
      type: string
  }){
      this.displayName = options.displayName;
      this.filename = options.filename;
      this.mimeType = options.mimeType;
      this.path = options.path;
      this.size = options.size;
      this.thumbUrl = options.thumbUrl;
      this.url = options.url;
      this.type = options.type;
  }

}
