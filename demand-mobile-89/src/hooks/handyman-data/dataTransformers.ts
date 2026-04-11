
export const cleanSkillRates = (skillRates: any[]) => {
  return Array.isArray(skillRates) 
    ? skillRates.map((item: any) => ({
        ...item,
        hourly_rate: Number(item.hourly_rate) || 0,
        minimum_hours: Number(item.minimum_hours) || 1,
        same_day_rate_multiplier: Number(item.same_day_rate_multiplier) || 1.5,
        emergency_rate_multiplier: Number(item.emergency_rate_multiplier) || 2.0,
        is_active: Boolean(item.is_active)
      }))
    : [];
};

export const cleanServicePricing = (servicePricing: any[]) => {
  return Array.isArray(servicePricing) 
    ? servicePricing.map((item: any) => ({
        ...item,
        base_price: Number(item.base_price) || 0,
        custom_price: item.custom_price ? Number(item.custom_price) : null,
        same_day_multiplier: Number(item.same_day_multiplier) || 1.5,
        emergency_multiplier: Number(item.emergency_multiplier) || 2.0,
        is_active: Boolean(item.is_active)
      }))
    : [];
};

export const cleanWorkAreas = (workAreas: any[]) => {
  return Array.isArray(workAreas) 
    ? workAreas.map((item: any) => ({
        ...item,
        center_latitude: Number(item.center_latitude) || 0,
        center_longitude: Number(item.center_longitude) || 0,
        radius_miles: Number(item.radius_miles) || 25,
        is_active: Boolean(item.is_active),
        is_primary: Boolean(item.is_primary)
      }))
    : [];
};
