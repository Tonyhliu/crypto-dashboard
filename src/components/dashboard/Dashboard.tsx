import { useEffect, useState } from "react";
import ChartWidget from "../widgets/ChartWidget";
import MetricCard from "../widgets/MetricCard";
import StatusWidget from "../widgets/StatusWidget";
import DashboardGrid from "./DashboardGrid";
import { cryptoApi } from "../../services/cryptoApi";
import type { MarketChart, CryptoPrice } from "../../services/cryptoApi";
import AIWidget from "../widgets/AIWidget";

function Dashboard() {
    const [chartData, setChartData] = useState<MarketChart | null>(null);
    const [currentChartName, setCurrentChartName] = useState<string>('Bitcoin');
    const [topCryptos, setTopCryptos] = useState<CryptoPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('Online');
    const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());

    const handleCryptoClick = async (crypto: CryptoPrice) => {
        if (currentChartName === crypto.name) {
            return;
        }

        console.log('changing chart');
        setCurrentChartName(crypto.name);
        const cryptoChart = await cryptoApi.getMarketChart(crypto.id, 7);
        setChartData(cryptoChart);
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log('fetching data...');
            try {
                setLoading(true);
                const cryptos = await cryptoApi.getTopCryptos(10);
                setTopCryptos(cryptos);

                const bitcoinChart = await cryptoApi.getMarketChart('bitcoin', 7);
                setChartData(bitcoinChart);

                setLastUpdated(new Date().toLocaleString());
                setStatus('Online');
                setError(null);
            } catch (err) {
                setError(`Failed to fetch cryptocurrency data: ${err}`);
                setStatus('Offline');
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        const interval = setInterval(fetchData, 5 * 60 * 1000); // refresh every 5 minutes
        return () => clearInterval(interval); // cleanup interval on unmount
    }, []);



    if (loading && !topCryptos.length) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const defaultChartData = { prices: [], market_caps: [], total_volumes: [] } 
    return (
        <DashboardGrid>
            <ChartWidget 
                data={chartData || defaultChartData} 
                name={currentChartName}
            />
            <AIWidget chartData={chartData || defaultChartData} cryptoName={currentChartName} />
            {topCryptos.slice(0, 10).map(crypto => (
                // grabs top 10 cryptos
                <MetricCard 
                    key={crypto.id}
                    crypto={crypto}
                    onClick={() => handleCryptoClick(crypto)}
                />
            ))}
            <StatusWidget status={status} lastUpdated={lastUpdated} />
        </DashboardGrid>
    )
}

export default Dashboard;