import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Icon sf="house.fill" android="home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)">
        <Icon sf="magnifyingglass" android="search" />
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(create)">
        <Icon sf="plus.circle.fill" android="add_circle" />
        <Label>Create</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(dj)">
        <Icon sf="headphones" android="headphones" />
        <Label>DJ</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <Icon sf="person.fill" android="person" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
