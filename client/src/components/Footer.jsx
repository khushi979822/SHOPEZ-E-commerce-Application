import { FiShoppingBag, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer style={{ background: '#172337', color: '#fff', paddingTop: '40px', marginTop: 'auto' }}>
            <div className="container" style={{ maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', paddingBottom: '40px' }}>
                <div>
                    <h4 style={{ color: '#878787', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 400 }}>About</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>About Us</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Careers</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>ShopEZ Stories</a>
                    </div>
                </div>
                <div>
                    <h4 style={{ color: '#878787', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 400 }}>Help</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Payments</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Shipping</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Cancellation & Returns</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>FAQ</a>
                    </div>
                </div>
                <div>
                    <h4 style={{ color: '#878787', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 400 }}>Policy</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Return Policy</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Terms Of Use</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Security</a>
                        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Privacy</a>
                    </div>
                </div>
                <div style={{ borderLeft: '1px solid #454d5e', paddingLeft: '32px' }}>
                    <h4 style={{ color: '#878787', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 400 }}>Mail Us:</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#fff' }}>
                        ShopEZ Internet Private Limited,<br/>
                        Buildings Alyssa, Begonia &<br/>
                        Clove Embassy Tech Village,<br/>
                        Outer Ring Road, Devarabeesanahalli Village,<br/>
                        Bengaluru, 560103,<br/>
                        Karnataka, India
                    </p>
                </div>
            </div>
            <div style={{ borderTop: '1px solid #454d5e', padding: '24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiShoppingBag color="#fb641b" /> Become a Seller</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>© 2024 ShopEZ.com</div>
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="Payment Methods" style={{ height: '20px' }} />
            </div>
        </footer>
    );
}
