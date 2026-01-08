export interface MdpData {
    pwd: string;
    dur: string;
}

export const DATASETS: MdpData[][] = [
    // Set 1: Original
    [
        { pwd: '123456', dur: 'Instant' },
        { pwd: 'password', dur: '1 minute' },
        { pwd: 'admin', dur: '1 heure' },
        { pwd: 'Azerty123', dur: '1 jour' },
        { pwd: 'M0tD3P@sse', dur: '1 mois' },
        { pwd: 'SuperSecret!', dur: '1 an' },
        { pwd: 'J@imeL3sP0mmes', dur: '10 ans' },
        { pwd: 'Ky7#9pL$2m', dur: '100 ans' },
        { pwd: 'CorrectHorseBatteryStaple', dur: 'Inviolable' }
    ],
    // Set 2: Variantes commmunes & phrases
    [
        { pwd: 'qwerty', dur: 'Instant' },
        { pwd: 'iloveyou', dur: '1 minute' },
        { pwd: 'princess', dur: '1 heure' },
        { pwd: 'Dragon123', dur: '1 jour' },
        { pwd: 'MonMotDePasse!', dur: '1 mois' },
        { pwd: 'Toujours+Fort99', dur: '1 an' },
        { pwd: 'UnePhraseTresLongueAvecDesEspaces', dur: '10 ans' },
        { pwd: 'X&y#9!mPkL$2Dz', dur: '100 ans' },
        { pwd: 'JeNeSuisPasUnRobotMaisUnHumain!', dur: 'Inviolable' }
    ],
    // Set 3: Complexes & Aléatoires
    [
        { pwd: '0000', dur: 'Instant' },
        { pwd: 'football', dur: '1 minute' },
        { pwd: 'liverpool', dur: '1 heure' },
        { pwd: 'Samantha1', dur: '1 jour' },
        { pwd: 'P@$$w0rd', dur: '1 mois' },
        { pwd: 'Th!sIsS3cur3', dur: '1 an' },
        { pwd: 'G0T#WinterIsComing', dur: '10 ans' },
        { pwd: '7h9#Kp$2mL9!xR', dur: '100 ans' },
        { pwd: 'VraimentImpossibleACraquerCelleLa', dur: 'Inviolable' }
    ]
];
