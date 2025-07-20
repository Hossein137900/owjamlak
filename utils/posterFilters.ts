export const propertyTypes = {
  residential: "مسکونی",
  commercial: "تجاری",
  administrative: "اداری",
  industrial: "صنعتی",
  old: "کلنگی"
} as const;

export const tradeTypes = {
  rent: "اجاره",
  fullRent: "اجاره کامل",
  buy: "خرید",
  sell: "فروش",
  mortgage: "رهن"
} as const;

export type PropertyType = keyof typeof propertyTypes;
export type TradeType = keyof typeof tradeTypes;

export function generateFilterUrl(propertyType?: PropertyType, tradeType?: TradeType): string {
  if (!propertyType && !tradeType) {
    return "/posters/all";
  }
  
  if (propertyType && tradeType) {
    return `/posters/${propertyType}${tradeType}`;
  }
  
  if (propertyType) {
    return `/posters/${propertyType}`;
  }
  
  if (tradeType) {
    return `/posters/${tradeType}`;
  }
  
  return "/posters/all";
}

export function parseFilterFromUrl(filter: string): { propertyType?: PropertyType; tradeType?: TradeType } {
  if (!filter || filter === "all") {
    return {};
  }

  const propertyTypeKeys = Object.keys(propertyTypes) as PropertyType[];
  const tradeTypeKeys = Object.keys(tradeTypes) as TradeType[];

  // Check if it's a combined filter
  const foundPropertyType = propertyTypeKeys.find(type => filter.includes(type));
  if (foundPropertyType) {
    const remainingType = filter.replace(foundPropertyType, "");
    const foundTradeType = tradeTypeKeys.find(trade => remainingType.includes(trade));
    
    return {
      propertyType: foundPropertyType,
      tradeType: foundTradeType
    };
  }

  // Check if it's a single trade type
  const foundTradeType = tradeTypeKeys.find(trade => filter === trade);
  if (foundTradeType) {
    return { tradeType: foundTradeType };
  }

  return {};
}