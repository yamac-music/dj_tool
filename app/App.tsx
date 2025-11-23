import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react-native';

const colors = {
  background: '#020617',
  surface: '#070f26',
  panel: '#0b1228',
  cyan: '#06b6d4',
  magenta: '#d946ef',
  danger: '#fb7185',
};

type LoopMode = 'threeFour' | 'half';

const PRESET_MINUTES = [30, 45, 60] as const;
const DEFAULT_PRESET = PRESET_MINUTES[1];
const TIMER_DANGER_THRESHOLD = 5 * 60;
const LOOP_MODES: Record<LoopMode, { label: string; factor: number }> = {
  threeFour: { label: '3/4 Loop', factor: 4 / 3 },
  half: { label: '1/2 Loop', factor: 2 },
};

const formatTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const formatClock = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const defaultSeconds = DEFAULT_PRESET * 60;
  const [initialTime, setInitialTime] = useState(defaultSeconds);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    DEFAULT_PRESET,
  );
  const [baseBpm, setBaseBpm] = useState(135);
  const [loopMode, setLoopMode] = useState<LoopMode>('threeFour');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const handlePresetPress = (minutes: number) => {
    const seconds = minutes * 60;
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setHasStarted(false);
    setSelectedPreset(minutes);
  };

  const handleAdjust = (deltaMinutes: number) => {
    const deltaSeconds = deltaMinutes * 60;
    setTimeLeft((prev) => {
      const next = Math.max(0, prev + deltaSeconds);
      if (!hasStarted && !isRunning) {
        setInitialTime(next);
      }
      return next;
    });
    setSelectedPreset(null);
  };

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
    }
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        setHasStarted(true);
      }
      return next;
    });
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleBaseAdjust = (delta: number) => {
    setBaseBpm((prev) => {
      const next = parseFloat((prev + delta).toFixed(1));
      return Math.min(180, Math.max(70, next));
    });
  };

  const timerString = useMemo(() => formatTime(timeLeft), [timeLeft]);
  const progress = initialTime === 0 ? 0 : timeLeft / initialTime;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const progressWidth = `${(clampedProgress * 100).toFixed(1)}%` as `${number}%`;
  const targetBpmDisplay = useMemo(
    () => (baseBpm * LOOP_MODES[loopMode].factor).toFixed(1),
    [baseBpm, loopMode],
  );
  const timerIsDanger = timeLeft <= TIMER_DANGER_THRESHOLD;
  const headerTime = useMemo(() => formatClock(now), [now]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerLabel}>LIVE TOOLKIT</Text>
              <Text style={styles.headerTitle}>DJ TOOLKIT</Text>
            </View>
            <Text style={styles.headerClock}>{headerTime}</Text>
          </View>

        <View style={[styles.timerCard, styles.weightMain]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>REMAINING TIME</Text>
            <View style={styles.presetRow}>
              {PRESET_MINUTES.map((preset, index) => {
                const isActive =
                  selectedPreset === preset && !hasStarted && !isRunning;
                return (
                  <TouchableOpacity
                    key={preset}
                    activeOpacity={0.85}
                    style={[
                      styles.presetButton,
                      index !== 0 && styles.presetSpacing,
                      isActive && styles.presetButtonActive,
                    ]}
                    onPress={() => handlePresetPress(preset)}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        isActive && styles.presetTextActive,
                      ]}
                    >
                      {preset}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.timerDisplay}>
            <Text
              style={[
                styles.timerText,
                timerIsDanger && { color: colors.danger },
              ]}
            >
              {timerString}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                  backgroundColor: timerIsDanger ? colors.danger : colors.cyan,
                },
              ]}
            />
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleAdjust(-1)}
              style={styles.circleButton}
            >
              <Minus color="white" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStartPause}
              style={[styles.playButton, isRunning && styles.pauseButton]}
            >
              {isRunning ? (
                <Pause color="#020617" size={40} strokeWidth={2.6} />
              ) : (
                <Play color="#020617" size={42} strokeWidth={2.6} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleAdjust(1)}
              style={styles.circleButton}
            >
              <Plus color="white" size={30} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.resetButton}
            onPress={handleReset}
          >
            <RotateCcw color="white" size={18} />
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.bpmRow, styles.weightSub]}>
          <View style={styles.bpmColumn}>
            <Text style={styles.sectionLabel}>BASE BPM</Text>
            <View style={styles.bpmValueContainer}>
              <Text style={styles.baseValue}>{baseBpm.toFixed(1)}</Text>
            </View>
            <View style={styles.baseAdjustRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.baseAdjustButton}
                onPress={() => handleBaseAdjust(-0.5)}
              >
                <Minus color="#ffffff" size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.baseAdjustButton}
                onPress={() => handleBaseAdjust(0.5)}
              >
                <Plus color="#ffffff" size={16} />
              </TouchableOpacity>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={70}
              maximumValue={180}
              step={0.5}
              minimumTrackTintColor={colors.cyan}
              maximumTrackTintColor="#1f2937"
              thumbTintColor={colors.cyan}
              value={baseBpm}
              onValueChange={(value) =>
                setBaseBpm(parseFloat(value.toFixed(1)))
              }
            />
          </View>

          <View style={styles.loopColumn}>
            {Object.entries(LOOP_MODES).map(([key, config]) => {
              const loopKey = key as LoopMode;
              const isActive = loopMode === loopKey;
              return (
                <TouchableOpacity
                  key={loopKey}
                  activeOpacity={0.85}
                  onPress={() => setLoopMode(loopKey)}
                  style={[
                    styles.loopButton,
                    isActive && styles.loopButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.loopText,
                      isActive && styles.loopTextActive,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.bpmColumn, styles.targetCard]}>
            <Text style={[styles.sectionLabel, styles.targetLabel]}>TARGET BPM</Text>
            <View style={[styles.bpmValueContainer, styles.targetValueContainer]}>
              <Text style={styles.targetValue}>{targetBpmDisplay}</Text>
            </View>
            <View style={[styles.loopTag, styles.loopTagRight]}>
              <Text style={styles.loopTagText}>
                LOOP x{LOOP_MODES[loopMode].factor.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
    fontSize: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  headerClock: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sections: {
    flex: 1,
  },
  weightMain: {
    flex: 0.65,
  },
  weightSub: {
    flex: 0.35,
  },
  timerCard: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'space-between',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3,
    fontSize: 11,
  },
  presetRow: {
    flexDirection: 'row',
  },
  presetButton: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  presetSpacing: {
    marginLeft: 10,
  },
  presetButtonActive: {
    backgroundColor: 'rgba(6,182,212,0.2)',
    borderWidth: 1,
    borderColor: colors.cyan,
  },
  presetText: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  presetTextActive: {
    color: colors.cyan,
  },
  targetLabel: {
    textAlign: 'right',
  },
  timerDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
  },
  timerText: {
    color: 'white',
    fontSize: 132,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
  },
  pauseButton: {
    backgroundColor: colors.magenta,
  },
  resetButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  resetText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 1,
  },
  bpmRow: {
    flexDirection: 'row',
    marginTop: 16,
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'stretch',
  },
  bpmColumn: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  bpmValueContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 140,
  },
  baseAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  baseAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseValue: {
    color: 'white',
    fontSize: 34,
    marginTop: 24,
    fontWeight: '600',
    textAlign: 'left',
  },
  slider: {
    width: '150%',
  },
  loopColumn: {
    width: 80,
    justifyContent: 'space-evenly',
    paddingVertical: 4,
  },
  loopButton: {
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    marginVertical: 6,
  },
  loopButtonActive: {
    borderColor: colors.magenta,
    backgroundColor: 'rgba(217,70,239,0.15)',
  },
  loopText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  loopTextActive: {
    color: colors.magenta,
  },
  targetCard: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  targetValueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    minHeight: 140,
  },
  targetValue: {
    color: colors.magenta,
    fontSize: 34,
    fontWeight: '600',
    textAlign: 'right',
  },
  loopTag: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(217,70,239,0.4)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  loopTagRight: {
    alignSelf: 'flex-end',
    marginBottom:  8,
  },
  loopTagText: {
    color: colors.magenta,
    fontSize: 10,
    fontWeight: '200',
  },
});
