import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import API from '../api/axios';
import StockCard from '../components/StockCard';
import Loader from '../components/Loader';

export default function Market() {
    const [stocks, setStocks] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('All');
    const [sort, setSort] = useState('');

    useEffect(() => {
        fetchSectors();
    }, []);

    useEffect(() => {
        fetchStocks();
    }, [search, sector, sort]);

    const fetchSectors = async () => {
        try {
            const res = await API.get('/stocks/sectors');
            setSectors(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (sector && sector !== 'All') params.append('sector', sector);
            if (sort) params.append('sort', sort);

            const res = await API.get(`/stocks?${params.toString()}`);
            setStocks(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="market-header">
                    <div>
                        <h1>Market</h1>
                        <p className="text-secondary" style={{ fontSize: '0.9rem', marginTop: 4 }}>
                            Browse {stocks.length} stocks available for trading
                        </p>
                    </div>
                    <div className="market-filters">
                        <div className="search-input-wrap">
                            <FiSearch className="search-icon" />
                            <input
                                id="market-search"
                                type="text"
                                className="form-input"
                                placeholder="Search stocks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            id="market-sector-filter"
                            className="form-select"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            style={{ minWidth: 150 }}
                        >
                            <option value="All">All Sectors</option>
                            {sectors.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <select
                            id="market-sort"
                            className="form-select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            style={{ minWidth: 150 }}
                        >
                            <option value="">Sort by</option>
                            <option value="name">Name</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                            <option value="change_desc">Gain: High → Low</option>
                            <option value="change_asc">Loss: High → Low</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : stocks.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📊</div>
                        <h3>No stocks found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="stocks-grid">
                        {stocks.map(stock => (
                            <StockCard key={stock._id} stock={stock} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
