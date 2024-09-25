// Shopping Cart Implementation  JavaScript

// Initialize an empty array to represent the shopping cart
let cart = [];

/**
 * Function to add an item to the cart.
 */
const addItemToCart = (productId, productName, quantity, price) => {
    const product = { productId, productName, quantity, price }; // Create a product object
    cart.push(product); // Add the product to the cart
    console.log(`${productName} added to the cart`); // Log statement
};




/**
 * Function to remove an item from the cart by its productId.
 */
const removeItemFromCart = (productId) => {
    const index = cart.findIndex(product => product.productId === productId); // Find index
    if (index !== -1) {
        const removedProduct = cart.splice(index, 1); // Remove product
        console.log(`${removedProduct[0].productName} removed from the cart`); // Log statement
    } else {
        console.log(`Product with ID ${productId} not found in the cart`); // Log statement
    }
};


/**
 * Function to update the quantity of a product in the cart.
 */
const updateItemQuantity = (productId, newQuantity) => {
    cart = cart.map(product =>
        product.productId === productId ? { ...product, quantity: newQuantity } : product
    );
    console.log(`Quantity updated for product with ID ${productId}`); // Log statement
};



/**
 * Function to calculate the total cost of the items in the cart.
 */
const calculateTotalCost = () => {
    const totalCost = cart.reduce((total, product) => total + (product.quantity * product.price), 0);
    console.log(`Total Cost: ${totalCost}`); // Log statement
    return totalCost;
};



/**
 * Function to display a summary of the items in the cart.
 */
const displayCartSummary = () => {
    const summary = cart
        .filter(product => product.quantity > 0) // Filter out zero quantity
        .map(product => `Product: ${product.productName}, Quantity: ${product.quantity}, Total Price: ${product.quantity * product.price}`);

    console.log("Cart Summary:"); // Log statement
    summary.forEach(item => console.log(item)); // Log each item
    return summary;
};

 

/**
 * Optional Bonus: Function to apply a discount to the total cost based on a discount code.
 */
const applyDiscount = (discountCode) => {
    let discountPercentage = 0;
    
    if (discountCode === 'DISCOUNT10') discountPercentage = 10; // 10% discount
    else if (discountCode === 'DISCOUNT20') discountPercentage = 20; // 20% discount

    const totalCost = calculateTotalCost(); // Current total cost
    const discountedTotal = totalCost - (totalCost * (discountPercentage / 100)); // Apply discount
    console.log(`Total after applying discount: ${discountedTotal}`); // Log statement
    return discountedTotal;
};

 

               //checking working of code
//  Adding products to the cart
addItemToCart(1, 'Lipstick', 1, 25);          // 1 lipstick at $25
addItemToCart(2, 'Moisturizer', 1, 30);      // 1 moisturizer at $30
addItemToCart(3, 'Foundation', 1, 40);        // 1 foundation at $40
addItemToCart(4, 'Mascara', 1, 20);           // 1 mascara at $20
addItemToCart(5, 'Nail Polish', 2, 15);       // 2 nail polishes at $15 each
addItemToCart(6, 'Eyeshadow Palette', 1, 35); // 1 eyeshadow palette at $35
addItemToCart(7, 'Perfume', 1, 50);           // 1 perfume at $50
// Removing items from the cart
removeItemFromCart(2); // Removes Moisturizer
removeItemFromCart(4); // Removes Mascara
removeItemFromCart(5); // Removes Nail Polish
// Updating quantities of products in the cart
updateItemQuantity(1, 5); // Update Lipstick to 5 units
updateItemQuantity(3, 2); // Update Foundation to 2 units
updateItemQuantity(6, 3); // Update Eyeshadow Palette to 3 units
updateItemQuantity(7, 1); // Update Perfume to 1 unit
//  Calculating total cost
calculateTotalCost();
/**Displaying the cart summary*/
displayCartSummary();/**Applying a discount*/
applyDiscount('DISCOUNT10');