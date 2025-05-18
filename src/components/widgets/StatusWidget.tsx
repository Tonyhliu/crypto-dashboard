interface StatusWidgetProps {
    status: string;
    lastUpdated: string;
};

function StatusWidget({ status, lastUpdated }: StatusWidgetProps) {
    return (
        <div className="card-style">
            <h3 className="text-2xl">API Status: {status} {status === 'Online' ? '🟢' : '🔴'}</h3>
            <p>Last updated: {lastUpdated}</p>
        </div>
    )
}

export default StatusWidget;