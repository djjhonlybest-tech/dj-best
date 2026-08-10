import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Home, Flame, Plus, Headphones, User } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { usePathname } from 'expo-router';

const tabs = [
  { name: '(home)', label: 'Home', Icon: Home },
  { name: '(search)', label: 'Discover', Icon: Flame },
  { name: '(create)', label: 'Create', Icon: Plus },
  { name: '(dj)', label: 'DJ', Icon: Headphones },
  { name: '(profile)', label: 'Profile', Icon: User },
];

function DJTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <BlurView
      intensity={60}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom,
        borderTopWidth: 1,
        borderTopColor: DJCOLORS.border,
        backgroundColor: 'rgba(10,10,15,0.85)',
      }}
    >
      <View style={{ flexDirection: 'row', height: 60 }}>
        {state.routes.map((route: any, index: number) => {
          const tab = tabs[index];
          if (!tab) return null;
          const isFocused = state.index === index;
          const isCreate = tab.name === '(create)';

          const onPress = () => {
            console.log(`[Tab] Pressed: ${tab.label}`);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconColor = isFocused ? DJCOLORS.primary : DJCOLORS.textSecondary;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
              }}
              activeOpacity={0.7}
            >
              {isCreate ? (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: DJCOLORS.primaryMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: DJCOLORS.primary,
                  }}
                >
                  <tab.Icon size={20} color={DJCOLORS.primary} />
                </View>
              ) : (
                <>
                  <tab.Icon size={22} color={iconColor} />
                  <Text
                    style={{
                      fontSize: 10,
                      color: iconColor,
                      fontWeight: isFocused ? '600' : '400',
                      fontFamily: 'SpaceGrotesk-Medium',
                    }}
                  >
                    {tab.label}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <DJTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="(home)" options={{ title: 'Home' }} />
      <Tabs.Screen name="(search)" options={{ title: 'Search' }} />
      <Tabs.Screen name="(create)" options={{ title: 'Create' }} />
      <Tabs.Screen name="(dj)" options={{ title: 'DJ' }} />
      <Tabs.Screen name="(profile)" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
