class ShoppingList {
	constructor() {
		fetch("./js/list.json")
			.then(response => response.json())
			.then(jsonObject => {
				this.items = jsonObject
				this.populateListElement()
			})
	}

	populateListElement() {
		let itemList = document.getElementById("item-list")

		// clear list
		itemList.innerHTML = ""

		for (const item in this.items) {
			let li = document.createElement('li')
			let unit = this.items[item]["unit"]
			let quantity = this.items[item]["unitQuantity"]
			li.textContent = item + " (" + quantity + " " + unit +  ")"
			itemList.appendChild(li)
		}
	}
}

class StoreItems {
	constructor() {
		fetch("./js/items.json")
			.then(response => response.json())
			.then(jsonObject => {
				this.items = jsonObject
			})
	}
}

class ShoppingCart {
	constructor() {
		this.items = {}
		this.total = 0
	}

	addToCart(itemName, quantity) {
		if (itemName in this.items) {
			this.items[itemName] += quantity
		} else {
			this.items[itemName] = quantity
		}

		this.updateTotal()
	}

	removeFromCart(itemName, quantity) {
		if (itemName in this.items) {
			this.items[itemName] -= quantity
		}

		if (this.items[itemName] <= 0) {
			delete this.items[itemName]
		}

		this.updateTotal()
	}

	updateTotal() {
		this.total = 0
		for (item in this.items) {
			this.total += this.items[item]
		}
	}
}

function addToCartClick(cart) {
	itemName = document.getElementById("item-name").value
	quantity = Number(document.getElementById("item-quantity").value)

	cart.addToCart(itemName, quantity)
}

let storeItems = new StoreItems()
let userList = new ShoppingList()
