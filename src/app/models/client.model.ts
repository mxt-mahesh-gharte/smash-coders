export interface Client {
    id: string;
    name: string;
    logo: string;
    tagline: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    welcomeMessage: string;
    industry: string;
}

export const HOTEL_CLIENTS: Client[] = [
    {
        id: 'sunshine-hotels',
        name: 'Sunshine Hotels',
        logo: '☀️',
        tagline: 'Brighten Your Stay',
        primaryColor: '#FF6B35',
        backgroundColor: '#FFF8E1',
        textColor: '#FF6B35',
        welcomeMessage: 'Welcome back! Ready to brighten your day with Sunshine Hotels?',
        industry: 'Luxury Hotels'
    },
    {
        id: 'mountain-view',
        name: 'Mountain View Resorts',
        logo: '🏔️',
        tagline: 'Reach New Heights',
        primaryColor: '#2E7D32',
        backgroundColor: '#E8F5E8',
        textColor: '#2E7D32',
        welcomeMessage: 'Welcome to Mountain View! Experience nature at its finest.',
        industry: 'Mountain Resorts'
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze Villas',
        logo: '🌊',
        tagline: 'Where Ocean Meets Luxury',
        primaryColor: '#0277BD',
        backgroundColor: '#E3F2FD',
        textColor: '#0277BD',
        welcomeMessage: 'Welcome to Ocean Breeze! Dive into luxury by the sea.',
        industry: 'Beach Resorts'
    },
    {
        id: 'urban-elite',
        name: 'Urban Elite Suites',
        logo: '🏙️',
        tagline: 'City Living Redefined',
        primaryColor: '#424242',
        backgroundColor: '#FAFAFA',
        textColor: '#424242',
        welcomeMessage: 'Welcome to Urban Elite! Sophistication in the heart of the city.',
        industry: 'Business Hotels'
    },
    {
        id: 'royal-palace',
        name: 'Royal Palace Hotels',
        logo: '👑',
        tagline: 'Luxury Beyond Imagination',
        primaryColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
        textColor: '#7B1FA2',
        welcomeMessage: 'Welcome to Royal Palace! Experience true luxury and elegance.',
        industry: 'Luxury Palaces'
    },
    {
        id: 'adventure-lodge',
        name: 'Adventure Base Lodges',
        logo: '🏕️',
        tagline: 'Your Adventure Starts Here',
        primaryColor: '#D84315',
        backgroundColor: '#FBE9E7',
        textColor: '#D84315',
        welcomeMessage: 'Welcome to Adventure Base! Ready for your next expedition?',
        industry: 'Adventure Tourism'
    },
    {
        id: 'zen-wellness',
        name: 'Zen Wellness Retreats',
        logo: '🧘',
        tagline: 'Find Your Inner Peace',
        primaryColor: '#00695C',
        backgroundColor: '#E0F2F1',
        textColor: '#00695C',
        welcomeMessage: 'Welcome to Zen Wellness! Begin your journey to inner peace.',
        industry: 'Wellness & Spa'
    },
    {
        id: 'family-fun',
        name: 'Happy Family Resorts',
        logo: '👨‍👩‍👧‍👦',
        tagline: 'Creating Family Memories',
        primaryColor: '#E65100',
        backgroundColor: '#FFF3E0',
        textColor: '#E65100',
        welcomeMessage: 'Welcome to Happy Family Resorts! Making memories together.',
        industry: 'Family Hotels'
    }
];
