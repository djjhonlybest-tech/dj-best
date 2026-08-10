import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Icon sf="house.fill" android="home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(studio)">
        <Icon sf="music.note.list" android="queue_music" />
        <Label>Studio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(create)">
        <Icon sf="plus.circle.fill" android="add_circle" />
        <Label>Create</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(battle)">
        <Icon sf="trophy.fill" android="emoji_events" />
        <Label>Battle</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(social)">
        <Icon sf="person.2.fill" android="group" />
        <Label>Social</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <Icon sf="person.fill" android="person" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
