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
		this.storeItems = new StoreItems()
		this.userList = new ShoppingList()

		this.items = {}
		this.total = 0
	}

	addToCart(itemName, quantity) {
		if (itemName in this.items) {
			this.items[itemName]["quantity"] += quantity
		} else {
			let price = this.storeItems.items[itemName]["unitPrice"]
			this.items[itemName] = {"quantity": quantity, "unitPrice": price}
		}

		this.updateTotal()
		this.updateUI()
	}

	removeFromCart(itemName, quantity) {
		if (itemName in this.items) {
			this.items[itemName]["quantity"] -= quantity
		}

		if (this.items[itemName]["quantity"] <= 0) {
			delete this.items[itemName]
		}

		this.updateTotal()
		this.updateUI()
	}

	updateTotal() {
		this.total = 0
		for (const item in this.items) {
			let unitPrice = this.items[item]["unitPrice"]
			let quantity = this.items[item]["quantity"]
			this.total += unitPrice * quantity
		}
	}

	addToCartClick() {
		let itemName = document.getElementById("item-name").value
		let quantity = Number(document.getElementById("item-quantity").value)

		this.addToCart(itemName, quantity)
	}

	removeFromCartClick() {
		let itemName = document.getElementById("item-name").value
		let quantity = Number(document.getElementById("item-quantity").value)

		this.removeFromCart(itemName, quantity)
	}

	updateUI() {
		let cartList = document.getElementById("cart-list")

		// clear list
		cartList.innerHTML = ""

		for (const item in this.items) {
			let li = document.createElement('li')
			let price = this.items[item]["unitPrice"]
			let cartQuantity = this.items[item]["quantity"]
			li.textContent = item + " (" + cartQuantity + " @ $" + price +  ")"
			cartList.appendChild(li)
		}

		let cartTotal = document.getElementById("cart-total")
		cartTotal.innerHTML = "$" + this.total.toFixed(2)

		let itemList = document.getElementById("item-list")

		// clear list
		itemList.innerHTML = ""

		for (const item in this.userList.items) {
			let li = document.createElement('li')
			let unit = this.userList.items[item]["unit"]
			let listQuantity = this.userList.items[item]["unitQuantity"]
			let cartQuantity = 0

			if (item in this.items) {
				cartQuantity = this.items[item]["quantity"]
			}

			li.textContent = item + " (" + listQuantity + " " + unit +  ")"

			if (listQuantity <= cartQuantity) {
				li.classList.add('gotten')
			}

			itemList.appendChild(li)
		}
	}
}

let userCart = new ShoppingCart()
