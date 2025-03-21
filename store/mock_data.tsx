export const MOCK_WORKERS = [
    {
        id: 'w1',
        name: 'Alice Dupont',
        role: 'Chef de chantier',
        position: 'Électricienne',
        contact: '06.12.34.56.78',
        email: 'alice.dupont@example.com',
        address: "12 Rue de l'Industrie, 75010 Paris",
        joinDate: '2023-03-15',
        image:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=400',
        notes: 'Disponible en cas d’urgence',
    },
    {
        id: 'w2',
        name: 'Bob Martin',
        role: 'Technicien',
        position: 'Plombier',
        contact: '07.98.76.54.32',
        email: 'bob.martin@example.com',
        address: '34 Avenue de la République, 69002 Lyon',
        joinDate: '2022-11-01',
        image:
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=800&h=400',
        notes: 'Expert en maintenance',
    },
    {
        id: 'w3',
        name: 'Charlie Durand',
        role: 'Ouvrier polyvalent',
        position: 'Maçon',
        contact: '06.55.44.33.22',
        email: 'charlie.durand@example.com',
        address: '78 Boulevard Saint-Germain, 75006 Paris',
        joinDate: '2023-06-20',
        image:
            'https://images.unsplash.com/photo-1502767089025-6572583495b9?auto=format&fit=crop&q=80&w=800&h=400',
        notes: 'Disponible pour missions courts',
    },
];

export const MOCK_SITES = [
    {
        id: '1',
        name: 'Chantier Paris Centre',
        type: 'Chantier',
        address: '123 Rue de Rivoli, 75001 Paris',
        agencyId: 'societe1'
    },
    {
        id: '2',
        name: 'Bureau Lyon',
        type: 'Bureau',
        address: '45 Avenue Jean Jaurès, 69007 Lyon',
        agencyId: 'societe1'
    },
    {
        id: '3',
        name: 'Site Marseille Port',
        type: 'Site Industriel',
        address: '88 Quai du Port, 13002 Marseille',
        agencyId: 'societe1'
    },
];

// Note: Added workerId field to the timesheets.
export const MOCK_TIMESHEETS = [
    {
        id: '1',
        workerId: 'w1',
        date: '2025-03-19',
        siteId: '1',
        hours: 8,
        hoursSup: 1,
        notes: 'Installation des équipements électriques',
        status: 'En attente',
        panier: false,
        trajetId: '',
        transportId: '',
    },
    {
        id: '2',
        workerId: 'w2',
        date: '2025-03-18',
        siteId: '2',
        hours: 7.5,
        hoursSup: 0,
        notes: 'Réunion de coordination',
        status: 'En attente',
        panier: false,
        trajetId: '',
        transportId: '',
    },
    {
        id: '3',
        workerId: 'w1',
        date: '2025-03-17',
        siteId: '3',
        hours: 8.5,
        hoursSup: 2,
        notes: 'Maintenance préventive',
        status: 'Validé',
        panier: false,
        trajetId: '',
        transportId: '',
    },
];

export const MOCK_TRAJETS = Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    label: `Trajet ${i + 1}`,
}));

export const MOCK_TRANSPORTS = Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    label: `Transport ${i + 1}`,
}));

export const MOCK_MESSAGES = [
    {
        id: '1',
        sender: 'Marie Lambert',
        senderId: 'r1',
        message: 'Bonjour, voici les dernières informations.',
        timestamp: '11:00',
        status: 'read',
    },
    {
        id: '2',
        sender: 'Moi',
        senderId: 'w1',
        message: "Merci Marie, c'est bien noté.",
        timestamp: '11:05',
        status: 'read',
    },
];

export const REFERENT_INFO = {
    name: 'Marie Lambert',
    title: 'Chef de chantier',
    id: '1',
    avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=100&h=100',
};

export const CONTACT_INFO = {
    phone: '+1-555-123-4567',
    email: 'contact@organization.com',
};

// Define mock user data
export const MOCK_USERS = [
    { id: '1', username: 'admin', password: 'admin', role: 'admin', agencyId: '', validatorId: '' },
    {
        id: 'w1',
        username: 'test1',
        password: 'test',
        role: 'employee',
        agencyId: 'societe1',
        validatorId: ''
    },
    {
        id: '3',
        username: 'agence1',
        password: 'agence',
        role: 'agency',
        agencyId: 'societe1',
        validatorId: ''
    },
    {
        id: '4',
        username: 'valid1',
        password: 'valid',
        role: 'validator',
        agencyId: 'societe1',
        validatorId: ''
    },
    {
        id: '5',
        username: 'test2',
        password: 'test',
        role: 'employee',
        agencyId: 'societe2',
        validatorId: ''
    },
    {
        id: '6',
        username: 'agence2',
        password: 'agence',
        role: 'agency',
        agencyId: 'societe2',
        validatorId: ''
    },
    {
        id: '7',
        username: 'valid2',
        password: 'valid',
        role: 'validator',
        agencyId: 'societe2',
        validatorId: ''
    },
];

// MOCKED DATA – ajout de documents pour 2025 et 2024
export const MOCK_DOCUMENTS = [
    {
        id: '1',
        name: 'Rapport Mensuel - Février 2025.pdf',
        type: 'pdf',
        size: '2.7 MB',
        modified: '2025-02-20T09:00:00',
        preview:
            'https://images.unsplash.com/photo-1626445877884-999529b1c51a?fit=crop&w=400&h=250',
        workerId: 'w1'
    },
    {
        id: '2',
        name: 'Plan Stratégique 2025.docx',
        type: 'docx',
        size: '1.2 MB',
        modified: '2025-01-15T14:30:00',
        preview: '',
        workerId: 'w1'
    },
    {
        id: '3',
        name: 'Rapport Mensuel - Janvier 2024.pdf',
        type: 'pdf',
        size: '2.4 MB',
        modified: '2024-02-19T10:30:00',
        preview:
            'https://images.unsplash.com/photo-1626445877884-999529b1c51a?fit=crop&w=400&h=250',
        workerId: 'w1'
    },
    {
        id: '4',
        name: 'Planning Équipe Q1 2024.xlsx',
        type: 'excel',
        size: '1.8 MB',
        modified: '2024-02-18T15:45:00',
        preview: '',
        workerId: '3'
    },
];