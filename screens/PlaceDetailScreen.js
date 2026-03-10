import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, Linking, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Design System ────────────────────────────────────────────────────────────
const COLORS = {
  primary:   '#1A56DB',
  white:     '#FFFFFF',
  dark:      '#0D0D0D',
  card:      '#1C1C1E',
  border:    '#2C2C2E',
  textLight: '#F2F2F7',
  textGray:  '#8E8E93',
};

const CATEGORY = {
  History: { bg: 'rgba(245,166,35,0.15)',  text: '#F5A623' },
  Culture: { bg: 'rgba(79,195,247,0.15)',  text: '#4FC3F7' },
  Modern:  { bg: 'rgba(41,182,246,0.15)',  text: '#29B6F6' },
  Nature:  { bg: 'rgba(102,187,106,0.15)', text: '#66BB6A' },
  Sacred:  { bg: 'rgba(206,147,216,0.15)', text: '#CE93D8' },
  City:    { bg: 'rgba(174,174,178,0.1)',  text: '#AEAEB2' },
};

// ─── Action Row Item ──────────────────────────────────────────────────────────
function ActionRow({ iconName, iconColor, iconBg, title, subtitle, onPress, isLast }) {
  return (
    <TouchableOpacity
      style={[styles.actionRow, isLast && styles.actionRowLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: iconBg }]}>
        {iconName === 'W'
          ? <Text style={styles.wikiIconText}>W</Text>
          : <Feather name={iconName} size={18} color={iconColor} />
        }
      </View>
      <View style={styles.actionInfo}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSub}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={COLORS.textGray} />
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PlaceDetailScreen({ route, navigation }) {
  const { place } = route.params;
  const insets = useSafeAreaInsets();
  const [saved, setSaved]           = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const cat = CATEGORY[place.category] ?? CATEGORY.City;

  // ── Handlers ──
  const handleNavigate = useCallback(() => {
    const { latitude, longitude, name } = place;
    const label = encodeURIComponent(name);
    const url = Platform.select({
      ios:     `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });
    Linking.canOpenURL(url)
      .then(ok =>
        Linking.openURL(
          ok ? url : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        )
      )
      .catch(console.error);
  }, [place]);

  const handleTicket    = useCallback(() => Linking.openURL(place.ticketUrl), [place.ticketUrl]);
  const handleWikipedia = useCallback(() => Linking.openURL(place.wikipediaLink), [place.wikipediaLink]);
  const handleAskAI     = useCallback(() => navigation.navigate('AIScreen', { place }), [place]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Image source={place.photo} style={styles.heroImage} resizeMode="cover" />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.heroGradient}
          />

          {/* Top bar */}
          <View style={[styles.heroTop, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={20} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.heroTopRight}>
              <TouchableOpacity style={styles.iconCircle} onPress={() => setSaved(v => !v)}>
                <Feather name="heart" size={17} color={saved ? '#E63946' : COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle} onPress={() => setBookmarked(v => !v)}>
                <Feather name="bookmark" size={17} color={bookmarked ? COLORS.primary : COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Feather name="more-horizontal" size={17} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom of hero — name + badge */}
          <View style={styles.heroBottom}>
            <View style={styles.heroBottomLeft}>
              <Text style={styles.heroName}>{place.name}</Text>
              <Text style={styles.heroCity}>📍 {place.city}</Text>
            </View>
            {place.category && (
              <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
                <Text style={[styles.catText, { color: cat.text }]}>{place.category}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>

          {/* Tags */}
          {place.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {place.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>
            {place.detailedDescription || place.description}
          </Text>

          {/* Info Card */}
          {(place.openingHours || place.address) && (
            <View style={styles.infoCard}>
              {place.openingHours && (
                <View style={styles.infoRow}>
                  <Feather name="clock" size={14} color={COLORS.primary} />
                  <Text style={styles.infoText}>{place.openingHours}</Text>
                </View>
              )}
              {place.address && (
                <View style={styles.infoRow}>
                  <Feather name="map-pin" size={14} color={COLORS.primary} />
                  <Text style={styles.infoText}>{place.address}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Feather
                  name="tag"
                  size={14}
                  color={place.isFree ? '#66BB6A' : COLORS.textGray}
                />
                <Text style={[
                  styles.infoText,
                  { color: place.isFree ? '#66BB6A' : COLORS.textGray }
                ]}>
                  {place.isFree ? 'Free entry' : 'Paid entry'}
                </Text>
              </View>
            </View>
          )}

          {/* ── Actions ── */}
          <View style={styles.actionList}>
            <ActionRow
              iconName="navigation"
              iconColor={COLORS.primary}
              iconBg="rgba(26,86,219,0.12)"
              title="Navigate"
              subtitle="Open in Maps"
              onPress={handleNavigate}
            />
            {place.ticketUrl && (
              <ActionRow
                iconName="tag"
                iconColor="#F5A623"
                iconBg="rgba(245,166,35,0.12)"
                title="Buy Ticket"
                subtitle="via iTicket.az"
                onPress={handleTicket}
              />
            )}
            {place.wikipediaLink && (
              <ActionRow
                iconName="W"
                iconColor={COLORS.textLight}
                iconBg="rgba(255,255,255,0.07)"
                title="Learn More"
                subtitle="Wikipedia"
                onPress={handleWikipedia}
              />
            )}
            <ActionRow
              iconName="zap"
              iconColor="#66BB6A"
              iconBg="rgba(102,187,106,0.12)"
              title="Ask AI"
              subtitle="Get insights about this place"
              onPress={handleAskAI}
              isLast
            />
          </View>

        </View>

        {/* Space for sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Add to Trip ── */}
      <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.addTripBtn} activeOpacity={0.85}>
          <Feather name="plus-circle" size={19} color={COLORS.white} />
          <Text style={styles.addTripText}>Add to Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  // Hero
  hero: {
    width: '100%',
    height: 340,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 200,
  },
  heroTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  heroTopRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    position: 'absolute',
    bottom: 16, left: 16, right: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroBottomLeft: {
    flex: 1,
    marginRight: 10,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 28,
    marginBottom: 4,
  },
  heroCity: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Content
  content: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textGray,
  },

  // Description
  description: {
    fontSize: 15,
    lineHeight: 27,
    color: 'rgba(242,242,247,0.82)',
    marginBottom: 20,
  },

  // Info card
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },

  // Action list
  actionList: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionRowLast: {
    borderBottomWidth: 0,
  },
  actionIcon: {
    width: 38, height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: { flex: 1 },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  wikiIconText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textLight,
  },

  // Sticky bottom
  stickyBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(13,13,13,0.96)',
    borderTopWidth: 1,
    borderTopColor: COLORS.card,
  },
  addTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
  },
  addTripText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});