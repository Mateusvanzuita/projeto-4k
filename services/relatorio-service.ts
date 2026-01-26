// src/services/relatorio-service.ts
import { DadosRelatorio, RelatorioFiltros } from "@/types/relatorio";
import { apiService } from "./api-service";
import { ApiResponse } from "@/types/api";

export const relatorioService = {
  getDadosRelatorio: async (filtros: RelatorioFiltros): Promise<DadosRelatorio> => {
    const response = await apiService.get<ApiResponse<DadosRelatorio>>("/api/relatorios", { params: filtros });
    return response.data;
  },

  exportarPDF: async (filtros: RelatorioFiltros): Promise<void> => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const params = new URLSearchParams();
      if (filtros.periodo) params.append("periodo", filtros.periodo);

      // Abre a URL correta do backend que processa o PDF
      window.open(`${baseUrl}/relatorios/export/pdf?${params.toString()}`, '_blank');
    },
};