// lib/push-notification.ts
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function registerPushNotification(alunoId?: string) {
  // Log no console para quem tem acesso ao desktop
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

    console.log("📤 [Push] Enviando assinatura para o backend:", JSON.stringify(subscription));

    // 5. Envio para o Backend (Produção ou Local)
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/students/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ subscription })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro no servidor: ${response.status}`);
    }

    const resData = await response.json();
    console.log("📥 [Push] Resposta do backend:", resData);

    // ✅ Alerta de sucesso para você ver no iPhone
    // alert("🚀 Dispositivo registrado com sucesso para notificações!");

  } catch (error: any) {
    console.error("❌ [Push] Erro no fluxo de registro:", error);
    
    // 🚀 LÓGICA DE DEBUG PARA IPHONE (Visual)
    // Se houver qualquer falha, o iPhone mostrará um alerta com o motivo real.
    alert(
      `❌ ERRO NO PUSH\n` +
      `Motivo: ${error.message}\n` +
      `URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}\n` +
      `VAPID: ${VAPID_PUBLIC_KEY ? "Carregada" : "Faltando"}`
    );
  }
}