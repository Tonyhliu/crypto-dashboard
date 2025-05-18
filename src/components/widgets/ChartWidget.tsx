import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { MarketChart } from "../../services/cryptoApi";

function ChartWidget({data, name}: {data: MarketChart, name: string}) {
    const chartData = data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: price
    }));

    return (
        <div className="bg-white p-4 rounded-lg shadow-md col-span-3 h-96"> 
            This is the Chart Widget for {name}:
            <div className="h-full">
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <XAxis 
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 12 }} 
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Line 
                            type="monotone"
                            dataKey="price" 
                            stroke="#2563eb" 
                            strokeWidth={2} 
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ChartWidget;