import {
    View,
    Text,
} from 'react-native';
import { StyleSheet } from 'react-native';

export function KPICard({
    icon,
    title,
    value,
    subtitle,
    accentColor = '#007AFF',
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    accentColor?: string;
}) {
    return (
        <View style={[styles.kpiCard, { borderLeftColor: accentColor }]}>
            <View style={styles.kpiIconContainer}>{icon}</View>
            <View style={styles.kpiContent}>
                <Text style={styles.kpiTitle}>{title}</Text>
                <Text style={styles.kpiValue}>{value}</Text>
                {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    kpiCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderLeftWidth: 4,
        marginBottom: 16,
    },
    kpiIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    kpiContent: {
        flex: 1,
    },
    kpiTitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 2,
    },
    kpiSubtitle: {
        fontSize: 12,
        color: '#666666',
    },
});
