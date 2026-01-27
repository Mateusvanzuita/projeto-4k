// lib/push-notification.ts
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function registerPushNotification(alunoId?: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') return;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      if (!VAPID_PUBLIC_KEY) throw new Error("VAPID_PUBLIC_KEY não configurada.");
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = localStorage.getItem('token');
    
    // 🚀 Limpeza de URL: Garante que o caminho final seja /api/students/subscribe
    const cleanApiUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const fullPath = `${cleanApiUrl}/api/students/subscribe`;

    if (!token) {
      throw new Error("AUSENTE: O App instalado não encontrou seu login. Por favor, faça Login dentro do aplicativo da Tela de Início.");
    }

    const response = await fetch(fullPath, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ subscription })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Status: ${response.status}`);
    }

    console.log("✅ Push registrado com sucesso!");

  } catch (error: any) {
    alert(
      `❌ ERRO NO PUSH\n\n` +
      `Motivo: ${error.message}\n` +
      `URL BASE: ${process.env.NEXT_PUBLIC_API_BASE_URL}`
    );
  }
}