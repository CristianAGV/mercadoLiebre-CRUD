const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const { validationResult } = require('express-validator')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
let calcIndex = () => {
	let highest = 0
	products.forEach(product => {
		if(product.id > highest) {
			highest = product.id
		}
	});
	return highest + 1
}
let calcDiscount = (price, discount) => {
	return price - Math.floor((price*discount / 100))
}
const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', { products, toThousand, calcDiscount })
		// Do the magic
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let id = req.params.id
		let productFound = products.filter(product => product.id == id)
		res.render('detail', { productFound, toThousand, calcDiscount })
		// Do the magic
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
		// Do the magic
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let info = req.body
		let errors = validationResult(req)
		if(errors.isEmpty()) {
			let product = {
				id: calcIndex(),
				...info,
				image: req.file.filename
				
			}
			products.push(product)
			let jsonProducts = JSON.stringify(products, null, 4)
			fs.writeFileSync(productsFilePath, jsonProducts)
			res.redirect(`/products/${product.id}`)

		} else {
			res.render('product-create-form', { errors: errors.array(), old: req.body })
			console.log(errors)
		}
		
		// Do the magic
	},

	// Update - Form to edit
	edit: (req, res) => {
		let id = req.params.id
		let product = products.filter(product => product.id == id)
		res.render('product-edit-form', { product })
		// Do the magic
	},
	// Update - Method to update
	update: (req, res) => {
		let info = req.body
		let productToChange = products.findIndex(product => product.id == req.params.id)
		let updatedProduct = {
			id: Number(req.params.id),
			...info,
			image: products[productToChange].image
			
		}
		
		products[productToChange] = updatedProduct
		let jsonProducts = JSON.stringify(products, null, 4)
		fs.writeFileSync(productsFilePath, jsonProducts)
		
		res.redirect('/')
		// Do the magic
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let id = req.params.id
		let productToDelete = products.findIndex(product => product.id == id)
		products.splice(productToDelete, 1)
		
		let jsonProducts = JSON.stringify(products, null, 4)
		fs.writeFileSync(productsFilePath, jsonProducts)
		res.redirect('/')
		// Do the magic
	}
};

module.exports = controller;