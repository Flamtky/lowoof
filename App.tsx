import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from './src/Components/sidebar';

export default function App() {
  return (
    <NavigationContainer>
      <Sidebar/>
    </NavigationContainer>
  );
}
