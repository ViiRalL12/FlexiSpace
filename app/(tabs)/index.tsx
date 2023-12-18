import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import listingsData from '@/assets/data/airbnb-listings.json';
import ListingsMap from '@/components/ListingsMap';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
// Define the interface for GeoItem
interface GeoItem {
  features: any[]; // You can replace 'any[]' with the actual type of the 'features' array
}
const Page = () => {
  const items: any[] = useMemo(() => listingsData as any, []);
  const geoItems: GeoItem = useMemo(() => listingsDataGeo as GeoItem, []);
  const [category, setCategory] = useState<string>('Tiny homes');
  const onDataChanged = (newCategory: string) => {
    setCategory(newCategory);
  };

  const getFilteredItems = () => {
    switch (category) {
      case 'Houses':
        return items.slice(0, 154);
      case 'Apartments':
        return items.slice(155, 318);
      default: // 'Office' or any other category
        return items.slice(318);
    }
  };
  
  
  const getFilteredGeoItems = () => {
    switch (category) {
      case 'Houses':
        return geoItems.features.slice(0, 154);
      case 'Apartments':
        return geoItems.features.slice(155, 318);
      default: // 'Office' or any other category
        return geoItems.features.slice(318);
    }
  };
  const filteredItems = useMemo(getFilteredItems, [category, items]);
  const filteredGeoItems = useMemo(getFilteredGeoItems, [category, geoItems]);


  return (
    <View style={{ flex: 1, marginTop: 80 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <ListingsMap listings={filteredGeoItems} />
      <ListingsBottomSheet listings={filteredItems} category={category} />
    </View>
  );
};

export default Page;
