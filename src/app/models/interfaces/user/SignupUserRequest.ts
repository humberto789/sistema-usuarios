export interface SignupUserRequest {
  nome: string;
  email: string;
  senha: string;
  permissoes?: Array<{
    id: number;
    codigo: string;
  }>;
}
