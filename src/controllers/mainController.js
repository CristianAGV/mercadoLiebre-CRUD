const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
let calcDiscount = (price, discount) => {
	return price - Math.floor((price*discount / 100))
}
const controller = {
	index: (req, res) => {
		let visited = products.filter(product => product.category === 'visited')
		let inSale = products.filter(product => product.category === 'in-sale')
		res.render('index', { inSale, visited, toThousand, calcDiscount })
		// Do the magic
	},
	search: (req, res) => {
		// Do the magic
	},
	
};

module.exports = controller;
