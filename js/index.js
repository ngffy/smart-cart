function populateListElement(data) {
	itemList = document.getElementById("item-list")

	for (const item of data) {
		li = document.createElement('li')
		li.textContent = item["itemName"] + " (" + item["unitQuantity"] + ")"
		itemList.appendChild(li)
	}
}

function populateList() {
	fetch("./js/list.json")
	.then(response => response.json())
	.then(jsonObject => populateListElement(jsonObject))
}

function getItems() {
	fetch("./js/items.json")
	.then(response => response.json())
	.then(jsonObject => console.log(jsonObject))
}

populateList()
