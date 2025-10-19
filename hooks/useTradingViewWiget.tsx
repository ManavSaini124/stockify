"use client";

import React, {useEffect, useRef} from 'react'
const useTradingViewWiget = (scriptUrl: string, config: Record<string, unknown>, height: number = 600 ) => {
    // referncing a div
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
            // #1) div present?
            if (!containerRef.current) return;
            // #2) is it already loaded?
            if (containerRef.current.dataset.loaded) return;

            containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="height: ${height}px; width: 100%"></div>`;
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = JSON.stringify(config);
            containerRef.current.appendChild(script);
            containerRef.current.dataset.loaded = "true";

            // cleanup function-> navigate away when navigate away
            return () => {
                if(containerRef.current){
                    containerRef.current.innerHTML = '';
                    delete containerRef.current.dataset.loaded;
                }
            };
        },
        [scriptUrl, config, height]
    );

    return containerRef;
}

export default useTradingViewWiget