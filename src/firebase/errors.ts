
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * Erro especializado para falhas de permissão no Firestore.
 * Carrega o contexto da operação para facilitar a depuração das Security Rules.
 */
export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore Security Rules denied the request.
Path: ${context.path}
Operation: ${context.operation}
${context.requestResourceData ? `Data: ${JSON.stringify(context.requestResourceData, null, 2)}` : ''}`;
    
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
