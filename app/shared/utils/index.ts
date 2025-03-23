import { Document } from '../ui/types';

// Helper functions for week navigation
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // In France, the week starts on Monday. If Sunday (0), go back 6 days.
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

export function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  return `Du ${weekStart.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })} au ${weekEnd.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })}`;
}

// Helper functions for month calculations
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStartOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date) => {
  // Return the first day of the next month
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

export const formatMonthLabel = (date: Date) => {
  const label = date.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  return capitalizeFirstLetter(label);
};

// Fonction utilitaire pour trier et grouper les documents par année
export function groupDocumentsByYear(documents: Document[]) {
  // Tri décroissant par date de modification
  const sorted = [...documents].sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
  const groups: { [year: string]: Document[] } = {};
  sorted.forEach((doc) => {
    const year = new Date(doc.modified).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(doc);
  });
  return groups;
}
