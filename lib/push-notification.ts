// lib/push-notification.ts
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function registerPushNotification(alunoId?: string) {
  // Log no console para debug em desktop
  console.log("🔍 [Push] Iniciando processo de registro...");
  
  // 1. Verificação de suporte básico
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error("❌ [Push] Push não suportado");
    return;
  }

  try {
    // 2. Registro do Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log("✅ [Push] Service Worker registrado:", registration.scope);

    // 3. Solicitação de Permissão
    const permission = await Notification.requestPermission();
    console.log("🔔 [Push] Permissão de notificação:", permission);

    if (permission !== 'granted') {
      console.warn("⚠️ [Push] Permissão negada pelo usuário.");
      return;
    }

    // 4. Obter ou Criar Assinatura (Subscription)
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log("📡 [Push] Gerando nova assinatura...");
      
      if (!VAPID_PUBLIC_KEY) {
        throw new Error("Chave VAPID Pública não encontrada no ambiente (.env)");
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });
    }

    // 5. Envio para o Backend com Diagnóstico Detalhado
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = localStorage.getItem('token');
    
    // Limpa possíveis barras duplicadas na URL
    const cleanApiUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const fullPath = `${cleanApiUrl}/api/students/subscribe`;

    console.log("📤 [Push] Enviando assinatura para:", fullPath);

    // Validação local do token antes do fetch para evitar o 403 silencioso
    if (!token) {
      throw new Error("AUSENTE (Usuário não logado ou storage limpo pelo iOS)");
    }

    const response = await fetch(fullPath, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ subscription })
    });

    // Se a resposta não for OK (ex: 403), capturamos os detalhes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      const errorMessage = errorData.error || errorData.message || "Erro desconhecido";
      const tokenStatus = `Presente (Início: ${token.substring(0, 8)}...)`;
      
      throw new Error(
        `Status: ${response.status}\n` +
        `Mensagem: ${errorMessage}\n` +
        `Token: ${tokenStatus}\n` +
        `Rota: /api/students/subscribe`
      );
    }

    const resData = await response.json();
    console.log("📥 [Push] Resposta do backend:", resData);
    
    // alert("✅ Dispositivo registrado com sucesso!");

  } catch (error: any) {
    console.error("❌ [Push] Erro no fluxo de registro:", error);
    
    // Alerta detalhado para depuração no iPhone (Reflete o seu log do print 5.jpeg)
    alert(
      `❌ ERRO NO PUSH\n\n` +
      `Motivo: ${error.message}\n` +
      `URL BASE: ${process.env.NEXT_PUBLIC_API_BASE_URL}\n` +
      `VAPID: ${VAPID_PUBLIC_KEY ? "Carregada" : "Faltando"}`
    );
  }
}