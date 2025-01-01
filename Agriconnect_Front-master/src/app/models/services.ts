export interface Service {
    id: number;
    nomService: string;
    description: string;
  }
  
  export interface Prestataire {
    id: number;
    service: Service;
    utilisateur: {
      id: number;
      username: string;
      email: string;
    };
  }

  