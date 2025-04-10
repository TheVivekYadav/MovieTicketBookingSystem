import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(nulll, "./public/images");
  },
  filename: function(req , file, cb){
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.filedname + "-" + uniqueSuffix);
  },
});

export const upload = multer({
  storage: storage,
  limit: {
    filesize: 1 * 1000 * 1000
  },
});
