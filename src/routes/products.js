// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const { body } = require('express-validator')
// ************ Controller Require ************
const productsController = require('../controllers/productsController');



let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.resolve(__dirname, '../../public/images/products'))
    },
    filename: (req,file,cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let createProductValidations = [
    body('name').trim().notEmpty().withMessage('Debes ponerle un nombre valido al producto'),

    body('price').toInt().notEmpty().withMessage('El producto debe tener precio'),

    body('discount').toInt().notEmpty().withMessage('Si no tiene descuento debes poner 0'),


    body('description').trim().replace(/(\r\n|\n|\r)/gm, "").notEmpty().withMessage('El producto debe tener una breve descripcion').bail()
    .isLength({min: 10}).withMessage('Debe tener minimo 10 caracteres la descripcion'),

    body('productImage').custom((value, { req }) => {
        let file = req.file
        let acceptedExtensions = ['.png', '.jpg']
        

        if(!file) {
            throw new Error('Debes subir la imagen del producto')
        } else {
            let fileExtension = path.extname(file.originalname)
            if(!acceptedExtensions.includes(fileExtension)) {
                throw new Error(`Solo se aceptan imagenes en formato ${acceptedExtensions.join(", ")}`)
            }
        }

        return true
    })
]

let upload = multer({ storage })

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/', upload.single('productImage'), createProductValidations, productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/:id/edit', productsController.edit); 
router.put('/:id', productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;
