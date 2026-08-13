import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { DJCOLORS } from '@/constants/djverse-colors';
import { AnimatedPressable } from '@/components/AnimatedPressable';

const DJS = [
  { id: '1', name: 'DJ JHONLYBEST', genre: 'Kompa • Afrobeat', price: 150, rating: 4.9, available: true, color: '#1A0A3A', initials: 'JB' },
  { id: '2', name: 'DJ KOMPA KING', genre: 'Kompa • Caribbean', price: 200, rating: 5.0, available: true, color: '#0A1A3A', initials: 'KK' },
  { id: '3', name: 'DJ STORM', genre: 'Rabòday • Hip-Hop', price: 120, rating: 4.7, available: false, color: '#3A0A0A', initials: 'DS' },
  { id: '4', name: 'DJ NOVA', genre: 'Afro-Kompa', price: 180, rating: 4.8, available: true, color: '#1A2A0A', initials: 'DN' },
];

const EVENT_TYPES = [
  { id: 'party', label: '🎉 Party' },
  { id: 'wedding', label: '💒 Wedding' },
  { id: 'corporate', label: '🏢 Corporate' },
  { id: 'birthday', label: '🎂 Birthday' },
  { id: 'concert', label: '🎵 Concert' },
];

function generateDates() {
  const dates: { day: string; date: number; month: string; full: string }[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push({
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      full: d.toDateString(),
    });
  }
  return dates;
}

const DATES = generateDates();

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const ratingDisplay = rating.toFixed(1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Text style={{ color: DJCOLORS.gold, fontSize: 12 }}>{'★'.repeat(full)}</Text>
      <Text style={{ color: DJCOLORS.gold, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }}>
        {ratingDisplay}
      </Text>
    </View>
  );
}

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedDJ, setSelectedDJ] = useState(DJS[0]);
  const [selectedEventType, setSelectedEventType] = useState('party');
  const [selectedDate, setSelectedDate] = useState(0);
  const [startTime, setStartTime] = useState('8:00 PM');
  const [endTime, setEndTime] = useState('12:00 AM');
  const [guestCount, setGuestCount] = useState(50);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBack = () => {
    console.log('[Booking] Back button pressed');
    router.back();
  };

  const handleSelectDJ = (dj: typeof DJS[0]) => {
    console.log(`[Booking] DJ selected: ${dj.name}`);
    setSelectedDJ(dj);
  };

  const handleEventType = (type: string) => {
    console.log(`[Booking] Event type selected: ${type}`);
    setSelectedEventType(type);
  };

  const handleDateSelect = (index: number) => {
    console.log(`[Booking] Date selected: ${DATES[index].full}`);
    setSelectedDate(index);
  };

  const handleStartTime = () => {
    console.log(`[Booking] Start time pressed: ${startTime}`);
  };

  const handleEndTime = () => {
    console.log(`[Booking] End time pressed: ${endTime}`);
  };

  const handleGuestMinus = () => {
    const next = Math.max(1, guestCount - 10);
    console.log(`[Booking] Guest count decreased to ${next}`);
    setGuestCount(next);
  };

  const handleGuestPlus = () => {
    const next = guestCount + 10;
    console.log(`[Booking] Guest count increased to ${next}`);
    setGuestCount(next);
  };

  const handleBookNow = () => {
    console.log(`[Booking] BOOK NOW pressed — DJ: ${selectedDJ.name}, Event: ${selectedEventType}, Date: ${DATES[selectedDate].full}, Guests: ${guestCount}`);
  };

  // Price calculation
  const hours = 4;
  const baseRate = selectedDJ.price * hours;
  const serviceFee = Math.round(baseRate * 0.1);
  const total = baseRate + serviceFee;
  const basePriceDisplay = `$${baseRate}`;
  const serviceFeeDisplay = `$${serviceFee}`;
  const totalDisplay = `$${total}`;
  const pricePerHour = `$${selectedDJ.price}/hr`;
  const guestCountDisplay = String(guestCount);

  return (
    <View style={{ flex: 1, backgroundColor: DJCOLORS.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <AnimatedPressable onPress={handleBack}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: DJCOLORS.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: DJCOLORS.border,
                marginRight: 16,
              }}
            >
              <ArrowLeft size={20} color={DJCOLORS.text} />
            </View>
          </AnimatedPressable>
          <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.text, letterSpacing: -0.3 }}>
            BOOK A DJ
          </Text>
        </View>

        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          {/* DJ Selector */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            SELECT DJ
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, marginBottom: 20 }}
          >
            {DJS.map((dj) => {
              const isSelected = selectedDJ.id === dj.id;
              return (
                <AnimatedPressable key={dj.id} onPress={() => handleSelectDJ(dj)}>
                  <View
                    style={{
                      width: 140,
                      backgroundColor: DJCOLORS.surface,
                      borderRadius: 14,
                      padding: 12,
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? DJCOLORS.primary : DJCOLORS.border,
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: dj.color,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
                        {dj.initials}
                      </Text>
                    </View>
                    <Text style={{ color: DJCOLORS.text, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }} numberOfLines={1}>
                      {dj.name}
                    </Text>
                    <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Regular' }} numberOfLines={1}>
                      {dj.genre}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: DJCOLORS.gold, fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>
                        {pricePerHour}
                      </Text>
                      <View
                        style={{
                          backgroundColor: dj.available ? 'rgba(52,211,153,0.15)' : 'rgba(255,79,79,0.15)',
                          borderRadius: 6,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                        }}
                      >
                        <Text style={{ color: dj.available ? '#34D399' : DJCOLORS.danger, fontSize: 9, fontFamily: 'SpaceGrotesk-Bold' }}>
                          {dj.available ? 'AVAIL' : 'BUSY'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </AnimatedPressable>
              );
            })}
          </ScrollView>

          {/* Selected DJ card */}
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: `${DJCOLORS.primary}55`,
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: selectedDJ.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: DJCOLORS.primary,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' }}>
                  {selectedDJ.initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: DJCOLORS.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 2 }}>
                  {selectedDJ.name}
                </Text>
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular', marginBottom: 6 }}>
                  {selectedDJ.genre}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <StarRating rating={selectedDJ.rating} />
                  <View
                    style={{
                      backgroundColor: selectedDJ.available ? 'rgba(52,211,153,0.15)' : 'rgba(255,79,79,0.15)',
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: selectedDJ.available ? '#34D399' : DJCOLORS.danger, fontSize: 11, fontFamily: 'SpaceGrotesk-Bold' }}>
                      {selectedDJ.available ? '✓ Available' : '✗ Busy'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: DJCOLORS.gold, fontSize: 22, fontFamily: 'SpaceGrotesk-Bold' }}>
                  {pricePerHour}
                </Text>
              </View>
            </View>
          </View>

          {/* Event Type */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            EVENT TYPE
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, marginBottom: 24 }}
          >
            {EVENT_TYPES.map((type) => {
              const isActive = selectedEventType === type.id;
              return (
                <AnimatedPressable key={type.id} onPress={() => handleEventType(type.id)}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      backgroundColor: isActive ? DJCOLORS.primary : DJCOLORS.surface,
                      borderWidth: 1,
                      borderColor: isActive ? DJCOLORS.primary : DJCOLORS.border,
                    }}
                  >
                    <Text style={{ color: isActive ? '#fff' : DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' }}>
                      {type.label}
                    </Text>
                  </View>
                </AnimatedPressable>
              );
            })}
          </ScrollView>

          {/* Date picker */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            SELECT DATE
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, marginBottom: 24 }}
          >
            {DATES.map((d, i) => {
              const isSelected = selectedDate === i;
              return (
                <AnimatedPressable key={i} onPress={() => handleDateSelect(i)}>
                  <View
                    style={{
                      width: 52,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: isSelected ? DJCOLORS.primary : DJCOLORS.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? DJCOLORS.primary : DJCOLORS.border,
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Text style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Medium' }}>
                      {d.day}
                    </Text>
                    <Text style={{ color: isSelected ? '#fff' : DJCOLORS.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' }}>
                      {d.date}
                    </Text>
                    <Text style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : DJCOLORS.textSecondary, fontSize: 9, fontFamily: 'SpaceGrotesk-Regular' }}>
                      {d.month}
                    </Text>
                  </View>
                </AnimatedPressable>
              );
            })}
          </ScrollView>

          {/* Time picker */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            TIME
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
            <AnimatedPressable onPress={handleStartTime} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1, marginBottom: 4 }}>
                  START
                </Text>
                <Text style={{ color: DJCOLORS.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' }}>
                  {startTime}
                </Text>
              </View>
            </AnimatedPressable>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: DJCOLORS.textTertiary, fontSize: 18 }}>→</Text>
            </View>
            <AnimatedPressable onPress={handleEndTime} style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: DJCOLORS.surface,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: DJCOLORS.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: DJCOLORS.textSecondary, fontSize: 10, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1, marginBottom: 4 }}>
                  END
                </Text>
                <Text style={{ color: DJCOLORS.text, fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' }}>
                  {endTime}
                </Text>
              </View>
            </AnimatedPressable>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ color: DJCOLORS.textSecondary, fontSize: 13, fontFamily: 'SpaceGrotesk-Regular' }}>
              Duration: 4 hours
            </Text>
          </View>

          {/* Guest count */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            GUEST COUNT
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: DJCOLORS.surface,
              borderRadius: 14,
              padding: 4,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              marginBottom: 24,
              alignSelf: 'flex-start',
            }}
          >
            <AnimatedPressable onPress={handleGuestMinus}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: DJCOLORS.surfaceSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: DJCOLORS.text, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' }}>−</Text>
              </View>
            </AnimatedPressable>
            <View style={{ paddingHorizontal: 24 }}>
              <Text style={{ color: DJCOLORS.text, fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', fontVariant: ['tabular-nums'] }}>
                {guestCountDisplay}
              </Text>
            </View>
            <AnimatedPressable onPress={handleGuestPlus}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: DJCOLORS.surfaceSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: DJCOLORS.text, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' }}>+</Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Location */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
            LOCATION
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Event location..."
            placeholderTextColor={DJCOLORS.textTertiary}
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: DJCOLORS.text,
              fontSize: 15,
              fontFamily: 'SpaceGrotesk-Regular',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              marginBottom: 20,
            }}
          />

          {/* Notes */}
          <Text style={{ fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', color: DJCOLORS.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
            NOTES
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or notes..."
            placeholderTextColor={DJCOLORS.textTertiary}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: DJCOLORS.text,
              fontSize: 15,
              fontFamily: 'SpaceGrotesk-Regular',
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              marginBottom: 24,
              minHeight: 80,
              textAlignVertical: 'top',
            }}
          />

          {/* Price summary */}
          <View
            style={{
              backgroundColor: DJCOLORS.surface,
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: DJCOLORS.border,
              gap: 10,
            }}
          >
            <Text style={{ color: DJCOLORS.text, fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 4 }}>
              💰 Price Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' }}>
                Base rate × 4 hours
              </Text>
              <Text style={{ color: DJCOLORS.text, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
                {basePriceDisplay}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: DJCOLORS.textSecondary, fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' }}>
                Service fee (10%)
              </Text>
              <Text style={{ color: DJCOLORS.text, fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' }}>
                {serviceFeeDisplay}
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: DJCOLORS.border }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: DJCOLORS.text, fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' }}>
                Total
              </Text>
              <Text style={{ color: DJCOLORS.gold, fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' }}>
                {totalDisplay}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Book Now button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 16,
          backgroundColor: DJCOLORS.background,
          borderTopWidth: 1,
          borderTopColor: DJCOLORS.border,
        }}
      >
        <AnimatedPressable onPress={handleBookNow}>
          <LinearGradient
            colors={[DJCOLORS.primary, DJCOLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 0.5 }}>
              BOOK NOW — {totalDisplay}
            </Text>
          </LinearGradient>
        </AnimatedPressable>
      </View>
    </View>
  );
}
