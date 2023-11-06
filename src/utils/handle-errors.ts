interface PrismaError {
  code: string;
  meta: {
    database_host?: string;
    time?: number;
    column_name?: string;
    details?: string;
    constraint?: string;
    field_name?: string;
    field_value?: string;
    model_name?: string;
    database_error?: string;
    query_parsing_error?: string;
    query_position?: string;
    query_validation_error?: string;
    path?: string;
    argument_name?: string;
    object_name?: string;
    relation_name?: string;
    model_a_name?: string;
    model_b_name?: string;
    parent_name?: string;
    child_name?: string;
    table?: string;
    column?: string;
    message?: string;
    code?: string;
    database_error_code?: string;
    database_error_message?: string;
  };
}

type ErrorMessage = {
  [code: string]: string
}

const handlePrismaErrors = (err: PrismaError) : string => {
  if (!err.code) return String(err);
  const errors: ErrorMessage = {
    'P1001': `Não foi possível encontrar o bando de dados em: ${err.meta.database_host}. Verifique sua conexão.`,
    'P1008': `Tempo esgotado ${err.meta.time}`,
    'P2000': `O valor informado para a coluna é muito grande. ${err.meta.column_name}`,
    'P2001': `A condição buscada não foi encontrada.`,
    'P2002': `Violação de restrição. ${err.meta.constraint}`,
    'P2003': `Violação de foreign Key: ${err.meta.field_name})`,
    'P2004': `Violação de restrição no banco de dados. ${err.meta.database_error}`,
    'P2005': `O valor ${err.meta.field_value} salvo no banco de dados para o campo ${err.meta.field_name} é de tipo inválido.`,
    'P2006': `O valor fornecido ${err.meta.field_value} para ${err.meta.model_name} o campo ${err.meta.field_name} não é valido.`,
    'P2007': `Falha na validação: ${err.meta.database_error}`,
    'P2008': `Falha ao converter a query ${err.meta.query_parsing_error} em ${err.meta.query_position}.`,
    'P2009': `Falha para validar query ${err.meta.query_validation_error} em ${err.meta.query_position}.`,
    'P2010': `Comando SQL falhou. Código: ${err.meta.code}. Mensagem: ${err.meta.message}`,
    'P2011': `Falha constraint NULL ${err.meta.constraint}`,
    'P2012': `Faltando um valor requerido em: ${err.meta.path}`,
    'P2013': `Faltando um elemento obrigatório ${err.meta.argument_name} para o campo ${err.meta.field_name} em ${err.meta.object_name}`,
    'P2014': `A alteração que você está tentando realizar viola o relacionamento ${err.meta.relation_name} entre ${err.meta.model_a_name} e ${err.meta.model_b_name}`,
    'P2015': `O registro não foi encontrado. ${err.meta.details}`,
    'P2016': `Erro na interpretação da Query. ${err.meta.details}`,
    'P2017': `O registro com relacionamento ${err.meta.relation_name} entre ${err.meta.parent_name} e ${err.meta.child_name} modelos não conectados.`,
    'P2018': `Os registros conectados não foram encontrados. ${err.meta.details}`,
    'P2019': `Erro no Input. ${err.meta.details}`,
    'P2020': `Valor fora do tamanho para o tipo informado. ${err.meta.details}`,
    'P2021': `A tabela ${err.meta.table} não existe no banco de dados.`,
    'P2022': `A coluna ${err.meta.column} não existe no banco de dados.`,
    'P2023': `Informação inconsistente para coluna ${err.meta.message}`,
    'P2024': `Tempo esgotado de conexão.`,
    'P2025': "Registro não encontrado para ser apagado.",
  };
  return String(errors[err.code] || err)
}

export default {
  handlePrismaErrors,
}