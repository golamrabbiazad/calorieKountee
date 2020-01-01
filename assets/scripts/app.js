// Storage Controller
const StorageCtrl = (() => {
    // Public Methods
    return {
        storeItem: item => {
            let items;
            // Check if any items in localstorage
            if (localStorage.getItem('items') === null) {
                items = [];
                // Push new items
                items.push(item);
                // Set Localstorage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                // Push new items
                items.push(item);

                // Reset localstorage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemFromStorage: () => {
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: updateItem => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (updateItem.id === item.id) {
                    items.splice(index, 1, updateItem);
                }
            })

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: id => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            })

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (() => {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    // Public Method
    return {
        addItem: (name, calories) => {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            let newItem = new Item(ID, name, calories);

            // Add to items Array
            data.items.push(newItem);

            return newItem;
        },
        getItems: () => {
            return data.items;
        },
        getItemsById: id => {
            let found = null;
            // Loop through items
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: (name, calories) => {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: id => {
            // Get ids
            let ids;
            ids = data.items.map(item => {
                return item.id;
            })

            // Get index
            const index = ids.indexOf(id);

            // Remove items
            data.items.splice(index, 1);
        },
        clearAllItems: () => {
            data.items = [];
        },
        setCurrentItem: item => {
            data.currentItem = item;
        },
        getCurrentItem: () => {
            return data.currentItem;
        },
        getTotalCalories: () => {
            let total = 0;
            // Loop through items and add cals
            data.items.forEach(item => {
                total += item.calories;
            });
            // Set total Cal in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        },
        logData: () => {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (() => {
    const UISelector = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        listItems: '#item-list li',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }


    // Public Method
    return {
        populateItemList: items => {
            let html = '';

            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>
                `;
            })

            // Insert list items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: item => {
            // Show the list
            document.querySelector(UISelector.itemList).style.display = 'block';

            // Create li element
            const li = document.createElement('li');
            // Add Class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // Insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: item => {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(items => {
                const itemID = items.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            })
        },
        deleteListItem: id => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: () => {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: () => {
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        reomoveItems: () => {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Turn Node list into Array
            listItems = Array.from(listItems);
            listItems.forEach(item => {
                item.remove();
            })
        },
        hideList: () => {
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showTotalCalories: totalCalories => {
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        showEditState: () => {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        getSelectors: () => {
            return UISelector;
        }
    }
})();

// App Controller
const AppCtrl = ((ItemCtrl, UICtrl, StorageCtrl) => {
    // Load event listeners
    const loadEventListeners = () => {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UICtrl.getSelectors().addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        // clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item Submit
    const itemAddSubmit = (e) => {
        // Get form input form UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and calories input
        if (input.name === '' && input.calories === '') {
            alert("Enter Meal Name & Calories!!!");
            // Modal Pop-up
            /*
            document.querySelector('.modal-trigger').addEventListener('click', popUpModal);

            function popUpModal(e) {
                e.preventDefault();
                const modalContent = document.createElement('div');

                modalContent.className = 'modal-content';
                modalContent.innerHTML = `
                        < h5 > Please, Enter Meal Name and Calories!!!</h5 >
                            <div class="modal-footer">
                                <a href="#!" class="modal-action modal-close waves-effect waves-red btn red lighten-1">
                                    Close
                    </a>
                            </div>
                    `;
                document.querySelector('.modal').insertAdjacentElement('beforeend', modalContent);
            }
            */
        } else if (input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to the UI list
            UICtrl.addListItem(newItem);

            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // store in localstorage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = e => {
        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item - 0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');

            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemsById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

    }

    // Update item submit
    const itemUpdateSubmit = e => {
        e.preventDefault();

        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        // Clear Edit State
        UICtrl.clearEditState();
    }

    // Delete item submit
    const itemDeleteSubmit = e => {
        e.preventDefault();

        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from localstorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
    }

    // clear item events
    const clearAllItemsClick = () => {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        // Remove from UI
        UICtrl.reomoveItems();

        // Clear items from local storage
        StorageCtrl.clearItemsFromStorage();

        // Hide ul
        UICtrl.hideList();

    }


    // Public Methods
    return {
        init: () => {
            // Clear edit state / set initial set
            UICtrl.clearEditState();

            // Fetch items from data strcuture
            const items = ItemCtrl.getItems();

            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            // Populate list with items
            UICtrl.populateItemList(items);

            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event Listeners
            loadEventListeners();
        }

    }
})(ItemCtrl, UICtrl, StorageCtrl);

AppCtrl.init();