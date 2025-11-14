# SPARKLE & SHINE - Admin Panel

A comprehensive admin panel for managing the EverGlow Jewellers e-commerce store.

## Features

### 🛍️ Product Management
- **Add New Jewellery**: Upload product images, set prices, categories, and discounts
- **Edit Products**: Modify existing product details and images
- **Delete Products**: Remove products from the store
- **Product Categories**: 
  - Rings
  - Earrings
  - Bracelet
  - Necklace
  - Pendant Set

### 📦 Order Management
- **View All Orders**: Complete order history with customer details
- **Update Order Status**: Track orders from placement to delivery
- **Order Statuses**:
  - Order Placed
  - Processing
  - Quality Check
  - Packing
  - Shipped
  - Out for delivery
  - Delivered

### 🔐 Admin Authentication
- Secure login system
- JWT token-based authentication
- Protected admin routes

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the admin directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### 2. Backend Requirements
Ensure your backend has these environment variables:
```env
ADMIN_EMAIL=admin@everglow.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
```

### 3. Install Dependencies
```bash
cd admin
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

## Usage

### Adding Products
1. Navigate to "Add Jewellery"
2. Upload up to 4 product images
3. Fill in product details:
   - Name and description
   - Category selection
   - Price and discount price
   - Mark as bestseller if applicable
4. Click "ADD" to save

### Managing Products
1. Go to "Manage Products"
2. View all products in a table format
3. Use "Edit" button to modify products
4. Use "Delete" button to remove products

### Managing Orders
1. Navigate to "Manage Orders"
2. View order details including:
   - Customer information
   - Product items
   - Payment status
   - Delivery address
3. Update order status using the dropdown menu

## API Endpoints Used

- `POST /api/user/admin` - Admin login
- `POST /api/product/add` - Add new product
- `POST /api/product/update` - Update existing product
- `POST /api/product/remove` - Delete product
- `GET /api/product/list` - Get all products
- `POST /api/product/single` - Get single product
- `POST /api/order/list` - Get all orders
- `POST /api/order/status` - Update order status

## Security Features

- Admin authentication required for all operations
- JWT token validation
- Protected API endpoints
- Secure file upload handling

## Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Routing**: React Router DOM

## Support

For technical support or questions about the admin panel, please contact the development team.
