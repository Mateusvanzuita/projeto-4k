// public/sw.js
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Você tem uma nova atualização!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/aluno/dashboard' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '4K Team', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});