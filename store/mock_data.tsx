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
    agenceId: '1',
    siteIds: ['1'],
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
    agenceId: '1',
    siteIds: ['1'],
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
    agenceId: '1',
    siteIds: ['1'],
  },
];

export const MOCK_SITES = [
  {
    id: '1',
    name: 'Chantier Paris Centre',
    type: 'Chantier',
    address: '123 Rue de Rivoli, 75001 Paris',
    agencyId: 'societe1',
    notes: 'Prendre la A7',
  },
  {
    id: '2',
    name: 'Bureau Lyon',
    type: 'Bureau',
    address: '45 Avenue Jean Jaurès, 69007 Lyon',
    agencyId: 'societe1',
    notes: 'Prendre la A7',
  },
  {
    id: '3',
    name: 'Site Marseille Port',
    type: 'Site Industriel',
    address: '88 Quai du Port, 13002 Marseille',
    agencyId: 'societe1',
    notes: 'Prendre la A7',
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

export const REFERENT_INFO = {
  name: 'Marie Lambert',
  title: 'Chef de chantier',
  id: '1',
  avatar:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=100&h=100',
  email: '',
  phone: '',
  siteId: '',
  agenceId: '1',
};

// Define mock user data
export const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    agencyId: '',
    validatorId: '',
    siteId: '',
    agenceId: '1',
  },
  {
    id: 'w1',
    username: 'test',
    password: 'test',
    role: 'employee',
    agencyId: 'societe1',
    validatorId: '',
    siteId: '',
    agenceId: '1',
  },
  {
    id: 'v1',
    username: 'valid',
    password: 'valid',
    role: 'validator',
    agencyId: 'societe1',
    validatorId: '',
    siteId: '',
    agenceId: '1',
  },
];

export const MOCK_AGENCIES = [{
  id: 'societe1',
  name: 'Société 1',
  adresse: '',
  phone: '0485652314',
  email: 'toto@mail.com',
}];

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
    workerId: 'w1',
  },
  {
    id: '2',
    name: 'Plan Stratégique 2025.docx',
    type: 'docx',
    size: '1.2 MB',
    modified: '2025-01-15T14:30:00',
    preview: '',
    workerId: 'w1',
  },
  {
    id: '3',
    name: 'Rapport Mensuel - Janvier 2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    modified: '2024-02-19T10:30:00',
    preview:
      'https://images.unsplash.com/photo-1626445877884-999529b1c51a?fit=crop&w=400&h=250',
    workerId: 'w1',
  },
  {
    id: '4',
    name: 'Planning Équipe Q1 2024.xlsx',
    type: 'excel',
    size: '1.8 MB',
    modified: '2024-02-18T15:45:00',
    preview: '',
    workerId: '3',
  },
];
