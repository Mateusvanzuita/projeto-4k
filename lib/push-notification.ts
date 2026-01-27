// lib/push-notification.ts
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function registerPushNotification(alunoId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push não suportado neste navegador.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    // Solicita permissão
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // Se já houver inscrição, podemos usá-la ou criar nova
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });
    }

    // Envia para o seu backend salvar no banco de dados
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students/subscribe`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ subscription })
    });

    console.log('📲 Dispositivo registrado para Push com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar push:', error);
  }
}