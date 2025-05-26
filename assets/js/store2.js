
// Sample past orders
const samplePastOrders = [
    {
        id: "ORD001",
        status: "delivered",
        createdAt: "2025-01-10T10:30:00",
        expectedDelivery: "2025-01-11T15:00:00",
        pickup: {
            address: "123 Start Street, Mumbai"
        },
        delivery: {
            address: ["456 End Road, Pune"]
        },
        currentLocation: {
            lastUpdated: "2025-01-11T14:30:00"
        },
        timeline: [
            {
                status: "Order Placed",
                location: "Mumbai",
                timestamp: "2025-01-10T10:30:00"
            },
            {
                status: "Picked Up",
                location: "Mumbai Warehouse",
                timestamp: "2025-01-10T11:45:00"
            },
            {
                status: "Delivered",
                location: "Pune",
                timestamp: "2025-01-11T14:30:00"
            }
        ],
        vehicle: {
            type: "Delivery Van",
            number: "MH12AB3456"
        },
        package: {
            weight : "2kg",
            dimensions: "30x20x15 cm"
        },
        price: 500.00
    },
    {
        id: "ORD002",
        status: "delivered",
        createdAt: "2025-02-05T09:00:00",
        expectedDelivery: "2025-02-06T12:00:00",
        pickup: {
            address: "789 Start Avenue, Delhi"
        },
        delivery: {
            address: ["101 End Boulevard, Noida"]
        },
        currentLocation: {
            lastUpdated: "2025-02-06T11:00:00"
        },
        timeline: [
            {
                status: "Order Placed",
                location: "Delhi",
                timestamp: "2025-02-05T09:00:00"
            },
            {
                status: "Picked Up",
                location: "Delhi Warehouse",
                timestamp: "2025-02-05T10:15:00"
            },
            {
                status: "Delivered",
                location: "Noida",
                timestamp: "2025-02-06T11:00:00"
            }
        ],
        vehicle: {
            type: "Truck",
            number: "DL12CD7890"
        },
        package: {
            weight: "5kg",
            dimensions: "50x40x30 cm"
        },
        price: 1200.00
    },
    {
        id: "ORD003",
        status: "delivered",
        createdAt: "2025-02-05T09:00:00",
        expectedDelivery: "2025-02-06T12:00:00",
        pickup: {
            address: "Mumbai Cental"
        },
        delivery: {
            address: ["101 End Boulevard, Noida"]
        },
        currentLocation: {
            lastUpdated: "2025-02-06T11:00:00"
        },
        timeline: [
            {
                status: "Order Placed",
                location: "Mumbai",
                timestamp: "2025-02-05T09:00:00"
            },
            {
                status: "Picked Up",
                location: "Mumbai Warehouse",
                timestamp: "2025-02-05T10:15:00"
            },
            {
                status: "Delivered",
                location: "Noida",
                timestamp: "2025-02-06T11:00:00"
            }
        ],
        vehicle: {
            type: "Truck",
            number: "DL12CD7890"
        },
        package: {
            weight: "10kg",
            dimensions: "50x40x30 cm"
        },
        price: 2000.00
    }
];

// Add this function at the start of your OrderHistory.js file
function addPaymentStatusStyles() {
    // Check if styles are already added
    if (!document.getElementById('order-payment-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'order-payment-styles';
        styleSheet.textContent = `
            .payment-status-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                margin-left: 8px;
            }

            .payment-completed {
                background-color: #4CAF50;
                color: white;
            }

            .payment-pending {
                background-color: #FFA500;
                color: white;
            }

            .status-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .timeline {
                list-style-type: none;
                padding-left: 20px;
                margin-top: 8px;
                font-size: 0.9em;
            }

            .timeline li {
                margin-bottom: 4px;
                color: #666;
            }

            .complete-payment-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            }

            .complete-payment-btn:hover {
                background-color: #45a049;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Function to initialize sample orders in local storage
function initializeSampleOrders() {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const allOrders = [...existingOrders, ...samplePastOrders];
    localStorage.setItem('orders', JSON.stringify(allOrders));
}

// Call the function to initialize sample orders
initializeSampleOrders();


function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            loadOrders(e.target.dataset.tab);
        });
    });

    // Search functionality with debouncing
    const searchInput = document.querySelector('.search-input');
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterOrders(e.target.value);
        }, 300);
    });

    // Filters
    document.getElementById('statusFilter').addEventListener('change', () => {
        filterOrders(searchInput.value);
    });

    document.getElementById('dateFilter').addEventListener('change', () => {
        filterOrders(searchInput.value);
    });
}
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    addPaymentStatusStyles(); // Add this line
    setupEventListeners();
    loadOrders('active'); // Load active orders by default
});

// OrderHistory.js

function loadOrders(type = 'active') {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';

    // Retrieve orders from local storage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Map the status from OrderPage2 to match the expected statuses
    const statusMapping = {
        'payment_pending': 'pending',
        'order_placed': 'in-transit',
        'delivered': 'delivered'
    };

    const filteredOrders = storedOrders.filter(order => {
        // Map the order status to match our expected values
        const mappedStatus = statusMapping[order.status] || order.status;
        
        if (type === 'active') {
            return ['pending', 'in-transit'].includes(mappedStatus);
        } else if (type === 'past') {
            return mappedStatus === 'delivered';
        }
        return false;
    });

    if (filteredOrders.length === 0) {
        showNoOrders(type);
        return;
    }

    filteredOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersGrid.appendChild(orderCard);
    });
}

// Update the createOrderCard function to show payment status
// Rest of your updated functions remain the same as in the previous artifact
function createOrderCard(order) {
    const deliveryAddresses = Array.isArray(order.delivery.address) 
        ? order.delivery.address.join(', ')
        : order.delivery.address;

    const paymentStatusClass = order.paymentStatus === 'completed' ? 'payment-completed' : 'payment-pending';
    const paymentStatusText = order.paymentStatus === 'completed' ? 'Payment Completed' : 'Payment Pending';

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <h3>Order #${order.id}</h3>
            <div class="status-container">
                ${formatStatus(order.status)}
                <span class="payment-status-badge ${paymentStatusClass}">${paymentStatusText}</span>
            </div>
        </div>
        <div class="order-details">
            <p><strong>From:</strong> ${order.pickup.address}</p>
            <p><strong>To:</strong> ${deliveryAddresses}</p>
            <p><strong>Expected:</strong> ${formatDate(order.expectedDelivery)}</p>
            <p><strong>Vehicle:</strong> ${order.vehicle.type} (${order.vehicle.number})</p>
            <p><strong>Amount:</strong> ₹${typeof order.price === 'number' ? order.price.toFixed(2) : order.price}</p>
            <p><strong>Timeline:</strong></p>
            <ul class="timeline">
                ${order.timeline.map(event => `
                    <li>${event.status} - ${new Date(event.timestamp).toLocaleString()}</li>
                `).join('')}
            </ul>
        </div>
        <div class="order-actions">
            ${order.paymentStatus === 'pending' ? 
                `<button class="complete-payment-btn" data-order-id="${order.id}">Complete Payment</button>` : ''}
            <button class="view-details-btn">View Map</button>
            <button class="remove-order-btn">Remove</button>
        </div>
    `;

    // Add event listeners
    const completePaymentBtn = card.querySelector('.complete-payment-btn');
    if (completePaymentBtn) {
        completePaymentBtn.addEventListener('click', () => {
            handleCompletePayment(order.id);
        });
    }

    card.querySelector('.view-details-btn').addEventListener('click', () => {
        openTrackingModal(order);
    });

    card.querySelector('.remove-order-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        removeOrder(order.id, card);
    });

    return card;
}

function handleCompletePayment(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].paymentStatus = 'completed';
        orders[orderIndex].status = 'order_placed';
        orders[orderIndex].timeline.push({
            status: "Payment Completed",
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Refresh the display
        loadOrders(document.querySelector('.tab.active').dataset.tab);
        
        alert('Payment completed successfully!');
    }
}
function formatStatus(status) {
    // Map the status from OrderPage2 to display values
    const statusDisplayMap = {
        'payment_pending': 'Payment Pending',
        'order_placed': 'In Transit',
        'delivered': 'Delivered',
        'pending': 'Pending',
        'in-transit': 'In Transit'
    };

    const displayStatus = statusDisplayMap[status] || status;
    const statusClass = status.toLowerCase().replace('_', '-');

    return `<span class="status-badge ${statusClass}">${displayStatus}</span>`;
}

function filterOrders(searchQuery) {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    let filteredOrders = storedOrders.filter(order => {
        const matchesSearch = !searchQuery || 
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (Array.isArray(order.delivery.address) 
                ? order.delivery.address.some(addr => addr.toLowerCase().includes(searchQuery.toLowerCase()))
                : order.delivery.address.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        // Add date filtering logic based on your dateFilter options
        const orderDate = new Date(order.createdAt);
        const matchesDate = handleDateFilter(orderDate, dateFilter);

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Update the display
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';

    if (filteredOrders.length === 0) {
        showNoOrders(activeTab);
        return;
    }

    filteredOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersGrid.appendChild(orderCard);
    });
}


function removeOrder(orderId, cardElement) {
    // Remove the order from the localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = storedOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Remove the order card from the UI
    cardElement.remove();
}

function openTrackingModal(order) {
    // Get the template and clone it
    const template = document.getElementById('trackingModalTemplate').content.cloneNode(true);

    // Set the order ID
    template.querySelector('.order-id').textContent = order.id;

    // Append the modal to the body
    document.body.appendChild(template);

    // Initialize the map and directions
    showMap(order.pickup.address, order.delivery.address, 'trackingMap');
    populateRouteDetails(order.routeDetails, 'routeDetails');

    // Add close functionality
    document.getElementById('closeModal').addEventListener('click', closeTrackingModal);
}

function closeTrackingModal() {
    document.querySelector('.tracking-details').remove();
}


const apiKey = '5b3ce3597851110001cf62489d08557f5cca4ebdbeb458f514a26ab7';
// Utility function to decode polyline
function decodePolyline(encoded) {
    // Custom decoding function if library fails to load
    var poly = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len) {
        var b, shift = 0, result = 0;
        
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        poly.push([lat / 1e5, lng / 1e5]);
    }
    
    return poly;
}

function populateRouteDetails(routeDetails, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!routeDetails || routeDetails.length === 0) {
        container.innerHTML = '<p>No directions available.</p>';
        return;
    }

    const timeline = document.createElement('div');
    timeline.className = 'timeline';
    
    routeDetails.forEach((step, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // Format the distance to be more readable
        const distance = step.distance < 1000 
            ? `${Math.round(step.distance)}m` 
            : `${(step.distance / 1000).toFixed(1)}km`;

        timelineItem.innerHTML = `
            <div class="timeline-time">${index + 1}</div>
            <div class="timeline-content">
                <h4>${step.instruction}</h4>
                <p>${distance}</p>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });

    container.appendChild(timeline);
}


function getCoordinates(address) {
    return new Promise((resolve, reject) => {
        const geocodingService = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(address);
        fetch(geocodingService)
            .then((response) => response.json())
            .then((data) => {
                if (data && data[0]) {
                    resolve([data[0].lon, data[0].lat]);
                } else {
                    reject('Geocoding failed');
                }
            })
            .catch((err) => reject(err));
    });
}

let animatedMarker = null;
let mapInstances = {};

function showMap(pickupAddress, deliveryAddresses, mapId) {
    if (mapInstances[mapId]) {
        mapInstances[mapId].remove();
        delete mapInstances[mapId];
    }

    // Hide the default Leaflet Routing Machine container
    const style = document.createElement('style');
    style.innerHTML = '.leaflet-routing-container { display: none !important; }';
    document.head.appendChild(style);

    // Combine pickup and delivery addresses for geocoding
    const addresses = [pickupAddress, ...deliveryAddresses];

    // Fetch coordinates for all addresses
    Promise.all(addresses.map(getCoordinates))
        .then((coords) => {
            const mapElement = document.getElementById(mapId);
            console.log('Geocoded coordinates:', coords);
            if (mapElement) {
                const map = L.map(mapElement).setView([coords[0][1], coords[0][0]], 10);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(map);

                // Add markers for all locations
                coords.forEach((coord, index) => {
                    const label = index === 0 ? 'Pickup Location' : `Stop ${index}`;
                    L.marker([coord[1], coord[0]])
                        .bindPopup(`<b>${label}</b>`)
                        .addTo(map);
                });

                // Create waypoints string for OSRM
                const waypointsString = coords.map(coord => `${coord[0]},${coord[1]}`).join(';');
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${waypointsString}?steps=true&annotations=true&geometries=polyline&overview=full`;

                // Fetch route from OSRM directly
                fetch(osrmUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('OSRM API response:', data);
                    if (data.routes && data.routes.length > 0) {
                        const route = data.routes[0];
                        
                        // Decode and draw the route
                        const decodedCoordinates = decodePolyline(route.geometry);
                        console.log('Decoded coordinates:', decodedCoordinates);
                        L.polyline(decodedCoordinates, {
                            color: '#00a',
                            weight: 4
                        }).addTo(map);
            
                        // Extract and format steps for directions
                        const steps = [];
                        route.legs.forEach(leg => {
                            leg.steps.forEach(step => {
                                if (step.maneuver) {
                                    // Clean up and format the instruction
                                    let instruction = step.maneuver.type;
                                    if (step.maneuver.modifier) {
                                        instruction = `${step.maneuver.modifier} ${instruction}`;
                                    }
                                    if (step.name) {
                                        instruction += ` onto ${step.name}`;
                                    }
                                    
                                    // Capitalize first letter and clean up instruction
                                    instruction = instruction
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')
                                        .replace(/-/g, ' ');
            
                                    steps.push({
                                        instruction: instruction,
                                        distance: Math.round(step.distance)
                                    });
                                }
                            });
                        });
            
                        // Add destination reached as final step
                        steps.push({
                            instruction: 'Destination Reached',
                            distance: 0
                        });

                            // Update directions in the container
                            populateRouteDetails(steps, 'routeDetails');

                            // Add truck animation
                            if (animatedMarker) {
                                map.removeLayer(animatedMarker);
                            }

                            const vehicleIcon = L.divIcon({
                                html: '🚛',
                                className: 'vehicle-icon',
                                iconSize: [25, 25],
                                iconAnchor: [12, 12],
                            });

                            animatedMarker = L.marker(decodedCoordinates[0], {
                                icon: vehicleIcon
                            }).addTo(map);

                            let currentIndex = 0;

                            function animateMarker() {
                                if (currentIndex < decodedCoordinates.length - 1) {
                                    const start = decodedCoordinates[currentIndex];
                                    const end = decodedCoordinates[currentIndex + 1];

                                    const steps = 0.000000001;
                                    const latStep = (end[0] - start[0]) / steps;
                                    const lngStep = (end[1] - start[1]) / steps;

                                    let stepCount = 0;

                                    function step() {
                                        if (stepCount <= steps) {
                                            const lat = start[0] + latStep * stepCount;
                                            const lng = start[1] + lngStep * stepCount;

                                            animatedMarker.setLatLng([lat, lng]);
                                            stepCount++;
                                            setTimeout(step, 0.000000001);
                                        } else {
                                            currentIndex++;
                                            animateMarker();
                                        }
                                    }

                                    step();
                                }
                            }

                            animateMarker();
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching route:', error);
                        const routeDetails = document.getElementById('routeDetails');
                        routeDetails.innerHTML = '<p class="error">Error loading route directions. Please try again later.</p>';
                    });

                map.fitBounds(coords.map(coord => [coord[1], coord[0]]));
                mapInstances[mapId] = map;
            }
        })
        .catch((error) => {
            console.error('Error fetching coordinates:', error);
            const mapElement = document.getElementById(mapId);
            if (mapElement) {
                mapElement.innerHTML = 'Error displaying locations on the map. Please try again later.';
            }
            const routeDetails = document.getElementById('routeDetails');
            if (routeDetails) {
                routeDetails.innerHTML = '<p class="error">Error loading route directions. Please try again later.</p>';
            }
        });
}

const style = document.createElement('style');
style.textContent = `
    .vehicle-icon {
        font-size: 20px;
        text-align: center;
        line-height: 25px;
        transform-origin: center center;
    }
`;
document.head.appendChild(style);




function showTrackingDetails(order) {

    // Check if there's an existing modal and hide it
    const existingModal = document.querySelector('.tracking-details');
    if (existingModal) {
        existingModal.style.display = 'none'; // Hide any existing modal
    }

    // Create a new modal based on the template
    const modal = document.getElementById('trackingModalTemplate').content.cloneNode(true);
    const modalElement = document.createElement('div');
    modalElement.classList.add('tracking-details'); // Add tracking-details class for styling
    modalElement.appendChild(modal);
    document.body.appendChild(modalElement);

    // Set order ID
    modalElement.querySelector('.order-id').textContent = order.id;

    // Populate timeline
    const timeline = modalElement.querySelector('.timeline');
    order.timeline.forEach(event => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-time">${formatDate(event.timestamp)}</div>
            <div class="timeline-content">
                <h4>${event.status}</h4>
                <p>${event.location}</p>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });

    // Show map for pickup and delivery locations
    showMap(order.pickup.address, order.delivery.address);

    // Close modal functionality
    const closeModalBtn = modalElement.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modalElement.style.display = 'none'; // Hide modal
        });
    }

    // Display the modal
    modalElement.style.display = 'block';

    // Close on outside click
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            modalElement.remove(); // Remove modal from DOM
        }
    });
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

/*My filter is not working well can u debug it */
function filterOrders(searchTerm) {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    // Retrieve orders from local storage
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];

    const filtered = storedOrders.filter(order => {
        const matchesSearch = !searchTerm || 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.pickup.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.delivery.address.join(', ').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesDate = filterByDate(order.createdAt, dateFilter);
        const matchesTab = activeTab === 'active' ? 
            ['pending', 'in-transit'].includes(order.status) : 
            order.status === 'delivered';

        return matchesSearch && matchesStatus && matchesDate && matchesTab;
    });

    updateOrdersGrid(filtered);
}


function filterByDate(dateString, filter) {
    const date = new Date(dateString);
    const now = new Date();
    
    switch(filter) {
        case 'today':
            return isSameDay(date, now);
        case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo;
        case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            return date >= monthAgo;
        default:
            return true;
    }
}

function updateOrdersGrid(filteredOrders) {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';

    if (filteredOrders.length === 0) {
        showNoOrders('filtered');
        return;
    }

    filteredOrders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersGrid.appendChild(orderCard);
    });
}

function showNoOrders(type) {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = ` 
        <div class="no-orders">
            ${type === 'filtered' ? 
                'No orders found matching your criteria' : 
                `No ${type} orders found`}
        </div>
    `;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // No map cleanup needed now
});
