import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

export default function StockCard({ stock }) {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const isUp = stock.changePercent >= 0;

    // Use unavatar.io for company logos, fallback to initials if the logo isn't found
    const avatarUrl = imgError
        ? `https://ui-avatars.com/api/?name=${stock.symbol}&background=random&color=fff&bold=true`
        : `https://unavatar.io/${stock.symbol.toLowerCase()}.com?fallback=false`;

    return (
        <div className="stock-card" onClick={() => navigate(`/stocks/${stock._id}`)}>
            <div className="stock-card-header">
                <div className="stock-title-section">
                    <img
                        src={avatarUrl}
                        alt={`${stock.symbol} logo`}
                        className="stock-logo"
                        onError={() => setImgError(true)}
                    />
                    <div>
                        <div className="stock-symbol">{stock.symbol}</div>
                        <div className="stock-name">{stock.name}</div>
                    </div>
                </div>
                <span className="stock-sector">{stock.sector}</span>
            </div>
            <div className="stock-price">₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <span className={`stock-change ${isUp ? 'up' : 'down'}`}>
                {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
                {isUp ? '+' : ''}{stock.changePercent?.toFixed(2)}%
            </span>
        </div>
    );
}
