import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusVersionText = "Carregando...";
  let databaseStatusMaxConnectionsText = "Carregando...";
  let databaseStatusOpenedConnectionsText = "Carregando...";

  if (!isLoading && data) {
    databaseStatusVersionText = data.dependencies.database.version;
    databaseStatusMaxConnectionsText =
      data.dependencies.database.max_connections;
    databaseStatusOpenedConnectionsText =
      data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h2>Base de Dados</h2>
      <div>Versão: {databaseStatusVersionText}</div>
      <div>Conexões abertas: {databaseStatusOpenedConnectionsText}</div>
      <div>Limite de conexões: {databaseStatusMaxConnectionsText}</div>
    </>
  );
}
