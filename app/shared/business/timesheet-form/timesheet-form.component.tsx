import {
    View,
    Text,
    ScrollView,
    Pressable,
    TextInput,
    Platform,
    Switch,
} from 'react-native';
import {
    Calendar,
    Save,
    X,
    ChevronDown,
    Building2,
    Info,
} from 'lucide-react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '@/store/auth';
import { StyleSheet } from 'react-native';
import { Site, TimesheetFormData, Trajet, Transport } from '../../types';

export function TimesheetForm({
    onSubmit,
    onCancel,
    initialData,
    sites,
    trajets,
    transports
}: {
    onSubmit: (data: TimesheetFormData) => void;
    onCancel: () => void;
    initialData?: TimesheetFormData | null;
    sites: Site[];
    trajets: Trajet[];
    transports: Transport[];
}) {
    const agencyId = useAuthStore((state) => state.agencyId);
    const filteredSites = sites.filter((site) => agencyId === site.agencyId);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showSiteSelector, setShowSiteSelector] = useState(false);
    const [showTrajetSelector, setShowTrajetSelector] = useState(false);
    const [showTransportSelector, setShowTransportSelector] = useState(false);

    const [formData, setFormData] = useState<TimesheetFormData>({
        date: initialData ? new Date(initialData.date) : new Date(),
        siteId: initialData?.siteId || '',
        hours: initialData?.hours || 0,
        hoursSup: initialData?.hoursSup || 0,
        notes: initialData?.notes || '',
        panier: initialData?.panier || false,
        status: initialData?.status || '',
        trajetId: initialData?.trajetId || '',
        transportId: initialData?.transportId || '',
        workerId: initialData?.workerId,
    });

    const selectedSite = filteredSites.find((site) => site.id === formData.siteId);
    const selectedTrajet = trajets.find(
        (trajet) => trajet.id === formData.trajetId
    );
    const selectedTransport = transports.find(
        (transport) => transport.id === formData.transportId
    );

    const handleSubmit = () => {
        if (!formData.hours || !formData.siteId) return;
        onSubmit({
            ...formData,
            id: initialData?.id,
        });
    };

    return (
        <View style={styles.formCard}>
            <Text style={styles.formTitle}>
                {initialData
                    ? 'Modifier la Feuille de Temps'
                    : 'Nouvelle Feuille de Temps'}
            </Text>

            <Pressable
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Calendar size={20} color="#666666" />
                <Text style={styles.datePickerText}>
                    {typeof formData.date !== 'string'
                        ? formData.date.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })
                        : formData.date}
                </Text>
            </Pressable>

            {showDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={typeof formData.date == 'string' ? new Date(formData.date) : formData.date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate)
                            setFormData((prev) => ({ ...prev, date: selectedDate }));
                    }}
                />
            )}

            {Platform.OS === 'web' && showDatePicker && (
                <input
                    type="date"
                    value={formData.date.toLocaleString().split('T')[0]}
                    onChange={(e) => {
                        setFormData((prev) => ({
                            ...prev,
                            date: new Date(e.target.value),
                        }));
                        setShowDatePicker(false);
                    }}
                    style={{
                        fontSize: 16,
                        padding: 8,
                        marginBottom: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                    }}
                />
            )}

            {/* Inline Site selector */}
            <View style={styles.formRow}>
                <View style={styles.formLabelContainer}>
                    <Text style={styles.formLabel}>Site de Travail</Text>
                    <View style={styles.infoContainer}>
                        <Info size={16} color="#666666" />
                        <Text style={styles.infoText}>
                            Sélectionnez le site où vous avez travaillé
                        </Text>
                    </View>
                </View>
                <Pressable
                    style={[
                        styles.siteSelector,
                        !formData.siteId && styles.siteSelectorEmpty,
                    ]}
                    onPress={() => setShowSiteSelector(!showSiteSelector)}
                >
                    {selectedSite ? (
                        <View style={styles.selectedSiteContent}>
                            <Building2 size={30} color="#333333" />
                            <View style={styles.selectedSiteInfo}>
                                <Text style={styles.siteSelectorText}>{selectedSite.name}</Text>
                                <Text style={styles.siteAddress}>
                                    {selectedSite.type} • {selectedSite.address}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.siteSelectorPlaceholder}>
                            Sélectionner votre site de travail
                        </Text>
                    )}
                    <ChevronDown size={20} color="#666666" />
                </Pressable>
                {showSiteSelector && (
                    <ScrollView style={styles.selectorList} nestedScrollEnabled>
                        {filteredSites.map((site) => (
                            <Pressable
                                key={site.id}
                                style={[
                                    styles.siteOption,
                                    site.id === formData.siteId && styles.siteOptionActive,
                                ]}
                                onPress={() => {
                                    setFormData((prev) => ({ ...prev, siteId: site.id }));
                                    setShowSiteSelector(false);
                                }}
                            >
                                <Building2
                                    size={20}
                                    color={site.id === formData.siteId ? '#007AFF' : '#666666'}
                                />
                                <View style={styles.siteOptionContent}>
                                    <Text
                                        style={[
                                            styles.siteOptionText,
                                            site.id === formData.siteId && styles.siteOptionSelected,
                                        ]}
                                    >
                                        {site.name}
                                    </Text>
                                    <Text style={styles.siteOptionAddress}>
                                        {site.type} • {site.address}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Heures</Text>
                <TextInput
                    style={styles.formInput}
                    value={formData.hours.toString()}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, hours: parseFloat(value) }))
                    }
                    keyboardType="numeric"
                    placeholder="0.0"
                    maxLength={4}
                />
            </View>

            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Heures de nuit</Text>
                <TextInput
                    style={styles.formInput}
                    value={formData.hoursSup.toString()}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, hoursSup: parseFloat(value) }))
                    }
                    keyboardType="numeric"
                    placeholder="0.0"
                    maxLength={4}
                />
            </View>

            {/* Panier Checkbox */}
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Panier</Text>
                <Switch
                    value={formData.panier}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, panier: value }))
                    }
                />
            </View>

            {/* Inline Trajet selector */}
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Trajet</Text>
                <Pressable
                    style={[
                        styles.siteSelector,
                        !formData.trajetId && styles.siteSelectorEmpty,
                    ]}
                    onPress={() => setShowTrajetSelector(!showTrajetSelector)}
                >
                    {selectedTrajet ? (
                        <View style={styles.selectorContent}>
                            <Text style={styles.siteSelectorText}>
                                {selectedTrajet.label}
                            </Text>

                        </View>
                    ) : (
                        <Text style={styles.siteSelectorPlaceholder}>
                            Sélectionner un trajet (optionnel)
                        </Text>
                    )}
                    {selectedTrajet ? (
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({ ...prev, trajetId: '' }));
                            }}
                            style={styles.clearButton}
                        >
                            <X size={16} color="#666666" />
                        </Pressable>
                    ) : (
                        <ChevronDown size={20} color="#666666" />
                    )}
                </Pressable>
                {showTrajetSelector && (
                    <ScrollView style={styles.selectorList} nestedScrollEnabled>
                        {trajets.map((trajet) => (
                            <Pressable
                                key={trajet.id}
                                style={[
                                    styles.siteOption,
                                    trajet.id === formData.trajetId && styles.siteOptionActive,
                                ]}
                                onPress={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        trajetId: trajet.id,
                                    }));
                                    setShowTrajetSelector(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.siteOptionText,
                                        trajet.id === formData.trajetId && styles.siteOptionSelected,
                                    ]}
                                >
                                    {trajet.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Inline Transport selector */}
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Transport</Text>
                <Pressable
                    style={[
                        styles.siteSelector,
                        !formData.transportId && styles.siteSelectorEmpty,
                    ]}
                    onPress={() => setShowTransportSelector(!showTransportSelector)}
                >
                    {selectedTransport ? (
                        <View style={styles.selectorContent}>
                            <Text style={styles.siteSelectorText}>
                                {selectedTransport.label}
                            </Text>

                        </View>
                    ) : (
                        <Text style={styles.siteSelectorPlaceholder}>
                            Sélectionner un transport (optionnel)
                        </Text>
                    )}
                    {selectedTransport ? (
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({ ...prev, transportId: '' }));
                            }}
                            style={styles.clearButton}
                        >
                            <X size={16} color="#666666" />
                        </Pressable>
                    ) : (
                        <ChevronDown size={20} color="#666666" />
                    )}
                </Pressable>
                {showTransportSelector && (
                    <ScrollView style={styles.selectorList} nestedScrollEnabled>
                        {transports.map((transport) => (
                            <Pressable
                                key={transport.id}
                                style={[
                                    styles.siteOption,
                                    transport.id === formData.transportId &&
                                    styles.siteOptionActive,
                                ]}
                                onPress={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        transportId: transport.id,
                                    }));
                                    setShowTransportSelector(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.siteOptionText,
                                        transport.id === formData.transportId &&
                                        styles.siteOptionSelected,
                                    ]}
                                >
                                    {transport.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    value={formData.notes}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, notes: value }))
                    }
                    placeholder="Ajouter des notes (optionnel)"
                    multiline
                    numberOfLines={3}
                />
            </View>

            <View style={styles.formActions}>
                <Pressable
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={onCancel}
                >
                    <X size={20} color="#666666" />
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.formButton,
                        styles.submitButton,
                        (!formData.hours || !formData.siteId) &&
                        styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!formData.hours || !formData.siteId}
                >
                    <Save size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>
                        {initialData ? 'Enregistrer' : 'Ajouter'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearButton: { 
        marginLeft: 8 
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        marginBottom: 16,
    },
    datePickerText: {
        fontSize: 16,
        color: '#333333',
    },
    formRow: {
        marginBottom: 16,
    },
    formLabelContainer: {
        marginBottom: 8,
    },
    formLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666666',
        flex: 1,
        marginLeft: 4,
    },
    siteSelector: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    siteSelectorEmpty: {
        borderStyle: 'dashed',
        borderColor: '#999999',
    },
    selectedSiteContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    selectedSiteInfo: {
        flex: 1,
    },
    siteSelectorText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 2,
    },
    siteAddress: {
        fontSize: 12,
        color: '#666666',
    },
    siteSelectorPlaceholder: {
        fontSize: 16,
        color: '#999999',
        flex: 1,
    },
    selectorList: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginTop: 8,
    },
    siteOption: {
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    siteOptionActive: {
        backgroundColor: '#F0F9FF',
    },
    siteOptionContent: {
        flex: 1,
    },
    siteOptionText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 2,
    },
    siteOptionAddress: {
        fontSize: 12,
        color: '#666666',
    },
    siteOptionSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    formInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333333',
    },
    formTextArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 16,
    },
    formButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    submitButtonDisabled: {
        backgroundColor: '#CCE0FF',
    },
    cancelButtonText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '600',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
