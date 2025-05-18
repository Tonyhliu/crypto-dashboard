import type { CryptoPrice } from "../../services/cryptoApi";

function MetricCard({ crypto, onClick }: { crypto: CryptoPrice, onClick: () => void }) {
    const isPositive = crypto.price_change_percentage_24h >= 0;

    return (
        <div className="card-style"
            onClick={onClick}>
            <h3>{crypto.name}</h3>
            <p>{crypto.symbol}</p>
            <p>${crypto.current_price}</p>
            <p className={
                isPositive ? 'text-green-500' : 'text-red-500'
            }>
                {isPositive ? '📈' : '📉'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </p>
        </div>
    )
}

export default MetricCard;