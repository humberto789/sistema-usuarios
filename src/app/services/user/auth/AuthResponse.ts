export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    pessoa: {
      id: number;
      nome: string;
    }
    permissoes: Array<{
      id: number;
      codigo: string;
    }>;
  }
}
