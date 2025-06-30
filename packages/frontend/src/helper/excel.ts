export function downloadExcel(response: any, fileName?: string) {
  // Get filename from content-disposition header or use default
  const contentDisposition = response.headers["content-disposition"];
  const filename = contentDisposition
    ? contentDisposition.split("filename=")[1].replace(/["]/g, "")
    : fileName || "download.xlsx";

  // Create blob from response data
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
