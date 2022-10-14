class ShoppingCart {
	constructor() {
		this.items = {}
		this.coupons = {}
		this.total = 0
		this.aisle = null

		let fetchList = fetch("./js/list.json")
			.then(response => response.json())
			.then(jsonObject => {
				this.userList = jsonObject
			})

		let fetchItems = fetch("./js/items.json")
			.then(response => response.json())
			.then(jsonObject => {
				this.storeItems = jsonObject
			})

		let fetchCoupons = fetch("./js/coupons.json")
			.then(response => response.json())
			.then(jsonObject => {
				this.storeCoupons = jsonObject
			})
		let fetchSimulate = fetch("./js/simulate.json")
			.then(response => response.json())
			.then(jsonObject => {
				this.simulation = jsonObject
			})

		Promise.all([fetchList, fetchItems, fetchCoupons, fetchSimulate])
			.then(values => {
				this.updateUI()
			})
	}

	addToCart(itemName, quantity) {
		if (itemName in this.items) {
			this.items[itemName]["quantity"] += quantity
		} else {
			let price = this.storeItems[itemName]["unitPrice"]
			this.items[itemName] = {"quantity": quantity, "unitPrice": price}
		}

		this.updateUI()
	}

	removeFromCart(itemName, quantity) {
		if (itemName in this.items) {
			this.items[itemName]["quantity"] -= quantity
		}

		if (this.items[itemName]["quantity"] <= 0) {
			delete this.items[itemName]
		}

		this.updateUI()
	}

	updateTotal() {
		this.total = 0
		for (const item in this.items) {
			let unitPrice = this.items[item]["unitPrice"]
			let quantity = this.items[item]["quantity"]
			this.total += unitPrice * quantity

			if (item in this.coupons) {
				this.total -= this.coupons[item]['discount'] * quantity
			}
		}

		let cartTotal = document.getElementById("cart-total")
		cartTotal.innerHTML = "$" + this.total.toFixed(2)
	}

	applyCoupon(itemName) {
		if (itemName in this.items) {
			this.coupons[itemName] = this.storeCoupons[itemName]
		}

		this.updateUI()
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

	payClick() {
		this.items = {}
		this.coupons = {}
		this.total = 0

		this.updateUI()
	}

	aisleClick(aisle) {
		if (this.aisle !== null) {
			document.getElementById("aisle-" + this.aisle).setAttribute("fill", "#A5FFD6");
		}

		if (aisle !== null) {
			document.getElementById("aisle-" + aisle).setAttribute("fill", "#B5B1B2");
		}

		this.aisle = aisle
		this.updateUI()
	}

	updateUserList() {
		let itemList = document.getElementById("item-list")

		// clear list
		itemList.innerHTML = ""

		for (const item in this.userList) {
			let li = document.createElement('li')
			let unit = this.userList[item]["unit"]
			let listQuantity = this.userList[item]["unitQuantity"]
			let cartQuantity = 0

			if (item in this.items) {
				cartQuantity = this.items[item]["quantity"]
			}

			li.textContent = item + " (" + listQuantity + " " + unit +  ")"

			if (listQuantity <= cartQuantity) {
				li.classList.add('gotten')
			}

			let itemLocation = this.storeItems[item]["location"]
			if (this.aisle === null || this.aisle === itemLocation) {
				itemList.appendChild(li)
			}
		}

		let itemHeader = document.getElementById("item-header")
		if (this.aisle === null) {
			itemHeader.innerHTML = "All Items"
		} else if (isFinite(this.aisle)) {
			itemHeader.innerHTML = "Aisle " + this.aisle + " Items"
		} else {
			itemHeader.innerHTML = this.aisle[0].toUpperCase() + this.aisle.substr(1) + " Items"
		}
	}

	updateCartList() {
		let cartList = document.getElementById("cart-list")

		// clear list
		cartList.innerHTML = ""

		for (const item in this.items) {
			let li = document.createElement('li')
			let price = this.items[item]["unitPrice"]
			let cartQuantity = this.items[item]["quantity"]
			li.textContent = item + " (" + cartQuantity + " @ $" + price.toFixed(2) +  ")"
			cartList.appendChild(li)

			if (item in this.coupons) {
				let li = document.createElement('li')
				let discount = this.coupons[item]["discount"]
				li.textContent = "$" + discount.toFixed(2) + " off x" + cartQuantity
				li.classList.add('clipped-coupon')
				cartList.appendChild(li)
			}
		}
	}

	updateCouponList() {
		let couponList = document.getElementById("coupon-list")

		// clear list
		couponList.innerHTML = ""

		for (const item in this.storeCoupons) {
			let li = document.createElement('li')
			let discount = this.storeCoupons[item]['discount']

			li.textContent = "$" + discount.toFixed(2) + " off " + item
			li.onclick = this.applyCoupon.bind(this, item)
			li.classList.add('coupon')

			if (item in this.coupons) {
				li.classList.add('clicked-coupon')
			} else {
				li.classList.add('coupon')
			}

			let itemLocation = this.storeItems[item]["location"]
			if (this.aisle === null || this.aisle === itemLocation) {
				couponList.appendChild(li)
			}
		}

		let couponHeader = document.getElementById("coupon-header")
		if (this.aisle === null) {
			couponHeader.innerHTML = "All Coupons"
		} else if (isFinite(this.aisle)) {
			couponHeader.innerHTML = "Aisle " + this.aisle + " Coupons"
		} else {
			couponHeader.innerHTML = this.aisle[0].toUpperCase() + this.aisle.substr(1) + " Coupons"
		}
	}

	updateUI() {
		this.updateCartList()
		this.updateCouponList()
		this.updateUserList()
		this.updateTotal()
	}

	async simulate() {
		for (let action of this.simulation) {
			if (action.action === "view") {
				this.aisleClick(action.aisle)
			} else if (action.action === "add") {
				this.addToCart(action.itemName, action.quantity)
			} else if (action.action === "remove") {
				this.removeFromCart(action.itemName, action.quantity)
			} else if (action.action === "apply coupon") {
				this.applyCoupon(action.itemName)
			} else if (action.action === "checkout") {
				this.payClick()
			}

			await new Promise(resolve => setTimeout(resolve, 2000))
		}
	}
}

let userCart = new ShoppingCart()
userCart.updateUI()
