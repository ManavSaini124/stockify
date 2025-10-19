// TradingViewWidget.jsx
'use client';
import React, { useRef, memo } from 'react';
import { MARKET_OVERVIEW_WIDGET_CONFIG } from '@/lib/constants';
import useTradingViewWiget from '@/hooks/useTradingViewWiget';
import { cn } from '@/lib/utils';

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

function TradingViewWidget({title, scriptUrl, config, height, className}: TradingViewWidgetProps) {
  const containerRef = useTradingViewWiget(scriptUrl, config, height);

  return (
    <div className='w-full'>
      {title && <h2 className='text-2xl font-semibold text-gray-100 mb-5'>{title}</h2>}
      <div className={cn("tradingview-widget-container", className)} ref={containerRef} >
        <div className="tradingview-widget-container__widget" style={{ height , width: "100%" }}/>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);