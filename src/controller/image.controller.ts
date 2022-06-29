import { Request, Response } from "express";
import multer from "multer";
import { extname } from "path";

export const Upload = async (req: Request, res: Response) => {

    const storage = multer.diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const randomName = Math.random().toString(20).substring(2, 12)
          cb(null,`${ randomName }${ extname(file.originalname ) }`)
        }
    })

    const upload = multer({ storage }).single('image')

    upload(req, res, (err) => {

        if (err) {
            return res.status(400).send(err)
        }
        res.send({
            url: `http://localhost:8000/api/uploads/${ req.file.filename }`
        })
    })
    
}