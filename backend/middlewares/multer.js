import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("file");

export const multipleUpload = multer({ storage }).array("files");


export default singleUpload;