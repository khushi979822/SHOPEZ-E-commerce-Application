const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Admin = require('./models/Admin');

dotenv.config();

const productsData = [
    {
        title: "Apple iPhone 15 Pro (128GB)",
        description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.",
        mainImg: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
        carousel: [],
        Category: "Electronics",
        sizes: ["128GB", "256GB", "512GB"],
        Gender: "Unisex",
        price: 134900,
        Discount: 5
    },
    {
        title: "Samsung 55 inch 4K Smart TV",
        description: "Experience crystal clear colors that are fine-tuned to deliver a naturally crisp and vivid picture.",
        mainImg: "https://images.unsplash.com/photo-1593359677879-ac599eb9e368?w=500&q=80",
        carousel: [],
        Category: "Home & Furniture",
        sizes: ["55 inch"],
        Gender: "Unisex",
        price: 45990,
        Discount: 25
    },
    {
        title: "Levi's Men Regular Fit Denim Jacket",
        description: "A classic denim jacket that never goes out of style. Durable and comfortable.",
        mainImg: "https://images.unsplash.com/photo-1523381295242-fce27df15220?w=500&q=80",
        carousel: [],
        Category: "Fashion",
        sizes: ["M", "L", "XL"],
        Gender: "Men",
        price: 2799,
        Discount: 40
    },
    {
        title: "Women Floral Print Maxi Dress",
        description: "Elegant floral print maxi dress perfect for summer outings and casual parties.",
        mainImg: "https://images.unsplash.com/photo-1572804013309-846ecebc5c32?w=500&q=80",
        carousel: [],
        Category: "Fashion",
        sizes: ["S", "M", "L"],
        Gender: "Women",
        price: 1299,
        Discount: 60
    },
    {
        title: "Nike Air Zoom Pegasus 40",
        description: "A bouncy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        carousel: [],
        Category: "Footwear",
        sizes: ["8", "9", "10", "11"],
        Gender: "Men",
        price: 8495,
        Discount: 10
    },
    {
        title: "Puma Softride Sophia Walking Shoes",
        description: "Designed for women, featuring soft ride foam and a slip-on construction for easy wear.",
        mainImg: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
        carousel: [],
        Category: "Footwear",
        sizes: ["6", "7", "8"],
        Gender: "Women",
        price: 3599,
        Discount: 45
    },
    {
        title: "L'Oreal Paris Revitalift Hyaluronic Acid Serum",
        description: "1.5% Hyaluronic Acid Serum for intensely hydrated and plump skin.",
        mainImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
        carousel: [],
        Category: "Beauty",
        sizes: ["30ml", "15ml"],
        Gender: "Female",
        price: 999,
        Discount: 15
    },
    {
        title: "LAKMÉ Absolute Skin Dew Color Serum",
        description: "Infused with skin-loving ingredients for a dewy, glowing finish.",
        mainImg: "https://images.unsplash.com/photo-1598440947619-22596e1b6973?w=500&q=80",
        carousel: [],
        Category: "Beauty",
        sizes: ["30ml"],
        Gender: "Female",
        price: 899,
        Discount: 10
    },
    {
        title: "Wakefit Engineered Wood Coffee Table",
        description: "Minimalist engineering wood coffee table with storage shelf.",
        mainImg: "https://images.unsplash.com/photo-1533090135164-ce7b34007886?w=500&q=80",
        carousel: [],
        Category: "Home & Furniture",
        sizes: ["Standard"],
        Gender: "Unisex",
        price: 3299,
        Discount: 55
    },
    {
        title: "Sleepyhead 3 Seater Fabric Sofa",
        description: "High density foam, solid wood frame, and premium fabric for ultimate comfort.",
        mainImg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
        carousel: [],
        Category: "Home & Furniture",
        sizes: ["3 Seater"],
        Gender: "Unisex",
        price: 18499,
        Discount: 30
    },
    {
        title: "HP Pavilion 15 Core i5 12th Gen Laptop",
        description: "15.6 inch FHD Anti-glare display, 16GB RAM, 512GB SSD, Windows 11.",
        mainImg: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
        carousel: [],
        Category: "Electronics",
        sizes: ["16GB/512GB"],
        Gender: "Unisex",
        price: 64990,
        Discount: 18
    },
    {
        title: "Canon EOS R50 Mirrorless Camera",
        description: "Compact and lightweight mirrorless camera perfect for content creators. Comes with 18-45mm lens.",
        mainImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
        carousel: [],
        Category: "Electronics",
        sizes: ["Body+Lens"],
        Gender: "Unisex",
        price: 75990,
        Discount: 8
    },
    {
        title: "Men's Classic T-Shirt",
        description: "A comfortable, everyday classic t-shirt made with 100% cotton.",
        mainImg: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        carousel: [
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80"
        ],
        Category: "Fashion",
        sizes: ["S", "M", "L", "XL"],
        Gender: "Men",
        price: 999,
        Discount: 10
    },
    {
        title: "Unisex Cargo Pants",
        description: "Durable cargo pants with multiple utility pockets.",
        mainImg: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
        carousel: [],
        Category: "Fashion",
        sizes: ["28", "30", "32", "34"],
        Gender: "Unisex",
        price: 1899,
        Discount: 0
    },
    {
        title: "Premium Wireless Headphones",
        description: "Noise-cancelling wireless headphones with 40-hour battery life.",
        mainImg: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
        carousel: [],
        Category: "Electronics",
        sizes: ["Standard"],
        Gender: "Unisex",
        price: 5999,
        Discount: 15
    }
];

const adminConfigData = {
    Categories: ["Electronics", "Fashion", "Footwear", "Home & Furniture", "Beauty"],
    Banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80"
};

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing
        await Product.deleteMany({});
        await User.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
        await Admin.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed products
        const createdProducts = await Product.create(productsData);
        console.log(`🛍️ Seeded ${createdProducts.length} products`);

        // Seed admin config
        await Admin.create(adminConfigData);
        console.log('⚙️ Seeded Admin site config (Banners/Categories)');

        // Create admin user
        await User.create({
            Username: 'Admin',
            email: 'admin@shopez.com',
            password: 'admin123',
            UserType: 'admin'
        });
        console.log('👤 Created admin user (admin@shopez.com / admin123)');

        // Create demo user
        await User.create({
            Username: 'Demo User',
            email: 'demo@shopez.com',
            password: 'demo123',
            UserType: 'user'
        });
        console.log('👤 Created demo user (demo@shopez.com / demo123)');

        console.log('\n✅ Database seeded and ALIGNED successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin login:  admin@shopez.com / admin123');
        console.log('User login:   demo@shopez.com / demo123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
