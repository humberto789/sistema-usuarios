export interface EditUserRequest {
  id: number;
  nome: string;
  email: string;
  permissoes?: Array<{
    id: number;
    codigo: string;
  }>;
}
