// Vehicle configurations
const vehicles = {
    bike: {
        name: 'Delivery Bike',
        basePrice: 200,
        pricePerKm: 12,
        image: '<i class="fas fa-motorcycle"></i>', // Font Awesome Motorcycle icon
        maxWeight: "20kg",
        estimatedSpeed: 35,
        dimensions: "40x40x40cm"
    },
    van: {
        name: 'Delivery Van',
        basePrice: 500,
        pricePerKm: 15,
        image: '<i class="fas fa-shuttle-van"></i>', // Font Awesome Van icon
        maxWeight: "100kg",
        estimatedSpeed: 50,
        dimensions: "4.5 x 4.5 x 4.5ft"
    },
    pickup: {
        name: 'Pickup',
        basePrice: 1000,
        pricePerKm: 17,
        image: '<i class="fas fa-truck-pickup"></i>', // Font Awesome Pickup Truck icon
        maxWeight: "250kg",
        estimatedSpeed: 50,
        dimensions: "7 x 4.5 x 4.5ft"
    },
    miniTruck: {
        name: 'Mini Truck',
        basePrice: 5000,
        pricePerKm: 20,
        image: '<i class="fas fa-truck"></i>', // Font Awesome Truck icon
        maxWeight: "500kg",
        estimatedSpeed: 45,
        dimensions: "9.5 x 5.5 x 4.5ft"
    },
    largeTruck: {
        name: 'Large Truck',
        basePrice: 10000,
        pricePerKm: 23,
        image: '<i class="fas fa-truck-moving"></i>', // Font Awesome Box icon for cargo
        maxWeight: "1000kg",
        estimatedSpeed: 40,
        dimensions: "14 x 6 x 6ft"
    },
    Cargo: {
        name: 'Cargo',
        basePrice: 50000,
        pricePerKm: 26,
        
        image: '<i class="fas fa-ship"></i>', // Font Awesome Ship icon
        maxWeight: "5000kg",
        estimatedSpeed: 100,
        dimensions: "20 x 10 x 10ft"
    }
};


// Priority multipliers
const priorityMultipliers = {
    standard: 1,
    express: 1.5,
    sameDay: 2
};

// Parcel type multipliers
const parcelTypeMultipliers = {
    normal: 1,
    fragile: 1.2,
    perishable: 1.4
};

// Global state
let currentStep = 0;
let selectedVehicle = null;
let calculatedRoute = null;
let isOrderPlacing = false;

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    initializeSteps();
    initializeVehicles();
    setupEventListeners();
});

// Function to initialize the steps
function initializeSteps() {
    try {
        const steps = document.querySelectorAll('.step');
        const stepContents = document.querySelectorAll('.step-content');
        
        if (steps.length > 0 && stepContents.length > 0) {
            steps[0].classList.add('active');
            stepContents[0].classList.add('active');
            console.log('Steps initialized successfully');
        } else {
            console.error('Step elements not found');
        }
    } catch (error) {
        console.error('Error initializing steps:', error);
    }
}

// Function to initialize the vehicles
function initializeVehicles() {
    try {
        const vehicleOptions = document.getElementById('vehicleOptions');
        if (!vehicleOptions) {
            console.error('Vehicle options container not found');
            return;
        }

        vehicleOptions.innerHTML = '';

        Object.entries(vehicles).forEach(([id, vehicle]) => {
            const card = createVehicleCard(id, vehicle);
            vehicleOptions.appendChild(card);
        });

        console.log('Vehicles initialized successfully');
    } catch (error) {
        console.error('Error initializing vehicles:', error);
    }
}

// Function to create a vehicle card
function createVehicleCard(id, vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.innerHTML = `
        <div class="vehicle-info">
            <span style="font-weight: bold;margin-left: 3px, font-size: large">${vehicle.image} ${vehicle.name}</span>
            <span>₹${vehicle.basePrice}</span>
        </div>
        <div> <b>Price per km:</b> ₹${vehicle.pricePerKm}</div>
        <div><b>Weight limit:</b> ₹${vehicle.maxWeight}</div>
         <div> <b>Dimensions limit:</b> ${vehicle.dimensions}</div>
    `;
    card.onclick = () => selectVehicle(id, card);
    return card;
}

// Function to set up event listeners
function setupEventListeners() {
    try {
        // Navigation buttons
        const nextButtons = document.querySelectorAll('.next-step');
        if (nextButtons.length > 0) {
            nextButtons.forEach(button => {
                button.addEventListener('click', nextStep);
            });
        } else {
            console.error('Next step buttons not found');
        }

        const prevButtons = document.querySelectorAll('.prev-step');
        if (prevButtons.length > 0) {
            prevButtons.forEach(button => {
                button.addEventListener('click', prevStep);
            });
        } else {
            console.error('Previous step buttons not found');
        }

        // Add location button
        const addLocationBtn = document.getElementById('addLocation');
        if (addLocationBtn) {
            addLocationBtn.addEventListener('click', addLocationField);
        } else {
            console.error('Add location button not found');
        }

        // Use current location button
        const useCurrentLocationBtn = document.querySelector('.use-current-location');
        if (useCurrentLocationBtn) {
            useCurrentLocationBtn.addEventListener('click', useCurrentLocation);
        } else {
            console.error('Use current location button not found');
        }

        // Place order button
        const placeOrderBtn = document.getElementById('placeOrder');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', placeOrder);
        } else {
            console.error('Place order button not found');
        }

        console.log('Event listeners setup completed successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Function to select a vehicle
function selectVehicle(id, card) {
    document.querySelectorAll('.vehicle-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedVehicle = { ...vehicles[id], id };
    console.log('Vehicle selected:', selectedVehicle.name);
}

// Function to go to the next step
async function nextStep() {
    if (currentStep < 3) {
        if (await validateStep(currentStep)) {
            if (currentStep === 1) {
                const routeCalculated = await calculateRoute();
                if (!routeCalculated) {
                    alert('Failed to calculate route. Please check your locations and try again.');
                    return;
                }
            }
            
            updateStepDisplay(currentStep + 1);
            currentStep++;
        }
    }
}

// Function to go to the previous step
function prevStep() {
    if (currentStep > 0) {
        updateStepDisplay(currentStep - 1);
        currentStep--;
    }
}

// Function to update the step display
function updateStepDisplay(newStep) {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');

    // Hide current step
    steps[currentStep].classList.remove('active');
    stepContents[currentStep].classList.remove('active');
    
    // Show new step
    steps[newStep].classList.add('active');
    stepContents[newStep].classList.add('active');

    // Update step-specific content
    try {
        if (newStep === 2) {
            displayRouteDetails();
        } else if (newStep === 3) {
            calculatePrice();
        }
    } catch (error) {
        console.error('Error updating step-specific content:', error);
    }
}

// Function to validate a specific step
async function validateStep(step) {
    switch (step) {
        case 0:
            return validateOrderDetails();
        case 1:
            return validateVehicleSelection();
        case 2:
            return validateRouteDetails();
        case 3:
            return validatePriceSummary();
        default:
            return true;
    }
}

// Function to validate order details
function validateOrderDetails() {
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropLocations = document.querySelectorAll('.dropLocation');
    const priority = document.getElementById('priority').value;
    const parcelType = document.getElementById('parcelType').value;

    if (!pickupLocation || !priority || !parcelType) {
        alert('Please fill in all required fields');
        return false;
    }

    for (let location of dropLocations) {
        if (!location.value) {
            alert('Please fill in all drop locations');
            return false;
        }
    }

    return true;
}

// Function to validate vehicle selection
function validateVehicleSelection() {
    if (!selectedVehicle) {
        alert('Please select a vehicle');
        return false;
    }
    return true;
}

// Function to validate route details
function validateRouteDetails() {
    if (!calculatedRoute || !calculatedRoute.route) {
        alert('Route calculation failed. Please try again.');
        return false;
    }
    return true;
}

// Function to validate price summary
function validatePriceSummary() {
    const totalPrice = document.getElementById('totalPrice');
    if (!totalPrice || !totalPrice.textContent || totalPrice.textContent === '₹0.00') {
        alert('Price calculation failed. Please try again.');
        return false;
    }
    return true;
}

// Function to add a new location field
function addLocationField() {
    const dropLocations = document.getElementById('dropLocations');
    const locationInput = document.createElement('div');
    locationInput.className = 'location-input';
    locationInput.innerHTML = `
        <input type="text" class="dropLocation" required>
        <button type="button" class="remove-location">Remove</button>
    `;

    locationInput.querySelector('.remove-location').addEventListener('click', () => {
        locationInput.remove();
        if (calculatedRoute) {
            calculateRoute();
        }
    });

    dropLocations.appendChild(locationInput);
}

// Function to use the user's current location
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;

                // Nominatim Reverse Geocoding API URL
                const nominatimAPI = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                try {
                    const response = await fetch(nominatimAPI);
                    const data = await response.json();

                    if (data && data.display_name) {
                        // Extract the location name
                        const locationName = data.display_name;
                        document.getElementById('pickupLocation').value = locationName;
                    } else {
                        alert('Failed to fetch location name. Please enter location manually.');
                    }
                } catch (error) {
                    console.error('Error during reverse geocoding:', error);
                    alert('Failed to fetch location name. Please enter location manually.');
                }
            },
            error => {
                console.error('Geolocation error:', error);
                alert('Failed to get current location. Please enter location manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter location manually.');
    }
}


// Function to calculate the route
async function calculateRoute() {
    alert('Calculating route distance, please be patient...');
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropLocations = [...document.querySelectorAll('.dropLocation')].map(input => input.value);
    const locations = [pickupLocation, ...dropLocations];

    if (!locations.every(location => location && location.trim())) {
        console.error('Invalid locations provided');
        return false;
    }

    try {
        const waypoints = await Promise.all(locations.map(loc => getLatLngFromLocation(loc)));
        console.log('Waypoints calculated:', waypoints);

        let totalDistance = 0;
        for (let i = 0; i < waypoints.length - 1; i++) {
            const [lat1, lon1] = waypoints[i];
            const [lat2, lon2] = waypoints[i + 1];
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            totalDistance += R * c;
        }

        totalDistance += 330; // Add fixed distance for local routing

        calculatedRoute = {
            route: locations,
            totalDistance: totalDistance,
            waypoints: waypoints
        };

        console.log('Route calculated:', calculatedRoute);
        return true;
    } catch (error) {
        console.error('Error calculating route:', error);
        alert('Error calculating route. Please check your locations and try again.');
        return false;
    }
}

// Function to get latitude and longitude from a location
async function getLatLngFromLocation(location) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        const data = await response.json();

        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error getting coordinates:', error);
        throw new Error('Failed to get coordinates for location: ' + location);
    }
}

// Function to display the route details
function displayRouteDetails() {
    if (!calculatedRoute || !calculatedRoute.route) {
        console.error('No route data available');
        return;
    }

    const routeDetails = document.getElementById('routeDetails');
    if (!routeDetails) {
        console.error('Route details element not found');
        return;
    }

    try {
        const routes = calculatedRoute.route.map((location, index) => {
            return `
                <div class="route-item">
                    <span style="margin-right:20px"> <strong>${index === 0 ? 'Pickup' : `Stop ${index}`}: </strong></span>
                    <span>${location}</span>
                </div>
            `;
        }).join('');

        routeDetails.innerHTML = `
            ${routes}
            <div class="route-item">
                <span><strong>Total Distance:</strong></span>
                <span><strong>${calculatedRoute.totalDistance.toFixed(2)} km </strong></span>
            </div>
        `;
        console.log('Route details displayed successfully');
    } catch (error) {
        console.error('Error displaying route details:', error);
    }
}

// Function to calculate the price
function calculatePrice() {
    if (!selectedVehicle || !calculatedRoute) {
        console.error('Missing vehicle or route data');
        return null;
    }
    
    const priority = document.getElementById('priority').value;
    const parcelType = document.getElementById('parcelType').value;
    const dropLocations = document.querySelectorAll('.dropLocation').length;

    const basePrice = selectedVehicle.basePrice;
    const distanceCharge = calculatedRoute.totalDistance * selectedVehicle.pricePerKm;
    const priorityCharge = (basePrice + distanceCharge) * (priorityMultipliers[priority] - 1);
    const parcelTypeCharge = (basePrice + distanceCharge) * (parcelTypeMultipliers[parcelType] - 1);
    const multiStopCharge = dropLocations > 1 ? (dropLocations - 1) * 100 : 0;

    const totalPrice1 = basePrice + distanceCharge + priorityCharge + parcelTypeCharge + multiStopCharge;

    // Calculate GST at 18%
    const totalWithoutGST = basePrice + distanceCharge + priorityCharge;
    const gst = totalWithoutGST * 0.18;
    const totalPrice = totalPrice1 + gst;

    // Ensure the values are valid numbers
    const roundedValues = {
        basePrice: isNaN(basePrice) ? 0 : Math.round(basePrice * 100) / 100,
        distanceCharge: isNaN(distanceCharge) ? 0 : Math.round(distanceCharge * 100) / 100,
        priorityCharge: isNaN(priorityCharge) ? 0 : Math.round(priorityCharge * 100) / 100,
        parcelTypeCharge: isNaN(parcelTypeCharge) ? 0 : Math.round(parcelTypeCharge * 100) / 100,
        multiStopCharge: isNaN(multiStopCharge) ? 0 : Math.round(multiStopCharge * 100) / 100,
        totalPrice1: isNaN(totalPrice1) ? 0 : Math.round(totalPrice1 * 100) / 100,
        gst: isNaN(gst) ? 0 : Math.round(gst * 100) / 100,
        totalPrice: isNaN(totalPrice) ? 0 : Math.round(totalPrice * 100) / 100
    };

    updatePriceSummary(roundedValues);
    return roundedValues;
}


// Function to update the price summary
function updatePriceSummary(prices) {
    const priceSummaryContainer = document.querySelector('.price-summary');
    if (!priceSummaryContainer) {
        console.error('Price summary container not found');
        return;
    }

    // Generate formatted price function
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price).replace('INR', '₹');
    };

    const estimatedDays = calculateEstimatedDays();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedDays);

    priceSummaryContainer.innerHTML = `
        <div class="price-item">
            <span><strong>Base Price:</strong></span>
            <span id="basePrice">${formatPrice(prices.basePrice)}</span>
        </div>
        <div class="price-item">
            <span><strong>Distance Charge: </strong></span>
            <span id="distanceCharge">${formatPrice(prices.distanceCharge)}</span>
        </div>
        <div class="price-item">
            <span><strong>Priority Charge: </strong></span>
            <span id="priorityCharge">${formatPrice(prices.priorityCharge)}</span>
        </div>
        <div class="price-item">
            <span><strong>GST (18%): </strong></span>
            <span id="gstCharge">${formatPrice(prices.gst)}</span>
        </div>
        <div class="price-item total">
            <span>Total Price:</span>
            <span id="totalPrice">${formatPrice(prices.totalPrice)}</span>
        </div>
        <div class="delivery-estimate">
            <span>Estimated Delivery Time:</span>
            <span id="estimatedDays">${estimatedDays} day${estimatedDays !== 1 ? 's' : ''}</span>
        </div>
        <div class="delivery-date" style="font-weight: bold; margin-top: 1rem;">
            <span>Expected Delivery Date:</span>
            <span>${estimatedDeliveryDate.toLocaleDateString()}</span>
        </div>
    `;

    console.log('Price summary updated successfully:', {
        base: formatPrice(prices.basePrice),
        distance: formatPrice(prices.distanceCharge),
        priority: formatPrice(prices.priorityCharge),
        gst: formatPrice(prices.gst),
        total: formatPrice(prices.totalPrice)
    });
}


// Functions for placing an order
function placeOrder() {
    if (isOrderPlacing) {
        console.log('Order already being processed');
        return;
    }

    try {
        isOrderPlacing = true;
        console.log("placing order");

        const prices = calculatePrice();
        if (!prices) {
            throw new Error('Failed to calculate prices');
        }

        const vehicleNumber = generateRandomVehicleNumber();
        const estimatedDays = calculateEstimatedDays();
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

        const orderDetails = {
            id: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            status: "payment_pending",
            paymentStatus: "pending", // Add payment status
            createdAt: new Date().toISOString(),
            expectedDelivery: deliveryDate.toISOString(),
            pickup: {
                address: document.getElementById('pickupLocation').value
            },
            delivery: {
                address: [...document.querySelectorAll('.dropLocation')].map(input => input.value)
            },
            currentLocation: {
                lastUpdated: new Date().toISOString()
            },
            timeline: [
                {
                    status: "Order Created",
                    location: document.getElementById('pickupLocation').value,
                    timestamp: new Date().toISOString()
                }
            ],
            vehicle: {
                type: selectedVehicle.name,
                number: vehicleNumber
            },
            package: {
                weight: "N/A",
                type: document.getElementById('parcelType').value
            },
            price: prices.totalPrice
        };

        // Store initial order in localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
        existingOrders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Show payment confirmation
        const confirmPayment = confirm(
            `Order created successfully!\nOrder ID: ${orderDetails.id}\n\nTotal Amount: ₹${prices.totalPrice}\n\nProceed to payment?`
        );

        if (confirmPayment) {
                // Update order with completed payment status
                orderDetails.paymentStatus = "completed";
                orderDetails.status = "order_placed";
                orderDetails.timeline.push({
                    status: "Payment Completed",
                    timestamp: new Date().toISOString()
                });
                
                // Update the order in localStorage
                const updatedOrders = existingOrders.map(order => 
                    order.id === orderDetails.id ? orderDetails : order
                );
                localStorage.setItem('orders', JSON.stringify(updatedOrders));
            initializePayment(orderDetails);
        } else {
            alert('You can complete the payment later from your Track Order page.');
        }

    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    } finally {
        isOrderPlacing = false;
    }
}

// Add this to your step validation
function validatePriceSummary() {
    const totalPrice = document.getElementById('totalPrice');
    if (!totalPrice || !totalPrice.textContent || totalPrice.textContent === '₹0.00') {
        alert('Price calculation failed. Please try again.');
        return false;
    }
    return true;
}


// Function to generate a random vehicle number
function generateRandomVehicleNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const randomLetters = Array.from({ length: 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
    const randomNumbers = Array.from({ length: 4 }, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
    console.log(`${randomLetters}-${randomNumbers}`);
    return `${randomLetters}-${randomNumbers}`;
}

// Function to calculate estimated days
function calculateEstimatedDays() {
    const priority = document.getElementById('priority').value;
    const distance = calculatedRoute.totalDistance;
    const speed = selectedVehicle.estimatedSpeed;

    const estimatedHours = distance / speed;
    let estimatedDays = Math.ceil(estimatedHours / 8); // Assuming 8 working hours per day

    if (priority === 'express') {
        estimatedDays = Math.max(1, Math.ceil(estimatedDays * 0.6));
    } else if (priority === 'sameDay') {
        estimatedDays = 0;
    }
     console.log(estimatedDays);
    return estimatedDays;
}


// Initialize payment modal with better structure and animations
function initializePayment(orderDetails) {
    const modalHTML = `
       <div class="payment-modal">
    <div class="payment-content" >
        <div class="payment-header" style="text-align: center;">
            <h2 style="text-align: center;margin-left:230px">Complete Payment</h2>
            <button class="close-btn" onclick="closePaymentModal()">&times;</button>
        </div>
        
        <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="order-details">
                <p style="margin:5px;"> <strong>Order ID:<strong> <span>${orderDetails.id}</span></p>
                <p style="margin:5px;"><strong>Total Amount:</strong> <span>₹${orderDetails.price.toFixed(2)}</span></p>
            </div>
        </div>

        <div class="payment-tabs">
            <button class="tab-btn active" data-tab="card">
                Card Payment
            </button>
            <button class="tab-btn" data-tab="upi">
                UPI
            </button>
            <button class="tab-btn" data-tab="netbanking">
                Net Banking
            </button>
        </div>

        <div class="tab-content" id="card-tab">
            <form id="card-form" onsubmit="handlePayment(event, this)">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" 
                           maxlength="19" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry</label>
                        <input type="text" id="card-expiry" placeholder="MM/YY" 
                               maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="password" id="card-cvv" placeholder="123" 
                               maxlength="3" required>
                    </div>
                </div>
                <button type="submit" class="pay-btn" data-order-details='${JSON.stringify(orderDetails)}'>
                    Pay ₹${orderDetails.price.toFixed(2)}
                </button>
            </form>
        </div>

        <div class="tab-content hidden" id="upi-tab">
            <div class="upi-section">
                <div class="qr-code">
                    <img id="qrCodeImage" src="/api/placeholder/200/200" alt="QR Code">
                    <p>Scan QR code using any UPI app</p>
                </div>
                <div class="upi-input">
                    <input type="text" placeholder="Enter UPI ID (e.g., name@upi)">
                    <button onclick="handlePayment(event, this)" class="pay-btn" 
                            data-order-details='${JSON.stringify(orderDetails)}'>
                        Pay Now
                    </button>
                </div>
            </div>
        </div>

        <div class="tab-content hidden" id="netbanking-tab" >
            <div class="netbanking-section" >
                <select id="bank-select"  required>
                    <option value="">Select Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                </select>
                <button onclick="handlePayment(event, this)" class="pay-btn" 
                        data-order-details='${JSON.stringify(orderDetails)}'>
                    Pay Now
                </button>
            </div>
        </div>
    </div>
</div>

    `;

    // Create modal container and add to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add styles
    const styles = `
        .payment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }

        .payment-content {
            background: white;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto; 
            max-width: 750px;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.3s ease-out;
        }

        .payment-header {
            display: flex;
            text-align: center;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #FFD700;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            transition: color 0.2s;
        }

        .close-btn:hover {
            color: #333;
        }

        .order-summary {
            background: #FFF9E6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .payment-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tab-btn {
            flex: 1;
            padding: 12px;
            border: 2px solid #FFD700;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            color: black;
            transition: all 0.2s;
        }

        .tab-btn.active {
            background: #FFD700;
            color: #333;
        }

        .tab-content {
            transition: opacity 0.3s;
        }

        .tab-content.hidden {
            display: none;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            transition: border-color 0.2s;
        }

        .form-group input:focus {
            border-color: #FFD700;
            outline: none;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .pay-btn {
            width: 100%;
            padding: 14px;
            background: #FFD700;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .pay-btn:hover {
            background: #FFC700;
            transform: translateY(-2px);
        }

        .pay-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .error-message {
            color: #dc3545;
            background: #ffe6e6;
            padding: 12px;
            border-radius: 6px;
            margin-top: 12px;
            display: none;
        }

        #bank-select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            margin-bottom: 16px;
        }

        .qr-code {
            text-align: center;
            margin-bottom: 20px;
        }

        .upi-input {
            display: grid;
            gap: 12px;
        }

        .upi-input input {
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Add event listeners
    setupEventListeners2();
}

// Function to set up event listeners
function setupEventListeners2() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });

    // Card number formatting
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }
}

// Function to switch tabs
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');

     // Call displayQRCode if UPI tab is selected
     if (tabId === 'upi') {
        displayQRCode();
    }
}

// Function to handle payment
function handlePayment(event, buttonElement) {
    event.preventDefault();

     // Retrieve and parse the orderDetails from the data-* attribute
     const orderDetails = JSON.parse(buttonElement.dataset.orderDetails);
     const orderId = orderDetails.id;
    
    const button = event.target.closest('button');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Processing...';

    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Simulate payment processing
    setTimeout(() => {
        if (Math.random() > 0.1) {
            handlePaymentSuccess(orderDetails,{
                orderId: orderId,
                paymentId: 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase()
            });
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Transaction failed. Please try again.';
            button.parentElement.appendChild(errorDiv);
            errorDiv.style.display = 'block';
            
            button.textContent = originalText;
            button.disabled = false;
        }
    }, 1500);
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
} 
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

// Generate QR code
function generateQRCode() {
    const size = 200;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Generate random squares for QR code effect
    ctx.fillStyle = '#000000';
    const blockSize = 10;
    for(let i = 0; i < size/blockSize; i++) {
        for(let j = 0; j < size/blockSize; j++) {
            if(Math.random() > 0.7) {
                ctx.fillRect(i*blockSize, j*blockSize, blockSize, blockSize);
            }
        }
    }
    
    // Add position detection patterns (corners)
    const cornerSize = 30;
    [[0, 0], [size-cornerSize, 0], [0, size-cornerSize]].forEach(([x, y]) => {
        ctx.fillRect(x, y, cornerSize, cornerSize);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x+5, y+5, cornerSize-10, cornerSize-10);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x+10, y+10, cornerSize-20, cornerSize-20);
    });
    
    return canvas.toDataURL();
}

// Function to update QR code dynamically
function displayQRCode() {
    const qrCodeImage = document.getElementById('qrCodeImage');
    const qrCodeDataURL = generateQRCode();
    qrCodeImage.src = qrCodeDataURL;
}

// Call displayQRCode when the page loads or when the UPI tab becomes visible
document.addEventListener('DOMContentLoaded', () => {
    displayQRCode();
});


function generateReceipt(orderDetails, paymentDetails) {
    // Check if the arguments are already objects
    if (typeof orderDetails === 'string') {
        try {
            orderDetails = JSON.parse(orderDetails);
        } catch (e) {
            console.error('Failed to parse orderDetails:', e);
            return;
        }
    }
    
    if (typeof paymentDetails === 'string') {
        try {
            paymentDetails = JSON.parse(paymentDetails);
        } catch (e) {
            console.error('Failed to parse paymentDetails:', e);
            return;
        }
    }

    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>DeliverEase - Order Receipt #${orderDetails.id}</title>
            <style>
                @page {
                    margin: 20px;
                }
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #FFD700;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                .receipt-title {
                    font-size: 20px;
                    color: #666;
                }
                .info-section {
                    margin-bottom: 30px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .info-item {
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .label {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                .value {
                    font-weight: bold;
                    font-size: 16px;
                }
                .amount {
                    font-size: 24px;
                    color: #28a745;
                    text-align: center;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .delivery-details {
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .qr-section {
                    text-align: center;
                    margin: 30px 0;
                }
                .qr-code {
                    width: 120px;
                    height: 120px;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                }
                .vehicle-info {
                    background: #fff9e6;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                @media print {
                    body {
                        padding: 20px;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">DeliverEase: Simplifying Logistics</div>
                <div class="receipt-title">Order Receipt</div>
            </div>

            <div style="text-align: center; color: #28a745; font-size: 20px; margin: 20px 0;">
                ✓ Payment Successful
            </div>

            <div class="info-section">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Order ID</div>
                        <div class="value">${orderDetails.id}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Payment ID</div>
                        <div class="value">${paymentDetails.paymentId}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Order Date</div>
                        <div class="value">${formatDate(orderDetails.createdAt)}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Expected Delivery</div>
                        <div class="value">${formatDate(orderDetails.expectedDelivery)}</div>
                    </div>
                </div>
            </div>

            <div class="amount">
                Amount Paid: ${formatPrice(orderDetails.price)}
            </div>

            <div class="delivery-details">
                <h3 style="margin-top: 0;">Delivery Information</h3>
                <div class="info-item">
                    <div class="label">Pickup Location</div>
                    <div class="value">${orderDetails.pickup.address}</div>
                </div>
                <div class="info-item" style="margin-top: 15px;">
                    <div class="label">Delivery Location${orderDetails.delivery.address.length > 1 ? 's' : ''}</div>
                    ${orderDetails.delivery.address.map((addr, i) => `
                        <div class="value" style="margin-top: 5px;">
                            ${orderDetails.delivery.address.length > 1 ? `${i + 1}. ` : ''}${addr}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="vehicle-info">
                <h3 style="margin-top: 0;">Vehicle Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <div class="label">Vehicle Type</div>
                        <div class="value">${orderDetails.vehicle.type}</div>
                    </div>
                    <div>
                        <div class="label">Vehicle Number</div>
                        <div class="value">${orderDetails.vehicle.number}</div>
                    </div>
                </div>
            </div>

            <div class="info-item">
                <div class="label">Package Details</div>
                <div class="value">Type: ${orderDetails.package.type}</div>
            </div>

            <div class="qr-section">
                <img src="${generateQRCode()}" class="qr-code" alt="Receipt QR Code">
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    Scan to verify payment
                </div>
            </div>

            <div class="footer">
                <p>Thank you for choosing DeliverEase!</p>
                <p>For any queries related to this order, please contact our support<br>Email: support@deliverease.com | Phone: +919867469877</p>
                <p style="margin-top: 20px; font-size: 12px;">
                    This is a computer-generated receipt and doesn't require a signature.
                </p>
            </div>
        </body>
        </html>
    `;

    // Create a new window for the receipt
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    // Wait for the content to load before printing
    printWindow.onload = function() {
        printWindow.print();
    };
}

// Updated payment success handler
function handlePaymentSuccess(orderDetails, paymentDetails) {
    closePaymentModal();
    
    // Properly escape the JSON strings for HTML attributes
    const escapedOrderDetails = JSON.stringify(orderDetails).replace(/'/g, '&apos;').replace(/"/g, '&quot;');
    const escapedPaymentDetails = JSON.stringify(paymentDetails).replace(/'/g, '&apos;').replace(/"/g, '&quot;');
    
    const successHTML = `
        <div class="payment-modal">
            <div class="payment-content">
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #28a745; font-size: 48px; margin-bottom: 20px;">✓</div>
                    <h2>Payment Successful!</h2>
                    <p>Your order has been confirmed.</p>
                    <p>Payment ID: ${paymentDetails.paymentId}</p>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="generateReceipt(${escapedOrderDetails}, ${escapedPaymentDetails})"
                                class="pay-btn" style="background: #4CAF50;">
                            Print Receipt
                        </button>
                        <button onclick="window.location.reload()" class="pay-btn">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    const successModal = document.createElement('div');
    successModal.innerHTML = successHTML;
    document.body.appendChild(successModal.firstElementChild);
}


//  Close the payment modal by removing it from the DOM.
function closePaymentModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}





