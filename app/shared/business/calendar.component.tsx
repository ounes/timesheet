import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import theme from '../ui/theme';
import {
  formatMonthLabel,
  formatWeekLabel,
  getStartOfMonth,
  getStartOfWeek,
} from '../utils';

interface CustomCalendarProps {
  initialDate?: Date;
  initialViewMode?: 'week' | 'month';
  onDateChange?: (date: Date) => void;
  onViewModeChange?: (mode: 'week' | 'month') => void;
}

interface YearCarouselProps {
  year: number;
  onChangeYear: (newYear: number) => void;
}

function YearCarousel({ year, onChangeYear }: YearCarouselProps) {
  return (
    <View style={styles.yearCarouselContainer}>
      <Pressable
        onPress={() => onChangeYear(year - 1)}
        style={styles.yearArrow}
      >
        <ChevronLeft size={24} color={theme.colors.primary} />
      </Pressable>
      <Text style={styles.yearText}>{year}</Text>
      <Pressable
        onPress={() => onChangeYear(year + 1)}
        style={styles.yearArrow}
      >
        <ChevronRight size={24} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
}

interface MonthPickerProps {
  selectedDate: Date;
  onSelectMonth: (month: number) => void;
}

function MonthPicker({ selectedDate, onSelectMonth }: MonthPickerProps) {
  const year = selectedDate.getFullYear();
  return (
    <View style={styles.monthPickerContainer}>
      {Array.from({ length: 12 }, (_, index) => {
        const monthName = new Date(year, index, 1).toLocaleString('fr', {
          month: 'long',
        });
        const isSelected = selectedDate.getMonth() === index;
        return (
          <Pressable
            key={index}
            onPress={() => onSelectMonth(index)}
            style={[styles.monthItem, isSelected && styles.monthItemSelected]}
          >
            <Text
              style={[
                styles.monthItemText,
                isSelected && styles.monthItemTextSelected,
              ]}
            >
              {monthName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CustomCalendar({
  initialDate = new Date(),
  initialViewMode = 'week',
  onDateChange,
  onViewModeChange,
}: CustomCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [viewMode, setViewMode] = useState<'week' | 'month'>(initialViewMode);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Compute the start and end dates of the selected period.
  const selectedStart = useMemo(
    () =>
      viewMode === 'week'
        ? getStartOfWeek(selectedDate)
        : getStartOfMonth(selectedDate),
    [viewMode, selectedDate]
  );

  // Mark dates for week view
  const markedDates = useMemo(() => {
    if (viewMode === 'week') {
      const marked: { [key: string]: any } = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(selectedStart);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        marked[dateString] = {
          selected: true,
          selectedColor: theme.colors.primary,
        };
      }
      return marked;
    } else {
      const dateString = selectedDate.toISOString().split('T')[0];
      return {
        [dateString]: { selected: true, selectedColor: theme.colors.primary },
      };
    }
  }, [viewMode, selectedStart, selectedDate]);

  // Navigation handlers for previous/next period
  const handlePrevious = () => {
    let newDate: Date;
    if (viewMode === 'week') {
      newDate = new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        1
      );
    }
    setSelectedDate(newDate);
    onDateChange && onDateChange(newDate);
  };

  const handleNext = () => {
    let newDate: Date;
    if (viewMode === 'week') {
      newDate = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        1
      );
    }
    setSelectedDate(newDate);
    onDateChange && onDateChange(newDate);
  };

  // When a day is pressed on the inline calendar.
  const onDayPress = (day: { dateString: string }) => {
    const newDate = new Date(day.dateString);
    setSelectedDate(newDate);
    setIsCalendarVisible(false);
    onDateChange && onDateChange(newDate);
  };

  // Reset to current date.
  const resetToCurrent = () => {
    const newDate = new Date();
    setSelectedDate(newDate);
    setIsCalendarVisible(false);
    onDateChange && onDateChange(newDate);
  };

  const onSelectMonth = (monthIndex: number) => {
    const updatedDate = new Date(selectedDate.getFullYear(), monthIndex, 1);
    setSelectedDate(updatedDate);
    setIsCalendarVisible(false);
    onDateChange && onDateChange(updatedDate);
  };

  const onChangeYear = (newYear: number) => {
    const updatedDate = new Date(newYear, selectedDate.getMonth(), 1);
    setSelectedDate(updatedDate);
    onDateChange && onDateChange(updatedDate);
  };

  return (
    <View style={styles.container}>
      {/* Toggle between Week and Month views */}
      <View style={styles.calendarControls}>
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleButton,
              viewMode === 'week' && styles.toggleButtonActive,
            ]}
            onPress={() => {
              setViewMode('week');
              onViewModeChange && onViewModeChange('week');
              setIsCalendarVisible(false);
            }}
          >
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === 'week' && styles.toggleButtonTextActive,
              ]}
            >
              Semaine
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              viewMode === 'month' && styles.toggleButtonActive,
            ]}
            onPress={() => {
              setViewMode('month');
              onViewModeChange && onViewModeChange('month');
              setIsCalendarVisible(false);
            }}
          >
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === 'month' && styles.toggleButtonTextActive,
              ]}
            >
              Mois
            </Text>
          </Pressable>
        </View>
        <Pressable style={styles.resetButton} onPress={resetToCurrent}>
          <Text style={styles.resetButtonText}>
            {viewMode === 'week' ? 'Cette semaine' : 'Ce mois'}
          </Text>
        </Pressable>
      </View>

      {/* Calendar Navigation & Label */}
      {!isCalendarVisible && (
        <View style={styles.calendarHeader}>
          <Pressable onPress={handlePrevious} style={styles.navButton}>
            <ChevronLeft size={24} color={theme.colors.primary} />
          </Pressable>
          <Pressable onPress={() => setIsCalendarVisible(true)}>
            <Text style={styles.periodLabel}>
              {viewMode === 'week'
                ? formatWeekLabel(selectedStart)
                : formatMonthLabel(selectedStart)}
            </Text>
          </Pressable>
          <Pressable onPress={handleNext} style={styles.navButton}>
            <ChevronRight size={24} color={theme.colors.primary} />
          </Pressable>
        </View>
      )}

      {/* Inline Calendar or Month Picker */}
      {isCalendarVisible && (
        <View style={styles.calendarContainer}>
          {viewMode === 'week' ? (
            <Calendar
              firstDay={1}
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: theme.colors.background,
                calendarBackground: theme.colors.background,
                textSectionTitleColor: theme.colors.textPrimary,
                dayTextColor: theme.colors.textPrimary,
                monthTextColor: theme.colors.textPrimary,
                selectedDayBackgroundColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
            />
          ) : (
            <>
              <YearCarousel
                year={selectedDate.getFullYear()}
                onChangeYear={onChangeYear}
              />
              <MonthPicker
                selectedDate={selectedDate}
                onSelectMonth={onSelectMonth}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 16 },
  calendarControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  toggleContainer: { flexDirection: 'row' },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: theme.colors.cardBackground,
    marginRight: 8,
  },
  toggleButtonActive: { backgroundColor: theme.colors.primary },
  toggleButtonText: { fontSize: 16, color: theme.colors.textPrimary },
  toggleButtonTextActive: { color: theme.colors.background, fontWeight: '600' },
  resetButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  resetButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  navButton: { padding: 8 },
  periodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  calendarContainer: { marginVertical: 8 },
  yearCarouselContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  yearArrow: { padding: 8 },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  monthPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthItem: {
    width: '30%',
    padding: 12,
    marginVertical: 6,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 4,
    alignItems: 'center',
  },
  monthItemSelected: { backgroundColor: theme.colors.primary },
  monthItemText: { fontSize: 16, color: theme.colors.textPrimary },
  monthItemTextSelected: { color: theme.colors.background, fontWeight: '600' },
});
