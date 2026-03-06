import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
                background: '#fff',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid #f0f0f0',
                transition: 'box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 3px 16px 0 rgba(0,0,0,0.11)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
            <div className="product-card-img-wrapper" style={{ height: '200px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={product.mainImg}
                    alt={product.title}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                    className="product-img"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>
            <div className="product-card-body" style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 400, color: '#212121', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#878787', marginBottom: '8px' }}>
                    {product.Category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#212121' }}>
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.Discount > 0 && (
                            <span style={{ fontSize: '0.85rem', color: '#388e3c', fontWeight: 600 }}>
                                {product.Discount}% off
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product._id}`);
                        }}
                        style={{
                            background: '#fb641b',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '2px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)'
                        }}
                    >
                        SHOP NOW
                    </button>
                </div>
            </div>
        </div>
    );
}
