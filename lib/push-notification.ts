// lib/push-notification.ts
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function registerPushNotification(alunoId?: string) {
  console.log("🔍 [Push] Iniciando processo de registro...");
  
  if (!('serviceWorker' in navigator)) {
    console.error("❌ [Push] Service Worker não suportado");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log("✅ [Push] Service Worker registrado:", registration.scope);

    const permission = await Notification.requestPermission();
    console.log("🔔 [Push] Permissão de notificação:", permission);

    if (permission !== 'granted') return;

    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log("📡 [Push] Gerando nova assinatura...");
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
    }

    console.log("📤 [Push] Enviando assinatura para o backend:", JSON.stringify(subscription));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ subscription })
    });

    const resData = await response.json();
    console.log("📥 [Push] Resposta do backend:", resData);

  } catch (error) {
    console.error("❌ [Push] Erro no fluxo de registro:", error);
  }
}