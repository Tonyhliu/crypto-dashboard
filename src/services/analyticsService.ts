declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export const GA_TRACKING_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Initialize GA4
export const initGA = () => {
    if (!GA_TRACKING_ID) {
        console.warn('GA Measurement ID not found');
        return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID);
};

// Track page views
export const pageview = (url: string) => {
    if (!window.gtag) return;
    window.gtag('config', GA_TRACKING_ID!, {
        page_path: url,
    });
};

// Track custom events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (!window.gtag) return;
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

// Predefined events for our crypto dashboard
export const cryptoEvents = {
    viewCrypto: (cryptoName: string) => 
        event({
            action: 'view_crypto',
            category: 'Crypto',
            label: cryptoName,
        }),
    
    compareCharts: (cryptos: string[]) =>
        event({
            action: 'compare_charts',
            category: 'Comparison',
            label: cryptos.join(' vs '),
        }),

    aiAnalysis: (query: string) =>
        event({
            action: 'ai_analysis',
            category: 'AI',
            label: query,
        }),

    priceAlert: (crypto: string, price: number) =>
        event({
            action: 'price_alert',
            category: 'Alerts',
            label: crypto,
            value: price,
        }),
}; 