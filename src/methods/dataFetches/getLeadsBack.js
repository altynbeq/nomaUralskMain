export async function getLeadsBack() {
  const url = "http://localhost:8888/api/users/67042877bf2a6d9b31acfe1e";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}
