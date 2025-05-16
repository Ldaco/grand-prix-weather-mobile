import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, NativeModules } from 'react-native';
// Safe Embrace instrumentation helpers
const EmbraceNative: any = NativeModules.Embrace || {};
const createSpan      = (name: string) => EmbraceNative.startSpan?.(name) ?? { end: () => {} };
const createNetworkSpan = (method: string, url: string) =>
  EmbraceNative.startNetworkSpan
    ? EmbraceNative.startNetworkSpan(method, url)
    : { endWithSuccess: () => {}, endWithError: () => {} };
const reportEvent      = (name: string, attrs?: any) => EmbraceNative.reportEvent?.(name, attrs);

// Forecast types for daily and hourly
type ForecastDaily = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
};
type ForecastHourly = {
  time: string[];
  temperature_2m: number[];
};

const RaceForecast = (): React.JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState<ForecastDaily | null>(null);
  const [hourly, setHourly] = useState<ForecastHourly | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch forecast and update timestamp
  const fetchForecast = async () => {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=44.34111&longitude=11.71333&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&start_date=2025-05-16&end_date=2025-05-18&timezone=Europe%2FBerlin';
    const netSpan: any = createNetworkSpan('GET', url);
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDaily(data.daily);
      setHourly(data.hourly);
      setLastUpdated(new Date().toLocaleString());
      netSpan.endWithSuccess();
    } catch (error) {
      netSpan.endWithError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const span: any = createSpan('RaceForecast_Load');
    fetchForecast().finally(() => span.end());
  }, []);

  // Show loading spinner
  if (loading) {
    return <ActivityIndicator />;
  }

  // Handle no data
  if (!daily || !hourly) {
    return <Text style={styles.error}>Unable to load forecast</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Race Weekend Forecast</Text>
      {lastUpdated && <Text style={styles.timestamp}>Last updated: {lastUpdated}</Text>}
      {daily.time.map((date, idx) => {
        const times = [12, 14, 16].map(h => {
          const iso = `${date}T${h.toString().padStart(2, '0')}:00`;
          const i = hourly.time.indexOf(iso);
          return { label: `${h}:00`, temp: i >= 0 ? Math.round(hourly.temperature_2m[i]) : null };
        });
        return (
          <View key={date} style={styles.dayContainer}>
            <Text style={styles.dayHeader}>{date}</Text>
            <Text style={styles.daySubheader}>
              High {Math.round(daily.temperature_2m_max[idx])}° / Low {Math.round(daily.temperature_2m_min[idx])}°
            </Text>
            <View style={styles.timesContainer}>
              {times.map(t => (
                <View key={t.label} style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>{t.label}</Text>
                  <Text style={styles.timeTemp}>{t.temp != null ? `${t.temp}°` : 'N/A'}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
      <Button
        title="Reload Forecast"
        onPress={() => {
          reportEvent('ReloadForecast', { source: 'button' });
          fetchForecast();
        }}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  dayContainer: { marginBottom: 16 },
  dayHeader: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  daySubheader: { fontSize: 16, color: 'gray', marginBottom: 8 },
  timesContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  timeBlock: { alignItems: 'center' },
  timeLabel: { fontSize: 14, color: 'gray' },
  timeTemp: { fontSize: 16, fontWeight: '500' },
  error: { color: 'red' },
  timestamp: { fontSize: 12, color: 'gray', marginBottom: 8 },
});

export default RaceForecast;
